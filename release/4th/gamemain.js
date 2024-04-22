function GameObject(){

    const RESO_X = 640;
	const RESO_Y = 480-16;

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
        
    }
  
    this.step = function(g, input, result){
        //result = {score:0, time:g.time(), stage:1, clrf:false, govf:false};
        this.spriteItem.collisionEnable = (result.clrf)?false:true;

        let x = input.x;
        let y = input.y;
        let trigger = input.trigger;
        let lock = (input.left || input.right)?true:false;

        if (trigger) {
            if (this.triggerDelay < g.time()){
                this.triggerDelay = g.time()+250;

                //let n = g.sprite.get();//空値の場合は未使用スプライトの番号を返す。
                let sp = g.sprite.itemCreate(((blmode)?"BULLET_P2":"BULLET_P"), true, 8, 8);

                let r =  this.turlet.vector();
                let px = this.x + Math.cos((Math.PI/180)*r)*16
                let py = this.y + Math.sin((Math.PI/180)*r)*16 

                sp.pos(px, py, 0, 0.6 );
                sp.move((r+90)% 360, 6, 3000);// number, r, speed, lifetime//3kf 5min
                //spriteTable.push(g.sprite.get(n));

                if (Friend.sp.living){
                    op = this.op;
                    sp = g.sprite.itemCreate("BULLET_P", true, 8, 8);
                    sp.pos(op.x[(op.ptr) % op.x.length], op.y[(op.ptr) % op.x.length], 0, 0.6 );
                    sp.move((op.r[(op.ptr) % op.x.length]+90)% 360, 6, 3000);// number, r, speed, lifetime//3kf 5min
                }
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

        let vx = speed*x;
        let vy = speed*y;

        if (result.clrf && (vx==0 && vy==0)){
            let t = g.time() - result.time

            vx = Math.trunc((320 - this.x)/40);//*(1500-t);
            vy = Math.trunc((320 - this.y)/40);//*(1500-t);
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
            //僚機が生きている状態
        }else{
            if (FriendT.sp.living) FriendT.sp.dispose();
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
        //console.log("wcb:x" + this.x + "y" + this.y + "r" + this.r);
        if (wallf){ 
            this.x = this.old_x;
            this.y = this.old_y;
            this.spriteItem.wall = false;
        }

        if (reexf) return;

        if (!lock) this.turlet.check(this.r);
        if (vx!=0 || vy!=0) {

            this.old_x = Math.trunc(this.x);
            this.old_y = Math.trunc(this.y);

            this.x = this.x + vx;
            this.y = this.y + vy;

            if (this.x < 32)	this.x = 32;
            if (this.x > RESO_X-32)	this.x = RESO_X-32;
            if (this.y < 32)	this.y = 32;
            if (this.y > RESO_Y-32)	this.y = RESO_Y-32;

            this.r = this.turlet.vecToR(vx,vy);

            //console.log("x" + this.x + "y" + this.y + "r" + this.r);


            op = this.op;
            op.x[op.ptr] = Math.trunc(this.x);
            op.y[op.ptr] = Math.trunc(this.y);
            op.r[op.ptr] = this.turlet.vector();
            op.ptr++;
            op.ptr = op.ptr % op.x.length; 
        }else{
            if (input.left) this.turlet.move(-1);
            if (input.right) this.turlet.move(1);
        }
    }
    
    this.draw = function(g){

        if (Friend.sp.living){
            for (let i=0; i < this.op.x.length - 5; i+=3){
                let op = this.op;
                g.screen[0].fill(
                    op.x[(op.ptr + i) % op.x.length]-2,
                    op.y[(op.ptr + i) % op.x.length]-2,3,3,"gray"
                );
            }
            
            let op = this.op;
            /*
            g.screen[0].fill(
                op.x[(op.ptr) % op.x.length]-8,
                op.y[(op.ptr) % op.x.length]-8,15,15,"white"
            );
            g.screen[0].fill(
                op.x[(op.ptr) % op.x.length] + Math.cos((op.r[(op.ptr) % op.x.length])*(Math.PI/180))*16 -2,
                op.y[(op.ptr) % op.x.length] + Math.sin((op.r[(op.ptr) % op.x.length])*(Math.PI/180))*16 -2,4,4,"white"
            );
            */
            Friend.sp.pos(  op.x[(op.ptr) % op.x.length], op.y[(op.ptr) % op.x.length],op.r[(op.ptr) % op.x.length]+90, 0.8);
            FriendT.sp.pos( op.x[(op.ptr) % op.x.length], op.y[(op.ptr) % op.x.length],op.r[(op.ptr) % op.x.length]+90, 0.8);
            //Friend.move(0,0,1000);
            //Friend.pos(100,100,0,1);
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
                    //, (this.r)% 360,90
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
                    //, (this.r-90)% 360,90
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
                    //, (this.r+90)% 360,90
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

        //g.screen[0].fill(this.x-15, this.y-15,30,30,"orange");

        /*
        let w = {x:this.x, y:this.y, c:"blue", r:this.r
        , draw(dev){
            dev.beginPath();
            dev.strokeStyle = this.c;
            dev.lineWidth = 2;
            //dev.arc(this.x, this.y, 4, 0, 2 * Math.PI, false);
            //dev.stroke();
            dev.moveTo(this.x, this.y);
            dev.lineTo(this.x + Math.cos((this.r)*(Math.PI/180))*16, this.y + Math.sin((this.r)*(Math.PI/180))*16);
            dev.stroke();
            } 
        }
        g.screen[0].putFunc(w);
        */
        /*
        w = {x:this.x, y:this.y, c:"white", r:this.turlet.vector()
        , draw(dev){
            dev.beginPath();
            dev.fillStyle = this.c;
            dev.strokeStyle = this.c;
            dev.lineWidth = 2;
            dev.arc(this.x, this.y, 6, 0, 2 * Math.PI, false);
            dev.fill();
            //dev.stroke();
            dev.moveTo(this.x, this.y);
            dev.lineTo(this.x + Math.cos((this.r)*(Math.PI/180))*24, this.y + Math.sin((this.r)*(Math.PI/180))*24);
            dev.stroke();
            } 
        }
        g.screen[0].putFunc(w);
        /*
        let st = this.spriteItem.debug();
        for (let i in st){
            g.kanji.print(st[i],0, i*8);
        }
        */
    }

    function explose(g, x, y, sr=0, w=360){

        for (let r=sr; r<w; r+=(360/12)){
            sp = g.sprite.itemCreate("BULLET_P", true, 8, 8);
            sp.pos(x, y, r);
            sp.move(r, 2, 30);// number, r, speed, lifetime//
        }
    }

    function customDraw_turlet(g, screen){
        w = {x:this.x, y:this.y, c:"white", r:this.r-90
        , draw(dev){
            dev.beginPath();
            //dev.fillStyle = this.c;
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


function GameObj_Friend(){


}

function GameObj_Enemy(){

    
}

function GameObj_FlyCanon(){
    
    const RESO_X = 640;
	const RESO_Y = 480-16;

    this.r = 0;
    this.vr = 0;
    this.x = 0;
    this.y = 0;

    this.old_X = 0;
    this.old_y = 0;

    this.triggerDelay = 0;
    this.triggerCount =0;

    let status = {speed:0, charge:0, power:0 };

    this.spriteItem;
    let reexf;

    let interval;
    let turn;

    this.init = function(g ,it=1000,tn=10){

        this.r = this.spriteItem.r;
        this.vr = 0;
        this.x =  this.spriteItem.x;
        this.y =  this.spriteItem.y;
        this.old_X = this.x;
        this.old_y = this.y;
        this.triggerDelay = 0;
        this.triggerCount =0;
  
        reexf = false;
        interval = it;
        turn = tn;
    }

    function vecToR(wx, wy){
        //console.log(wx + "," + wy);
        let r = (wx == 0)?
        ((wy >= 0)?180: 0):
        ((Math.atan(wy / wx) * (180.0 / Math.PI)) + ((wx >= 0)? 90:270))
        
        return (270+r)%360;
    }

    function Search(g, wx, wy){
        const l = g.sprite.itemList();
        let c = -1;
        for (let i in l){
            if (l[i].id  == "Player"){
                c = i;
            }
        }
        let rc = -1;
        if (c != -1){
            rc = vecToR(
                wx - l[c].x,
                wy - l[c].y
            );
       }
       return rc;
    }

    this.step = function(g, input, result) {

        if (this.spriteItem.living){

			if (this.triggerDelay < g.time()){
				this.triggerDelay = g.time()+interval;
                
                this.triggerCount++;
                    if (this.triggerCount%2 > 0){

                    let sp = g.sprite.itemCreate("BULLET_E", true, 4, 4);

                    let wr = Search(g, this.x, this.y);
                    let r = (wr != -1)?wr-90: this.r + (g.time()%180+90);
                    if (this.triggerCount%3 == 0) r = this.r;    

                    let px = this.x;// + Math.cos((Math.PI/180)*r)
                    let py = this.y;// + Math.sin((Math.PI/180)*r) 

                    sp.pos(px, py, 0, 1);
                    sp.move(r, 3, 3000);// number, r, speed, lifetime//3kf 5min
                }
                this.r +=turn // r;//+= 5;
                this.spriteItem.move(this.r, 2, 100);    
			}
            //自機が生きている状態
            reexf = false;//爆発済みf
        }else{
            if (!reexf){
                 explose(g,
                    this.x, this.y);
                reexf = true;
            }
        }
        let wallf = Boolean(this.spriteItem.wall)?((this.spriteItem.wall)?true:false):false;
        if (wallf){ 
            //this.triggerDelay = g.time();
            this.r +=turn*5; this.r = this.r%360;
            //this.triggerCount--;
            //this.spriteItem.r = (this.spriteItem.r+360)%360;
            //this.spriteItem.move(this.spriteItem.r, 3, 3000);
            /*           
            let sp = g.sprite.itemCreate("BULLET_E", true, 4, 4);
            sp.pos(this.x, this.y, 0, 1);
            sp.move(this.r, 3, 3000);// number, r, speed, lifetime//3kf 5min
            sp = g.sprite.itemCreate("BULLET_E", true, 4, 4);

            sp = g.sprite.itemCreate("BULLET_E", true, 4, 4);
            sp.pos(this.x, this.y, 0, 1);
            sp.move((this.r+180)%360, 3, 3000);// number, r, speed, lifetime//3kf 5min
            */
            this.spriteItem.vx = 0;//-1;
            this.spriteItem.vy = 0;//-1;

            //this.spriteItem.

            this.spriteItem.wall = false;
        }

        if (Boolean(this.spriteItem.slow)){ 
            if (this.spriteItem.slow){
                //this.spriteItem.alive = 5;
                this.spriteItem.vx /=1.05;
                this.spriteItem.vy /=1.05;
                this.spriteItem.slow = false;
            }else{
                this.spriteItem.slow = false;
            }
        }

        /*
        this.old_x = this.x;
        this.old_y = this.y;

        this.x = this.x + vx;
        this.y = this.y + vy;

        if (this.x < 32)	this.x = 32;
        if (this.x > RESO_X-32)	this.x = RESO_X-32;
        if (this.y < 32)	this.y = 32;
        if (this.y > RESO_Y-32)	this.y = RESO_Y-32;
        */

        if (reexf) return;

        //if (!lock) this.turlet.check(this.r);
        //this.r  = vecToR(this.x - this.old_x,this.y - this.old_y);

        this.old_x = this.x;
        this.old_y = this.y;

        this.x = this.spriteItem.x;
        this.y = this.spriteItem.y;
        this.r = this.spriteItem.r;

        if (this.x < 32)	this.spriteItem.x = 32;
        if (this.x > RESO_X-32)	this.spriteItem.x = RESO_X-32;
        if (this.y < 32)	this.spriteItem.y = 32;
        if (this.y > RESO_Y-32)	this.spriteItem.y = RESO_Y-32;

        //let wr  = vecToR(this.spriteItem.x - this.old_x,this.spriteItem.y - this.old_y)+90;
        //if (wr != this.spriteItem.r) this.spriteItem.r = wr;
        //this.r = (this.spriteItem.r + 270)%360;
    }

    this.draw = function(g){
        if (this.spriteItem.living) this.spriteItem.view();
    }

    function explose(g, x, y, sr=0, w=360){

        for (let r=sr; r<w; r+=(360/12)){
            sp = g.sprite.itemCreate("BULLET_E", true, 8, 8);
            sp.pos(x, y, r);
            sp.move(r, 2, 30);// number, r, speed, lifetime//
        }
    }
} 

function GameObj_Horming(){

} 

function GameObj_GradeUpItem(){

    const RESO_X = 640;
	const RESO_Y = 480-16;
    /*
    this.r = 0;
    this.vr = 0;
    this.x = 0;
    this.y = 0;

    this.old_X = 0;
    this.old_y = 0;
    */
    this.triggerDelay = 0;

    let status = {speed:0, charge:0, power:0 };

    this.mode = 0;
    this.blink = true;
    this.barth = true;

    this.spriteItem;
    let reexf;

    this.init = function(g){
        /*
        this.r = this.spriteItem.r;
        this.vr = 0;
        this.x =  this.spriteItem.x;
        this.y =  this.spriteItem.y;
        this.old_X = this.x;
        this.old_y = this.y;
        */
        this.triggerDelay = g.time()+250;

        this.mode = 0;
        this.barth = true;

        this.spriteItem.mode = this.mode;
        this.spriteItem.drawDesignData = drawDesignData;
        this.spriteItem.blink = true;
  
        reexf = false;

        this.spriteItem.normalDrawEnable = false;
        this.spriteItem.customDraw = customDraw;

        this.spriteItem.moveFunc = function(){
            this.alive--; this.x += this.vx; this.y += this.vy;
        }
    }

    function vecToR(wx, wy){
        //console.log(wx + "," + wy);
        let r = (wx == 0)?
        ((wy >= 0)?180: 0):
        ((Math.atan(wy / wx) * (180.0 / Math.PI)) + ((wx >= 0)? 90:270))
        
        return (270+r)%360;
    }

    function Search(g, wx, wy){
        const l = g.sprite.itemList();
        let c = -1;
        for (let i in l){
            if (l[i].id  == "Player"){
                c = i;
            }
        }
        let rc = -1;
        if (c != -1){
            rc = vecToR(
                wx - l[c].x,
                wy - l[c].y
            );
       }
       return rc;
    }

    this.step = function(g, input, result) {
        this.spriteItem.collisionEnable = !this.barth;
        //console.log("pw-run" + this.triggerDelay );
        if (result.clrf && (result.time + 750 > g.time())){
            let r = Search(g, this.spriteItem.x, this.spriteItem.y);
            this.spriteItem.move((r+260)%360,4,1);
        }

        if (this.spriteItem.living){
			if (this.triggerDelay < g.time()){
				this.triggerDelay = g.time()+250;

                this.mode = (this.spriteItem.mode != this.mode)?this.spriteItem.mode:this.mode;
                this.spriteItem.priority = this.mode;
                //this.mode++;
                //if (this.mode>3)  this.mode = 0;
                //modechange

                this.blink = (this.blink)?false:true;
                this.spriteItem.blink = this.blink;

                this.barth = false;
            }
            /*
            if (result.clrf && (result.time + 750 > g.time())){
                let r = Search(g, this.x, this.y);
                this.spriteItem.move((r+260)%360,4,1);
            }
            */
            //自機が生きている状態
            reexf = false;//爆発済みf
        }else{
            if (!reexf){
//                 explose(g,
//                    this.x, this.y);
                reexf = true;
            }
        }

        if (reexf) return;

        //if (!lock) this.turlet.check(this.r);
        const x = this.spriteItem.x;
        const y = this.spriteItem.y;
        const r = this.spriteItem.r;

        if (x < 32)	this.spriteItem.x = 32;
        if (x > RESO_X-32)	this.spriteItem.x = RESO_X-32;
        if (y < 32)	this.spriteItem.y = 32;
        if (y > RESO_Y-32)	this.spriteItem.y = RESO_Y-32;
    }

    this.draw = function(g){

        if (this.spriteItem.living){
            this.spriteItem.view();

            //debug Draw
           /*
            const x = this.spriteItem.x;
            const y = this.spriteItem.y;
            let st = this.spriteItem.debug();
            for (let i in st){g.kanji.print(st[i],0,i*8);}
           */
        }
    }

    const drawDesignData = {
        str: [
            [" --","正面","側面","子機","弾種"]
            ,["None","FWD","SIDE"," OPT","CHNG"]
        ]
        ,color: [
            ["black","peru","navy","teal","indigo"]
            ,["rgb(64,64,64)","orange","blue","green","blueviolet"]
        ]
    }

    function customDraw(g, screen){

        const st  = this.drawDesignData.str;
        const col = this.drawDesignData.color;

        let n = (this.blink)?0:1;

        const x = Math.trunc(this.x - this.collision.w/2);
        const y = Math.trunc(this.y - this.collision.h/2);
        const w = this.collision.w;
        const h = this.collision.h;
        screen.fill(x, y, w, h, "white");
        screen.fill(x+1, y+1, w-2, h-2, col[n][ this.mode ]);
        g.kanji.print(st[n][this.mode], x+2, y+4);
    }
} //----------------------------------------------------------------------
//Scene
//----------------------------------------------------------------------
// GameMain
function SceneGame(){

	const ROW = 80;
	const COL = 60;

	const RESO_X = 640;
	const RESO_Y = 480-16;

	let player = {r:0, vr:0, x:0, y:0, trgger_delay:0 
	    ,op: { ptr: 0, x: Array(40), y: Array(40) }
	};

	let GObj;
	let spriteTable;
	let block;
	let result;
	let delay;
	let trig_wait;
	let stagetime;
	let myship;

	let blkcnt;

	let ene;
	let watchdog;

	let stageCtrl;

	function step_running_check(){
		let stepc;
		let store;

		this.run = function(){
			stepc++;
		}
		this.set = function(){
			store = 0; 
			stepc = 0;
		}
		this.check = function(){
			return (stepc != store);
		}
	}

	this.state = function() {

		return {
			ene: ene
			,result: result
			,time: stagetime
			,stage: result.stage
			,score: result.score
			,delay: delay
			,block: blkcnt
			,collision: 0
			,sprite: spriteTable.length
			,clear: result.clrf
			,gameover: result.govf
		};
	}

	this.init = function(g){
		watchdog = new step_running_check();

		GObj = [];
		stageCtrl = new StageControl(g);

		stageCtrl.init();

		spriteTable = g.sprite.itemList();
		this.reset(g);
	}

	this.reset = function(g){
		stageCtrl.init();

		GObj = [];
		g.sprite.itemFlash();

		myship = new GameObject();
		myship.spriteItem = g.sprite.itemCreate("Player", true, 28, 28);
		myship.spriteItem.pos(320,320);
		myship.init(g);

		GObj.push(myship);
		stageCtrl.change(1, GObj);

		for (let i in this.spriteTable){
			spriteTable[i].visible = false;
		}

		ene = {now:3,max:3,before: this.now};
		result = {score:0, time:g.time(), stage:1, clrf:false, govf:false};

		delay = 0;
		trig_wait = 0;
	}
	//=====
	// Step
	this.step = function(g, input, param){
		stagetime = Math.trunc((g.time() - result.time)/100);

		for (let o of GObj){
			o.step(g, input, result);
		}
	
		if (delay < g.time()) {

			delay = g.time()+500;
			//spriteTable = flashsp(spriteTable);

			ene.before = ene.now;
			result.clrf = false; 

			g.sprite.itemIndexRefresh();

			let ec = 0;
			let spt = g.sprite.itemList();
			for (let o of spt) if (o.id == "Enemy") ec++;
			/*
			for (let o of spt){
				if (!o.visible && o.alive==0){
					if (o.id == "BULLET_P") o.dispose();
					if (o.id == "BULLET_E") o.dispose();
				}	
			}
			*/
			if (!myship.spriteItem.living){//dead

				ene.now--;
				if (ene.now >0){
					myship.spriteItem = g.sprite.itemCreate("Player", true, 28, 28);
					myship.spriteItem.pos(320,320);

					myship.x = 320; myship.y = 320;
				}
			}

			if (ec == 0){ //(blkcnt <=0){ //Stage Clear;
				let b = (10000-(g.time()-result.time));
				
				result.score += (b < 0)?100: b+100;//SCORE
				result.time = g.time();
				result.stage ++;

				//GObj = [];
				//GObj.push(myship);
				let nextGo = [];
				//nextGo.push(myship); 
				for (let i in GObj){
					if (GObj[i].spriteItem.living){
						nextGo.push(GObj[i]);
					}
				}
				GObj = nextGo;

				stageCtrl.change(result.stage, GObj);

				//自爆破片の残骸が消えたまま残る問題の解消
				let spt = g.sprite.itemList();
				for (let o of spt){
					if (o.id == "BULLET_P") o.dispose();
					if (o.id == "BULLET_E") o.dispose();	
				}
				//ene.now = (ene.now +30>ene.max)?ene.max:ene.now +30;//ENERGY

				result.clrf = true; 
				delay = g.time()+1500;//MESSAGE WAIT
			}

			if (ene.now <=0){ //Game Over;
			//if (!myship.spriteItem.living){
				//myship.spriteItem.dispose();

				delay = g.time()+3000;//MESSAGE WAIT
				ene.now = 0;
				result.govf = true; 
			}
		}

		g.sprite.CollisionCheck(); 
		spriteTable = g.sprite.itemList();

		for (let i in spriteTable){
			//step any gobject
			//当たり判定処理
			//SpriteListからチェックする対象を引いて
			//当たり判定のチェック結果処理を行う
			//行う対象は玉以外のPlayer/Enemy/Friend/Armor（当たり判定に回転入れないと本当はダメだが手抜きする）

			let sp = spriteTable[i];
			if (!sp.living) continue;
			if (!sp.collisionEnable) continue;
			if (!sp.visible) continue;

			if (sp.id == "Player" || sp.id == "FRIEND_P" || sp.id == "ARMOR_P"){

				//for (let i=0; i<=0; i++){
				//let c = g.sprite.check(i);//対象のSpriteに衝突しているSpriteNoを返す
				let c = sp.hit;//戻りは衝突オブジェクトのリスト
				for (let lp in c) {
					let spitem = c[lp];//SpNo指定の場合は、SpriteItem
					if (!spitem.visible) continue;

					if (spitem.id == "BULLET_E"){
						//spitem.vx = spitem.x - myship.x//vx*-1;//.05;
						//spitem.vy = spitem.y - myship.y//spitem.vy*-1;//.05;
	//					console.log("h" + spitem.id);
						stageCtrl.mapDamage(sp);
						sp.dispose();
						spitem.dispose();
					}
				
					if (sp.id == "Player" && spitem.id == "POWERUP"){
						if (spitem.mode > 0){
							if (!Boolean(sp.mode)){
								sp.mode = Math.pow(2,(spitem.mode-1));
							}else{
								if (isNaN(sp.mode)){
									sp.mode += Math.pow(2,(spitem.mode-1));
								}else{
									sp.mode = Math.pow(2,(spitem.mode-1));
								}
							}
						}
						spitem.dispose();
					}
				}
			}
			if (sp.id == "Enemy"){
				let c = sp.hit;
				for (let lp in c) {
					let spitem = c[lp];//SpNo指定の場合は、SpriteItem
					if (!spitem.visible) continue;

					if (spitem.id.substring(0,8) == "BULLET_P"){
						//spitem.vx = spitem.x - myship.x//vx*-1;//.05;
						//spitem.vy = spitem.y - myship.y//spitem.vy*-1;//.05;
	//					console.log("h" + spitem.id);
						stageCtrl.mapDamage(sp);
	
						let powup = new GameObj_GradeUpItem();
						powup.spriteItem = g.sprite.itemCreate("POWERUP", false, 28, 16);
						powup.spriteItem.pos(sp.x,sp.y);
						powup.init(g);
				
						GObj.push(powup);
						sp.dispose();
						spitem.dispose();
					}
				}
			}

			//弾の相殺
			if (sp.id.substring(0,8) == "BULLET_P"){
				let c = sp.hit;
				for (let lp in c) {
					let spitem = c[lp];//SpNo指定の場合は、SpriteItem
					if (!spitem.visible) continue;

					if (spitem.id == "BULLET_E"){
						stageCtrl.mapDamage(sp);
						sp.dispose();
						spitem.dispose();
					}
				}
			}

			if (sp.id == "BULLET_E"){
				let c = sp.hit;
				for (let lp in c) {
					let spitem = c[lp];//SpNo指定の場合は、SpriteItem
					if (!spitem.visible) continue;

					if (sp.id.substring(0,8) == "BULLET_P"){
						stageCtrl.mapDamage(sp);
						sp.dispose();
						spitem.dispose();
					}
				}
			}

			if (sp.id == "POWERUP"){
				let c = sp.hit;
				for (let lp in c) {
					let spitem = c[lp];//SpNo指定の場合は、SpriteItem
					if (!spitem.visible) continue;

					if (spitem.id.substring(0,7) == "BULLET_"){
						sp.mode++;
						if (sp.mode>4)  sp.mode = 0;
						spitem.dispose();
					}
					if (spitem.id == sp.id){
						if (Math.trunc(spitem.x) == Math.trunc(sp.x)
							 && Math.trunc(spitem.y) == Math.trunc(sp.y)){
							sp.vx = (Math.random()*4-2)*2;
							sp.vy = (Math.random()*4-2)*2;
						}
					}
				}
			}
		}
		//spriteTable = 
		flashsp(g.sprite.itemList());
		function flashsp(s){
			//let ar = new Array(0);
			for (let i in s){
				let p = s[i];
				if ((p.x < 0)||(p.x > RESO_X)||(p.y < 0)||(p.y>RESO_Y)) {//p.visible = false;

					if ((p.x < 0)||(p.x > RESO_X)) p.dispose();//p.vx *=-1;//.05;
					if ((p.y < 0)||(p.y > RESO_Y)) p.dispose();//p.vy *=-1.05;
					/*
					if (p.x < 0) p.x = 0;
					if (p.x > RESO_X) p.x = RESO_X;
					if (p.y < 0) p.y = 0;
					if (p.y > RESO_Y) p.y = RESO_Y;
					*/
				}
				//if (p.visible) ar.push(s[i]);
			}
			//return ar;
		}
		//spriteTable = g.sprite.itemList();
		//---------------------breakcheck(block sprite hit check

		stageCtrl.step(g, input, result);

		watchdog.run();
	}

	//==========
	//Draw 
	this.draw = function(g){

		let wdt = watchdog.check();

		//　FIRE DRAW 
		if (true){
			let p = g.sprite.itemList();
			for (let i in p){
				if (p[i].id.substring(0,6) == "BULLET"){
					g.screen[0].fill(
						p[i].x - p[i].collision.w/2
						, p[i].y - p[i].collision.h/2 
						, p[i].collision.w
						, p[i].collision.h
						,"BROWN"
					);
				}else{
				//	g.kanji.print(p[i].id.substring(1,6)
				//	,p[i].x - p[i].collision.w/2
				//	, p[i].y - p[i].collision.h/2);
				}
			}
		}

		stageCtrl.draw(g);

		if (!result.govf){

			for (let o of GObj){
				o.draw(g);
			}
		}
		/*		
		//　DEBUG DRAW 
		if (true){
		let p = g.sprite.itemList();
		for (let i in p){
				if (false){
					g.screen[0].fill(
						p[i].x - p[i].collision.w/2
						, p[i].y - p[i].collision.h/2 
						, p[i].collision.w
						, p[i].collision.h
						,"green"
					);
				}
				g.font["std"].putchr(p[i].id,p[i].x, p[i].y);
				let st = ((p[i].living)?"L":"-") 
				if (p[i].visible) st += " A:" + p[i].alive;

				g.font["std"].putchr(st,p[i].x, p[i].y+8);
			}
		}
		*/
		watchdog.set();
	}
}// ----------------------------------------------------------------------
// GameTask
class GameTask_Main extends GameTask {

	_x = 0;	_y = 0;
	_sm = {}; //mouse status 
	_dtt = 0;//DELAYTRIGGER
	
	_result; //GameResult SCORE/ TIME etc 
	_titlef; //TitleScene 
	titlewait;//keyentryDelay
	
	_wh = 0;//wheel

	scene;//Scene

	_dv;//DebugStatusDrawFlag
	
	constructor(id){
		super(id);
	}
//----------------------------------------------------------------------
	pre(g){// 最初の実行時に実行。
		this.scene = [];

		this.scene[	"Game"	] = new SceneGame();
		this.scene[	"UI"	] = new SceneGameUI();
		this.scene[	"Debug"	] = new SceneDebug();
		this.scene[	"Result"] = new SceneResult();
		this.scene["GameOver"] = new SceneGameOver();
		this.scene[	"Title"	] = new SceneTitle();
		this.scene[	"Gpad"	] = new SceneGPad();

		
 	    //g.font["8x8white"].useScreen(1);
	    g.sprite.setPattern("Player", { image: "SPGraph",
	        wait: 0, pattern: [
                { x:0, y: 0, w: 32, h: 32, r: 0, fv: false, fh: false }
	            ]
	        }
        );

	    g.sprite.setPattern("Turlet", { image: "SPGraph",
	        wait: 0, pattern: [
                { x:0, y: 32, w: 32, h: 32, r: 0, fv: false, fh: false }
	            ]
	        }
        );

		g.sprite.setPattern("BULLET_P", { image: "SPGraph",
	        wait: 0, pattern: [
                { x:32 + 16, y: 32 + 16, w: 8, h: 32, r: 0, fv: false, fh: false }
	            ]
	        }
        );

		g.sprite.setPattern("BULLET_P2", { image: "SPGraph",
	        wait: 0, pattern: [
                { x:16, y: 16, w: 8, h: 32, r: 0, fv: false, fh: false }
	            ]
	        }
        );

	    g.sprite.setPattern("Enemy", {
	        image: "SPGraph",
	        wait: 10,
	        pattern: [
                //{ x:0, y: 96, w: 32, h: 32, r: 0, fv: false, fh: false }
				
                { x:32, y: 32, w: 32, h: 32, r: 0, fv: false, fh: false }
                ,{ x:32, y: 64, w: 32, h: 32, r: 0, fv: false, fh: false }
                ,{ x:32, y: 96, w: 32, h: 32, r: 0, fv: false, fh: false }
				
	            ]
    	    }
        );

	    g.sprite.setPattern("BULLET_E", { image: "SPGraph",
	        wait: 0, pattern: [
                { x: 32+16, y: 32+16, w: 4, h: 16, r: 0, fv: false, fh: false }
	            ]
	        }
        );

	    g.sprite.setPattern("ARMOR_P", { image: "SPGraph",
	        wait: 0, pattern: [
                { x: 0, y: 64, w: 32, h: 8, r: 0, fv: false, fh: false }
	            ]
	        }
        );
	    g.sprite.setPattern("ARMOR_E", { image: "SPGraph",
	        wait: 0, pattern: [
                { x: 0, y: 0, w: 2, h: 2, r: 0, fv: false, fh: false }
	            ]
	        }
        );
	    g.sprite.setPattern("FRIEND_P", { image: "SPGraph",
	        wait: 0, pattern: [
                { x:0, y: 0, w: 32, h: 32, r: 0, fv: false, fh: false }
	            ]
	        }
        );

		g.sprite.setPattern("POWERUP", { image: "SPGraph",
		wait: 0, pattern: [
				{ x: 0, y: 0, w: 2, h: 2, r: 0, fv: false, fh: false }
				]
			}
		);

	    g.sprite.setPattern("block", { image: "SPGraph",
	        wait: 0, pattern: [
                { x: 0, y: 0, w: 2, h: 2, r: 0, fv: false, fh: false }
	            ]
	        }
        );



		this.scene["Game"].init(g);
		this._initGame(g);
		this._sm = {x:0, y:0, old_x:0, old_y:0};//mouse移動有無のチェック用
	}

	_initGame(g){
		this.scene["Game"].reset(g);
		this._titlef = true;
		this.titlewait = g.time()+1000;

	}
//----------------------------------------------------------------------
	step(g){// this.enable が true時にループ毎に実行される。

		const RESO_X = 640;
		const RESO_Y = 480;

		// Input Keyboard ENTRY Check
	    let w = g.keyboard.check();

		let akey = false; if (Boolean(w[65])) {if (w[65]) akey = true;}
		let dkey = false; if (Boolean(w[68])) {if (w[68]) dkey = true;}
		let wkey = false; if (Boolean(w[87])) {if (w[87]) wkey = true;}
		let skey = false; if (Boolean(w[83])) {if (w[83]) skey = true;}
		let qkey = false; if (Boolean(w[81])) {if (w[81]) qkey = true;}
		let ekey = false; if (Boolean(w[69])) {if (w[69]) ekey = true;}

		let upkey	 = false; if (Boolean(w[38])) {if (w[38]) upkey	  = true;}
		let downkey  = false; if (Boolean(w[40])) {if (w[40]) downkey = true;}
		let leftkey  = false; if (Boolean(w[37])) {if (w[37]) leftkey = true;}
		let rightkey = false; if (Boolean(w[39])) {if (w[39]) rightkey= true;}

		let spacekey = false; if (Boolean(w[32])) {if (w[32]) spacekey= true;}
		let zkey = false; if (Boolean(w[90])) {if (w[90]) zkey= true;}

		let homekey = false; if (Boolean(w[36])) {if (w[36]) homekey = true;}
		let pkey = false; if (Boolean(w[80])) {if (w[80]) pkey = true;}

		// Input GamePad ENTRY Check
		let r = g.gamepad.check();

		let lb = g.gamepad.btn_lb;
		let rb = g.gamepad.btn_rb;
		let abtn = g.gamepad.btn_a;
		let xbtn = g.gamepad.btn_x;
				
		let backbtn = g.gamepad.btn_back;
		
		let ar = g.gamepad.r;
		let axes = g.gamepad.axes;

		upkey	= (upkey	|| wkey)?true:false;
		downkey = (downkey	|| skey)?true:false;
		leftkey = (leftkey	|| akey)?true:false;
		rightkey = (rightkey|| dkey)?true:false;

		let fullscr = (homekey || backbtn)?true:false;
		if (fullscr){
			if (!document.fullscreenElement){ 
				g.systemCanvas.requestFullscreen();
		   }
		}

		/* // Input Mouse ENTRY Check
	    let mstate = g.mouse.check();

		if ((mstate.x != this._sm.old_x)||(mstate.x != this._sm.old_x)){
			this._x = mstate.x;
			this._y = mstate.y;
			this._sm.old_x = mstate.x;
			this._sm.old_y = mstate.y;
		}
		let whl = false; 
		let whr = false;
		/* 
		if (mstate.wheel != 0) {
			whl = (Math.sign(mstate.wheel)<0)?true:false;
			whr = (Math.sign(mstate.wheel)>0)?true:false;
		}
		*/

		//Input Mixing
		if (r && (ar != -1)){

			//let vx = Math.trunc(axes[0]*30);
			//let vy = Math.trunc(axes[1]*30);

			//vx = (Math.abs(vx) > 3)? vx:0; vy = (Math.abs(vy) > 3)?vy:0; //StickのDrift対応　閾値10％

			this._x = axes[0];//this._x + vx;
			this._y = axes[1];//this._y + vy;
		}else{

			this._x = (leftkey)?-1:(rightkey)?1:0;//this._x + vx;
			this._y = (upkey)?-1:(downkey)?1:0;//this._y + vy;
		}

		let leftbutton = (lb || zkey || qkey);// || whl);
		let rightbutton = (rb || zkey|| ekey);// || whr);
		let trigger = (abtn || xbtn || spacekey);// || (mstate.button == 0));

		let input = {x: this._x, y:this._y, trigger: trigger, left: leftbutton, right: rightbutton, keycode: w};

		let param = this.scene["Game"].state();
		this._result = param.result;

		if (this._titlef){
			param.block = 0; param.sprite = 0;
			if (this.scene["Title"].step(g, input, {delay: this.titlewait} )){
				this._titlef = false; 
			}
		}else if (param.gameover){
			if (this.scene["GameOver"].step(g, input, param)){
				this._initGame(g);
			};
		} else 	this.scene["Game"].step(g, input);
		if (this._result.clrf) this.scene["Result"].step(g, input);

		this.scene["UI"].step(g, input, param);
		this.scene["Debug"].step(g, input, param);

		this._dv = (pkey)?true:false;
		if (this._dv) this.scene["Gpad"].step(g, input, param);

	}
//----------------------------------------------------------------------
	draw(g){// this.visible が true時にループ毎に実行される。

		if (!this._titlef)this.scene["Game"].draw(g);
		if (!this._titlef) this.scene["UI"].draw(g);
		if (this._dv) this.scene["Debug"].draw(g);
	
		if (this._result.clrf) this.scene["Result"].draw(g);
		if (this._result.govf) this.scene["GameOver"].draw(g);
		if (this._titlef) this.scene["Title"].draw(g);
		if (this._dv) this.scene["Gpad"].draw(g);
	}
}// main NONTITLE(PwrRnkup) 2024/04/13- dncth16
//----------------------------------------------------------------------
function main() {

    const sysParam = {
		canvasId: "layer0",
        screen: [ 
			{ resolution: { w: 640, h: 480 , x:0, y:0 } }
        ]
	}
	const game = new GameCore( sysParam );

	//Game Asset Setup
	pictdata(game);

	const spfd = SpriteFontData();
	for (let i in spfd) {
	    game.setSpFont(spfd[i]);
	}
    game.kanji = new fontPrintControl(
        game
        ,game.asset.image["ASCII"].img,	 6, 8
        ,game.asset.image["JISLV1"].img,12, 8
    )

    //Game Task Setup
	game.task.add(new GameTask_Main("main"));

	//
	game.screen[0].setBackgroundcolor("black");//"Navy"); 
    game.screen[0].setInterval(1); 
    
	game.run();
}

//----------------------------------------------------------------------
// SpriteFontData
function SpriteFontData() {

	let sp_ch_ptn = [];

    for (let i = 0; i < 7; i++) {
        for (j = 0; j < 16; j++) {
            ptn = {
                x: 12 * j,
                y: 16 * i,
                w: 12,
                h: 16
            }

            sp_ch_ptn.push(ptn);
        }
    }
    //12_16_font

    let sp8 = []; //spchrptn8(color)
    let cname = ["white", "red", "green", "blue"];

    for (let t = 0; t <= 3; t++) {

        let ch = [];

        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 16; j++) {
                ptn = {
                    x: 6 * j,
                    y: 8 * i + 16,
                    w: 6,
                    h: 8
                };
                ch.push(ptn);
            }
        }
        sp8[ cname[t] ] = ch;
    }
    //↑↑

    return [
        { name: "std"     , id: "ASCII", pattern: sp8["white"] }
        ,{ name: "8x8red"  , id: "ASCII", pattern: sp8["red"] }
        ,{ name: "8x8green", id: "ASCII", pattern: sp8["green"] }
        ,{ name: "8x8blue" , id: "ASCII", pattern: sp8["blue"] }
		,{ name: "8x8white", id: "ASCII", pattern: sp8["white"] }

    ]
}
//----------------------------------------------------------------------
//Image Asset Setup
function pictdata(g){
	g.asset.imageLoad( "SPGraph","pict/cha.png"	);
	//g.asset.imageLoad( "title"  ,"pict/TitleLogo.png" );

	g.asset.imageLoad( "JISLV1" ,"pict/k12x8_jisx0208c.png");
	g.asset.imageLoad( "ASCII"  ,"pict/k12x8_jisx0201c.png");
}//----------------------------------------------------------------------
//Scene
//----------------------------------------------------------------------
// UI
function SceneGameUI(){

	const X = 0;
	const Y = 480-32;

	const BAR_W = 640;
	//const BAR_Y = 32;

	let ene;
	let result;
	let time;

	this.step = function(g, input, p){

		ene = p.ene;
		result = p.result;
		time = p.time
	}
	this.draw = function(g){
		/*
		const BAR_Y = -16;
		g.screen[0].fill(X	,Y+BAR_Y  ,BAR_W,16,"white");
		g.screen[0].fill(X+1,Y+BAR_Y+1,BAR_W-2,14,"black");
		g.screen[0].fill(X+1,Y+BAR_Y+1,(BAR_W-2)*(ene.before	/ene.max), 14,"yellow");
		g.screen[0].fill(X+1,Y+BAR_Y+1,(BAR_W-2)*(ene.now	/ene.max), 14,((ene.now/ene.max)<0.2)?"red":"cyan");
		*/
		//g.font["std"].putchr("PLAYER:" + ene.now + " SCORE:" + Math.trunc(result.score) + " STAGE:" + result.stage + " TIME:" + time, X, Y);
		//g.font["std"].putchr("PLAYER:" + ene.now + " STAGE:" + result.stage, X, Y);
	
		let st="";for (let i=1; i<ene.now;i++)st+="▲";
		g.kanji.print("PLAYER:" + st, X, Y);
		g.kanji.print("STAGE :" + result.stage, X, Y+8);
		//g.kanji.print("強化：[正面][側面][僚機]", X, Y+16);

		//g.kanji.print("　　　[||| ][||| ][||| ][||| ][||| ]", X, Y+24);
	}
}
//----------------------------------------------------------------------
// TitleScene
function SceneResult(){

	const X = 640/2;
	const Y = 480-16;

	const BAR_X = 24;
	const BAR_Y = 480-16;
	

	const txt = [
		"[UPGRADE MENU]:"
	//	,"火力+"
	//	,"弾速+"
	//	,"装填速度+(連射速度)(RAPID)"
	//	,"旋回速度+(砲塔回転速度)"
	//	,"移動速度+(MOVE SPEED)"
	//	,"正面追加装甲(FRONT ARMOR)"
	//	,"側面追加装甲(SIDE ARMOR)"
	//	,"随伴機(OPTION)"
	//	,"舗装(FIELDDAMAGE RESET)"
	]

	let slot = 0;
	let pf 
	let runtime

	this.step = function(g, input){
		//Non Process (Draw Only)
		//UPGRADE MENU SELECT
		//if (g.time()%3==0) slot++;
		//slot = (slot < txt.length-2)?slot+1:0;

		//if (input.x <  0.5) slot = 1;
		//if (input.y != 0)   slot = 2;
		//if (input.x >  0.5) slot = 3;
	}
	this.draw = function(g){

		g.font["std"].putchr("STAGE CLEAR", X-100, Y-220, 3);
		g.font["std"].putchr("STAGE CLEAR", X, Y);

		//g.screen[0].fill(BAR_X + slot*36,BAR_Y,36,8,"blue");
		//g.screen[0].fill(BAR_X + slot*36,BAR_Y+8,36,8,"blue");
		//g.kanji.print(txt[slot],BAR_X,BAR_Y+8);
		/*
		for (let i in txt){
			g.kanji.print(txt[i],X,Y+16 +i*8);
		}
		*/
	}
}
//----------------------------------------------------------------------
// TitleScene
function SceneTitle(){

	const X = 640/2 -160;
	const Y = 480/2 -100;

	let inp;

	const Title = [
		"テーマ  アップグレード/強化(土日スレ16)"
		,""
		,"     TANK BATTLE Style/ERA-TANK"
		,""
		,""
		,""
		,""
		,""
		,"           START SPACE KEY"
		,"                     or GamePad Button X/A"
		,""
		,""
		,""
		,"[操作]移動    : WASD or 矢印キー or GamePad 左アナログスティック"
		,"      攻撃    : SPACE key or GamePad Button X/A"
		,"攻撃方向の固定: Z key  or GamePad Button L/R"
		,"停止時砲塔旋回: Q,Ekey or GamePad Button L/R"
		,""
		,""
		,"敵を倒すと出てくるアップグレードパーツ(弾を当てて切り替え)"
		,"[ -  /None] 効果なし "
		,"[正面/FWD ] 正面追加装甲"
		,"[側面/SIDE] 側面追加装甲"
		,"[子機/ OPT] 有線ドローン(OPTION)"
		,"[弾種/CHNG] 弾の種類切り替え(通常<->ブロック貫通)"
		,"  注：重複効果はありません。"
	];

	this.step = function(g, input, p){
		inp = input;

		delay = ((p.delay - g.time()) <0);

		let rf = false;
		if (delay){
			if (input.trigger) rf = true;
		}	
		return rf;
	}
	this.draw = function(g){

		for (let i in Title){
			g.kanji.print(Title[i], X, Y+i*8);
		}

		/*
		//g.screen[0].putImage(g.asset.image["title"].img,X-250, Y-100	);
		g.font["std"].putchr("TANK BATTLE Style/ERA-TANK",			X, Y+8	);
		g.kanji.print("ゲームタイトルを表示させる場所/戦車風味/爆発反応装甲",X, Y+16	);
		g.font["std"].putchr("START SPACE KEY",			X, Y+80		);
		g.font["std"].putchr("or GamePad Button X/A",		X, Y+88		);
		g.kanji.print("[操作]移動 WASD or 矢印キー or GamePad 左アナログスティック",X, Y+128		);
		g.kanji.print("攻撃 スペースキー or GamePad Button X/A",		X, Y+136		);
		g.kanji.print("砲塔攻撃方向の固定 Zキー or GamePad Button L/R",	X, Y+144		);
		g.kanji.print(" ",		X, Y+88		);
		*/
	}
}
//----------------------------------------------------------------------
// GameOverScene
function SceneGameOver(){

	const X = 640/2;
	const Y = 480-32;//32;//480/2;

	let stage;
	let score;
	let delay;

	this.step = function(g, input, p){

		stage = p.stage;
		score = Math.trunc(p.score);
		delay = ((p.delay - g.time()) <0);

		if (delay){
			g.sprite.itemFlash();
			if (input.trigger){
				return true;
			};
		}
	}
	this.draw = function(g){

		g.font["std"	].putchr("GAME OVER",		 X-100, Y-200,4	);
		//g.font["std"	].putchr("STAGE:" + stage,	 X-80, Y,	);
		//g.font["std"	].putchr("SCORE:" + score, X-80, Y+30	);
		g.font["8x8white"].putchr(":" + (delay?"OK":"WAIT") , X, Y+8);
	}
}
//----------------------------------------------------------------------
// DEBUGScene(DeltaTime)
function SceneDebug(){

	const X = 640 - 100;
	const Y = 0;

	let block;
	let deltatime;
	let collision;
	let sprite;
	let input;

	this.step = function(g, i, p){

		block	= p.block;
		deltatime= g.deltaTime().toString().substring(0, 5);
		collision= p.collision;
		sprite	= p.sprite;
		input = i;
	}
	this.draw = function(g){

		//g.screen[0].fill(1024 - 100, 0,100,32,"black");

		//g.font["8x8white"	].putchr("block:"	 + block	,X, Y+24);
		g.font["8x8white"	].putchr("DeltaT:"	 + deltatime,X, Y	);
		//g.font["8x8red"		].putchr("Sprite:"	 + sprite	,X, Y+ 8);
		let IX = (input.x != 0)?((input.x > 0)?"R":"L"):"-";
		let IY = (input.y != 0)?((input.y > 0)?"D":"U"):"-";
		let T = (input.trigger)?"T":"-";
		//let L = (input.left)?"S":"-";
		let S = (input.right)?"S":"-";
		g.font["8x8green"	].putchr("Input:" + IY + ":" + IX + ":" + T + ":" + S , X, Y+16);
	}
}
//----------------------------------------------------------------------
// GPadScene(I/Ostatus)
function SceneGPad(){

	const X = 0;
	const Y = 48;

	let st;

	this.step = function(g, i, p){

		st = g.gamepad.infodraw()

		let k = i.keycode;

		let ws = ""
		for (let i in k){
			if (Boolean(k[i])){
				ws += "[" + i + "]";//+ (k[i]?"o":".");
			}
		} 
		st.push("");
		st.push("[Keyboard]");
		st.push(ws);
	}
	this.draw = function(g){

		for (let i in st){
			g.font["8x8white"].putchr(st[i],X, Y+i*8);
		}
	}
}
// GameSpriteControl
// BLOCKDROP operation Version 
// (editstart 2024/04/12) /r2: ERT-T op ver 2024/04/21

/*
//r2 new future
.normalDrawEnable (true/false)
.customDraw(g,screen){}
.moveFunc
example. ERT-T GameObj_GradeUpItem()

//system Method
.manualDraw = function (bool) (modeChange)
.useScreen = function( num )
.setPattern = function (id, Param) 

//Speite Function Method
.itemCreate = function(Ptn_id, col=false, w=0, h=0 ) return item
.itemList = function() return SpriteTable
.itemFlash = function()
.itemIndexRefresh = function()
.CollisionCheck = function()

.spriteItem
    .view()/Hide() visible true/false
    .pos = function(x, y, r=0, z=0)
    .move = function(dir, speed, aliveTime)
    .stop = function()
    .dispose = function()
    .put = function (x, y, r, z) 
    //.reset = function()
*/

function GameSpriteControl(g) {
    //
    //let MAXSPRITE = 1000;
    //screen size (colision check)

    let sprite_ = [];
    let pattern_ = [];

    let buffer_;
    let activeScreen;

    let autoDrawMode = true;

    function SpItem(){

        this.x  = 0;
        this.y  = 0;
        this.r  = 0;
        this.z  = 0;
        this.vx = 0;
        this.vy = 0;
        this.priority = 0;
        this.collisionEnable = true;
        this.collision = {w:0,h:0};
        this.id = "";
        this.count = 0;
        this.pcnt = 0;
        this.visible = false;
        this.hit = [];
        this.alive = 0;
        this.index = 0; 
        this.living = true;
        this.normalDrawEnable = true;
        this.beforeCustomDraw = false;
     
        this.customDraw = function(g, screen){};
        this.moveFunc;

        this.view = function (){ this.visible = true; }
        this.hide = function (){ this.visible = false;}

        this.pos = function(x, y, r=0, z=0){
            this.x = x; this.y = y; this.r = r; this.z = z;
        }

        this.move = function(dir, speed, aliveTime){
            this.visible = true;
            let wr = ((dir - 90) * (Math.PI / 180.0));
            this.vx = Math.cos(wr)*speed;
            this.vy = Math.sin(wr)*speed; 
            this.r = dir;
            this.alive = aliveTime;
        }

        this.moveFunc = normal_move;//normal_move;
        function normal_move(){
            this.alive--;

            this.x += this.vx;
            this.y += this.vy;

            if (this.alive <= 0) {
                this.visible = false;
            }else{
                this.visible = true;
            }
        }
        
        this.stop = function(){
            this.alive = 0;
            this.vx=0; this.vy=0;
        }
        this.dispose = function(){
            this.alive = 0;
            this.visible = false;
            //上の2つで表示も処理もされなくなる
            this.living = false;
        }
        this.put = function (x, y, r=0, z=1) {
    
            if (!Boolean(pattern_[this.id])){
                buffer_.fillText( this.index + " " + this.count , x, y);
            }else{
                spPut(pattern_[this.id].image, pattern_[this.id].pattern[this.pcnt], x, y, r, z);
                this.count++;
                if (this.count > pattern_[this.id].wait) { this.count = 0; this.pcnt++; }
                if (this.pcnt > pattern_[this.id].pattern.length - 1) { this.pcnt = 0; }
            }
        }
        //内部処理用
        this.reset = function(){

            this.x  = 0;
            this.y  = 0;
            this.r  = 0;
            this.z  = 0;
            this.vx = 0;
            this.vy = 0;
            this.priority = 0;
            this.collisionEnable = true;
            this.collision = {w:0,h:0};
            this.id = "";
            this.count = 0;
            this.pcnt = 0;
            this.visible = false;
            this.hit = [];
            this.alive = 0;
            this.index = 0; 
            this.living = true;
            this.normalDrawEnable = true;
            this.customDraw = function(g,screen){};
            this.beforeCustomDraw = false;
            this.moveFunc = normal_move;
        }

        this.debug = function(){

            let st = [];
            const o = Object.entries(this);

            o.forEach(function(element){
                let w = String(element).split(",");

                let s = w[0];
                if (s.length < 13){
                    s = s + " ".repeat(13);
                    s = s.substring(0, 13);
                }
                let s2 = w[1].substring(0, 15);
                st.push("."+ s + ":" + s2);
            });
            st.push("");
            st.push("Object.entries end.");
    
            return st;
        }
    }
    //New add Methods ============================
    this.itemCreate = function(Ptn_id, col=false, w=0, h=0 ){
        const item = new SpItem();
        let n = sprite_.length;
        sprite_.push(item);
        
        item.reset();
        item.index = n;

        item.id = Ptn_id;
        item.count = 0;
        item.pcnt = 0;

        item.collisionEnable = col;
        item.collision = { w: w, h: h };

        //let st = item.debug();
        //for (let s of st) console.log(s);
        //default visible:false alive:0

        return item;
    }
    this.itemList = function(){
        return sprite_; 
        //基本Index＝配列番号のはず      
    }
    this.itemFlash = function(){
        sprite_ = [];
    }
    this.itemIndexRefresh = function(){
        //disposeしたSpItemを削除してIndexを振り直す
        let ar = [];
        for (let i in sprite_) if (sprite_[i].living) ar.push(sprite_[i]);
        for (let i in ar) ar[i].index=i;

        sprite_ = ar;
        return sprite_
    }
    //----
    this.manualDraw = function (bool=true) {

        if (bool) {
            autoDrawMode = false;
        } else {
            autoDrawMode = true;
        }
    }

    this.useScreen = function( num ){
        //buffer_ = g.screen[num].buffer;
        activeScreen = g.screen[num];
        buffer_ = activeScreen.buffer;
    }

    this.setPattern = function (id, Param) {
        
        pattern_[id] = { image: g.asset.image[ Param.image ].img, wait:Param.wait, pattern:Param.pattern }
        
    }

    //FullCheck return spitem[].hit(array)<-obj
    this.CollisionCheck = function(){
        //総当たりなのでパフォーマンス不足の場合は書き換える必要有。
        let checklist = [];
        for (let i in sprite_) {
            let sp = sprite_[i];
            if (sp.living){//visibleではない場合での当たり判定有の場合がある可能性を考えて処理
                if (sp.collisionEnable) {
                    checklist.push(sp);
                }
            }
        }
        for(let i in checklist){
            let ssp = checklist[i];
            ssp.hit = [];
            for(let j in checklist){
                if (!(i == j)){
                    let dsp = checklist[j];

                    if ((Math.abs(ssp.x - dsp.x) < ((ssp.collision.w/2) + (dsp.collision.w/2)))
                        && (Math.abs(ssp.y - dsp.y) < ((ssp.collision.h/2) + (dsp.collision.h/2)))) {
                            ssp.hit.push(dsp);
                    }
                }
            }
        }
    }

    //Inner Draw Control Functions
    function spPut(img, d, x, y, r, z, alpha) {

        //let simple = true;

        if (!Boolean(r)) { r = d.r; }
        if (!Boolean(alpha)) { alpha = 255; }
        if (!Boolean(z)) { z = 1.0; }

        let simple = ((!d.fv) && (!d.fh) && (r == 0) && (alpha == 255));

        //let simple = false;
        if (simple) {
            buffer_.drawImgXYWHXYWH(
                img,
                d.x, d.y, d.w, d.h,
                x + (-d.w / 2) * z,
                y + (-d.h / 2) * z,
                d.w * z,
                d.h * z
            );

        } else {

            let FlipV = d.fv?-1.0:1.0;
            let FlipH = d.fh?-1.0:1.0;

            buffer_.spPut(
                img,
                d.x, d.y, d.w, d.h,
                (-d.w / 2) * z,
                (-d.h / 2) * z,
                d.w * z,
                d.h * z,
                FlipH, 0, 0, FlipV,
                x, y,
                alpha, r
            );

            //buffer_.fillText(r+" ", x, y);
        }
    }

    //Game System inner Draw Call Function
    const pbuf = new priorityBuffer();

    this.allDrawSprite = function () {

        if (autoDrawMode) {
            pbuf.reset();
            for (let i in sprite_) {
                let o = sprite_[i];
                if (o.living) {
                    //if (dev.gs.in_stage(o.x, o.y)){
                    //画面内であることのチェックはシステム側にないので保留)
                    pbuf.add(o);
                }
            }
            pbuf.sort();
            let wo = pbuf.buffer();

            for (let i in wo) {
                let sw = wo[i];

                if (sw.alive > 0) {
                    sw.moveFunc();
                    /*
                    sw.alive--;

                    sw.x += sw.vx;
                    sw.y += sw.vy;

                    if (sw.alive <= 0) {
                        sw.visible = false;
                    }else{
                        sw.visible = true;
                    }
                    */
                }

                //buffer_.fillText(i + " " + sw.visible, sw.x, sw.y);
                if (sw.visible) {
                    if (sw.beforeCustomDraw) sw.customDraw(g, activeScreen);
                    if (sw.normalDrawEnable){
                        if (!Boolean(pattern_[sw.id])) {
                            buffer_.fillText(i + " " + sw.count, sw.x, sw.y);
                        } else {
                            spPut(pattern_[sw.id].image, pattern_[sw.id].pattern[sw.pcnt], sw.x, sw.y, sw.r, sw.z);
                            sw.count++;
                            if (sw.count > pattern_[sw.id].wait) { sw.count = 0; sw.pcnt++; }
                            if (sw.pcnt > pattern_[sw.id].pattern.length - 1) { sw.pcnt = 0; }
                        }
                    }
                    if (!sw.beforeCustomDraw) sw.customDraw(g, activeScreen);
                }
            }
        }
    }
    //priorityBufferControl
    //表示プライオリティ制御
    function priorityBuffer(){
        // .Priorityでソートして表示
        // 0が一番奥で大きい方が手前に表示される(allDrawSpriteにて有効)
        let inbuf = [];
        this.add     =( obj )=>{ inbuf.push(obj);}
        this.sort    =() =>    { inbuf.sort((a,b)=> a.priority - b.priority );}
        this.buffer  =()=>     { return inbuf; }
        this.reset   =()=>     { inbuf = []; }
    }
}function StageControl(game){

	const ROW = 60;
	const COL = 80;

	const RESO_X = 640;
	const RESO_Y = 400;

	let block;
	let blkcnt;
	let rank;

	let g = game;

	this.init = function(){

		rank = 1;
		block = resetblock({on:false, break:false, hit:false, hp:5});

	}

	this.change = function(stage, GObj){

		rank = stage;

		//if (stage%10==1){
		//block = resetblock({on:false, break:false, hit:false, hp:5});

		//setblock( 1, 1, 78, 50,{on:false, break:false, hit:false});
		//setblock(20,20, 40, 10,{on:true, break:false, hit:false});
		//setblock(20,20, 40, 10,{on:true, break:false, hit:false, hp:5});
		//}


		// 0000003F MAPDATA
		// 00000FB0 FORMAT
		// 0003F000 
		// 00FB0000
		// 3F000000
		//let mapform = "3FFFFFFF";
		//let mapform =   "0048C480";//X

		const mapform = [
			"00000000"
			,"0000C000"
			,"00000080"
			,"00000400"
			,"00080000"
			,"00400000"
			,"00021000"
		]
		//let mapform = "00000020";
		//let mapform =   "00000480";//- -
		//let mapform =   "00480000";//- - 
		//let mapform =   "00480480";

		mapping(mapform[rank%7]); 

		let enemy = new GameObj_FlyCanon();
		enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
		//enemy.spriteItem.move(120,1,180);
		//enemy.spriteItem.view();
		
		let t = (rank%2==0)?-1:1;
		let d = (Math.trunc(rank/10)+1)
		let rn = Math.trunc(Math.random()*300);

		enemy.spriteItem.pos(320+t*160,30);

		enemy.init(g,1000/d + rn,(10/d)*t);

		GObj.push(enemy);

		if (rank >= 3){
			rn = Math.trunc(Math.random()*300);
			enemy = new GameObj_FlyCanon();
			enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
			enemy.spriteItem.pos(320,30);
			enemy.spriteItem.move(180, 2, 1000);
			enemy.init(g,1000/d+rn,5*t);
			GObj.push(enemy);
		}
		if (rank >= 5){
			rn = Math.trunc(Math.random()*300);
			enemy = new GameObj_FlyCanon();
			enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
			enemy.spriteItem.pos(320-t*160,30);
			enemy.init(g,1000/d+rn,(10/d)*-t);
			GObj.push(enemy);
		}
		if (rank >= 7){
			rn = Math.trunc(Math.random()*300);
			enemy = new GameObj_FlyCanon();
			enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
			enemy.spriteItem.pos(320-t*280,30);
			enemy.spriteItem.move(180, 2, 1000);
			enemy.init(g,1000/d+rn,(10/d)*-t);
			GObj.push(enemy);

			rn = Math.trunc(Math.random()*300);
			enemy = new GameObj_FlyCanon();
			enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
			enemy.spriteItem.pos(320+t*280,30);
			enemy.spriteItem.move(180, 2, 1000);
			enemy.init(g,1000/d+rn,(10/d)*t);
			GObj.push(enemy);

		}
	}

	function resetblock(sw){

		let blk = new Array(ROW);
		for (let j=0; j<ROW; j++){
			blk[j] = new Array(COL);
			for (let i=0; i<COL; i++){
				blk[j][i] = {}//new sw;
				blk[j][i].on = sw.on;
				blk[j][i].break = sw.break;
				blk[j][i].hit = sw.hit;
				blk[j][i].hp = sw.hp;
			}
		}
		return blk;
	}

	function setblock(x, y, w, h, sw){

		//let blk = new Array(ROW);
		for (let j=y; j<y+h; j++){
			//blk[j] = new Array(COL);
			for (let i=x; i<x+w; i++){
				//blk[j][i] = {}//new sw;
				block[j][i].on = sw.on;
				block[j][i].break = sw.break;
				block[j][i].hit = sw.hit;
				block[j][i].hp = sw.hp;
			}
		}
	}

	function mapping(mds){
		const W = Math.trunc(COL/6);
		const H = Math.trunc(ROW/5);

		let n = parseInt(mds, 16); 
		for (let j=0; j<5; j++){
			for (let i=0; i<6; i++){
				if ((n&1)!=0) {
					setblock(i*W, j*H, W, H,{on:true, break:false, hit:false, hp:1});
				}
				n = n>>1;
				//console.log(n);
			}
		}
	}

	this.step = function(g, input, result){

		

		let spriteTable = g.sprite.itemList();

		//---------------------breakcheck(block sprite hit check
		for (let i in spriteTable){
			let p = spriteTable[i];

			let sp = spriteTable[i];
			if (!sp.living) continue;
			if (!sp.collisionEnable) continue;
			if (!sp.visible) continue;

			let w = p.collision.w;
			let h = p.collision.h;
			for (let cx = Math.trunc((p.x-(w/2))/8); cx <= Math.trunc((p.x+(w/2))/8); cx++){
				for (let cy = Math.trunc((p.y-(h/2))/8); cy <= Math.trunc((p.y+(h/2))/8); cy++){
					//console.log("loop" + cx + "," + cy);
					mapCheck(p, cx,cy);
				}
			}
		}
		//---
		function mapCheck(p, cx, cy){
			if (cy>=0 && cy < block.length){
				if (cx>=0 && cx < block[cy].length){
					if (block[cy][cx].on){
						if (p.id == "BULLET_P"){
							block[cy][cx].hp--;
							if (block[cy][cx].hp < 0){
								block[cy][cx].on = false;
								block[cy][cx].break = true;
								block[cy][cx].hit = false;//true;
							}
							p.dispose();
							//result.score ++;
						}

						if (p.id == "BULLET_P2"){
							block[cy][cx].hp--;
							if (block[cy][cx].hp < 0){
								block[cy][cx].on = false;
								block[cy][cx].break = true;
								block[cy][cx].hit = false;//true;
							}
							//p.dispose();
							//result.score ++;
						}

						if (p.id == "BULLET_E"){
							block[cy][cx].hp--;
							if (block[cy][cx].hp < 0){
								block[cy][cx].on = false;
								block[cy][cx].break = true;
								block[cy][cx].hit = false;//true;
							}
							p.dispose();
						}
						/*
						if (p.id == "block"){
							if (cy>=1){
								block[cy-1][cx].on = true;
								block[cy-1][cx].break = false;
								//this._bhtm[cy-1][cx] = false;
								p.dispose();
							}
						}
						*/
						if (p.id == "Player"){
							p.wall = true;
							block[cy][cx].on = false;
							block[cy][cx].break = true;
							block[cy][cx].hit = true;
						}
						//console.log("cx,cy" + cx + "," + cy);
						if (p.id == "ARMOR_P"){
							p.wall = true;
						}
						if (p.id == "Enemy"){
							p.wall = true;
						}
					}
					if (block[cy][cx].hit){
						if (p.id == "Player"){
							p.slow = true;
						}
						if (p.id == "Enemy"){
							p.slow = true;
						}
					}
				}
			}
		}
	}

	this.mapDamage = function(sp){
		let p = sp;
		let w = p.collision.w;
		let h = p.collision.h;
		for (let cx = Math.trunc((p.x-(w/2))/8); cx <= Math.trunc((p.x+(w/2))/8); cx++){
			for (let cy = Math.trunc((p.y-(h/2))/8); cy <= Math.trunc((p.y+(h/2))/8); cy++){
				//console.log("loop" + cx + "," + cy);
				if ((cx>=0 && cx<COL) && (cy>=0 && cy<ROW)){
					block[cy][cx].hit = true;
				}
			}
		}
	}

	this.draw = function(g){

		let l = (Math.trunc(g.time()/250)%2);
		blkcnt = 0;
		for (let j=0; j<ROW; j++){
			for (let i=0; i<COL; i++){
				if (block[j][i].on){
					if (block[j][i].hp != 0){
						g.screen[0].fill(i*8,j*8,8,8,"lightgray");//"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",128)");
						g.screen[0].fill(i*8,j*8,7,7,"gray");//"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",128)");
					}else{
						g.screen[0].fill(i*8+1,j*8+1,5,5,"gray");//,"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",255)");
					}
					blkcnt++;
				}
				/*
				if ((!block[j][i].break)&&(!block[j][i].hit)){
					if (true){
						g.screen[0].fill(i*16+2,j*16,7,3,"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",255)");
					}else{
						g.screen[0].fill(i*32+3,j*32,23,7,"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",255)");
					}
					//g.screen[0].fill(i*32,j*32,15,15,"rgb(" + (i*8)%64 + "," + (j*8)%64 + ",127)");
				*/
				if (block[j][i].hit){
					if (l==0){
						g.screen[0].fill(i*8+4,j*8+4,2,1,"red");//"rgb(" + (i*8)%64+128 + "," + (j*8)%64+128 + ",127)");
					}else{
						g.screen[0].fill(i*8+4,j*8+4,1,1,"red");//"rgb(" + (i*8)%64+128 + "," + (j*8)%64+128 + ",127)");
					}
					//g.screen[0].fill(i*32+14,j*32+2,4,2,"rgb(" + (i*8)%64+128 + "," + (j*8)%64+128 + ",127)");
				}
				
			}
		}
	}
   
}