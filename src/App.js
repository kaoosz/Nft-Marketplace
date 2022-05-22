import './App.css';
import React, { Component} from 'react';
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import "../node_modules/web3/dist/web3.min.js";
import  Web3  from '../node_modules/web3/dist/web3.min.js';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import  Dropdown  from  "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Footer from './Footer';
import { Token,Market_ABI,Token_ABI,Market,openseaapi,provider,IMAGE_NFT
 } from './Variables';


var conta = null;
let accountsz = String(null);
const chain = 0x4;
var Price = null;

async function ConnectWallet(){
  if(window.ethereum){
    await provider.request({method: "eth_requestAccounts"})
    .then(result => {
      accountsz = result;
    })

    let contasz = await provider.request({method: "eth_accounts"});
    conta = contasz[0];

    conta = conta;
    ChainChanged();
    document.getElementById("wallet-address").textContent = conta;
  }else{
    console.log("NO METAMASK DETECTED");
    window.location.reload();
  }
}

async function Mint(){
  if(window.ethereum){
    let web3 = await new Web3(window.ethereum);
    var contract = await new web3.eth.Contract(Token_ABI,Token);
    
    if(conta != null){
      console.log("works");
      //HandleAccountsChanged(conta);

      var minte = await contract.methods.createTokens().send({from:conta});
      console.log(minte);

    }else{
      console.log(conta);
    }
  }
}

async function HandleAccountsChanged(){

  let web3 = await new Web3(window.ethereum);

  web3.eth.getAccounts()
  .then(_accounts => {
    conta = _accounts;
  });
  window.ethereum.on("accountsChanged", (conta) =>{
    alert("mudou conta");
    window.location.reload();
  });
}
async function ChainChanged(){
  let web3 = await new Web3(window.ethereum);
  window.ethereum.on("chainChanged", (chain) => {
    alert("Please Back Rinkiby Network !!");
    window.location.reload();
  });
}

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      balance: [],
      nftdata: [],
      valor : "",
      objects: [],
      sometest: null
    };
    if(!window.ethereum){
      console.log("NO METAMASK DETECTED");
      alert("NO METAMASK DETECTED");
    }
  }



  handleChange(event, id) {
    this.setState((state) => {
     const newObject = {...state.objects};

     newObject[`${id}`] = {value: event.target.value, key: id}
     console.log(((newObject[id].value)));
     return {objects:newObject, sometest:newObject[id].value}

    });

  }

  async componentDidMount(){
    await axios.get(
    (openseaapi + `?asset_contract_addresses=${Token}&format=json&order_direction=asc&offset=0&limit=30`))
    .then(outputb  => {
      const { assets } = outputb.data
      this.setState({
        nftdata:assets
      })
    })

    provider.request({method: "eth_requestAccounts"})
    .then(( response) =>{
      this.setState({
        valor:response
      })
    }).catch(err => console.error(err));
  }

  render(){
    const {nftdata} = this.state;
    const {objects} = this.state;
    const {sometest} = this.state;

    // <InputGroup key={index} onChange={e => this.setState({inpute: e.target.value})} className="mb-3">
      return(
        <div className='App'>
          <div className='container'>
            <div className='row'>
              <form className="gradient col-lg-5 mt-5" style={{borderRadius:"35px",boxShadow:"1px 1px 15px #000000"}}>
                <h4 style={{color:"#FFFFFF"}}> Mint Portal </h4>
                <h5 style={{color:"#darkgrey"}}>Please Connect Your Wallet </h5>
                <Button onClick={ConnectWallet} style={{marginBottom:"5px",color:"#FFFFFF"}}> Connect Wallet </Button>
                <div className='card' id="wallet-address" style={{marginTop:"3px",boxShadow:"1px 1px 4px #000000"}}>
                  <label htmlFor='floatingInput'>Wallet Address </label>
                  </div>
                  <div className="card" style={{marginTop:"3px",boxShadow:"1px 1px 4px #000000"}}>
                  <label >Click Below to Mint </label>
                  <Button onClick={Mint}> Mint! </Button>    
                </div>
                <label style={{color:"#FFFFFF"}}>Fees 5% To Sell or Cancel Selling .</label>
              </form>
              <div className='row items mt-3' >
              <div className='ml-3 mr-3' style={{display: "inline-grid",gridTemplateColumns: "repeat(4, 5fr)",columnGap: "10px"}}>
              {nftdata.map((assets, index) => {
                index += 1;
                
                async function getItem(){
                  if(window.ethereum){
                    let web3 = await new Web3(window.ethereum);
                    var contract = await new web3.eth.Contract(Market_ABI,Market);               
                    if(conta != null){
                      var guarda = await contract.methods.getMarketItem(Number(index)).call();
                      var xx = guarda._price;
                      Price = xx;
                      console.log(guarda._price);
                      console.log(typeof(guarda._price));
                      alert("Price: " + guarda._price);                     
                    }
                  }
                
                }
                async function Buy(){
                  if(window.ethereum){
                    let web3 = await new Web3(window.ethereum);
                    var contract = await new web3.eth.Contract(Market_ABI,Market);                              
                    if(conta != null){
                      await getItem();
                      var guarda = await contract.methods.BuyToken(Token,Number(assets.token_id)).send({from:conta,value:Price});
                      console.log("MarketItem: "+ guarda);
                      console.log(guarda);
                      Price = 0;
                      console.log(Price);
                    }
                  }               
                }
                async function Sell(){
                  if(window.ethereum){
                    let web3 = await new Web3(window.ethereum);
                    var contract = await new web3.eth.Contract(Market_ABI,Market);
                               
                    if(conta != null){
                      alert("Fees are 5% of the price..");
                      alert("Use Decimals Ex 10053 in Wei DONT USE 0.05");
                      // 1000000000000000000 1 ether 153875964320000000
                      var guarda = await contract.methods.TokenSell(Token,Number(assets.token_id),web3.utils.toWei(sometest, 'ether')).send({from:conta});
                      console.log(guarda);
                    }
                  }
                }
                async function Cancel(){
                  if(window.ethereum){
                    let web3 = await new Web3(window.ethereum);
                    var contract = await new web3.eth.Contract(Market_ABI,Market);
                               
                    if(conta != null){  
                      alert("Need Send 5% of the Price Fees"); 
                      await getItem();
                      console.log("inpute");

                      var res = (Price * 5) / 100;
                      var varSTR = String(res);
                      // 0x3f000000
                      var guarda = await contract.methods.SendBack(Token,Number(assets.token_id)).send({from: conta,value:web3.utils.toWei(varSTR, 'wei')});
                      alert("Item Canceled")
                    }
                  }
                }
                  return(
                    <div className='card' key={index}>
                      <div className='image-over'>
                        <img className='card-img-top' src={IMAGE_NFT + assets.token_id + '.png'} alt=""/>
                        <div className='card-caption col-12 p-0'>
                          <div className='card-body'>
                            <h5 className='mb-0'> NFT ID: {assets.token_id} </h5>
                            <h5>Owner Wallet: <p style={{color: "#000000",fontWeight:"unset",textShadow: "1px 1px 2px #000000"}}></p>{assets.owner.address}</h5>
                            <div className="card-bottom d-flex justify-content-between">
                              <InputGroup  value={this.state.objects[`${assets.id}`]?.value || ''}onChange={(event) => this.handleChange(event, assets.id)} className="mb-3">
                                <DropdownButton
                                  variant="outline-secondary"
                                  title="Click Me"
                                  id="input-group-dropdown-1"
                                >
                                  <Dropdown.Item onClick={Sell}>Sell</Dropdown.Item>
                                  <Dropdown.Item onClick={Cancel}>Cancel</Dropdown.Item>
                                  <Dropdown.Item onClick={Buy}>Buy</Dropdown.Item>
                                  <Dropdown.Item onClick={getItem}>Price</Dropdown.Item>
                                </DropdownButton>
                                <FormControl aria-label="Text input with dropdown button" />
                              </InputGroup>
                            </div>
                          </div>
                        </div>
                      </div>                   
                    </div>
                  )
              }
              )
              }
              </div>
              </div>
            </div>

          </div>
          <Footer />
        </div>
      )
  };

}

export default App;
