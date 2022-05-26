import Categories from "../components/Categories"

const CategoriesPage = (props)=>{
    return <Categories changePage={props.changePage} changeSubCategories={props.changeSubCategories} setCategoryId={props.setCategoryId}/>
}

export default CategoriesPage