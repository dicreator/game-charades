module.exports = {
    printAvatar: function(){
        console.log("Lolo");
    }
};
function printSomething(){
    console.log("test")
}

function doSomething(){
    console.log("test")
}


//File
var fs = require("fs");

// fs.writeFileSync("dow.txt", "wad");
console.log(fs.readFileSync("dow.txt").toString());

module.exports.printSomething = printSomething;



//////////////////////////////

var connect = require("connect");
var http = require("http");

var app = connect();

http.createServer(app).listen(8888);

//

app.use(callingNextFun);
app.use("/supermood", callsupermood);

function callingNextFun(response,request,next){
    console.log('go to next task');
    next;
}

function callsupermood(request,response){
    console.log("super puper");
}