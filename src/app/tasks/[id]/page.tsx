"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import MultiSelectDropdown from '@/components/dropdown';
// import { TaskStatus } from '@/enum/taskEnums';
// import MyCalendar from '@/components/calender';
import { TaskStatus } from '@/enum/taskEnums';

const TaskDetail = ({ params }: { params: { id: string } }) => {
    const [title, setTitle]: any = useState('')
    const [date, setDate]: any = useState(new Date())
    const [description, setDescription]: any = useState('')
    let [users, setUsers]: any = useState([]);
    const [assignedUsers, setAssignedUser]: any = useState([]);
    const [existingUsers, setExistingUser]: any = useState([]);

    const [taskStatus, setTaskStatus]: any = useState([])
    const [rows, setRows]: any = useState([]);
    const [file, setFile]: any = useState('')

    const addRow = () => {
        setRows((rows: any) => {
            return [...rows, <div className={'flex justify-between'} key={assignedUsers.length}>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Task Status:</label>
                    <MultiSelectDropdown
                        options={[
                            { value: 'todo', label: 'To Do' },
                            { value: 'inprogress', label: 'In Progress' },
                            { value: 'done', label: 'Done' }
                        ]}
                        value={taskStatus[assignedUsers.length]}
                        onChange={(status: any) => handleTaskStatusChange(status, assignedUsers.length)}
                        isMulti={false}
                    />
                </div>

                <div className="mb-4 w-1/2">
                    <label htmlFor="users" className="block text-gray-700 font-bold mb-2">Select Assignees</label>
                    <MultiSelectDropdown
                        options={users}
                        value={assignedUsers[assignedUsers.length]}
                        onChange={(u: any) => handleUserSelectChange(u, assignedUsers.length)}
                        isMulti={false}
                    />
                </div>
            </div>]
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

    const handleUserSelectChange = (assignedUser: any, index: number) => {
        setAssignedUser((user: any) => {
            // console.log(user);
            const updatedUser = [...user]
            updatedUser[index] = { ...assignedUser, index: index }
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

        // update the task and assign the users
        axios.put(`http://localhost:6060/tasks/${params.id}`, taskObject, { headers: { 'Authorization': `Bearer ${authToken}` } }).
            then((response: any) => {
                alert('Record saved')
            }
            ).catch(error => {
                console.error(error)
                router.push('/login')
            })

    }


    useEffect(() => {
        console.log('Use Effect of Task Detail page')
        const authToken = sessionStorage.getItem('token');
        axios.get(`http://localhost:6060/tasks/${params.id}`, { headers: { 'Authorization': `Bearer ${authToken}` } }).
            then((data: any) => {
                setTitle(data.data.Title)
                setDescription(data.data.Description)
                setDate(data.data.CreationDate)
                setExistingUser(data.data.AssignedUsers)
                data.data.AssignedUsers
                    .forEach((d: any, idx: number) => {
                        handleTaskStatusChange({ value: d.TaskStatus, label: TaskStatus[d.TaskStatus as keyof typeof TaskStatus] }, idx)
                        handleUserSelectChange({ label: d.Emailaddress, value: d.UserId }, idx)
                    })
            }
            ).catch(error => {
                console.error(error)
                router.push('/login')
            })
        // user list
        axios.get(`http://localhost:6060/users?pageSize=0`, { headers: { 'Authorization': `Bearer ${authToken}` } }).
            then((data: any) => {
                setUsers(data.data.filter((u: any) => u.EmailAddress != 'admin@admin.com').map((u1: any) => { return { value: u1.UserId, label: u1.EmailAddress } }))
            }
            ).catch(error => {
                console.error(error)
                router.push('/login')
            })
    }, [])

    const handleFileChange = (e: any) => {
        console.log(e.target.files?.[0])

    }

    const handleDate = (date: any) => {
        setDate(date);
    }
    // not best way to do
    users = users.filter((u: any) => !assignedUsers.map((au: any) => au.value).includes(u.value))

    return (
        <div>
            <form encType="multipart/form-data" className={" mx-auto h-[80vh] overflow-y-auto border border-gray-300 p-4 w-[50vw]"} onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
                    <input type="text" onChange={handleChange} value={title} id="title" name="title" className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"} />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Description:</label>
                    <textarea id="description" onChange={handleChange} name="description" value={description} rows={5} className={"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"}></textarea>
                </div>


                <div className="mb-4">
                    <label htmlFor="file" className="block text-gray-700 font-bold mb-2">Upload File:</label>
                    <input type="file" id="file" name="file" onChange={handleFileChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>


                {/* <div className={"mb-4"}>
                    <label htmlFor="time" className="block text-gray-700 font-bold mb-2">Created Date:</label>

                    <MyCalendar handleDate={handleDate} date={date} />
                </div> */}
                
                <div className="mb-6">
                    <label htmlFor="assignee" className="block text-gray-700 font-bold mb-2">Assignee Section</label>
                    <input type="button" onClick={addRow} className="bg-blue-500 text-white px-4 py-2 mt-4" value='Add more Assignee?' />
                </div>
                {existingUsers.map((user: any, index: number) => (
                    <div key={index} className={'flex justify-between'}>
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Task Status:</label>
                            <MultiSelectDropdown
                                options={[
                                    { value: 'todo', label: 'To Do' },
                                    { value: 'inprogress', label: 'In Progress' },
                                    { value: 'done', label: 'Done' }
                                ]}
                                value={taskStatus[index]}
                                onChange={(status: any) => handleTaskStatusChange(status, index)}
                                isMulti={false}
                            />
                        </div>

                        <div className="mb-4 w-1/2">
                            <label htmlFor="users" className="block text-gray-700 font-bold mb-2">Select Assignees</label>
                            <MultiSelectDropdown
                                options={users}
                                value={assignedUsers[index]}
                                onChange={(user: any) => handleUserSelectChange(user, index)}
                                isMulti={false}
                            />

                        </div>
                    </div>
                ))}
                {rows.map((r: any, idx: number) => { return (<div key={idx}>{r}</div>) })}
                {/* {rows} */}
                <div className="mb-6">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
                </div>
            </form>
        </div>
    )
}

export default TaskDetail