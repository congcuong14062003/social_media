import AvatarUser from '../AvatarUser/AvatarUser';
import Waveform from '../WaveSurfer/wave_surfer';
import './MessagesItems.scss';
function MessagesItems({ className, message, type }) {
    const classes = `receiver_user_container ${className}`;
    return (
        <div className={classes}>
            <div className="content_receiver">
                {type === 'text' && <span>{message}</span>}
                {type === 'audio' && <Waveform audioUrl={message} />}
                {type === "image" && (
                      <a download href={message}>
                        <img src={message} alt="content" />
                      </a>
                    )}
            </div>
            {/* <div className="time_send">15:09</div> */}
        </div>
    );
}

export default MessagesItems;
