import React from 'react';

export default class Quote extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            symbol: props.symbol,
            open: props.open,
            high: props.high,
            low: props.low,
            last: props.last,
            delta: props.last - props.open
        }
    }

    componentDidMount() {
        const ws = this.props.ws;
        ws.onmessage = (evt) => {
            // console.log("new event: " + Date().split(" ")[4]);
            // console.log(evt.data);
            let curEvt = JSON.parse(evt.data.replace(/'/g, "\""));
            // console.table(curEvt);
            if (curEvt.symbol === this.props.symbol) {
                this.updatePrices(curEvt);
            }
        }
    }

    updatePrices(evt) {
        console.log("updatePrice()");
        this.setState({
            open: evt.px_open,
            high: evt.px_high,
            low: evt.px_low,
            last: evt.px_last,
            delta: evt.px_last - evt.px_open
        })
        // this.props.open = evt.px_open;
        // this.props.high = evt.px_high;
        // this.props.low = evt.px_low;
        // this.props.last = evt.px_last;
        // this.props.delta = evt.px_last - evt.px_open;
    }

    logInfo() {
        console.log(`SYMBOL: ${this.props.symbol}, LAST: ${this.props.last}`);
    }


    // gain = GREEN , loss = RED, neutral = GRAY
    getColor(delta) {
        if (delta < 0) {
            return {color: 'red'};
        } else if (delta > 0) {
            return {color: 'green'};
        } else {
            return {color:'gray'};
        }
    }

    render() {
        return (
            <div className="myItem">
                <h3 style={{textAlign: "center"}}>{this.state.symbol}</h3>
                <p><pre> O: {this.state.open}</pre></p>
                <p><pre> H: {this.state.high}</pre></p>
                <p><pre> L: {this.state.low}</pre></p>
                <p>PX: <b>{this.state.last}</b></p>
                <p><pre> Δ: <span style={this.getColor(this.state.delta)}>{
                        this.state.delta > 0 ? 
                            "+"+this.state.delta : this.state.delta
                        }</span></pre>
                </p>
            </div>
        );
    }
}