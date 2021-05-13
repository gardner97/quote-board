
const curMonthAr = ["H","K","N","U","Z"];
const months = ["F","G","H","J","K","M","N","Q","U","V","X","Z"];

const d = new Date();

// get month letter with year number (ex: May 2021 -> K1)
function getCurContract(d) {
    return (months[d.getMonth()] + String(d.getFullYear()).substr(-1));
}

function getCurMonth(d) {
    return months[d.getMonth()];
}

function getCurYear(d) {
    return String(d.getFullYear()).substr(-1);
}

function getNextContract(curAr, curDate) {
    //console.log(curI);
    const curM = curDate.charAt(0);
    const curY = parseInt(curDate.charAt(1));
    return (curAr.indexOf(curM) === curAr.length - 1 ? 
        (curAr[0] + (curY+1)) : (curAr[curAr.indexOf(curM) + 1] + curY));
}

// get the front month for a comdty by checking the closest month in its array
// function getNextContract(comdtyAr, curMonth, curYear) {
//     console.log(`cur: ${curMonth}`)
//     let year = curYear
//     if (comdtyAr.includes(curMonth)) {
//         return (curMonth + year);
//     } else { // search for next closest month in comdtyAr
//         let curMonthIndex = months.indexOf(curMonth);
//         while (!comdtyAr.includes(months[curMonthIndex])) {
//             curMonthIndex++;
//             if (curMonthIndex === months.length) {
//                 curMonthIndex = 0;
//                 year++;
//             }
//             if (year > curYear + 2) {
//                 console.error("something wrong with getNextMonth");
//                 break;
//             }
//         }
//         return (months[curMonthIndex] + year);
//     }
// }

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

let m0 = getFront(curMonthAr, "M1");
let m1 = getFront(curMonthAr, getNextContract(curMonthAr, m0));
let m2 = getFront(curMonthAr, getNextContract(curMonthAr, m1));
let m3 = getFront(curMonthAr, getNextContract(curMonthAr, m2));
let m4 = getFront(curMonthAr, getNextContract(curMonthAr, m3));

console.log(m0);
console.log(m1);
console.log(m2);
console.log(m3);
console.log(m4);