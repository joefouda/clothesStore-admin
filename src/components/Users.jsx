import axios from 'axios'
import { useEffect, useState,useContext } from 'react'
import StickyHeadTable from '../shared/MainTable'
import Switch from '@material-ui/core/Switch';
import { styled } from '@material-ui/core/styles';
import {NotificationContext} from '../App'

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));
const Users = (props) => {
  const [users, setUsers] = useState([])
  const [loaded, setloaded] = useState(false)
  const {handleNotification} = useContext(NotificationContext);
  
  const info = {
    header: 'Users',
    dataFor: 'User',
    tableHeaders: ['Name', 'Email', 'Address', 'Is Banned']
  }
  const handleToggle = (event) => {
    axios.put(`http://localhost:3000/api/v1/user/toggleState/${event.target.value}`, {}, {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }).then((res) => {
      console.log(res)
      handleNotification('success',res.data.message)
    }).catch(error => {
      handleNotification('error', "Server Error")
    })
  }

  useEffect(() => {
    setloaded(true)
    axios.get('http://localhost:3000/api/v1/user', {
      headers: {
        'Authorization': localStorage.getItem('token')
      }
    }).then((res) => {
      const data = res.data.users.map(ele => {
        return {
          ...ele,
          address:ele.address.country,
          isBanned: ele.isBanned ? <IOSSwitch sx={{ m: 1 }} value={ele._id} onChange={handleToggle} defaultChecked /> : <IOSSwitch sx={{ m: 1 }} value={ele._id} onChange={handleToggle} />
        }
      })
      setUsers(() => [...data])
      setloaded(false)
    })
  },[])
  return <>
    <StickyHeadTable info={info} data={users} loaded={loaded} />
  </>
}

export default Users