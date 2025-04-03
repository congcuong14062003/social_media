import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../src/assets/styles/mixin.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './redux/Store/store';
import { Provider } from 'react-redux';
import GlobalStyles from './components/GlobalStyles/index.js';
import app from './configs/firebase.js';
import { LoadingProvider } from './components/Loading/Loading.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
        <Provider store={store}>
            <LoadingProvider>
                <GlobalStyles>
                    <App />
                </GlobalStyles>
            </LoadingProvider>
        </Provider>
    // </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
