import type React from "react";
// import { Nav } from "@/components/nav";
// import { Footer } from "@/components/footer";

export default function NavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Nav /> */}
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
