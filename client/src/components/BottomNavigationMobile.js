import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import EventIcon from '@material-ui/icons/Event';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CommentRoundedIcon from '@material-ui/icons/CommentRounded';
import HomeIcon from '@material-ui/icons/Home';
import './BottomNavigationMobile.css'
import WhatshotSharpIcon from '@material-ui/icons/WhatshotSharp';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#1A1A1A'
  },
});

function BottomNavigationMobile() {
    const classes = useStyles();
    const [value, setValue] = useState('Home');
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    return (
        <div className="bottomNavigation">
            <BottomNavigation value={value} onChange={handleChange} className={classes.root}>
            <BottomNavigationAction label="Home" value="Home" icon={<HomeIcon/>} />
            <BottomNavigationAction label="New post" value="New post" icon={ <AddPhotoAlternateIcon/>} />
            <BottomNavigationAction label="Plan event" value="Add event" icon={<EventIcon/>} />
            <BottomNavigationAction label="Chats" value="Chats" icon={<CommentRoundedIcon />} />
            <BottomNavigationAction label="Confess" value="Confess" icon={<WhatshotSharpIcon/>} />
            </BottomNavigation>
        </div>
    )
}

export default BottomNavigationMobile
