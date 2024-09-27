import AvatarUser from '../AvatarUser/AvatarUser';
import Waveform from '../WaveSurfer/wave_surfer';
import './MessagesItems.scss';
function MessagesItems({ className, message, type }) {
    const classes = `receiver_user_container ${className}`;
    return (
        <div className={classes}>
            {type === 'text' && <div className="content_receiver"><span>{message}</span></div>}
            {type === 'audio' && <div className="content_receiver"><Waveform audioUrl={message} /></div>}
            {type === 'image' && (
                <a download href={message}>
                    <img src={message} alt="content" />
                </a>
            )}
            {type === 'video' && (
                <a download href={message}>
                    <video controls muted src={message} alt="content" />
                </a>
            )}
            {/* <div className="time_send">15:09</div> */}
        </div>
    );
}

export default MessagesItems;
