'use client';
import React, { ReactNode } from 'react'
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from '@/components/Loader';

const Provider = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
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
