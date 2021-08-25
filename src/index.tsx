import React from 'react';
import styles from './index.scss';

import ReactDOM from 'react-dom';
const App = () => {
    return <h1 className={styles.title}>Hello Wepack!</h1>;
};
ReactDOM.render(<App />, document.getElementById('root'));