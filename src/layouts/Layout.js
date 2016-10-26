import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Notifications from '../components/Notifications';
import Modal from '../components/Modal';
import Error from '../components/Error';
import { rawFetch as fetch } from '~/fetch';
import { hideModal } from '~/actions/modal';
import { showNotifications } from '~/actions/notifications';

export class Layout extends Component {
  constructor() {
    super();
    this.renderError = this.renderError.bind(this);
    this.hideShowNotifications = this.hideShowNotifications.bind(this);
    this.state = { title: '', link: '' };
  }

  /* eslint-disable react/no-did-mount-set-state */
  async componentDidMount() {
    if (this.state.title === '') {
      try {
        const resp = await fetch('https://blog.linode.com/feed/', {
          mode: 'cors',
        });
        const parser = new DOMParser();
        const xml = parser.parseFromString(await resp.text(), 'text/xml');
        const latest = xml.querySelector('channel item');
        const title = latest.querySelector('title').textContent;
        const link = latest.querySelector('link').textContent;
        this.setState({ title, link });
      } catch (ex) {
        // Whatever
      }
    }
  }

  async hideShowNotifications() {
    const { dispatch } = this.props;
    await dispatch(hideModal());
    await dispatch(showNotifications());
  }

  renderError() {
    const { errors } = this.props;
    const subject = encodeURIComponent(`${errors.status} ${errors.statusText}`);
    const location = window.location.href;
    const json = JSON.stringify(errors.json, null, 4);
    const body = encodeURIComponent(
      `I'm getting the following error on ${location}:\n\n${json}`);
    const href = `mailto:support@linode.com?subject=${subject}&body=${body}`;
    return (
      <Error status={errors.status} href={href} />
    );
  }

  render() {
    const { username, emailHash, currentPath, errors } = this.props;
    const { title, link } = this.state;
    return (
      <div className="layout full-height">
        <Header
          username={username}
          emailHash={emailHash}
          link={link}
          title={title}
          hideShowNotifications={this.hideShowNotifications}
        />
        <Sidebar path={currentPath} />
        <Notifications />
        <div className="main full-height">
          <Modal />
          {!errors.status ?
           this.props.children :
           this.renderError()}
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  username: PropTypes.string,
  emailHash: PropTypes.string,
  currentPath: PropTypes.string,
  children: PropTypes.node.isRequired,
  errors: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
};

function select(state) {
  return {
    username: state.authentication.username,
    emailHash: state.authentication.emailHash,
    currentPath: state.routing.locationBeforeTransitions.pathname,
    errors: state.errors,
  };
}

export default connect(select)(Layout);
