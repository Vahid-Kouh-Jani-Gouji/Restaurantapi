const express = require ('express');
var app = express();
const qs = require('qs')
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('asset'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


const resturant_list =[["nam1","adr1","menu1"],["nam2","adr2","menu2"]]
// const resturant = [{"name":"name1","adr":"adr1","menu":"menu1"},{"name":"name2","adr":"adr2","menu":"menu2"}];

console.log(resturant_list[0]);


app.get('/',(req,res)=>{
  
          res.render('pages/index', { resturant_list });
})

app.post('/put',(req,res)=>{
          
          var name= req.body.name ;
          var address = req.body.address ;
          var kategory= req.body.kategory ;
          const put_resturant = [];

          put_resturant.push(name); 
          put_resturant.push(address); 
          put_resturant.push(kategory); 
        for (var k=0 ; k<resturant_list.length ; k++){
          if (resturant_list[k].includes(put_resturant)) {
            
            res.status(400).send('Duplicate item');
          } 
        }
       
          resturant_list.push(put_resturant);
          res.redirect('/');
        
         
          
       
          
             
});

app.get('/delete',(req,res)=>{
         var name_delete = req.query.index ;
         resturant_list.splice(name_delete, 1);
      
//          for (var f=0 ; f<resturant_list.length ; f++ ) {
//           if (resturant_list[f][0]== name_delete) {
//                     delete resturant_list[f]

//           }
//          }
         res.redirect('/');
})

app.post('/edit',(req,res)=>{
          var index= req.body.indexmodal ;
          var name= req.body.name ;
          var address = req.body.address ;
          var kategory= req.body.kategory ;
          const edit_resturant = [];
          console.log(index);
          console.log(name);
          edit_resturant.push(name); 
          edit_resturant.push(address); 
          edit_resturant.push(kategory); 

          if (index >= 0 && index < resturant_list.length) {
            resturant_list[index] = edit_resturant;
          }

          // for (var j=0 ; j<resturant_list.length ; j++ ) {
          //           if (resturant_list[j][0]== name) {
          //                     delete resturant_list[j]
          
          //           }
          //          }
          
          

          // resturant_list.push(edit_resturant);
          
          res.redirect('/');
             
})


var server = app.listen(5000, function () {
          console.log('Node server is running..');
});