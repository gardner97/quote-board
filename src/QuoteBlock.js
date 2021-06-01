import React from 'react';
import Quote from './Quote';

function getChangeColor(px_last, px_settle) {
    const percent_dif = ((px_last - px_settle) / px_last) * 100;
    //console.log(`time: ${rn}, px: ${px_last}, set: ${px_settle}`);
    //console.log(percent_dif);
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
    // props.symbols  :  comdtysMap<"ZC", monthsMap>  ->  monthsMap<"ZCK1", quoteObj>  ->  quote{symbol: , open: , high: , low: , px: }
    // update: receiving only the map now, no need for Block to see other 
    // TODO: edit delta to look at new "px_settlement" instead of open
    
    //printProps(props);

    const map = props.status;
    //console.log(map)
    //const frontQ = mapAr[0].get("ZCK1");
    //console.table(frontQ);
    //console.table(mapAr);
    const keys = [...map.keys()];
    //console.table(mapSet)

    let quotes = [];
    for (let i = 0; i < keys.length; i++) {
        quotes.push(<Quote  symbol={map.get(keys[i]).symbol}
                            open=  {map.get(keys[i]).open}
                            high=  {map.get(keys[i]).high}
                            low=   {map.get(keys[i]).low}
                            last=  {map.get(keys[i]).px}
                            delta= {map.get(keys[i]).px - map.get(keys[i]).set}
                            settle={map.get(keys[i]).set}
                            className={getChangeColor(map.get(keys[i]).px, map.get(keys[i]).set)}
                        />)
    }

    const listItems = quotes.map((quote) =>
        <li style={{display: "inline-block"}}>{quote}</li>
    );


    return (
        <div className="row" >
            <ul style={{textAlign: "center", 
                        marginTop: "1px", marginBottom: "2px", 
                        marginLeft: "1px", marginRight: "1px", padding: "0px"}}>{listItems}</ul>
        </div>
    );
}   
