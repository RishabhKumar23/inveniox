import React from 'react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import { SignIn, UserButton } from '@clerk/nextjs'
import { SignIn as ClerkSignIn } from '@clerk/nextjs'; // To avoid naming conflict
import Image from 'next/image';
import AddDocumentButton from '@/components/AddDocumentButton';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


const Home = async () => {

  // Retrieve the current user from Clerk
  const clerkUser = await currentUser();

  // If there is no authenticated user, redirect to the sign-up page
  if (!clerkUser) redirect('/sign-in');

  const documents = [];

  return (
    <main className='home-container'>
      <Header className='sticky left-0 top-0'>
        <div className='flex items-center gap-2 lg:gap-4'>
          Notification
          <ClerkSignIn />
          <UserButton />
          {/* </SignIn> */}
        </div>
      </Header>

      {documents.length > 0 ? (
        <div>

        </div>
      ) : (
        <div className='dcoument-list-empty'>
          <Image
            src={"/assets/icons/doc.svg"}
            alt='Doc icon'
            width={40}
            height={40}
            className='mx-auto'
          />
          {/* Button to create doc */}
          <AddDocumentButton
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>

  )
}

export default Home