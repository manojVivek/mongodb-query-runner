import DialogBox from '../components/DialogBox';
import NewQueryForm from './NewQueryForm';
import React from 'react';

import classNames from 'classnames';
import commonStyles from '../styles/common.css';
import styles from '../styles/header.css';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showQueryForm: false,
    }
  }

  render() {
    return (
      <div className={classNames(styles.root)}>
        <div>
          <img
            className={classNames(styles.logo)}
            src="/assets/rotating-wheel.svg"
          />
        </div>
        <div
          className={classNames(commonStyles.button)}
          onClick={() => this.setState({showQueryForm: true})}>
          <a href="javascript:;">New Query</a>
        </div>
        <div>
          <DialogBox
            onClose={() => this.setState({showQueryForm: false})}
            shown={this.state.showQueryForm}
            title="New Query">
            <NewQueryForm/>
          </DialogBox>
        </div>
      </div>
    );
  }

}

module.exports = Header;
