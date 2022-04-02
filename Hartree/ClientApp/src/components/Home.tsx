import * as React from 'react';
import { connect } from 'react-redux';

const Home = () => (
  <div id="main-content">
  <h1>Welcome to Hartree!</h1>
  <p>Introduction here</p>
  <p>To use this app, you'll need to navigate to the system page</p>
  </div>
);

export default connect()(Home);
