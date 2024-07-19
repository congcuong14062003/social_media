import { Button } from '@mui/material';
import './ButtonCustom.scss';
function ButtonCustom({ title, onClick, startIcon, className, type }) {
    const classes = `btn_action_custom ${className}`;
    return (
        <Button type={type} onClick={onClick} className={classes} variant="contained" startIcon={startIcon}>
            {title}
        </Button>
    );
}

export default ButtonCustom;
