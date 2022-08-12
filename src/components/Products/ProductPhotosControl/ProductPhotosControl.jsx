import './ProductPhotosControl.css'
import { Button, Image } from 'antd'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import UploadImageModal from '../../../shared/UploadImageModal'
import axios from 'axios'
import { useEffect, useContext } from 'react'
import {NotificationContext} from '../../../App'
import useToggle from '../../../customHooks/useToggle'
import CircularProgress from '@material-ui/core/CircularProgress';


const ProductPhotosControl = ()=> {
    const [progress, toggleProgress] = useToggle(false)
    const { id } = useParams()
    const [photos, setPhotos] = useState([])
    const { handleNotification } = useContext(NotificationContext)

    const handleRemove = (photoId)=>{
        toggleProgress()
        axios.put(`http://localhost:3000/api/v1/product/remove/${id}`,{id:photoId}, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res=>{
            setPhotos(res.data.product.photos)
            handleNotification('success', 'photo removed successfully')
            toggleProgress()
        }).catch(error=> {
            handleNotification('error', 'Server Error')
        })
    }

    useEffect(()=> {
        toggleProgress()
        axios.get(`http://localhost:3000/api/v1/product/${id}`).then(res=>{
            setPhotos(res.data.product.photos)
            toggleProgress()
        }).catch(error=> {
            handleNotification('error', 'Server Error')
        })
    },[])
    return (
        <div className="product-photos-control-container">
            {progress?<CircularProgress className='circular-progress' />:photos.map((photo)=>(<div key={photo.id} className="product-image-card">
                <Image width='15vw' src={photo.src}/>
                <div className="product-image-card-actions">
                    <Button onClick={()=> handleRemove(photo.id)}>remove</Button>
                </div>
                </div>))}
            <UploadImageModal mode="product" productId={id} setPhotos={setPhotos} toggleProgress={toggleProgress} />
        </div>
    )
}

export default ProductPhotosControl