import SubCategories from "../components/SubCategories"

const SubCategoriesPage = (props)=>{
    return <SubCategories subCategories={props.subCategories} categoryId={props.categoryId} setData={props.setData}/>
}

export default SubCategoriesPage