import React from 'react';

export default function Quote(props) {

    // gain = GREEN , loss = RED, neutral = GRAY
    function getColor(delta) {
        if (props.className === "quoteLoss4" || props.className === "quoteGain4") {
            return {color: 'white',
                    fontWeight: 'bold'}
        }
        if (delta < 0) {
            return {color: 'red'};
        } else if (delta > 0) {
            return {color: 'green'};
        } else {
            return {color:'gray'};
        }
    }
    

    function getClassName() {
        if (props.className.length > 0) {
            console.log(props.className);
            return props.className;
        } else {
            return "quoteDefault";
        }
    }


    console.log(props.symbol + " RENDER");
    return (
        <div className={getClassName()}>
            <h4 className="title">{props.symbol}</h4>
            <div className="innerData">
                <p className="innerData"><pre> O: {props.open}</pre></p>
                <p className="innerData"><pre> H: {props.high}</pre></p>
                <p className="innerData"><pre> L: {props.low}</pre></p>
                <p className="innerData">PX: <b>{props.last}</b></p>
                <p className="innerData"><pre> Δ: <span style={getColor(props.delta)}>{
                        props.delta > 0 ? 
                            "+"+props.delta : props.delta
                        }</span></pre>
                </p>
            </div>
        </div>
    );      
}
    
