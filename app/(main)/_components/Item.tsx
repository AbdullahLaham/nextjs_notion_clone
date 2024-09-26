import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { useMutation } from 'convex/react';
import {  ChevronDown, ChevronDownCircle, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

interface ItemProps {
    id?: Id<"document">,
    documentIcon?: string,
    active?: boolean,
    expanded?: boolean,
    isSearch?: boolean,
    level?: number,
    onExpand?: () => void,
    label: string,
    onClick?: () => void,
    icon: LucideIcon,
}

const Item = ({id, label, onClick, icon: Icon, expanded, active, documentIcon, isSearch, level = 0, onExpand}: ItemProps) => {
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const router = useRouter();

  // current user
  const {user} = useUser();


  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!id) return;
    const promise = archive({id});
    toast.promise(promise, {
      loading: "moving to trash...",
      success: 'Note removed successfully',
      error: "failed to remove a note"
    })
  }




  const handleExpand = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onExpand?.();
  }

  const onCreate = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return 
    console.log(id, 'idd')
    const promise = create({title: "untitled", parentDocument: id as any})
      .then((documentId) => {
        if (!expanded) onExpand?.();
        console.log(documentId, 'idid')
        router.push(`/documents/${documentId}`)
      }).catch((error) => {
        console.log(error)
      })
      toast.promise(promise, {
        loading: "creating a new document",
        success: 'document created successfully',
        error: "failed to create a new document"

    })



  }
  
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;


  return (
    <div onClick={onClick} role='button' style={{paddingLeft: level ? `${(level * 12) + 12}px` : '12px'}} className={cn('group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium', active && "bg-primary/5 text-primary")}>
      {!!id && (
        <div role='button' className='h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-500 mr-1 dark:hover:bg-neutral-600' onClick={handleExpand}>
          <ChevronIcon className='h-4 w-4 shrink-0 text-muted-foreground/50 '/>
        </div>
      )}
      {documentIcon ? (
        <div className='shrink-0 mr-2 text-[18px]'>
          {documentIcon}
        </div>
      ) : (
        <div>
          <Icon className='shrink-0 h-[18px] mr-2 text-muted-foreground' />
        </div>
      )}
      
      <span className='truncate'>
        {label}
      </span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted font-medium text-muted-foreground text-[10px] font-mono px-1.5 '>
          <span className='text-xs'>
            c
          </span>k
        </kbd>
      )}
      {!!id && (
        <div className='ml-auto flex items-center gap-x-2 '>
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div role='button' className='opacity-0 group-hover:opacity-100  h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-1'>
                <MoreHorizontal className='h-4 w-4 text-muted-foreground'/>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-60 ' align='start' side='right' forceMount>
              <DropdownMenuItem onClick={onArchive} className='flex items-center px-2 py-1 ' role='button'>
                  <Trash className='h-3 w-3 mr-2' />
                  <p className='text-sm'>Delete</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className='text-xs text-muted-foreground p-2'>
                last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 p-1' onClick={onCreate}>
            <Plus className='w-4 h-4 text-muted-foreground' />
          </div>


        </div>
      )}

      
    </div>
  )
}

export default Item

Item.Skeleton = function ItemSkeleton({level}: {level?: number}) {
  return (
    <div style={{paddingLeft: level ? `${(level * 12)+ 25}px` : '12px'}} className='flex- gap-x-2 py-[3px]'>
      <Skeleton className='h-4 w-4' />
      <Skeleton className='h-4 w-[30%]' />

    </div>
  )
}