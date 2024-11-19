import CollaborativeRoom from '@/components/CollaborativeRoom';
import { getDocument } from '@/lib/actions/room.actions';
import { getClerkUsers } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

interface SearchParamProps {
    params: {
        id: string;
    };
}

const Document = async ({ params }: SearchParamProps) => {
    // Wait for the dynamic parameter
    const { id } = await params; // Now safely access 'id'

    // Retrieve the currently logged-in Clerk user using Clerk's server-side API
    const clerkUser = await currentUser();

    // If no user is logged in, redirect them to the sign-in page
    if (!clerkUser) redirect("/sign-in");

    // Fetch document (room) details for the given ID and the logged-in user's email address
    const room = await getDocument({
        roomId: id, // The ID of the document or room
        userId: clerkUser.emailAddresses[0].emailAddress, // Primary email of the logged-in user
    });

    // If the room does not exist or the user does not have access, redirect to the homepage
    if (!room) redirect("/");

    // Extract user IDs of all users who have access to this document/room
    const userIds = room.usersAccesses ? Object.keys(room.usersAccesses) : [];

    // Fetch user details for all users with access using Clerk's API
    // If no users are fetched, default to an empty array
    const users = (await getClerkUsers({ userIds })) || [];

    // Map over the fetched users to enrich them with their access level (editor/viewer)
    const userData = Array.isArray(users)
        ? users.map((user: User) => ({
            ...user, // Spread the user object
            userType: room.usersAccesses[user.email]?.includes('room:write')
                ? 'editor' // Assign 'editor' role if the user has 'write' access
                : 'viewer', // Otherwise, assign 'viewer' role
        }))
        : [];

    // Determine the current user's role in the room (editor or viewer)
    const currentUserType = room.usersAccesses?.[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write')
        ? 'editor' // If the current user has 'write' access, they are an editor
        : 'viewer'; // Otherwise, they are a viewer

    // Render the CollaborativeRoom component, passing all necessary props
    return (
        <main className="flex w-full flex-col items-center">
            <CollaborativeRoom
                roomId={id} // Pass the room ID
                roomMetadata={room.metadata} // Pass the room metadata
                users={userData} // Pass the enriched user data
                currentUserType={currentUserType} // Pass the current user's role
            />
        </main>
    );
};

export default Document;
