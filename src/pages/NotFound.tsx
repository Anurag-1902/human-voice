import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="grain relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      <div className="ambient-glow pointer-events-none absolute inset-x-0 top-0 h-[420px]" />
      <div className="relative">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <p className="font-display text-[7rem] leading-none text-gradient-primary sm:text-[9rem]">404</p>
        <h1 className="mt-2 font-display text-3xl text-foreground">This page lost its voice</h1>
        <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
          The page you're looking for doesn't exist or has moved. Let's get you back to writing.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="hero" size="lg">
            <Link to="/">
              <Home />
              Back home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/app">
              Open the humanizer
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
