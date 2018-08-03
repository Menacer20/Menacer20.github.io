/*global Vec, Vrect, popup, m20, prectx, gameState, input, precanvas*/
class Prep {
    constructor(parent) {
        this.parent = parent;
        //popup.style.display = "none";
    };
    update() {
        
    };
    draw() {
        prectx.drawImage(m20.images.prepbg2, 0, 0, precanvas.width,precanvas.height);//draw game prep background
        if(this.parent.placeVertical)
            prectx.drawImage(m20.images.boatstripv, 0, 250, 200, 1000);//draw ships side bar
        else
            prectx.drawImage(m20.images.boatstriph, 0, 250, 200, 1000);//draw ships side bar
        this.parent.boats.forEach(function(obj, itr){
            if(Vrect.vecContained(obj.pos,this.parent.mainLayout))
            {
                if(obj.vertical)
                {
                    prectx.drawImage(obj.image, Math.floor((obj.pos.x-(obj.size.x/2))/100)*100, Math.floor((obj.pos.y-(obj.size.y/2))/100)*100, obj.size.x, obj.size.y);
                }
                else
                {
                    prectx.drawImage(obj.image, Math.floor((obj.pos.x-(obj.size.x/2))/100)*100, Math.floor((obj.pos.y-(obj.size.y/2))/100)*100, obj.size.x, obj.size.y);
                }
                prectx.fillStyle='red';
//                        if(obj.Vrect)
//                            prectx.fillRect(obj.Vrect.left,obj.Vrect.top,obj.Vrect.width,obj.Vrect.height);
            }
        }.bind(this));//draw ships on layout
    };
    handleInput(type) {
        switch(type)
        {
            case "start":
                if(!this.parent.player.ready)//check location of input
                {
                    var boatBoxes = [
                        {area:new Vrect(new Vec(0,0), new Vec(200,200)), boat:"boat4l"},
                        {area:new Vrect(new Vec(0,200), new Vec(200,200)), boat:"boat3l"},
                        {area:new Vrect(new Vec(0,400), new Vec(200,200)), boat:"boat3l2"},
                        {area:new Vrect(new Vec(0,600), new Vec(200,200)), boat:"boat2l"},
                        {area:new Vrect(new Vec(0,800), new Vec(200,200)), boat:"boat2l2"}
                    ];
                    boatBoxes.forEach(function(obj, itr) {
                        if (Vrect.vecContained(input.startPos, obj.area))
                        {
                            console.log("making boat");
                            this.parent.boats.push(new Boat(obj.boat, this.parent.placeVertical));
                            this.parent.activeBoat = this.parent.boats[this.parent.boats.length-1];
                        }
                    }.bind(this));
                    var readyButton = new Vrect(new Vec(900,900), new Vec(100,100));
                    if(Vrect.vecContained(input.startPos, readyButton))
                    {
                        if(!this.parent.player.ready)
                        {
                            makeGrid(this.parent.boats);
                            this.parent.player.ready = true;
                        }
                        else
                        {
                            this.parent.player.ready = false;
                        }
                    }
                    var rotateButton = new Vrect(new Vec(800,0), new Vec(200,200));
                    if(Vrect.vecContained(input.startPos, rotateButton))
                    {
                        if(this.parent.placeVertical)
                            this.parent.placeVertical = false;
                        else
                            this.parent.placeVertical = true;
                        console.log("rotate");
                    }
                }
                break;
            case "move":
                if(this.parent.activeBoat)//check location of input
                {
                    //var newPos = input.pos;
                    //newPos.x = Math.floor(newPos.x/100)*100;
                    //newPos.y = (Math.floor((newPos.y)/100)*100)+50;
                    this.parent.activeBoat.pos = input.pos;
                }
                break;
            case "end":
                if(this.parent.activeBoat)//check location of input
                {
                    var b = this.parent.activeBoat;
                    b.Vrect = new Vrect(new Vec((Math.floor((b.pos.x-(b.size.x/2))/100)*100)+10,(Math.floor((b.pos.y-(b.size.y/2))/100)*100)+10),new Vec (b.size.x-20, b.size.y-20));
                    this.activeBoat = null;
                }
                break;
        }
    }
}
class myTurn {
    constructor() {
        
    };
    update() {
        
    };
    draw() {
        
    };
    handleInput(type) {
        
    };
}
class theirTurn {
    constructor() {
        
    };
    update() {
        
    };
    draw() {
        
    };
    handleInput(type) {
    
    };
}