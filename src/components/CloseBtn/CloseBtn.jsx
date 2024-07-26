import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CloseBtn.scss';
function CloseBtn({ onClick, className }) {
    const classes = `close_modal ${className}`;
    return (
        <div className={classes} onClick={onClick}>
            <FontAwesomeIcon icon={faXmark} />
        </div>
    );
}

export default CloseBtn;
