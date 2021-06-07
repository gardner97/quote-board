import React from 'react'
//import Quote from './Quote'
import QuoteBlock from './QuoteBlock'
const _ = require('lodash');

//      indices:  [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11 ]
const allMonths = ['F','G','H','J','K','M','N','Q','U','V','X','Z'];
//                 Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec

// Trading Months (the months with available contracts to trade on CME for various commodities):
const bean_months = ["F","H","K","N","Q","U","X"]; // ZS
const bp_months =   ["F","H","K","N","Q","U","V","Z"] // ZM/ZL
const grain_months = ["H","K","N","U","Z"]; // ZC, ZW/KW/MW, ZO, CC, CT, KC, HG, SI
const rlj_months =  ["F", "H", "K", "N", "U", "X"]; // RR, LB, JO
const feed_months = ["F", "H", "J", "K", "Q", "U", "V", "X"]; // GF
const wood_months = ["F", "H", "K", "N", "U", "V"]; //LBS
const live_months = ["G", "J", "M", "Q", "U", "V", "Z"]; // LE
const lean_months = ["G", "J", "K", "M", "N", "Q", "V", "Z"]; // HE
const gold_months = ["G","J","M","Q","V","Z"]; // GC
const plat_months = ["F","J","N","V"]; // PL
//const rate_months = ["H", "M", "U", "Z"]; // DX, EU, BP, JU, SF, CD, AD, US, TY, TU, MB, FV, ED, UB
// Categories
//const grains_cat = ["ZC", "ZW", "ZS", "ZM", "ZL", "KW", "MW", "ZO"];
//const metals_cat = ["GC", "SI", "PL", "PA", "HG"];
const energy_cat = ["CL", "RB", "NG", "HO"];

const grain_amt = 8;
const meat_amt = 4;
const energy_amt = 12;
const metal_amt = 3;

const D = new Date();
//const WS = new WebSocket('ws://localhost:8080');
var wsUrl = window.location.protocol === 'https:'
	  ? "wss://www.contango.net:9534/"
	  : "ws://www.contango.net:9533/"
const WS = new WebSocket(wsUrl)
 
// get month letter with year number (ex: May 2021 -> K1)
function getCurContract() {
    return (allMonths[D.getMonth()] + getCurYear());
}

function getCurYear() {
    return String(D.getFullYear()).substr(-1);
}

// get the current array index for the cur comdty's trading months ar
// function getCurMonthIndex(curMonthAr) {
//     return (curMonthAr.indexOf(allMonths[D.getMonth()]));
// }

// get the next available contract month for the current comdty
function getNextContract(curAr, curDate) {
    const curM = curDate.charAt(0);
    const curY = parseInt(curDate.charAt(1));
    return (curAr.indexOf(curM) === curAr.length - 1 ? 
        (curAr[0] + (curY === 9 ? 0 : curY + 1)) : (curAr[curAr.indexOf(curM) + 1] + curY));
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
        return (m + y); // (e.g 'K1' for 'May 2021')
    }
}

// return the proper set (varying lengths) of trading months for a given symbol
function getTradingMonths(symbol) {
    let months;
    let num_months;
    switch (symbol) {
        case "ZS":
            months = bean_months;
            num_months = grain_amt;
            break;
        case "ZM":
        case "ZL":
            months = bp_months;
            num_months = grain_amt;
            break;
        case "ZC":
        case "ZW":
        case "KW":
        case "MW":
        case "ZO":
        case "CC":
        case "CT":
        case "KC":
            months = grain_months;
            num_months = grain_amt;
            break;
        case "HG":
        case "SI":
            months = grain_months;
            num_months = metal_amt;
            break;
        case "RR":
        case "LB":
        case "JO":
            months = rlj_months;
            num_months = 1;
            break;
        case "GF":
            months = feed_months;
            num_months = meat_amt;
            break;
        case "LE":
            months = live_months;
            num_months = meat_amt;
            break;
        case "HE":
            months = lean_months;
            num_months = meat_amt;
            break;
        case "LBS":
            months = wood_months;
            num_months = meat_amt;
            break;
        case "GC":
            months = gold_months;
            num_months = metal_amt;
            break;
        case "PL":
            months = plat_months;
            num_months = metal_amt;
            break;
        case "CL":
        case "HO":
        case "NG":
        case "RB":
            months = allMonths;
            num_months = energy_amt;
            break;
        case "DX":
        case "6E":
        case "6J":
        case "RMB":
        case "6B":
        case "6C":
        case "6A":
        case "6L":
        case "6M":
        case "ZT":
        case "Z3N":
        case "ZF":
        case "ZN":
        case "TN":
        case "ZB":
        case "ES":
        case "YM":
        case "NQ":
        case "RTY":
        case "BTC":
        case "ETH":
            months = allMonths;
            num_months = 1;
            break;
        default:
            console.error("unknown trading months for: " + symbol);
            break;
    }
    let tradingMonths = [];
    let cur = getFront(months, getCurContract());
    if (energy_cat.includes(symbol)) { // hard-coded for energy front-month (need to fix later)
        cur = getNextContract(months, getCurContract());
    }
    // determine following months from each comdty's set of valid months 
    for (let i = 0; i < num_months; i++) {
        tradingMonths.push(cur);
        cur = getNextContract(months, cur);
    }
    return tradingMonths;
}


// return the intilialized map for a given root (grayed-out with '?'s for data)
// quotesMap<key: SYMBOL+MY (e.g. ZCK1) , val: {symbol: SYMBOL+MY, h: ? o: ?, l: ?, px: ?}>
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
    // status:  comdtysMap<"ZC", monthsMap>  ->  months<"ZCK1", quoteObj>  ->  quote{symbol: , open: , high: , low: , px: }
    // status: map(root) of maps(symbols) of objects(price_data) 
    const [status, setStatus] = React.useState(initStatus(props.roots));

    // Return a map to hold maps with all the data for various comdty contracys at proper trading months
    function initStatus(roots) {
        const rootMap = new Map();
        // Add each root to the primary map
        for (let i = 0; i < roots.length; i++) {
            rootMap.set(roots[i], getInitRootMap(roots[i]));
        }
        if (rootMap.size !== roots.length) console.error("rootMap ERROR -- lengths uneven!");
        return rootMap;
    }

    // make sure the status data is updated in a manner that will trigger the children components to re-render
    React.useEffect(() => {
        WS.onmessage = (evt) => {
            const curEvt = JSON.parse(evt.data);
            // check if current comdty exists in outer map
            if (curEvt.type === "minute" && status.has(curEvt.root)) {
                // check if current symbol/month exists in the current inner map
                if (status.get(curEvt.root).has(curEvt.symbol)) {
                    if (curEvt.px_last !== status.get(curEvt.root).get(curEvt.symbol).px) {
                        // update status with clone to properly trigger re-render
                        // I found this cloneDeep solution on SO (the bottom comment in the link below)
                        // https://stackoverflow.com/questions/47624142/right-way-to-clone-objects-arrays-during-setstate-in-react
                        const clone = _.cloneDeep(status);
                        const newObj = {symbol: curEvt.symbol, 
                                        open: curEvt.session_open, 
                                        high: curEvt.session_high, 
                                        low: curEvt.session_low, 
                                        px: curEvt.px_last, 
                                        set: curEvt.px_settle};
                        clone.get(curEvt.root).set(curEvt.symbol, newObj);
                        // I'm not sure if the children maps within status are being cloned properly
                        setStatus(new Map(clone));
                        //setStatus(clone);

                        console.table(newObj)
                    }
                }
            }
        }
    });

    let keys = [...status.keys()];

    // -- old solution for dynamic QuoteBoard instead of how I currently have it fixed in render()
    // let blocks = [];
    // for (let i = 0; i < props.roots.length; i++) {
    //     blocks.push(<QuoteBlock status={status.get(keys[i])}/>);
    // }

    // const listItems = blocks.map((block) =>
    //     <li style={{listStyleType: "none"}}>{block}</li>
    // );

    // return(
    //     <div>
    //         <ul>{listItems}</ul>
    //     </div>
    // );

    return (
        <div className="row" style={{marginTop: "5px", marginLeft: "5px"}}>
            <div>
                <div>
                    {/* Grains */}
                    <QuoteBlock status={status.get(keys[0])} />
                    <QuoteBlock status={status.get(keys[1])} />
                    <QuoteBlock status={status.get(keys[2])} />
                    <QuoteBlock status={status.get(keys[3])} />
                    <QuoteBlock status={status.get(keys[4])} />
                    <QuoteBlock status={status.get(keys[5])} />
                </div> 
                <div className="row" style={{marginTop: "5px"}}>
                    <div style={{marginRight: "3px"}}>
                        {/* Feeder/Live Cattle */}
                        <QuoteBlock status={status.get(keys[6])} />
                        <QuoteBlock status={status.get(keys[7])} />
                    </div>
                    <div>
                        {/* Lean Hogs / Lumber */}
                        <QuoteBlock status={status.get(keys[8])} />
                        <QuoteBlock status={status.get(keys[9])} />
                    </div>
                </div>
            </div>
            <div> 
                <div style={{marginLeft: "4px"}}>
                    {/* Energies */}
                    <QuoteBlock status={status.get(keys[10])} />
                    <QuoteBlock status={status.get(keys[11])} />
                    <QuoteBlock status={status.get(keys[12])} />
                    <QuoteBlock status={status.get(keys[13])} />
                </div>

                <div className="row" style={{marginLeft: "5px"}}>
                    <div style={{marginTop: "5px"}}>
                        {/* Metals */}
                        <QuoteBlock status={status.get(keys[14])} />
                        <QuoteBlock status={status.get(keys[15])} />
                        <QuoteBlock status={status.get(keys[16])} />
                        <QuoteBlock status={status.get(keys[17])} />
                    </div>
                    <div style={{marginLeft: "5px", marginTop: "5px"}}>
                        <div className="row">
                            {/* Currencies */}
                            <QuoteBlock status={status.get(keys[18])} />
                            <QuoteBlock status={status.get(keys[19])} />
                            <QuoteBlock status={status.get(keys[20])} />
                            <QuoteBlock status={status.get(keys[21])} />
                            <QuoteBlock status={status.get(keys[22])} />
                            <QuoteBlock status={status.get(keys[23])} />
                            <QuoteBlock status={status.get(keys[24])} />
                            <QuoteBlock status={status.get(keys[25])} />
                            <QuoteBlock status={status.get(keys[26])} />
                        </div>
                        <div className="row">
                            {/* Bonds */}
                            <QuoteBlock status={status.get(keys[27])} />
                            <QuoteBlock status={status.get(keys[28])} />
                            <QuoteBlock status={status.get(keys[29])} />
                            <QuoteBlock status={status.get(keys[30])} />
                            <QuoteBlock status={status.get(keys[31])} />
                            <QuoteBlock status={status.get(keys[32])} />
                        </div>
                        <div className="row">
                            {/* Equity Indexes */}
                            <QuoteBlock status={status.get(keys[33])} />
                            <QuoteBlock status={status.get(keys[34])} />
                            <QuoteBlock status={status.get(keys[35])} />
                            <QuoteBlock status={status.get(keys[36])} />
                        </div>
                        <div className="row">
                            {/* Crypto */}
                            <QuoteBlock status={status.get(keys[37])} />
                            <QuoteBlock status={status.get(keys[38])} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

