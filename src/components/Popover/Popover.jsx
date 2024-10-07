import './Popover.scss';
function Popover({ children, title, className, inputRef }) {
    const classes = `popover_container ${className}`;
    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    return (
        <div onClick={handleClick} className={classes}>
            <div className="title_popover">{title}</div>
            <div className="body_popover">{children}</div>
        </div>
    );
}

export default Popover;
