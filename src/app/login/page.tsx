'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import { toast } from 'react-toastify';
const Login = () => {
    const [email, useEmail] = useState('');
    const [otp, setOTP] = useState('');
    // paste your client id here
    const clientId = 'iwdscock';
    const router = useRouter();

    if (sessionStorage.getItem('token')) {
        router.push('/tasks')
    }

    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.auth2.init({ clientId: clientId })
        })
    }, [])

    const responseGoogle = async (response: any) => {
        console.log(response?.profileObj?.email)
        const data = { Username: response.profileObj.email || '', OTPCode: '' };
        try {
            const resp = await axios.post('http://localhost:6060/generateToken', data);
            sessionStorage.setItem('token', resp.data.AuthenticationKey)
            sessionStorage.setItem('isadmin', resp.data.IsAdmin)
            // navigate to task page
            router.push('/tasks')
        } catch (error) {
            sessionStorage.clear();
            console.error(error)
            toast.error("Invalid credentials");

        }
        // console.log(response.accessToken)
        // Handle the response from Google OAuth
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = { Username: email, OTPCode: otp };
        try {
            const resp = await axios.post('http://localhost:6060/generateToken', data);
            sessionStorage.setItem('token', resp.data.AuthenticationKey)
            sessionStorage.setItem('isadmin', resp.data.IsAdmin)
            // navigate to task page
            if (resp.data.IsAdmin == true) {
                router.push('/')
            } else {
                router.push('/tasks')
            }

        } catch (error) {
            sessionStorage.clear();
            console.error(error)
            toast.error("Invalid credentials");
        }

    }
    const handleChange = (e: any) => {
        if (e.target.name == 'otp') {
            setOTP(e.target.value)
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
                    <label className={'font-bold'} htmlFor="otp">Enter OTP</label>
                    <input className={'p-2 outline-none border focus:border-yellow-600 rounded-sm'} type="text" id="otp" name="otp" value={otp} onChange={handleChange} placeholder='OTP' required />
                    <button className={' m-5 p-2 rounded-full border bg-blue-400  hover:bg-yellow-600'}>Login</button>
                    <p className={'text-center'}>OR</p>
                    <GoogleLogin
                        // className={'rounded-full border bg-blue-400  hover:bg-yellow-600'}
                        clientId={clientId}
                        buttonText="Login with Google"
                        redirectUri={'http://localhost:3000/auth/cb'}
                        onSuccess={responseGoogle}
                        // onFailure={onFailure} // Optional
                        cookiePolicy={'single_host_origin'}
                    />
                </form>
            </div>
        </>
    )
}

export default Login