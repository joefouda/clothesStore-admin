import { useEffect, useState, useContext } from 'react'
import './MainLists.css'
import axios from 'axios'
import { NotificationContext } from '../../../App'
import { Divider } from 'antd'
import UploadImageModal from '../../../shared/UploadImageModal'

const ScrollSection = ()=> {
    const { openNotification } = useContext(NotificationContext)
    const [mainLists, setMainLists] = useState([])
    useEffect(()=> {
        axios.get('http://localhost:3000/api/v1/other/mainLists').then((res)=>{
            setMainLists(res.data?.result?.MainLists || [])
        }).catch(error=>{
            openNotification('error', 'Server Error')
        })
    }, [])
    return (
        <div className="main-lists-control-container">
            <h1 className='main-lists-control-heading'>Main Lists Control (photo dimensions 700 * 600)</h1>
            <Divider />
            {mainLists.map((mainList, index)=> (
                <div key={index} className="main-list-container">
                    <div className='main-list-content'>
                        <img className='main-list-image' src={mainList.photo} />
                        <h3>{mainList.title}</h3>
                    </div>
                    <UploadImageModal setMainLists={setMainLists} photo={mainList.photo} title={mainList.title} mode="mainList" url={'http://localhost:3000/api/v1/other/mainListPhoto/mainLists'} />
                </div>  
            ))}
        </div>
    )
}

export default ScrollSection