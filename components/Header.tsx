import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
// import React from 'react'

const Header = ({ children, className }: HeaderProps) => {
    return (
        <div className={cn('header bg-black', className) }>
            <Link href='/' className="md: flex-1">
                <Image
                    src="/assets/icons/InvenioX.svg"
                    alt='Logo with name'
                    width={120}
                    height={32}
                    className='hidden md:block'
                />
                <Image
                    src="/assets/icons/ix-logo.svg"
                    alt='Logo'
                    width={60}
                    height={32}
                    className='mr-2 md:hidden'
                />
            </Link>
            {children}
        </div>
    )
}

export default Header
