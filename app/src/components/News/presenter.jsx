import React, { Component, PropTypes as T } from 'react';
import Nav from '../Nav';

export default class News extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Nav />
        Hello
      </div>
    );
  }
}

News.propTypes = {

};