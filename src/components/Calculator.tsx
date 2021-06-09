import * as React from 'react';
import CalculatorState from './CalculatorState';
import CalculatorProps from './CalculatorProps';
import './Calculator.css';

export default class Calculator extends React.Component<CalculatorProps, CalculatorState> {
    constructor(props: CalculatorProps) {
        super(props);
        this.state = new CalculatorState();
        let tempHistory = sessionStorage.getItem('balanceHistory');
        if (tempHistory) {
            this.setState({
                transactionHistory: JSON.parse(tempHistory)
            })
        };
        this.handleChange = this.handleChange.bind(this);
        this.addBalance = this.addBalance.bind(this);
        this.deductBalance = this.deductBalance.bind(this);
        this.displayTransactions = this.displayTransactions.bind(this);
        this.displayBalance = this.displayBalance.bind(this);
    }
    handleChange = (event: any) => {
        this.setState({ value: parseInt(event.target.value) });
    };
    onSubmit = (event: any) => {
        event.preventDefault();
    }
    saveToSession = (amount: number, action: string) => {
        let tempHistory = sessionStorage.getItem('balanceHistory');
        let date = new Date();
        let entry = date.toISOString() + ' - ' + amount + ' - ' + action;
        if (tempHistory) {
            let history = JSON.parse(tempHistory);
            let newEntry = [...history];
            newEntry.push(entry);
            sessionStorage.setItem('balanceHistory', JSON.stringify(newEntry));
            this.setState({
                transactionHistory: newEntry
            })
        } else {
            sessionStorage.setItem('balanceHistory', JSON.stringify([entry]));
            this.setState({
                transactionHistory: [entry]
            })
        }
    }
    addBalance = () => {
        this.setState({
            balance: this.state.balance + this.state.value
        });
        this.saveToSession(this.state.value, 'Add');
    }
    deductBalance = () => {
        this.setState({
            balance: this.state.balance - this.state.value
        });
        this.saveToSession(this.state.value, 'Remove');
    }
    displayBalance = () => {
        return (
            <div>
                <h1>Balance: {this.state.balance}</h1>
            </div>)
    }
    displayTransactions = () => {
        return (
            <ul>
                {this.state.transactionHistory.map((ele: string, index: number) => {
                    return (
                        <li key={index}>
                            {ele}
                        </li>
                    )
                })}
            </ul>
        )
    }
    render() {
        return (
            <span>
                <div className={'mainDiv'}>
                    {this.displayBalance()}
                    <form onSubmit={this.onSubmit}>
                        <div className={'inputStyle'}>
                            <input
                                id="balanceAmt"
                                type="number"
                                min="0" max="1000"
                                value={this.state.value}
                                onChange={this.handleChange}
                                step="50" />
                            <button type="submit" onClick={this.addBalance}>Add</button>
                            <button type="submit" onClick={this.deductBalance}>Remove</button>
                        </div>
                    </form>
                </div>
                {this.state.transactionHistory.length > 0 ?
                    <div className={'transactions'}>
                        <h3>Transactions:</h3>
                        {this.displayTransactions()}
                    </div> : <span />}
            </span>
        )
    }
}