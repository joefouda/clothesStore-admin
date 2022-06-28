import { useContext } from 'react'
import StickyHeadTable from '../shared/MainTable'
import axios from 'axios'
import { styled } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import tooltipClasses from '@material-ui/core/Tooltip';
import {NotificationContext} from '../App'

const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.black,
    },
}));

const SubCategories = (props) => {
    const {handleNotification} = useContext(NotificationContext);

    const info = {
        header: 'Sub Categories',
        dataFor: 'Sub Category',
        tableHeaders: ['Photo', 'Name', 'Specs', 'Actions']
    }

    const handleAdd = (newSubCategory) => {
        axios.post('http://localhost:3000/api/v1/subCategory/add', newSubCategory, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            axios.get(`http://localhost:3000/api/v1/category/${newSubCategory.category}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                props.setData(res.data.category.subCategories)
                handleNotification('success', "Sub Category Added Successfully")
            })
        })
    }
    return <StickyHeadTable categoryId={props.categoryId} info={info} data={props.subCategories} handleAdd={handleAdd} />
}

export default SubCategories