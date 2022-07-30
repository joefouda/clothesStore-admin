import StickyHeadTable from '../shared/MainTable'
import { useState, useEffect, useCallback } from 'react'
import ProductForm from '../forms/ProductForm'
import axios from 'axios'
import Chip from '@material-ui/core/Chip';

const Products = () => {
    const [products, setProducts] = useState([])
    const [loaded, setloaded] = useState(false)

    const handleEdit = useCallback((data) => {
        const newData = data.map(ele => {
            return {
                ...ele,
                specs: ele.specs.map((spec, index)=><Chip key={index} color="primary" label={`${spec.name}: ${spec.value}`} />),
                actions: <ProductForm mode='Edit' handleEdit={handleEdit} data={ele} />,
            }
        })
        setProducts(() => [...newData])
    }, [])

    const handleAdd = (data) => {
        const newData = data.map(ele => {
            return {
                ...ele,
                specs: ele.specs.map((spec, index)=><Chip key={index} color="primary" label={`${spec.name}: ${spec.value}`} />),
                actions: <ProductForm mode='Edit' handleEdit={handleEdit} data={ele} />,
            }
        })
        setProducts(() => [...newData])
    }

    const info = {
        header: 'Products',
        dataFor: 'Product',
        tableHeaders: ['Photo', 'Name', 'Stock', 'Price', 'Specs', 'Actions']
    }

    useEffect(() => {
        setloaded(true)
        axios.get('http://localhost:3000/api/v1/product', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            const data = res.data.products.map(ele => {
                return {
                    ...ele,
                    specs: ele.specs.map((spec,index)=><Chip color="primary" key={index} label={`${spec.name}: ${spec.value}`} />),
                    actions: <ProductForm mode='Edit' handleEdit={handleEdit} data={ele} />,
                }
            })
            setProducts(() => [...data])
            setloaded(false)
        })
    }, [handleEdit])
    return <StickyHeadTable info={info} data={products} addFormContent={<ProductForm handleAdd={handleAdd} mode='Add'/>} loaded={loaded} />
}

export default Products