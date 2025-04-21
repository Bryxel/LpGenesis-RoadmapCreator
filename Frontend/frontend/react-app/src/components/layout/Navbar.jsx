import { useEffect, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";


export const Navbar = () => {
    const [goals, setgoals] = useState([])

    
    const fetchGoal = async() => {
        try{
            const res = await axios.get("http://127.0.0.1:8000/goals/")
            setgoals(res.data)
        }catch (err) {
            console.error("error with fetching goals", err)
        }
    }

    useEffect(() => {
        fetchGoal()
    },[])

    if (!goals) return <div>Loading...</div>




  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {goals.map(goal => (
                <li key={goal.id}>
                    <Link to={`/goals/${goal.id}`}>
                        {goal.name}
                    </Link>
                    </li>
            ))}
          </ul>
        </div>
        <Link to={"/"} className="text-xl mt-2 ml-2 cursor-pointer">
          <img src="/logo.png" alt="LpGenesis Logo" className="w-40"/>
        </Link>
      </div>

    </div>
  );
};
