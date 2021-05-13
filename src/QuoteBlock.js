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

    const curMonthAr = months;
    const m0 = getFront(curMonthAr, getCurContract());
    const m1 = getFront(curMonthAr, getNextContract(curMonthAr, m0));
    const m2 = getFront(curMonthAr, getNextContract(curMonthAr, m1));
    const m3 = getFront(curMonthAr, getNextContract(curMonthAr, m2));
    const m4 = getFront(curMonthAr, getNextContract(curMonthAr, m3));

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


    return (
        <div className="row">
            <Quote symbol={String(props.root + m0)} ws={WS} />
            <Quote symbol={String(props.root + m1)} ws={WS} />
            <Quote symbol={String(props.root + m2)} ws={WS} />
            <Quote symbol={String(props.root + m3)} ws={WS} />
            <Quote symbol={String(props.root + m4)} ws={WS} />
        </div>
    )
}   