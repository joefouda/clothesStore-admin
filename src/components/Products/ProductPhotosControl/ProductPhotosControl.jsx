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
    const { colorId } = useParams()
    const [photos, setPhotos] = useState([])
    const { handleNotification } = useContext(NotificationContext)

    const handleRemove = (photoId)=>{
        toggleProgress()
        axios.put(`http://localhost:3000/api/v1/product/color/remove/${colorId}`,{photoId}, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res=>{
            setPhotos(res.data.color.photos)
            handleNotification('success', 'photo removed successfully')
            toggleProgress()
        }).catch(error=> {
            handleNotification('error', 'Server Error')
        })
    }

    useEffect(()=> {
        toggleProgress()
        axios.get(`http://localhost:3000/api/v1/product/color/${colorId}`).then(res=>{
            console.log(res)
            setPhotos(res.data.color.photos)
            toggleProgress()
        }).catch(error=> {
            handleNotification('error', 'Server Error')
        })
    },[])
    return (
        <div className="product-photos-control-container">
            {progress?<CircularProgress className='circular-progress' />:photos.map((photo)=>(<div key={photo._id} className="product-image-card">
                <Image width='15vw' preview={{ getContainer: '#root', zIndex: 1000000 }} src={photo.src}/>
                <div className="product-image-card-actions">
                    <Button onClick={()=> handleRemove(photo._id)}>remove</Button>
                </div>
                </div>))}
            <UploadImageModal mode="color" colorId={colorId} setPhotos={setPhotos} toggleProgress={toggleProgress} />
        </div>
    )
}

export default ProductPhotosControl