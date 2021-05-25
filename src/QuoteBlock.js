import React from 'react';
import Quote from './Quote';

const D = new Date();
const rn = D.getHours() + ":" + D.getMinutes() + ":" + D.getSeconds();

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


function getChangeColor(px_last, px_settle) {
    const percent_dif = ((px_last - px_settle) / px_last) * 100;
    console.log(`time: ${rn}, px: ${px_last}, set: ${px_settle}`);
    console.log(percent_dif);
    if (percent_dif <= -5) {
        console.log("<= -5");
        return "quoteLoss4";
    } else if (percent_dif > -5 && percent_dif <= -2.5) {
        console.log(">-5 <=-2.5");
        return "quoteLoss3";
    } else if (percent_dif > -2.5 && percent_dif <= -1) {
        console.log(">-2.5 <= -1");
        return "quoteLoss2";
    } else if (percent_dif > -1 && percent_dif < 0) {
        console.log(">-1 < 0");
        return "quoteLoss1";
    } else if (percent_dif > 0 && percent_dif < 1) {
        console.log(">0 <1");
        return "quoteGain1";
    } else if (percent_dif >= 1 && percent_dif < 2.5) {
        console.log(">=-1 < 2.5");
        return "quoteGain2";
    } else if (percent_dif >= 2.5 && percent_dif < 5) {
        console.log(">=2.5 < 5");
        return "quoteGain3";
    } else if  (percent_dif >= 5) {
        console.log(">=5");
        return "quoteGain4";
    } else {
        console.log("default 0");
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


    return (
        <div className="row" >
            <Quote  symbol={map.get(keys[0]).symbol}
                    open=  {map.get(keys[0]).open}
                    high=  {map.get(keys[0]).high}
                    low=   {map.get(keys[0]).low}
                    last=  {map.get(keys[0]).px}
                    delta= {map.get(keys[0]).px - map.get(keys[0]).set}
                    settle={map.get(keys[0]).set}
                    className={getChangeColor(map.get(keys[0]).px, map.get(keys[0]).set)}
            />
            <Quote  symbol={map.get(keys[1]).symbol}
                    open=  {map.get(keys[1]).open}
                    high=  {map.get(keys[1]).high}
                    low=   {map.get(keys[1]).low}
                    last=  {map.get(keys[1]).px}
                    delta= {map.get(keys[1]).px - map.get(keys[1]).set}
                    settle={map.get(keys[1]).set}
                    className={getChangeColor(map.get(keys[1]).px, map.get(keys[1]).set)}
            />
            <Quote  symbol={map.get(keys[2]).symbol}
                    open=  {map.get(keys[2]).open}
                    high=  {map.get(keys[2]).high}
                    low=   {map.get(keys[2]).low}
                    last=  {map.get(keys[2]).px}
                    delta= {map.get(keys[2]).px - map.get(keys[2]).set}
                    settle={map.get(keys[2]).set}
                    className={getChangeColor(map.get(keys[2]).px, map.get(keys[2]).set)}
            />
            <Quote  symbol={map.get(keys[3]).symbol}
                    open=  {map.get(keys[3]).open}
                    high=  {map.get(keys[3]).high}
                    low=   {map.get(keys[3]).low}
                    last=  {map.get(keys[3]).px}
                    delta= {map.get(keys[3]).px - map.get(keys[3]).set}
                    settle={map.get(keys[3]).set}
                    className={getChangeColor(map.get(keys[3]).px, map.get(keys[3]).set)}
            />
            <Quote  symbol={map.get(keys[4]).symbol}
                    open=  {map.get(keys[4]).open}
                    high=  {map.get(keys[4]).high}
                    low=   {map.get(keys[4]).low}
                    last=  {map.get(keys[4]).px}
                    delta= {map.get(keys[4]).px - map.get(keys[4]).set}
                    settle={map.get(keys[4]).set}
                    className={getChangeColor(map.get(keys[4]).px, map.get(keys[4]).set)}
            />
        </div>
    );
}   
