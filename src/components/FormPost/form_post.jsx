import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./form_post.scss";
import { Link } from "react-router-dom";
import { FaImages } from "react-icons/fa";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import { IoNewspaperSharp } from "react-icons/io5";

import * as FilePond from 'filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import TextEditor from "../../ultils/textEditor/react_draft_wysiwyg";
import { OwnDataContext } from "../../provider/own_data";

FilePond.registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview
);

FilePond.setOptions({
    labelIdle: 'Kéo & Thả tập tin hoặc Duyệt',
    labelFileLoadError: 'Lỗi khi tải tập tin',
    labelFileProcessing: 'Đang xử lý',
    labelFileProcessingComplete: 'Hoàn tất xử lý',
    labelFileProcessingAborted: 'Đã hủy xử lý',
    labelFileProcessingError: 'Lỗi xử lý',
    labelFileProcessingRevertError: 'Lỗi khi khôi phục',
    labelFileRemoveError: 'Lỗi khi xóa',
    labelTapToCancel: 'Nhấn để hủy',
    labelTapToRetry: 'Nhấn để thử lại',
    labelTapToUndo: 'Nhấn để hoàn tác',
    labelButtonRemoveItem: 'Xóa',
    labelButtonAbortItemLoad: 'Hủy',
    labelButtonRetryItemLoad: 'Thử lại',
    labelButtonAbortItemProcessing: 'Hủy',
    labelButtonUndoItemProcessing: 'Hoàn tác',
    labelButtonRetryItemProcessing: 'Thử lại',
    labelButtonProcessItem: 'Xử lý',
});

export default function FormPost() {
    const [showEmotion, setShowEmotion] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const dataOwner = useContext(OwnDataContext);

    useEffect(() => {
        const overlay = document.querySelector("#overlay");
        const popupPost = document.querySelector(".form-post--popup--container");

        if (showPopup) {
            overlay.classList.add("active");
            if (!overlay.contains(popupPost)) {
                overlay.appendChild(popupPost);
            }
        } else {
            overlay.classList.remove("active");
            if (overlay.contains(popupPost)) {
                overlay.removeChild(popupPost);
            }
            setShowEmotion(false);
            setShowImage(false);
        }

        const handleClickOutside = (event) => {
            if (popupPost && !popupPost.contains(event.target)) {
                setShowPopup(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopup]);

    useEffect(() => {
        if (showImage) {
            FilePond.create(document.querySelector('input.filepond'));
        } else {
            FilePond.destroy(document.querySelector('input.filepond'));
        }
    }, [showImage]);

    const toggleEmotion = () => setShowEmotion(!showEmotion);
    const toggleImg = () => setShowImage(!showImage);
    const handleClosePopup = () => setShowPopup(false);

    const PopupContent = (
        <form className="form-post--popup--container">
            <div className="close" onClick={handleClosePopup}>
                <IoIosCloseCircle />
            </div>
            <h2 className="title">Tạo bài đăng</h2>
            <div className="form-post--popup--wrapper">
                <div className="privacy-main">
                    <div className="avt-img">
                        <img src={dataOwner && dataOwner?.avatar} alt="avatar" />
                    </div>
                    <div className="privacy-container">
                        <p className="name">
                            <b>{dataOwner && dataOwner?.user_name} {" "}</b>
                            {showEmotion && (
                                <>
                                    đang cảm thấy <select name="react" id="react-select">
                                        <option value="vui vẻ &#128515;">&#128515; Vui vẻ</option>
                                        <option value="tức cười &#128518;">&#128518; Tức cười</option>
                                        <option value="tức giận &#128544;">&#128544; Tức giận</option>
                                        <option value="háo hức &#128513;">&#128513; Háo hức</option>
                                        <option value="phê pha &#129396;">&#129396; Phê pha</option>
                                        <option value="cảm ơn &#128515;">&#128515; Cảm ơn</option>
                                        <option value="tự hào &#128526;">&#128526; Tự hào</option>
                                        <option value="quyết tâm &#128170;">&#128170; Quyết tâm</option>
                                        <option value="toại nguyện &#128516;">&#128516; Toại nguyện</option>
                                        <option value="buồn bã &#128532;">&#128532; Buồn bã</option>
                                        <option value="sợ hãi &#128552;">&#128552; Sợ hãi</option>
                                        <option value="ngạc nhiên &#128558;">&#128558; Ngạc nhiên</option>
                                        <option value="thở phào &#128523;">&#128523; Thở phào</option>
                                        <option value="chán nản &#128549;">&#128549; Chán nản</option>
                                        <option value="lo lắng &#128542;">&#128542; Lo lắng</option>
                                        <option value="hạnh phúc &#128512;">&#128512; Hạnh phúc</option>
                                        <option value="bi thương &#128546;">&#128546; Bi thương</option>
                                        <option value="tỉnh táo &#129302;">&#129302; Tỉnh táo</option>
                                        <option value="tự tin &#128526;">&#128526; Tự tin</option>
                                        <option value="hào hứng &#128519;">&#128519; Hào hứng</option>
                                        <option value="nổi giận &#128545;">&#128545; Nổi giận</option>
                                        <option value="thiếu tự tin &#128533;">&#128533; Thiếu tự tin</option>
                                        <option value="an tâm &#128522;">&#128522; An tâm</option>
                                        <option value="phiêu lưu &#127947;">&#127947; Phiêu lưu</option>
                                        <option value="đối mặt &#128567;">&#128567; Đối mặt</option>
                                    </select> với khoảng khắc này:
                                </>
                            )}
                        </p>
                        <select name="privacy" id="privacy-select" defaultValue="global">
                            <option value="global">&#x1F30D; Mọi người</option>
                            <option value="private">&#x1F512; Chỉ mình tôi</option>
                        </select>
                    </div>
                </div>
                {!showImage && (
                    <div className="func btn-create--img handle" onClick={toggleImg}>
                        <FaImages /> Thêm ảnh
                    </div>
                )}
                {!showEmotion && (
                    <div className="func btn-create--react handle" onClick={toggleEmotion}>
                        <BsEmojiLaughingFill /> Thêm bày tỏ cảm xúc
                    </div>
                )}
                <br />
                <i>*Ghi chú: Nhấn @ để tag bạn bè, hãy thêm hashtag để có thể lên xu hướng</i>
                <TextEditor />
                {showImage && (
                    <input
                        type="file"
                        className="filepond"
                        name="filepond"
                        multiple
                        data-max-file-size="100MB"
                        data-max-files="4"
                    />
                )}
            </div>
            <button type="submit">Đăng</button>
        </form>
    );

    return (
        <React.Fragment>
            <div className="form-post--main">
                <div className="form-post--container">
                    <div className="row input-func">
                        <div className="avt-img">
                            <img src={dataOwner && dataOwner?.avatar} alt="avatar" />
                        </div>
                        <div onClick={() => { setShowPopup(true); setShowImage(false); setShowEmotion(false) }} className="btn-input">
                            {dataOwner && dataOwner?.user_name} ơi, bạn đang nghĩ gì thế?
                        </div>
                    </div>
                    <div className="row row-func">
                        <Link to="/story/create">
                            <div className="func btn-create--story">
                                <IoNewspaperSharp /> Đăng tin
                            </div>
                        </Link>
                        <div onClick={() => { setShowPopup(true); setShowImage(true); setShowEmotion(false) }} className="func btn-create--img">
                            <FaImages /> Đăng ảnh
                        </div>
                        <div onClick={() => { setShowPopup(true); setShowImage(false); setShowEmotion(true) }} className="func btn-create--react">
                            <BsEmojiLaughingFill /> Bày tỏ cảm xúc
                        </div>
                    </div>
                </div>
            </div>
            <div id="overlay">
                {showPopup && ReactDOM.createPortal(PopupContent, document.getElementById("overlay"))}
            </div>
        </React.Fragment>
    );
}
