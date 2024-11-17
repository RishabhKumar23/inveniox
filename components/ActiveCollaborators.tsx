import { useOthers } from '@liveblocks/react/suspense';
import Image from 'next/image';
import React from 'react'

const ActiveCollaborators = () => {
    // `useOthers` retrieves a list of other collaborators currently connected to the session.
    const others = useOthers();

    // Map through the `others` array to extract the `info` property of each collaborator.
    const collaborators = others.map((other) => other.info);

    return (
        // Render a list of active collaborators using a <ul> element with a custom CSS class.
        <ul className='collaborators-list'>
            {collaborators.map(({ id, avatar, name, color }) =>
                // Render each collaborator as an <li> element. Use `id` as the unique key for React.
                <li key={id}>
                    {/* Render the collaborator's avatar using the Next.js Image component. */}
                    <Image
                        src={avatar}
                        alt={name}
                        width={100}
                        height={100}
                        className='inline-block size-8 rounded-full ring-2 ring-dark-200'
                        style={{ border: `3px solid ${color}` }}
                    />
                </li>
            )}
        </ul>
    )
}

export default ActiveCollaborators
