"use client"

import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { ImageIcon, X } from 'lucide-react'
import { useCoverImage } from '@/hooks/useCoverImage'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useParams } from 'next/navigation'
import { Id } from '@/convex/_generated/dataModel'
import { useEdgeStore } from '@/lib/edgestore'
import { Skeleton } from './ui/skeleton'
interface CoverProps {
    url?: string,
    preview?: boolean,
}
const Cover = ({url, preview}: CoverProps) => {
    const coverImage = useCoverImage();
    const params = useParams();
    const removeCoverImage = useMutation(api.documents.removeCoverImage);
    const {edgestore} = useEdgeStore();

    const onRemove = async (url: string) => {
        removeCoverImage({
            id: params.documentId as Id<"document">
        });
        await edgestore.publicFiles.delete({
            url,
        })
    }

  return (
    <div className={cn('h-[35vh] relative w-full group', !url && "h-[12vh]", url && 'bg-muted')}>
        {
            !!url && (
                <Image fill className='w-full h-full object-cover' src={url || ""} alt='cover image'   />
            )
        }
        {
            url && !preview && (
                <div className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2 ' >
                    <Button onClick={() => coverImage.onReplace(url)} className='text-muted-foreground text-xs ' variant={'outline'} size={'sm'}>
                        <ImageIcon className='h-4 w-4 mr-2' />
                        Change Cover
                    </Button>
                    <Button onClick={() => onRemove(url)} className='text-muted-foreground text-xs ' variant={'outline'} size={'sm'}>
                        <X className='h-4 w-4 mr-2' />
                        Delete Cover
                    </Button>
                </div>
            )
        }
      
    </div>
  )
}

export default Cover

Cover.Skeleton = function CoverSkeleton() {
    return (
        <Skeleton className='w-full h-[12vh]' />
    )
    
}