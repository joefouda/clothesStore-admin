import { useEffect, useState, useContext } from 'react'
import StickyHeadTable from '../shared/MainTable'
import SubCategoryForm from '../forms/SubCategoryForm'
import axios from 'axios'
import Chip from '@material-ui/core/Chip';
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
    const [subCategories, setSubCategories] = useState([])
    const {handleNotification} = useContext(NotificationContext);

    const info = {
        header: 'Sub Categories',
        dataFor: 'Sub Category',
        tableHeaders: ['Photo', 'Name', 'Specs', 'Actions']
    }
    const handleSubCategoryEdit = (newSubCategory, subCategoryId) => {
        axios.put(`http://localhost:3000/api/v1/subCategory/update/${subCategoryId}`, newSubCategory, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            console.log(res)
            axios.get(`http://localhost:3000/api/v1/category/${newSubCategory.category}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                setData(res.data.category.subCategories)
                handleNotification('success', "Sub Category Updated Successfully")
            })
        })
    }

    const handleAdd = (newSubCategory) => {
        axios.post('http://localhost:3000/api/v1/subCategory/add', newSubCategory, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            console.log(res)
            axios.get(`http://localhost:3000/api/v1/category/${newSubCategory.category}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => {
                setData(res.data.category.subCategories)
                handleNotification('success', "Sub Category Added Successfully")
            })
        })
    }
    const setData = (subData) => {
        const data = subData.map(ele => {
            return {
                ...ele,
                specs: ele.specs.map((spec, index) => (
                    <BootstrapTooltip key={index} title={spec.options.map((ele,index)=>index===spec.options.length-1?ele:`${ele} - `)}>
                        <Chip
                            color='primary'
                            label={spec.name}
                        />
                    </BootstrapTooltip>
                )),
                actions: <SubCategoryForm data={ele} categoryId={ele.category} mode={'Edit'} handleEdit={handleSubCategoryEdit} />,
            }
        })
        setSubCategories(() => [...data])
    }
    useEffect(() => {
        setSubCategories(() => [...props.subCategories])
    }, [props.subCategories])
    return <StickyHeadTable categoryId={props.categoryId} info={info} data={subCategories} handleAdd={handleAdd} />
}

export default SubCategories