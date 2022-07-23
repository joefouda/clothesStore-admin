import {useState} from 'react'

const useToggle = (initialValue)=>{
    const [value,setValue] = useState(initialValue)
    const toggle = (changable = null)=>{
        setValue(changable === null ? !value:changable)
    }

    return [value,toggle]
}

export default useToggle