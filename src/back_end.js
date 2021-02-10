var express = require('express');
var app = express();
var cors = require('cors')

let total_length;
let products_array=[];
let inventory_stock=[];
let final_array=[];
const { MoltinClient } = require('@moltin/request')
// import { MoltinClient } from '@moltin/request'

const client = new MoltinClient({
    client_id: 'CCIXkTMHau4bLcp52bcnyL5nfDISb2zXLtQH8QoshV',
    client_secret: '9RyhwveDv9W2eAAfIBFTPC92Oc4I3J0AA1ZubbjCBz'
})

client

  .get('products')
  .then(products =>{
    call_inventory(products);
})
  .catch(console.error)
 
  
  function  call_inventory(products){
    products_array=products;
    console.log(products);
    total_length=products.data.length;
    console.log(total_length);
    
    for (var i=0 ; i< total_length; i++){
      var productId = products.data[i].id
      client
      .get(`inventories/${productId}`)
      .then(inventory => {
       create_inventory(inventory);
  })
  .catch(console.error)
    }  }


  function create_inventory(inventory){
    inventory_stock.push(inventory.data.available);
    if(inventory_stock.length == total_length){
      console.log(inventory_stock)
      create_final_array(products_array,inventory_stock)
    }
  }


  function create_final_array(products_array,inventory_stock){
    for( var i=0; i< total_length;i++){
      let result = {
        "id":products_array.data[i].id,
           "name":products_array.data[i].name,
            "time":products_array.data[i].meta.timestamps.updated_at,
            "image" : products_array.data[i].relationships.main_image.data.id,
           //"file_id": products_array.data[i].relationships.main_image.data.id
            "price": products_array.data[i].price[0].amount,
            "stock":inventory_stock[i]
    
          }
          
          final_array.unshift(result);
    }
    let sortedproductlist = final_array.sort((c1, c2) => (c1.updated_at > c2.updated_at) ? 1 : (c1.updated_at < c2.updated_at) ? -1 : 0);
//console.log(sortedproductlist);
    app.get('/', cors(), function (req, res) {
      res.send(sortedproductlist);
    });
 
  var server = app.listen(5000, function () {
      console.log('Node server is running..');

});
  }
