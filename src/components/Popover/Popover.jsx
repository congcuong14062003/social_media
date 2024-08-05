import './Popover.scss';
function Popover({ children, title, className }) {
    const classes = `popover_container ${className}`;
    return (
        <div className={classes}>
            <div className="title_popover">{title}</div>
            <div className="body_popover">{children}</div>
        </div>
    );
}

export default Popover;
