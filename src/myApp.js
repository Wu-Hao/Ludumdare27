/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var WALL_THICKNESS = 100;
var p_MapZOder  = {bg: 0, ui: 1, front: 100};         // game layer status
var count = 0;
var MENULAYER;
var frontLayer;
var goldScore = 0;
var timeScore = 0;
var aircCrash = 0;
var startTime;


var MenuLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        this._super();
        window.MENULAYER = this;
        var size = cc.Director.getInstance().getWinSize();
        this.musicEngine = cc.AudioEngine.getInstance();

        var backPic = cc.Sprite.create(b_background);
        backPic.setAnchorPoint(cc.p(0,0));
        this.addChild(backPic, p_MapZOder.bg);

        var titlePic = cc.Sprite.create(s_title);
        titlePic.setPosition(cc.p(300,700));
        this.addChild(titlePic, 1);

        //create startBtn
        var start     = cc.Sprite.create(m_start);
        var startPush = cc.Sprite.create(m_startPush);
        this.startBtn = cc.MenuItemSprite.create(start, startPush, this.startGame, this);
        this.startBtn.setPosition(cc.p(0,100));

        //create setBtn
        var options     = cc.Sprite.create(m_options);
        var optionsPush = cc.Sprite.create(m_optionsPush);
        this.optionsBtn = cc.MenuItemSprite.create(options, optionsPush, this.optionsSet, this);
        this.optionsBtn.setPosition(cc.p(0,0));

        //create topBtn
        var leaderBoards     = cc.Sprite.create(m_leaderBoards);
        var leaderBoardsPush = cc.Sprite.create(m_leaderBoardsPush);
        this.leaderBoardsBtn = cc.MenuItemSprite.create(leaderBoards, leaderBoardsPush, this.leaderBoardView, this);
        this.leaderBoardsBtn.setPosition(cc.p(0,-100));

        var infoMenu = cc.Menu.create(this.startBtn, this.optionsBtn, this.leaderBoardsBtn);
        this.addChild(infoMenu, p_MapZOder.front);

        this.grossiLayer = new Grossini(cc.p(300, 700), 200);
        this.grossiLayer.spawn(this);

        this.floor = space.addShape(new cp.SegmentShape(space.staticBody, cp.v(0, 0 - WALL_THICKNESS), cp.v(size.width, 0 - WALL_THICKNESS), WALL_THICKNESS));
       space.addShape(new cp.SegmentShape(space.staticBody, cp.v(0 - WALL_THICKNESS, size.height), cp.v(0 - WALL_THICKNESS, 0), WALL_THICKNESS));
       space.addShape(new cp.SegmentShape(space.staticBody, cp.v(size.width + WALL_THICKNESS, size.height), cp.v(size.width + WALL_THICKNESS, 0), WALL_THICKNESS));

        this.floor.setElasticity(1);
        this.floor.setFriction(0.5);
        this.scheduleUpdate();
    },
    update:function(){
        count++;
        space.step(0.016);
        if(this.grossiLayer)
            this.grossiLayer.update();
    },

    startGame :function(){
        resetSpace();
        this.musicEngine.playEffect(v_buttonPush);
        var startScene        = new gameScene();
        var stageTransition = cc.TransitionFade.create(0.5, startScene, cc.c3b(255, 255, 255));
        cc.Director.getInstance().replaceScene(stageTransition);
    },

    optionsSet:function(){
        this.musicEngine.playEffect(v_buttonPush);
        resetSpace();
        var scene = new cc.Scene.create();
        scene.addChild(new OptionsLayer);
        var optionsTransition = cc.TransitionMoveInR.create(0.5,scene);
        cc.Director.getInstance().replaceScene(optionsTransition);
    },

    leaderBoardView:function(){
        this.musicEngine.playEffect(v_buttonPush);
        resetSpace();
        var scene = new cc.Scene.create();
        scene.addChild(new ScoreLayer);
        var optionsTransition = cc.TransitionMoveInR.create(0.5,scene);
        cc.Director.getInstance().replaceScene(optionsTransition);
    }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});

var gameScene = cc.Scene.extend({

     bodyPosition: null,

    onEnter:function(){
        this._super();
        startTime = new Date();
        this.backLayer = new BackGroundLayer();
        this.addChild(this.backLayer,0);

        this.mainLayer = new MainBuildingLayer();
        this.mainLayer.init();
        this.addChild(this.mainLayer, 2);

        frontLayer = new FrontLayer();
        frontLayer.init();
        this.addChild(frontLayer, 3);

        this.scheduleUpdate();
    },
    update:function(){
        this.backLayer.move(this.mainLayer.getPosition().y);
        this.bodyPosition = this.mainLayer.getGrossiLayer().getPosition().y;
        frontLayer.setHeadMiniPosition(313 + this.bodyPosition/JUMPHEIGHT * 375);
        space.step(0.016);
    }
});

sendScore = function(name, money, headG, bodyG, aircon, time){
    var url = "http://tailorgadget.com/ludumdare/index.php";
    var params = "name="+name+"&money="+money+"&headG="+headG+"&bodyG="+bodyG+"&aircon="+aircon+"&time="+time;
    var http = new XMLHttpRequest();
    http.open("POST", url, true);

//Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //http.setRequestHeader("Content-length", params.length);
    //http.setRequestHeader("Connection", "close");

    http.onreadystatechange = function(a) {//Call a function when the state changes.
/*        console.log(a);
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }*/
    };
    http.send(params);
};

var SCORE={
    MONEY:1,
    HEADG:2,
    BODYG:3,
    AIRCON:4,
    TIME:5
};

getScoresFor = function(type){
    var url = "http://tailorgadget.com/ludumdare/index.php";
    var params = "type="+type;
    var http = new XMLHttpRequest();
    http.open("POST", url, false);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.send(params);

    return http.responseText;
};