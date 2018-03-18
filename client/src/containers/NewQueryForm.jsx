import CodeFlask from '../components/CodeFlask';
import LoadingIndicator from '../components/LoadingIndicator';
import React from 'react';

import {submitScript} from '../actions';
import classNames from 'classnames';
import {connect} from 'react-redux';
import commonStyles from '../styles/common.css';
import styles from '../styles/newQueryForm.css';

const mapStateToProps = state => ({
  loading: state.newQuery.get('loading'),
});

const mapDispatchToProps = dispatch => ({
  submitNewQuery: code => dispatch(submitScript(code)),
});

class NewQueryForm extends React.Component {

  constructor(props) {
    super(props);
    this.defaultCode = 'rs.slaveOk();\n';
    this.flask = new CodeFlask;
    this.state = {
      code: this.defaultCode,
    }
  }

  componentDidMount() {
    this.flask.run('#editor', {language: 'javascript'});
    this._resetScript();
    this.flask.onUpdate(code => this.setState({code}));
  }

  render() {
    if (this.props.loading) {
      return <LoadingIndicator />;
    }
    return (
      <div>
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
    );
  }

  _submitQuery = () => {
    console.log('Submitting', this.state.code);
    this.props.submitNewQuery(this.state.code);
  };

  _resetScript = () => {
    this.flask.update(this.defaultCode);
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(NewQueryForm);
