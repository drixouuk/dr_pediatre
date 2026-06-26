"use client";

import { Button } from "@/components/ui/button";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function RdvCtaButton({ className, children }: Props) {
  return (
    <Button
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-rdv"));
      }}
    >
      {children}
    </Button>
  );
}
