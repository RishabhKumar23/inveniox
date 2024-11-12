import { SignUp as ClerkSignUp } from '@clerk/nextjs'; // To avoid naming conflict
import React from 'react';

const SignUpPage = () => {
    return (
        <main className='auth-page'>
            <ClerkSignUp />
        </main>
    );
};

export default SignUpPage;
