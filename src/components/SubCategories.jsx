import StickyHeadTable from '../shared/MainTable'

const SubCategories = ()=>{
    const info = {
        header:'Sub Categories',
        dataFor:'Sub Category',
        data: [
            {
                id:1,
                photo: 'avatar',
                name: 'ahmed',
                specs: 'color,size',
                actions: 'delete'
            },
            {
                id:2,
                photo: 'avatar',
                name: 'ahmed',
                specs: 'color,size',
                actions: 'delete'
            }
        ],
        tableHeaders:['Photo','Name','Specs','Actions']
    }
    return <StickyHeadTable info={info}/>
}

export default SubCategories