class M20 {
    constructor() {
        this.canvas = document.getElementById("displaycanvas");
        this.ctx = this.canvas.getContext("2d");
        this.precanvas = document.getElementById("drawcanvas");
        this.prectx = this.precanvas.getContext("2d");
        this.drawLogo = true;
        this.gameLoop();
        this.logoOpacity = -0.5;
    };
    gameLoop() {
        this.ctx.clearRect(0,0,1000,1000);
        if(this.drawLogo)
        {
            this.prectx.font = "bold 470px comic sans ms";
            this.prectx.textAlign = "center";
            this.prectx.lineWidth = 5;
            this.prectx.fillStyle = "rgba(200,200,200,"+((Math.floor(this.logoOpacity)/10)-1)+")";
            this.prectx.strokeStyle = "rgba(200,200,200,"+((Math.floor(this.logoOpacity)/10)-1)+")";
            this.prectx.fillText("M20", 490, 595);
            this.prectx.strokeText("M20", 490, 595);
            this.prectx.fillStyle = "rgba(100,100,100,"+(Math.floor(this.logoOpacity)/10)+")";
            this.prectx.strokeStyle = "rgba(200,200,200,"+((Math.floor(this.logoOpacity)/10)-1)+")";
            this.prectx.fillText("M20", 500, 605);
            this.prectx.strokeText("M20", 500, 605);
            this.prectx.font = "bold 120px impact";
            this.prectx.strokeText("E  N  G  I  N  E", 500, 750);
            this.prectx.fillText("E  N  G  I  N  E", 500, 750);
            this.logoOpacity += 0.1;
        }
        if (this.gameState)
        {
            this.gameState.update();
            this.gameState.draw();
        }
        if (this.frameRate)
            this.frameRate.draw();
        this.ctx.drawImage(this.precanvas,0,0,1000,1000);
        //console.log();
        requestAnimationFrame(() => {this.gameLoop();});
    };
    activateModule(name, param1) {
        if(this[name])
        {
            console.log("Module Already Active - "+ name);
        } else {
            var module = document.createElement("script");
            module.type = "text/javascript";
            var type;
            var getUrl = window.location;
            var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
            switch (name)
            {
                case "audio":
                    console.log("Audio Manager Module Requested.");
                    module.src = baseUrl+"/Resources/Js/Audio.js";
                    type = function() {console.log("Audio Manager Module Loaded.");return new AudioManager();};
                    break;
                case "images":
                    console.log("Image Handler Module Requested.");
                    module.src = baseUrl+"/Resources/Js/ImageHandler.js";
                    type = function() {console.log("Image Handler Module Loaded.");return new ImageHandler();};
                    break;
                case "frameRate":
                    console.log("Frame Rate Monitor Module Requested.");
                    module.src = baseUrl+"/Resources/Js/FrameRateMonitor.js";
                    type = function() {console.log("Frame Rate Monitor Module Loaded.");return new FrameRateMonitor(param1||this.prectx);};
                    break;
                case "gameState":
                    console.log("Game State Manager Module Requested.");
                    module.src = baseUrl+"/Resources/Js/StateManager.js";
                    type = function() {console.log("Game State Manager Module Loaded.");return new StateStack(param1);};
                    break;
                case "vec":
                    console.log("Vector Module Requested.");
                    module.src = baseUrl+"/Resources/Js/Vec.js";
                    type = function() {console.log("Vector Module Loaded.");};
                    break;
                case "timer":
                    console.log("Timer Module Requested.");
                    module.src = baseUrl+"/Resources/Js/Timer.js";
                    type = function() {console.log("Timer Module Loaded.");};
                    break;
                case "particles":
                    console.log("Particle System Module Requested.");
                    this.activateModule("vec");
                    module.src = baseUrl+"/Resources/Js/ParticleSystem.js";
                    type = function() {console.log("Particle System Module Loaded.");return new ParticleSystem();};
                    break;
            }
            module.id = name;
            module.onload = () => {
                this[name] = type();
                //console.log(this[name]);
            };
            document.head.insertBefore(module, document.head.firstChild);
        }
    };
}
