import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import handler from "../../api/humanize";

// Minimal fake of Vercel's req/res so we can call the handler directly.
function makeRes() {
  const res: any = {};
  res.statusCode = 200;
  res.body = undefined;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: unknown) => {
    res.body = payload;
    return res;
  };
  return res;
}

function geminiReply(text: string) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ choices: [{ message: { content: text } }] }),
    text: async () => "",
  };
}

describe("api/humanize handler", () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = "test-key";
  });
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.GEMINI_API_KEY;
  });

  it("rejects non-POST requests", async () => {
    const res = makeRes();
    await handler({ method: "GET", body: {} } as any, res);
    expect(res.statusCode).toBe(405);
  });

  it("returns 400 when no text is provided", async () => {
    const res = makeRes();
    await handler({ method: "POST", body: {} } as any, res);
    expect(res.statusCode).toBe(400);
  });

  it("returns 500 when the API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;
    const res = makeRes();
    await handler({ method: "POST", body: { text: "hello world" } } as any, res);
    expect(res.statusCode).toBe(500);
  });

  it("humanizes short text in a single pass and returns { result }", async () => {
    const fetchMock = vi.fn().mockResolvedValue(geminiReply("a friendly human rewrite"));
    vi.stubGlobal("fetch", fetchMock);

    const res = makeRes();
    await handler({ method: "POST", body: { text: "This is a short test.", tone: "casual" } } as any, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ result: "a friendly human rewrite" });
    // short text (< 80 words) → only the first pass runs
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("generativelanguage.googleapis.com");
  });

  it("runs a second pass for longer text", async () => {
    const longText = Array.from({ length: 120 }, (_, i) => `word${i}`).join(" ");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(geminiReply(longText)) // first pass returns >80 words
      .mockResolvedValueOnce(geminiReply("polished final text"));
    vi.stubGlobal("fetch", fetchMock);

    const res = makeRes();
    await handler({ method: "POST", body: { text: longText, tone: "professional" } } as any, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ result: "polished final text" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("surfaces a friendly error on rate limits", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: async () => ({}),
      text: async () => "rate limited",
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = makeRes();
    await handler({ method: "POST", body: { text: "hello there friend" } } as any, res);

    expect(res.statusCode).toBe(429);
    expect(String(res.body.error)).toMatch(/rate limit/i);
  });
});
