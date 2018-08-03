class Vec {//vector math made easier
    constructor(x, y) {
        this.x = x;
        this.y = y;
    };
    asString() {//convert vector to an easily readable string
        return "x: " + this.x + ", y: " + this.y;
    };
    add(vec) {//add vec to this vector
        this.x += vec.x;
        this.y += vec.y;
    };
    sub(vec) {//subtract vec from this vector
        this.x -= vec.x;
        this.y -= vec.y;
    };
    scalarMultiply(a) {//multiply scalars of this vector by a
        this.x *= a;
        this.y *= a;
    };
    scalarDivide(a) {//divide scalars of this vector by a
        this.x /= a;
        this.y /= a;
    };
    normalize() {//normalizes this vector
        this.scalarDivide(this.length());
    };
    invert() {//use to reverse velocity
        this.x = -this.x;
        this.y = -this.y;
    };
    length() {//returns the length of this vector
        return Math.sqrt(this.x*this.x + this.y*this.y);
    };
    distance(target) {//returns the distance between this and another vector
        var a = this.x-target.x;
        var b = this.y-target.y;
        return Math.sqrt(a*a + b*b);
    };
    dotProduct(target) {//normalizes both vectors and returns the dot product (angle between the 2)
        var a = new Vec (this.x / this.length(), this.y / this.length());
        var b = new Vec (target.x / target.length(), target.y / target.length());
        return Math.acos((a.x*b.x) + (a.y*b.y)) / Math.PI * 180;
    };
    static add(a, b) {//returns a+b
        return new Vec(a.x + b.x, a.y + b.y);
    };
    static sub(a, b) {//returns a-b
        return new Vec(a.x - b.x, a.y - b.y);
    };
    static multiply(a, b) {//multiply this vector by vec
        return new Vec(a.x * b.x, a.y * b.y);
    };
    static scalarMultiply(a, x) {//multiply scalars of vector a by x
        return new Vec(x*a.x, x*a.y);
    };
    static scalarDivide(a, x) {//multiply scalars of vector a by x
        return new Vec(a.x/x, a.y/x);
    };
    static invert(vec) {//use to reverse velocity
        return new Vec(-vec.x, -vec.y);
    };
    static normalize(v) {//normalizes this vector
        return Vec.scalarDivide(v, v.length());
    };
}
class Vrect {
    constructor(origin, size) {
        this.top = origin.y;
        this.bottom = origin.y+size.y;
        this.left = origin.x;
        this.right = origin.x+size.x;
        this.width = size.x;
        this.height = size.y;
        this.pos = new Vec(origin.x+(size.x/2),origin.y+(size.y/2));
    };
    setEdges(top,bottom,left,right) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    };
    move (vel) {
        this.top += vel.y;
        this.bottom += vel.y;
        this.left += vel.x;
        this.right += vel.x;
    };
    asString() {//returns sides as string
        return "top: " + this.top + ", bottom: " + this.bottom +
                " ,left: " + this.left + " ,right: " + this.right;
    };
    isColiding(target) {//check if this is colliding with target
        var result;
        if (this.top <= target.bottom && this.left <= target.right && 
                this.right >= target.left && this.bottom >= target.top)
        {
            result = true;
        } else
        {
            result = false;
        }
        return result;
    };
    isContained(target) {//check if this is contained inside target
        var result;
        if (this.top >= target.top && this.left >= target.left && 
                this.right <= target.right && this.bottom <= target.bottom)
        {
            result = true;
        } else
        {
            result = false;
        }
        return result;
    };
    static isColliding(rect, target) {//check if this is colliding with target
        var result;
        if (rect.top <= target.bottom && rect.left <= target.right && 
                rect.right >= target.left && rect.bottom >= target.top)
        {
            result = true;
        } else
        {
            result = false;
        }
        return result;
    };
    static isContained(rect, target) {//check if this is contained inside target
        var result;
        if (rect.top >= target.top && rect.left >= target.left && 
                rect.right <= target.right && rect.bottom <= target.bottom)
        {
            result = true;
        } else
        {
            result = false;
        }
        return result;
    };
    static vecContained(vec, target) {//check if vec is contained inside target
        var result;
        if (vec.y >= target.top && vec.x >= target.left && 
                vec.x <= target.right && vec.y <= target.bottom)
        {
            result = true;
        } else
        {
            result = false;
        }
        return result;
    };
}