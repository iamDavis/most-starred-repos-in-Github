import React, { Component } from 'react';
import CommitList from './commit-list';
import './style.css';

const { Fragment } = React;

class RepoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repoList: [],
      url: '',
      isShowCommitList: false,
      name: '',
    };
  }
  componentDidMount() {
    this.getRepoListByStar();
  }
  getCommitList(item) {
    const commitsUrl = item['commits_url'] || '';
    console.log(item);
    console.log(commitsUrl);
    const end = commitsUrl.indexOf('{/sha}') || 0;
    let url = commitsUrl.slice(0, end);
    const time = new Date(Date.now() - 86400000).toJSON();
    url = `${url}?since=format:${time}`;
    this.setState({
      url,
      isShowCommitList: true,
      name: item.name,
    });
  }

  getRepoListByStar() {
    fetch('https://api.github.com/search/repositories?q=stars:>=500&sort=stars&page=1&per_page=100')
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          repoList: data.items || [],
        });
      });
  }

  handleClose = () => {
    this.setState({
      isShowCommitList: false,
    });
  };
  render() {
    const { repoList, url, isShowCommitList, name } = this.state;
    return (
      <Fragment>
        <div className="list-wrapper">
          <div className="header">100 most starred Github repositories</div>
          <div className="main">
            {repoList.length ? (
              repoList.map((item) => (
                <div key={item.id} className="item" onClick={this.getCommitList.bind(this, item)}>
                  <div className="name">{item.name}</div>
                  <div className="stars item-text">
                    stars: <span className="text-content">{item['stargazers_count']}</span>
                  </div>
                  <div className="forks item-text">
                    forks: <span className="text-content">{item.forks}</span>
                  </div>
                  <div className="time item-text">
                    created: <span className="text-content">{item['created_at'].slice(0, 10)}</span>
                  </div>
                  <div className="link item-text">
                    url: <span className="text-content link-content">{item['html_url']}</span>
                  </div>
                </div>
              ))
            ) : (
              <div>loading...</div>
            )}
          </div>
        </div>
        {isShowCommitList && <CommitList url={url} handleClose={this.handleClose} name={name} />}
      </Fragment>
    );
  }
}

export default RepoList;
