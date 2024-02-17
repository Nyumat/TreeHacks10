"use client";

import { Button } from "@/components/ui/button";
import { useConvexAuth } from 'convex/react';
import { ThreeDots } from 'react-loader-spinner';
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { ModeToggle } from './ModeToggle'


const Nav = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  function SignInAndSignUpButtons() {
    return (
      <div className="flex gap-4">
        {/* If the user is not authenticated, and is loading (i.e. we don't know if they are authenticated or not), show a loading spinner */}
        {isLoading && (
            <ThreeDots
              visible={true}
              height="40"
              width="40"
              color="var(--color-foreground)"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
        )}
        {/* If the user is not authenticated, and is not loading, show the sign in and sign up buttons */}
        {
          !isAuthenticated && !isLoading && (
            <>
              <SignInButton mode="modal" afterSignInUrl='/loggedIn'> 
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal" afterSignUpUrl="/loggedIn"> 
                <Button>Sign Up</Button>
              </SignUpButton>
            </>
          )
        }
      </div>
    );
  }

  return (
    <>
        <nav className="px-4 py-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                  <SignInAndSignUpButtons />
                  <ModeToggle />
              </div>
            </div>
        </nav>       
    </>
  )
}

export default Nav