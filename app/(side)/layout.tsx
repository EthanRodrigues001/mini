import type React from "react";
// import { Nav } from "@/components/nav";
// import { Footer } from "@/components/footer";
// import { Sidebar } from "@/components/sidebar";

export default function SideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <Nav /> */}
      <div className="flex flex-grow">
        {/* <Sidebar /> */}
        <main className="flex-grow p-6">{children}</main>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
