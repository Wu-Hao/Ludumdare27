/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 13-8-25
 * Time: PM2:33
 * To change this template use File | Settings | File Templates.
 */

var FrontLayer = cc.Layer.extend({

    headMini: null,
    timeLabel:null,
    submitBtn:null,

    init:function(){

        this._super();

        var scroll = new cc.Sprite.create(s_scroll);
        scroll.setPosition(cc.p(580,700));
        this.addChild(scroll);

        this.headMini = new cc.Sprite.create(p_head);
        this.headMini.setScale(0.5);
        this.headMini.setPosition(cc.p(575,690));
        this.addChild(this.headMini);

        this.timeLabel = cc.LabelTTF.create(timeScore+"s", "Arial", 40);
        this.timeLabel.setColor(cc.blue());
        this.timeLabel.setPosition(cc.p(70,50));
        this.addChild(this.timeLabel, 5);

/*        var submit = cc.Sprite.create(m_submit);
        var submitPush = cc.Sprite.create(m_submitPush);
        this.submitBtn = cc.MenuItemSprite.create(submit, submitPush, submitScore, this);
        submit.setOpacity(200);
        submitPush.setOpacity(200);
        this.submitBtn.setPosition(cc.p(0,-150));
        this.submitBtn.setVisible(false);*/


        var mainMenu = cc.Sprite.create(m_MainMenu);
        var mainMenuPush = cc.Sprite.create(m_MainMenuPush);
        mainMenu.setOpacity(200);
        mainMenuPush.setOpacity(200);
        var mainMenuBtn = cc.MenuItemSprite.create(mainMenu, mainMenuPush, this.backToMainMenu, this);

        var retry = cc.Sprite.create(m_retry);
        var retryPush = cc.Sprite.create(m_retryPush);

        var retryBtn = cc.MenuItemSprite.create(retry, retryPush, this.retry, this);
        retryBtn.setPosition(cc.p(0, 50));
        retryBtn.setOpacity(200);


        var MainMenu = cc.Menu.create(mainMenuBtn, retryBtn);
        MainMenu.setPosition(cc.p(500,50));
        this.addChild(MainMenu, 5);

        //retryBtn.setVisible(false);
        //var subMenu = cc.Menu.create(this.submitBtn);
        //this.addChild(subMenu);
        this.scheduleUpdate();
    },

    retry:function(){
        resetSpace();
        cc.Director.getInstance().replaceScene(new gameScene());
    },

    setHeadMiniPosition:function(positionY){

        this.headMini.setPositionY(positionY);
    },

    update:function(){

        if(maiMenuFlag ==false){

            var nowTime = new Date();
            timeScore =  0|((nowTime.getTime() - startTime.getTime())/1000);
            this.timeLabel.setString(timeScore + "s");
        }
    },


    backToMainMenu:function (){

        var musicEngine = cc.AudioEngine.getInstance();
        musicEngine.playEffect(v_buttonPush);
        resetSpace();
        var startScene      = new MyScene();
        var stageTransition = cc.TransitionFade.create(0.5, startScene, cc.c3b(255, 255, 255));
        cc.Director.getInstance().replaceScene(stageTransition);
    }

});
