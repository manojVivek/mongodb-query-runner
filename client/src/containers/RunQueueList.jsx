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

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchQueries();
    addEventListener('scroll', event => {
      const scrollTop = window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      const scrollHeight = document.documentElement.scrollHeight ||
        document.body.scrollHeight ||
        0;
      const pixelsFromBottom =
        scrollHeight - (scrollTop +  window.innerHeight);

      const threshold = 1500

      if (!this.state.autoLoadingInProgress && pixelsFromBottom < threshold) {
        this.setState({autoLoadingInProgress: true});
        this._loadMore();
      }

      if (this.state.autoLoadingInProgress && pixelsFromBottom >= threshold) {
        this.setState({autoLoadingInProgress: false});
      }
    });
  }

  _loadMore = () => {
    this.props.fetchQueries(this.props.queries[this.props.queries.length - 1]._id);
  }

  render() {
    return (
      <div>
        <div className={classNames(styles.header)}>
          <span className={classNames(styles.headerTitle)}>Results</span>
          <div
            className={classNames(commonStyles.button, styles.refreshButton)}
            onClick={() => this._refreshList()}>
            <a href="javascript:;" title="Refresh Results">&#10227;</a>
          </div>
        </div>
        {this._renderList()}
      </div>
    );
  }

  _refreshList = () => this.props.fetchQueries();

  _renderList = () => {
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
      <div className={classNames(styles.card)} key={query._id}>
        <div className={classNames(styles.querySection)}><pre>{query.code}</pre></div>
        <div className={classNames(styles.resultSection)}><pre>{query.status === 'COMPLETED'? query.result.content : query.status }</pre></div>
        <div className={classNames(styles.timeSection)}>{this._getTimeAgo(query.createTs)} ago</div>
      </div>
    )
  }

  _getTimeAgo = createDate => {
    const ago = ((new Date()).getTime() - new Date(createDate).getTime()) / 1000;
    if (ago < 10) {
      return 'moments';
    }
    if (ago < 60) {
      return 'less than a minute';
    }
    if (ago < 120) {
      return 'a minute';
    }
    if (ago < 3600 * 2) {
      return `${Math.round(ago / 60)} minutes`;
    }
    if (ago < (3600 * 24 * 2)) {
      return `${Math.round(ago / 3600)} hours`;
    }
    return `${Math.round(ago / (3600 * 24))} days`;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(RunQueueList);
