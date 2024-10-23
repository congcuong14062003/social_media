import React, { useEffect, useState } from "react";
import "./PopupInfoShort.scss";
import { Link } from "react-router-dom";
import { FaSchoolCircleCheck, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoHeartCircleSharp } from "react-icons/io5";

function PopupInfoShort() {
    const [hearted, setHearted] = useState(false);
    useEffect(() => {
        const popupInfoElements = document.querySelectorAll(".popup-info--container");

        const handleMouseEnter = (popupInfoElement, avtParent) => () => {
            if (avtParent) {
                //fetch data 
                const screenMidpoint = window.innerHeight / 2;
                const y = avtParent.getBoundingClientRect().y;
                if (y <= screenMidpoint) {
                    popupInfoElement.style.top = "40px";
                } else {
                    popupInfoElement.style.top = "-245px";
                }
            }
        };

        popupInfoElements.forEach((popupInfoElement) => {
            const avtParent = popupInfoElement?.parentNode;
            avtParent.classList.add("popup");
            const enterHandler = handleMouseEnter(popupInfoElement, avtParent);

            if (avtParent) {
                avtParent.addEventListener("mouseenter", enterHandler);
                popupInfoElement._enterHandler = enterHandler;
            }
        });

        return () => {
            popupInfoElements.forEach((popupInfoElement) => {
                const avtParent = popupInfoElement?.parentNode;
                if (avtParent && popupInfoElement._enterHandler) {
                    avtParent.removeEventListener("mouseenter", popupInfoElement._enterHandler);
                }
            });
        };
    }, []);

    const handleHeartClick = (e) => {
        e.preventDefault();
        setHearted((prev) => !prev);
    };
    return (
        <React.Fragment>
            <div className="popup-info--container">
                <div className="popup-row-container">

                    <div className="popup-row popup-info">
                        <img className="popup-avt" src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                        <div className="popup-info-short">
                            <b className="popup-name-user">Dasha Taran</b>
                            <p className="popup-nickname-user">@Dashataran533</p>
                            <div className="popup-info-short--item info-school"><FaSchoolCircleCheck />Từng học tại <b>Trường đại học Mát-cơ-va</b></div>
                            <div className="popup-info-short--item info-address"><IoHome />Đang sống tại <b>Moscow</b></div>
                            <div className="popup-info-short--item info-quantity--fr"><FaUserFriends />Có <b>1000 bạn bè</b></div>
                            <div className="popup-info-short--item info-quantity--fr"><IoHeartCircleSharp />Có <b>{hearted ? 1000 + 1 : 1000 - 1} lượt yêu thích</b></div>

                        </div>
                    </div>
                    <div className="popup-row action">
                        <Link to="/profile/123">
                            <h5 className="popup-direct-info--detail">
                                Xem trang cá nhân <FaArrowUpRightFromSquare />
                            </h5>
                        </Link>
                        <div className="popup-temp"></div>
                        <form action="" onClick={handleHeartClick} method="post" className={hearted ? "active" : ""}>
                            <IoHeartCircleSharp /> <p>{hearted ? "Đã thích" : "Thích"}</p>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default PopupInfoShort;
