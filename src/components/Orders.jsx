import axios from 'axios'
import StickyHeadTable from '../shared/MainTable'
import { useEffect, useState } from 'react'
import OrderStateForm from '../forms/OrderStateForm' 
import useToggle from '../customHooks/useToggle'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [progress, toggleProgress] = useToggle(false)
    
    const info = {
        header: 'Orders',
        dataFor: 'Order',
        tableHeaders: ['Order Items', 'Quantity', 'Payment Method', 'User', 'Phone', 'Grand Total', 'State']
    }

    const setData = (ordersData)=>{
        const data = ordersData.map((ele) => {
            return {
                ...ele,
                orderItems: ele.orderItems.map((ele, index) => (<><span key={index}>{ele.product.name} - {ele.product.subCategory.name} - {ele.product.category.name}</span><br /></>)),
                quantity: ele.orderItems.map((ele, index) => (<><span key={index}>{ele.quantity}</span><br /></>)),
                user: ele.user.name,
                phone: ele.user.phone,
                state:<OrderStateForm state={ele.state} setData={setData} toggleProgress={toggleProgress} orderId={ele._id}/>
            }
        })
        setOrders(() => [...data])
    }

    useEffect(() => {
        toggleProgress()
        axios.get('http://localhost:3000/api/v1/order', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setData(res.data.orders)
            toggleProgress()
        })
    }, [])
    return <StickyHeadTable info={info} data={orders} progress={progress} />
}

export default Orders