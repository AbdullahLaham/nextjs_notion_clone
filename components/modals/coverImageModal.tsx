"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader,  } from '@/components/ui/dialog'
import { useCoverImage } from '@/hooks/useCoverImage';
import { useEdgeStore } from '@/lib/edgestore';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';
import { SingleImageDropzone } from '../ImageDropzone';

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.documents.update);
  const [file, setFile] = useState<File>();
  const [isSubmiting, setIsSubmiting] = useState(false)
    const coverImage = useCoverImage();
    const {edgestore} = useEdgeStore();

    const onChange = async (file?: File) => {
      if (file) {
        setIsSubmiting(true);
        setFile(file);
        
        const res = await edgestore.publicFiles.upload({
          file,
          options: {
            replaceTargetUrl: coverImage?.url,
          }
        })
        
        await update ({
          id: params.documentId as Id<"document">,
          coverImage: res.url,
        })
        onClose()
      }
      

    }
    const onClose = () => {
      setFile(undefined);
      setIsSubmiting(false);
      coverImage.onClose();
    }
    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader className='border-b pb-3'>
            <h2 className='text-lg font-medium text-center'>Cover Image</h2>
        </DialogHeader>
        <SingleImageDropzone className='w-full outline-none' disabled={isSubmiting} value={file} onChange={onChange} />

      </DialogContent>
    </Dialog>
    )

}