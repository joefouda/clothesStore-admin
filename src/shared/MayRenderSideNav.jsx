import authentication from '../auth/authentication'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
const MayRenderSideNav = (props)=> {
    const [mayRenderSideNav, setMayRenderSideNav] = useState(authentication.isAuthinticated())
    const location = useLocation()

    useEffect(()=> {
        setMayRenderSideNav(authentication.isAuthinticated())
    }, [location])
    return <>
        {mayRenderSideNav && props.children}
    </>
}

export default MayRenderSideNav