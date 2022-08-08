import { useContext } from 'react'
import StickyHeadTable from '../shared/MainTable'
import SubCategoryForm from '../forms/SubCategoryForm';
import { SubCategoriesContext } from '../contexts/SubCategoriesContext'
import { DispatchSubCategoriesContext } from '../contexts/SubCategoriesContext'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const SubCategories = () => {
    const subCategories = useContext(SubCategoriesContext)
    const dispatchSubCategories = useContext(DispatchSubCategoriesContext)

    const {categoryID} = useParams()
    const info = {
        header: 'Sub Categories',
        dataFor: 'Sub Category',
        tableHeaders: ['Photo', 'Name', 'Actions', 'More Details']
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
    return <StickyHeadTable info={info} data={subCategories} addFormContent={<SubCategoryForm categoryID={categoryID} mode="Add"/>} />
}

export default SubCategories