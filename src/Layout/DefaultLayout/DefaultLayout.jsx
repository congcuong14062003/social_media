import './DefaultLayout.scss';
import { Fragment } from 'react';
import Header from './Header/Header';
function DefaultLayout({ children }) {
    return (
        <Fragment>
            <div className="container_content">
                {/* <SideBar /> */}
                <Header />
                <div className="content_body">{children}</div>
            </div>
        </Fragment>
    );
}

export default DefaultLayout;
