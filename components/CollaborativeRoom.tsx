'use client'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Loader from './Loader'
import { Editor } from '@/components/editor/Editor'
import Header from '@/components/Header'
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'
import ActiveCollaborators from './ActiveCollaborators'
import { Input } from './ui/input'
import { currentUser } from '@clerk/nextjs/server'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions'

const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {
    //TODO - Later we make it dynamic
    const currentUserType = 'editor';

    // To edit Document Title
    const [documentTitle, setdocumentTitle] = useState(roomMetadata.title);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    // Method to update or track each keyboard key and store
    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            setLoading(true);

            try {
                if (documentTitle !== roomMetadata.title) {
                    const updatedDocument = await updateDocument(roomId, documentTitle)

                    if (updatedDocument) {
                        setEditing(false);
                    }
                }
            } catch (error) {
                console.error(error)
            }

            setLoading(false);
        }
    }

    // recall's every time we change roomId or documentTitle
    useEffect(() => {
        // If we click the mouse outside the editing area we save the Title
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false);
                updateDocument(roomId, documentTitle);
            }
        }

        // if mouse button press down call the handleClickOutside method
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [roomId, documentTitle]);

    // recall's every time we are editing
    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editing]);

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className='collaborative-room'>
                    <Header>
                        {/* for share button  */}
                        <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
                            {/* <p className='document-title'>Share</p> */}
                            {editing && !loading ? (
                                <Input
                                    type='text'
                                    value={documentTitle}
                                    ref={inputRef}
                                    placeholder='Enter Title'
                                    onChange={(e) => setdocumentTitle(e.target.value)}
                                    onKeyDown={updateTitleHandler}
                                    disabled={!editing}
                                    className='document-title-input'
                                />
                            ) : (
                                <>
                                    <p className='document-title'>{documentTitle}</p>
                                </>
                            )}

                            {/* If Not editing the document title */}
                            {currentUserType === 'editor' && !editing && (
                                <Image
                                    src="/assets/icons/edit.svg"
                                    alt='Edit'
                                    width={24}
                                    height={24}
                                    onClick={() => setEditing(true)}
                                    className='pointer'
                                />
                            )}
                            {/* If editing the document title */}
                            {currentUserType !== 'editor' && !editing && (
                                <p className='view-only-tag'>View Only</p>
                            )}

                            {loading && <p className='text-sm text-gray-400'>saving...</p>}

                        </div>
                        {/* */}
                        <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                            <ActiveCollaborators />
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default CollaborativeRoom
