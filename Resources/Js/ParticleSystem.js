class ParticleSystem {
    constructor() {
        this.particles = [];
        this.pos;
    };
    update() {
        this.particles.forEach(function(obj,itr){obj.update();});
    };
    display() {
        this.particles.forEach(function(obj,itr){obj.draw();});
    };
    addParticle() {
        this.particles.unshift(new Particle(this.pos));
    };
}
class Particle {
    constructor(p, v, a, s, l, i) {
        this.pos = p;
        this.vel = v;
        this.acc = a;
        this.size = s;
        this.lifespan = l;
        this.image = i;
    };
    update() {
        
    };
    display() {
        
    };
    isDead() {
        if (lifespan < 0.0)
        {
            return true;
        } else {
            return false;
        }
    };
}