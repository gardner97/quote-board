import React, {useState} from 'react'

const cur_month_i = 4;
//    indices: [ 0 ,  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 ,  8 ,  9 , 10 , 11 ]
const months = ['F1','G1','H1','J1','K1','M1','N1','Q1','U1','V1','X1','Z1']
const M1 = 1
const M2 = 2


function getColor(delta) {
    if (delta < 0) {
        return {color: 'red'};
    } else if (delta > 0) {
        return {color: 'green'};
    } else {
        return {color:'gray'};
    }
}

// component for each individual block for a given comdty/month
function Quote(props) {
    let state = {
        root: props.root,
        symbol: props.symbol,
        open: props.open,
        high: props.high,
        low: props.low,
        last: props.last,
        delta: props.last - props.open
    }



    return (
        <div>
            <h3>{state.symbol}</h3>
            <p> O: {state.open}</p>
            <p> H: {state.high}</p>
            <p> L: {state.low}</p>
            <p>PX: <b>{state.last}</b></p>
            <p> Δ: <span style={getColor(state.delta)}>
                            {state.delta > 0 ? "+"+state.delta : state.delta}</span>
            </p>
        </div>
    );

}


function QuoteBlock(props) {
    let state = {
        root: props.root,
        piece0: {root: props.root, symbol: props.root+months[cur_month_i], 
            open:"?", high:"?", low:"?", last:"?", delta:"?"
        },
        piece1: {root: props.root, symbol: props.root+months[cur_month_i + 2], 
            open:"?", high:"?", low:"?", last:"?", delta:"?"
        },
        piece2: {root: props.root, symbol: props.root+months[cur_month_i + 4], 
            open:"?", high:"?", low:"?", last:"?", delta:"?"
        }
    }

    const quote0 = <Quote state={state.piece0}/>
    const quote1 = <Quote state={state.piece1}/>

    return (
        <div>
            {quote0}
            {quote1}
        </div>
    )

}

class QuoteBoard extends React.Component {

    ws = new WebSocket('ws://localhost:8080');
    

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    

    // componentWillMount() {
        
    // }

    // componentWillUnmount() {

    // }

    

    componentDidMount() {
        if (!this.ws.OPEN) {
            this.ws.onopen = () => {
                console.log("connected");
            };
        }
        
        this.ws.onmessage = (evt) => {
            //console.log("new event: " + Date().split(" ")[4]);
            let curEvt = JSON.parse(evt.data.replace(/'/g, "\""));
            
            //console.log(curEvt.root)
            if (curEvt.root === this.state.root) {
                if (curEvt.symbol === this.state.root + months[cur_month_i]) {
                    console.log("1️⃣")
                    console.table(curEvt);
                    this.setState({
                        root: this.state.root,
                        m0_last: curEvt.px_last,
                        m0_hi: curEvt.px_high,
                        m0_lo: curEvt.px_low,
                        m0_open: curEvt.px_open
                    });
                } else if (curEvt.symbol === this.state.root + months[cur_month_i + 1]) {
                    console.log("2️⃣")
                    console.table(curEvt);
                    this.setState({
                        root: this.state.root,
                        m1_last: curEvt.px_last,
                        m1_hi: curEvt.px_high,
                        m1_lo: curEvt.px_low,
                        m1_open: curEvt.px_open
                    });
                } else if (curEvt.symbol === this.state.root + months[cur_month_i + 2]) {
                    console.log("3️⃣")
                    console.table(curEvt);
                    this.setState({
                        root: this.state.root,
                        m2_last: curEvt.px_last,
                        m2_hi: curEvt.px_high,
                        m2_lo: curEvt.px_low,
                        m2_open: curEvt.px_open
                    });
                } else {
                    console.log("🤷🏿")
                    console.table(curEvt)
                }
            }
            
        }
    }


    getDelta(m) {
        if (m === M1) {
            return this.state.m1_last - this.state.m1_open;
        } else if (m === M2) {
            return this.state.m2_last - this.state.m2_open;
        } else {
            return this.state.m0_last - this.state.m0_open;
        }
    }


    getColor(m) {
        const delta = this.getDelta(m);
        if (delta < 0) {
            return {color: 'red'}
        } else if (delta > 0) {
            return {color: 'green'}
        } else {
            return {color:'gray'}
        }
    }

    
    render() {
        var block1 = <div className="myItem">
                        <h3 id="title_m0">{this.state.root}{months[cur_month_i]}</h3>
                        <p id="p_open_m0">open: {this.state.m0_open}</p>
                        <p id="p_hi_m0">high: {this.state.m0_hi}</p>
                        <p id="p_lo_m0">low: {this.state.m0_lo}</p>
                        <p id="p_last_m0">last: <b>{this.state.m0_last}</b></p>
                        <p id="delta_m0"> Δ: <span style={this.getColor(0)}>
                            {this.getDelta() > 0 ? `+${this.getDelta(0)}` : this.getDelta()}</span>
                        </p>
                    </div>

        var block2 = <div className="myItem">
                        <h3 id="title_m1">{this.state.root}{months[cur_month_i + M1]}</h3>
                        <p id="p_open_m1">open: {this.state.m1_open}</p>
                        <p id="p_hi_m1">high: {this.state.m1_hi}</p>
                        <p id="p_lo_m1">low: {this.state.m1_lo}</p>
                        <p id="p_last_m1">last: <b>{this.state.m1_last}</b></p>
                        <p id="delta_m1"> Δ: <span style={this.getColor(M1)}>
                            {this.getDelta(M1) > 0 ? `+${this.getDelta(M1)}` : this.getDelta(M1)}</span>
                        </p>
                    </div>

        var block3 = <div className="myItem">
                        <h3 id="title_m2">{this.state.root}{months[cur_month_i + M2]}</h3>
                        <p id="p_open_m2">open: {this.state.m2_open}</p>
                        <p id="p_hi_m2">high: {this.state.m2_hi}</p>
                        <p id="p_lo_m2">low: {this.state.m2_lo}</p>
                        <p id="p_last_m2">last: <b>{this.state.m2_last}</b></p>
                        <p id="delta_m2"> Δ: <span style={this.getColor(M2)}>
                            {this.getDelta(M2) > 0 ? `+${this.getDelta(M2)}` : this.getDelta(M2)}</span>
                        </p>
                    </div>


        return (
            <div className="myStyle">
                <div className="row">
                    <div className="column">{block1} </div>
                    <div className="column">{block2} </div> 
                    <div className="column">{block3} </div>
                </div>
            </div>
        )
    }
}

export default QuoteBoard