var BackBuilding = cc.Sprite.extend({
    ctor:function(width, height, distance){
        this._super();
        this.init(b_backbuilding);
        this.distance = distance;
        this.initialY = distance;
        this.setScale(width+(1-(distance/800)), height+(1-(distance/800)));
    }
});
var BackGroundLayer = cc.Layer.extend({

    backPic: null,
    moveTotal: 200,
    buildings:null,
    backBuildsBatch:null,

    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        this._super();

        this.backPic = cc.Sprite.create(b_background);
        this.backPic.setAnchorPoint(cc.p(0,0));
        this.backPic.setPosition(0,-this.moveTotal);
        this.addChild(this.backPic, p_MapZOder.bg);

        this.buildings = [];
        this.backBuildsBatch = cc.SpriteBatchNode.create(b_backbuilding);
        this.addChild(this.backBuildsBatch);

        for(var i=0; i < 20; i++)
        {
            this.addBuildings();
        }
    },
    move:function(offset)
    {
        var perc = 1-(-offset/JUMPHEIGHT);
        this.setPosition(0, (this.moveTotal * perc));
        var build;
        var pos;
        for(var i=0; i < this.buildings.length; i++)
        {
            build = this.buildings[i];
            pos = build.getPosition();
            build.setPosition(pos.x, -build.initialY+perc*((800-build.distance)/800)*this.moveTotal);
        }
    },
    addBuildings:function(){
        var dist = Math.random()*800;
        var build = new BackBuilding(Math.random()*0.5, Math.random()*0.5, dist);
        build.setPosition(Math.random()*600, -dist);
        this.buildings.push(build);
        this.backBuildsBatch.addChild(build);
    }
});

var FrontLayer = cc.Layer.extend({

    init:function(){
        this._super();

        var scroll = new cc.Sprite.create(s_scroll);
        scroll.setPosition(cc.p(580,700));
        this.addChild(scroll);
    }
});