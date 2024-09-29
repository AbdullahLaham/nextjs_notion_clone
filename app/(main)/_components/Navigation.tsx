"use client"


import { cn } from '@/lib/utils';
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation';
import React, { ElementRef, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import UserItem from './UserItem';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Item from './Item';
import { error } from 'console';
import { toast, } from 'sonner';
import DocumentList from './DocumentList';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import TrashBox from './TrashBox';
import { useSearch } from '@/hooks/useSearch';
import { useSettings } from '@/hooks/useSettings';
import Navbar from './Navbar';
import { useRouter } from 'next/navigation';
const Navigation = () => {
    const isMobile = useMediaQuery("(max-width: 768px");
    const pathname = usePathname();
    const search = useSearch();
    const settings = useSettings();
    const {documentId} = useParams();
    const router = useRouter();

    const create = useMutation(api.documents.create)
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [isResetting, setIsResitting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(isMobile);


    // handle sidebar resizing
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        isResizingRef.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);



    }
    const handleMouseMove = (event: MouseEvent) => {
        console.log("hello")
        if (!isResizingRef.current) return;
        let newWidth = event.clientX;
        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;
        if (sidebarRef.current && navbarRef.current) {
            //new sidebar width
            sidebarRef.current.style.width = `${newWidth}px`;
            //new navbar width
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`)

        }


    }
    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }
    const resetWidth = () => {

        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResitting(true);

            //new sidebar width
            sidebarRef.current.style.width = isMobile ? `100%` : '240px';
            //new navbar width
            navbarRef.current.style.setProperty("width", isMobile ? `0` : `calc(100% - 240px)`);
            navbarRef.current.style.setProperty("left", isMobile ? `100%` : `240px`);

            setTimeout(() => {
                setIsResitting(false)
            }, 300);
        }
    }
    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResitting(true);
            sidebarRef.current.style.width = '0';
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0");

            setTimeout(() => {
                setIsResitting(false)
            }, 300);
        }
    }

    const handleCreate = () => {
        const promise = create({ title: 'untitled', })
            .then((id) => router.push(`/documents/${id}`))
        toast.promise(promise, {
            loading: "creating a new note",
            success: 'Note created successfully',
            error: "failed to create a new note"

        })
    }
    const handleSearch = () => {

    }
    const handleSettings = () => {

    }

    useEffect(() => {
        if (isMobile) {
            collapse();

        } else {
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse()
        }

    }, [pathname, isMobile]);

    return (
        <div>
            <aside ref={sidebarRef} className={cn('group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[9999]', isResetting && "transition-all ease-in-out duration-300", isMobile && "w-0")}>
                <div role='button' onClick={collapse} className={cn('h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition', isMobile && 'opacity-100')}>
                    <ChevronsLeft className='h-6 w-6' />
                </div>
                <div>
                    <UserItem />
                    <Item onClick={search.onOpen} icon={Search} label='Search' isSearch />
                    <Item onClick={settings.onOpen} icon={Settings} label='Settings' />
                    <Item onClick={handleCreate} label="New page" icon={PlusCircle} />

                </div>
                <div className='mt-4'>
                    <DocumentList />
                    <Item onClick={handleCreate} icon={Plus} label='Add a page' />
                    <Popover>
                        <PopoverTrigger className='w-full mt-4'>
                            <Item label='trash' icon={Trash} />

                        </PopoverTrigger>
                        <PopoverContent side={isMobile ? 'bottom': 'right'} className='w-72 p-0'>
                            <TrashBox />
                        </PopoverContent>

                    </Popover>

                </div>
                <div onMouseDown={handleMouseDown} onClick={resetWidth} className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0' />


            </aside>
            <div ref={navbarRef} className={cn("bg-red-500 absolute top-0 left-60 z-[9999] w-[calc(100% - 240px)]", isResetting && "transition-all ease-in-out duration-300", isMobile && "left-0 w-full ")}>
                {!!documentId ? (
                    <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth}  />

                ): (
                    <nav className='bg-transparent px-3 py-2 w-full '>
                        {isCollapsed && <MenuIcon onClick={resetWidth} className='h-6 w-6 text-muted-foreground' role='button' />}
                    </nav>
                )}
                

            </div>
        </div>
    )
}

export default Navigation;
