"use client"

import { useScrollTop } from '@/hooks/useScrollTop'
import { cn } from '@/lib/utils';
import React from 'react'
import Logo from './Logo';
import {ModeToggle} from '@/components/mode-toggle';
import { useConvexAuth } from 'convex/react';
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/Spinner';
import Link from 'next/link';

const Navbar = () => {
  const scrolled = useScrollTop();
  const {isAuthenticated, isLoading} = useConvexAuth();
  return (
    <div className={cn("z-50 bg-background dark:bg-[#1f1f1f] fixed w-full flex items-center p-6", scrolled && "border-b shadow-sm")}>
      <Logo />  
      <div className='md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2'>
        {isLoading && (
          <Spinner />
        )}
        {!isAuthenticated && !isLoading && (
          <div>
            <SignInButton mode="modal">
              <Button variant={'ghost'} size={'sm'}>
                Login
              </Button>
            </SignInButton>
            <SignUpButton mode='modal'>
              <Button size={'sm'}>
                Get Notion Free
              </Button>
            </SignUpButton>
          </div>
        )}
        {
          isAuthenticated && !isLoading && (
            <>
            <Button variant={'ghost'} size={'sm'}>
              <Link href={'/documents'}>
                Enter Notion
              </Link>

            </Button>
            <UserButton afterSignOutUrl='/' />
            </>

          )
        }
        <ModeToggle />
      </div>
    </div>
  )
}

export default Navbar
