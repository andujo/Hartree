import * as React from 'react';
import { connect } from 'react-redux';

const About = () => (
  <div id="main-content">
  <h1>Martín Sanchez Developed this awesome code challenge.</h1>
  <p>You can find my profile at <a href='https://www.linkedin.com/in/martin-sanchez-140a1b31/'>https://www.linkedin.com/in/martin-sanchez-140a1b31/</a></p>
  </div>
);

export default connect()(About);
