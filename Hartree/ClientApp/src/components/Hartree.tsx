import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as HartreeStore from '../store/HartreeStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// At runtime, Redux will merge together...
type HartreeProps =
  HartreeStore.HartreeState // ... state we've requested from the Redux store
  & typeof HartreeStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ ticker: string }>; // ... plus incoming routing parameters


class App extends React.PureComponent<HartreeProps> {
  // This method is called when the component is first added to the document
  public componentDidMount() {
    this.ensureDataFetched('^GSPC');
  }

  public render() {
    return (
      <React.Fragment>
        <h1 id="tabelLabel">Hartree System</h1>
        <p>Hartree's UI</p>
            <select name="Ticker" onChange={(d) => {this.ensureDataFetched(d.target.value)} }>
                <option value="^GSPC">S&P 500</option>
                <option value="^DJI">Dow Jones Industrial Average</option>
                <option value="^IXIC">NASDAQ Composite</option>
                <option value="AAPL">Apple Inc.</option>
                <option value="PYPL">Paypal</option>
                <option value="ROKU">Roku, Inc.</option>
                <option value="TSLA">Tesla, Inc.</option>
                <option value="MSFT">Microsoft Corportation</option>
                <option value="GOOG">Google</option>
                <option value="AMZN">Amazon.com, Inc.</option>
                <option value="NVDA">Nvidia Corporation</option>
                <option value="SBUX">Starbucks</option>
                <option value="TWTR">Twitter, Inc.</option>
                <option value="FB">Meta Platofrms, Inc.</option>
                <option value="NFLX">Netflix, Inc.</option>
                <option value="ORCL">Oracle Corporation</option>
                <option value="F">Ford Motor Company</option>
                <option value="RBLX">Roblox Corporation</option>
                <option value="BTC-USD">Bitcoin - USD</option>
                <option value="CRO-USD">Crypto.com - USD</option>
        </select>
        <label htmlFor='begin'>Begin:</label>
        <input type='number' id='begin' onChange={(e) => {this.props.setLeftPoint(e.target.valueAsNumber)}}></input>

        <label htmlFor='end'>End:</label>
        <input type='number' id='end' onChange={(e) => {this.props.setRightPoint(e.target.valueAsNumber)}}></input>           
        <button onClick={() => {this.getOutputData()}}>Submit</button>
        {this.renderTable()}
        {this.chart()}
        
      </React.Fragment>
    );
  }

    private ensureDataFetched(ticker: string) {
      this.props.requestHartree(ticker);
    }

    private getOutputData() {
      //validate 
      if(this.props.data[0].close > this.props.leftPoint) {
        alert('Begin point must be bigger than the first value on the input table');
        return;
      }
      if(this.props.data[11].close > this.props.rightPoint) {
        alert('End point must be bigger than the last value on the input table');
        return;
      }
      this.props.requestHartreeOutput(this.props.ticker, this.props.leftPoint, this.props.rightPoint);
    }
    
  private chart() {
    if(Object.keys(this.props.dataChart).length > 0 && this.props.dataChart.constructor === Object) {
      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Hartee Chart',
          },
        },
      };

      return (<Line options={chartOptions} data={this.props.dataChart} />);
    }
  }

  private renderTable() {
    return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Close Price</th>
                        <th>Output</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.data.map((data: HartreeStore.HartreeData) =>
                        <tr>
                            <td>{data.dateTime.substring(0,7)}</td>
                            <td>{data.close.toLocaleString('en-US', {style: 'currency',currency: 'USD',}) }</td>
                            <td>{data.output}</td>
                        </tr>
                    )}
                </tbody>
            </table>
    );
}
}

export default connect(
  (state: ApplicationState) => state.hartree, // Selects which state properties are merged into the component's props
  HartreeStore.actionCreators // Selects which action creators are merged into the component's props
)(App as any); // eslint-disable-line @typescript-eslint/no-explicit-any
