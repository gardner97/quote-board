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
                                    "FC", "LE", "HE",
                                    "CL", "NG", "RB", "HO",
                                    "GC", "SI", "HG", "PL"]} />
              </div>
          </div>
        </header>
      </div>
    );
  }
  
}

export default App;
