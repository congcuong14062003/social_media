import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import './ToolTip.scss';
function ToolTip({ children, title, onClick, className }) {
    const classes = `main_tooltip ${className}`;
    return (
        <Tooltip
            onClick={onClick}
            className={classes}
            title={<span className="tooltip_title">{title}</span>}
            arrow
            componentsProps={{
                tooltip: {
                    sx: {
                        // marginTop: '0px',
                        // bgcolor: 'rgba(0, 0, 0, 0.8)', // Màu nền đen với độ trong suốt 80%
                        // color: 'white', // Màu chữ
                        // border: '1px solid #dadde9',
                        padding: '10px', // Thêm padding
                        // '& .MuiTooltip-arrow': {
                        //   color: 'rgba(0, 0, 0, 0.8)', // Màu mũi tên với độ trong suốt 80%
                        // },
                    },
                },
            }}
        >
            <div>{children}</div>
        </Tooltip>
    );
}

export default ToolTip;
