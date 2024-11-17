'use client';
import React, { ReactNode } from 'react'
import {
    LiveblocksProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from '@/components/Loader';
import { getClerkUsers } from '@/lib/actions/user.action';

const Provider = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <LiveblocksProvider
                authEndpoint="/api/liveblocks-auth">
                resolverUsers={async ({ userIds }) => {
                    const users = await getClerkUsers({ userIds });

                    return users;
                }}
                {/* <RoomProvider id="my-room"> */}
                <ClientSideSuspense fallback={<Loader />}>
                    {children}
                </ClientSideSuspense>
                {/* </RoomProvider> */}
            </LiveblocksProvider>
        </div>
    )
}

export default Provider
