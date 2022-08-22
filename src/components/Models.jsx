import MainTable from '../shared/MainTable/MainTable'
import ModelForm from '../forms/ModelForm';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

import { styled } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import tooltipClasses from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import useToggle from '../customHooks/useToggle';

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

const SubCategories = () => {
    const [models, setModels] = useState([])
    const [progress, toggleProgress] = useToggle(false)
    const params = useParams()

    const addElement = (newModel) => {
      let keys = Object.keys(newModel.variants)
        let newEle = {
          ...newModel,
          variants: keys.map((variantkey, index) => (
            <BootstrapTooltip key={index} title={newModel.variants[variantkey].map((ele, index) => index === newModel.variants[variantkey].length - 1 ? ele : `${ele} - `)}>
              <Chip
                color='primary'
                label={variantkey}
              />
            </BootstrapTooltip>
          )),
          actions: <ModelForm data={newModel} editElement={editElement} mode={'Edit'} toggleProgress={toggleProgress} />,
          moreDetails: <Link to={`/${newModel._id}/products`}><Button type='primary' startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view products</Button></Link>,
        }
        setModels((oldModels) => [...oldModels, newEle])
      }

      const editElement = (editedModel) => {
        let keys = Object.keys(editedModel.variants)
        let editedEle = {
          ...editedModel,
          variants: keys.map((variantkey, index) => (
            <BootstrapTooltip key={index} title={editedModel.variants[variantkey].map((ele, index) => index === editedModel.variants[variantkey].length - 1 ? ele : `${ele} - `)}>
              <Chip
                color='primary'
                label={variantkey}
              />
            </BootstrapTooltip>
          )),
          actions: <ModelForm data={editedModel} editElement={editElement} mode={'Edit'} toggleProgress={toggleProgress} />,
          moreDetails: <Link to={`/${editedModel._id}/products`}><Button type='primary' startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view products</Button></Link>,
        }
        setModels(oldModels=> oldModels.map(model=>{
            return model._id === editedModel._id ? editedEle : model
        }))
      }

    const setData = (modelsData) => {
      const data = modelsData.map(model => {
          let keys = Object.keys(model.variants)
          return {
            ...model,
            variants: keys.map((variantkey, index) => (
              <BootstrapTooltip key={index} title={model.variants[variantkey].map((ele, index) => index === model.variants[variantkey].length - 1 ? ele : `${ele} - `)}>
                <Chip
                  color='primary'
                  label={variantkey}
                />
              </BootstrapTooltip>
            )),
            actions: <ModelForm data={model} mode={'Edit'} editElement={editElement} toggleProgress={toggleProgress}/>,
            moreDetails: <Link to={`/${model._id}/products`}><Button type='primary' startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view products</Button></Link>,
          }
        })
        setModels(data)
      }

    const info = {
        header: 'Models',
        dataFor: 'Models',
        tableHeaders: ['Name', 'Variants', 'Actions', 'More Details']
    }
    
    useEffect(()=> {
        axios.get(`http://localhost:3000/api/v1/model/subCategory/${params.subCategoryID}`,{
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res=>{
            setData(res.data.models)
        })
    }, [])
    return <MainTable info={info} data={models} progress={progress} addFormContent={<ModelForm {...params} mode="Add" addElement={addElement} toggleProgress={toggleProgress} />} />
}

export default SubCategories