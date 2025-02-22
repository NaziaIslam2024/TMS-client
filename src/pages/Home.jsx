import useAuth from "../hooks/useAuth";
import { MdDeleteOutline } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Home = () => {
    const { user, logout } = useAuth();
    const handleLogout = () => {
        logout()
            .then(() => {
                Navigate('/login');
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    const TODO = 'TODO';
    const DOING = 'DOING';
    const DONE = 'DONE';
    const [value, setValue] = useState('');
    const [tasks, setTasks] = useState([]);

    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const handleKeyDown = (e) => {
        console.log(e.keyCode);
        if (e.keyCode === 13) {
            const obj = {
                title: value,
                status: TODO,
                id: Date.now()
            }
            setTasks((prevTasks) => [...prevTasks, obj]);
            setValue('');
        }
    }
    console.log(tasks)
    console.log(value)
    return (
        <div className="lg:flex lg:gap-10 mb-8">
            <div>
                <img className="rounded-full w-10" src={user.photoURL} alt="" />
                <h1>Welcome, {user.displayName}</h1>
                {
                    user && <button onClick={handleLogout}>Logout</button>
                }
            </div>
            <div className="flex gap-10"> 
                <div className="text-center my-4">
                    <h1 className="text-3xl font-bold">Task</h1>
                    <input
                        onChange={handleChange}
                        value={value}
                        onKeyDown={handleKeyDown}
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered input-lg w-full max-w-xs" />
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <fieldset className="fieldset">
          <label className="fieldset-label">Email</label>
          <input type="email" className="input" placeholder="Email" />
          <label className="fieldset-label">Password</label>
          <input type="password" className="input" placeholder="Password" />
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      </div>
    </div>
                <div className="board flex gap-4">
                    {/* todo */}
                    <div className="todo w-1/3">
                        <h2 className="bg-red-100 p-3 mb-3 text-center">Todo</h2>
                        {
                            tasks.length && tasks.map((task, i) => 
                                task.status === TODO && <div 
                                    key={i} 
                                    draggable
                                    className="card border border-red-400 shadow-xl mb-1">
                                    <div className="card-body">
                                        <h2 className="card-title">{task.title}</h2>
                                        <p>Task description</p>
                                        <div className="card-actions justify-end">
                                            <button className="btn btn-circle shadow-lg text-2xl">
                                                <GoPencil />
                                            </button>
                                            <button className="btn btn-circle shadow-lg text-2xl">
                                                <MdDeleteOutline />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    {/* in progress */}
                    <div className="todo w-1/3">
                        <h2 className="bg-amber-100 p-3 mb-3 text-center">In progress</h2>
                        <div className="card border border-amber-400 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Task Title</h2>
                                <p>Task description</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-circle shadow-lg text-2xl">
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg> */}
                                        <GoPencil />
                                    </button>
                                    <button className="btn btn-circle shadow-lg text-2xl">
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg> */}
                                        <MdDeleteOutline />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* done  */}
                    <div className="w-1/3">
                        <h2 className="bg-green-200 p-3 mb-3 text-center">Done</h2>
                        <div className="card border border-green-200 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Task Title</h2>
                                <p>Task description</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-circle shadow-lg text-2xl">
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg> */}
                                        <GoPencil />
                                    </button>
                                    <button className="btn btn-circle shadow-lg text-2xl">
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg> */}
                                        <MdDeleteOutline />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;