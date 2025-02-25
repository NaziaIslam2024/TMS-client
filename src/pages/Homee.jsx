import { useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import useTodo from "../hooks/useTodo";
import DragAndDrop from "../components/DragAndDrop";
// import axios from "axios";
import io from "socket.io-client";

import { useQuery } from "@tanstack/react-query";
import { GoPlus } from "react-icons/go";


const Homee = () => {
    
    const [uTasks, setuTasks] = useState([]);
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
   
    //-----------------------------------------
    const [tasks, setTasks] = useState(null);
    const [unTasks, urefetch, uisPending, uisError, uerror] = useTodo();
    const order = ["To-Do", "In Progress", "Done"];
    let groupedData = unTasks.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push({
            "title": item.title, "id": item._id, "desc": item.description,
            "taskOwner": item.taskOwner, "timestamp": item.timeStamp
        });
        return acc;
    }, {});

    let orderedGroupedData = Object.fromEntries(
        order.map(key => [key, groupedData[key] || []])
    );

    const [oTData, setoTData] = useState(orderedGroupedData); 
    // const [userTasks, refetch, isPending, isError, error] = useTodo();
    // setuTasks(userTasks);
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
    const [allTasks, setAllTasks] = useState([]);
    const { data: userTasks = [], refetch, isPending, isError, error } = useQuery({
        queryKey: ['userTasks'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/tasks/${user.email}`);
            setAllTasks(res.data);
            return res.data;
        },
        // refetchInterval: 100,
    });

    // console.log(allTasks);
    // const order = ["To-Do", "In Progress", "Done"];
    // let groupedData = allTasks.reduce((acc, item) => {
    //     if (!acc[item.category]) {
    //         acc[item.category] = [];
    //     }
    //     acc[item.category].push({
    //         "title": item.title, "id": item._id, "desc": item.description,
    //         "taskOwner": item.taskOwner, "timestamp": item.timeStamp
    //     });
    //     return acc;
    // }, {});

    // let orderedGroupedData = Object.fromEntries(
    //     order.map(key => [key, groupedData[key] || []])
    // );
    
    useEffect(() => {
        // socket.io connection
        const socket = io(`https://tms-server-sq5b.onrender.com/socket`);
        // const socket = io(`http://localhost:4564/socket`);
    
        const handleNewTask = (task) => {
            // console.log("task");
            // console.log(task);
            // setuTasks(userTasks);
            // console.log(userTasks);
            console.log("task")
            console.log(allTasks)
            setAllTasks([...allTasks, task] );
        };

        const handleUpdateTask = (task) => {
            const updatedTasks = allTasks.filter((task1) => {
                return task1._id !== task._id;
              });
            setAllTasks([...updatedTasks, task] );
        };
    
        socket.on("newTask", handleNewTask);

        socket.on("deletedTask", (id) => {
            const updatedTasks = allTasks.filter((task) => {
              return task._id !== id;
            });
            setAllTasks(updatedTasks)
        });

        socket.on("updateTask", handleUpdateTask);
    
        // Cleanup on component unmount
        // return () => {
        //   socket.off("newThought", handleNewThought);
        // };
      }, [allTasks]); 
    //   console.log(allTasks);

    // async () => {
    //     //socket.io connection
    //     const socket = io(`localhost:4565/socket`);
    
    //     socket.on("newTask", (task) => {
    //       this.setState({ userTasks: [...this.state.userTasks, task] });
    //     });
    
       
    
    //     // await this.fetchThoughts();
    //     await refetch();
    // };
    
    const handleClickCross = () => {
        document.getElementById('task_add_modal').close();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        // console.log(title, description);
        const obj = ({ title: title, description: description, taskOwner: user.email, timeStamp: Date.now(), category: "To-Do" })
        setTasks(obj);
        const res = await axiosPublic.post('/tasks', obj);
        // console.log(res);
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
        document.getElementById('task_add_modal').close();
    }
    // console.log(userTasks);
    useEffect(() => {
    // const order = ["To-Do", "In Progress", "Done"];
        groupedData = allTasks.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push({
                "title": item.title, "id": item._id, "desc": item.description,
                "taskOwner": item.taskOwner, "timestamp": item.timeStamp
            });
            return acc;
        }, {});

        orderedGroupedData = Object.fromEntries(
            order.map(key => [key, groupedData[key] || []])
        );
    // useEffect(() => {
        setoTData(orderedGroupedData);
    
    }, [allTasks]); 
    // console.log(orderedGroupedData);
    // setTasks(orderedGroupedData)


    if (isError) {
        return <p>{error.message}</p>
    }
    if (isPending) {
        return <h1>loading....</h1>
    }
    return (
        <div className="lg:max-w-7xl lg:mx-auto mx-4 min-h-screen my-10">
            <div className="">
                {/* <form onSubmit={handleSubmit} className="card-body">
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
                </form> */}
                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <button className="btn mb-10" onClick={() => document.getElementById('task_add_modal').showModal()}><GoPlus className="text-xl" /> Add Task</button>
                <dialog id="task_add_modal" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <div className="modal-action">
                            <form onSubmit={handleSubmit} className="card-body" method="dialog">
                            <span onClick={handleClickCross} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</span>
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
                                <button className="btn"> Add Task</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
            <div>
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
                <DragAndDrop initialState={oTData}></DragAndDrop>
            </div>
        </div>
    );
};

export default Homee;