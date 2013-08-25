var MainBuildingLayer = cc.Layer.extend({
    batchLevels:null,
    speed:0,
    accel:490,
    building:null,
    obstaclesLayer:null,
    airConds:[],
    bOnLeft:0,
    keyEffectID:null,
    keyLeft:null,
    keyRight:null,

    ctor:function(){
        this._super();
        //this.init();
    },
    init:function(){
        this._super();

        var size = cc.Director.getInstance().getWinSize();
        SPCAE_WALL = (BK_WIDTH - size.width)/2;
        this.floor = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(0, 0 - WALL_THICKNESS), cp.v(RIGHT_WALL_POS, 0 - WALL_THICKNESS), WALL_THICKNESS));
        this.leftWall = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(-WALL_THICKNESS, JUMPHEIGHT), cp.v(-WALL_THICKNESS, 0), WALL_THICKNESS));
        this.rightWall = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(RIGHT_WALL_POS + WALL_THICKNESS, JUMPHEIGHT), cp.v(RIGHT_WALL_POS + WALL_THICKNESS, 0), WALL_THICKNESS));
        this.floor.setElasticity(0.2);
        this.floor.setFriction(0.5);

        this.floor.setCollisionType(CT_FLOOR);

        var street = cc.Sprite.create(s_street);
        street.setPosition(-500, STREET_HEIGHT);
        street.setAnchorPoint(cc.p(0,1));
        this.addChild(street);

        street = cc.Sprite.create(s_street);
        street.setPosition(550, STREET_HEIGHT);
        street.setAnchorPoint(cc.p(0,1));
        this.addChild(street);

        this.building = cc.Layer.create();
        this.addChild(this.building);
        var batch = this.batchLevels = cc.SpriteBatchNode.create(s_levelT);
        this.building.addChild(batch);
        //air
        this.obstaclesLayer = cc.Layer.create();//cc.SpriteBatchNode.create(s_aircon);
        this.addChild(this.obstaclesLayer);
        //gold;
        var goldBatch = cc.SpriteBatchNode.create(s_gold);
        this.addChild(goldBatch);
        var airNum=0;
        var goldNum=0;
        for(var i = 0; i < BUILDING_NUM; i++)
        {
            var sprite = cc.Sprite.create(s_levelT);
            sprite.setAnchorPoint(cc.p(0, 0));
            batch.addChild(sprite);
            sprite.setPosition(300,i*BUILDING_H+STREET_HEIGHT);

            //add AirConditoin and gold
            if(i<BUILDING_NUM-10 && i>9)
            {
                airNum = getAirRandom();
                if(airNum>0){
                    //console.log("will get arr", airNum);
                    var arr = getArrPos(airNum);
                    for(var j=0; j<airNum; j++){
                        var airCond = new AirConditoin(cc.p(getRandAirPos()+posAirCond.x+posAirCond.w*arr[j], i*BUILDING_H+STREET_HEIGHT+posAirCond.y), this.floor);
                        airCond.spawn(this.obstaclesLayer);
                        this.airConds.push(airCond);
                    }
                }

                //
                goldNum = getGoldRandom();
                var goldCoin;
                if(goldNum > 0){
                    for(var j=0; j<goldNum; j++){
                        goldCoin = new GoldCoin(cc.p(getGoldPos().x, getGoldPos().y+i*BUILDING_H), this.floor);
                        //goldCoin = cc.Sprite.create(s_gold);
                        //goldCoin.setPosition(cc.p(getGoldPos().x, getGoldPos().y+i*BUILDING_H));
                        //goldBatch.addChild(goldCoin);
                        goldCoin.spawn(goldBatch);
                    }
                }
            }

        }

        this.scheduleUpdate();
        this.building.setPositionX(-POS_CENTERY_X);

        this.grossiLayer = new Grossini(cc.p(500, JUMPHEIGHT));
        this.grossiLayer.spawn(this);
        this.grossiLayer.randImpluse();
        //this.setPosition(cc.p(0, 500));

        this.setPosition(cc.p(0, POS_CENTERY));
        //var debug = cc.PhysicsDebugNode.create(space);
        //this.addChild(debug);

        this.musicEngine = cc.AudioEngine.getInstance();

        //addkey event
        this.setKeyboardEnabled(true);
        this.tickCount = 0;
        this.bTickUmbrella = true;
        UMBRELLA_INDEX = 0;
        arrUmbrellas = [];

        //
        BUILDING_LAYER = this;
    },
    onKeyDown:function(key){
        if(!this.keyLeft && cc.KEY.left == key){
            this.keyLeft = true;
            this.bOnLeft += KEY_LEFT;
        }
        else if(!this.keyRight && cc.KEY.right == key){
            this.keyRight = true;
            this.bOnLeft += KEY_RIGHT;
        }
        /*if(this.keyEffectID == null){
            this.keyEffectID = this.musicEngine.playEffect(v_press,true);
            console.log('play effect:'+this.keyEffectID);
        }*/
    },
    onKeyUp:function(key){
        if(cc.KEY.left == key){
            this.bOnLeft -= KEY_LEFT;
            this.keyLeft = false;
        }
        else  if(cc.KEY.right == key){
            this.bOnLeft -= KEY_RIGHT;
            this.keyRight = false;
        }

        /*if(this.keyEffectID && !this.keyRight && !this.keyLeft){
            this.musicEngine.stopEffect(this.keyEffectID);
            console.log('stop effect:'+this.keyEffectID);
            this.keyEffectID = null;
        }*/
    },
    setKeyState:function(bclick){
        this.setKeyboardEnabled(bclick);
        this.bOnLeft = 0;
        if(!bclick){
            //this.unscheduleUpdate();
            this.bTickUmbrella = false;
        }
    },
    addUmbrellaHelp:function(pos, shape){
        //var umb = new UmbrellaHelp(pos, shape);
        //umb.spawn(this);
        var obj = {};
        obj.pos = pos;
        obj.shape = shape;
        arrUmbrellaHelp.push(obj);
    },
    update:function(){
//        var dt=0.016;
//        this.speed += this.accel*dt;
//        var newY = this.getPosition().y+this.speed*dt;
//        if(newY < 0)
//            this.setPosition(0, newY);
        var y = this.grossiLayer.getPosition().y;
        //console.log("grossini posy: ", y);
        this.setPositionY(POS_CENTERY-y);
        var x = this.grossiLayer.getPosition().x;
        this.setPositionX(POS_CENTERY_X-x);

        if(this.grossiLayer)
            this.grossiLayer.update();

        if(this.airConds){
            for(var i=0; i<this.airConds.length; i++){
                this.airConds[i].update(0.016);
            }
        }

        //key control
        if(this.bOnLeft != 0){
            this.grossiLayer.moveImpluse(this.bOnLeft);
        }

        this.tickCount ++;
        if(this.bTickUmbrella)
            tickUmbrella(this);
        if(arrUmbrellas.length)
        {
            for(var i = arrUmbrellas.length-1; i >=0; i--)
            {
                var um = arrUmbrellas[i];
                space.removeShape(um.body.shape);
                space.removeBody(um.body.body);
                um.body.removeFromParent(true);
            }
            arrUmbrellas = [];
        }

        if(arrGoldCoin.length)
        {
            for(var i = arrGoldCoin.length-1; i >=0; i--)
            {
                var um = arrGoldCoin[i];
                space.removeShape(um.body.shape);
                space.removeBody(um.body.body);
                um.body.removeFromParent(true);
            }
            arrGoldCoin = [];
        }

        if(arrUmbrellaHelp.length){
            //console.log(arrUmbrellaHelp);
            for(var i=0; i<arrUmbrellaHelp.length; i++){
                //console.log(arrUmbrellaHelp[i]);
                if(!this.grossiLayer.hasUmbrella)
                {
                    var umb = new UmbrellaHelp(arrUmbrellaHelp[i].pos, arrUmbrellaHelp[i].shape);
                    umb.spawn(this);
                    //this.grossiLayer.hasUmbrella = true;
                }
            }
            arrUmbrellaHelp = [];
        }

        if(y<150){
            endGame();
        }
    },

    getGrossiLayer:function(){

        return this.grossiLayer;
    }
});

var endGame = function(){
    space.endTime = Date.now();
    var totalTime = (space.endTime - space.startTime)/1000;
    console.log("time till body touch ground is ", totalTime);
    var finalMenu = cc.Sprite.create(b_menu);

    var sequenceInit = cc.Sequence.create(cc.CallFunc.create(function(){

        if(maiMenuFlag ==false){
            frontLayer.timeLabel.setVisible(false);
            this.musicEngine = cc.AudioEngine.getInstance();
            this.musicEngine.playEffect(v_hitFloor);
            BUILDING_LAYER.setKeyState(false);
        }
    }),cc.DelayTime.create(4)
        ,cc.CallFunc.create(function(){

            if(maiMenuFlag ==false){

                var goldLabel = cc.LabelTTF.create("$$$$ : "+goldScore, "Arial", 20);
                goldLabel.setColor(cc.yellow());

                var timeScoreLabel = cc.LabelTTF.create("Time : "+ totalTime + "S", "Arial", 20);
                timeScoreLabel.setColor(cc.yellow());

                var headGScoreLabel = cc.LabelTTF.create("HeadG : "+ (0|space.max_head_g) , "Arial", 20);
                headGScoreLabel.setColor(cc.yellow());

                var bodyGScoreLabel = cc.LabelTTF.create("BodyG : "+ (0|space.max_body_g) , "Arial", 20);
                bodyGScoreLabel.setColor(cc.yellow());

                var aircCrashLabel = cc.LabelTTF.create("AirCons : "+ aircCrash , "Arial", 20);
                aircCrashLabel.setColor(cc.yellow());

                var finalMenu = cc.Sprite.create(b_menu);
                frontLayer.addChild(finalMenu);
                finalMenu.setPosition(cc.p(300, 400))
                finalMenu.setOpacity(205);

                goldLabel.setPosition(cc.p(300, 550));
                frontLayer.addChild(goldLabel);

                timeScoreLabel.setPosition(cc.p(300, 520));
                frontLayer.addChild(timeScoreLabel);

                headGScoreLabel.setPosition(cc.p(300, 490));
                frontLayer.addChild(headGScoreLabel);

                bodyGScoreLabel.setPosition(cc.p(300, 460));
                frontLayer.addChild(bodyGScoreLabel);

                aircCrashLabel.setPosition(cc.p(300, 430));
                frontLayer.addChild(aircCrashLabel);


                var submit = cc.Sprite.create(m_submit);
                var submitPush = cc.Sprite.create(m_submitPush);
                var submitBtn = cc.MenuItemSprite.create(submit, submitPush, submitScore, this);
                submit.setOpacity(200);
                submitPush.setOpacity(200);

                var submitMenu = cc.Menu.create(submitBtn);
                submitMenu.setAnchorPoint(cc.p(0,0));
                submitMenu.setPosition(cc.p(300,350));
                frontLayer.addChild(submitMenu, 5);

                var titlePic = cc.Sprite.create(s_title);
                titlePic.setPosition(cc.p(300,700));
                frontLayer.addChild(titlePic, 1);
                maiMenuFlag = true;
            }

        },this));
    frontLayer.runAction(sequenceInit);
}

var arrUmbrellaHelp=[];
var TIMER_UMBRELLA = 60;
var tickUmbrella = function(layer){
    if(layer.tickCount%TIMER_UMBRELLA == 0 && layer.bTickUmbrella){
        var pos = getUmbPos(layer);
        if(pos.y>0)
        {
            var newUmb = new Umbrella(pos);
            newUmb.spawn(layer);
        }
    }
};
var getUmbPos = function(layer){
    var y = layer.getGrossiLayer().getPosition().y;
    y -= 800;
    //console.log("umb get pos y:", y, cc.Director.getInstance().getVisibleSize());
    var x = cc.RANDOM_0_1() * cc.Director.getInstance().getVisibleSize().width;
    //console.log("x: ", x);

    return cc.p(x,y);
};

var BUILDING_LAYER;
var KEY_LEFT = -1;
var KEY_RIGHT = 1;

var getRandAirPos = function(){
    var air = cc.RANDOM_0_1()*posAirCond.w;
    air = -air;
    //console.log("air pos: ", air);
    return air;
};
var getAirRandom = function(){
    var num;
    var rand = getRandom(100);
    if(rand<50){
        num = 0;
    }
    else if(rand<75){
        num = 1;
    }
    else if(rand<90){
        num = 2;
    }
    else{
        num = 3;
    }
    return num;
};
var getGoldRandom = function(){
    var num = 0| (cc.RANDOM_0_1() * 5);
    return num;
};
var getGoldPos = function(){
    var x = cc.RANDOM_0_1()*BK_WIDTH;
    var y = cc.RANDOM_0_1()*BUILDING_H;
    return cc.p(x,y);
}

var getArrPos = function(num){
    var arr=[];
    while(num){
        var rand = getRandom(3);
        while(isInArr(rand, arr)){
            rand = getRandom(3);
        }
        arr.push(rand);
        num --;
    }
//    console.log("air arr:", arr);
    return arr;
};
var isInArr = function(num, arr){
    if(num==null || arr == null || arr.length == 0)
    {
        return false;
    }
    for(var i=0; i<arr.length; i++){
        if(arr[i] == num){
            return true;
        }
    }
    return false;
};

var POS_CENTERY = 550;
var POS_CENTERY_X = 300;
var BUILDING_H = 200;
var JUMPHEIGHT = 18800;
var BUILDING_NUM = JUMPHEIGHT/BUILDING_H;
var STREET_HEIGHT = 50;
var RIGHT_WALL_POS = 1000;
var BK_WIDTH = 1050;

var posAirCond = {x:267,y:40,w:262};