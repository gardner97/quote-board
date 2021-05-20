import React from 'react'
//import Quote from './Quote'
import QuoteBlock from './QuoteBlock'
const _ = require('lodash');

//      indices:  [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11 ]
const allMonths = ['F','G','H','J','K','M','N','Q','U','V','X','Z'];

// Trading Months (the months with available contracts to trade on CME for various commodities):
const grain_months = ["H","K","N","U","Z"]; // corn, wheat, oats
const bean_months = ["F","H","K","N","Q","U","X"]; // soybeans/meal/oil
const gold_months = ["G","J","M","Q","V","Z"]; // gold

const D = new Date();
const WS = new WebSocket('ws://localhost:8080');


// get month letter with year number (ex: May 2021 -> K1)
function getCurContract() {
    return (allMonths[D.getMonth() + 1] + getCurYear());
}


function getCurYear() {
    return String(D.getFullYear()).substr(-1);
}


// get the current array index for the cur comdty's trading months ar
function getCurMonthIndex(curMonthAr) {
    return (curMonthAr.indexOf(allMonths[D.getMonth()]));
}


// get the next available contract month for the current comdty
function getNextContract(curAr, curDate) {
    const curM = curDate.charAt(0);
    const curY = parseInt(curDate.charAt(1));
    return (curAr.indexOf(curM) === curAr.length - 1 ? 
        (curAr[0] + (curY+1)) : (curAr[curAr.indexOf(curM) + 1] + curY));
}


// Get the next closest front month for the current comdty
function getFront(comdtyAr, curDate) {
    if (comdtyAr.includes(curDate.charAt(0))) {
        return curDate;
    } else {
        let m = curDate.charAt(0);
        let y = parseInt(curDate.charAt(1));
        while (!comdtyAr.includes(m)) {
            if (allMonths.indexOf[m] === allMonths.length - 1) { // wrap to next year
                m = allMonths[0];
                y++;
                if (y > curDate(1) + 1) console.error("couldn't find front month!");
            } else {
                m = allMonths[allMonths.indexOf(m) + 1];
            }
        }
        return (m + y);
    }
}


// return the proper set of trading months for a given symbol
// TODO: consider expanding to dynamically handle various numbers of months instead of fixed at 5
function getTradingMonths(symbol) {
    let months;
    switch (symbol) {
        case "ZC":
        case "ZW":
        case "ZO":
            months = grain_months;
            break;
        case "ZS":
        case "ZM":
        case "ZL":
            months = bean_months;
            break;
        case "GC":
            months = gold_months;
            break;
        case "CL":
        case "HO":
            months = allMonths;
            break;
        default:
            console.error("unknown trading months for :" + symbol);
            break;
    }
    const m0 = getFront(months, getCurContract());
    const m1 = getFront(months, getNextContract(months, m0));
    const m2 = getFront(months, getNextContract(months, m1));
    const m3 = getFront(months, getNextContract(months, m2));
    const m4 = getFront(months, getNextContract(months, m3));
    return [m0, m1, m2, m3, m4];
}


// return the intilialized map for a given root
// quotesMap<key: SYMBOL+MY (e.g. ZSK1) , val: {symbol: SYMBOL+MY, h: ? o: ?, l: ?, px: ?}>
function getInitRootMap(root) {
    const quotesMap = new Map();
    const tradingMonthsAr = getTradingMonths(root);
    for (let i = 0; i < tradingMonthsAr.length; i++) {
        const curSymbol = root + tradingMonthsAr[i];
        if (quotesMap.has(curSymbol)) console.error("quoteMap add ERROR -- How'd that get there??");
        const initObj = {symbol: curSymbol, high: "?", open: "?", low: "?", px: "?", set: "?"};
        // initialize starting data as ?'s before real prices are received
        quotesMap.set(curSymbol, initObj);
    }
    return quotesMap;
}


export default function QuoteBoard(props) {
    //console.log(props);
    
    // status:  comdtysAr["ZC"]  ->  monthsMap<"ZCK1", quoteObj>  ->  quote{symbol: , open: , high: , low: , px: }
    const [status, setStatus] = React.useState(initStatus(props.roots));
   
    /*
    handle issue of React being tricky with mutability and state updates. 
    I'll need to pass a new copy (use "...") instead of the same reference in order to trigger a re-render ... I think
    Tom, if you're familiar with how this works, some tips would be helpful 
    */
    // const updateStatus = (status) => {
    //     setStatus({...status});
    // }

    // Return an array to hold a map with all the data for various comdtys and their proper trading months
    function initStatus(roots) {
        // const rootAr = [];
        // for (let i = 0; i < roots.length; i++) {
        //     rootAr.push(getInitRootMap(props.roots[i]));
        // }
        // if (rootAr.length !== roots.length) console.error("rootAr ERROR -- lengths uneven!")
        // //console.table(rootAr);
        // return rootAr;

        //console.table(roots);
        const rootMap = new Map();
        for (let i = 0; i < roots.length; i++) {
            //console.log(roots[i]);
            rootMap.set(roots[i], getInitRootMap(roots[i]));
        }
        //console.log(rootMap.keys());
        console.log(rootMap);
        if (rootMap.size !== roots.length) console.error("rootMap ERROR -- lengths uneven!");
        return rootMap;
    }

    // TODO: expannd to handle incoming web socket messages and then update the proper pieces of status
    // make sure the status data is updated in a manner that will trigger the children components to re-render
    React.useEffect(() => {
        WS.onmessage = (evt) => {
            // console.log("new event: " + Date().split(" ")[4]);
            // console.log(evt.data);
            const curEvt = JSON.parse(evt.data.replace(/'/g, "\""));
            //console.table(status);
            // check if current comdty exists in outer map
            if (status.has(curEvt.root)) {
                console.log("🥸");
                // check if current symbol/month exists in the current inner map
                if (status.get(curEvt.root).has(curEvt.symbol)) {
                    // update status with clone to properly trigger re-render
                    const clone = _.cloneDeep(status);
                    const newObj = {symbol: curEvt.symbol, open: curEvt.px_open, high: curEvt.px_high, 
                                    low: curEvt.px_low, px: curEvt.px_last, set: curEvt.px_settle};
                    //clone[root_i].set(curEvt.symbol, newObj);
                    clone.get(curEvt.root).set(curEvt.symbol, newObj);
                    console.log(`${curEvt.symbol} price update!`);
                    console.table(newObj);
                    //updateStatus(clone);
                    setStatus(new Map(clone));
                }
            }
            
        }
    });

    let keys = [...status.keys()];

    return(
        <div>
            <QuoteBlock status={status.get(keys[0])}/>
            <QuoteBlock status={status.get(keys[1])}/>
            <QuoteBlock status={status.get(keys[2])}/>
            <QuoteBlock status={status.get(keys[3])}/>
            <QuoteBlock status={status.get(keys[4])}/>
            <QuoteBlock status={status.get(keys[5])}/>
        </div>
    );

    // return(
    //     <div>
    //     <p>testing...</p>
    //     <p>stateMap size: {stateMap.get("ZCK1").symbol}</p>
    //         <ul>
    //             {stateKeyAr.map((key) =>
    //             <li key={key}>
    //                 <h1>{stateMap.get(key).symbol}</h1>
    //                 <p>{stateMap.get(key).high}</p>
    //                 <p>{stateMap.get(key).open}</p>
    //                 <p>{stateMap.get(key).low}</p>
    //                 <p>{stateMap.get(key).px}</p>
    //             </li>
    //             )}
    //         </ul>
    //     </div>
    //   );
}

