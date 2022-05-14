import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import CategoryIcon from '@material-ui/icons/Category';
import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import UsersPage from '../pages/Users'
import ProductsPage from '../pages/Products'
import CategoriesPage from '../pages/Categories'
import OrdersPage from '../pages/Orders'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';
import Authentication from '../auth/authentication';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor:'#4f6bf7'
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  button:{
    fontSize:'1.3em'
  }
}));

export default function PersistentDrawerLeft() {
  const navigate = useNavigate();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = (value) => {
    setPage(value)
  }

  const handleLogOut = ()=>{
    Authentication.logOut()
    navigate('/login')
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            clothes admin dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => handleClick(1)}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary={'Users'} />
          </ListItem>
          <ListItem button onClick={() => handleClick(2)}>
            <ListItemIcon><FeaturedPlayListOutlinedIcon /></ListItemIcon>
            <ListItemText primary={'Products'} />
          </ListItem>
          <ListItem button onClick={() => handleClick(3)}>
            <ListItemIcon><CategoryIcon /></ListItemIcon>
            <ListItemText primary={'Categories'} />
          </ListItem>
          <ListItem button onClick={() => handleClick(4)}>
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary={'Orders'} />
          </ListItem>
        </List>
        <Divider />
        <Button
          className={classes.button}
          startIcon={<ExitToAppIcon style={{ fontSize: '1em' }} />}
          onClick={handleLogOut}
        >
          Log Out
        </Button>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {page === 1 ? <UsersPage /> : page === 2 ? <ProductsPage /> : page === 3 ? <CategoriesPage /> : page === 4 ? <OrdersPage /> : ''}
      </main>
    </div>
  );
}
