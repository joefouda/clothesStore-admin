import StickyHeadTable from '../../shared/MainTable'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../../forms/ProductForm'
import axios from 'axios'
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';

const Products = () => {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [model, setModel] = useState({})
    const [loaded, setloaded] = useState(false)
    const {modelID} = useParams()
    const handleEdit = useCallback((data) => {
        const newData = data.map(ele => {
            return {
                ...ele,
                specs: ele.specs.map((spec, index) => <Chip key={index} color="primary" label={`${spec.name}: ${spec.value}`} />),
                actions: <div style={{ display: 'flex' }}><Button
                    onClick={() => navigate(`/${ele._id}/productPhotos`)}
                    color="primary"
                >Edit Photos</Button><ProductForm mode='Edit' handleEdit={handleEdit} data={ele} />
                </div>,
            }
        })
        setProducts(() => [...newData])
    }, [])

    const handleAdd = (data) => {
        const newData = data.map(ele => {
            return {
                ...ele,
                specs: ele.specs.map((spec, index) => <Chip key={index} color="primary" label={`${spec.name}: ${spec.value}`} />),
                actions: <div style={{ display: 'flex' }}><Button
                    onClick={() => navigate(`/${ele._id}/productPhotos`)}
                    color="primary"
                >Edit Photos</Button><ProductForm mode='Edit' handleEdit={handleEdit} data={ele} />
                </div>,
            }
        })
        setProducts(() => [...newData])
    }

    const info = {
        header: 'Products',
        dataFor: 'Product',
        tableHeaders: ['Photos', 'Name', 'Stock', 'Price', 'Specs', 'Actions']
    }

    useEffect(() => {
        setloaded(true)
        axios.get(`http://localhost:3000/api/v1/model/${modelID}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res)
            setModel(res.data.model)
            const data = res.data.model.products.map(ele => {
                return {
                    ...ele,
                    specs: ele.specs.map((spec, index) => <Chip color="primary" key={index} label={`${spec.name}: ${spec.value}`} />),
                    actions: <div style={{ display: 'flex' }}><Button
                        onClick={() => navigate(`/${ele._id}/productPhotos`)}
                        color="primary"
                    >Edit Photos</Button><ProductForm mode='Edit' handleEdit={handleEdit} data={ele} />
                    </div>,
                }
            })
            setProducts(() => [...data])
            setloaded(false)
        })
    }, [handleEdit])
    return <StickyHeadTable info={info} data={products} addFormContent={<ProductForm handleAdd={handleAdd} model={model} mode='Add' />} loaded={loaded} />
}

export default Products