import React from 'react';
import ReactDOM from 'react-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-less/semantic.less';

TimeAgo.addLocale(en);
TimeAgo.setDefaultLocale('en-US');

// We have to disable the following "errors", because they are actually warnings.
// The components that throw them work fine, so to keep the console clean from errors,
// we ignore these.
// const backup = console.error;
// console.error = function ignoreErrors(...rest: any[]) {
//   const supressedErrors: string[] = [
//     // 'Invalid prop `text` of type `object` supplied to `Dropdown`, expected `string`.',
//   ];
//
//   if (!supressedErrors.some((entry: any) => rest.includes(entry))) {
//     backup.apply(console, rest);
//   }
// };

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
