import './MainSliderControl.css'
import { Button, Divider, Image, Empty } from 'antd'
import { useEffect, useState } from 'react'
import UploadImageModal from './UploadImageModal'
import axios from 'axios'

const MainSliderControl = () => {
    const [webPhotos, setWebPhotos] = useState([])
    const [mobilePhotos, setMobilePhotos] = useState([])

    const handleWebRemove = (id) => {
        axios.delete(`http://localhost:3000/api/v1/other/mainSliderWebPhotos/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res)
            setWebPhotos(res.data.mainSlider.photos)
        })
    }

    const handleMobileRemove = (id) => {
        axios.delete(`http://localhost:3000/api/v1/other/mainSliderMobilePhotos/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res)
            setMobilePhotos(res.data.mainSlider.photos)
        })
    }

    useEffect(() => {
        axios.get('http://localhost:3000/api/v1/other/mainSliderWebPhotos').then((res) => {
            setWebPhotos(res.data?.mainSlider?.photos || [])
        })
        axios.get('http://localhost:3000/api/v1/other/mainSliderMobilePhotos').then((res) => {
            setMobilePhotos(res.data?.mainSlider?.photos || [])
        })
    }, [])
    return (
        <div className="main-slider-control-container">
            <div className="main-slider-control-container-content">
                <h1>Web Photos (1600 * 900)</h1>
                <Divider />
                <div className="main-slider-control-container-photos">
                    {webPhotos.length === 0 ? <Empty
                        description={
                            <span>
                                No Photos Added
                            </span>
                        }
                    >
                    </Empty> : webPhotos.map((photo) => (<div key={photo.id} className="image-card">
                        <Image width='15vw' src={photo.src} />
                        <div className="image-card-actions">
                            <Button onClick={() => handleWebRemove(photo.id)}>remove</Button>
                        </div>
                    </div>))}
                </div>
                <UploadImageModal url={'http://localhost:3000/api/v1/other/mainSliderWebPhotos'} setPhotos={setWebPhotos} />
            </div>
            <div className="main-slider-control-container-content">
                <h1>Mobile Photos (450 * 800)</h1>
                <Divider />
                <div className="main-slider-control-container-photos">
                    {mobilePhotos.length === 0 ? <Empty
                        description={
                            <span>
                                No Photos Added
                            </span>
                        }
                    >
                    </Empty> : mobilePhotos.map((photo) => (<div key={photo.id} className="image-card">
                        <Image width='15vw' src={photo.src} />
                        <div className="image-card-actions">
                            <Button onClick={() => handleMobileRemove(photo.id)}>remove</Button>
                        </div>
                    </div>))}
                </div>
                <UploadImageModal url={'http://localhost:3000/api/v1/other/mainSliderMobilePhotos'} setPhotos={setMobilePhotos} />
            </div>
        </div>
    )
}

export default MainSliderControl