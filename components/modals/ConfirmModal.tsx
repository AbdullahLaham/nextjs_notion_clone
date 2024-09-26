"use client"

import React from 'react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogAction, AlertDialogDescription,AlertDialogTrigger, AlertDialogTitle, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog'
interface ConfirmModalProps {
    children: React.ReactNode,
    onConfirm: () => void,
}
const ConfirmModal = ({children, onConfirm}: ConfirmModalProps) => {
    const handleConfirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        onConfirm();

    }
  return (

    <AlertDialog>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
            
            </AlertDialogTitle>
            <AlertDialogDescription>

            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
                Confirm
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmModal
