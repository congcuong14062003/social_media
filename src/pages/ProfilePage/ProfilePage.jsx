import images from '../../assets/imgs';
import './ProfilePage.scss';
import { IoCamera } from 'react-icons/io5';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import { Box, Button, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
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
    const [value, setValue] = useState(0);

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
                                <Button
                                    className="btn_action btn_add_story"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                >
                                    Thêm vào tin
                                </Button>
                                <Button
                                    className="btn_action btn_edit_profile"
                                    variant="contained"
                                    startIcon={<CreateIcon />}
                                >
                                    Chỉnh sửa trang cá nhân
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="tab_profile_user">
                        <Box sx={{ width: '100%' }}>
                            <Box className="tab_profile_content" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Bài viết" {...a11yProps(0)} />
                                    <Tab label="Giới thiệu" {...a11yProps(1)} />
                                    <Tab label="Bạn bè" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                                Bài viết
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                Giới thiệu
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>
                                Bạn bè
                            </CustomTabPanel>
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
