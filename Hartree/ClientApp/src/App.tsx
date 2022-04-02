import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Hartree from './components/Hartree';
import About from './components/About';
//Remove this lines
import Counter from './components/Counter';
import FetchData from './components/FetchData'

import './custom.css'

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/hartree' component={Hartree} />
        <Route path='/about' component={About} />
        {/* Remove this lines */}
        <Route path='/counter' component={Counter} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />

    </Layout>
);
