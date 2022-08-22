import MainTable from '../shared/MainTable/MainTable'
import SubCategoryForm from '../forms/SubCategoryForm';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {Button} from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import axios from 'axios'
import useToggle from '../customHooks/useToggle';

const SubCategories = () => {
    const [subCategories,setSubCategories] = useState([])
    const [progress, toggleProgress] = useToggle(false)
    const {categoryID} = useParams()

    const addElement = (newSubCategory) => {
        let newEle = {
          ...newSubCategory,
          actions: <SubCategoryForm data={newSubCategory} categoryId={newSubCategory.category} mode={'Edit'} toggleProgress={toggleProgress} editElement={editElement}/>,
          moreDetails: <Link to={`/${newSubCategory.category}/${newSubCategory._id}/models`}><Button className='no-background-button' icon={<EyeOutlined style={{ fontSize: '1em' }}/>}>view models</Button></Link>,
        }
        setSubCategories(oldSubCategories=> [...oldSubCategories, newEle])
      }

    const editElement = (editedSubCategory) => {
        let editedEle = {
          ...editedSubCategory,
          actions: <SubCategoryForm data={editedSubCategory} categoryId={editedSubCategory.category} mode={'Edit'} toggleProgress={toggleProgress} editElement={editElement}/>,
          moreDetails: <Link to={`/${editedSubCategory.category}/${editedSubCategory._id}/models`}><Button className='no-background-button' icon={<EyeOutlined style={{ fontSize: '1em' }}/>}>view models</Button></Link>,
        }
        setSubCategories(oldSubCategories=> oldSubCategories.map(subCategory=>{
            return subCategory._id === editedSubCategory._id ? editedEle : subCategory
        }))
      }
    
    const setData = (subData) => {
        const data = subData.map(ele => {
          return {
            ...ele,
            actions: <SubCategoryForm data={ele} mode={'Edit'} toggleProgress={toggleProgress} editElement={editElement}/>,
            moreDetails: <Link to={`/${ele.category}/${ele._id}/models`}><Button className='no-background-button' icon={<EyeOutlined style={{ fontSize: '1em' }}/>}>view models</Button></Link>,
          }
        })
        setSubCategories(data)
    }

    const info = {
        header: 'Sub Categories',
        dataFor: 'Sub Category',
        tableHeaders: ['Photo', 'Name', 'Actions', 'More Details']
    }
    
    useEffect(()=> {
        toggleProgress()
        axios.get(`http://localhost:3000/api/v1/subCategory/category/${categoryID}`,{
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res=>{
            setData(res.data.subCategories)
            toggleProgress()
        })
    }, [])
    return <MainTable info={info} data={subCategories} progress={progress} addFormContent={<SubCategoryForm categoryID={categoryID} toggleProgress={toggleProgress} addElement={addElement} mode="Add"/>} />
}

export default SubCategories