import React from 'react'
// import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import { UserButton } from '@clerk/nextjs'
import { SignIn as ClerkSignIn } from '@clerk/nextjs'; // To avoid naming conflict
import Image from 'next/image';
import AddDocumentButton from '@/components/AddDocumentButton';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDocuments } from '@/lib/actions/room.actions';
import Link from 'next/link';
import { dateConverter } from '@/lib/utils';


const Home = async () => {

  // Retrieve the current user from Clerk
  const clerkUser = await currentUser();

  // If there is no authenticated user, redirect to the sign-up page
  if (!clerkUser) redirect('/sign-in');

  // const documents = [];
  const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);


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

      {roomDocuments.data.length > 0 ? (
        <div className='document-list-container'>
          <div className='document-list-title group relative'>
            {/* <h3 className='text-28-semibold'> Documents </h3> */}
            <div className="transform transition-transform duration-300 scale-100 group-hover:scale-110">
              <AddDocumentButton
                userId={clerkUser.id}
                email={clerkUser.emailAddresses[0].emailAddress}
              />
            </div>
          </div>
          <ul className='document-ul'>
            {roomDocuments.data.map(({ id, metadata, createdAt }: any) => {
              return (
                <li key={id} className='document-list-item '>
                  <Link
                    href={`/documents/${id}`}
                    className='flex flex-1 items-center gap-4'
                  >
                    <div className='hidden rounded-md bg-dark-500 p-2 sm:block'>
                      <Image
                        src="/assets/icons/doc.svg"
                        alt='file'
                        width={40}
                        height={40}
                      />
                    </div>
                    {/* For title and created time*/}
                    <div className='space-y-1 hover:animate-shake-delayed'>
                      <p className='line-clamp-1 text-lg'>{metadata.title}</p>
                      <p className='text-sm font-light text-blue-100'>
                        Created about {dateConverter(createdAt)}
                      </p>
                    </div>
                  </Link>
                  {/*//TODO - to add delete button */}

                </li>
              )
            })}
          </ul>
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