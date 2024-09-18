import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import './ToolTip.scss';
function ToolTip({ children, title, onClick }) {
    return (
        <Tooltip
            onClick={onClick}
            className="main_tooltip"
            title={<span className="tooltip_title">{title}</span>}
            arrow
            componentsProps={{
                tooltip: {
                    sx: {
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
