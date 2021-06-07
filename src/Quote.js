import React from 'react';

export default class Quote extends React.Component {


    // gain = GREEN , loss = RED, neutral = GRAY
    getColor(delta) {
        if (this.props.className === "quoteLoss4" || this.props.className === "quoteGain4"
            || this.props.className === "quoteLoss3" || this.props.className === "quoteGain3") {
            return {color: 'white',
                    textShadow: '0.5px 0.5px #000000'
                }
        }
        if (this.props.className === "quoteLoss2" || this.props.className === "quoteGain2") {
            return {color: 'white'}
        }
        if (delta < 0) {
            return {color: 'red', textShadow: '0.3px 0.3px #ffffff'};
        } else if (delta > 0) {
            return {color: 'blue', textShadow: '0.3px 0.3px #ffffff'};
        } else {
            return {color:'gray'};
        }
    }
    

    getClassName() {
        if (this.props.className.length > 0) {
            //console.log(this.props.className);
            return this.props.className;
        } else {
            return "quoteDefault";
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps !== this.props);
    }

    
    // render () {
    //     //console.log(`🤡 RENDER: ${this.props.symbol}`);
    //     return (
    //     <div className={this.getClassName()}>
    //         <h4 className="title">{this.props.symbol}</h4>
    //         <div>
    //             <span className="innerData"><pre> O: {this.props.open}</pre></span>
    //             <span className="innerData"><pre> H: {this.props.high}</pre></span>
    //             <span className="innerData"><pre> L: {this.props.low}</pre></span>
    //             <span className="innerData">PX:<b>{this.props.last}</b></span>
    //             <span className="innerData"><pre> Δ: <span style={this.getColor(this.props.delta)}>{
    //                     this.props.delta > 0 ? 
    //                         "+"+this.props.delta : this.props.delta}</span></pre>
    //             </span>
    //         </div>
    //     </div>
    //     );      
    // }

    render () {
        //console.log(`🤡 RENDER: ${this.props.symbol}`);
        return (
        <div className={this.getClassName()}>
            <h4 className="title">{this.props.symbol}</h4>
            <div>
                <span className="innerData"><pre>{this.props.open}</pre></span>
                <span className="innerData"><pre>{this.props.high}</pre></span>
                <span className="innerData"><pre>{this.props.low}</pre></span>
                <span className="innerData"><b>{this.props.last}</b></span>
                <span className="innerData"><pre><span style={this.getColor(this.props.delta)}>{
                        this.props.delta > 0 ? 
                            "+"+this.props.delta.toString() : this.props.delta.toString()}</span></pre>
                </span>
            </div>
        </div>
        );      
    }
}
    
