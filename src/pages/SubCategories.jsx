import SubCategories from "../components/SubCategories"

const SubCategoriesPage = (props)=>{
    return <SubCategories subCategories={props.subCategories} categoryId={props.categoryId}/>
}

export default SubCategoriesPage