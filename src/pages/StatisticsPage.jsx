import { useEffect, useState } from "react"
import axios from 'axios'

const StatisticsPage = ()=>{
    const [ordersTotal, setOrdersTotal] = useState(0)
    const [mostSold, setMostSold] = useState({})
    useEffect(()=>{
        axios.get('http://localhost:3000/api/v1/order/total', {
            headers : {
                'authorization': localStorage.getItem('token')
            }
        }).then((res)=> {
            setOrdersTotal(res.data.ordersTotal)
        })
    }, [])

    useEffect(()=>{
        axios.get('http://localhost:3000/api/v1/order/mostSold', {
            headers : {
                'authorization': localStorage.getItem('token')
            }
        }).then((res)=> {
            setMostSold(res.data.mostSold)
        })
    }, [])
    return (
        <>
            <h1>orders total {ordersTotal}</h1>
            <h1>most sold {mostSold._id}, {mostSold.totalOrders}</h1>
        </>
    )
}

export default StatisticsPage