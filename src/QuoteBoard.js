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
const feed_months = ["F", "H", "J", "K", "Q", "U", "V", "X"]; // FC
const live_months = ["G", "J", "M", "Q", "U", "V", "Z"]; // LE
const lean_months = ["G", "J", "K", "M", "N", "Q", "V", "Z"]; // HE
const gold_months = ["G","J","M","Q","V","Z"]; // GC
const plat_months = ["F","J","N","V"]; // PL
const rate_months = ["H", "M", "U", "Z"]; // DX, EU, BP, JU, SF, CD, AD, US, TY, TU, MB, FV, ED, UB
// Categories
const grains_cat = ["ZC", "ZW", "ZS", "ZM", "ZL", "KW", "MW", "ZO"];
const metals_cat = ["GC", "SI", "PL", "PA", "HG"];
const energy_cat = ["CL", "XB", "NG", "HO"];

const grain_amt = 8;
const meat_amt = 4;
const energy_amt = 12;
const metal_amt = 3;


const D = new Date();
const WS = new WebSocket('ws://localhost:8080');
//const WS = new WebSocket('');


// get month letter with year number (ex: May 2021 -> K1)
function getCurContract() {
    return (allMonths[D.getMonth() + 1] + getCurYear());
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
        return (m + y);
    }
}


// return the proper set of trading months for a given symbol
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
        case "FC":
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
        case "GC":
            months = gold_months;
            num_months = metal_amt;
            break;
        case "PL":
            months = plat_months;
            num_months = metal_amt;
            break;
        case "DX":
        case "EU":
        case "BP":
        case "JU":
        case "SF":
        case "CD":
        case "AD":
        case "US":
        case "TY":
        case "TU":
        case "MB":
        case "FV":
        case "ED":
        case "UB":
            months = rate_months;
            num_months = 1;
            break;
        case "CL":
        case "HO":
        case "NG":
        case "RB":
            months = allMonths;
            num_months = energy_amt;
            break;
        case "BB":
        case "DA":
        case "EX":
            months = allMonths;
            num_months = 1;
            break;
        default:
            console.error("unknown trading months for :" + symbol);
            break;
    }
    let tradingMonths = [];
    let cur = getFront(months, getCurContract());
    // for (let i = 0; i <= months.length; i++){
    //     tradingMonths.push(cur);
    //     cur = getNextContract(months, cur);
    // }
    for (let i = 0; i < num_months; i++) {
        tradingMonths.push(cur);
        cur = getNextContract(months, cur);
    }
    return tradingMonths;
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


    // Return an array to hold a map with all the data for various comdtys and their proper trading months
    function initStatus(roots) {
        //console.table(roots);
        const rootMap = new Map();
        for (let i = 0; i < roots.length; i++) {
            //console.log(roots[i]);
            rootMap.set(roots[i], getInitRootMap(roots[i]));
        }
        //console.log(rootMap.keys());
        //console.log(rootMap);
        if (rootMap.size !== roots.length) console.error("rootMap ERROR -- lengths uneven!");
        return rootMap;
    }

    // TODO: expannd to handle incoming web socket messages and then update the proper pieces of status
    // make sure the status data is updated in a manner that will trigger the children components to re-render
    React.useEffect(() => {
        WS.onmessage = (evt) => {
            //const curEvt = JSON.parse(evt.data.replace(/'/g, "\""));
            const curEvt = JSON.parse(evt.data);
            //console.log(typeof curEvt);
            
            // check if current comdty exists in outer map
            if (curEvt.type === "minute" && status.has(curEvt.root)) {
                //console.log("🥸");
                // check if current symbol/month exists in the current inner map
                if (status.get(curEvt.root).has(curEvt.symbol)) {
                    // update status with clone to properly trigger re-render
                    const clone = _.cloneDeep(status);
                    const newObj = {symbol: curEvt.symbol, open: curEvt.session_open, high: curEvt.session_high, 
                                    low: curEvt.session_low, px: curEvt.px_last, set: curEvt.px_settle};
                    //clone[root_i].set(curEvt.symbol, newObj);
                    console.log("👇 " + curEvt.symbol);
                    console.table(status.get(curEvt.root).get(curEvt.symbol))
                    console.table(newObj);
                    

                    clone.get(curEvt.root).set(curEvt.symbol, newObj);
                    setStatus(new Map(clone));

                    console.table(status.get(curEvt.root).get(curEvt.symbol))
                    console.log("🤌")
                }
            }
            
        }
    });

    let keys = [...status.keys()];

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

        

        <div className="row">
            <div>
                <div> GRAINS
                    <QuoteBlock status={status.get(keys[0])} />
                    <QuoteBlock status={status.get(keys[1])} />
                    <QuoteBlock status={status.get(keys[2])} />
                    <QuoteBlock status={status.get(keys[3])} />
                    <QuoteBlock status={status.get(keys[4])} />
                    <QuoteBlock status={status.get(keys[5])} />
                </div> MEATS
                <div className="row">
                    <div>
                        <QuoteBlock status={status.get(keys[6])} />
                        <QuoteBlock status={status.get(keys[7])} />
                    </div>
                        <QuoteBlock status={status.get(keys[8])} />
                    </div>
            </div>
            <div> ENERGIES
                <QuoteBlock status={status.get(keys[9])} />
                <QuoteBlock status={status.get(keys[10])} />
                <QuoteBlock status={status.get(keys[11])} />
                <QuoteBlock status={status.get(keys[12])} />

                <div className="row">
                    <div> METALS
                        <QuoteBlock status={status.get(keys[13])} />
                        <QuoteBlock status={status.get(keys[14])} />
                        <QuoteBlock status={status.get(keys[15])} />
                        <QuoteBlock status={status.get(keys[16])} />
                    </div>
                    <div> MISC...
                        
                    </div>
                </div>
            </div>
            
        </div>
    );
}

