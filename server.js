var express = require('express');  
var app = express();               
var server = require('http').createServer(app);  
var path = require('path');     
var io = require('socket.io').listen(server);     
  
var users = [];                     
let usersNum = 0;  
  
server.listen(3000,function(){               
    console.log("server running at 127.0.0.1:3000");        
});  
 
app.get('/',function(req,res){  
    res.redirect('/index.html');      
});  

app.use('/',express.static(path.join(__dirname,'./html')));        
 
io.on('connection',function(socket){
                  
    socket.on('login', function(nickname) {
                
        
        if (users.indexOf(nickname) > -1) {
        
                    socket.emit('nickExisted');
        
                } else {
        
                    //socket.userIndex = users.length;
        
                    socket.nickname = nickname;
        
                    users.push(nickname);
        
                    socket.emit('loginSuccess',users.length);
        
                    io.sockets.emit('system', nickname, users.length, 'login');

                   
        
                };

                console.log(users.length+"人在线");
        
            });
        
           
        
    socket.on('disconnect', function() {
        
        users.splice(users.indexOf(socket.nickname), 1);
                
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');

         console.log(users.length+"人在线");
        
    });

    socket.on('postMsg',function(msg){

        socket.broadcast.emit('newMsg', socket.nickname, msg);

    })
});  