import { SignIn as ClerkSignIn } from '@clerk/nextjs'; // To avoid naming conflict
import React from 'react';

const SignInPage = () => {
    return (
        <main className='auth-page'>
            <ClerkSignIn />
        </main>
    );
};

export default SignInPage;
