'use client'
import { Button } from './ui/button'
import Image from 'next/image'
import { createDocument } from '@/lib/actions/room.actions'
import { useRouter } from 'next/navigation'

const AddDocumentButton = ({ userId, email }: AddDocumentButtonProps) => {

    const router = useRouter();

    // to add document
    const addDocumentHandler = async () => {
        console.log("button is clicked!")
        try {
            const room = await createDocument({ userId, email });

            // if room is created successfully then redirect to new route dynamiclly
            if (room) router.push(`/documents/${room.id}`);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='m-5 bg-blue-200 p-10'>
            <Button
                type='submit'
                onClick={addDocumentHandler}
                className='gradient-blue flex gap-1 shadow-md'
            >
                <Image
                    src={'/assets/icons/add.svg'}
                    width={25}
                    height={25}
                    alt={'add icon'}
                />
                <p className='hidden sm:block'>Create a blank document</p>
            </Button>
        </div>
    )
}

export default AddDocumentButton
