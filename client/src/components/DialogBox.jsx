import React from 'react';

import classNames from 'classnames';
import commonStyles from '../styles/common.css';
import styles from '../styles/dialogBox.css';

class DialogBox extends React.Component {

  constructor(props) {
    super(props);
    console.log('this.props.shown', this.props.shown);
    this.state = {
      shown: this.props.shown,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({expanded: false, shown: nextProps.shown});
  }

  render() {
    return (
      <div
        className={classNames(
          styles.overlay,
          {[styles.hidden]: !this.state.shown}
        )}>
        <div
          className={classNames(
            styles.container,
            {[styles.expandedContainer]: this.state.expanded}
          )}>
          <div className={classNames(styles.titleBar)}>
            <div className={classNames(styles.title)}>
              {this.props.title}
            </div>
            <div
              className={classNames(commonStyles.button)}
              onClick={this._closeDialog}>
              <a href="javascript:;">&times;</a>
            </div>
            <div
              className={classNames(commonStyles.button)}
              onClick={this._expandDialog}>
              <a href="javascript:;">&harr;</a>
            </div>
          </div>
          <div className={classNames(styles.content)}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  };

  _closeDialog = () => {
    this.setState({shown: false}, this.props.onClose);
  };

  _expandDialog = () => {
    this.setState({expanded: !this.state.expanded});
  }
}

module.exports = DialogBox;
