import { Ticks } from 'chart.js';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface HartreeState {
    isLoading: boolean;
    ticker: string;
    data: HartreeData[];
    dataOutput: HartreeOutputData[],
    dataChart: {},
    leftPoint: number;
    rightPoint: number;
}

export interface HartreeData {
    dateTime: string,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    adjustedClose: number,
    output: string
}

export interface HartreeOutputData {
    timeLine: string,
    value: number
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestHartreeAction {
    type: 'REQUEST_HARTREE';
    ticker: string;
}

interface ReceiveHartreeAction {
    type: 'RECEIVE_HARTREE';
    ticker: string;
    data: HartreeData[];
}

interface RequestHartreeOutputAction {
    type: 'REQUEST_HARTREE_OUTPUT';
    ticker: string;
    leftPoint: number;
    rightPoint: number;
}

interface ReceiveHartreeOutputAction {
    type: 'RECEIVE_HARTREE_OUTPUT';
    ticker: string;
    // leftPoint: number;
    // rightPoint: number;
    // data: HartreeData[];
    dataOutput: HartreeOutputData[];
}

interface SetLeftPointAction {
    type: 'SET_LEFT_POINT';
    leftPoint: number;
}

interface SetRightPointAction {
    type: 'SET_RIGHT_POINT';
    rightPoint: number;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestHartreeAction | ReceiveHartreeAction | RequestHartreeOutputAction | ReceiveHartreeOutputAction | SetLeftPointAction | SetRightPointAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
    setLeftPoint: (value: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.hartree ) {
            dispatch( { type: 'SET_LEFT_POINT', leftPoint: value});
        }
    },
    setRightPoint: (value: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.hartree ) {
            dispatch( { type: 'SET_RIGHT_POINT', rightPoint: value});
        }
    },
    requestHartree: (ticker: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.hartree && ticker !== appState.hartree.ticker) {
            fetch(`api/Core/GetYahoo?ticker=` + ticker)
                .then(response => response.json() as Promise<HartreeData[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_HARTREE', ticker: ticker, data: data });
                });

            dispatch({ type: 'REQUEST_HARTREE', ticker: ticker });
        }
    },
    requestHartreeOutput: (ticker: string, leftPoint: number, rightPoint: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.hartree) {
            fetch(`api/Core/PostYahoo`, {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                leftPoint: leftPoint,
                rightPoint: rightPoint,
                ticker: ticker
              })
              }).then(response => response.json() as Promise<HartreeOutputData[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_HARTREE_OUTPUT', ticker:ticker, dataOutput: data});
                });

            dispatch({ type: 'REQUEST_HARTREE_OUTPUT', ticker: ticker, leftPoint: leftPoint, rightPoint: rightPoint });
        }
    },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: HartreeState = { data: [], isLoading: false, ticker: '', dataOutput: [], rightPoint: 0, leftPoint: 0, dataChart: {} };

export const reducer: Reducer<HartreeState> = (state: HartreeState | undefined, incomingAction: Action): HartreeState => {
    if (state === undefined) {
        return unloadedState;
    }

    function fillDataOutput(data: HartreeData[], dataOutput: HartreeOutputData[]) {
        for(let i = 0; i < data.length; i++) {
            data[i].output = dataOutput[i].value.toLocaleString('en-US', {style: 'currency',currency: 'USD',});
        }
        return data;
    }

    function generateChartData(data: HartreeData[], dataOutput: HartreeOutputData[]) {
        const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        const labels = data.map(i => monthNames[(new Date(i.dateTime)).getMonth()]);
        return {
            labels,
            datasets: [{
                label: 'Stock price',
                data: data.map(i => i.close),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label: 'Output',
                data: dataOutput.map(i => i.value),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              }]};
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_HARTREE':
            return {
                ticker: action.ticker,
                data: state.data,
                isLoading: true,
                dataOutput: state.dataOutput,
                rightPoint: state.rightPoint,
                leftPoint: state.leftPoint,
                dataChart: state.dataChart
            };
        case 'RECEIVE_HARTREE':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.ticker === state.ticker) {
                return {
                    ticker: action.ticker,
                    data: action.data,
                    isLoading: false,
                    dataOutput: state.dataOutput,
                    rightPoint: state.rightPoint,
                    leftPoint: state.leftPoint,
                    dataChart: state.dataChart
                };
            }
            break;
        case 'REQUEST_HARTREE_OUTPUT':
                return {
                    ticker: action.ticker,
                    data: state.data,
                    isLoading: true,
                    dataOutput: state.dataOutput,
                    rightPoint: state.rightPoint,
                    leftPoint: state.leftPoint,
                    dataChart: state.dataChart
                };
        case 'RECEIVE_HARTREE_OUTPUT':
            if (action.ticker === state.ticker) {
                return {
                    ticker: state.ticker,
                    dataOutput: action.dataOutput,
                    isLoading: false,
                    data: fillDataOutput(state.data, action.dataOutput),
                    rightPoint: state.rightPoint,
                    leftPoint: state.leftPoint,
                    dataChart: generateChartData(state.data, action.dataOutput)
                };
            }
            break;
        case 'SET_LEFT_POINT':
            return {
                ticker: state.ticker,
                data: state.data,
                isLoading: false,
                dataOutput: state.dataOutput,
                rightPoint: state.rightPoint,
                leftPoint: action.leftPoint,
                dataChart: state.dataChart
            };
        case 'SET_RIGHT_POINT':
            return {
                ticker: state.ticker,
                data: state.data,
                isLoading: false,
                dataOutput: state.dataOutput,
                rightPoint: action.rightPoint,
                leftPoint: state.leftPoint,
                dataChart: state.dataChart
            };
    }

    return state;
};
