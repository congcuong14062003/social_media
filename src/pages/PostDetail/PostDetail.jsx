import React, { useEffect, useState } from 'react';
import './PostDetail.scss';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import HeaderPostItem from '../../components/HeaderPostItem/HeaderPostItem';
import FooterPostItem from '../../components/FooterPostItem/FooterPostItem';
import CloseBtn from '../../components/CloseBtn/CloseBtn';
import { getData } from '../../ultils/fetchAPI/fetch_API';
import { API_POST_DETAIL } from '../../API/api_server';

function PostDetail() {
    const navigate = useNavigate();
    const { id_post } = useParams();
    const location = useLocation();
    const [postDetail, setPostDetail] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0); // Ảnh đang active

    // Lấy `mediaIndex` từ query string
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const mediaIndex = parseInt(params.get('mediaIndex'), 10);
        setActiveIndex(mediaIndex || 0); // Nếu không có, mặc định là 0
    }, [location.search]);

    // Lấy dữ liệu chi tiết bài viết
    useEffect(() => {
        const getPostById = async () => {
            const response = await getData(API_POST_DETAIL(id_post));
            if (response.status === true) {
                setPostDetail(response.data);
            }
        };
        getPostById();
    }, [id_post]);

    const handlePrev = () => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : postDetail.media.length - 1));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev < postDetail.media.length - 1 ? prev + 1 : 0));
    };

    if (!postDetail) return null;

    const mediaLength = postDetail.media.length;

    return (
        <div className="post-detail">
            <div className="container post-detail--container">
                <div className="post-detail--media">
                    <span className="close_btn_model close">
                        <CloseBtn onClick={() => navigate(-1)} />
                    </span>
                    
                    {/* Chỉ hiện nút Prev nếu có nhiều hơn 1 ảnh */}
                    {mediaLength > 1 && (
                        <div className="btn btn-prev" onClick={handlePrev}>
                            <FaChevronLeft />
                        </div>
                    )}

                    <div className="content-media--main">
                        <img
                            src={postDetail.media[activeIndex]?.media_link}
                            alt={`media-${activeIndex}`}
                        />
                    </div>

                    {/* Chỉ hiện nút Next nếu có nhiều hơn 1 ảnh */}
                    {mediaLength > 1 && (
                        <div className="btn btn-next" onClick={handleNext}>
                            <FaChevronRight />
                        </div>
                    )}
                </div>

                <div className="post-detail--comment">
                    <HeaderPostItem dataPost={postDetail} />
                    <FooterPostItem dataPost={postDetail} />
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
