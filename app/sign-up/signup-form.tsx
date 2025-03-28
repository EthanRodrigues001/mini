"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/actions/auth";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { refreshUser } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,265}$/; // ✅ Requires letters and numbers

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ characters and include letters & numbers."
      );
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    const result = await signUp(formData);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success && result.user) {
      await refreshUser();
      router.push(result.redirect);
    } else {
      toast.error("Something went wrong");
    }
  };

  //   const handleGoogleSignUp = async () => {
  //     try {
  //       const redirectUrl = await signIn_google();
  //       console.log(redirectUrl);
  //       refreshUser();
  //       router.push("/getting-started"); // Redirect to the getting started page
  //     } catch {
  //       toast.error("Failed to initiate Google sign-in");
  //     }
  //   };

  //   const handleGoogleSignIn = async () => {
  //     try {
  //       const redirectUrl = await signIn_google();
  //       console.log(redirectUrl);
  //       refreshUser();
  //       router.push(`/getting-started`); // Redirect to the getting started page
  //     } catch {
  //       toast.error("Failed to initiate Google sign-in");
  //     }
  //   };

  return (
    <form className={cn("flex flex-col gap-6")} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            placeholder="m@example.com"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
        {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </Button> */}
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/sign-in" className="underline underline-offset-4">
          Sign In
        </a>
      </div>
    </form>
  );
}
