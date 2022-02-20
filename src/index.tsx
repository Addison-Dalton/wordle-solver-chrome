import React from 'react';
import ReactDOM from 'react-dom';
import { StyleSheetManager } from 'styled-components';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const wrapper = document.createElement('div');
const shadowRoot = wrapper.attachShadow({ mode: 'open' });
const styleContainer = document.createElement('div');
const appContainer = document.createElement('div');
const hostStyle = document.createElement('style');
hostStyle.textContent = `
  :host {
    display: block;
  }
`;

shadowRoot.appendChild(styleContainer);
shadowRoot.appendChild(appContainer);
shadowRoot.appendChild(hostStyle);

document.body.appendChild(wrapper);


ReactDOM.render(
  <React.StrictMode>
    <StyleSheetManager target={styleContainer}>
      <App /> 
    </StyleSheetManager>
  </React.StrictMode>,
  appContainer
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
