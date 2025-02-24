import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";


const DragAndDrop = ({ initialState }) => {
    const axiosPublic = useAxiosPublic();
    // console.log(initialState);
    const [data, setData] = useState(initialState);
    useEffect(() => {
        setData(initialState);
    }, [initialState])

    // console.log(data);
    const dragItem = useRef();
    const dragContainer = useRef();

    const handleDragStart = (e, item, container) => {
        dragItem.current = item;
        dragContainer.current = container;
        e.target.style.opacity = "0.5";
    }
    const handleDragEnd = (e) => {
        e.target.style.opacity = "1";
    }
    const handleOnDrop = async (e, targetContainer) => {
        const item = dragItem.current;
        console.log("item-->");
        console.log(item);
        const sourceContainer = dragContainer.current;
        console.log("target Container-->");
        console.log(targetContainer);
        const res = await axiosPublic.put(`/taskUpdate/${item.id}`, { "targetContainer": targetContainer });
        console.log(res.data);
        setData((prev) => {
            const newData = { ...prev };
            newData[sourceContainer] = newData[sourceContainer].filter((i) => i !== item);
            newData[targetContainer] = [...newData[targetContainer], item];
            return newData;
        });


    }
    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const updateTask = (item, container) => {
        // console.log("update item--------------->",item, container)
        document.getElementById('task_update_modal').showModal();
        document.getElementById("itemId").value = item.id;
        document.getElementById("title").value = item.title;
        document.getElementById("desc").value = item.desc;  
        document.getElementById("category").value = container;  
    }

    const handleClickCross = () => {
        document.getElementById('task_update_modal').close();
    }

    const handleUpdateSubmit = async(e) => {
        e.preventDefault();
        const itemId = e.target.itemId.value;
        const UpdatedItem = {updatedTitle: e.target.title.value, updatedDesc: e.target.desc.value, category:e.target.category.value}
        console.log("update item--------------->",UpdatedItem);
        const res = await axiosPublic.put(`/UpdateTaskProperty/${itemId}`, { "UpdatedItem": UpdatedItem });
        console.log(res);
        if(res.data.__v === 0){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your Task is updated",
                showConfirmButton: false,
                timer: 1500
            });
        }
        document.getElementById('task_update_modal').close();
    }

    const deleteTask = (id) => {
        // console.log(id)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axiosPublic.delete(`/tasks/${id}`)
                        .then(res => {
                            if (res.data._id) {
                                Swal.fire({
                                    title: "Deleted!",
                                    text: "Task has been deleted.",
                                    icon: "success"
                                });
                            }
                        })
                }
            });
    }
    return (
        <div className="grid lg:grid-cols-3 gap-5">
            {Object.keys(data).map((container, index) => {
                return (
                    <div
                        key={index}
                        onDrop={(e) => handleOnDrop(e, container)}
                        onDragOver={handleDragOver}
                        className="bg-[#716c84] bg-opacity-70 p-4 text-center space-y-3">
                        <h2 className="text-lg font-bold">{container}</h2>
                        {
                            data[container].map((item, idx) => {
                                return <div
                                    draggable
                                    onDragEnd={handleDragEnd}
                                    onDragStart={(e) => handleDragStart(e, item, container)}
                                    className="bg-white p-2 text-left cursor-move"
                                    key={idx}>
                                    <h1 className="font-bold">{item.title}</h1>
                                    <p className="text-gray-700 text-sm my-2">{item.desc}</p>
                                    <div className="flex justify-around mt-2">
                                        <span className='btn'
                                            onClick={() => updateTask(item, container)}
                                        >✏️</span>
                                        <dialog id="task_update_modal" className="modal modal-bottom sm:modal-middle">
                                            <div className="modal-box">
                                                <div className="modal-action">
                                                    <form onSubmit={handleUpdateSubmit} className="card-body" method="dialog">
                                                        <span onClick={handleClickCross} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</span>
                                                        <div className="form-control">
                                                            <label className="label">
                                                                <span className="label-text">Task Title</span>
                                                            </label>
                                                            <input id="itemId" type="text" hidden />
                                                            <input id="title" name="title" maxLength="50" type="text" placeholder="Title" className="input input-bordered" required />
                                                        </div>
                                                        <div className="form-control">
                                                            <label className="label">
                                                                <span className="label-text">Task Description</span>
                                                            </label>
                                                            <textarea id="desc" name="desc" maxLength="200" className="textarea textarea-bordered" placeholder="Description" required></textarea>
                                                        </div>
                                                        <div className="form-control">
                                                            <label className="label">
                                                                <span className="label-text">Task Category</span>
                                                            </label>
                                                            <textarea readOnly id="category" name="category" maxLength="200" className="textarea textarea-bordered" placeholder="Description" required></textarea>
                                                        </div>
                                                        <button className="btn mt-4">Update Task</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </dialog>
                                        <span
                                            onClick={() => deleteTask(item.id)}
                                            className='btn'>🗑️</span>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                )
            })}
        </div>
    );
};

export default DragAndDrop;