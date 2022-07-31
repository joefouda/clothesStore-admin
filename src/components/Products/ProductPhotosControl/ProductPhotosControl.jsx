import './ProductPhotosControl.css'
import { Button, Image } from 'antd'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import UploadImageModal from '../../Home/MainSliderControl/UploadImageModal'
import axios from 'axios'
import { useEffect } from 'react'

const ProductPhotosControl = ()=> {
    const { id } = useParams()
    const [photos, setPhotos] = useState([])

    const handleRemove = (photoId)=>{
        axios.delete(`http://localhost:3000/api/v1/product/${id}`,{id:photoId}).then(res=>{
            setPhotos(res.data.product.photos)
        })
    }

    useEffect(()=> {
        axios.get(`http://localhost:3000/api/v1/product/${id}`).then(res=>{
            console.log(res)
            setPhotos(res.data.product.photos)
        })
    },[])
    return (
        <div className="product-photos-control-container">
            {photos.map((photo)=>(<div key={photo.id} className="product-image-card">
                <Image width='15vw' src={photo.src}/>
                <div className="product-image-card-actions">
                    <Button onClick={()=> handleRemove(photo.id)}>remove</Button>
                </div>
                </div>))}
            <UploadImageModal mode="product" productId={id} setPhotos={setPhotos}/>
        </div>
    )
}

export default ProductPhotosControl