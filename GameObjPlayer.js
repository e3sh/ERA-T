function GameObjectPlayer(){

    const RESO_X = 640;
	const RESO_Y = 480;

    this.r = 0;
    this.vr = 0;
    this.x = 0;
    this.y = 0;

    this.old_X = 0;
    this.old_y = 0;

    this.triggerDelay = 0;
	this.op = { ptr: 0, x: Array(40), y: Array(40), r: Array(40)};
    this.turlet = new turlet_vec_check();

    let MyTurlet;
    let Friend;
    let FriendT;
    let ArmorF;
    let ArmorL;
    let ArmorR;

    let status = {speed:0, charge:0, power:0 };

    this.spriteItem;

    let reexf;
    let blmode = false;

    let note;
    let notescore;
    let notetime;

    function turlet_vec_check(){
		let turlet = 0;

        this.vecToR = function(wx, wy){
			let r = (wx == 0)?
			((wy >= 0)?180: 0):
			((Math.atan(wy / wx) * (180.0 / Math.PI)) + ((wx >= 0)? 90:270))
			
			return (270+r)%360;
		}

        this.check = function(r){
			let wr = Math.trunc(180 + r - turlet)%360;
			if (wr >= 180) turlet++;
			if (wr <= 180) turlet--;
			if (wr >= 210) turlet+=3;
			if (wr <= 150) turlet-=3;
			if (wr >= 270) turlet+=3;
			if (wr <=  90) turlet-=3;
		}

        this.move = function(vr){
            turlet = (turlet + vr)%360;
        }

        this.vector = function(){
            return turlet;//turVector[turlet];
        }
    }
    this.init = function(g){

        this.r = 0;
        this.vr = 0;
        this.x =  this.spriteItem.x;
        this.y =  this.spriteItem.y;
        this.old_x = this.x;
        this.old_y = this.y;
        this.triggerDelay = 0;
        this.op.ptr = 0;
        this.op.x.fill(this.x);
        this.op.y.fill(this.y);
        this.op.r.fill(0);

        this.spriteItem.mode = 0;
        this.spriteItem.linkedOption = false;
        
        MyTurlet = {sp:g.sprite.itemCreate("Turlet", false, 32, 32) , re:false};
        MyTurlet.sp.customDraw = customDraw_turlet;
        MyTurlet.sp.priority = 1;

        Friend = {sp:g.sprite.itemCreate("FRIEND_P", true, 32, 32) , re:false};
        FriendT = {sp:g.sprite.itemCreate("Turlet", false, 32, 32) , re:false};
        ArmorF = {sp:g.sprite.itemCreate("ARMOR_P", true, 32, 32), re:false};
        ArmorL = {sp:g.sprite.itemCreate("ARMOR_P", true, 32, 32), re:false};
        ArmorR = {sp:g.sprite.itemCreate("ARMOR_P", true, 32, 32), re:false};

        reexf = false;
        blmode = false;

        Friend.sp.dispose(); Friend.re = true; 
        FriendT.sp.dispose(); FriendT.re = true;
        ArmorF.sp.dispose(); ArmorF.re = true;
        ArmorL.sp.dispose(); ArmorL.re = true;
        ArmorR.sp.dispose(); ArmorR.re = true;

        notescore = g.beep.makeScore(["C2"], 250, 0.3);
    }

    this.setNote = function(n){
        note = n;
        notetime = 0;
    }
  
    this.step = function(g, input, result){
        this.spriteItem.collisionEnable = (result.clrf)?false:true;

        let x = input.x;
        let y = input.y;
        let trigger = input.trigger;
        let lock = (input.left || input.right)?true:false;

        if (trigger) {
            if (this.triggerDelay < g.time()){
                this.triggerDelay = g.time()+250;

                let sp = g.sprite.itemCreate(((blmode)?"BULLET_P2":"BULLET_P"), true, 8, 8);

                let r =  this.turlet.vector();
                let px = this.x + Math.cos((Math.PI/180)*r)*16
                let py = this.y + Math.sin((Math.PI/180)*r)*16 

                sp.pos(px, py, 0, 0.6 );
                sp.move((r+90)% 360, 6, 120);// number, r, speed, lifetime//3kf 5min

                if (Friend.sp.living){
                    op = this.op;
                    sp = g.sprite.itemCreate("BULLET_P3", true, 8, 8);
                    sp.pos(op.x[(op.ptr) % op.x.length], op.y[(op.ptr) % op.x.length], 0, 0.6 );
                    sp.move((op.r[(op.ptr) % op.x.length]+90)% 360, 6, 120);// number, r, speed, lifetime//3kf 5min
                }
                score =["E5","C5"];
                s = g.beep.makeScore(score, 50, 0.5);
                note.play(s, g.time());
            }
        }

        let speed = 3 + status.speed;// - (this.spriteItem.slow)?1:0;

        if (Boolean(this.spriteItem.slow)){ 
            if (this.spriteItem.slow){
                //console.log("slowtrue");
                speed = speed/2;
                this.spriteItem.slow = false;
            }else{
                this.spriteItem.slow = false;
            }
        }

        this.r = Math.trunc(360 + this.r + x*3)%360;
        //let vx = speed*x;
        //let vy = speed*y;

        let vx = speed * (Math.cos((Math.PI/180)*(this.r))) * -y;
        let vy = speed * (Math.sin((Math.PI/180)*(this.r))) * -y;

        //console.log(this.r + ",vx" + vx + ",vy" + vy + ",x" + x + ",y" +y);

        if (result.clrf && (vx==0 && vy==0)){
            let t = g.time() - result.time

            vx = (Math.abs(320 - this.x)/3 <1)?
                Math.trunc((320 - this.x)):Math.trunc((320 - this.x)/3);

            vy = (Math.abs(320 - this.y)/3 <1)?
                Math.trunc((320 - this.y)):Math.trunc((320 - this.y)/3);
        }

        let wallf = false;
        let wpl = Boolean(this.spriteItem.wall)?((this.spriteItem.wall)?true:false):false;
        
        let waf = false;
        let wal = false;
        let war = false;

        let pup = false;
        
        if (this.spriteItem.living){
            //自機が生きている状態
            pup = Boolean(this.spriteItem.mode)?((this.spriteItem.mode !=0)?true:false):false;
            if (pup){
                //Powerup処理
                if ((this.spriteItem.mode&1) != 0){
                    if (!ArmorF.sp.living){
                        ArmorF = {sp:g.sprite.itemCreate("ARMOR_P", true, 32, 32), re:false};
                    }
                }
                if ((this.spriteItem.mode&2) != 0){
                    if (!ArmorL.sp.living){
                        ArmorL = {sp:g.sprite.itemCreate("ARMOR_P", true, 32, 32), re:false};
                    }
                    if (!ArmorR.sp.living){
                        ArmorR = {sp:g.sprite.itemCreate("ARMOR_P", true, 32, 32), re:false};
                    }
                }
                if ((this.spriteItem.mode&4) != 0){
                    if (!Friend.sp.living){
                        Friend = {sp:g.sprite.itemCreate("FRIEND_P", true, 32, 32) , re:false};
                        FriendT = {sp:g.sprite.itemCreate("Turlet", false, 32, 32) , re:false};
                    }
                }
                if ((this.spriteItem.mode&8) != 0){
                    blmode = (blmode)?false:true;
                }
                this.spriteItem.mode =0;
            }
            reexf = false;//爆発済みf
        }else{
            if (!reexf){
                 explose(g,
                    this.x, this.y);
                reexf = true;
                MyTurlet.sp.hide();
                if (Friend.sp.living) Friend.sp.dispose();
                if (ArmorF.sp.living) ArmorF.sp.dispose();
                if (ArmorL.sp.living) ArmorL.sp.dispose();
                if (ArmorR.sp.living) ArmorR.sp.dispose();
                blmode = false;
            }
        }

        if (Friend.sp.living){
            this.spriteItem.linkedOption = true;
            //僚機が生きている状態
        }else{
            if (FriendT.sp.living) FriendT.sp.dispose();
            this.spriteItem.linkedOption = false;
        }

        if (ArmorF.sp.living){
            waf = Boolean(ArmorF.wall)?((ArmorF.wall)?true:false):false;
            ArmorF.wall = false;
        }
        if (ArmorL.sp.living){
            wal = Boolean(ArmorF.wall)?((ArmorL.wall)?true:false):false;
            ArmorL.wall = false;
        }
        if (ArmorR.sp.living){
            war = Boolean(ArmorF.wall)?((ArmorR.wall)?true:false):false;
            ArmorR.wall = false;        
        }
        
        wallf = (wpl || waf || wal || war)?true:false;
        if (wallf){ 
            this.x = this.old_x;
            this.y = this.old_y;
            this.spriteItem.wall = false;
        }

        if (reexf) return;

        if (!lock) this.turlet.check(this.r);
        if ((vx!=0 || vy!=0)||result.clrf) {

            this.old_x = Math.trunc(this.x);
            this.old_y = Math.trunc(this.y);

            let tajs = (g.deltaTime()/(1000/60));//speed DeltaTime ajust 60f base
            this.x = this.x + (vx * tajs);
            this.y = this.y + (vy * tajs);

            
            if (this.x < 32)	this.x = 32;
            if (this.x > RESO_X-32)	this.x = RESO_X-32;
            if (this.y < 32)	this.y = 32;
            if (this.y > RESO_Y-32)	this.y = RESO_Y-32;
            
            /*
            if (this.x < 0)	this.x = RESO_X;
            if (this.x > RESO_X)	this.x = 0;
            if (this.y < 0)	this.y = RESO_Y;
            if (this.y > RESO_Y)	this.y = 0;
            */
            //if (!result.clrf) this.r = this.turlet.vecToR(vx,vy);

            op = this.op;
            op.x[op.ptr] = Math.trunc(this.x);
            op.y[op.ptr] = Math.trunc(this.y);
            op.r[op.ptr] = this.turlet.vector();
            op.ptr++;
            op.ptr = op.ptr % op.x.length; 

            if (g.time() > notetime) note.busy = false;
            if ((!note.busy)&&(!result.clrf)){
                for (let n of notescore)n.use = false;
                //notescore[0].use = false;
                note.play(notescore, g.time());
                notetime = g.time() + 240;
            }
        }else{
            if (input.left) this.turlet.move(-1);
            if (input.right) this.turlet.move(1);
        }

        //g.viewport.setPos(Math.trunc(this.x-320), Math.trunc(this.y-240));
        g.screen[0].buffer.turn(270 - this.r);//this.turlet.vector());
    }
    
    this.draw = function(g){

        if (Friend.sp.living){
            for (let i=0; i < this.op.x.length - 5; i+=3){
                let op = this.op;
                let r = g.viewport.viewtoReal(
                    op.x[(op.ptr + i) % op.x.length]
                    , op.y[(op.ptr + i) % op.x.length]
                )
                if (r.in){
                    g.screen[0].fill(
                        r.x-2,
                        r.y-2,3,3,"gray"
                    );
                }
            }
            let op = this.op;
            Friend.sp.pos(  op.x[(op.ptr) % op.x.length], op.y[(op.ptr) % op.x.length],op.r[(op.ptr) % op.x.length]+90, 0.8);
            FriendT.sp.pos( op.x[(op.ptr) % op.x.length], op.y[(op.ptr) % op.x.length],op.r[(op.ptr) % op.x.length]+90, 0.8);

            Friend.sp.view();
            FriendT.sp.view();
        }else{
            if (!Friend.re){
                 explose(g,
                    op.x[(op.ptr) % op.x.length]
                    , op.y[(op.ptr) % op.x.length]
                );
                FriendT.sp.dispose();
                Friend.re = true;
            }
        }

        let tx = Math.trunc(this.x);
        let ty = Math.trunc(this.y);

        if (ArmorF.sp.living){	
            ArmorF.sp.pos(
                Math.trunc(tx + Math.cos((this.r)*(Math.PI/180))*20)
                , Math.trunc(ty + Math.sin((this.r)*(Math.PI/180))*20)
                , (this.r+90)% 360, 1);
            ArmorF.sp.view();
        }else{
            if (!ArmorF.re){
                 explose(g,
                    tx + Math.cos((this.r)*(Math.PI/180))*20
                    , ty + Math.sin((this.r)*(Math.PI/180))*20
                );
                ArmorF.re = true;
            }
        }

        if (ArmorL.sp.living){	
            ArmorL.sp.pos(
                Math.trunc(tx + Math.cos((this.r-90)*(Math.PI/180))*20)
                , Math.trunc(ty + Math.sin((this.r-90)*(Math.PI/180))*20)
                , (this.r)% 360, 1);
            ArmorL.sp.view();
        }else{
            if (!ArmorL.re){
                 explose(g,
                    tx + Math.cos((this.r-90)*(Math.PI/180))*16
                    , ty + Math.sin((this.r-90)*(Math.PI/180))*16
                );
                ArmorL.re = true;
            }
        }

        if (ArmorR.sp.living){	
            ArmorR.sp.pos(
                Math.trunc(tx + Math.cos((this.r+90)*(Math.PI/180))*17)
                , Math.trunc(ty + Math.sin((this.r+90)*(Math.PI/180))*17)
                , (this.r)% 360, 1);
            ArmorR.sp.view();
        }else{
            if (!ArmorR.re){
                 explose(g,
                    Math.trunc(tx + Math.cos((this.r+90)*(Math.PI/180))*16)
                    , Math.trunc(ty + Math.sin((this.r+90)*(Math.PI/180))*16)
                );
                ArmorR.re = true;
            }
        }

        this.spriteItem.pos(tx, ty, (this.r+90)% 360, 1);
        this.spriteItem.view();
        if (MyTurlet.sp.living){
            MyTurlet.sp.pos(tx, ty, (this.turlet.vector()+90)% 360, 1); 
            MyTurlet.sp.r = (this.turlet.vector()+90)% 360;
            MyTurlet.sp.view();
        }
    }

    function explose(g, x, y, sr=0, w=360){

        for (let r=sr; r<w; r+=(360/12)){
            sp = g.sprite.itemCreate("BULLET_P", true, 8, 8);
            sp.pos(x, y, r);
            sp.move(r, 2, 30);// number, r, speed, lifetime//
        }
    }

    function customDraw_turlet(g, screen){

        let r = g.viewport.viewtoReal( this.x, this.y );
        if (r.in){        
            w = {x:r.x, y:r.y, c:"white", r:this.r-90
            , draw(dev){
                dev.beginPath();
                //dev.fillStyle = this.c;
                dev.globalAlpha = 1.0;
                dev.strokeStyle = this.c;
                dev.lineWidth = 2;
                //dev.arc(this.x, this.y, 6, 0, 2 * Math.PI, false);
                //dev.fill();
                //dev.stroke();
                dev.moveTo(this.x + Math.cos((this.r)*(Math.PI/180))*12, this.y + Math.sin((this.r)*(Math.PI/180))*12);
                dev.lineTo(this.x + Math.cos((this.r)*(Math.PI/180))*24, this.y + Math.sin((this.r)*(Math.PI/180))*24);
                dev.stroke();
                } 
            }
            screen.putFunc(w);
        }
    }
}
