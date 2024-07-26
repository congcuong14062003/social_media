import images from '../../assets/imgs';
import './ProfilePage.scss';
import { IoCamera } from 'react-icons/io5';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import { Box, Button, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import PostProfile from '../../components/PostProfile/PostProfile';
import ContentProfileUser from '../../components/ContentProfileUser/ContentProfileUser';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';
import { Link, Outlet, useLocation } from 'react-router-dom';
import routes from '../../configs/routes';
import config from '../../configs';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return <div {...other}>{children}</div>;
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ProfilePage() {
    const location = useLocation();
    const [value, setValue] = useState(0);

    useEffect(() => {
        switch (location.pathname) {
            case '/profile/anh':
                setValue(1);
                break;
            case '/profile/ban-be':
                setValue(2);
                break;
            default:
                setValue(0);
                break;
        }
    }, [location.pathname]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="profile_container">
            <div className="profile_header">
                <div className="content_profile_header">
                    <div className="cover_image">
                        <img src={images.car} alt="" />
                        <div className="footer_cover">
                            <div className="add_cover_image">
                                <IoCamera />
                                <span>Thêm ảnh bìa</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="infor_user_container">
                    <div className="infor_user_content">
                        <div className="avatar_user">
                            <img src={images.avt} alt="" />
                        </div>
                        <div className="infor_header_user">
                            <div className="user_name_header">Công Cường</div>
                            <div className="count_friend">385 bạn bè</div>
                            <div className="action_user_container">
                                <Link to={config.routes.createStory}>
                                    <ButtonCustom className="primary" title="Thêm vào tin" startIcon={<AddIcon />} />
                                </Link>
                                <ButtonCustom
                                    className="secondary"
                                    title="Chỉnh sửa trang cá nhân"
                                    startIcon={<CreateIcon />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="body_profile">
                <div className="content_body_profile">
                    <div className="tab_profile_user">
                        <Box sx={{ width: '100%' }}>
                            <Box className="tab_profile_content" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Bài viết" {...a11yProps(0)} component={Link} to="/profile" />
                                    <Tab label="Ảnh" {...a11yProps(1)} component={Link} to="/profile/anh" />
                                    <Tab label="Bạn bè" {...a11yProps(2)} component={Link} to="/profile/ban-be" />
                                </Tabs>
                            </Box>
                            <CustomTabPanel className="tab_profile_user" value={value} index={0}>
                                <ContentProfileUser>
                                    <Outlet />
                                </ContentProfileUser>
                            </CustomTabPanel>
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
