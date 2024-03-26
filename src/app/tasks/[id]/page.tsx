"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import MultiSelectDropdown from '@/app/components/dropdown';
// import { TaskStatus } from '@/enum/taskEnums';
// import MyCalendar from '@/components/calender';
import { TaskStatus } from '@/app/enum/taskEnums';
import WYSIWYG from '@/app/components/wyiswyg';
import { toast } from 'react-toastify';

const TaskDetail = ({ params }: { params: { id: string } }) => {
    const isAdmin = sessionStorage.getItem('isadmin');
    const [title, setTitle]: any = useState('')
    const [date, setDate]: any = useState(new Date())
    const [description, setDescription]: any = useState('')
    let [users, setUsers]: any = useState([]);
    const [assignedUsers, setAssignedUser]: any = useState([]);
    const [taskStatus, setTaskStatus]: any = useState([])
    const [rows, setRows]: any = useState([]);
    const [file, setFile]: any = useState('')

    const addRow = () => {
        console.log('Adding Rows')
        setRows((rows: any) => {
            const updatedRow = [...rows, <div className={'flex justify-between'} key={rows.length}>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Task Status:</label>
                    <MultiSelectDropdown
                        options={[
                            { value: 'todo', label: 'To Do' },
                            { value: 'inprogress', label: 'In Progress' },
                            { value: 'done', label: 'Done' }
                        ]}
                        value={taskStatus[rows.length]}
                        onChange={(status: any) => handleTaskStatusChange(status, rows.length)}
                        isMulti={false}
                    />
                </div>

                <div className="mb-4 w-1/2">
                    <label htmlFor="users" className="block text-gray-700 font-bold mb-2">Select Assignees</label>
                    <MultiSelectDropdown
                        options={users}
                        value={assignedUsers[rows.length]}
                        onChange={(u: any) => handleUserSelectChange(u, rows.length)}
                        isMulti={false}
                    />
                </div>
                <div className="mb-6">
                    <input type="button" onClick={deleteRows.bind(null, rows.length)} className="bg-blue-500 text-white px-4 py-2 mt-4" value='Delete' />
                </div>
            </div>]
            // taskStatus.push({ value: '', label: '', index: rows.length })
            // assignedUsers.push({ label: '', value: '', index: rows.length })

            // setTaskStatus(taskStatus);
            // setAssignedUser(assignedUsers)
            // console.log('After row is added', assignedUsers)
            // console.log('Row after added', updatedRow);
            return updatedRow;
        });


    };
    const router = useRouter();

    const handleChange = (e: any) => {
        if (e.target.name == 'title') {
            setTitle(e.target.value)
        } else if (e.target.name == 'description') {
            setDescription(e.target.value)
        }
    }

    const handleEditor = (desc: any) => {
        console.log(desc)
        setDescription(desc)
    }

    const handleUserSelectChange = (assignedUser: any, index: number) => {
        setAssignedUser((user: any) => {
            // console.log(user);
            const updatedUser = [...user]
            updatedUser[index] = { ...assignedUser, index }
            // console.log(updatedUser)
            return updatedUser
        });

    };

    const handleTaskStatusChange = (status: any, index: number) => {
        setTaskStatus((task: any) => {
            const updatedStatus = [...task];
            updatedStatus[index] = { ...status, index }
            return updatedStatus;
        });
    };

    // when form is submitted
    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Submitted')
        const taskObject = {
            Title: title,
            Description: description,
            AssignedUsers: [...assignedUsers.map((u: any, idx: number) => {
                return {
                    UserId: u.value,
                    Emailaddress: u.label,
                    TaskStatus: taskStatus[idx]?.value
                }
            })]
        }
        console.log(taskObject)
        const authToken = sessionStorage.getItem('token');
        if (params.id != '0') {
            // update the task
            axios.put(`http://localhost:6060/tasks/${params.id}`, taskObject, { headers: { 'Authorization': `Bearer ${authToken}` } }).
                then((response: any) => {
                    // alert('Record saved')
                    console.log(response)
                    toast.success("Record saved");
                }
                ).catch(error => {
                    console.error(error)
                    sessionStorage.clear();
                    router.push('/login')
                })

        } else {
            // create new task
            axios.post(`http://localhost:6060/tasks`, taskObject, { headers: { 'Authorization': `Bearer ${authToken}` } }).
                then((response: any) => {
                    console.log(response)
                    router.push(`/tasks/${response.data.guid}`)
                    toast.success("Record saved");
                }
                ).catch(error => {
                    console.error(error)
                    sessionStorage.clear();
                    router.push('/login')
                })

        }

    }


    useEffect(() => {
        console.log('Use Effect of Task Detail page')
        const authToken = sessionStorage.getItem('token');

        // run this when update is done
        if (params.id != '0') {
            axios.get(`http://localhost:6060/tasks/${params.id}`, { headers: { 'Authorization': `Bearer ${authToken}` } }).
                then((data: any) => {
                    setTitle(data.data.Title)
                    setDescription(data.data.Description)
                    setDate(data.data.CreationDate)
                    console.log(data.data)
                    let rowDropDown: any = [];
                    let status: any = [];
                    let assignedUsersPerTask: any = [];
                    data.data.AssignedUsers
                        .forEach((d: any, idx: number) => {
                            status.push({ value: d.TaskStatus, label: TaskStatus[d.TaskStatus as keyof typeof TaskStatus], index: idx })
                            assignedUsersPerTask.push({ label: d.Emailaddress, value: d.UserId, index: idx })
                            // handleTaskStatusChange({ value: d.TaskStatus, label: TaskStatus[d.TaskStatus as keyof typeof TaskStatus] }, idx)
                            // handleUserSelectChange({ label: d.Emailaddress, value: d.UserId }, idx)
                            rowDropDown.push(<div className={'flex justify-between'} key={idx}>
                                <div className="mb-4">
                                    <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Task Status:</label>
                                    <MultiSelectDropdown
                                        options={[
                                            { value: 'todo', label: 'To Do' },
                                            { value: 'inprogress', label: 'In Progress' },
                                            { value: 'done', label: 'Done' }
                                        ]}
                                        value={status[idx]}
                                        onChange={(status: any) => handleTaskStatusChange(status, idx)}
                                        isMulti={false}
                                    />
                                </div>

                                <div className="mb-4 w-1/2">
                                    <label htmlFor="users" className="block text-gray-700 font-bold mb-2">Select Assignees</label>
                                    <MultiSelectDropdown
                                        options={users}
                                        value={assignedUsersPerTask[idx]}
                                        onChange={(u: any) => handleUserSelectChange(u, idx)}
                                        isMulti={false}
                                    />
                                </div>
                                <div className="mb-6">
                                    <input type="button" onClick={deleteRows.bind(null, idx)} className="bg-blue-500 text-white px-4 py-2 mt-4" value='Delete' />
                                </div>
                            </div>)

                        })
                    // console.log('Inside',assignedUsersPerTask)
                    setTaskStatus(status)
                    setAssignedUser(assignedUsersPerTask)
                    setRows(rowDropDown);
                    // console.log(rowDropDown)
                    // console.log('Assigned Users', assignedUsers)

                }
                ).catch(error => {
                    console.error(error)
                    sessionStorage.clear();
                    router.push('/login')
                })
        }

        // user list
        axios.get(`http://localhost:6060/users?pageSize=0`, { headers: { 'Authorization': `Bearer ${authToken}` } }).
            then((data: any) => {
                setUsers(data.data.filter((u: any) => u.EmailAddress != 'admin@admin.com').map((u1: any) => { return { value: u1.UserId, label: u1.EmailAddress } }))
            }
            ).catch(error => {
                console.error(error)
                sessionStorage.clear();
                router.push('/login')
            })
    }, [])
    // console.log('AssignedUsers', assignedUsers)
    // console.log('Rows', rows)

    const deleteRows = (index: any) => {
        console.log('Deleted Items at index ', index)
        // console.log(rows)
        toast.success("Rows Deleted");

        setRows((prevRows: any[]) => {
            // console.log('prev Rows', prevRows)
            const idx = prevRows.findIndex((pr: any) => Number(pr.key) == index)
            // console.log(idx)
            prevRows.splice(idx, 1)
            // console.log('Rows After deleted ', prevRows);
            return prevRows
        });
        // console.log('AU',assignedUsers)
        setAssignedUser((prevUsers: any) => {
            // console.log('Prev User', prevUsers)
            const updatedUsers = [...prevUsers];
            const idx = updatedUsers.findIndex((pr: any) => pr.index == index)
            // console.log(idx)
            updatedUsers.splice(idx, 1)
            // console.log('Rows after updated', updatedUsers)
            return updatedUsers;
        });
        setTaskStatus((prevStatus: any) => {
            const updatedStatus = [...prevStatus];
            const idx = updatedStatus.findIndex((pr: any) => pr.index == index)
            updatedStatus.splice(idx, 1);
            return updatedStatus;
        });
    }




    const handleFileChange = (e: any) => {
        console.log(e.target.files?.[0])

    }

    // const handleDate = (date: any) => {
    //     setDate(date);
    // }
    // console.log('Outside',rows)
    // not best way to do
    users = users.filter((u: any) => !assignedUsers.map((au: any) => au.value).includes(u.value))

    return (
        <div>
            <form encType="multipart/form-data" className={" mx-auto h-[80vh] overflow-y-auto border border-gray-300 p-4 w-[50vw]"} onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
                    <input type="text" onChange={handleChange} value={title} id="title" name="title" className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} />
                </div>

                {/* <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description:</label>
                    <textarea id="description" onChange={handleChange} name="description" value={description} rows={5} className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}></textarea>
                </div> */}

                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description:</label>
                    <WYSIWYG content={description} handleChange={handleEditor} />
                </div>

                {/* <div className="mb-4">
                    <label htmlFor="file" className="block text-gray-700 font-bold mb-2">Upload File:</label>
                    <input type="file" id="file" name="file" onChange={handleFileChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div> */}


                {/* <div className={"mb-4"}>
                    <label htmlFor="time" className="block text-gray-700 font-bold mb-2">Created Date:</label>

                    <MyCalendar handleDate={handleDate} date={date} />
                </div> */}

                {isAdmin == 'true' ? (<div className="mb-6">
                    <label htmlFor="assignee" className="block text-gray-700 font-bold mb-2">Assignee Section</label>
                    <input type="button" onClick={addRow} className="bg-blue-500 text-white px-4 py-2 mt-4" value='Add more Assignee?' />
                </div>) : <></>}

                {rows.map((row: any, idx: number) => <div key={idx}>{row}</div>)}

                <div className="mb-6">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
                </div>
            </form>
        </div>
    )
}

export default TaskDetail