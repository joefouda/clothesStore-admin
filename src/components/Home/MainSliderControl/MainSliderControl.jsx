import './MainSliderControl.css'
import { Button, Divider, Image, Empty } from 'antd'
import { useEffect, useState, useContext } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import UploadImageModal from '../../../shared/UploadImageModal'
import axios from 'axios'
import useToggle from '../../../customHooks/useToggle';
import { NotificationContext } from '../../../App'

const MainSliderControl = () => {
    const { handleNotification } = useContext(NotificationContext)
    const [webPhotos, setWebPhotos] = useState([])
    const [mobilePhotos, setMobilePhotos] = useState([])
    const [webProgress, toggleWebProgress] = useToggle(false)
    const [mobileProgress, toggleMobileProgress] = useToggle(false)

    const handleWebRemove = (id) => {
        toggleWebProgress()
        axios.delete(`http://localhost:3000/api/v1/other/mainSliderWebPhotos/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res)
            setWebPhotos(res.data.mainSlider.photos)
            handleNotification('success', 'photo added successfully')
            toggleWebProgress()
        }).catch(error=> {
            handleNotification('error', 'Server Error')
        })
    }

    const handleMobileRemove = (id) => {
        toggleMobileProgress()
        axios.delete(`http://localhost:3000/api/v1/other/mainSliderMobilePhotos/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then((res) => {
            setMobilePhotos(res.data.mainSlider.photos)
            handleNotification('success', 'photo removed successfully')
            toggleMobileProgress()
        }).catch(error=>{
            handleNotification('error', 'Server Error')
        })
    }

    useEffect(() => {
        toggleWebProgress()
        toggleMobileProgress()
        axios.get('http://localhost:3000/api/v1/other/mainSliderWebPhotos').then((res) => {
            setWebPhotos(res.data?.result?.photos || [])
            toggleWebProgress()
        }).catch(error=>{
            handleNotification('error', 'Server Error')
        })

        axios.get('http://localhost:3000/api/v1/other/mainSliderMobilePhotos').then((res) => {
            setMobilePhotos(res.data?.result?.photos || [])
            toggleMobileProgress()
        }).catch(error=>{
            handleNotification('error', 'Server Error')
        })
        
    }, [])
    return (
        <div className="main-slider-control-container">
            <div className="main-slider-control-container-content">
                <h1>Web Photos (1600 * 900)</h1>
                <Divider />
                <div className="main-slider-control-container-photos">
                    {webProgress?<CircularProgress className='circular-progress' />:webPhotos.length === 0 ? <Empty
                        description={
                            <span>
                                No Photos Added
                            </span>
                        }
                    >
                    </Empty> : webPhotos.map((photo) => (<div key={photo.id} className="image-card">
                        <Image width='15vw' preview={{ getContainer: '#root', zIndex: 1000000 }} src={photo.src} />
                        <div className="image-card-actions">
                            <Button onClick={() => handleWebRemove(photo.id)}>remove</Button>
                        </div>
                    </div>))}
                </div>
                <UploadImageModal toggleWebProgress={toggleWebProgress} mode="web" url={'http://localhost:3000/api/v1/other/mainSliderWebPhotos'} setPhotos={setWebPhotos} />
            </div>
            <div className="main-slider-control-container-content">
                <h1>Mobile Photos (450 * 800)</h1>
                <Divider />
                <div className="main-slider-control-container-photos">
                    {mobileProgress?<CircularProgress className='circular-progress' />:mobilePhotos.length === 0 ? <Empty
                        description={
                            <span>
                                No Photos Added
                            </span>
                        }
                    >
                    </Empty> : mobilePhotos.map((photo) => (<div key={photo.id} className="image-card">
                        <Image width='15vw' preview={{ getContainer: '#root', zIndex: 1000000 }} src={photo.src} />
                        <div className="image-card-actions">
                            <Button onClick={() => handleMobileRemove(photo.id)}>remove</Button>
                        </div>
                    </div>))}
                </div>
                <UploadImageModal toggleMobileProgress={toggleMobileProgress} mode="mobile" url={'http://localhost:3000/api/v1/other/mainSliderMobilePhotos'} setPhotos={setMobilePhotos} />
            </div>
        </div>
    )
}

export default MainSliderControl