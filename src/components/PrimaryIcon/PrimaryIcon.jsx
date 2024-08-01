import './PrimaryIcon.scss';
function PrimaryIcon({ icon, onClick, className }) {
    const classes = `primary_icon_background ${className}`;
    return (
        <div onClick={onClick} className={classes}>
            {icon}
        </div>
    );
}

export default PrimaryIcon;
