 $(window).load(function(){
     
     var tasks = [];   
        
     $("#btnAdd").click(function(){

        var taskName = $("#taskName").val();        
        
        if(taskName != ""){
            
            var taskDesc = $("#taskDesc").val();        
            var taskDate = getCurrentDate();
                        
            tasks.push({name:taskName, desc:taskDesc, dateAdded:taskDate, status:"unchecked"});
            
            //add to the database
             $.ajax({

                 type: "POST",
                 url:"/todoAction",
                 data:{
                     action:'add',
                     id:$("#id").text(),
                     name:$("#taskName").val(), 
                     desc:$("#taskDesc").val(),
                     dateAdded:getCurrentDate(), 
                     status:"unchecked"
                 }
             })
             .done(function(data){
               
                 loadData();  
                 setEventHandlers();            
                 clearInputFields();
             });

            
             
        }
      
        
    });
     
     $("#btnUpdate").click(function(){
        
         var index = parseInt($("#taskIndex").text());
         tasks[index] = {name:$("#taskName").val(), desc:$("#taskDesc").val(), dateAdded:getCurrentDate(), status:$("#taskStatus").text()};
         
         //update the database
         $.ajax({
            
             type: "POST",
             url:"/todoAction",
             data:{
                 action:'update',                 
                 id:$("#id").text(),
                 index:index,
                 name:$("#taskName").val(),                     
                 desc:$("#taskDesc").val(),
                 dateAdded:getCurrentDate(),
                 status:$("#taskStatus").text()
                 
             }
         });
        
     });
     
     $("#btnAddNew").click(function(){
           
         changeModalRole("NewTask");
         clearInputFields();
         
     });
     
     function loadData(){
        
        $("#taskGroup").html("");
        
        for(var l in tasks){
            
            $("#taskGroup").html($("#taskGroup").html()+"<div class='taskContainer' data-status='"+ tasks[l].status + "' data-index='"+l+"'><div class='checkBox "+ tasks[l].status +"'></div><label class='taskName' data-toggle='modal' data-target='#fadeWindow'>"+tasks[l].name+"</label><span class='glyphicon glyphicon-trash remove' title='Remove'></span></div>");
            
            
                    
        }
        
        $("#currentDate").text("  " + getCurrentDate());
               
    }
        
     function setEventHandlers(){
             
         $(".checkBox").click(function(){

                var parentDiv = $(this).parent();
                var respectiveTask = parentDiv.children()[1];
                var respectiveCheckbox = parentDiv.children()[0];
                var status = $(parentDiv).attr("data-status");
                var index = $(parentDiv).attr("data-index");
                $(respectiveTask).css("text-decoration", "line-through");

                if(status === "unchecked"){

                    $(respectiveTask).css("text-decoration", "line-through"); // strikethrough
                    parentDiv.attr("data-status", "checked"); //checked attr
                    $(respectiveCheckbox).removeClass("unchecked"); // remove class
                    $(respectiveCheckbox).addClass("checked"); // add class
                    tasks[index].status="checked";
                    
                    //check in the database
                     $.ajax({

                         type: "POST",
                         url:"/todoAction",
                         data:{
                             action:'check',                             
                             id:$("#id").text(),
                             index:index,
                             name:tasks[index].name, 
                             desc:tasks[index].desc                   
                              
                         }
                     });

                }

                else if(status === "checked"){

                    $(respectiveTask).css("text-decoration", "none");
                    parentDiv.attr("data-status", "unchecked");
                    $(respectiveCheckbox).attr("src", "images/unchecked.png");
                    $(respectiveCheckbox).removeClass("checked");
                    $(respectiveCheckbox).addClass("unchecked");
                    tasks[index].status="unchecked";
                    
                    //uncheck in the database
                     $.ajax({

                         type: "POST",
                         url:"/todoAction",
                         data:{
                             action:'uncheck',
                             index:index,
                             id:$("#id").text(),
                             index:$(parentDiv).attr("data-index")                   
                                 
                         }
                     });
                    
                }

        });

         $(".taskName").click(function(){

                changeModalRole("Description");
                var index = $($(this).parent()).attr("data-index");
                $("#taskIndex").text(index);
                $("#taskStatus").text(tasks[index].status);
                $("#taskName").val(tasks[index].name);
                $("#dateAdded").text(tasks[index].dateAdded);
                $("#taskDesc").val(tasks[index].desc);


        });
         
         $(".remove").click(function(){
             
             var index = $($(this).parent()).attr("data-index");
             
             //remove from the database
             $.ajax({

                 type: "POST",
                 url:"/todoAction",
                 data:{
                     action:'remove',                    
                     id:$("#id").text(),
                     name:tasks[index].name, 
                     desc:tasks[index].desc

                 }
             }).done(function(data){
                 
                 $("[data-index='" +index+"']").slideUp(500, function(){
                     
                     $("[data-index='" +index+"']").remove();
                     
                 });
                 
             });
             
        });
        
    } 
          
     $(window).resize(function(){
         
        fixPos();
         
     });
     
     function fixPos(){
         
         $("#btnAddNew").css("left", $(window).width()-$("#btnAddNew").width()*2);
         $("#btnAddNew").css("top", $(window).height()-$("#btnAddNew").height()*2);
         
     }
          
     function getCurrentDate(){
            
         //gives current date string with formatting
         var time = new Date();         
         return time.getFullYear() + "/" + (parseInt(time.getMonth())+1) + "/" + time.getDate();
         
     }
     
     function clearInputFields(){
         
         //clear the entered values
        $("#taskName").val("");
        $("#taskDesc").val("");    
         
     }
     
     function changeModalRole(role){
         
         if(role === "NewTask"){
             
             $("#taskName").removeAttr("disabled");
             $("#btnAdd").show(); 
             $("#btnUpdate").hide(); 
             $("#dateAdded").text(getCurrentDate());
         }
         
         else if(role === "Description"){
             
             
             $("#taskName").attr("disabled","");
             $("#btnAdd").hide(); 
             $("#btnUpdate").show(); 
         }
         
     }
      
     function runStartupFunctions(){
         
         setEventHandlers();
         fixPos();
         
         loadFromServer();
                 
         $("#btnUpdate").hide();
         
     }
     
     runStartupFunctions();
     
     function loadFromServer(){
         
         $.ajax({
            
             type: "POST",
             url:"/todoAction",
             data:{
                 action:'giveAll',
                 id: $("#id").text()
             }
            
         })
          .done(function(data, status){
            
                  for(var l in data){tasks.push({name:data[l].name, desc:data[l].desc, dateAdded:data[l].dateAdded, status:data[l].status});};
            
              loadData();
              setEventHandlers();

         });
         
         
     }
          
     
});
	
