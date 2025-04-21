import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export const GoalDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [goal, setGoal] = useState(null)

    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [newGoalName, setNewGoalName] = useState("");


    const [stepTitle, setStepTitle] = useState("")
    const [stepDescription, setStepDescription] = useState("")

    const [editingStepId, setEditingStepId] = useState(null)
    const [editingStepTitle, setEditingStepTitle] = useState("")
    const [editingStepDescription, setEditingStepDescription] = useState("")

    const [showOptions, setShowOptions] = useState(false)
    const dropdownRef = useRef(null)
    

    const fetchGoal = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/goals/${id}/`)
            setGoal(res.data)
        } catch (err) {
            console.error("Error with getting goal detail", err)
        }
    }

    useEffect(() => {
        fetchGoal()
    }, [id])



    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowOptions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // goal
    const handleGoalEdit = () => {
        setNewGoalName(goal.name);
        setIsEditingGoal(true);
    };
    
    const handleGoalUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://127.0.0.1:8000/goals/${goal.id}/`, {
                name: newGoalName,
            });
            setIsEditingGoal(false);
            fetchGoal();
        } catch (err) {
            console.error("Error updating goal", err);
        }
    };
    
    const handleGoalDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this goal?");
        if (!confirmDelete) return;
    
        try {
            await axios.delete(`http://127.0.0.1:8000/goals/${goal.id}/`);
            navigate("/");
        } catch (err) {
            console.error("Error deleting goal", err);
        }
    };
    
    



    // step

    const handleStepCreate = async(e) => {
        e.preventDefault()
        try{
            await axios.post("http://127.0.0.1:8000/steps/", {
                title: stepTitle,
                description: stepDescription,
                goal: goal.id
            })
            setStepTitle("")
            setStepDescription("")
            fetchGoal()
            const modal = document.getElementById("step-form")
        if (modal) {
            modal.close()
        }
            fetchGoal()
        } catch (err) {
            console.error("error with creating step", err)
        }
    }


    const handleStepEdit = async(step) => {
        setEditingStepId(step.id)
        setEditingStepTitle(step.title)
        setEditingStepDescription(step.description)
    }
    const handleStepUpdate = async(e) => {
        e.preventDefault()
        try{
             await axios.patch(`http://127.0.0.1:8000/steps/${editingStepId}/`,
                {
                    title:editingStepTitle,
                    description: editingStepDescription
                }
                
            )
            setEditingStepId(null)
            setEditingStepTitle("")
            setEditingStepDescription("")
            fetchGoal()
        } catch (err) {
            console.error("Error with editing step detail", err)
        }
    }

    const handleStepDelete = async(id) => {
        try{
            await axios.delete(`http://127.0.0.1:8000/steps/${id}/`)

            const modal = document.getElementById(`modal-${id}`)
        if (modal) {
            modal.close()
        }
            fetchGoal()
        } catch (err) {
            console.error("Error with deleting step", err)
        }
    }

    const toggleStepComplete = async(step) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/steps/${step.id}/`, {
                completed: !step.completed
            })
            fetchGoal() 
        } catch (err) {
            console.error("Failed to toggle step completion:", err)
        }
    }

    const openModal = (step) => {
        const modal = document.getElementById(`modal-${step.id}`)
        modal.showModal()
    }

    if (!goal) return <div>Loading...</div>

    const totalSteps = goal.steps.length
    const completedSteps = goal.steps.filter(step => step.completed).length

    const progressPercent = totalSteps === 0 ? 0: (completedSteps / totalSteps) * 100
    const goalCompleted = totalSteps > 0 && completedSteps === totalSteps

    return (
        <div className='flex flex-col justify-center items-center'>
            {isEditingGoal ? (
            <form onSubmit={handleGoalUpdate} className="flex flex-col items-center my-10">
                <input
                    type="text"
                    className="input input-bordered text-3xl text-center font-bold mb-3"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                />
                <div className="flex gap-2">
                    <button type="submit" className="btn btn-info text-white">Save</button>
                    <button type="button" className="btn" onClick={() => setIsEditingGoal(false)}>Cancel</button>
                </div>
            </form>
        ) : (
            <div className="flex flex-col items-center my-10">
                    <h1 ref={dropdownRef} className={`relative text-5xl uppercase font-bold ${goalCompleted ? 'text-neutral' : 'text-neutral-content'} transition-colors flex items-center gap-2`}>
                        {goal.name}

                        <svg
                            onClick={() => setShowOptions(prev => !prev)}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 cursor-pointer text-gray-200 mb-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                        </svg>

                        {showOptions && (
                            <ul className="menu bg-base-200 rounded-box shadow absolute top-full -right-10 mt-2 z-10 w-40">
                                <li>
                                    <a onClick={handleGoalEdit} className='text-gray-400'>✏️ Edit</a>
                                </li>
                                <li>
                                    <a onClick={handleGoalDelete} className="text-error">🗑️ Delete</a>
                                </li>
                            </ul>
                        )}
                    </h1>
                    <progress className="progress w-56 mt-10" value={progressPercent} max="100" />
                <p>{Math.round(progressPercent)}%</p>
                </div>
                
        )}


            <ul className='timeline timeline-vertical sm:timeline-horizontal md:timeline-horizontal lg:timeline-horizontal my-20'>
                {goal.steps.map((step, index) => (
                    <li key={step.id}>
                        {index !== 0 && (
                        <hr className={step.completed ? "bg-neutral" : "bg-neutral-content"} />
                        )}

                        
                        
                        <div
                            role="button"
                            onClick={() => openModal(step)}
                            className={`timeline-box sm:text-sm lg:text-lg cursor-pointer ${
                                index % 2 === 0 ? "timeline-start" : "timeline-end"
                            } hover:shadow-lg transition-shadow`}
                        >
                            {step.title}
                        </div>

                        
                        <div className="timeline-middle">
                            <svg
                                onClick={() => toggleStepComplete(step)}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className={`h-5 w-5 cursor-pointer transition-colors duration-300 ${
                                    step.completed ? "text-neutral" : "text-neutral-content"
                                  }`}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>

                        
                        <dialog id={`modal-${step.id}`} className="modal">
                            <div className="modal-box">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                {editingStepId === step.id ? (
                                    <>
                                    <form onSubmit={handleStepUpdate}>
                                        <div className="flex flex-row justify-center gap-1">
                                            
                                            <input 
                                            type="text" 
                                            className='font-bold text-2xl text-center mb-5'
                                            placeholder='Enter New Title'
                                            value={editingStepTitle}
                                            onChange={(e) => setEditingStepTitle(e.target.value)}
                                            />
                                        </div>

                                        <textarea 
                                        className="h-28 w-full mb-5 p-2" 
                                        placeholder='Enter New Description'
                                        value={editingStepDescription}
                                        onChange={(e) => setEditingStepDescription(e.target.value)}
                                        />
                                        <div className="flex justify-start items-center gap-3">
                                        <button className="btn btn-info text-white" type='submit'>save</button>
                                        <button className="btn" onClick={() => setEditingStepId(null)}>Cancel</button>
                                        
                                        </div>
                                    </form>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-row justify-center gap-1">
                                            <h1 className="font-bold text-2xl mb-5">{step.title}
                                            </h1>
                                            
                                            <svg
                                            onClick={() => toggleStepComplete(step)}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className={`h-5 w-5 cursor-pointer transition-colors duration-300 ${
                                                step.completed ? "text-neutral" : "text-neutral-content"
                                              }`}
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>

                                        <textarea className="h-28 p-2 w-full focus:outline-none select-none overflow-y-auto mb-5" value={step.description}
                                        readOnly
                                        />
                                        <div className="flex justify-start items-center gap-3">
                                        <button className="btn" onClick={() => handleStepEdit(step)}>Edit</button>
                                        <button className="btn bg-red-500 text-white" onClick={() => handleStepDelete(step.id)}>Delete</button>
                                        </div>
                                    </>
                                )}
                                
                            </div>
                        </dialog>

                        {/* HR separator between steps (except the last one) */}
                        {index !== goal.steps.length - 1 && <hr className={step.completed ? "bg-neutral" : "bg-neutral-content"} />}

                            
                    </li>
                ))}
            </ul>

            <button className="btn btn-neutral hover:bg-white hover:text-neutral" onClick={()=>document.getElementById('step-form').showModal()}>Add Step</button>
                <dialog id="step-form" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    
                    <form onSubmit={handleStepCreate} className='flex flex-col gap-10 my-10'>
                        <input 
                        type="text" 
                        className='font-bold text-2xl text-center border border-neutral-content rounded'
                        placeholder='Enter Title'
                        value={stepTitle}
                        onChange={(e) => setStepTitle(e.target.value)}
                        />
                        <textarea 
                        className="h-28 w-full mb-5 p-2 border border-neutral-content rounded"
                        placeholder='Enter Description'
                        value={stepDescription}
                        onChange={(e) => setStepDescription(e.target.value)}
                        />
                        <button type="submit" className='btn btn-neutral hover:bg-white hover:text-neutral'>Create</button>
                    </form>
                </div>
                </dialog>
        </div>
    )
}
