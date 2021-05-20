import React from 'react';

export default function Quote(props) {

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


    console.log(props.symbol + " RENDER");
    return (
        <div className="myItem">
            <h4 className="title">{props.symbol}</h4>
            <div className="innerData">
                <p className="innerData"><pre> O: <span style={getColor(props.delta)}>{props.open}</span></pre></p>
                <p className="innerData"><pre> H: <span style={getColor(props.delta)}>{props.high}</span></pre></p>
                <p className="innerData"><pre> L: <span style={getColor(props.delta)}>{props.low}</span></pre></p>
                <p className="innerData">PX: <b><span style={getColor(props.delta)}>{props.last}</span></b></p>
                <p className="innerData"><pre> Δ: <span style={getColor(props.delta)}>{
                        props.delta > 0 ? 
                            "+"+props.delta : props.delta
                        }</span></pre>
                </p>
            </div>
        </div>
    );    
}
    
