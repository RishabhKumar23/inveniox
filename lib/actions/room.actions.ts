'use server';

import { nanoid } from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';

// To create Document
export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid();

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled"
        }

        // To give user write or read accesses 
        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: ['room:write']
        });

        revalidatePath("/");

        return parseStringify(room);
    } catch (error) {
        console.log(`Error happened while creating a room: ${error}`);
    }
}

// To get Document
export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string; }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        //TODO - Bring this back when we have the permissions system in place

        // const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        // if (!hasAccess) {
        //     throw new Error("You do not have access to this document");
        // }

        return parseStringify(room);
    } catch (error) {
        console.log(`Error happened while getting a room: ${error}`);
    }
}

// To update Document name/Title
export const updateDocument = async (roomId: string, title: string) => {
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        })

        revalidatePath(`/documents/${roomId}`);

        return parseStringify(updatedRoom);
    } catch (error) {
        console.log(`Error happened while updating a room: ${error}`);
    }
}

// To get all the document
export const getDocuments = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email });

        return parseStringify(rooms);
    } catch (error) {
        console.log(`Error happened while getting a rooms: ${error}`);
    }
}