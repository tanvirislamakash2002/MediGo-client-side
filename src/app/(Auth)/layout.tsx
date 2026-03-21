import { Navbar } from '@/components/layout/Navbar';
import React from 'react';

const AuthLayout = (
    { children }:
        Readonly<{ children: React.ReactNode }>
) => {
    return (
        <div className=''>
            <Navbar></Navbar>

            {children}
        </div>
    );
};

export default AuthLayout;