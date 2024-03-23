'use client'
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';


const Login = () => {
    const [email, useEmail] = useState('');
    const [password, usePassword] = useState('');

    const router = useRouter();
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = { Username: email };
        try {
            const resp = await axios.post('http://localhost:6060/generateToken', data);
            sessionStorage.setItem('token', resp.data.AuthenticationKey)
            // navigate to task page
            router.push('/tasks')
        } catch (error) {
            console.error(error)
        }

    }
    const handleChange = (e: any) => {
        if (e.target.name == 'password') {
            usePassword(e.target.value)
        } else if (e.target.name == 'email') {
            useEmail(e.target.value);

        }
    }
    return (
        <>
            <div className='container mx-auto h-[80vh]  flex justify-evenly items-center'>
                <div className={''}><h1 className={'w-fit text-xl font-bold'}>Task Management System</h1>
                    <p className={'w-fit text-[0.75rem]'}>Welcome to Task Management System.</p>
                </div>
                <form onSubmit={handleSubmit} className={'p-[3rem] flex flex-col justify-center bg-gray-300 space-y-5 shadow-lg rounded-xl'}>
                    <label className={'font-bold'} htmlFor="name">Enter emailaddress</label>
                    <input className={'p-2 outline-none border focus:border-yellow-600 rounded-sm'} type="email" id="email" name="email" value={email} onChange={handleChange} placeholder='Emailaddress' required />
                    <label className={'font-bold'} htmlFor="password">Enter Password</label>
                    <input className={'p-2 outline-none border focus:border-yellow-600 rounded-sm'} type="password" id="password" name="email" value={password} onChange={handleChange} placeholder='Password' />
                    <button className={' m-5 p-2 rounded-full border bg-blue-400  hover:bg-yellow-600'}>Login</button>
                </form>
            </div>
        </>
    )
}

export default Login