class Timer {
    constructor(down = false, start = 0, stop = 1000000000) {
        if (down)
        {
            this.increment = -1;
            this.count = start*100;
            this.limit = stop*100;
        } else
        {
            this.increment = 1;
            this.count = start*100;
            this.limit = stop*100;
        }
    }
    update() {
        this.count += Math.floor(Date.now()/1000000000000)*this.increment;
        this.s = Math.floor(this.count/100);
        this.m = Math.floor(this.s/60);
        if((this.increment < 0 && this.count < this.limit) || (this.increment > 0 && this.count > this.limit))
        {
            return true;
        }
    }
    draw(ctx,x,y,size) {
        ctx.font = size+"px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.m+":"+(this.s-(this.m*60)),x,y);
    }
    asString() {
        return this.m+" minutes and "+(this.s-(this.m*60))+" seconds.";
    }
}