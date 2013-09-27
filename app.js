var express = require("express");
var app = express();
var io = require("socket.io").listen(app.listen(3000));
var serialport = require('serialport');

//express code
app.get("/",function(req,res){
    res.sendfile(__dirname + '/index.html');
});
app.use(express.static(__dirname));

// Serial Port
var portName = '/dev/tty.usbserial-A6008hxG'; // Mac環境
var sp = new serialport.SerialPort(portName, {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\n")   // ※修正：パースの単位を改行で行う
});

//socket.io code
io.sockets.on('connection',function(socket){
  socket.emit('connect_ok',{message:'websocket communication ready'});

  // data from Serial port
  sp.on('data', function(input) {
      console.log(input);
      var buffer = new Buffer(input, 'utf8');
      var jsonData;
      try {
	  jsonData = JSON.parse(buffer);
	  console.log('code: ' + jsonData.code);
      } catch(e) {
	  // データ受信がおかしい場合無視する
	  return;
      }
	 socket.emit(jsonData.code, { code: jsonData.code });    
  });

  socket.on('trigger1',function(data){
    console.log(data.my);
  //setInterval(function(){debugFunc()},2000); //for debug
  });

  function debugFunc(){
    var _date = new Date()
    var _label = _date.getHours() +':'+_date.getMinutes() +':'+ _date.getSeconds();
    var _content = Math.random();
    if (_content > 0.8){
    socket.emit('3f_on',{message:'3F is ON',label:_label,content:_content});
    } else if(_content < 0.2) {
    socket.emit('3f_off',{message:'3F is OFF',label:_label,content:_content});
    }
   }

});






