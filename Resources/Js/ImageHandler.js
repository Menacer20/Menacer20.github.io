class ImageHandler {
    constructor() {
        this.total = 0;
        this.loaded = 0;
        this.source = "Resources/Images/";
        console.log("Image Handler Initialized. Total Images " + this.total);
    }
    loadImage(name, type = ".png"){
        if(!this[name])
        {
            this.total++;
            this[name] = new Image();
            this[name].onload = () =>{this.loaded++;
            console.log("Images Loaded - " + this.loaded+"/"+this.total);};
            this[name].src = this.source + name + type;
        } else
        {
            console.log(name + " already in memory.");
        }
    };
    deleteImage(name) {
        if (this[name])
        {
            delete this[name];
        } else
        {
            console.log("Can not find " + name + " . Nothing deleted.");
        }
    }
}
