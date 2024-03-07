import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import {Provider} from "react-redux";
import store from "./app/configureStore";

ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
)
