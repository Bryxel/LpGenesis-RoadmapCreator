import { Route, Routes } from "react-router-dom"
import { GoalForm } from "./components/GoalForm"
import { GoalDetail } from "./components/GoalDetail"


export const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<GoalForm/>}/>
            <Route path="/goals/:id" element={<GoalDetail/>}/>
        </Routes>
    )
}