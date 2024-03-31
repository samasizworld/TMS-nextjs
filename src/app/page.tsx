"use client"
import React from 'react'
import 'font-awesome/css/font-awesome.min.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
    const isAdmin = sessionStorage.getItem('isadmin');
    const router = useRouter()
    if (isAdmin == 'false') {
        return router.push('/tasks')
    }
    return (
        <div className={'container m-auto flex justify-center items-center space-x-10 h-full'}>
            <div className={'flex flex-col justify-center items-center'}>
                <Link href={'http://localhost:3000/user'}>
                    <i className="fa fa-user fa-4x"></i>
                    <p>User</p>
                </Link>
            </div>
            <div className={'flex flex-col justify-center items-center'}><Link href={'http://localhost:3000/tasks'}>
                <i className="fa fa-user fa-4x"></i>
                <p>TaskList</p>
            </Link>
            </div>
        </div>
    )
}

export default Dashboard