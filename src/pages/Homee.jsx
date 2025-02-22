import { useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useTodo from "../hooks/useTodo";
import DragAndDrop from "../components/DragAndDrop";
import axios from "axios";
import io from "socket.io-client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


const Homee = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
   
    //-----------------------------------------
    const [tasks, setTasks] = useState(null);
    const [userTasks, refetch, isPending, isError, error] = useTodo();
    const [initialData, setInitialData]  = useState(null);
    // const initialData = {
    //     Todo: [
    //         "Design mockup",
    //         "Setup project Repository",
    //         "Initialize Unit testing",
    //         "Integrate Payment gateway",
    //     ],
    //     "In Progress": ["Develop Authentication flow"],
    //     Done: [
    //         "Setup CI/CD pipeline",
    //         "Conduct code reviews",
    //     ],
    // }

    useEffect(() => {
        // socket.io connection
        const socket = io(`https://tms-server-sq5b.onrender.com/socket`);
    
        const handleNewThought = (thought) => {
          setThoughts((prevThoughts) => [...prevThoughts, thought]);
        };
    
        socket.on("newThought", handleNewThought);
    
        // Cleanup on component unmount
        return () => {
          socket.off("newThought", handleNewThought);
        };
      }, []); 
    async () => {
        //socket.io connection
        const socket = io(`localhost:4565/socket`);
    
        socket.on("newTask", (task) => {
          this.setState({ userTasks: [...this.state.userTasks, task] });
        });
    
       
    
        // await this.fetchThoughts();
        await refetch();
    };
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        // console.log(title, description);
        const obj = ({ title: title, description: description, taskOwner: user.email, timeStamp: Date.now(), category: "To-Do" })
        setTasks(obj);
        const res = await axiosPublic.post('/tasks', obj);
        console.log(res);
        if (res.data._id) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Task added successfully",
                showConfirmButton: false,
                timer: 900
            });
            // await refetch();
            // setTasks(obj);
        }
        // document.getElementById('task_add_modal').close();
    }
    console.log(userTasks);

    const order = ["To-Do", "In Progress", "Done"];
    const groupedData = userTasks.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push({
            "title": item.title, "id": item._id, "desc": item.description,
            "taskOwner": item.taskOwner, "timestamp": item.timeStamp
        });
        return acc;
    }, {});

    const orderedGroupedData = Object.fromEntries(
        order.map(key => [key, groupedData[key] || []])
    );

    console.log(orderedGroupedData);
    // setTasks(orderedGroupedData)


    if (isError) {
        return <p>{error.message}</p>
    }
    if (isPending) {
        return <h1>loading....</h1>
    }
    return (
        <div className="flex gap-10 my-10 p-10">
            <div className="lg:w-1/3">
                <form onSubmit={handleSubmit} className="card-body">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Task Title</span>
                        </label>
                        <input name="title" maxLength="50" type="text" placeholder="Title" className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Task Description</span>
                        </label>
                        <textarea name="description" maxLength="200" className="textarea textarea-bordered" placeholder="Description" required></textarea>
                    </div>
                    
                    <button className="btn">Add Task</button>
                </form>
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                {/* <button className="btn" onClick={() => document.getElementById('task_add_modal').showModal()}>Add Task</button>
                <dialog id="task_add_modal" className="modal modal-bottom sm:modal-middle bg-green-300 bg-opacity-30">
                    <div className="modal-box">
                        <div className="modal-action">
                            <form onSubmit={handleSubmit} className="card-body modal-backdrop" method="dialog">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Task Title</span>
                                    </label>
                                    <input name="title" maxLength="50" type="text" placeholder="Title" className="input input-bordered" required />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Task Description</span>
                                    </label>
                                    <textarea name="description" maxLength="200" className="textarea textarea-bordered" placeholder="Description" required></textarea>
                                </div>
                                <button className="btn">Add Task</button>
                            </form>
                        </div>
                    </div>
                </dialog> */}
            </div>
            <div className="lg:w-2/3">
                {/* <div className='board bg-gray-900 flex gap-4 p-4 w-full'>
                    <div className='todo bg-gray-400 space-y-4 p-2 w-1/3'
                        // onDrop={handleOnDrop}
                        // onDragOver={onDragOver}
                        // data-status={TODO}
                    >
                        <h2 className='todo-col text-center'>Todo</h2>
                        {
                            userTasks.length > 0 && userTasks.map((task) => (
                                task.category === "TODO" && <div
                                    // onDrag={(e) => handleDrag(e, task)}
                                    // draggable
                                    key={task._id}
                                    className='task-item bg-white p-2 cursor-move'>
                                    {task.title}
                                    <div className="flex justify-around mt-2">
                                        <span className='btn'
                                            // onClick={() => updateTask(task)}
                                        >✏️</span>
                                        <span
                                            // onClick={(e) => deleteTask(task)}
                                            className='btn'>🗑️</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className='todo bg-gray-400 space-y-4 p-2 w-1/3'
                        // onDrop={handleOnDrop}
                        // onDragOver={onDragOver}
                        // data-status={TODO}
                    >
                        <h2 className='todo-col text-center'>In-Progress</h2>
                        {
                            userTasks.length > 0 && userTasks.map((task) => (
                                task.category === "DOING" && <div
                                    // onDrag={(e) => handleDrag(e, task)}
                                    // draggable
                                    key={task._id}
                                    className='task-item bg-white p-2 cursor-move'>
                                    {task.title}
                                    <div className="flex justify-around mt-2">
                                        <span className='btn'
                                            // onClick={() => updateTask(task)}
                                        >✏️</span>
                                        <span
                                            // onClick={(e) => deleteTask(task)}
                                            className='btn'>🗑️</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    <div className='todo bg-gray-400 space-y-4 p-2 w-1/3'
                        // onDrop={handleOnDrop}
                        // onDragOver={onDragOver}
                        // data-status={TODO}
                    >
                        <h2 className='todo-col text-center'>Done</h2>
                        {
                            userTasks.length > 0 && userTasks.map((task) => (
                                task.category === "DONE" && <div
                                    // onDrag={(e) => handleDrag(e, task)}
                                    // draggable
                                    key={task._id}
                                    className='task-item bg-white p-2 cursor-move'>
                                    {task.title}
                                    <div className="flex justify-around mt-2">
                                        <span className='btn'
                                            // onClick={() => updateTask(task)}
                                        >✏️</span>
                                        <span
                                            // onClick={(e) => deleteTask(task)}
                                            className='btn'>🗑️</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div> */}
                <DragAndDrop initialState={orderedGroupedData}></DragAndDrop>
            </div>
        </div>
    );
};

export default Homee;