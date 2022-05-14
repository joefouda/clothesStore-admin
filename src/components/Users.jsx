import StickyHeadTable from '../shared/MainTable'

const Users = () => {
    const info = {
        header: 'Users',
        dataFor: 'User',
        data: [
            {
                id:1,
                photo: 'avatar',
                name: 'ahmed',
                state: 'banned',
                actions: 'delete'
            },
            {
                id:2,
                photo: 'avatar',
                name: 'ahmed',
                state: 'banned',
                actions: 'delete'
            }
        ],
        tableHeaders: ['Photo', 'Name', 'State', 'Actions']
    }
    return <StickyHeadTable info={info} />
}

export default Users