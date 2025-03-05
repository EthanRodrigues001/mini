import Navbar from "@/components/Navbar";
import type React from "react";
// import { Nav } from "@/components/nav";
// import { Footer } from "@/components/footer";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      {children}
    </>
  );
}
