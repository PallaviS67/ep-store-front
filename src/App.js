/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
import React , {useState, useEffect} from 'react';
import { gateway as MoltinGateway } from '@moltin/sdk'
import './App.css';

function App() {
  const Moltin = MoltinGateway({
    client_id: 'CCIXkTMHau4bLcp52bcnyL5nfDISb2zXLtQH8QoshV',
    client_secret:'9RyhwveDv9W2eAAfIBFTPC92Oc4I3J0AA1ZubbjCBz'
  })

    var total_length;
    var watches=[];
    var img_hrefs= [];
    const  [final_list , setfinallist] = useState([]);
   useEffect(()=>{
    const apiUrl = 'http://localhost:5000/';
    fetch(apiUrl)
    .then((response) => response.json())
    .then(data => {
     
      set_values(data)
    })
     
    
  
   },[]);
 
 function set_values(data){
   total_length=data.length;
   
    for (var i=0; i<data.length; i++){
    watches[i]=data[i];
    let product_id=watches[i].id;
    const fileId =  data[i].image
    //console.log(fileId);
    Moltin.Files.Get(fileId).then(file => {
     set_img_hrefs(file,product_id);
    })
   }
  }
   
function set_img_hrefs(file1,product_id){
  //console.log(file1);
  let item={"id":product_id,
             "href":file1.data.link.href}
  img_hrefs.unshift(item);
  //console.log(img_hrefs)
  if(img_hrefs.length==total_length){
    
    set_display_list(watches,img_hrefs);
  }
}
function set_display_list(watches,img_hrefs) {
  let final_array=[]
  console.log(watches);
  console.log(img_hrefs);
  for(var i=0; i<watches.length;i++){
    for(var j=0;j<img_hrefs.length;j++){
    if(watches[i].id==img_hrefs[j].id){
   let display_item ={"id":watches[i].id,
                      "name":watches[i].name,
                   "time":watches[i].time,
                   "file_id":watches[i].image,
                  "img_add":img_hrefs[j].href ,
                   "price": watches[i].price,
                  "stock": watches[i].stock}
                  final_array.unshift(display_item);
                  break;
  }
}
}
console.log(final_array);
  setfinallist(final_array);
  



 
} 
console.log(final_list);
 

  return (
    
    <ul id="horizontal-list">
      {final_list.map(function(d, idx){
         return (<li key={idx}>
           <div id="list_items">
          
           <img src={d.img_add} alt="pooo" width="200" height="200"></img>
           <p>{d.name}</p>
           <p>{d.price}/-</p>
           <p>{d.stock}</p>
          
           </div></li>)
       })}
      </ul>
    );
     
  };
 
export default App;

/* <ul>
      {watch_array.map((value, index) => {
        return <li key={index}>{value}</li>
      })}
    </ul>
    
    <div><h6>{watches[i].name}</h6>
      <img src={img_hrefs[i]} alt="pppp" width="200" height="200"></img>*/