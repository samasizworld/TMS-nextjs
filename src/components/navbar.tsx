"use client"
import Link from 'next/link';
import React, { useState, createContext } from 'react'
import { useRouter, usePathname } from 'next/navigation';

export const SearchContext = createContext('');

const Navbar = ({ children }: any) => {
    const currentPath = usePathname();
    const [search, setSearch] = useState('')
    const router = useRouter()
    const handleSubmit = async (e: any) => {
        e.preventDefault();
    }
    const handleChange = (e: any) => {
        if (e.target.name == 'search') {
            setSearch(e.target.value)
        }
    }

    const handleLogout = () => {
        sessionStorage.clear();
        router.push('/login')
    }

    return (
        <SearchContext.Provider value={search}>
            <nav className={'w-full bg-blue-500 flex justify-between items-center text-white h-[10vh]'}>
                <div className={'m-10 font-bold cursor-pointer hover:text-yellow-500'}>{'<TMS>'}</div>

                {currentPath != '/login' ? (<>
                    <ul className={'flex font-bold w-1/4 justify-evenly'}>
                        <li className={'cursor-pointer hover:text-yellow-500'}><Link href={'/'}>Dashboard</Link></li>
                        <li className={'cursor-pointer hover:text-yellow-500'}><Link href={'/'}>About TMS</Link></li>
                    </ul>
                    <div className={'flex w-1/4 justify-end h-20 items-center'}>
                        <form onSubmit={handleSubmit}><input name="search" value={search} onChange={handleChange} className={'rounded-sm outline-none focus:border border-yellow-500 mx-2 text-black'} />
                            <button type='submit' className={'hover:text-yellow-500 mr-10 font-bold'}>Search</button></form>

                    </div>
                    <div className={'flex w-1/4 justify-end h-20 items-center'}>
                        <button className={'hover:text-yellow-500 mr-10 font-bold'} onClick={handleLogout}>Logout</button>
                    </div>
                </>) : (<></>)}
            </nav>
            {children}
        </SearchContext.Provider>
    )
}

export default Navbar