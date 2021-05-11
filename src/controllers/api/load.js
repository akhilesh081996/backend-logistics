var Loads =  require('../../models/load');
var jwt = require('jsonwebtoken');
var uniqid = require('uniqid');
var decode;
var tokenverified = false 
var jwterr;

function  tokenVarification(token){
    decode = jwt.decode(token, {complete: true});
   //console.log(decode);
    jwt.verify(token ,'secret',function(err, decoded) {
    if(err){
    //    console.log('======err====>',err)
        jwterr  =  err.message
    }else{
      //  console.log('======decoded2====>',decoded)
        tokenverified = true
    }
   })
   
  }




exports.add_load =   function (req, h) {
  var User_id = uniqid();
  tokenVarification(req.payload.token);
   if(tokenverified == true){
     var load = new Loads({
       load_id:User_id,
       load_type:req.payload.load_type,  
     });
     return Loads.create(load).then((loads) => {
       if(loads){
         return {
           status :true,
           message: "load added successfully",
           load: loads 
          }
       } 
       if(!loads){
         return{
            status :false,
            message: " load not added. plese try again !!!!",
         }
       }
    }).catch((err) => {
     console.log(err)
      return { err: err };
    })
   }else{
     return {
       message:jwterr
     }
   }
 }



exports.getloadlist =   function (req, h) {
    tokenVarification(req.payload.token);
     if(tokenverified == true){
     return Loads.find({}).exec().then((loadlist) => {
         if(loadlist){
           return {
             status :true,
             message: "load list fatched",
             loadlist: loadlist 
            }
         } 
         if(!loadlist){
           return{
              status :false,
              message: "loadlist not fatched. please try again !!!!",
           }
         }
      }).catch((err) => {
       console.log(err)
        return { err: err };
      })
     }else{
       return {
         message:jwterr
       }
     }
   }

   exports.deleteload =   function (req, h) {
    tokenVarification(req.payload.token);
     if(tokenverified == true){
     return Loads.findOneAndRemove({_id:req.payload._id}).exec().then((deleted_lode) => {
         if(deleted_lode){
           return {
             status :true,
             message: "load deleted succesfully",
            }
         } 
         if(!deleted_lode){
           return{
              status :false,
              message: "load not deletes. please try again !!!!",
           }
         }
      }).catch((err) => {
       console.log(err)
        return { err: err };
      })
     }else{
       return {
         message:jwterr
       }
     }
   }
 
   