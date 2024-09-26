"use client"

import Cover from '@/components/Cover'
import Editor from '@/components/Editor'
import Toolbar from '@/components/Toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation, useQuery } from 'convex/react'
import { useParams } from 'next/navigation';
import { useEdgeStore } from '@/lib/edgestore'
import React from 'react'
interface DocumentIdPageProps {
  params: {
    documentId: Id<"document">
  }
}
const DocumentIdPage = ({params}: DocumentIdPageProps) => {
    const {documentId} = useParams();
    const document = useQuery(api.documents.getById, {
      documentId: documentId as Id<"document">
    });
    const update = useMutation(api.documents.update);
    const onChange = async (content: string) => {
      update ({
        id: params.documentId,
        content
      })
    }
    const {edgestore} = useEdgeStore();

    const handleUpload = async (file: File) => {
      const response = await edgestore.publicFiles.upload({
        file
      });
      return response.url;


    }

    if (document == undefined) {
      return (
        <div>
          <Cover.Skeleton />
          <div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
            <div className='space-y-4 pl-8 pt-4'>
              <Skeleton className='h-14 w-[50%]' />
              <Skeleton className='h-14 w-[50%]' />
              <Skeleton className='h-14 w-[50%]' />
              <Skeleton className='h-14 w-[50%]' />

            </div>

          </div>
        </div>
      )
    }

    if (document == null) {
      return (
        <div>Not found.</div>
      )
    }

  return (
    <div className='pb-40 '>
      <Cover url={document?.coverImage}  />
      <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  )
}

export default DocumentIdPage;
