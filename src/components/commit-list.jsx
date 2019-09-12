import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './commit.css';

const { Fragment } = React;

class CommitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commitList: [],
    };
  }
  componentDidMount() {
    this.getCommitList();
  }

  getCommitList() {
    const { url } = this.props;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          commitList: data || [],
        });
      });
  }

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  render() {
    const { name } = this.props;
    const { commitList } = this.state;
    const DialogDOM = (
      <Fragment>
        <div className="dialog-mask" onClick={this.handleClose} />
        <div className="dialog">
          <div>
            <div className="dialog-close" onClick={this.handleClose}>
              X
            </div>
            <header className="dialog-header">repository: {name}</header>
            <main className="dialog-main">
              <div className="main-title">list of the commits made in the last 24 hours</div>
              {commitList.length ? (
                commitList.map((item, index) => (
                  <div key={item.sha} className="commit-content-box">
                    <div className="item-index">{index + 1}.</div>
                    <div>
                      <div className="item-message">
                        commit message: <span className="item-commit-text">{item.commit.message}</span>
                      </div>
                      <div className="item-date">
                        commit date: <span className="item-commit-text">{item.commit.author.date}</span>
                      </div>
                      <div className="item-author">
                        author: <span className="item-commit-text">{item.commit.author.name}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>no new commit</div>
              )}
            </main>
          </div>
        </div>
      </Fragment>
    );
    return ReactDOM.createPortal(DialogDOM, document.body);
  }
}

export default CommitList;
