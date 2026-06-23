import { Scissors } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TONE_LABELS, type TonePreset } from "@/hooks/useHumanizer";

interface ControlsBarProps {
  tone: TonePreset;
  onToneChange: (tone: TonePreset) => void;
  condense: boolean;
  onCondenseChange: (value: boolean) => void;
  disabled?: boolean;
}

export function ControlsBar({ tone, onToneChange, condense, onCondenseChange, disabled }: ControlsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-card sm:gap-5">
      <div className="flex items-center gap-2.5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tone</Label>
        <Select value={tone} onValueChange={(v) => onToneChange(v as TonePreset)} disabled={disabled}>
          <SelectTrigger className="h-9 w-[170px] rounded-xl bg-background text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(TONE_LABELS) as TonePreset[]).map((key) => (
              <SelectItem key={key} value={key}>
                <span className="flex items-center gap-2">
                  <span>{TONE_LABELS[key].emoji}</span>
                  <span>{TONE_LABELS[key].label}</span>
                  <span className="hidden text-xs text-muted-foreground sm:inline">· {TONE_LABELS[key].hint}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden h-6 w-px bg-border sm:block" />

      <div className="flex items-center gap-2.5">
        <Switch id="condense" checked={condense} onCheckedChange={onCondenseChange} disabled={disabled} />
        <Label htmlFor="condense" className="flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground">
          <Scissors className="h-3.5 w-3.5" />
          Condense to ~250 words
        </Label>
      </div>
    </div>
  );
}
