import React from 'react';
import { Message } from "semantic-ui-react"
import './shared-styles.scss';

class NotFound extends React.Component {
  render() {
    return <div className="lost-screen-wrapper">
      <div>
        <p className="text">404</p>
        <Message info size="massive" header='Page not Found' content={<div>Get back to {<a href="/">Home</a>} safely.</div>} />
      </div>
    </div>
  }
}
export default NotFound;
