import axios from 'axios'
import { useEffect, useState,useContext } from 'react'
import MainTable from '../shared/MainTable/MainTable'
import { Switch } from 'antd'
import {NotificationContext} from '../App'
import useToggle from '../customHooks/useToggle';

const Users = (props) => {
  const [users, setUsers] = useState([])
  const [progress, toggleProgress] = useToggle(false)
  const {handleNotification} = useContext(NotificationContext);
  
  const info = {
    header: 'Users',
    dataFor: 'User',
    tableHeaders: ['Name', 'Email', 'Address', 'Is Banned']
  }

  const handleToggle = (event, id) => {
    axios.put(`http://localhost:3000/api/v1/user/toggleState/${id}`, {}, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }).then((res) => {
      handleNotification('success',res.data.message)
    }).catch(error => {
      handleNotification('error', "Server Error")
    })
  }

  useEffect(() => {
    toggleProgress()
    axios.get('http://localhost:3000/api/v1/user', {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }).then((res) => {
      const data = res.data.users.map(ele => {
        return {
          ...ele,
          address:ele.address.country,
          isBanned: <Switch defaultChecked={ele.isBanned?true:false} onChange={(event)=>handleToggle(event, ele._id)}/>
        }
      })
      setUsers(() => [...data])
      toggleProgress()
    })
  },[])
  return <>
    <MainTable info={info} data={users} progress={progress} />
  </>
}

export default Users