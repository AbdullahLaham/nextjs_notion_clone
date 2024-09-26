"use client"

import Image from 'next/image'
import React from 'react'
import { useUser } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api';
import {toast} from 'sonner';
const DocumentsPage = () => {
  const {user} = useUser();
  const create = useMutation(api.documents.create);
  const onCreate = () => {

    const promise = create({ title: "untitled" });
    toast.promise(promise, {
      loading: "create a new note...",
      success: "New note created!",
      error: "Failed to create a note."

    })
  }
  
  return (
    <div className='flex flex-col items-center justify-center space-y-4 h-full'>
      <Image src={'/documents.png'} alt='Empty page' width={200} height={200} />
      {/* dark image  */}
      <h2 className='text-lg font-medium'>Welcome to {user?.firstName}&apos;s Notion </h2>
      <Button onClick={onCreate}>
        <PlusCircle className='h-4 w-4 mr-2' /> create a note
      </Button>
    </div>
  )
}

export default DocumentsPage ;
