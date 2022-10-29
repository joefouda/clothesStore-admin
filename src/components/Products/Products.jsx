import MainTable from '../../shared/MainTable/MainTable'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ProductForm from '../../forms/ProductForm'
import axios from 'axios'
import { EyeOutlined } from '@ant-design/icons'
import {Button} from 'antd'
import useToggle from '../../customHooks/useToggle'
import { NotificationContext } from '../../App'

const Products = () => {
    const { handleNotification } = useContext(NotificationContext)
    const navigate = useNavigate()
    const [subCategory, setSubCategory] = useState({})
    const [products, setProducts] = useState([])
    const [progress, toggleProgress] = useToggle(false)
    const { subCategoryID } = useParams()

    const editElement = (editedProduct) => {
        let newEle = {
            ...editedProduct,
            discountPercentage: '% ' + editedProduct.discountPercentage,
            actions: <ProductForm mode='Edit' editElement={editElement} data={editedProduct} toggleProgress={toggleProgress}/>,
            moreDetails: <Link to={`/${editedProduct._id}/colors`}><Button className='no-background-button' icon={<EyeOutlined style={{ fontSize: '1em' }}/>}>View Colors</Button></Link>
        }
        setProducts(oldProducts => oldProducts.map(product => {
            return product._id === editedProduct._id ? newEle : product
        }))
    }

    const addElement = (newProduct) => {
        let newEle = {
            ...newProduct,
            discountPercentage: '% ' + newProduct.discountPercentage,
            actions: <ProductForm mode='Edit' editElement={editElement} data={newProduct} toggleProgress={toggleProgress} />,
            moreDetails: <Link to={`/${newProduct._id}/colors`}><Button className='no-background-button' icon={<EyeOutlined style={{ fontSize: '1em' }}/>}>View Colors</Button></Link>
        }
        setProducts((oldProducts) => [...oldProducts, newEle])
    }

    const setData = (data) => {
        let newData = data.map(ele => {
            return {
                ...ele,
                discountPercentage: '% ' + ele.discountPercentage,
                actions: <ProductForm mode='Edit' editElement={editElement} toggleProgress={toggleProgress} data={ele} />,
                moreDetails: <Link to={`/${ele._id}/colors`}><Button className='no-background-button' icon={<EyeOutlined style={{ fontSize: '1em' }}/>}>View Colors</Button></Link>
            }
        })
        setProducts(newData)
    }

    const info = {
        header: 'Products',
        dataFor: 'Product',
        tableHeaders: ['Name', 'Description', 'Price', 'Discount Percentage', 'Net Price', 'Actions', 'More Details']
    }

    useEffect(() => {
        toggleProgress()
        axios.get(`http://localhost:3000/api/v1/product/subCategoryId/${subCategoryID}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setData(res.data.products)
            toggleProgress()
        }).catch((error)=> {
            handleNotification('error', "Server Error")
        })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:3000/api/v1/subCategory/${subCategoryID}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setSubCategory(res.data.subCategory)
        }).catch((error)=> {
            handleNotification('error', "Server Error")
        })
    }, [])
    return <MainTable info={info} data={products} progress={progress} addFormContent={<ProductForm addElement={addElement} toggleProgress={toggleProgress} mode='Add' subCategory={subCategory} />} />
}

export default Products