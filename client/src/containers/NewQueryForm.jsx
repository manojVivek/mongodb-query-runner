import CodeFlask from '../components/CodeFlask';
import LoadingIndicator from '../components/LoadingIndicator';
import React from 'react';

import {resetCode, submitScript, updateCode} from '../actions';
import classNames from 'classnames';
import {connect} from 'react-redux';
import commonStyles from '../styles/common.css';
import styles from '../styles/newQueryForm.css';

const mapStateToProps = state => ({
  loading: state.newQuery.get('loading'),
  code: state.newQuery.get('code'),
});

const mapDispatchToProps = dispatch => ({
  submitNewQuery: code => dispatch(submitScript(code)),
  updateCode: code => dispatch(updateCode(code)),
  resetCode: () => dispatch(resetCode()),
});

class NewQueryForm extends React.Component {

  constructor(props) {
    super(props);
    this.defaultCode = 'rs.slaveOk();\n';
    this.flask = new CodeFlask;
    this.state = {
      code: this.props.code,
    }
  }

  componentDidMount() {
    this.flask.run('#editor', {language: 'javascript'});
    this._resetScript();
    this.flask.update(this.state.code);
    this.flask.onUpdate(code => {
      this.setState({code});
      this.props.updateCode(code);
    });
  }

  componentWillReceiveProps(props) {
    if (this.state.code !== props.code) {
      this.flask.update(props.code);
    }
  }

  render() {
    return (
      <div>
        <div className={classNames({[commonStyles.hidden]: !this.props.loading})}>
          <LoadingIndicator />
        </div>
        <div className={classNames({[commonStyles.hidden]: this.props.loading})}>
          <label>
            Script:
            <div id="editor" />
          </label>
          <div className={classNames(styles.controls)}>
            <div
              className={classNames(commonStyles.button)}
              onClick={this._submitQuery}>
              <a href="javascript:;">Submit Script</a>
            </div>
            <div
              className={classNames(commonStyles.button)}
              onClick={this._resetScript}>
              <a href="javascript:;">Reset Script</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _submitQuery = () => {
    console.log('Submitting', this.state.code);
    this.props.submitNewQuery(this.state.code);
  };

  _resetScript = () => {
    this.props.resetCode();
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(NewQueryForm);
