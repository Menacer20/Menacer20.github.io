class AudioManager {
    constructor() {
        this.ctxa = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = [];
        this.total = 0;
        this.loaded = 0;
        this.fileSource = "Resources/Audio/";
        this.masterGain = this.ctxa.createGain(); // master gain control
        this.masterGain.connect(this.ctxa.destination);
    }
    loadSound(name, delaytime = 100) {
        if(this.sounds[name])
        {
            console.log("sound " + name + " already in memory.");
        } else
        {
            this.sounds[name] = new Sound(name, this, delaytime);
            this.total += 1;
        }
    }
    play(name) {
        var sound = this.sounds[name];
        var buffer = this.ctxa.createBufferSource();
            //console.log(this.sounds[name].delayed);
        if(sound !== undefined && !sound.delayed)
        {
            buffer.buffer = sound.source;
            buffer.connect(sound.output);
            buffer.start(0);
            sound.playBuffer = buffer;
            sound.delaySet();
        } else if(sound.delayed)
        {
            console.log("audio delayed = " + sound.delayed);
        } else
        {
            console.log(name + " - sound not found!");
        }
        
    };
    stop(name) {
        var sound = this.sounds[name];
        if(sound.playBuffer !== undefined)
        {
            sound.playBuffer.stop();
        }
    };
    setLoop(name) {
        this.sounds[name].playBuffer.loop = true;
    };
    setMasterVolume(g) {
        this.masterGain.gain.setValueAtTime(g, this.ctxa.currentTime);
    };
    getMasterVolume() {
        return this.masterGain.gain.value;
    };
    setVolume(sound, vol) {
        this.sounds[sound].setVolume(vol);
    };
}
class Sound {
    constructor(name, audiomanager, delaytime){
        var manager = audiomanager;
        this.name = name;
        this.delay = delaytime;
        this.source;
        this.playBuffer;
        this.output = manager.ctxa.createGain();
        this.output.connect(manager.masterGain);
        this.delayed = false;
        var self = this;
        var request = new XMLHttpRequest();
        request.onreadystatechange=function() {
            if (request.readyState === 4)
            {   //if complete
                if(request.status !== 200)
                {  //check if "OK" (200)
                    console.log("FAILED TO LOAD SOUND -  " + name);
                if (confirm("FAILED TO LOAD REQUIRED FILE -  " + name + "\n Do you want to continue anyway? (ERRORS MAY OCCOUR)") === true)
                    manager.loaded += 1;
                else
                    location.reload();
                }
            } 
        };
        request.open('GET', manager.fileSource + name, true);
        request.responseType = 'arraybuffer';
        console.log("requesting " + name);
        request.onload = function() {
            manager.ctxa.decodeAudioData(request.response).then(function(buffer){
                self.source = buffer;
                manager.loaded += 1;
                console.log(name + " loaded to buffer");
            });
        };
        request.send();
    }
    setVolume(vol) {
        if(vol >100 || vol < 0)
        {
            console.log("Invalid Volume - "+ vol);
        }
        else
        {
            this.output.gain.setValueAtTime(vol, this.manager.ctxa.currentTime);
        }
    };
    delaySet(){
        //console.log(this.delayed);
        this.delayed = true;
        setTimeout(function(me){me.delayed = false;}, this.delay, this);
    };
}