import MainTable from '../../shared/MainTable/MainTable'
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
    const [model, setModel] = useState({})
    const [products, setProducts] = useState([])
    const [progress, toggleProgress] = useToggle(false)
    const { modelID } = useParams()

    const editElement = (editedProduct) => {
        let newEle = {
            ...editedProduct,
            variants: Object.keys(editedProduct.variants).map((variantkey, index) => <Chip key={index} color="primary" label={`${variantkey}: ${editElement.variants[variantkey]}`} />),
            actions: <div style={{ display: 'flex' }}><Button
                onClick={() => navigate(`/${editedProduct._id}/productPhotos`)}
                color="primary"
            >Edit Photos</Button><ProductForm mode='Edit' editElement={editElement} data={editedProduct} toggleProgress={toggleProgress}/>
            </div>,
        }
        setProducts(oldProducts => oldProducts.map(product => {
            return product._id === editedProduct._id ? newEle : product
        }))
    }

    const addElement = (newProduct) => {
        let newEle = {
            ...newProduct,
            variants: Object.keys(newProduct.variants).map((variantkey, index) => <Chip key={index} color="primary" label={`${variantkey}: ${newProduct.variants[variantkey]}`} />),
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
                variants: Object.keys(ele.variants).map((variantkey, index) => <Chip key={index} color="primary" label={`${variantkey}: ${ele.variants[variantkey]}`} />),
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
        tableHeaders: ['Photos', 'Name', 'Stock', 'Price', 'variants', 'Actions']
    }

    useEffect(() => {
        toggleProgress()
        axios.get(`http://localhost:3000/api/v1/product/model/${modelID}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setModel(res.data.model)
            setData(res.data.products)
            toggleProgress()
        }).catch((error)=> {
            handleNotification('error', "Server Error")
        })
    }, [])
    return <MainTable info={info} data={products} progress={progress} addFormContent={<ProductForm addElement={addElement} toggleProgress={toggleProgress} mode='Add' model={model} />} />
}

export default Products