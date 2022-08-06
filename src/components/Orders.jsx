import axios from 'axios'
import StickyHeadTable from '../shared/MainTable'
import { useEffect, useState } from 'react'
import OrderStateForm from '../forms/OrderStateForm'

const Orders = () => {
    const [orders, setOrders] = useState([])
    const [loaded, setloaded] = useState(false)
    
    const info = {
        header: 'Orders',
        dataFor: 'Order',
        tableHeaders: ['Order Items', 'Quantity', 'Payment Method', 'User', 'Shipping Address', 'Phone', 'Total Price', 'State']
    }

    const setData = (ordersData)=>{
        const data = ordersData.map((ele) => {
            return {
                ...ele,
                orderItems: ele.orderItems.map((ele, index) => (<><span key={index}>{ele.product.name} - {ele.product.subCategory.name} - {ele.product.category.name}</span><br /></>)),
                quantity: ele.orderItems.map((ele, index) => (<><span key={index}>{ele.quantity}</span><br /></>)),
                user: ele.User.name,
                state:<OrderStateForm state={ele.state} setData={setData} orderId={ele._id}/>
            }
        })
        setOrders(() => [...data])
    }

    useEffect(() => {
        setloaded(true)
        axios.get('http://localhost:3000/api/v1/order', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res)
            setData(res.data.orders)
            setloaded(false)
        })
    }, [])
    return <StickyHeadTable info={info} data={orders} loaded={loaded} />
}

export default Orders