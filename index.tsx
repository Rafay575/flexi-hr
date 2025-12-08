import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // or './main.css'
import { Provider } from 'react-redux';
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
import { store } from './redux/store/store';
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
      <Provider store={store}>

    <App />
      </Provider>
  </React.StrictMode>
);