'use server';

import { nanoid } from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType, parseStringify } from '../utils';
import { redirect } from 'next/navigation';

//NOTE - All User Actions

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
            defaultAccesses: []
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

        // Bring this back when we have the permissions system in place
        const hasAccess = Object.keys(room.usersAccesses).includes(userId);

        if (!hasAccess) {
            throw new Error("You do not have access to this document");
        }

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

// To get all the data of user who update the document 
export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType,
        }
        // To update the room
        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses
        })

        if (room) {
            // To send notification
            const notificationId = nanoid();

            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: '$documentAccess',
                subjectId: notificationId,
                activityData: {
                    userType,
                    title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
                    updatedBy: updatedBy.name,
                    avatar: updatedBy.avatar,
                    email: updatedBy.email
                },
                roomId
            })
        }

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(room);
    } catch (error) {
        console.log(`Error happened while updating a room access: ${error}`);
    }
}

// To remove the collaborator
export const removeCollaborator = async ({ roomId, email }: { roomId: string, email: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)

        // To prevent owner of the doc's to remove himself 
        if (room.metadata.email === email) {
            throw new Error('You cannot remove yourself from the document');
        }

        // TO update the room
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null
            }
        })

        revalidatePath(`/documents/${roomId}`);
        return parseStringify(updatedRoom);
    } catch (error) {
        console.log(`Error happened while removing a collaborator: ${error}`);
    }
}

// To delete the file
export const deleteDocument = async (roomId: string) => {
    try {
        await liveblocks.deleteRoom(roomId);
        revalidatePath('/');
        redirect('/');
    } catch (error) {
        console.log(`Error happened while deleting a room: ${error}`);
    }
}