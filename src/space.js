var space;
var maiMenuFlag = false;
function resetSpace(){

    maiMenuFlag = false;
    count =0;
    goldScore = 0;
    timeScore = 0;
    aircCrash = 0;

    space = new cp.Space();
    space.iterations = 20;
    space.gravity = cp.v(0, -500);
    space.sleepTimeThreshold = 2.2;
    space.damping = 0.9;

    space.max_head_g = 0;
    space.total_head_g = 0;

    space.max_body_g = 0;
    space.total_body_g = 0;

    space.startTime = Date.now();

    space.addCollisionHandler(CT_AIRCON, CT_BODYPARTS, null, null, function(a){
        if(a.body_b.id && a.body_b.id === "head")
        {
            if(cp.v.len(a.totalImpulse()))
            {
                var g = cp.v.len(a.totalImpulse())/a.body_b.m;
                space.total_head_g += g;
                if(g > space.max_head_g)
                space.max_head_g = g;
            }
        }

        return true;
    }, function(a,b,c){

            this.musicEngine = cc.AudioEngine.getInstance();
            this.musicEngine.playEffect(v_hitAirC);
        return true;
    });

    space.addCollisionHandler(CT_FLOOR, CT_BODYPARTS, null, null, function(a){
        if(a.body_b.id && a.body_b.id === "head")
        {
            if(cp.v.len(a.totalImpulse()))
            {
                var g = cp.v.len(a.totalImpulse())/a.body_b.m;
                space.total_head_g += g;
                if(g > space.max_head_g)
                    space.max_head_g = g;
            }
        }
        return true;
    });

    space.addCollisionHandler(CT_AIRCON, CT_DEADPARTS, null, null, function(a){
        if(a.body_b.id && a.body_b.id === "head")
        {
            if(cp.v.len(a.totalImpulse()))
            {
                var g = cp.v.len(a.totalImpulse())/a.body_b.m;
                space.total_head_g += g;
                if(g > space.max_head_g)
                    space.max_head_g = g;
            }
        }
        return true;
    });

    space.addCollisionHandler(CT_FLOOR, CT_BODYPARTS, null, null, function(a){
        if(a.body_b.id && a.body_b.id === "head")
        {
            if(cp.v.len(a.totalImpulse()))
            {
                var g = cp.v.len(a.totalImpulse())/a.body_b.m;
                space.total_head_g += g;
                if(g > space.max_head_g)
                    space.max_head_g = g;
            }
        }
        return true;
    });

    space.addCollisionHandler(CT_AIRCON, CT_BODY, function(a,b,c){

        this.musicEngine = cc.AudioEngine.getInstance();
        this.musicEngine.playEffect(v_hitAirC);
        return true;
    }, null,
    function(a){
        if(a.body_b.id && a.body_b.id === "body")
        {
            if(cp.v.len(a.totalImpulse()))
            {
                var g = cp.v.len(a.totalImpulse())/a.body_b.m;
                space.total_body_g += g;
                if(g > space.max_body_g)
                    space.max_body_g = g;
            }
        }

        return true;
    });

    space.addCollisionHandler(CT_FLOOR, CT_BODY, null, null, function(a){
        if(a.body_b.id && a.body_b.id === "body")
        {
            if(cp.v.len(a.totalImpulse()))
            {
                var g = cp.v.len(a.totalImpulse())/a.body_b.m;
                space.total_body_g += g;
                if(g > space.max_body_g)
                    space.max_body_g = g;
            }
        }

        return true;
    }, function(a,b,c){
        endGame();

        return true;
    });

     logprint = false;
    space.addCollisionHandler(CT_UMBRELLA, CT_AIRCON, function(){return false}, null, function(a){
        //space.removeBody();
        //space.removeShape();
/*        var umb = getUmbrella(a.body_b);
        if(umb == null) umb = getUmbrella(a.body_a);
        if( umb != null){
            //console.log("will remove umb.");
            umb.removeSelf();
        }*/
        return false;
    });

    space.addCollisionHandler(CT_UMBRELLA, CT_BODYPARTS,  function(a){
         //remove umbrella, and attatch to bodypart
        if( a.getA().collision_type == CT_UMBRELLA){
            if(a.getA().sprite){
                a.getA().sprite.removeSelf();

                //console.log("------", a.contacts[0].p, a.b);
                BUILDING_LAYER.addUmbrellaHelp(a.contacts[0].p, a.b);
            }
        }
        //console.log(a);
        return true;
    });

    space.addCollisionHandler(CT_UMBRELLA, CT_FLOOR, null, null, function(a){
        //remove umbrella
        if( a.getA().collision_type == CT_UMBRELLA){
            if(a.getA().sprite){
                a.getA().sprite.removeSelf();
            }
        }
        return false;
    });

    space.addCollisionHandler(CT_UMBRELLA_HELP, CT_BODYPARTS, function(){
        return false;
    });
    space.addCollisionHandler(CT_UMBRELLA_HELP, CT_BODY, function(){
        return false;
    });

    space.addCollisionHandler(CT_GOLD, CT_BODYPARTS, function(a){

        if( a.getA().collision_type == CT_GOLD){
            if(a.getA().sprite){
                a.getA().sprite.removeSelf();
                goldScore+=10;
                var musicEngine = cc.AudioEngine.getInstance();
                musicEngine.playEffect(v_coins);
            }
        }
        return false;
    });
}

resetSpace();

function submitScore(){
    var name;
    name = prompt("Enter your name");
    if(name)
    {
        sendScore(name,goldScore, space.max_head_g, space.max_body_g, aircCrash, timeScore);
        resetSpace();
        var scene = new cc.Scene.create();
        scene.addChild(new ScoreLayer);
        var optionsTransition = cc.TransitionMoveInR.create(0.5,scene);
        cc.Director.getInstance().replaceScene(optionsTransition);
    }
}


var CT_FLOOR     = 1;
var CT_BODYPARTS = 2;
var CT_BODY      = 3;
var CT_AIRCON    = 4;
var CT_UMBRELLA  = 5;
var CT_UMBRELLA_HELP  = 6;
var CT_DEADPARTS = 7;
var CT_GOLD = 8;