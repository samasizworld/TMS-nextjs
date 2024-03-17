"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

const TaskDetail = ({ params }: { params: { id: string } }) => {
    const [task, setTask]:any = useState({})
    const router = useRouter();
    useEffect(() => {
        console.log('Use Effect of Task Detail page')
        const authToken = sessionStorage.getItem('token');
        axios.get(`http://localhost:6060/tasks/${params.id}`, { headers: { 'Authorization': `Bearer ${authToken}` } }).
            then((data: any) => {
                setTask(data.data)
            }
            ).catch(error => {
                router.push('/login')
            })
    }, [params.id])
    return (
        <div><h1>{task.Title}</h1> </div>
    )
}

export default TaskDetail