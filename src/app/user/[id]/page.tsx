"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useQRCode } from 'next-qrcode';
import { toast } from 'react-toastify';

const UserDetail = ({ params }: { params: { id: string } }) => {
  const { Canvas } = useQRCode();
  const isAdmin = sessionStorage.getItem('isadmin');
  const [firstname, setFirstname]: any = useState('')
  const [lastname, setLastname]: any = useState('')
  const [middlename, setMiddlename]: any = useState('')
  const [sso, setSSO]: any = useState(false)
  const [mfa, setMFA]: any = useState(false)
  const [email, setEmail]: any = useState('')

  const router = useRouter();

  const handleChange = (e: any) => {
    if (e.target.name == 'firstname') {
      setFirstname(e.target.value)
    } else if (e.target.name == 'lastname') {
      setLastname(e.target.value)
    }
    else if (e.target.name == 'middlename') {
      setMiddlename(e.target.value)
    }
    else if (e.target.name == 'email') {
      setEmail(e.target.value)
    }
    else if (e.target.name == 'sso') {
      setSSO(e.target.checked)
    }
    else if (e.target.name == 'mfa') {
      setMFA(e.target.checked)
    }

  }


  // when form is submitted
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Submitted')
    const userObject = {
      Firstname: firstname,
      Middlename: middlename,
      Lastname: lastname,
      Emailaddress: email,
      SSO: sso,
      MFA: mfa
    }
    console.log(userObject)
    const authToken = sessionStorage.getItem('token');
    if (params.id != '0') {
      // update the task
      axios.put(`http://localhost:6060/users/${params.id}`, userObject, { headers: { 'Authorization': `Bearer ${authToken}` } }).
        then((response: any) => {
          // alert('Record saved')
          console.log(response)
          toast.success("Record saved");
        }
        ).catch(error => {

          if (error?.response?.data?.statusCode == 409) {
            toast.error(error?.response?.data?.message);
          } else {
            console.error(error)
            sessionStorage.clear();
            router.push('/login')
          }

        })

    } else {
      // create new task
      axios.post(`http://localhost:6060/users`, userObject, { headers: { 'Authorization': `Bearer ${authToken}` } }).
        then((response: any) => {
          console.log(response)
          router.push(`/user/${response.data.UserId}`)
          toast.success("Record saved");
        }
        ).catch(error => {
          if (error?.response?.data?.statusCode == 409) {
            toast.error(error?.response?.data?.message);
          } else {
            console.error(error)
            sessionStorage.clear();
            router.push('/login')
          }
        })

    }

  }


  useEffect(() => {
    console.log('Use Effect of User Detail page')
    const authToken = sessionStorage.getItem('token');

    // run this when update is done
    if (params.id != '0') {
      axios.get(`http://localhost:6060/users/${params.id}`, { headers: { 'Authorization': `Bearer ${authToken}` } }).
        then((data: any) => {
          setEmail(data.data.EmailAddress || '')
          setFirstname(data.data.Firstname || '')
          setLastname(data.data.Lastname || '')
          setMiddlename(data.data.Middlename || '')
          setSSO(data.data.SSO)
          setMFA(data.data.MFA)
        }
        ).catch(error => {
          console.error(error)
          sessionStorage.clear();
          router.push('/login')
        })
    }

  }, [])

  return (
    <div>
      <form encType="multipart/form-data" className={" mx-auto h-[80vh] overflow-y-auto border border-gray-300 p-4 w-[50vw]"} onSubmit={handleSubmit}>

        <div className="mb-4">
          <label htmlFor="firstname" className="block text-gray-700 font-bold mb-2">Firstname:</label>
          <input type="text" onChange={handleChange} value={firstname} id="firstname" name="firstname" className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} />
        </div>
        <div className="mb-4">
          <label htmlFor="middlename" className="block text-gray-700 font-bold mb-2">Middlename:</label>
          <input type="text" onChange={handleChange} value={middlename} id="middlename" name="middlename" className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} />
        </div>
        <div className="mb-4">
          <label htmlFor="lastname" className="block text-gray-700 font-bold mb-2">Lastname:</label>
          <input type="text" onChange={handleChange} value={lastname} id="lastname" name="lastname" className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Emailaddress:</label>
          <input type="email" onChange={handleChange} value={email} id="email" name="email" className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} />
        </div>

        <div className="mb-4">
          <label htmlFor="sso" className="block text-gray-700 font-bold mb-2">Enable SSO:</label>
          <input type="checkbox" onChange={handleChange} checked={sso} id="sso" name="sso" />
        </div>

        <div className="mb-4">
          <label htmlFor="mfa" className="block text-gray-700 font-bold mb-2">Enable 2FA:</label>
          <input type="checkbox" onChange={handleChange} checked={mfa} id="mfa" name="mfa" />
        </div>


        {mfa == true ? <div className="mb-4">
          <Canvas
            text={'https://github.com/bunlong/next-qrcode'}
            options={{
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: 200,
              color: {
                dark: '#010599FF',
                light: '#FFBF60FF',
              },
            }}
          />
        </div> : <></>}

        <div className="mb-6">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
        </div>
      </form>
    </div>
  )
}

export default UserDetail