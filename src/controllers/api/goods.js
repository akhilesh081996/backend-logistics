var Goods =  require('../../models/goods');
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




exports.add_goodstype =   function (req, h) {
  var User_id = uniqid();
  tokenVarification(req.payload.token);
   if(tokenverified == true){
     var goods = new Goods({
       goods_id:User_id,
       goods_type:req.payload.goods_type,  
     });
     return Goods.create(goods).then((goodses) => {
       if(goodses){
         return {
           status :true,
           message: "1 goods-type added successfully",
           goods_type: goodses 
          }
       } 
       if(!goodses){
         return{
            status :false,
            message: " goods-type not added. plese try again !!!!",
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



exports.getGoodsTypeList =   function (req, h) {
    tokenVarification(req.payload.token);
     if(tokenverified == true){
     return Goods.find({}).exec().then((GoodsTypelist) => {
         if(GoodsTypelist){
           return {
             status :true,
             message: "goods-type list fatched",
             goods_type_list: GoodsTypelist 
            }
         } 
         if(!GoodsTypelist){
           return{
              status :false,
              message: "goods-types not fatched. please try again !!!!",
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

   exports.deleteGoodsType =   function (req, h) {
    tokenVarification(req.payload.token);
     if(tokenverified == true){
     return Goods.findOneAndRemove({_id:req.payload._id}).exec().then((delete_goods) => {
         if(delete_goods){
           return {
             status :true,
             message: " 1 goods-type deleted succesfully",
            }
         } 
         if(!delete_goods){
           return{
              status :false,
              message: "goods-type not deleted. please try again !!!!",
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
 
   