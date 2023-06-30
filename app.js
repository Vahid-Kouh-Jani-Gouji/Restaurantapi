// const express = require ('express');
import AWS from 'aws-sdk'
import express, { query } from 'express'
var app = express();
import dotenv from 'dotenv' ;
import {db, Table} from './db.config.js'

// const qs = require('qs')
import qs from 'qs' ;
// var bodyParser = require('body-parser')
import bodyParser from 'body-parser'
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('asset'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


const dynamodb = new AWS.DynamoDB();

dotenv.config();
const resturant_list =[["nam1","adr1","menu1"],["nam2","adr2","menu2"]]
// const resturant = [{"name":"name1","adr":"adr1","menu":"menu1"},{"name":"name2","adr":"adr2","menu":"menu2"}];

console.log(resturant_list[0]);


app.get('/',async(req,res)=>{
  let restaurant_items ;
  
  try{
    const results = await dynamodb.scan({TableName:"restaurant"}).promise();
    restaurant_items= results.Items
    console.log(restaurant_items)
  } catch(error){
    console.log(error)

  }
  restaurant_items.forEach(function(item) {
    // Access the properties and their values within each item
    var address = item.address.S;
    var id = item.id.S;
    var name = item.name.S;
  
    // Do something with the values
    console.log('Address:', address);
    console.log('ID:', id);
    console.log('Name:', name);
  });

 
  
        // show memory databank in HTML
          res.render('pages/index', { restaurant_items });
})

app.post('/put',async(req,res)=>{

  
          
          var name= req.body.name ;
          var address = req.body.address ;
          var id= req.body.id ;
          // const put_resturant = [];

          // put_resturant.push(name); 
          // put_resturant.push(address); 
          // put_resturant.push(kategory); 

          //DynamoDB

           
          // Create DynamoDB item
          const params = {
            TableName: 'restaurant',
            Item: {
              'id': { S: id },
              'address': { S: address },
              'name': { S: name }
            }
          };
        
          // Store the item in DynamoDB
          dynamodb.putItem(params, (err, data) => {
            if (err) {
              console.log('Error:', err);
              res.status(500).json('Error storing data in DynamoDB.');
            } else {
              console.log('Data stored successfully:', data);
              res.send('Data stored successfully.');
            }
          });

          // compare with memory database
        // for (var k=0 ; k<resturant_list.length ; k++){
        //   if (resturant_list[k][0].includes(put_resturant[0])) {
            
        //     res.status(400).send('Duplicate item');
        //   }
                            
        // }
        
       
          // resturant_list.push(put_resturant);
          // res.redirect('/');
});


app.post('/update',async(req,res)=>{
  
  var name= req.body.name ;
  var address = req.body.address ;
  // var id= req.body.id ;
  const id = req.body.id ;
  console.log(name);
  console.log(address);
  console.log(id);

  const dynamodb = new AWS.DynamoDB();

  await dynamodb
    .updateItem({
      TableName: 'restaurant',
      Key: { id: { S: id } },
      UpdateExpression: 'set #attrName = :newName, #attrAddress = :newAddress',
      ExpressionAttributeNames: {
      '#attrName': 'name',
      '#attrAddress': 'address'
      },
      ExpressionAttributeValues: {
      ':newName': { S: name },
      ':newAddress': { S: address }
      },
      // UpdateExpression: 'set address = :address , name = :name ',
      // ExpressionAttributeValues: { ':address': { S: address } , ':name': { S: name } },
      ReturnValues: 'ALL_NEW'
    })
    .promise();

     res.redirect('/')


});

app.post('/delete' , async(req,res)=>{
  const id = req.body.id ;

  await dynamodb.deleteItem({
    TableName: 'restaurant',
      Key: { id: { S: id } },

  })
  .promise();

  res.redirect('/')

})

// app.get('/delete',(req,res)=>{
//          var name_delete = req.query.index ;
//          resturant_list.splice(name_delete, 1);
      
//          for (var f=0 ; f<resturant_list.length ; f++ ) {
//           if (resturant_list[f][0]== name_delete) {
//                     delete resturant_list[f]

//           }
//          }
//          res.redirect('/');
// })

// app.post('/edit',(req,res)=>{
//           var index= req.body.indexmodal ;
//           var name= req.body.name ;
//           var address = req.body.address ;
//           var kategory= req.body.kategory ;
//           const edit_resturant = [];
//           console.log(index);
//           console.log(name);
//           edit_resturant.push(name); 
//           edit_resturant.push(address); 
//           edit_resturant.push(kategory); 

//           if (index >= 0 && index < resturant_list.length) {
//             resturant_list[index] = edit_resturant;
//           }

          // for (var j=0 ; j<resturant_list.length ; j++ ) {
          //           if (resturant_list[j][0]== name) {
          //                     delete resturant_list[j]
          
          //           }
          //          }
          
          

          // resturant_list.push(edit_resturant);
          
//           res.redirect('/');
             
// })


var server = app.listen(5000, function () {
          console.log('Node server is running..');
});