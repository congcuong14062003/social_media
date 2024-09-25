import images from '../../assets/imgs';
import './ProfilePage.scss';
import { IoCamera } from 'react-icons/io5';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import { Box, Button, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import PostProfile from '../../components/PostProfile/PostProfile';
import ContentProfileUser from '../../components/ContentProfileUser/ContentProfileUser';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import routes from '../../configs/routes';
import config from '../../configs';
import { OwnDataContext } from '../../provider/own_data';
import { getData, postData } from '../../ultils/fetchAPI/fetch_API';
import { FaFacebookMessenger } from "react-icons/fa";
import {
    API_ACCEPT_INVITE,
    API_ADD_FRIEND,
    API_GET_INFO_OWNER_PROFILE_BY_ID,
    API_GET_INFO_USER_PROFILE_BY_ID,
} from '../../API/api_server';
import { MessageIcon } from '../../assets/icons/icons';

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
    const { id_user } = useParams();

    const myData = useContext(OwnDataContext);

    useEffect(() => {
        switch (location.pathname) {
            case `/profile/${id_user}/anh`:
                setValue(1);
                break;
            case `/profile/${id_user}/ban-be`:
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

    const [dataUser, setDataUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(id_user));
                console.log(response);
                if (response.status === 200) {
                    setDataUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, [id_user]);
    
    const handleAddFriend = async () => {
        const response = await postData(API_ADD_FRIEND(id_user));
        console.log(response);
    };
    const handleAcceptInvite = async () => {
        const response = await postData(API_ACCEPT_INVITE(id_user));
        console.log(response);
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
                            <img src={myData?.avatar} alt="" />
                        </div>
                        <div className="infor_header_user">
                            <div className="user_name_header">{dataUser && dataUser?.user_name}</div>
                            <div className="count_friend">385 bạn bè</div>
                            <div className="action_user_container">
                                {dataUser?.user_id === myData?.user_id ? (
                                    <>
                                        <ButtonCustom
                                            className="secondary"
                                            title="Chỉnh sửa trang cá nhân"
                                            startIcon={<CreateIcon />}
                                        />
                                        <Link to={config.routes.createStory}>
                                            <ButtonCustom
                                                className="primary"
                                                title="Thêm vào tin"
                                                startIcon={<AddIcon />}
                                            />
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <ButtonCustom
                                            onClick={handleAddFriend}
                                            className="secondary"
                                            title="Thêm bạn bè"
                                        />
                                        <Link to={config.routes.createStory}>
                                            <ButtonCustom
                                                className="primary"
                                                title="Nhắn tin"
                                                startIcon={<FaFacebookMessenger />}
                                            />
                                        </Link>
                                        {/* <ButtonCustom
                                            onClick={handleAddFriend}
                                            className="secondary"
                                            title="Xoá lời mời"
                                        /> */}
                                    </>
                                )}
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
                                    <Tab
                                        label="Bài viết"
                                        {...a11yProps(0)}
                                        component={Link}
                                        to={`/profile/${id_user}`}
                                    />
                                    <Tab
                                        label="Ảnh"
                                        {...a11yProps(1)}
                                        component={Link}
                                        to={`/profile/${id_user}/anh`}
                                    />
                                    <Tab
                                        label="Bạn bè"
                                        {...a11yProps(2)}
                                        component={Link}
                                        to={`/profile/${id_user}/ban-be`}
                                    />
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
