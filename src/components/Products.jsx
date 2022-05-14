import StickyHeadTable from '../shared/MainTable'

const Products = ()=>{
    const info = {
        header:'Products',
        dataFor:'Product',
        data: [
            {
                id:1,
                photo: 'avatar',
                name: 'ahmed',
                price: '20',
                stock: '3',
                actions: 'delete'
            },
            {
                id:2,
                photo: 'avatar',
                name: 'ahmed',
                price: '20',
                stock: '3',
                actions: 'delete'
            }
        ],
        tableHeaders:['Photo','Name','Price','Stock','Actions']
    }
    return <StickyHeadTable info={info}/>
}

export default Products