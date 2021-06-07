import './App.css';
import QuoteBoard from './QuoteBoard';
//import Quote from './Quote';
//import QuoteBlock from './QuoteBlock';
import React from 'react';


// var ws = new WebSocket('ws://localhost:8080');

// ws.onopen = () => {
//     console.log("CONNECTED");
// };




class App extends React.Component {

  
  // updateComp = (evt) => {
  //   this.quoteElement.current.updatePrices(evt);
  // };

  componentDidMount() {
    // ws.onmessage = (evt) => {
    //   console.log("new event: " + Date().split(" ")[4])
    //   console.log(evt.data)
    //   let curEvt = JSON.parse(evt.data.replace(/'/g, "\""))
    //   console.table(curEvt)
  
      
    // }
  }

  
  render() {

    return (
      <div className="App">
        <header>
          <div>
              <div>
                <QuoteBoard roots={["ZS", "ZM", "ZL", "ZC", "ZW", "ZO", 
                                    "GF", "LE", "HE", "LBS",
                                    "CL", "NG", "RB", "HO",
                                    "GC", "SI", "HG", "PL",
                                    "DX", "6E", "6J", "RMB", "6B", "6C", "6A", "6L", "6M",
                                    "ZT", "Z3N", "ZF", "ZN", "TN", "ZB",
                                    "ES", "YM", "NQ", "RTY",
                                    "BTC", "ETH"
                                  ]} />
              </div>
          </div>
        </header>
      </div>
    );
  }
  
}

export default App;
