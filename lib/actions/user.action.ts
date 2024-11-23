'use server';

import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";
import { clerkClient } from "@clerk/nextjs/server";

//NOTE - All Room Actions
export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const { data } = await (await clerkClient()).users.getUserList({
            emailAddress: userIds
        });

        // console.log("Data", data);

        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));

        const sortUsers = userIds.map((email) => users.find((user: { email: string; }) =>
            user.email === email
        ));

        return parseStringify(sortUsers);

    } catch (error) {
        console.log(`Error fetching users: ${error}`);
    }
    // console.log("type of clerkClient", typeof clerkClient); // Should print 'object'
}

export const getDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if (text.length) {
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText))

            return parseStringify(filteredUsers);
        }

        return parseStringify(users);

    } catch (error) {
        console.log(`Error fetching document users: ${error}`);
    }
}