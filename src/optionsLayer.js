var OptionsKeys = {
    Volume:'OptionsKeys_volume',
    Blood:'OptionsKeys_blood'
};

var OptionsLayer = cc.Layer.extend({

    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        if(this._super()){

            var backPic = cc.Sprite.create(b_background);
            backPic.setAnchorPoint(cc.p(0,0));
            this.addChild(backPic, p_MapZOder.bg);

            this._sliderValueLabel = cc.LabelTTF.create("Volume :", "Marker Felt", 36);
            this._sliderValueLabel.retain();
            this._sliderValueLabel.setPosition(cc.p(130,350));
            this.addChild(this._sliderValueLabel);

            this._bloodValueLabel = cc.LabelTTF.create("Show Blood :", "Marker Felt", 36);
            this._bloodValueLabel.retain();
            this._bloodValueLabel.setPosition(cc.p(130,400));
            this.addChild(this._bloodValueLabel);

            this._displayValueLabel = cc.LabelTTF.create("#color", "Marker Felt", 36);
            this._displayValueLabel.retain();
            this._displayValueLabel.setPosition(cc.p(350,400));
            this.addChild(this._displayValueLabel);

            // Create the switch
            var switchControl = cc.ControlSwitch.create
                (
                    cc.Sprite.create(s_switch_mask),
                    cc.Sprite.create(s_switch_on),
                    cc.Sprite.create(s_switch_off),
                    cc.Sprite.create(s_switch_thumb),
                    cc.LabelTTF.create("On", "Arial-BoldMT", 16),
                    cc.LabelTTF.create("Off", "Arial-BoldMT", 16)
                );
            switchControl.setPosition(cc.p(250 + switchControl.getContentSize().width / 2, 400));
            this.addChild(switchControl);
            switchControl.addTargetWithActionForControlEvents(this, this.valueChanged, cc.CONTROL_EVENT_VALUECHANGED);
            var bloodOn = sys.localStorage.getItem(OptionsKeys.Blood);
            if(bloodOn == null){
                sys.localStorage.setItem(OptionsKeys.Blood,false);
                switchControl.setOn(false);
            }
            else{
                switchControl.setOn(bloodOn == 'true');
            }
            console.log(switchControl.isOn());

            var slider = cc.ControlSlider.create(s_slider_track,s_slider_progress,s_slider_thumb);
            slider.setAnchorPoint(cc.p(0.5, 1.0));
            slider.setMinimumValue(0.0);
            slider.setMaximumValue(1.0);
            slider.setPosition(cc.p(370, 360));
            slider.addTargetWithActionForControlEvents(this, this.sliderValueChanged, cc.CONTROL_EVENT_VALUECHANGED);
            this.addChild(slider);
            slider.setValue(sys.localStorage.getItem(OptionsKeys.Volume) || 0.5);

            var pBackItem = cc.MenuItemFont.create("Back", this.toMainLayer, this);
            pBackItem.setPosition(cc.p(550, 25));
            var pBackMenu = cc.Menu.create(pBackItem);
            pBackMenu.setPosition( cc.p(0,0));
            this.addChild(pBackMenu, 10);
        }
    },
    valueChanged:function (sender, controlEvent) {
        if (sender.isOn()) {
            this._displayValueLabel.setString("On");
            sys.localStorage.setItem(OptionsKeys.Blood,true);
        }
        else {
            this._displayValueLabel.setString("Off");
            sys.localStorage.setItem(OptionsKeys.Blood,false);
        }
        console.log('valueChanged');
    },
    sliderValueChanged:function (sender, controlEvent) {
        var volume = sender.getValue().toFixed(2);
        sys.localStorage.setItem(OptionsKeys.Volume,volume);
        cc.AudioEngine.getInstance().setEffectsVolume(volume);
    },
    toMainLayer:function(){
        var scene = new cc.Scene.create();
        var layer = new MenuLayer();
        scene.addChild(layer);
        var optionsTransition = cc.TransitionMoveInL.create(0.5,scene);
        cc.Director.getInstance().replaceScene(optionsTransition);
    }
});
