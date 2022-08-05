import SubCategoryForm from '../forms/SubCategoryForm';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const setData = (subData) => {
  const data = subData.map(ele => {
    return {
      ...ele,
      actions: <SubCategoryForm data={ele} mode={'Edit'} />,
      moreDetails: <Link to={`/${ele.category}/${ele._id}/models`}><Button type='primary' startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view models</Button></Link>,
    }
  })
  return data
}

const setElement = (newSubCategory) => {
  return {
    ...newSubCategory,
    actions: <SubCategoryForm data={newSubCategory} categoryId={newSubCategory.category} mode={'Edit'} />,
    moreDetails: <Link to={`/${newSubCategory.category}/${newSubCategory._id}/models`}><Button type='primary' startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view models</Button></Link>,
  }
}


const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, setElement(action.subCategory)]
    case 'UPDATE':
      return state.map(subCategory =>
        subCategory._id === action.subCategory._id ? setElement(action.subCategory) : subCategory
      );
    case 'SET':
      return setData(action.subCategories);
    default:
      return setData(state)
  }
}

export default reducer