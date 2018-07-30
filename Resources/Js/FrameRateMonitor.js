class FrameRateMonitor {
    constructor(canvascontext, posx = 1000, posy = 20, align = "right") {
        this.frameStart = performance.now()/1000;
        this.frameCount = 0;
        this.fps = 0;
        this.ctx = canvascontext;
        this.posX = posx;
        this.posY = posy;
        this.textAlign = align;
        this.textSize = 20;
        this.decimals = 1;
    }
    draw() {
        this.frameCount++;
        if (this.frameCount === 60)
        {
            this.fps = 60/(performance.now()/1000 - this.frameStart);
            this.frameStart = performance.now()/1000;
            this.frameCount = 0;
            this.fps = Number(Math.round(this.fps+'e'+this.decimals)+'e-'+this.decimals);
            if (this.fps/Math.floor(this.fps)=== 1)
            {
                this.fps+'.0';
            }
        }
        this.ctx.font = this.textSize+"px arial";
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.textAlign = this.textAlign;
        this.ctx.fillText(this.fps,this.posX, this.posY);
        this.ctx.fillStyle = "rgba(0,0,0,1)";
    }
}