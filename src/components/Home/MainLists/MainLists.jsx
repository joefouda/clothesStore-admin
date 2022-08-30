import { useEffect, useState, useContext } from 'react'
import './MainLists.css'
import axios from 'axios'
import { NotificationContext } from '../../../App'
import { Button, Divider, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons';
import UploadImageModal from '../../../shared/UploadImageModal'
import useToggle from '../../../customHooks/useToggle'

const Title = (props)=> {
    const { handleNotification } = useContext(NotificationContext)
    const [title, setTitle] = useState(props.mainList.displayedTitle || "")
    const [editMode, toggleEditMode] = useToggle(false)

    const onTitleChange = (event, id)=> {
        setTitle(event.target.value)
    }

    const editTitle = ()=> {
        axios.patch(`http://localhost:3000/api/v1/mainList/displayedTitle/${props.mainList.title}`, {displayedTitle:title}, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }).then(res=> {
            props.setMainLists((oldMainLists)=> oldMainLists.map(mainList=> {
                return mainList._id === props.mainList._id? res.data.mainList:mainList
            }))
            toggleEditMode()
        }).catch(error=> {
            console.log(error)
            handleNotification('error', 'Server Error')
        })
    }
    return (
        editMode?<div className='main-list-container'>
            <Input className='title-input' placeholder="title" value={title} allowClear onChange={(event)=>onTitleChange(event,props.mainList._id)}/>
            <Button onClick={editTitle} disabled={title === ''}>save</Button>
        </div>:
        <div className='main-list-container'>
            <h3>{props.mainList.displayedTitle}({props.mainList.title})</h3>
            <Button className="no-background-button" icon={<EditOutlined />} aria-label="edit" onClick={toggleEditMode}>edit title</Button>
        </div>
    )
}

const ScrollSection = ()=> {
    const { handleNotification } = useContext(NotificationContext)
    const [mainLists, setMainLists] = useState([])
    useEffect(()=> {
        axios.get('http://localhost:3000/api/v1/mainList').then((res)=>{
            setMainLists(res.data.mainLists)
        }).catch(error=>{
            handleNotification('error', 'Server Error')
        })
    }, [])
    return (
        <div className="main-lists-control-container">
            <h1 className='main-lists-control-heading'>Main Lists Control (photo dimensions 700 * 600)</h1>
            <Divider />
            {mainLists.map((mainList)=> (
                mainList.title.includes('special')?<div key={mainList._id} className="main-list-container">
                    <div className='main-list-content'>
                        <img className='main-list-image' src={mainList.photo} />
                    <Title mainList={mainList} setMainLists={setMainLists}/>
                    </div>
                    <div>
                        <UploadImageModal setMainLists={setMainLists} photo={mainList.photo} mode='mainList' id={mainList._id} url={`http://localhost:3000/api/v1/mainList/${mainList.title}`} />
                    </div>
                </div> :
                <div key={mainList._id}>
                    <Title mainList={mainList} setMainLists={setMainLists}/>
                </div>
                 
            ))}
        </div>
    )
}

export default ScrollSection