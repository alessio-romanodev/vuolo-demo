
"use client";

import Image from "next/image";
import Container from "../container";
import { ThemeToggle } from "../theme-toggle";

export default function TopNav({ title }: { title: string }) {
  return (
    <Container className="flex h-16 items-center justify-between border-b border-border px-4">

      <div className="flex items-center gap-3">
        {/* Logo con colori invertiti */}
        <Image
          src="/logovuolo.png"
          alt="Vuolo Taddeo Logo"
          width={200}
          height={60}
          className="dark:invert"
          priority
        />
      </div>
      <ThemeToggle />
    </Container>
  );
}

