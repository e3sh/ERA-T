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
            turlet = (360 + turlet + vr)%360;
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

    this.r = 0;
    this.vr = 0;
    this.x = 0;
    this.y = 0;

    this.old_X = 0;
    this.old_y = 0;

    this.triggerDelay = 0;

    let status = {speed:0, charge:0, power:0 };

    this.mode = 0;
    this.blink = true;

    this.spriteItem;
    let reexf;

    this.init = function(g){

        this.r = this.spriteItem.r;
        this.vr = 0;
        this.x =  this.spriteItem.x;
        this.y =  this.spriteItem.y;
        this.old_X = this.x;
        this.old_y = this.y;
        this.triggerDelay = 0;

        this.mode = 0;
        this.spriteItem.mode = this.mode;
  
        reexf = false;
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
        //console.log("pw-run" + this.triggerDelay );
        if (result.clrf && (result.time + 750 > g.time())){
            let r = Search(g, this.x, this.y);
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
        this.x = this.spriteItem.x;
        this.y = this.spriteItem.y;
        this.r = this.spriteItem.r;

        if (this.x < 32)	this.spriteItem.x = 32;
        if (this.x > RESO_X-32)	this.spriteItem.x = RESO_X-32;
        if (this.y < 32)	this.spriteItem.y = 32;
        if (this.y > RESO_Y-32)	this.spriteItem.y = RESO_Y-32;
    }

    this.draw = function(g){

        const st  = [
            [" --","正面","側面","子機","弾種"]
            ,["None","FWD","SIDE"," OPT","CHNG"]
        ];
        const col = [
            ["black","peru","navy","teal","indigo"]
            ,["rgb(64,64,64)","orange","blue","green","blueviolet"]
        
        ];

        //console.log("pw-draw" + this.triggerDelay );

        let n = (this.blink)?0:1;

        if (this.spriteItem.living){
            this.spriteItem.view();
            let p = this.spriteItem;
            const x = Math.trunc(p.x - p.collision.w/2);
            const y = Math.trunc(p.y - p.collision.h/2);
            const w = p.collision.w;
            const h = p.collision.h;
            g.screen[0].fill(x, y, w, h, "white");
            g.screen[0].fill(x+1, y+1, w-2, h-2, col[n][ this.mode ]);
            g.kanji.print(st[n][this.mode], x+2, y+4);
            //console.log(this.mode + "," );
            //console.log("x," + p.x + "," + p.collision.w/2   );
            //console.log("y," + p.y + "," +  p.collision.h/2 );
        }
    }
} 