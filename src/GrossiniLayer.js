/**
 * Created with JetBrains WebStorm.
 * User: cocos
 * Date: 13-8-24
 * Time: 下午4:43
 * To change this template use File | Settings | File Templates.
 */

var heads = [];
var GROSSINI_NUM=1;
var SLIP = 0.3;
var Friction = 0.8;

var NECK_HEAD = 0;
var BODY_NECK = 1;
var LEFT_ARM = 2;
var RIGHT_ARM = 3;
var LEFT_LEG = 4;
var RIGHT_LEG = 5;

var ARR_GROSS_PART = [];

var HEAD_POLIES = [0,17,  13,12,  17,0,  17,-12,  8,-20,  -5,-20,  -14,-11, -12,12];
var R_LEG_POLIES = [3,17,  8,-13,  6,-17,  -8,-13,  -8,14];
var L_LEG_POLIES = [8,17,  8,-13,  -6,-17,  -8,-13,  -3,17];

var MOVEMENT = 300;

var Grossini = cc.Class.extend({
    headFallOff:0,
    ctor:function(pos, headFallOff){
        this.headFallOff = headFallOff || 16000;
        if(GROSSINI_NUM<10)
        {
            var ran = heads[Grossini.num-1];
        }
        else{
            var ran = (0|(Math.random()*heads.length));
        }
        this.head = new CPSprite();
        this.head.ctorPolies(p_head,cc.pAdd(pos, cc.p(0, 38.5)), 10, HEAD_POLIES, SLIP, Friction);
        this.head.body.id = "head";
        this.neck = new CPSprite();
        this.neck.ctorBox(p_neck, cc.pAdd(pos, cc.p(0, 15)), 2, SLIP, Friction);
        this.neck.body.id = "neck";
        this.leftArm = new CPSprite();
        this.leftArm.ctorBox(p_arm, cc.pAdd(pos,cc.p(-21.87,11)), 4, SLIP, Friction);
        this.rightArm = new CPSprite();
        this.rightArm.ctorBox(p_arm, cc.pAdd(pos,cc.p(21.87,11)), 4, SLIP,Friction);
        this.body = new CPSprite();
        this.body.ctorBox(p_body, pos, 20, SLIP, Friction);
        this.body.body.id = "body";
        this.leftLeg = new CPSprite();
        this.leftLeg.ctorPolies(p_leg, cc.pAdd(pos,cc.p(7,-26)), 10, R_LEG_POLIES, SLIP, Friction);
        this.rightLeg = new CPSprite();
        this.rightLeg.ctorPolies(p_leg, cc.pAdd(pos,cc.p(-7,-26)), 10, L_LEG_POLIES,  SLIP, Friction);
        this.rightLeg.setFlipX(true);

        ARR_GROSS_PART.push(this.head, this.leftArm, this.rightArm, this.leftLeg, this.rightLeg);

        this.head.shape.group = GROSSINI_NUM;
        this.neck.shape.group = GROSSINI_NUM;
        this.leftArm.shape.group = GROSSINI_NUM;
        this.rightArm.shape.group = GROSSINI_NUM;
        this.body.shape.group = GROSSINI_NUM;
        this.leftLeg.shape.group = GROSSINI_NUM;
        this.rightLeg.shape.group = GROSSINI_NUM;

        this.head.shape.setCollisionType(CT_BODYPARTS);
        this.neck.shape.setCollisionType(CT_BODYPARTS);
        this.leftArm.shape.setCollisionType(CT_BODYPARTS);
        this.rightArm.shape.setCollisionType(CT_BODYPARTS);
        this.body.shape.setCollisionType(CT_BODY);
        this.leftLeg.shape.setCollisionType(CT_BODYPARTS);
        this.rightLeg.shape.setCollisionType(CT_BODYPARTS);


        this.leftArm.setRotation(90);
        this.leftArm.body.setAngle(cc.DEGREES_TO_RADIANS(-180));

        this.rightArm.setRotation(0);
        this.rightArm.body.setAngle(cc.DEGREES_TO_RADIANS(0));

        this.arrJoints = [];
        //add joints
        this.arrJoints[NECK_HEAD] = [];
        this.arrJoints[NECK_HEAD][0] = space.addConstraint(new cp.PivotJoint(this.neck.body, this.head.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(0.0, 23.0))));
        this.arrJoints[NECK_HEAD][1] = space.addConstraint(new cp.DampedRotarySpring(this.neck.body, this.head.body, 0, 1000000, 100));

        this.arrJoints[BODY_NECK] = [];
        this.arrJoints[BODY_NECK][0] = space.addConstraint(new cp.PivotJoint(this.body.body, this.neck.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(0.0, 23.0))));
        this.arrJoints[BODY_NECK][1] = space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.neck.body, cc.DEGREES_TO_RADIANS(-5), cc.DEGREES_TO_RADIANS(5)));

        this.arrJoints[LEFT_ARM] = [];
        this.arrJoints[LEFT_ARM][0] = space.addConstraint(new cp.PivotJoint(this.body.body, this.leftArm.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-8.5,11))));
        //this.arrJoints[LEFT_ARM][1] = space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.leftArm.body, cc.DEGREES_TO_RADIANS(-180), cc.DEGREES_TO_RADIANS(20)));

        this.arrJoints[RIGHT_ARM] = [];
        this.arrJoints[RIGHT_ARM][0] = space.addConstraint(new cp.PivotJoint(this.body.body, this.rightArm.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(8.5,11))));
        //this.arrJoints[RIGHT_ARM][1] = space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.rightArm.body, cc.DEGREES_TO_RADIANS(-180), cc.DEGREES_TO_RADIANS(180)));

        this.arrJoints[LEFT_LEG] = [];
        this.arrJoints[LEFT_LEG][0] = space.addConstraint(new cp.PivotJoint(this.body.body, this.leftLeg.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(6.5,-16))));
        this.arrJoints[LEFT_LEG][1] = space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.leftLeg.body, cc.DEGREES_TO_RADIANS(-20), cc.DEGREES_TO_RADIANS(70)));
        //this.arrJoints[LEFT_LEG][2] = space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.leftLeg.body, cc.DEGREES_TO_RADIANS(13), 500000, 10));

        this.arrJoints[RIGHT_LEG] = [];
        this.arrJoints[RIGHT_LEG][0] = space.addConstraint(new cp.PivotJoint(this.body.body, this.rightLeg.body, cp.v.add(cp.v(pos.x,pos.y),cp.v(-6.5,-16))));
        this.arrJoints[RIGHT_LEG][1] = space.addConstraint(new cp.RotaryLimitJoint(this.body.body, this.rightLeg.body, cc.DEGREES_TO_RADIANS(-70), cc.DEGREES_TO_RADIANS(20)));
        //this.arrJoints[RIGHT_LEG][2] = space.addConstraint(new cp.DampedRotarySpring(this.body.body, this.rightLeg.body, cc.DEGREES_TO_RADIANS(-13), 500000, 10));

        GROSSINI_NUM++;
        this.hasUmbrella = false;
        //console.log(GROSSINI_NUM);


        this.head_total_impulse = 0;
        this.head_max_impulse = 0;
    },
    spawn:function(layer){
        //spawn at this location
        layer.addChild(this.leftLeg);
        layer.addChild(this.rightLeg);
        layer.addChild(this.neck);
        layer.addChild(this.body);
        layer.addChild(this.head);
        layer.addChild(this.leftArm);
        layer.addChild(this.rightArm);
    },
    removeConstraintWithForce:function(part, force){
        if(this.arrJoints[part][0] && this.arrJoints[part][0].getImpulse() > force)
        {
            for(var j=0; j<this.arrJoints[part].length; j++){
                if(!this.arrJoints[part][j].a.id)
                {
                    this.arrJoints[part][j].a.shape.group = 0;
                    this.arrJoints[part][j].a.shape.setCollisionType(CT_DEADPARTS);
                }
                else if(!this.arrJoints[part][j].b.id)
                {
                    this.arrJoints[part][j].b.shape.group = 0;
                    this.arrJoints[part][j].b.shape.setCollisionType(CT_DEADPARTS);
                }
                space.removeConstraint(this.arrJoints[part][j]);
                this.endTime = Date.now();
            }
            this.arrJoints[part][0] = null;
        }
    },
    removeHeadWithForce:function(force){

        var part = NECK_HEAD;
        if(this.arrJoints[part][0] && this.arrJoints[part][0].getImpulse() > force)
        {
            for(var j=0; j<this.arrJoints[part].length; j++){
                if(!this.arrJoints[part][j].a.id)
                {
                    this.arrJoints[part][j].a.shape.group = 0;
                    this.arrJoints[part][j].a.shape.setCollisionType(CT_DEADPARTS);
                }
                else if(!this.arrJoints[part][j].b.id)
                {
                    this.arrJoints[part][j].b.shape.group = 0;
                    this.arrJoints[part][j].b.shape.setCollisionType(CT_DEADPARTS);
                }
                space.removeConstraint(this.arrJoints[part][j]);

                this.endTime = Date.now();
            }
            if(BUILDING_LAYER || MENULAYER)
            {
                if(sys.localStorage.getItem(OptionsKeys.Blood) == 'true'){
                    var musicEngine = cc.AudioEngine.getInstance();
                    musicEngine.playEffect(v_blood);

                    var lyer = BUILDING_LAYER || MENULAYER;
                    this.neckParticle = BloodStream.create();
                    this.neckParticle.neck = this.neck;
                    //this.neck.addChild(this.neckParticle);
                    lyer.addChild(this.neckParticle,999999);
                    this.bloodStartTime = Date.now();
                }
            }
            this.arrJoints[part][0] = null;
        }
    },
    update:function(dt){
        if(this.neckParticle)
        {
            var rect = this.neck.getBoundingBox();
            this.neckParticle.setPosition(rect.x + rect.width/2, rect.y + rect.height/2);
            this.neckParticle.setAngle(-this.neck.getRotation()+90);
            if(Date.now() - this.bloodStartTime > 3500)
            {
                this.neckParticle.setEmissionRate(0);
                //this.neckParticle = null;
            }
        }
        if(!this.startTime)
        {
            this.startTime = Date.now();
        }
        this.removeHeadWithForce(this.headFallOff);
        this.removeConstraintWithForce(LEFT_ARM, 10000);
        this.removeConstraintWithForce(RIGHT_ARM, 10000);
        this.removeConstraintWithForce(LEFT_LEG, 22000);
        this.removeConstraintWithForce(RIGHT_LEG, 22000);

        if(this.endTime && !this.printedEndTime)
        {
            console.log("jump took :", (this.endTime - this.startTime)/1000, " seconds");
            this.printedEndTime = true;
        }
    },
    getPosition:function(){
        return this.body.getPosition();
    },
    randImpluse:function(){
        var part = getRand(ARR_GROSS_PART.length);
        //ARR_GROSS_PART[part].applyImpulse();
        this.body.applyImpulse();
    },
    moveImpluse:function(right){
        this.body.moveImpluse(right);
    }
});

//air-condition
var AirConditoin = cc.Class.extend({
    pos:null,
    arrJoins:null,
    ctor:function(pos, floor){
        this.body = new CPSprite();
        this.body.ctorBox(s_aircon, pos, 15, SLIP, Friction);
        //this.body.setPosition(pos);
        this.pos = pos;
        //this.arrJoin;
        var left = 30;
        this.body.shape.setCollisionType(CT_AIRCON);
        this.arrJoin = space.addConstraint(new cp.PivotJoint(this.body.body, floor.body, cp.v.add(cp.v(this.pos.x,this.pos.y),cp.v(-left,-16))));
        this.arrJoin2 = space.addConstraint(new cp.PivotJoint(this.body.body, floor.body, cp.v.add(cp.v(this.pos.x,this.pos.y),cp.v(left,-16))));

        this.body.shape.sprite = this;

    },
    spawn:function(layer){
        layer.addChild(this.body);
    },
    update:function(dt){

        var flag = false;

        if(this.arrJoin && this.arrJoin.getImpulse() > 7000){
            //console.log("air conditoin. 1", this.arrJoins[i].getImpulse());
            //this.arrJoints[i].a.shape.group = 0;
            space.removeConstraint(this.arrJoin);
            this.arrJoin = null;
            //console.log(this.arrJoins[i].getImpulse(), "aircon");
            aircCrash++;
            flag=true;
        }

        if(this.arrJoin2 && this.arrJoin2.getImpulse() > 7000){
            //console.log("air conditoin. 1", this.arrJoins[i].getImpulse());
            //this.arrJoints[i].a.shape.group = 0;
            space.removeConstraint(this.arrJoin2);
            this.arrJoin2 = null;
            if(flag==false){

                aircCrash++;
            }

            //console.log(this.arrJoins[i].getImpulse(), "aircon");
        }

    }
});

//umbrella
var arrUmbrellas = [];
var UMBRELLA_INDEX = 0;
var Umbrella = cc.Class.extend({
    ctor:function(pos){
        this.body = new CPSprite();
        this.body.ctorBox(s_umbrella, pos, 15, SLIP, Friction);
        this.pos = pos;
        this.body.id = "umbrella";
        this.body.shape.setCollisionType(CT_UMBRELLA);
        this.body.shape.sprite = this;

        this.isInScene = true;
        this.bRemove = false;
        //this.index = UMBRELLA_INDEX;

        //arrUmbrellas[UMBRELLA_INDEX] = this;
        //UMBRELLA_INDEX ++;
    },
    spawn:function(layer){
        layer.addChild(this.body);
    },
    removeSelf:function(){
        if(!isInArr(this,arrUmbrellas))
        {
            arrUmbrellas.push(this);
        }
    },
    randImpluse:function(){
        this.body.applyImpulse();
    }
});

var UmbrellaHelp = cc.Class.extend({
    ctor:function(pos, shape){
        this.body = new CPSprite();
        this.body.ctorBox(s_umbrella, pos, 3, SLIP, Friction);
        this.pos = pos;
        this.body.id = "umbrellahelp";
        this.body.shape.setCollisionType(CT_UMBRELLA_HELP);
        this.body.shape.group = GROSSINI_NUM;

        space.addConstraint(new cp.PivotJoint(this.body.body, shape.body, cp.v.add(cp.v(this.pos.x,this.pos.y),cp.v(-2,-16))));

        this.body.body.applyForce(cp.v(pos.x, pos.y+5), cp.v(0,20));
    },
    spawn:function(layer){
        layer.addChild(this.body);
        //console.log("add help.------");
    },
    removeSelf:function(){
        if(!isInArr(this,arrUmbrellas))
        {
            arrUmbrellas.push(this);
        }
    }
});

var arrGoldCoin = [];
var GoldCoin = cc.Class.extend({
    ctor:function(pos, floor){
        this.body = new CPSprite();
        this.body.retain();
        this.body.ctorBox(s_gold, pos, 15, SLIP, Friction);
        this.body.setPosition(pos);
        this.pos = pos;
        this.body.id = "gold";

        this.body.shape.setCollisionType(CT_GOLD);
        this.body.shape.sprite = this;
        this.body.shape.setSensor( true )
        var left = 12;
        space.addConstraint(new cp.PivotJoint(this.body.body, floor.body, cp.v.add(cp.v(this.pos.x,this.pos.y),cp.v(-left,-16))));
        space.addConstraint(new cp.PivotJoint(this.body.body, floor.body, cp.v.add(cp.v(this.pos.x,this.pos.y),cp.v(left,-16))));

    },

    removeSelf:function(){
        if(!isInArr(this,arrGoldCoin))
        {
            arrGoldCoin.push(this);
        }
    },

    spawn:function(layer){
        layer.addChild(this.body);
    }
});

var CPSprite = cc.Sprite.extend({
    ctor:function(){
        this._super();

    },
    ctorBox:function(filename, pos, mass, elasticity, fric){
        this.initWithFile(filename);
        mass = mass || 5;
        var body = space.addBody(new cp.Body(mass, cp.momentForBox(mass, this.getContentSize().width, this.getContentSize().height)));
        body.setPos(pos);
        var shape = space.addShape(new cp.BoxShape(body, this.getContentSize().width, this.getContentSize().height));
        shape.setElasticity(elasticity || 0);
        shape.setFriction(fric || 0);
        this.body = body;
        this.shape = shape;
        this.body.shape = shape;
    },
    ctorPolies:function(filename, pos, mass, polies, elasticity, fric){
        this.initWithFile(filename);
        mass = mass || 5;
        var body = space.addBody(new cp.Body(mass, cp.momentForPoly(mass, polies, cp.v(0,0))));
        body.setPos(pos);
        var shape = space.addShape(new cp.PolyShape(body, polies, cp.v(0,0)));
        shape.setElasticity(elasticity || 0);
        shape.setFriction(fric || 0);
        this.body = body;
        this.shape = shape;
        this.body.shape = shape;
    },
    visit:function(){
        if(this.body)
        {
            var pos = this.body.p;
            this.setPosition(pos.x, pos.y);
            this.setRotation(cc.RADIANS_TO_DEGREES(-1*this.body.a));
        }
        else{
            console.log('no body?');
        }
        this._super();
    },
    getPosition:function(){
        return this.body.getPos();
    },
    applyImpulse:function(){
        //this.body.applyImpulse(cp.v(0,9000), cp.v(10,10));
        var part = getRand(29);
        //console.log("part:", part);
        this.body.setAngVel(part);
    },
    moveImpluse:function(right){
        //console.log("right: ", right);
        this.body.applyImpulse(cp.v(MOVEMENT*right,0), cp.v(0,0));
    }
});

var getRand = function(n){
    var rand = getRandom(n);
    if(rand<n/2)
        rand+=n/2;
    rand = 0|rand;
    return rand;
};
var getRandom = function(n){
    return 0|(cc.RANDOM_0_1() * n);
}
