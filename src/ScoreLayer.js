
var ScoreLayer = cc.Layer.extend({
    buttons:null,
    tableView:null,

    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        if(this._super()){
            var backPic = cc.Sprite.create(b_background);
            backPic.setAnchorPoint(cc.p(0,0));
            this.addChild(backPic);

            var stringArray = ["MONEY", "HEADG", "BODYG", "AIRCON","TIME"];
            var total_width = 0, height = 0;
            var layer = cc.Node.create();
            this.addChild(layer, 1);

            this.buttons = [];

            for (var i = 0; i < stringArray.length; i++) {
                var button = this.standardButtonWithTitle(stringArray[i]);
                button.setTag(i+1);
                this.buttons.push(button);

                button.setPosition(cc.p(total_width + button.getContentSize().width / 2, button.getContentSize().height / 2));
                layer.addChild(button);

                // Compute the size of the layer
                height = button.getContentSize().height;
                total_width += button.getContentSize().width;
            }
            layer.setAnchorPoint(cc.p(0.5, 0.5));
            layer.setContentSize(cc.size(total_width, height));
            layer.setPosition(cc.p(300, 700));

            // Add the black background
            var background = cc.Scale9Sprite.create(s_extensions_buttonBackground);
            background.setContentSize(cc.size(total_width + 14, height + 14));
            background.setPosition(cc.p(300, 700));
            this.addChild(background);

            var pBackItem = cc.MenuItemFont.create("Back", this.toMainLayer, this);
            pBackItem.setPosition(cc.p(550, 25));
            var pBackMenu = cc.Menu.create(pBackItem);
            pBackMenu.setPosition( cc.p(0,0));
            this.addChild(pBackMenu, 10);

            this.showCharts(this.buttons[0]);
        }
    },
    standardButtonWithTitle:function (title) {
        // Creates and return a button with a default background and title color.
        var backgroundButton = cc.Scale9Sprite.create(s_extensions_button);
        var backgroundHighlightedButton = cc.Scale9Sprite.create(s_extensions_buttonHighlighted);

        var titleButton = cc.LabelTTF.create(title, "Marker Felt", 30);

        titleButton.setColor(cc.c3b(159, 168, 176));

        var button = cc.ControlButton.create(titleButton, backgroundButton);
        button.setBackgroundSpriteForState(backgroundHighlightedButton, cc.CONTROL_STATE_HIGHLIGHTED);
        button.setTitleColorForState(cc.WHITE, cc.CONTROL_STATE_HIGHLIGHTED);

        button.addTargetWithActionForControlEvents(this, this.showCharts,cc.CONTROL_EVENT_TOUCH_UP_INSIDE);

        return button;
    },
    showCharts:function(sender, controlEvent){
        if(this.tableView){
            this.tableView.removeFromParent(true);
            this.tableView = null;
        }

        var tag = sender.getTag();
        for(var i=0; i<this.buttons.length; i++){
            if(i == tag-1)
                this.buttons[i].setOpacity(255);
            else
                this.buttons[i].setOpacity(100);
        }

        this.tableView = new TableViewTestLayer;
        this.tableView.init(tag);
        this.addChild(this.tableView);
    },
    toMainLayer:function(){
        var scene = new cc.Scene.create();
        var layer = new MenuLayer();
        scene.addChild(layer);
        var optionsTransition = cc.TransitionMoveInL.create(0.5,scene);
        cc.Director.getInstance().replaceScene(optionsTransition);
    }
}) ;

var CustomTableViewCell = cc.TableViewCell.extend({
    draw:function (ctx) {
        this._super(ctx);
    }
});

var TableViewTestLayer = cc.Layer.extend({
    count:null,
    names:[],
    content:[],


    init:function (type) {
        if (!this._super()) {
            return false;
        }
        var title = ['ranking','name','record'];
        var titleLabel;
        for(var i=0; i<3; i++){
            titleLabel = cc.LabelTTF.create(title[i], "Helvetica", 26.0);
            titleLabel.setPosition(cc.p(50+200*i,625));
            titleLabel.setAnchorPoint(cc.p(0,0));
            this.addChild(titleLabel);
        }

        var field = ['money','head_g','body_g','aircon','time'];
        var ret =  eval( getScoresFor(type) );
        this.count = ret.length;
        for(var i=0; i< ret.length; i++){
            this.names[i] = ret[i].name;
            switch (type){
                case 1:
                    this.content[i] = field[type-1] + ' : ' + ret[i].money;
                    break;
                case 2:
                    this.content[i] = field[type-1] + ' : ' + ret[i].head_g;
                    break;
                case 3:
                    this.content[i] = field[type-1] + ' : ' + ret[i].body_g;
                    break;
                case 4:
                    this.content[i] = field[type-1] + ' : ' + ret[i].aircon;
                    break;
                case 5:
                    this.content[i] = field[type-1] + ' : ' + ret[i].time;
                    break;
            }
        }

        var winSize = cc.Director.getInstance().getWinSize();

        var tableView = cc.TableView.create(this, cc.size(600, 600));
        tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        tableView.setPosition(cc.p(0, 50));
        tableView.setDelegate(this);
        tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(tableView);
        tableView.reloadData();

        return true;
    },

    scrollViewDidScroll:function (view) {
    },
    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    cellSizeForTable:function (table) {
        return cc.size(60, 60);
    },

    tableCellAtIndex:function (table, idx) {
        var strValue = (idx+1).toFixed(0);
        var cell = table.dequeueCell();
        var label;
        var name;
        var content;

        if (!cell) {
            cell = new CustomTableViewCell();

            label = cc.LabelTTF.create(strValue, "Helvetica", 26.0);
            label.setPosition(cc.p(50,0));
            label.setAnchorPoint(cc.p(0,0));
            label.setTag(123);
            cell.addChild(label);

            name = cc.LabelTTF.create(this.names[idx], "Helvetica", 26.0);
            name.setPosition(cc.p(250,0));
            name.setAnchorPoint(cc.p(0,0));
            name.setTag(124);
            cell.addChild(name);

            content = cc.LabelTTF.create(this.content[idx], "Helvetica", 26.0);
            content.setPosition(cc.p(400,0));
            content.setAnchorPoint(cc.p(0,0));
            content.setTag(125);
            cell.addChild(content);
        } else {
            label = cell.getChildByTag(123);
            label.setString(strValue);

            name = cell.getChildByTag(124);
            name.setString(this.names[idx]);

            content = cell.getChildByTag(125);
            content.setString(this.content[idx]);
        }

        return cell;
    },

    numberOfCellsInTableView:function (table) {
        return this.count;
    }
});