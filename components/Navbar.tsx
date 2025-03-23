"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Menu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./Theme-Toggle";
import { useUser } from "@/contexts/UserContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSheet = () => setIsOpen(!isOpen);
  const { user, logoutUser } = useUser();

  const handleSignOut = async () => {
    await logoutUser();
  };

  const NavLinks = () => (
    <>
      <li className="text-primary font-medium">
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/events">Events</Link>
      </li>
      <li>
        <Link href="#pricing">Pricing</Link>
      </li>
      <li>
        <Link href="#faqs">FAQs</Link>
      </li>
      <li>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="cursor-pointer">Pages</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {landings.map((page) => (
              <DropdownMenuItem key={page.id}>
                <Link href={page.route}>{page.title}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </>
  );

  // Determine dashboard link and text based on user role
  const getDashboardLink = () => {
    if (!user) return "/dashboard";

    if (user.role === "organizer") {
      return "/dashboard";
    } else if (user.role === "student") {
      return "/my-events";
    } else {
      return "/dashboard";
    }
  };

  const getDashboardText = () => {
    if (!user) return "Dashboard";

    if (user.role === "organizer") {
      return "Dashboard";
    } else if (user.role === "student") {
      return "My Events";
    } else {
      return "Dashboard";
    }
  };

  return (
    <Card className="container bg-background/80 backdrop-blur-sm py-3 px-4 border-0 flex items-center justify-between gap-6 rounded-none">
      <Calendar className="text-primary cursor-pointer" />

      <ul className="hidden md:flex items-center gap-10 text-foreground">
        <NavLinks />
      </ul>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Link href={getDashboardLink()}>
              <Button variant="secondary" className="hidden md:block px-2">
                {getDashboardText()}
              </Button>
            </Link>

            <Button className="hidden md:block px-2" onClick={handleSignOut}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button variant="secondary" className="hidden md:block px-2">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="hidden md:block ml-2 mr-2 px-2">
                Sign Up
              </Button>
            </Link>
          </>
        )}

        <div className="flex md:hidden mr-2 items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5 rotate-0 scale-100" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4">
                <ul className="space-y-4">
                  <NavLinks />
                </ul>
                {user ? (
                  user.role === "student" ? (
                    <>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          handleSignOut();
                          toggleSheet();
                        }}
                      >
                        Logout
                      </Button>
                      <Link href="/my-events">
                        <Button className="w-full" onClick={toggleSheet}>
                          My Events
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          handleSignOut();
                          toggleSheet();
                        }}
                      >
                        Logout
                      </Button>
                      <Link href="/dashboard">
                        <Button className="w-full" onClick={toggleSheet}>
                          Dashboard
                        </Button>
                      </Link>
                    </>
                  )
                ) : (
                  <>
                    <Link href="/sign-in">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={toggleSheet}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="w-full" onClick={toggleSheet}>
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <ModeToggle />
      </div>
    </Card>
  );
};

const landings = [
  {
    id: nanoid(),
    title: "Landing 01",
    route: "/project-management",
  },
  {
    id: nanoid(),
    title: "Landing 02",
    route: "/crm-landing",
  },
  {
    id: nanoid(),
    title: "Landing 03",
    route: "/ai-content-landing",
  },
  {
    id: nanoid(),
    title: "Landing 04",
    route: "/new-intro-landing",
  },
  {
    id: nanoid(),
    title: "Landing 05",
    route: "/about-us-landing",
  },
  {
    id: nanoid(),
    title: "Landing 06",
    route: "/contact-us-landing",
  },
  {
    id: nanoid(),
    title: "Landing 07",
    route: "/faqs-landing",
  },
  {
    id: nanoid(),
    title: "Landing 08",
    route: "/pricing-landing",
  },
  {
    id: nanoid(),
    title: "Landing 09",
    route: "/career-landing",
  },
];

export default Navbar;
