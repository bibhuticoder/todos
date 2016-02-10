var app = require( 'express' )();
var path = require( 'path' );
var bodyParser = require( 'body-parser' ); // for reading Posted form data into `req.body`
var expressSession = require( 'express-session' );
var cookieParser = require( 'cookie-parser' ); // the session is stored in a cookie, so we use this to parse it
var http = require( 'http' ).Server( app );
var io = require( 'socket.io' )( http );
var db = require('./database');

// must use cookieParser before expressSession
app.use( cookieParser() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( expressSession( { secret: 'somesecrettokenhere' } ) );
app.use( require( 'express' ).static( path.join( __dirname, 'public' ) ) );

// view engine setup .. setup ejs engine
app.set( 'views', path.join( __dirname, 'views' ) );

app.set( 'view engine', 'ejs' );

app.get( '/', function ( req, res ) {

    res.render( 'login' );

} );

app.post( '/validate', function ( req, res ) {

    var password = req.body.password;
    var username = req.body.username;
    
    //check password and username in database
    db.users.findOne({username:username, password:password}, function(err, user){
            
            if(user){
                
                res.send({type:"success", id:user._id});  
              
            }
            
            else{
                
               res.send({type:"error", msg:"Incorrect username or password"});  
                
            }
    } );
        
} );

app.post('/enter', function(req,res){
    
    res.render("index",{id:req.body.id});
        
});

app.post( '/signup', function ( req, res ) {
    
    res.render("login");              
        
} );

app.post('/register', function(req,res){
   
    console.log("Register request received");
    
    
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var newNser;
    
    
    console.log(password);
    
    //if the conditions match
    if(password.length > 3 && password === repassword){
        
        db.users.findOne({username:username}, function(err, user){
            
            if(user){
                                
                res.send({type:"error", msg:"username already exists"});  
            }
            
            else{
                                
                newNser = new db.users({

                    username : username,                    
                    password : password,
                    todos:[{name:"Test task", desc:"This is the description of test task....", dateAdded:"2016/04/07", status:"unchecked"}]

                }).save(function(err,data){

                    if(err) console.log(err);
                    res.send({type:"success", msg:"Registered successfully"});

                });
                
            }
        
        });
        
    }
    
    else{
        
        res.send({type:"error", msg:"Invalid password"})
    }
});

app.post('/todoAction', function(req,res){
   
    if(req.body.action === 'giveAll'){
              
        //load it from database and send        
        db.users.findOne({_id:req.body.id}, function(err, user){            
            res.send(user.todos);            
        });
        
       // res.send(tasks);
                
    }
    
    else if(req.body.action === 'add'){
        
        //add to database
        db.users.update({ "_id": req.body.id },{ "$push": { "todos": {name:req.body.name, desc:req.body.desc, dateAdded:req.body.dateAdded, status:req.body.status} } },function(err,data){
            
            res.send("Added Successfully");
            
        });
                
        
    }
    
    else if(req.body.action === 'remove'){
        
        db.users.update({ "_id": req.body.id },{$pull: { "todos": {name:req.body.name} } },function(err,data){
           
            console.log("Removed successfully");
            res.send("Removed Successfully");
            
        });
        
        
    }
    
    else if(req.body.action === 'check'){
        
         db.users.findOne({ "_id": req.body.id },function(err, user){
           
             user.todos[req.body.index].status = "checked"; 
             user.markModified('todos');
             user.save();
           
        });

    }
    
    else if(req.body.action === 'uncheck'){
        
        db.users.findOne({ "_id": req.body.id },function(err, user){
           
             user.todos[req.body.index].status = "unchecked"; 
             user.markModified('todos');
             user.save();
        
            
        });
        
    }
    
    else if(req.body.action === 'update'){
        
        db.users.findOne({"_id": req.body.id },function(err, user){
           
            user.todos[req.body.index].status = "unchecked"; 
            user.todos[req.body.index].name = req.body.name; 
            user.todos[req.body.index].desc = req.body.desc; 
            
            user.markModified('todos');
            user.save();
             
            res.send("Updated Successfully");
            
            
        });
        
        
    }
    
});

app.get( '*', function ( req, res ) {
    res.render( 'login' );
} );


//array to store my todos
var tasks = [];



var port = process.env.PORT || 3000;
http.listen( port );
console.log( "Listening to port " + port );

