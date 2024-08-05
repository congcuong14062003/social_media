import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoSendSharp } from 'react-icons/io5';
import { IoCameraOutline } from "react-icons/io5";
import './Search.scss';
function Search({ placeholder, onChange, icon, onClick, iconSearch, handleOpenFile, handleSendMessage, value}) {
    return (
        <div className="search_container" onClick={onClick}>
            {iconSearch && (
                <div className="icon_search">
                    <FontAwesomeIcon fontSize="15px" icon={faMagnifyingGlass} />
                </div>
            )}
            <input type="text" value={value} onChange={onChange} placeholder={placeholder} />
            {icon && (
                <>
                    <div className="camera_comment" onClick={handleOpenFile}>
                    <IoCameraOutline />
                    </div>
                    <div className="send_comment" onClick={handleSendMessage}>
                        <IoSendSharp />
                    </div>
                </>
            )}
        </div>
    );
}

export default Search;
