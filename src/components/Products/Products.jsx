import StickyHeadTable from '../../shared/MainTable'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../forms/ProductForm'
import axios from 'axios'
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import useToggle from '../../customHooks/useToggle'
import { NotificationContext } from '../../App'

const Products = () => {
    const { handleNotification } = useContext(NotificationContext)
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [model, setModel] = useState({})
    const [progress, toggleProgress] = useToggle(false)
    const { modelID } = useParams()

    const editElement = (editedProduct) => {
        let editedEle = {
            ...editedProduct,
            specs: editedProduct.specs.map((spec, index) => <Chip key={index} color="primary" label={`${spec.name}: ${spec.value}`} />),
            actions: <div style={{ display: 'flex' }}><Button
                onClick={() => navigate(`/${editedProduct._id}/productPhotos`)}
                color="primary"
            >Edit Photos</Button><ProductForm mode='Edit' editElement={editElement} data={editedProduct} toggleProgress={toggleProgress}/>
            </div>,
        }
        setProducts(oldProducts => oldProducts.map(product => {
            return product._id === editedProduct._id ? editedEle : product
        }))
    }

    const addElement = (newProduct) => {
        let newEle = {
            ...newProduct,
            specs: newProduct.specs.map((spec, index) => <Chip key={index} color="primary" label={`${spec.name}: ${spec.value}`} />),
            actions: <div style={{ display: 'flex' }}><Button
                onClick={() => navigate(`/${newProduct._id}/productPhotos`)}
                color="primary"
            >Edit Photos</Button><ProductForm mode='Edit' editElement={editElement} toggleProgress={toggleProgress} data={newProduct} />
            </div>,
        }
        setProducts((oldProducts) => [...oldProducts, newEle])
    }

    const setData = (data) => {
        let newData = data.map(ele => {
            return {
                ...ele,
                specs: ele.specs.map((spec, index) => <Chip key={index} color="primary" label={`${spec.name}: ${spec.value}`} />),
                actions: <div style={{ display: 'flex' }}><Button
                    onClick={() => navigate(`/${ele._id}/productPhotos`)}
                    color="primary"
                >Edit Photos</Button><ProductForm mode='Edit' editElement={editElement} toggleProgress={toggleProgress} data={ele} />
                </div>,
            }
        })
        setProducts(newData)
    }

    const info = {
        header: 'Products',
        dataFor: 'Product',
        tableHeaders: ['Photos', 'Name', 'Stock', 'Price', 'Specs', 'Actions']
    }

    useEffect(() => {
        toggleProgress()
        axios.get(`http://localhost:3000/api/v1/model/${modelID}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setModel(res.data.model)
            setData(res.data.model.products)
            toggleProgress()
        }).catch((error)=> {
            handleNotification('error', "Server Error")
        })
    }, [])
    return <StickyHeadTable info={info} data={products} progress={progress} addFormContent={<ProductForm addElement={addElement} toggleProgress={toggleProgress} mode='Add' model={model} />} />
}

export default Products