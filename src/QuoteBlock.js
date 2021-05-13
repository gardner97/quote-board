import React from 'react';
import Quote from './Quote';

//    (indices): 0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10, 11
const months = ["F","G","H","J","K","M","N","Q","U","V","X","Z"];
//              Jan,Feb,Mar,Apr,May,Jun,Jly,Aug,Sep,Oct,Nov,Dec

// corn, wheat, oats
const cwo_months = ["H","K","N","U","Z"];
// soybeans
const sb_months = ["F","H","K","N","Q","U","X"];


const D = new Date();
const WS = new WebSocket('ws://localhost:8080');


// each comdty has its own QuoteBlock consisting of multiple quotes (months)
export default function QuoteBlock(props) {


    // constructor(props) {
    //     super(props);
        
    //     // Each comdy has its own QuoteBlock; specify its current front month
    //     this.state = {
    //         root: props.root
    //     };
    // }
    const [state, setState] = React.useState({
        m0: {high: "?", open: "?", low: "?", last: "?"},
        m1: {high: "?", open: "?", low: "?", last: "?"},
        m2: {high: "?", open: "?", low: "?", last: "?"},
        m3: {high: "?", open: "?", low: "?", last: "?"},
        m4: {high: "?", open: "?", low: "?", last: "?"}
    });



    let curMonthAr;
    // determine proper trading months for given comdty
    switch (props.root) {
        case "ZC":
        case "ZW":
        case "ZO":
            curMonthAr = cwo_months;
            break;
        case "ZS":
        case "ZM":
        case "ZL":
            curMonthAr = sb_months;
            break;
        case "CL":
        case "HO":
        case "GC":
            curMonthAr = months;
            break;
        default:
            console.error("unknown trading months for :" + props.root);
            break;
    }

    const m0 = getFront(curMonthAr, getCurContract());
    const m1 = getFront(curMonthAr, getNextContract(curMonthAr, m0));
    const m2 = getFront(curMonthAr, getNextContract(curMonthAr, m1));
    const m3 = getFront(curMonthAr, getNextContract(curMonthAr, m2));
    const m4 = getFront(curMonthAr, getNextContract(curMonthAr, m3));

    const mAr = [m0, m1, m2, m3, m4];

    // TODO:
    // create a function to instantiate an array of quotes for cur comdty
    // (set it up to start at front month and properly contain the following months)


    // get month letter with year number (ex: May 2021 -> K1)
    function getCurContract() {
        return (months[D.getMonth()] + getCurYear());
    }

    function getCurYear() {
        return String(D.getFullYear()).substr(-1);
    }


    // get the current array index for the cur comdty's trading months ar
    function getCurMonthIndex(curMonthAr) {
        return (curMonthAr.indexOf(months[D.getMonth()]));
    }


    // get the next available contract month for the current comdty
    function getNextContract(curAr, curDate) {
        //console.log(curI);
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
                if (months.indexOf[m] === months.length - 1) { // wrap to next year
                    m = months[0];
                    y++;
                    if (y > curDate(1) + 1) console.error("couldnt find front month!");
                } else {
                    m = months[months.indexOf(m) + 1];
                }
            }
            return (m + y);
        }
    }


    // let map = new Map();
    // const defaultObj = {open: "?", high: "?", low: '?', last: "?"};
    // // init map with [key:month, val:{o:?,h:?,l:?,px:?}]
    // for (let i = 0; i < mAr.length; i++) map.set(mAr[i], defaultObj);

    React.useEffect(() => {
        WS.onmessage = (evt) => {
            // console.log("new event: " + Date().split(" ")[4]);
            // console.log(evt.data);
            let curEvt = JSON.parse(evt.data.replace(/'/g, "\""));
            // console.table(curEvt);
            const m = (curEvt.symbol).substr(-2);
            // if (curEvt.root === props.root && mAr.includes(m)) {
            //     console.log(m);
            //     console.log(map.get(m));
            //     map.set(m, {
            //         open: curEvt.px_open,
            //         high: curEvt.px_high,
            //         low: curEvt.px_low,
            //         last: curEvt.px_last
            //     });
            //     console.log(map.get(m));
            // }
            if (curEvt.root === props.root && mAr.includes(m)) {
                switch (m) {
                    case (m0):
                        setState({
                            m0: {high: curEvt.px_high,
                                open: curEvt.px_open,
                                low:  curEvt.px_low,
                                last: curEvt.px_last},
                            m1: state.m1,
                            m2: state.m2,
                            m3: state.m3,
                            m4: state.m4
                        });
                        break;
                    case (m1):
                        setState({
                            m0: state.m0,
                            m1: {high: curEvt.px_high,
                                open: curEvt.px_open,
                                low:  curEvt.px_low,
                                last: curEvt.px_last},
                            m2: state.m2,
                            m3: state.m3,
                            m4: state.m4
                        });
                        break;
                    case (m2):
                        setState({
                            m0: state.m0,
                            m1: state.m1,
                            m2: {high: curEvt.px_high,
                                open: curEvt.px_open,
                                low:  curEvt.px_low,
                                last: curEvt.px_last},
                            m3: state.m3,
                            m4: state.m4
                        });
                        break;
                    case (m3):
                        setState({
                            m0: state.m0,
                            m1: state.m1,
                            m2: state.m2,
                            m3: {high: curEvt.px_high,
                                open: curEvt.px_open,
                                low:  curEvt.px_low,
                                last: curEvt.px_last},
                            m4: state.m4
                        });
                        break;
                    case (m4):
                        setState({
                            m0: state.m0,
                            m1: state.m1,
                            m2: state.m2,
                            m3: state.m3,
                            m4: {high: curEvt.px_high,
                                open: curEvt.px_open,
                                low:  curEvt.px_low,
                                last: curEvt.px_last}
                        });
                        break;
                    default:
                        console.error("couldnt find!")
                        break;
                }
            }
        }
    })

    console.log("QUOTEBLOCK RENDER")
    return (
        <div className="row" >
            <Quote symbol={String(props.root + m0)} open={state.m0.open} high={state.m0.high} low={state.m0.low} last={state.m0.last} delta={state.m0.last - state.m0.open}/>
            <Quote symbol={String(props.root + m1)} open={state.m1.open} high={state.m1.high} low={state.m1.low} last={state.m1.last} delta={state.m1.last - state.m1.open}/>
            <Quote symbol={String(props.root + m2)} open={state.m2.open} high={state.m2.high} low={state.m2.low} last={state.m2.last} delta={state.m2.last - state.m2.open}/>
            <Quote symbol={String(props.root + m3)} open={state.m3.open} high={state.m3.high} low={state.m3.low} last={state.m3.last}  delta={state.m3.last - state.m3.open}/>
            <Quote symbol={String(props.root + m4)} open={state.m4.open} high={state.m4.high} low={state.m4.low} last={state.m4.last} delta={state.m4.last - state.m4.open}/>
        </div>
    )
}   
