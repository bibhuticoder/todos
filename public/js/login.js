 $(window).load(function(){
    
     $("#btnLogin").click(function(){
                 
         var username = $("#username").val();
         var password = $("#password").val();
         
               //give info to server
             $.ajax({

                 type: "POST",
                 url:"/validate",
                 data:{
                     
                     username:username,
                     password:password
                 }
             })
             .done(function(data){
                 
                if(data.type === "error"){
                    
                    alertMsg("danger", data.msg);
                    
                }
                    
                else if(data.type === "success"){
                    
                    var form = $('<form action="/enter" method="post" hidden="hidden">' + '<input type="text" name="username" value="' + username + '" />' + '<input type="text" name="password" value="' + password + '" />' +  '<input type="text" name="id" value="' + data.id + '" />'+'</form>');
                    
                    
                   $('body').append(form);
                   form.submit();
                    
                }
             
             });
         
         
         
         
         
         
     });
     
     $("#btnRegister").click(function(){
 
           //give info to server
         $.ajax({

             type: "POST",
             url:"/register",
             data:{

                 username:$("#Rusername").val(),
                 password:$("#Rpassword").val(),
                 repassword:$("#Rrepassword").val()
             }
         })
         .done(function(data){

            if(data.type === "error"){

                alertMsg("danger", data.msg);

            }

            else if(data.type === "success"){

                alertMsg("success", data.msg);
                
            }

         });

         
     });
          
     function alertMsg(type, msg){
         
         if(type === "success"){
             
             $("#alert").addClass("alert-success");
             $("#alert").removeClass("alert-danger");
             
         }
         
         else if(type === "danger"){
             
             $("#alert").addClass("alert-danger");
             $("#alert").removeClass("alert-success");
            
         }
         
         $("#alert").text(msg);
         $("#alert").fadeIn(2000);
         $("#alert").fadeOut(10000);
         
           
         
         
         
     }
     
     
 });