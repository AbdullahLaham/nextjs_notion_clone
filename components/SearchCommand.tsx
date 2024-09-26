import { api } from '@/convex/_generated/api';
import { useSearch } from '@/hooks/useSearch';
import { useUser } from '@clerk/clerk-react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandList } from './ui/command';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { CommandInput, CommandItem } from './ui/command';
import { File } from 'lucide-react';

const SearchCommand = () => {
    const {user} = useUser();
    const router = useRouter();
    const documents = useQuery(api.documents.getSearch);

    const [mounted, setMounted] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    

    const isOpen = useSearch((store) => store.isOpen);
    const toggle = useSearch((store) => store.toggle);
    const onClose = useSearch((store) => store.onClose);

    useEffect(() => {
        setMounted(true)

    }, []);
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            e.preventDefault();
            if (e.key == 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle();
            }
        }
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down)

    }, [toggle]);

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`);
        onClose();
    }

    if (!mounted) {
        return null;
    }
    
//  value={searchVal} onChange={(e) => setSearchVal(e.target.value)}

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
        <CommandInput placeholder={`Search ${user?.fullName} Notion`} />
        <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup heading="Documents">
                {documents?.map((document) => (
                    <CommandItem key={document._id} value={`${document._id}-${document.title}`} title={document.title} onSelect={onSelect}>
                        {document?.icon ? (
                            <p className='mr-2 text-[18px]'>{document.icon}</p>
                        ) : (
                            <File className='mr-2 w-4 h-4' />

                        )}
                        <span>
                            {document.title}
                        </span>
                    </CommandItem>
                ))}

            </CommandGroup>
        </CommandList>
      
    </CommandDialog>
  )
}

export default SearchCommand
