import React from 'react';
import Spinner from 'react-spinkit';

import classNames from 'classnames';
import styles from '../styles/loadingIndicator.css';

class LoadingIndicator extends React.Component {

  render() {
    return (
      <div className={classNames(styles.loader)}>
        <Spinner name="ball-scale-ripple-multiple" />
      </div>
    );
  }
}

module.exports = LoadingIndicator;
