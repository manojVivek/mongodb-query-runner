import DialogBox from '../components/DialogBox';
import NewQueryForm from './NewQueryForm';
import React from 'react';

import {showQueryForm} from '../actions';
import classNames from 'classnames';
import {connect} from 'react-redux';
import commonStyles from '../styles/common.css';
import styles from '../styles/header.css';

const mapStateToProps = state => ({
  showQueryForm: state.newQuery.get('shown'),
});

const mapDispatchToProps = dispatch => ({
  openQueryForm: state => dispatch(showQueryForm(state)),
});

class Header extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props);
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
          onClick={() => this._queryFormState(true)}>
          <a href="javascript:;">New Query</a>
        </div>
        <div>
          <DialogBox
            onClose={() => this._queryFormState(false)}
            shown={this.props.showQueryForm}
            title="New Query">
            <NewQueryForm/>
          </DialogBox>
        </div>
      </div>
    );
  }

  _queryFormState = shown => {
    this.props.openQueryForm(shown);
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
