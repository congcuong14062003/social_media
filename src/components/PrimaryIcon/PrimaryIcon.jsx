import './PrimaryIcon.scss';
function PrimaryIcon({ icon, onClick, className, number }) {
    const classes = `primary_icon_background ${className}`;
    return (
        <div onClick={onClick} className={classes}>
            {number > 0 && <div className="number_count_notice">{number}</div>}
            {icon}
        </div>
    );
}

export default PrimaryIcon;
