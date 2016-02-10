var mongoose = require('mongoose');

// connect to database. if doesn't exist, create it
mongoose.connect('mongodb://localhost/todos');
var db = mongoose.connection;
console.log('Connected to database');

var userSchema = mongoose.Schema({
            
    username:String,    
    password:String,
    todos:[]
                
}); 

var users =  mongoose.model('user', userSchema);

exports.users = users;

