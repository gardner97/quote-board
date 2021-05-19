import React from 'react';
import Quote from './Quote';


function logMapElements(value, key, map) {
    console.log(`m[${key}] = ${value}`);
    console.table(value);
}

// I'm sure there's a cleaner way to write this with '=>'
function printProps(props) {
    for (let i = 0; i < props.status.length; i++) {
        const map = props.status[i];
        map.forEach(logMapElements);
    }
}


// each comdty has its own QuoteBlock consisting of multiple quotes (months)
export default function QuoteBlock(props) {
    // props.symbols  :  comdtysAr["ZC"]  ->  monthsMap<"ZCK1", quoteObj>  ->  quote{symbol: , open: , high: , low: , px: }
    // TODO: edit delta to look at new "px_settlement" instead of open
    
    //printProps(props);

    const mapAr = props.status;
    const frontQ = mapAr[0].get("ZCK1");
    console.table(frontQ);

    return (
        <div className="row" >
            {/* <Quote symbol={String(props.root + m0)} open={state.m0.open} high={state.m0.high} low={state.m0.low} last={state.m0.last} delta={state.m0.last - state.m0.open}/>
            <Quote symbol={String(props.root + m1)} open={state.m1.open} high={state.m1.high} low={state.m1.low} last={state.m1.last} delta={state.m1.last - state.m1.open}/>
            <Quote symbol={String(props.root + m2)} open={state.m2.open} high={state.m2.high} low={state.m2.low} last={state.m2.last} delta={state.m2.last - state.m2.open}/>
            <Quote symbol={String(props.root + m3)} open={state.m3.open} high={state.m3.high} low={state.m3.low} last={state.m3.last} delta={state.m3.last - state.m3.open}/>
            <Quote symbol={String(props.root + m4)} open={state.m4.open} high={state.m4.high} low={state.m4.low} last={state.m4.last} delta={state.m4.last - state.m4.open}/> */}
            <Quote  symbol={frontQ.symbol}
                    open={frontQ.open}
                    high={frontQ.high}
                    low={frontQ.low}
                    last={frontQ.px}
                    delta={frontQ.px - frontQ.open}
            />
        </div>
    );
}   
