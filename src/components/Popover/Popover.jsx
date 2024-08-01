import './Popover.scss';
function Popover({ children, title }) {
    return (
        <div className="popover_container">
            <div className="title_popover">{title}</div>
            <div className="body_popover">{children}</div>
        </div>
    );
}

export default Popover;
