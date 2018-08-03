/*global Vec, Vrect*/
var m20,gameState, prectx, popup, input, precanvas, chatLog;
function onload() {
    m20 = new M20();
    m20.activateModule("gameState");
    m20.activateModule("images");
    m20.activateModule("audio");
    m20.activateModule("frameRate", m20.prectx);
    m20.activateModule("vec");
    precanvas = m20.precanvas;
    prectx = m20.prectx;
    popup = document.getElementById("popup");
    chatLog = [];
    document.getElementById("chatinput").addEventListener("keypress",ifEnter, false);
    var wait = setInterval(function() {
        if(m20.gameState)
        {
            console.log("Engine Initialized");
            gameState = m20.gameState;
            gameState.push(new SplashScreen());
            clearTimeout(wait);
        }
    },100);
}

function server(content, callback) {
    var returned;
    var ready = false;
    var request = new XMLHttpRequest();
    request.open("POST", "/battleboatsserver.php", true);
    //request.open("POST", "https://menacer20.github.io/battleboats/battleboatsserver.php", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //request.responseType = "text";
    request.onreadystatechange = function () {
        if(request.readyState === 4 && request.status === 200) {
            returned = request.responseText.split("!#!");
            console.log(returned[0]);
            callback(JSON.parse(returned[1]));
        }
    };
    //console.log(content);
    request.send(JSON.stringify({"playerData":content}));
}
class Player {
    constructor() {
        this.id = null;
        this.name = null;
        this.host = false;
        this.game = null;
        this.ready = false;
        this.message = null;
    };
}
class Boat {
    constructor(type, vertical) {
        this.image;
        this.size;
        this.vertical = vertical;
        this.pos = input.startPos;
        this.Vrect;
        switch(type)
        {
            case "boat2l":
            case "boat2l2":
                if(this.vertical)
                {
                    this.size = new Vec(100,200);
                    this.image = m20.images[type+"v"];
                }
                else
                {
                    this.size = new Vec(200,100);
                    this.image = m20.images[type+"h"];
                }
                break;
            case "boat3l":
            case "boat3l2":
                if(this.vertical)
                {
                    this.size = new Vec(100,300);
                    this.image = m20.images[type+"v"];
                }
                else
                {
                    this.size = new Vec(300,100);
                    this.image = m20.images[type+"h"];
                }
                break;
            case "boat4l":
                if(this.vertical)
                {
                    this.size = new Vec(100,400);
                    this.image = m20.images[type+"v"];
                }
                else
                {
                    this.size = new Vec(400,100);
                    this.image = m20.images[type+"h"];
                }
                break;
                
        }
    };
}
class Input {
    constructor(display, drawing, handler) {
        this.handler = handler;
        this.active = false;
        this.startPos = new Vec(0,0);
        this.pos = new Vec(0,0);
        this.endPos = new Vec(0,0);
        this.display = display;
        this.drawing = drawing;
        this.display.addEventListener('mousedown', this.start.bind(this), false);
        this.display.addEventListener('touchstart', this.start.bind(this), false);
        this.display.addEventListener('mousemove', this.move.bind(this), false);
        this.display.addEventListener('touchmove', this.move.bind(this), false);
        this.display.addEventListener('mouseup', this.end.bind(this), false);
        this.display.addEventListener('touchend', this.end.bind(this), false);
        this.display.addEventListener('touchcancel', this.end.bind(this), false);
    };
    start(e) {
        e.preventDefault();
        if(!this.active)
        {
            console.log("Input start");
            this.active = true;
            this.startPos = this.setPos(e);
            this.handler("start");
        }
        else
        {
            console.log("Input Active");
        }
    };
    move(e) {
        e.preventDefault();
        if(this.active)
        {
            console.log("Input move");
            this.pos = this.setPos(e);
            this.handler("move");
        }

        
    };
    end(e) {
        console.log("Input end");
        e.preventDefault();
        this.active = false;
        this.endPos = this.setPos(e);
        this.handler("end");
    };
    setPos(e) {
        var a = this.display.getBoundingClientRect();
        var x = Math.floor((e.clientX - a.left) * (this.drawing.width / a.width));
        var y = Math.floor((e.clientY - a.top) * (this.drawing.height / a.height));
        console.log(x+","+y);
        return new Vec(x,y);
    };
}
function makeGrid(boats) {
    var offsetX = 200;
    var offsetY = 200;
    var cellSize = 100;
    var grid = [];
    var boats = boats;
    var count = 0;
    console.log(boats);
    for(var y = 0; y < 7; y++)
    {
        for(var x = 0; x < 7; x++)
        {
            var cell = new Vrect(new Vec(offsetX+(x*cellSize)+10,offsetY+(y*cellSize)+10),new Vec(cellSize-20,cellSize-20));
            var colliding = false;
            for(var b = 0; b < boats.length; b++)
            {
                if(Vrect.isColliding(cell, boats[b].Vrect))
                {
                    colliding = true;
                }
            }
            if(colliding)
            {
                grid.push(1);
                count++;
            }
            else
            {
                grid.push(0);
            }
        }
    }
    console.log(grid);
    if(count === 14)//layout ok. set ready.
    {
        return true;
    }
    else
    {
        console.log("gg");
        setPopup("Illegal Layout");
        return false;
    }
}
function setPopup(string, time = 1000) {//sets a temporary popup box with a provided string;
    popup.innerHTML = string;
    popup.style.display = "initial";
    setTimeout(function(){popup.style.display = "none";}, time);
    
}
function updateChat() {//displays the contents of chatLog in the chatarea div
    var chat = document.getElementById("chatarea");
    var scrolledBottom = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 1;
        chat.innerHTML = "";
        chatLog.forEach(function(obj){
            chat.innerHTML += obj;
            chat.innerHTML += "<br/>";
        });
        if(scrolledBottom)
            chat.scrollTop = chat.scrollHeight - chat.clientHeight;
}
function ifEnter(e) {
    if(e.keyCode === 13)
    {
        e.preventDefault();
        gameState.top().setMessage();
    }
}
function serverReset() {
    server({id:"reset server m20"},function(){location.reload();});
}
function serverStats() {
    server({id:"current server status"},function(){});
}