"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const Tasks = () => {
    const router = useRouter()
    const [tasks, setTask]: any = useState([])
    const [page, setPage]: any = useState(1)
    const [pageSize, setPageSize]: any = useState(20)
    const [search, setSearch]: any = useState('')
    const [orderBy, setOrderBy]: any = useState('title')
    const [orderDir, setOrderDir]: any = useState('ASC')
    const [total, setTotal]: any = useState()

    const handleClick = (count: any) => {
        setPage(count)
    }
    useEffect(() => {
        console.log('Use Effect of task list page')
        const authToken = sessionStorage.getItem('token');
        axios.get(`http://localhost:6060/tasks?search=${search}&pageSize=${pageSize}&page=${page}&orderBy=${orderBy}&orderDir=${orderDir}`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).
            then((res: any) => {
                setTask(res.data)
                setTotal(Number(res.headers['x-count']) || 0)
            }
            ).catch((error) => {
                console.error(error)
                router.push('/login')
            })
    }, [pageSize, page, search, orderBy, orderDir]) // we should call this api when [...value....] <value of this property are changed>
    // if we want to update call useEffect when some thing is changed then we have to pass some value

    // the total page according to total data sent by database
    const totalPageAsPerTotalDataWithPageSize = Math.ceil(total / pageSize)
    const arr = [];
    for (let i = page; i <= totalPageAsPerTotalDataWithPageSize; i++) {
        arr.push(i)
    }
    return (
        <div className={'container m-auto'}>
            <h2>List of Task</h2>
            <table>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>CreationDate</th>
                    <th>ModifiedDate</th>
                </tr>
                {tasks.map((t: any) => (
                    <tr key={t.TaskId}>
                        <td>{t.Title}</td>
                        <td>{t.Description.substring(0, 10)}...</td>
                        <td>{t.CreationDate}</td>
                        <td>{t.ModifiedDate}</td>
                        <Link href={`/tasks/${t.TaskId}`}><button>View</button></Link>
                    </tr>)
                )}
            </table>
            <div>
                {page - 1 >= 1 && (<button onClick={handleClick.bind(null, page - 1)}>{"Prev"}</button>)}
                {arr.map((ar: any) => (<button key={ar} className='m-10' onClick={handleClick.bind(null, ar)}>{ar}</button>))}
                {page + 1 <= Math.ceil(total / pageSize) && (<button onClick={handleClick.bind(null, page + 1)}>{"Next"}</button>)}
            </div>
        </div>
    )
}

export default Tasks