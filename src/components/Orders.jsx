import StickyHeadTable from '../shared/MainTable'

const Orders = ()=>{
    const info = {
        header:'Orders',
        dataFor:'Order',
        data: [
            {
                id:1,
                name: 'ahmed',
                items:'p1,p2',
                quantity: '5',
                paymentMethod:'COD',
                state:'delivered',
                actions: 'delete'
            },
            {
                id:2,
                name: 'ahmed',
                items:'p1,p2',
                quantity: '5',
                paymentMethod:'COD',
                state:'delivered',
                actions: 'delete'
            }
        ],
        tableHeaders:['Name','Items','Quantity','Payment Method','State','Actions']
    }
    return <StickyHeadTable info={info}/>
}

export default Orders