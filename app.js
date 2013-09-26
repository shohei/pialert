var express = require("express");
var app = express();
var io = require("socket.io").listen(app.listen(3000));

//express code
app.get("/",function(req,res){
    res.sendfile(__dirname + '/index.html');
});
app.use(express.static(__dirname));

//socket.io code
io.sockets.on('connection',function(socket){
  socket.emit('connect_ok',{message:'websocket communication ready'});

  socket.on('trigger1',function(data){
    console.log(data);
    setInterval(function(){externalFunc()},2000);
  });

  function externalFunc(){
    var _date = new Date()
    var _label = _date.getHours() +':'+_date.getMinutes() +':'+ _date.getSeconds();
    var _content = Math.random();
    if (_content > 0.8){
    socket.emit('2f_on',{message:'2F is ON',label:_label,content:_content});
    } else if(_content < 0.2) {
    socket.emit('2f_off',{message:'2F is OFF',label:_label,content:_content});
    }
   }

});







