'use client'
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';


const Login = () => {
    const [email, useEmail] = useState('');
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
        useEmail(e.target.value);
    }

    return (
        <div className='container mx-auto'>
            <form className='flex justify-center items-center' onSubmit={handleSubmit}>
                <label htmlFor="name">EmailAddress:</label>
                <input type="email" id="email" name="email" value={email} onChange={handleChange} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default Login