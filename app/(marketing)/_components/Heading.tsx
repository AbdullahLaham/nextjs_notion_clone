"use client"
import { useConvexAuth } from 'convex/react';
import { Button } from '@/components/ui/button';
import {ArrowRight} from 'lucide-react'
import React from 'react'
import { Spinner } from '@/components/Spinner';
import Link from 'next/link';
import { SignInButton } from '@clerk/clerk-react';

const Heading = () => {
  const {isAuthenticated, isLoading} = useConvexAuth();
  return (
    <div className='max-w-3xl space-y-4'>
        <h1 className='text-3xl sm:text-4xl md:text-6xl font-bold'>
            Your Ideas, documents, & Plans, Unified, Welcome <span className='underline'>Notion</span> 
        </h1>
        <h3 className='text-base sm:text-xl md:text-2xl font-semibold  '>
          Notion is the connected workspace where <br /> better, faster work happens
        </h3>
        {
          isLoading && (
            <div className='flex items-center justify-center w-full'>
              <Spinner size={'lg'} />
            </div>
            
          )
        }
        {
          isAuthenticated && !isLoading && (
            <Button asChild>
              <Link href={'/documents'}>
                Enter Notion
                <ArrowRight className='w-4 h-4 ml-2'/>
              </Link>
               
          </Button>
          )
        }
        {!isAuthenticated && !isLoading && (
          <SignInButton mode='modal' >
            <Button>
              Get Notion Free
              <ArrowRight className='w-4 h-4 ml-2'/>
            </Button>
          </SignInButton>
        )}

        
      
    </div>
  )
}

export default Heading
