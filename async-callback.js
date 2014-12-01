function CallBack(cb){
    if (cb instanceof CallBack)
        return cb;
    if (! (this instanceof CallBack))
        return new CallBack(cb);
    this.reset(cb);
}

CallBack.prototype.reset = function(cb){
    this._cb = cb || {};
    this._err = null;
    this._accept = false;
    this._ref = 0;
    this.data = [];
    return this;
}

CallBack.prototype.inc = function(){
    this._ref ++;
}

CallBack.prototype.dec = function(){
    this._ref--;
    if (this._ref <= 0) {
        this._ref = 0;
        if (!this._accept){
            this._accept  = true;
            this._cb(null, this.data);
        }
    }
}

CallBack.prototype.hasError = function(){
    return this._error
}

CallBack.prototype.error = function(err){
    if (!this._accept) {
        this._error = err;
        this._accept = true;
        this._cb(err);
    }
}

CallBack.prototype.once = function(cb){
    var that = this;
    return function(err, data){
        if (that.hasError())
            return ;
        if (err) {
            return that.error(err, null);
        }
        cb(data);
    }
}

CallBack.prototype.each = function(arys, cb){
    this.inc();
    if (arys instanceof Object) {
        for(var i in arys) {
            this.inc();
            try {
                cb(arys[i], i);
            }catch (err){
                return this.error(err);
            }
        }
    } else if (arys instanceof Array) {
        this._ref += arys.length;
        for(var i= 0, l = arys.length; i<l; i++){
            try {
                cb(arys[i], i);
            }catch (err){
                return this.error(err);
            }
        }
    }
    this.dec();
}

CallBack.prototype.accept = function(data){
    this.data.push(data);
    this.dec();
}

CallBack.prototype.push = function(r){
    this.data.push(r);
}

module.exports = CallBack;