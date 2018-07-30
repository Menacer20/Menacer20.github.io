var m20, prectx;
function onload() {
    m20 = new M20();
    prectx = m20.prectx;
    m20.activateModule("gameState", new Game());
}
function Game() {
    var i = -1000;
    var up = true;
    this.onEnter = function() {
        
    };
    this.update = function() {
        if(up)
            i+=10;
        else
            i-=10;
        if (i>1000)
            up = false;
        if (i<-1000)
            up = true;
    };
    this.draw = function() {
        prectx.clearRect(0,0,1000,1000);
        prectx.fillRect(i,495,1000,10);
    };
}