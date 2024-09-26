"use client"


import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { MenuIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import Title from './Title'
import Banner from './Banner'
import Menu from './Menu'
interface NavbarProps {
  isCollapsed: boolean,
  onResetWidth: () => void,
}
const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const { documentId } = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: documentId as Id<"document">
  });
  if (document == undefined) {
    return (
      <nav className='bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center justify-between gap-x-4'>
        <Title.Skeleton />
        <div className='flex items-center gap-x-2'>
          <Menu.Skeleton />

        </div>
      </nav>

    )
  }
  if (document == null)
    return null


  return (
    <div>
      <div className='bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4'>
        {
          isCollapsed && (
            <MenuIcon role='button' onClick={onResetWidth} className='h-6 w-6 text-muted-foreground' />
          )
        }
        <div className='flex items-center justify-between w-full'>
           <Title initialData={document} />
          <div className='flex items-center gap-x-2' >

            {/* <Menu documentId={document._id} /> */}

          </div> 

        </div>

      </div>
      {document?.isArchived && (
        <Banner documentId={document._id} />
      )}
    </div>
  )
}

export default Navbar
