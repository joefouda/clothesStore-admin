import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import MainTable from '../shared/MainTable/MainTable'
import CategoryForm from '../forms/CategoryForm'
import Button from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useNavigate } from 'react-router-dom';
import useToggle from '../customHooks/useToggle';

const Categories = ()=>{
    const [categories,setCategories] = useState([])
    const [progress, toggleProgress] = useToggle(false)
    const navigate = useNavigate()

    const addElement = (newCategory)=>{
        const newEle = {
            ...newCategory,
            actions: <CategoryForm mode='Edit' editElement={editElement} toggleProgress={toggleProgress} data={newCategory}/>,
            moreDetails: <Button color="primary" onClick={()=>navigate(`/${newCategory._id}/subCategories`)} startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view sub categories</Button>
        }
        setCategories((oldCategories) => [...oldCategories, newEle])
    }

    const editElement = (editedCategory)=>{
        const editedEle = {
            ...editedCategory,
            actions: <CategoryForm mode='Edit' toggleProgress={toggleProgress} editElement={editElement} data={editedCategory}/>,
            moreDetails: <Button color="primary" onClick={()=>navigate(`/${editedCategory._id}/subCategories`)} startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view sub categories</Button>
        }
        setCategories(oldCategories=> oldCategories.map(category=>{
            return category._id === editedCategory._id ? editedEle : category
        }))
    }

    const setData = (data)=>{
        const newData = data.map(ele => {
            return {
                ...ele,
                actions: <CategoryForm mode='Edit' editElement={editElement} toggleProgress={toggleProgress} data={ele}/>,
                moreDetails: <Button color="primary" onClick={()=>navigate(`/${ele._id}/subCategories`)} startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view sub categories</Button>
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
        toggleProgress()
        axios.get('http://localhost:3000/api/v1/category', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setData(res.data.categories)
            toggleProgress()
        })
    }, [])
    return <MainTable info={info} data={categories} progress={progress} addFormContent={<CategoryForm addElement={addElement} toggleProgress={toggleProgress} mode="Add" />} />
}

export default Categories