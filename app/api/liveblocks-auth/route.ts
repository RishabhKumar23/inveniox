import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Define the POST handler function
export async function POST(request: Request) {

  // Retrieve the current user from Clerk
  const clerkUser = await currentUser();

  // If there is no authenticated user, redirect to the sign-up page
  if (!clerkUser) redirect('/sign-up');

  // Destructure needed fields from the Clerk user object
  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  // Get the current user from your database
  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    }
  };

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [], // Optional
    },
    { userInfo: user.info },
  );

  // Return the response with the status and body from Liveblocks
  return new Response(body, { status });
}