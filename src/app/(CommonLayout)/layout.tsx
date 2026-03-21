import { Navbar } from '@/components/layout/Navbar';
import React from 'react';

const CommonLayout = (
    { children }:
        Readonly<{ children: React.ReactNode }>
) => {
    return (
        <div>
            <Navbar></Navbar>
            {children}
        </div>
    );
};

export default CommonLayout;