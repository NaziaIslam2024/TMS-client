import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";


const DragAndDrop = ({ initialState }) => {
    const axiosPublic = useAxiosPublic();
    console.log(initialState);
    const [data, setData] = useState(initialState);
    useEffect(() => {
        setData(initialState);
    },[initialState])
    
    console.log(data);
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
    const handleOnDrop = async(e, targetContainer) => {
        const item = dragItem.current;
        console.log("item");
        console.log(item);
        const sourceContainer = dragContainer.current;
        setData((prev) => {
            const newData = { ...prev };
            newData[sourceContainer] = newData[sourceContainer].filter((i) => i !== item);
            newData[targetContainer] = [...newData[targetContainer], item];
            return newData;
        });
        // await axiosPublic.put(`/tasks/${item.id}`)

    }
    const handleDragOver = (e) => {
        e.preventDefault();
    }
    const deleteTask = (id) => {
        console.log(id)
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
        <div className="flex gap-4 justify-around">
            {Object.keys(data).map((container, index) => {
                return (
                    <div
                        key={index}
                        onDrop={(e) => handleOnDrop(e, container)}
                        onDragOver={handleDragOver}
                        className="bg-gray-300 p-4 text-center space-y-3">
                        <h2 className="text-lg font-bold">{container}</h2>
                        {
                            data[container].map((item, idx) => {
                                return <div
                                    draggable
                                    onDragEnd={handleDragEnd}
                                    onDragStart={(e) => handleDragStart(e, item, container)}
                                    className="bg-white p-2 text-left cursor-move"
                                    key={idx}>
                                    {item.title} -- {item.id}
                                    <div className="flex justify-around mt-2">
                                        <span className='btn'
                                        // onClick={() => updateTask(task)}
                                        >✏️</span>
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