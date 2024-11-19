'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    try {
        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds,
        });

        const users = data.map((user: { id: any; firstName: any; lastName: any; emailAddress: { emailAddress: any; }[]; imageUrl: any; }) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddress[0].emailAddress,
            avatar: user.imageUrl,
        }));

        const sortUsers = userIds.map((email) => users.find((user: { email: string; }) =>
            user.email === email
        ));

        return parseStringify(sortUsers);

    } catch (error) {
        console.log(`Error fetching users: ${error}`);
    }
    
    console.log("type of clerkClient",typeof clerkClient); // Should print 'object'

}