import './MainSliderControl.css'
import { Button, Divider, Image } from 'antd'
import { useEffect, useState } from 'react'
import UploadImageModal from './UploadImageModal'
import axios from 'axios'

const MainSliderControl = ()=> {
    const [photos, setPhotos] = useState([])

    const handleRemove = (id)=>{
        axios.delete(`http://localhost:3000/api/v1/other/mainSliderPhotos/${id}`,{
            headers:{
                'Authorization': localStorage.getItem('token')
            }
        }).then((res)=>{
            console.log(res)
            setPhotos(res.data.mainSlider.photos)
        })
    }
    useEffect(()=>{
        axios.get('http://localhost:3000/api/v1/other/mainSliderPhotos').then((res)=>{
            setPhotos(res.data.mainSlider.photos)
        })
    },[])
    return (
        <div className="main-slider-control-container">
            {photos.map((photo,index)=>(<div key={photo.id} className="image-card">
                <Image width='15vw' src={photo.src}/>
                <div className="image-card-actions">
                    <Button onClick={()=> handleRemove(photo.id)}>remove</Button>
                </div>
                </div>))}
            <UploadImageModal setPhotos={setPhotos}/>
        </div>
    )
}

export default MainSliderControl