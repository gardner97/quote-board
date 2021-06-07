import React from 'react';
import Quote from './Quote';

function getChangeColor(px_last, px_settle) {
    const percent_dif = ((px_last - px_settle) / px_last) * 100;
    if (percent_dif <= -5) {
        return "quoteLoss4";
    } else if (percent_dif > -5 && percent_dif <= -2.5) {
        return "quoteLoss3";
    } else if (percent_dif > -2.5 && percent_dif <= -1) {
        return "quoteLoss2";
    } else if (percent_dif > -1 && percent_dif < 0) {
        return "quoteLoss1";
    } else if (percent_dif > 0 && percent_dif < 1) {
        return "quoteGain1";
    } else if (percent_dif >= 1 && percent_dif < 2.5) {
        return "quoteGain2";
    } else if (percent_dif >= 2.5 && percent_dif < 5) {
        return "quoteGain3";
    } else if  (percent_dif >= 5) {
        return "quoteGain4";
    } else {
        return {backgroundColor: 'myItem'};
    }
}


// each comdty has its own QuoteBlock consisting of multiple quotes (months)
export default function QuoteBlock(props) {
    // props.status: comdtysMap<"ZC", monthsMap>  ->  months<"ZCK1", quoteObj>  ->  quote{symbol: , open: , high: , low: , px: }
    const map = props.status;
    const keys = [...map.keys()];

    let quotes = [];
    for (let i = 0; i < keys.length; i++) {
        quotes.push(map.get(keys[i]));
    }

    const listItems = quotes.map((quote) =>
        <li key={quote.symbol} style={{display: "inline-block"}}>
            <Quote  symbol={quote.symbol}
                    open=  {quote.open}
                    high=  {quote.high}
                    low=   {quote.low}
                    last=  {quote.px}
                    delta= {quote.px - quote.set}
                    settle={quote.set}
                    className={getChangeColor(quote.px, quote.set)}
                    key=   {quote.symbol + "key"}
            />
        </li>
    );

    return (
        <div className="row" >
            <ul style={{textAlign: "center", margin: "1px", padding: "0px"}}>{listItems}</ul>
        </div>
    );
}   
