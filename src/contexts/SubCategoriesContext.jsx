import { createContext } from "react"
import SubCategoriesReducer from '../reducers/SubCategoryReducer'
import { useArrayReducer } from '../customHooks/useArrayReducer';

export const SubCategoriesContext = createContext()
export const DispatchSubCategoriesContext = createContext()
export const CartVisableContext = createContext()

const SubCategoriesProvider = (props) => {
    const [subCategories, dispatch] = useArrayReducer(SubCategoriesReducer, [])
    return (
            <SubCategoriesContext.Provider value={subCategories}>
                <DispatchSubCategoriesContext.Provider value={dispatch}>{props.children}</DispatchSubCategoriesContext.Provider>
            </SubCategoriesContext.Provider>
    )
}

export default SubCategoriesProvider