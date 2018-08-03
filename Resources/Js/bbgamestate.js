/*global Vec, Vrect, popup, m20, prectx, gameState, input, precanvas*/
class SplashScreen {
    constructor() {
        console.log("splash");
        this.t = 0;
        m20.images.loadImage("prepbg2");
        m20.images.loadImage("boatstripv");
        m20.images.loadImage("boatstriph");
        m20.images.loadImage("boat2lh");
        m20.images.loadImage("boat2l2h");
        m20.images.loadImage("boat3lh");
        m20.images.loadImage("boat3l2h");
        m20.images.loadImage("boat4lh");
        m20.images.loadImage("boat2lv");
        m20.images.loadImage("boat2l2v");
        m20.images.loadImage("boat3lv");
        m20.images.loadImage("boat3l2v");
        m20.images.loadImage("boat4lv");
        m20.images.loadImage("playbg2");
    }
    update() {
        this.t++;
        if(this.t > 60)
        {
            gameState.push(new MainMenu());
        }
    };
    draw() {
        prectx.fillStyle = "white";
        prectx.clearRect(0,0,prectx.width,prectx.height);
        prectx.fillRect(250,250,500,500);
    };
}
class MainMenu {
    constructor() {
        console.log("menu");
        this.pname = document.getElementById("name");
        this.playButton = document.getElementById("play");
        this.pname.style.display = "initial";
        this.pname.focus();
        this.playButton.style.display = "initial";
        this.player = new Player();
        this.gameRequested = false;
    }
    update() {
        if(this.player.id && !this.gameRequested)
        {
            
            server(this.player, this.recieveData.bind(this));
            this.gameRequested = true;
        }
        if(this.player.game)
        {
            gameState.push(new Game(this.player));
        }
    };
    draw() {
        prectx.fillStyle = "red";
        prectx.clearRect(0,0,prectx.width,prectx.height);
        prectx.fillRect(250,250,500,500);
    };
    getId() {
        if(this.pname.value)
        {
            this.player.name = this.pname.value;
            popup.innerHTML = "Connecting With Server";
            popup.style.display = "initial";
            server(this.player, this.recieveData.bind(this));
        }
        else
        {
            setPopup("Player Name Required");
        }
    };
    recieveData(result) {
        this.player = result;
        console.log(this.player);
        this.pname.style.display = "none";
        this.playButton.style.display = "none";
    };
}
class Game {
    constructor(player) {
        console.log("game");
        input = new Input(m20.canvas,m20.precanvas, this.handleInput.bind(this));
        this.player = player;
        this.gamePhase = [new Prep(this),new myTurn(this),new theirTurn(this)];
        this.phase;
        if(this.player.game.state === 0)
        {
            popup.style.display = "none";///remove me!!!!!!!!!!!!!!!!!!
            popup.innerHTML = "Waiting For Opponent";
            this.waitingForOpponent = true;
        }
        else
        {
            popup.style.display = "none";
            document.getElementById("chatwindow").style.display = "initial";
            this.waitingForOpponent = false;
        }
        this.checkCount = 0;
        this.placeVertical = false;
        this.boats = [];
        this.abandonButton = new Vrect(new Vec(400,0), new Vec(200,100));
        this.mainLayout = new Vrect(new Vec(200,200),new Vec(700,700));
    }
    update() {
        updateChat();
        this.checkCount++;
        switch(this.player.game.state)
        {
            case 0://waiting for player 2
                //handle click if click on abandon player.game = null; gameState.pop();
                break;
            case 1://prep phase - 0 players ready
                if(this.waitingForOpponent)
                {
                    this.waitingForOpponent = false;
                    popup.style.display = "none";
                    document.getElementById("chatwindow").style.display = "initial";
                }
                this.phase = this.gamePhase[0];
                break;
            case 2://prep phase - 1 players ready
                this.phase = this.gamePhase[0];
                break;
            case 3://hosts turn
                this.phase = this.gamePhase[1];
                break;
            case 4://clients turn
                this.phase = this.gamePhase[2];
                break;
            case 5://game over
                
                break;
        }
        if(this.phase)
            this.phase.update();
        if(this.checkCount===120)
        {
            this.checkCount = 0;
            server(this.player, this.recieveData.bind(this));
            this.player.message = null;
        }
    };
    draw() {
        prectx.fillStyle = "green";
        prectx.clearRect(0,0,prectx.width,prectx.height);
        prectx.drawImage(m20.images.playbg2, 0, 0, precanvas.width, precanvas.height);
        if(this.phase)
            this.phase.draw();
    };
    handleInput(type) {// start move end
        if(type === "start" && Vrect.vecContained(input.startPos, this.abandonButton))
        {
            if(confirm("are you sure you want to abandon this game?"))
            {
                console.log("abandoned game");
            }
            else
            {
                console.log("abandon cancelled");
            }
        }
        else if(this.player.game.state === 0)
        {
            return;
        }
        else
        {
            this.phase.handleInput(type);
        }
    };
    abandon() {
        this.player.game = null;
        gameState.pop();
    }
    recieveData(result) {
        if(this.player.game.state === result.game.state)
        {
            
        }
        else
        {
            this.player = result;
            console.log("new Game State = "+this.player.game.state);
        }
        chatLog = result.game.chat;//updates the chatLog with any changes made by the server using player.message inputs
    };
    setMessage() {//sets a message entered by the player, prefixing their name, ready for it to be sent to the server.
        this.player.message = this.player.name+" :  "+document.getElementById("chatinput").value;
        document.getElementById("chatinput").value = "";
        document.getElementById("chatinput").focus();
    };
}