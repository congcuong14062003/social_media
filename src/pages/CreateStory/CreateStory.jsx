import CloseBtn from '../../components/CloseBtn/CloseBtn';
import './CreateStory.scss';
function CreateStory() {
    return ( <div className="create_story_container">
        <div className="left_container">
            <div className="action_go_home">
                <CloseBtn className="close_create_story"  />
            </div>
        </div>
        <div className="right_container">

        </div>
    </div> );
}

export default CreateStory;