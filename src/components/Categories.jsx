import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import StickyHeadTable from '../shared/MainTable'
import CategoryForm from '../forms/CategoryForm'
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';

const Categories = (props)=>{
    const [categories,setCategories] = useState([])
    const [loaded, setloaded] = useState(false)
    
    const handleViewSubCategories = useCallback((id)=>{
        console.log(id)
        axios.get(`http://localhost:3000/api/v1/category/${id}`,{
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res=>{
            console.log(res)
            props.changeSubCategories(res.data.category.subCategories)
            props.setCategoryId(id)
            props.changePage(5)
        })
    },[props]) 

    const handleEdit = useCallback((data)=>{
        const newData = data.map(ele => {
            return {
                ...ele,
                actions: <CategoryForm mode='Edit' handleEdit={handleEdit} data={ele}/>,
                moreDetails: <Button color="primary" onClick={()=> handleViewSubCategories(ele._id)} startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view sub categories</Button>
            }
        })
        setCategories(() => [...newData])
    },[handleViewSubCategories])

    const handleAdd = (data)=>{
        const newData = data.map(ele => {
            return {
                ...ele,
                actions: <CategoryForm mode='Edit' handleEdit={handleEdit} data={ele}/>,
                moreDetails: <Button color="primary" onClick={()=> handleViewSubCategories(ele._id)} startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view sub categories</Button>
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
                    moreDetails: <Button color="primary" onClick={()=> handleViewSubCategories(ele._id)} startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view sub categories</Button>
                }
            })
            setCategories(() => [...data])
            setloaded(false)
        })
    }, [handleEdit,handleViewSubCategories])
    return <StickyHeadTable info={info} data={categories} handleAdd={handleAdd} loaded={loaded}/>
}

export default Categories