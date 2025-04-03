import { Button } from '@mui/material';
import './ButtonCustom.scss';
import { ClassNames } from '@emotion/react';
function ButtonCustom({ title, onClick, startIcon, className, type, disabled, name }) {
    const classes = `btn_action_custom ${className}`;
    console.log(className);
    
    return (
        <Button name={name} disabled={disabled} type={type} onClick={onClick} className={classes} variant="contained" startIcon={startIcon}>
            {title}
        </Button>
    );
}

export default ButtonCustom;
