import { styled } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import tooltipClasses from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import ModelForm from '../forms/ModelForm';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


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


const setData = (modelsData) => {
  const data = modelsData.map(ele => {
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
      actions: <ModelForm data={ele} mode={'Edit'} />,
      moreDetails: <Link to={`/${ele._id}/products`}><Button type='primary' startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view products</Button></Link>,
    }
  })
  return data
}

const setElement = (newModel) => {
  return {
    ...newModel,
    specs: newModel.specs.map((spec, index) => (
      <BootstrapTooltip key={index} title={spec.options.map((ele, index) => index === spec.options.length - 1 ? ele : `${ele} - `)}>
        <Chip
          color='primary'
          label={spec.name}
        />
      </BootstrapTooltip>
    )),
    actions: <ModelForm data={newModel} mode={'Edit'} />,
    moreDetails: <Link to={`/${newModel._id}/products`}><Button type='primary' startIcon={<VisibilityIcon style={{ fontSize: '1em' }} />}>view products</Button></Link>,
  }
}


const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, setElement(action.model)]
    case 'UPDATE':
      return state.map(model =>
        model._id === action.model._id ? setElement(action.model) : model
      );
    case 'SET':
      return setData(action.models);
    default:
      return setData(state)
  }
}

export default reducer