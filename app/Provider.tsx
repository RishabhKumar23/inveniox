'use client';
import React, { ReactNode } from 'react'
import {
    LiveblocksProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from '@/components/Loader';
import { getClerkUsers, getDocumentUsers } from '@/lib/actions/user.action';
import { useClerk } from '@clerk/nextjs';

const Provider = ({ children }: { children: ReactNode }) => {

    const { user: clerkUser } = useClerk();

    return (
        <LiveblocksProvider
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={async ({ userIds }) => {
                const users = await getClerkUsers({ userIds });
                return users;
            }}
            resolveMentionSuggestions={async ({ text, roomId }) => {
                const roomUsers = await getDocumentUsers({
                    roomId,
                    currentUser: clerkUser?.emailAddresses[0].emailAddress,
                    text,
                })

                return roomUsers;
            }}
        >
            {/* <RoomProvider id="my-room"> */}
            <ClientSideSuspense fallback={<Loader />}>
                {children}
            </ClientSideSuspense>
            {/* </RoomProvider> */}
        </LiveblocksProvider>
    )
}

export default Provider
