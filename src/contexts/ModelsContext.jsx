import { createContext } from "react"
import ModelsReducer from '../reducers/ModelReducer'
import { useArrayReducer } from '../customHooks/useArrayReducer';

export const ModelsContext = createContext()
export const DispatchModelsContext = createContext()

const ModelsProvider = (props) => {
    const [models, dispatch] = useArrayReducer(ModelsReducer, [])
    return (
            <ModelsContext.Provider value={models}>
                <DispatchModelsContext.Provider value={dispatch}>{props.children}</DispatchModelsContext.Provider>
            </ModelsContext.Provider>
    )
}

export default ModelsProvider