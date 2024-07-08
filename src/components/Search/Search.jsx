import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Search.scss';
function Search({placeholder}) {
    return (
        <div className="search_container">
            <div className="icon_search">
                <FontAwesomeIcon fontSize="15px" icon={faMagnifyingGlass} />
            </div>
            <input type="text" placeholder={placeholder} />
        </div>
    );
}

export default Search;
