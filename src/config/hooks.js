// Hooks

let self = module.exports = {
	customHooks: (req, h) => {
		if(req.params){
			let hook = req.params.name
			if(hook){
			   if(hook == "add_agency"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "update_agency"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_agency"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_role"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "update_role"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_role"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_user"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "update_user"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_user"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "save_attendance"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "update_attendance"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_attendance"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_customer"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "update_customer"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_customer"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_vehicle"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "update_vehicle"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook..'}
			   }
			   else if(hook == "delete_vehicle"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_service"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "update_service"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_service"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_order_item"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "update_row"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_order_item"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_order"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "update_order"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_order"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_orderstage"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "edit_orderstage"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_orderstage"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_fields"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "edit_field"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "delete_field"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "add_module"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "assign_module"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "edit_module"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
		       else if(hook == "delete_module"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "login"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "register"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "forgot_password"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else if(hook == "reset_password"){
				   return {'status':100, 'msg':'Success from '+ hook+' hook.'}
			   }
			   else{
				   return {'status':101, 'msg':'Could not find any hook of this operation.'}
			   }
			}else{
				return {'status':101, 'msg':'Please send the hook name.'}
			}
		}
	}
}