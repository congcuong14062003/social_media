import AvatarUser from '../AvatarUser/AvatarUser';
import './MessagesItems.scss';
function MessagesItems({className, message}) {
    const classes = `receiver_user_container ${className}`
    return (
        <div className={classes}>
            <div className="content_receiver">
                <span>{message}</span>
            </div>
            {/* <div className="time_send">15:09</div> */}
        </div>
    );
}

export default MessagesItems;
