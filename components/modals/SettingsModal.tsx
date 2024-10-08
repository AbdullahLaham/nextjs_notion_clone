"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader,  } from '@/components/ui/dialog'
import { useSettings } from '@/hooks/useSettings'
import { Label } from '@/components/ui/label'

const SettingsModal = () => {
    const settings = useSettings();
    
  return (

    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className='border-b pb-3'>
            <h2 className='text-lg font-medium'>My Settings</h2>
        </DialogHeader>
        <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-y-1'>
                <Label>Appearnce</Label>
                <span className='text-[0.8rem] text-muted-foreground'>Customize how notion looks for your device</span>
            </div>

        </div>

      </DialogContent>
    </Dialog>
  )
}

export default SettingsModal
