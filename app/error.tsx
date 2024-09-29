"use client
import { Button } from '@/components/ui/button'
import { Image } from '@radix-ui/react-avatar'
import Link from 'next/link'
import React from 'react'

const Error = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4 '>
      <Image width={300} height={300 } alt='Error' src='/reading.png'  />
      <h2 className='text-2xl font-semibold'>Some went wrong</h2>
      <Button asChild>
        <Link href={'/documents'}>
            Go Back
        </Link>
      </Button>

    </div>
  )
}

export default Error
"