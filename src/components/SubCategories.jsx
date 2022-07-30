import { useContext } from 'react'
import StickyHeadTable from '../shared/MainTable'
import SubCategoryForm from '../forms/SubCategoryForm';
import {NotificationContext} from '../App'
import { SubCategoriesContext } from '../contexts/SubCategoriesContext'
import { DispatchSubCategoriesContext } from '../contexts/SubCategoriesContext'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const SubCategories = () => {
    const {handleNotification} = useContext(NotificationContext);
    const subCategories = useContext(SubCategoriesContext)
    const dispatchSubCategories = useContext(DispatchSubCategoriesContext)

    const {categoryID} = useParams()
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
            dispatchSubCategories({type:'ADD', subCategory:res.data.subCategory})
            handleNotification('success', "Sub Category Added Successfully")
        })
    }
    
    useEffect(()=> {
        axios.get(`http://localhost:3000/api/v1/category/${categoryID}`,{
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res=>{
            dispatchSubCategories({type:'SET', subCategories:res.data.category.subCategories})
        })
    }, [])
    return <StickyHeadTable info={info} data={subCategories} addFormContent={<SubCategoryForm handleAdd={handleAdd} categoryID={categoryID} mode="Add"/>} />
}

export default SubCategories