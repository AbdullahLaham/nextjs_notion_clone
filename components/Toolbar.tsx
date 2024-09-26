import { Doc } from '@/convex/_generated/dataModel'
import React, { ElementRef, useRef, useState } from 'react'
import IconPicker from './IconPicker'
import { Button } from './ui/button'
import { ImageIcon, Smile, X } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import TextareaAutosize from 'react-textarea-autosize';
import { removeIcon } from '@/convex/documents'
import { useCoverImage } from '@/hooks/useCoverImage'
interface ToolbarProps {
    initialData: Doc<"document">,
    preview?: boolean,
}
const Toolbar = ({initialData, preview}: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);
  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.remove);

  const coverImage = useCoverImage();
  const enableInput = () => {

    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData?.title);
      inputRef.current?.focus();
      
    }, 0);
  }
  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData?._id,
      title: value || "untitled"
    })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) =>{
     if (e.key == 'Enter') {
      e.preventDefault();
      disableInput();
     }
  }
  
  const onIconSelect = (icon: string) => {
    update({
      id: initialData?._id,
      icon,
    })

  }
  const onRemoveIcon = () => {
    removeIcon({
      id: initialData?._id
    })
  }

  return (
    <div className='pl-[54px] group relative'>
      {/* <img src={initialData.coverImage} /> */}
        {!!initialData.icon  && !preview && ( // the owner and not a guist 'visitor'
            <div className='flex items-center gap-x-2 group/icon pt-6'>
              <IconPicker onChange={onIconSelect}>
                <p className='text-6xl hover:opacity-75 transition'>{initialData.icon}</p>
              </IconPicker>
              <Button onClick={onRemoveIcon} className='rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs' variant={"outline"} size="icon" >
                <X className='w-4 h-4' />
              </Button>

            </div>
        )}
        {!!initialData.icon  && preview && ( // if he is a guist 'visitor'
           <p className='text-6xl pt-6'>{initialData.icon}</p>
        )}
        <div className='opacity-100 group-hover:opacity-100 flex items-center gap-x-1 py-4 '>
          {!initialData.icon && !preview && (
            <IconPicker asChild onChange={onIconSelect}>
              <Button className='text-muted-foreground text-xs' variant={'outline'} size='sm' >
                <Smile className='h-4 w-4 mr-2' />
                Add icon
              </Button>
            </IconPicker>
          )}
          
          {!initialData.coverImage && !preview && (
            <Button className='text-muted-foreground text-xs' onClick={coverImage.onOpen} variant={'outline'} size={'sm'}>
              <ImageIcon className='h-4 w-4 mr-2' />
              Add Cover
            </Button>
          )}


        </div>
        {isEditing && !preview ? (
          <TextareaAutosize ref={inputRef} onBlur={disableInput} onKeyDown={onKeyDown} value={value}  onChange={(e: any) => onInput(e.target.value)} className='border-none outline-none text-5xl bg-transparent font-bold break-words text-[#3f3f3f] dark:text-[#cfcfcf] resize-none' />
        ): (
          <div className='pb-[11.5px] text-5xl bg-transparent font-bold break-words text-[#3f3f3f] dark:text-[#cfcfcf] resize-none' onClick={enableInput}>
            {initialData?.title}
          </div>
        )}
      
    </div>
  )
}

export default Toolbar
