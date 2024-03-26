"use client"
import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchContext } from '@/app/components/navbar';
import { toast } from 'react-toastify';

const Tasks = () => {
    const isAdmin = sessionStorage.getItem('isadmin');
    const router = useRouter()
    const [tasks, setTask]: any = useState([])
    const [page, setPage]: any = useState(1)
    const [pageSize, setPageSize]: any = useState(20)
    const [orderBy, setOrderBy]: any = useState('title')
    const [orderDir, setOrderDir]: any = useState('ASC')
    const [total, setTotal]: any = useState()

    const search = useContext(SearchContext);
    const handleClick = (count: any) => {
        setPage(count)
    }
    const handleDropDown = (e: any) => {
        setPageSize(Number(e.target.value))
    }
    const handleTaskDelete = (taskId: string) => {
        console.log('Delete')
        const authToken = sessionStorage.getItem('token');
        axios.delete(`http://localhost:6060/tasks/${taskId}`,
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).
            then((res: any) => {
                console.log(res)
                toast.success("Record Deleted");
            }
            ).catch((error) => {
                console.error(error)
                sessionStorage.clear();
                router.push('/login')
            })

        // call list api after delete is done
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
                sessionStorage.clear();
                router.push('/login')
            })
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
                sessionStorage.clear();
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
        <>
            <div className={'container m-auto h-[80vh] flex flex-col justify-between'}>
                <table className={'min-w-full divide-y divide-gray-200'}>
                    <thead>
                        <tr>
                            <th className={'px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'}>Title</th>
                            <th className={'px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'}>Description</th>
                            <th className={'px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'}>CreationDate</th>
                            <th className={'px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'}>ModifiedDate</th>
                            {isAdmin == 'true' ? <></> : <th className={'px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'}>TaskStatus</th>}
                        </tr>
                    </thead>
                    <tbody className={'bg-white divide-y divide-gray-200'}>
                        {tasks.map((t: any) => (
                            <tr key={t.TaskId} className={''}>
                                <td className={'px-6 py-4 whitespace-no-wrap'}>{t.Title}</td>
                                <td className={'px-6 py-4 whitespace-no-wrap'}>{t.Description.substring(0, 10)}...</td>
                                <td className={'px-6 py-4 whitespace-no-wrap'}>{t.CreationDate}</td>
                                <td className={'px-6 py-4 whitespace-no-wrap'}>{t.ModifiedDate}</td>
                                {isAdmin == 'true' ? <></> : <td className={'px-6 py-4 whitespace-no-wrap'}>{t.TaskStatus}</td>}
                                <td><button className={'px-2 rounded-full border bg-blue-400  hover:bg-yellow-600'}><Link href={`/tasks/${t.TaskId}`}>View</Link></button></td>
                                <td><input onClick={handleTaskDelete.bind(null, t.TaskId)} type="button" className={'px-2 w-fit rounded-full border bg-blue-400  hover:bg-yellow-600 hover:cursor-pointer text-center'} value='Delete' /></td>
                            </tr>)
                        )}
                    </tbody>
                </table>
                <div className={'flex justify-center'}>
                    <div className={'pagination flex w-1/2'}>
                        {page - 1 >= 1 && (<div className={'h-10 flex justify-center items-center'}><button className={'w-7 rounded-full border border-blue-500 hover:bg-yellow-500'} onClick={handleClick.bind(null, page - 1)}>{"<<"}</button></div>)}
                        <div className={'w-full h-10 flex justify-center items-center'}>
                            {arr.map((ar: any) => (<button key={ar} className={'w-7 rounded-full border border-blue-500 ' + `${page == ar ? ' bg-yellow-500' : ''}`} onClick={handleClick.bind(null, ar)}>{ar}</button>))}
                        </div>
                        {page + 1 <= Math.ceil(total / pageSize) && (<div className={'h-10 flex justify-center items-center'}><button className={'w-7 rounded-full border border-blue-500  hover:bg-yellow-500'} onClick={handleClick.bind(null, page + 1)}>{">>"}</button></div>)}
                    </div>
                    <div className={'flex justify-end w-1/4'}>
                        <select className={'text-black'} defaultValue={pageSize} onChange={handleDropDown}>
                            <option value="1">1</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </div>


            </div>
        </>
    )

}

export default Tasks