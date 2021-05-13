import React, {useState} from 'react';

export default function Quote(props) {

    // constructor(props) {
    //     super(props);

    //     ws = props.ws;
    // }

    const ws = props.ws;

    const [state, setState] = React.useState({
        open: "?",
        high: "?",
        low: "?",
        last: "?",
        delta: "?"
    });

    React.useEffect(() => {
        ws.onmessage = (evt) => {
            // console.log("new event: " + Date().split(" ")[4]);
            // console.log(evt.data);
            let curEvt = JSON.parse(evt.data.replace(/'/g, "\""));
            // console.table(curEvt);
            if (curEvt.symbol === props.symbol) {
                updatePrices(curEvt);
            }
        }
    })

    // componentDidMount() {
  
    // }
    

    function updatePrices(evt) {
        console.log("updatePrice() : " + evt.symbol);
        // this.setState({
        //     open: evt.px_open,
        //     high: evt.px_high,
        //     low: evt.px_low,
        //     last: evt.px_last,
        //     delta: evt.px_last - evt.px_open
        // })
        setState({
            open: evt.px_open,
            high: evt.px_high,
            low: evt.px_low,
            last: evt.px_last,
            delta: evt.px_last - evt.px_open
        });
    }

    function logInfo() {
        console.log(`SYMBOL: ${state.symbol}, LAST: ${state.last}`);
    }


    // gain = GREEN , loss = RED, neutral = GRAY
    function getColor(delta) {
        if (delta < 0) {
            return {color: 'red'};
        } else if (delta > 0) {
            return {color: 'green'};
        } else {
            return {color:'gray'};
        }
    }


    return (
        <div className="myItem">
            <h3 style={{textAlign: "center"}}>{props.symbol}</h3>
            <p><pre> O: {state.open}</pre></p>
            <p><pre> H: {state.high}</pre></p>
            <p><pre> L: {state.low}</pre></p>
            <p>PX: <b>{state.last}</b></p>
            <p><pre> Δ: <span style={getColor(state.delta)}>{
                    state.delta > 0 ? 
                        "+"+state.delta : state.delta
                    }</span></pre>
            </p>
        </div>
    );    
}
    
