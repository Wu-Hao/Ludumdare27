var BloodStream = cc.ParticleSystemQuad.extend({
    neck:null,
    init:function(r){
        if(r)
            this.right = true;
        return this.initWithTotalParticles(100);
    },
    initWithTotalParticles:function(n){
        if(this._super(n))
        {
            this._duration = cc.PARTICLE_DURATION_INFINITY;
            this._emitterMode = cc.PARTICLE_MODE_GRAVITY;
            this.modeA.gravity = cc.p(0,-500);
            // Gravity Mode:  radial
            this.modeA.radialAccel = 0;
            this.modeA.radialAccelVar = 0;

            //  Gravity Mode: speed of particles
            this.modeA.speed = 300;
            this.modeA.speedVar = 5;

            this._angle = 90;
            this._angleVar = 10;

            this._life = 1;
            this._lifeVar = 1;

            this._emissionRate = 120;

            // color of particles
            this._startColor.r = 1;
            this._startColor.g = 1;
            this._startColor.b = 1;
            this._startColor.a = 1.0;
            this._startColorVar.r = 0;
            this._startColorVar.g = 0;
            this._startColorVar.b = 0;
            this._startColorVar.a = 0;
            this._endColor.r = 1;
            this._endColor.g = 1;
            this._endColor.b = 1;
            this._endColor.a = 0;
            this._endColorVar.r = 0;
            this._endColorVar.g = 0;
            this._endColorVar.b = 0;
            this._endColorVar.a = 0;

            this._startSize = 5.0;
            this._startSizeVar = 5.0;
            this._endSize = 20;

                this.setTexture(cc.TextureCache.getInstance().addImage(s_blood));


            return true;
        }
        return null;
    }
});
BloodStream.create = function(r){
    var ret = new BloodStream;
    if (ret.init(r)) {
        return ret;
    }
    return null;
};