import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export const GoalForm = () => {
    const [goalName, setGoalName] = useState("")
    const navigate = useNavigate()

    const handleCreate = async(e) => {
        e.preventDefault()
        try{
            const res = await axios.post("http://127.0.0.1:8000/goals/", {name: goalName})
            setGoalName("")
            navigate(`/goals/${res.data.id}`)
        } catch (err) {
            console.error("error with creating goal", err)
        }
    }
    return(
        <div className="text-center my-52 ">
            <form onSubmit={handleCreate}>
                <h1 className="text-3xl text-neutral font-mono m-7">What Do You Want To Accomplish?</h1>
                <input 
                type="text" 
                className="input border-black focus:outline-none" 
                placeholder="Enter New Goal"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                />
                <button type="submit" className="btn btn-neutral text-white">Add Goal</button>
            </form>
        </div>
        
    )
}