import authentication from '../auth/authentication'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
const MayRenderMainNav = (props)=> {
    const [mayRenderMainNav, setMayRenderMainNav] = useState(!authentication.isAuthinticated())
    const location = useLocation()

    useEffect(()=> {
        setMayRenderMainNav(!authentication.isAuthinticated())
    }, [location])
    return <>
        {mayRenderMainNav && location.pathname !== '/404'? props.children:''}
    </>
}

export default MayRenderMainNav