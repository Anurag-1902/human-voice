import { Link } from "react-router-dom";
import { ArrowLeft, Feather } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="hidden h-5 w-px bg-border sm:block" />
          <Logo />
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
            <Feather className="h-3.5 w-3.5" />
            Humanizer
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
