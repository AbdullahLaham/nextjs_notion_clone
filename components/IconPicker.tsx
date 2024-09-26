"use client"

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import EmojiPicker, {Theme} from 'emoji-picker-react';
import { useTheme } from 'next-themes';

interface IconPickerProps {
    onChange: (icon: string) => void,
    children: React.ReactNode,
    asChild?: boolean,
}

const IconPicker = ({
    onChange, children, asChild
}: IconPickerProps) => {
    const {resolvedTheme} = useTheme();
    const currentTheme = (resolvedTheme || "light") as keyof typeof themeMap;
    const themeMap = {
        "dark": Theme.DARK,
        "light": Theme.LIGHT

    }
    
  return (
    <Popover>
        <PopoverTrigger>
            {children}
        </PopoverTrigger>
        <PopoverContent className='w-full p-0 border-none shadow-none'>
            <EmojiPicker height={350} theme={themeMap[currentTheme]} onEmojiClick={(data) => onChange(data.emoji)} />
        </PopoverContent>
      
    </Popover>
  )
}

export default IconPicker
