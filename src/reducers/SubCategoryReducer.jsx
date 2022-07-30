import { styled } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import tooltipClasses from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import SubCategoryForm from '../forms/SubCategoryForm';

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));


const setData = (subData) => {
  const data = subData.map(ele => {
    return {
      ...ele,
      specs: ele.specs.map((spec, index) => (
        <BootstrapTooltip key={index} title={spec.options.map((ele, index) => index === spec.options.length - 1 ? ele : `${ele} - `)}>
          <Chip
            color='primary'
            label={spec.name}
          />
        </BootstrapTooltip>
      )),
      actions: <SubCategoryForm data={ele} mode={'Edit'} />,
    }
  })
  return data
}

const setElement = (newSubCategory) => {
  return {
    ...newSubCategory,
    specs: newSubCategory.specs.map((spec, index) => (
      <BootstrapTooltip key={index} title={spec.options.map((ele, index) => index === spec.options.length - 1 ? ele : `${ele} - `)}>
        <Chip
          color='primary'
          label={spec.name}
        />
      </BootstrapTooltip>
    )),
    actions: <SubCategoryForm data={newSubCategory} categoryId={newSubCategory.category} mode={'Edit'} />,
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