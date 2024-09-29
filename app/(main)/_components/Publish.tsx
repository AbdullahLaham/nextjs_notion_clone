import { Button } from '@/components/ui/button'
import { Popover } from '@/components/ui/popover'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import useOrigin from '@/hooks/useOrigin'
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import { useMutation } from 'convex/react'
import { Check, Copy, Globe } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
interface PublishProps {
    initialData: Doc<"document">
}
const Publish = ({ initialData }: PublishProps) => {
    const origin = useOrigin();
    const update = useMutation(api.documents.update);
    const [copied, setCopied] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    let url = `${origin}/preview/${initialData._id}`;
    const onPublish = () => {
        setSubmitting(true);
        const promise = update({
            id: initialData._id,
            isPublished: true,
        }).finally(() => setSubmitting(false));
        toast.promise(promise, {
            loading: 'publishing',
            success: 'note published',
            error: 'failed to publish'
        })

    }

    const unPublish = () => {
        setSubmitting(true);
        const promise = update({
            id: initialData._id,
            isPublished: false,
        }).finally(() => setSubmitting(false));
        toast.promise(promise, {
            loading: 'unPublishing',
            success: 'note unPublished',
            error: 'failed to unPublish'
        })

    }

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {!initialData.isPublished && <Button onClick={onPublish} >
                    Publish <Globe className='w-4 h-4 text-sky-500' />
                </Button>}

            </PopoverTrigger>
            <PopoverContent className='w-72 ' align='end' alignOffset={8} forceMount>
                {initialData.isPublished ? (
                    <div className='space-y-4'>
                        <div className='flex items-center gap-x-2 '>
                            <Globe className='text-sky-500 animate-pulse h-4 w-4' />
                            <p className='text-xs font-medium text-sky-500'>
                                This note is live on web
                            </p>

                        </div>
                        <div className='flex items-center'>
                            <input type='text' value={url} disabled className='flex-1 px-2 border text-xs rounded-l-md bg-muted truncate h-8 ' />
                            <Button className='h-8 rounded-r-md rounded-l-none' onClick={onCopy} disabled={copied} >
                                {copied ? (
                                    <Check className='w-4 h-4' />
                                ) : (
                                    <Copy className='w-4 h-4' />
                                )}
                            </Button>    
                        </div>
                        <Button onClick={unPublish} size={'sm'} className='w-full h-8 text-xs' disabled={submitting}>
                            Unpublish

                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center'>
                        <Globe className='h-8 w-8 text-muted-foreground mb-2' />
                        <p className='text-sm font-medium mb-2'>Publish this note</p>
                        <span className='text-xs font-medium mb-4'>Publish this note</span>
                        <Button onClick={onPublish} disabled={submitting} className='w-full text-xs' size={'sm'}>
                            Publish 
                        </Button>

                    </div>
                )}

            </PopoverContent>
        </Popover>
    )
}

export default Publish
