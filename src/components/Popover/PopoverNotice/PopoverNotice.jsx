import { Link } from 'react-router-dom';
import NoticeItem from '../../NoticeItem/NoticeItem';
import './PopoverNotice.scss';
import Popover from '../Popover';
function PopoverNotice() {
    return (
        <Popover title="Thông báo">
            <div className="link_full_notice">
                <Link>Xem tất cả</Link>
            </div>
            <div className="list_notice">
                <NoticeItem />
                <NoticeItem />
                <NoticeItem />
                <NoticeItem />
                <NoticeItem />
                <NoticeItem />
                <NoticeItem />
                <NoticeItem />
                <NoticeItem />
            </div>
        </Popover>
    );
}

export default PopoverNotice;
