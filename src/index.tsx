import React from 'react';
import ReactDOM from 'react-dom';
import './localization';
import './index.scss';
import App from './App';
import 'semantic-ui-less/semantic.less';

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
