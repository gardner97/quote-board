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
        m0_high: "?",
        m0_open: "?",
        m0_low: "?",
        m0_last: "?",
        m1_high: "?",
        m1_open: "?",
        m1_low: "?",
        m1_last: "?",
        m2_high: "?",
        m2_open: "?",
        m2_low: "?",
        m2_last: "?",
        m3_high: "?",
        m3_open: "?",
        m3_low: "?",
        m3_last: "?",
        m4_high: "?",
        m4_open: "?",
        m4_low: "?",
        m4_last: "?"
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
                            m0_high: curEvt.px_high,
                            m0_open: curEvt.px_open,
                            m0_low: curEvt.px_low,
                            m0_last: curEvt.px_last
                        });
                        break;
                    case (m1):
                        setState({
                            m1_high: curEvt.px_high,
                            m1_open: curEvt.px_open,
                            m1_low: curEvt.px_low,
                            m1_last: curEvt.px_last
                        });
                        break;
                    case (m2):
                        setState({
                            m2_high: curEvt.px_high,
                            m2_open: curEvt.px_open,
                            m2_low: curEvt.px_low,
                            m2_last: curEvt.px_last
                        });
                        break;
                    case (m3):
                        setState({
                            m3_high: curEvt.px_high,
                            m3_open: curEvt.px_open,
                            m3_low: curEvt.px_low,
                            m3_last: curEvt.px_last
                        });
                        break;
                    case (m4):
                        setState({
                            m4_high: curEvt.px_high,
                            m4_open: curEvt.px_open,
                            m4_low: curEvt.px_low,
                            m4_last: curEvt.px_last
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
            <Quote symbol={String(props.root + m0)} open={state.m0_open} high={state.m0_high} low={state.m0_low} last={state.m0_last} delta={state.m0_last - state.m0_open}/>
            <Quote symbol={String(props.root + m1)} open={state.m1_open} high={state.m1_high} low={state.m1_low} last={state.m1_last} delta={state.m1_last - state.m1_open}/>
            <Quote symbol={String(props.root + m2)} open={state.m2_open} high={state.m2_high} low={state.m2_low} last={state.m2_last} delta={state.m2_last - state.m2_open}/>
            <Quote symbol={String(props.root + m3)} open={state.m3_open} high={state.m3high} low={state.m3_low} last={state.m3_last}  delta={state.m3_last - state.m3_open}/>
            <Quote symbol={String(props.root + m4)} open={state.m4_open} high={state.m4_high} low={state.m4_low} last={state.m4_last} delta={state.m4_last - state.m4_open}/>
        </div>
    )
}   
