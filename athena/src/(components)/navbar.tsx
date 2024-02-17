"use client";
/**
 * https://v0.dev/t/qjSdwObcFDg (we love v0!)
 */
import { Button } from "@/(components)//ui/button";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { Pyramid } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";

export function Navbar() {
  const user = useAuth();
  return (
    <header className="flex items-center h-16 px-4 border-b gap-4 w-full md:px-6">
      <Link
        className="flex items-center gap-2 text-lg lg:text-2xl font-semibold"
        href="/"
        title="Home"
      >
        <Pyramid className="size-5 lg:size-7 text-purple-600 dark:text-purple-600" />
        Athena
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />
        {user.isSignedIn ? (
          <UserButton />
        ) : (
          <>
            <SignInButton afterSignInUrl="/home" mode="modal">
              <Button size="sm" variant="outline">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton afterSignUpUrl="/home" mode="modal">
              <Button size="sm">Sign up</Button>
            </SignUpButton>
          </>
        )}
      </div>
    </header>
  );
}
