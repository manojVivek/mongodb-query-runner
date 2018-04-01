import LoadingIndicator from '../components/LoadingIndicator';
import React from 'react';

import {fetchQueries} from '../actions';
import classNames from 'classnames';
import {connect} from 'react-redux';
import commonStyles from '../styles/common.css';
import styles from '../styles/runQueueList.css';


const mapStateToProps = state => ({
  loading: state.queriesList.get('loading'),
  queries: state.queriesList.get('queries'),
});

const mapDispatchToProps = dispatch => ({
  fetchQueries: lastId => dispatch(fetchQueries(lastId)),
});

class RunQueueList extends React.Component {

  componentDidMount() {
    this.props.fetchQueries();
  }

  render() {
    if (this.props.loading) {
      return <LoadingIndicator />;
    }
    return (
      <div>
        {this.props.queries.map(this._renderQuery)}
      </div>
    );
  }

  _renderQuery = query => {
    return (
      <div className={classNames(styles.card)}>
        <div className={classNames(styles.querySection)}><pre>{query.code}</pre></div>
        <div className={classNames(styles.resultSection)}><pre>{query.status === 'COMPLETED'? query.result.content : query.status }</pre></div>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(RunQueueList);
