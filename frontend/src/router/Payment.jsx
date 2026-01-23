import {Routes, Route} from "react-router-dom"
import Payment from "../pages/Admin/Payment"

const PaymentRouter = ()=>{
    return(
        <Routes>
            <Route element={<Payment/>}/>
        </Routes>
    )
}

export default PaymentRouter