import axios from 'axios'
import StickyHeadTable from '../shared/MainTable'
import { useEffect, useState } from 'react'

const Orders = ()=>{
    const [orders,setOrders] = useState([])
    const [loaded, setloaded] = useState(false)
    const info = {
        header:'Orders',
        dataFor:'Order',
        tableHeaders:['Items','Quantity','Payment Method', 'User', 'Shipping Address','Total Price','State']
    }

    useEffect(() => {
        setloaded(true)
        axios.get('http://localhost:3000/api/v1/order', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setOrders(() => [...res.data.orders])
            setloaded(false)
        })
    }, [])
    return <StickyHeadTable info={info} data={orders} loaded={loaded}/>
}

export default Orders