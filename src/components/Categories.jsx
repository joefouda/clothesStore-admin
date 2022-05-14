import StickyHeadTable from '../shared/MainTable'

const Categories = ()=>{
    const info = {
        header:'Categories',
        dataFor:'Category',
        data: [
            {
                id:1,
                photo:'avatar',
                name: 'pants',
                actions: 'delete'
            },
            {
                id:2,
                photo:'avatar',
                name: 'pants',
                actions: 'delete'
            }
        ],
        tableHeaders:['Photo','Name']
    }
    return <StickyHeadTable info={info}/>
}

export default Categories