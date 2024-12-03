import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import PrimaryIcon from '../../components/PrimaryIcon/PrimaryIcon';
import { IoMenu } from 'react-icons/io5';
import { NavLink } from 'react-router-dom'; // Dùng NavLink
import './SideBarMobile.scss'; // Import CSS riêng
import HorizontalItem from '../../components/HorizontalItem/HorizontalItem'; // Import HorizontalItem
import { FriendIcon, GroupIcon, HomeIcon, MessageIcon, VideoIcon } from '../../assets/icons/icons'; // Import icons
import config from '../../configs';

export default function SideBarMobile() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const menuItems = [
    { text: 'Trang chủ', icon: <HomeIcon />, link: config.routes.home },
    { text: 'Bạn bè', icon: <FriendIcon />, link: config.routes.friends },
    { text: 'Tin nhắn', icon: <MessageIcon />, link: config.routes.messages },
    { text: 'Nhóm', icon: <GroupIcon />, link: config.routes.group },
  ];

  const DrawerList = (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      className="sidebar-container"
    >
      <List>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.link}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <HorizontalItem
              title={item.text}
              icon={item.icon}
              to={item.link}
              className="horizontal-item"
            />
          </NavLink>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      <PrimaryIcon icon={<IoMenu />} onClick={toggleDrawer(true)} />
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
