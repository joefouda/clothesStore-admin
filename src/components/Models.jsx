import { useContext } from 'react'
import StickyHeadTable from '../shared/MainTable'
import ModelForm from '../forms/ModelForm';
import { ModelsContext } from '../contexts/ModelsContext'
import { DispatchModelsContext } from '../contexts/ModelsContext';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const SubCategories = () => {
    const models = useContext(ModelsContext)
    const dispatchModels = useContext(DispatchModelsContext)

    const params = useParams()
    const info = {
        header: 'Models',
        dataFor: 'Models',
        tableHeaders: ['Name', 'Specs', 'Actions', 'More Details']
    }
    
    useEffect(()=> {
        axios.get(`http://localhost:3000/api/v1/subCategory/${params.subCategoryID}`,{
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res=>{
            dispatchModels({type:'SET', models:res.data.subCategory.models})
        })
    }, [])
    return <StickyHeadTable info={info} data={models} addFormContent={<ModelForm {...params} mode="Add"/>} />
}

export default SubCategories