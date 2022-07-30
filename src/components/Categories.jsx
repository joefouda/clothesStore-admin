import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import StickyHeadTable from '../shared/MainTable'
import CategoryForm from '../forms/CategoryForm'
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useNavigate } from 'react-router-dom';
import { DispatchSubCategoriesContext } from '../contexts/SubCategoriesContext';
import { useContext } from 'react';

const Categories = (props)=>{
    const dispatchSubCategories = useContext(DispatchSubCategoriesContext)
    const [categories,setCategories] = useState([])
    const [loaded, setloaded] = useState(false)
    const navigate = useNavigate()

    const handleEdit = useCallback((data)=>{
        const newData = data.map(ele => {
            return {
                ...ele,
                actions: <CategoryForm mode='Edit' handleEdit={handleEdit} data={ele}/>,
                moreDetails: <Button color="primary" onClick={()=>navigate(`/subCategories/${ele._id}`)} startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view sub categories</Button>
            }
        })
        setCategories(() => [...newData])
    },[])

    const handleAdd = (data)=>{
        const newData = data.map(ele => {
            return {
                ...ele,
                actions: <CategoryForm mode='Edit' handleEdit={handleEdit} data={ele}/>,
                moreDetails: <Button color="primary" onClick={()=>navigate(`/subCategories/${ele._id}`)} startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view sub categories</Button>
            }
        })
        setCategories(() => [...newData])
    }

    const info = {
        header:'Categories',
        dataFor:'Category',
        tableHeaders:['Photo','Name','Actions','More Details']
    }
    useEffect(() => {
        setloaded(true)
        axios.get('http://localhost:3000/api/v1/category', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            const data = res.data.categories.map(ele => {
                return {
                    ...ele,
                    actions: <CategoryForm mode='Edit' handleEdit={handleEdit} data={ele}/>,
                    moreDetails: <Button color="primary" onClick={()=> navigate(`/subCategories/${ele._id}`)} startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view sub categories</Button>
                }
            })
            setCategories(() => [...data])
            setloaded(false)
        })
    }, [])
    return <StickyHeadTable info={info} data={categories} addFormContent={<CategoryForm handleAdd={handleAdd} mode="Add" />} loaded={loaded}/>
}

export default Categories