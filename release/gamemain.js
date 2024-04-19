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
                let sp = g.sprite.itemCreate("BULLET_P", true, 8, 8);

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
            [" --","正面","側面","子機"]
            ,["None","FWD","SIDE"," OPT"]
        ];
        const col = [
            ["black","peru","navy","teal"]
            ,["rgb(64,64,64)","orange","blue","green"]
        
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

					if (spitem.id == "BULLET_P"){
						//spitem.vx = spitem.x - myship.x//vx*-1;//.05;
						//spitem.vy = spitem.y - myship.y//spitem.vy*-1;//.05;
	//					console.log("h" + spitem.id);
						stageCtrl.mapDamage(sp);
	
						let powup = new GameObj_GradeUpItem();
						powup.spriteItem = g.sprite.itemCreate("POWERUP", true, 28, 16);
						powup.spriteItem.pos(sp.x,sp.y);
						powup.init(g);
				
						GObj.push(powup);
						sp.dispose();
						spitem.dispose();
					}
				}
			}

			//弾の相殺
			if (sp.id == "BULLET_P"){
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

					if (spitem.id == "BULLET_P"){
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

					if (spitem.id == "BULLET_P"){
						//console.log("in:" + sp.mode);	
						sp.mode++;
						/*
						if (isNaN(sp.mode)){
							sp.mode++;
						}else{
							sp.mode=0;
							console.log("pwr "+ sp.mode);
						}
						*/
						//console.log("pwr "+ sp.mode);
						if (sp.mode>3)  sp.mode = 0;
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

		let leftbutton = (lb || zkey);// || whl);
		let rightbutton = (rb || zkey);// || whr);
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
		,"正面追加装甲(FRONT ARMOR)"
		,"側面追加装甲(SIDE ARMOR)"
		,"随伴機(OPTION)"
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
		,"      攻撃    : スペースキー or GamePad Button X/A"
		,"攻撃方向の固定: Zキー or GamePad Button L/R"
		,""
		,""
		,""
		,"敵を倒すと出てくるアップグレードパーツ(弾を当てて切り替え)"
		,"[ -  /None] 効果なし "
		,"[正面/FWD ] 正面追加装甲"
		,"[側面/SIDE] 側面追加装甲"
		,"[子機/ OPT] 有線ドローン(OPTION)"
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
function StageControl(game){

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
		if (rank >= 7){
			rn = Math.trunc(Math.random()*300);
			enemy = new GameObj_FlyCanon();
			enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
			enemy.spriteItem.pos(320-t*160,30);
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
//----------------------------------------------------------------------
//Image Asset Setup
function pictdata(g){
	g.asset.imageLoad("SPGraph"
		,"data:image/png;base64,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"
	);
	g.asset.imageLoad( "JISLV1" 
		,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABGgAAAF4CAYAAAAIZM8MAAAAAXNSR0IArs4c6QAAIABJREFUeJzsXdt23LiutM/K//+yz0u0F4OpGyiq3U5QL90iQaBwlSx7Mp8fg7fB19fXV137/Pz8TM4xuXVPySEeiWyHy865ur6j38XHnd/x5wlcfuzG+Dv0r/F9ZRyfitG7Ie2bV9juzJd3zI3jtTsXkxm86n5i/p6IueJ1l/N6rfQrmdTOaf5Vz+n4p/XTvc+vZ+vaE/P/Cf3Ixun6eXpeJfq/c8538E582LPHdz2TdLBT00xulU393ZkhnfmDnh2u78kzRYffU88lnZnC4p88c6TPWLt13YlPXXviXn2n9pxcXUty9pT8eu5d59CPw9dvnJZnMnfOov2Tsrt87srv6H7SRsqjUztMnvnztP66z66rfrfm9DsoH5hsN1bvitOxvGu/U3vPMNrHU9xfOXufqoedudLV/6R858yd2nwi/q+onyfjj2TV+Z3Z/G712cVubb7bvN29dyO/dvPUPZueUTwTGwmX1K7S6WSfqpmdOVU/2fk7dY+QyCW6k7W6nsaJcU/rwenuXivfdupL4U7tsf2U/7qWxr+rH+0puUED3UDeDXxy9nRi/5Zi6QytV+LpGnpS3sU00ZUMLTYMme110CW81fq71InCbr6U3E7dPMnplUjr9o5eV/d37ZyUu3Pm3eQ7Z3Zr8wn9OzVx98xp+Vr76Uy/M4e+Wz7R5+C4nOTU5bPLP/Wxe6ajL7VX1+p3tHYSKw+kX8VCrSVcu/7sxEL5dlLenWFy7ky3lqvcTh52/Ej4rJ/OJvO7fu/GpZ7prDOksUAx2NVf91V8VDyu618J+b8ZVzDSPzHq/inSnT9rvnP+Dv6WP7eqfryLX90/RX83+VSXk6lA9tUgW2U/P/l/mqX8QueuNcZ/9SG9AaxnKje1j9DJk4oL0+eun8YOn53crzglo86o86ncoIed+3v3zOl+rDp39ae2XoV34eGAZnpdq/PI6VT9/cQ8v8Onc/ayl/C5Oz+ZLnYvTux1zzzVU7s80LqSfeI+t1NLndlavye+1Pic/Dlvdy6vXE7XD8sxs1V7pntPWs86mZ1YJutO56tx5zn1QvX7ZS9oOg1yZ6C/G3Z8eaeHqsFz6N7sv1u+M3y7N6SdYbbKJfw7OP2gcer8jn8uLnW9Pty8ehYhPuqaran1wb+B7sP0E/21o3/Vuav/pzxHJC8UXondh+pX4OLSmeeJTidT7+dOR/JDVefenpxBeXP8d++/J3vL/eDr8pxw+QlzAKH7HInO7sxE9xycclB6T/6c2/URPTMnfGrv1DO7z46VRzLjUB6+s84T312cj9TE12905NH39MxpPnewY+vdHkAG74PTtfRVkOhL5Ovebv93+Dh9TC5d63L7btzletrX3Zr4STH/SUhmw67eTm6fvj/u+PGK2nwi/p1np53nrB1eT83zuzZOy+5weRLvNm9P3I9QPpKaeTUUTyafru/k9UvAnX03KP93/eyc6ehG3JQv6iw7o3xG+tma8rd77eLNkJ6r/nVy5uQTPUx3koOufrTH5G69bfr66v1L2h8fz/yrxh3dd9G11fVl58yOjcE+kqHzr+Yjic2F5C3/ybfMcAD+kDyd6vGTs6LqSnXPvHoOqmfuxlz13Z17cO1LpV/JpHYe+83VxzPxX88m+k/319Nzk90zus+W6tyd+nlFPCuqvSf7egfvNMO78XzH57eV09M/L7wjEv93/Tz9XFLvFbvc3f2o82zF5ltyX+v6XaF6ayeebm/3Pt69jz0tv5776f07GAwGg8FgMBgMBoPBYPDXYutN5avfWHffML0Df/YbLfUmtaP/lTgd/8Hg3eF6sjMf3uk3nJ3ZOD38M5Dk9OT99QQnJHOnZt/9N+SDn4/Tv4m/ZK/vp868qv7f8TlP+f5uXBXSumB/zfGTfP3J2M3TtXb659on/8LoafnkL3T+BnTm8x//SPB60DX63RcgKa7kdpOs5JU+tH7JM5tIz2pDvZxh53fwRAMn8exiHqAHd/HkC5RurXd/EO1yetULoPQH5sH7ILk/du93J+A4qftsuq70KG4nn08G/wZO9wn7ga2uOR47z5S1/nefx3afJZ3Pu7Hp8Ora2JHfnbedn3Xmfv19SOO/rnd+nlXPjafznM6ep+TrDFrjlXnwM9Dt7V/XhRL8+JgfmHewNqJ7WE10dewhGzs31NSHweBVeMULlCfxjvy7PxgPBhfc8wN7yGTn1D3sLtfBoIsnXs6oFx7K3hPPgbsvWhyHKp++3Kg/nH3+hju3+2KjrqkfvNGzcCemcy/9e3DVwXrt5LrPVOzFxekzSX8l8+mO/OC/+JU+9HxHkFebSWFXX9yNTg1iJo/Wu7zrtbpZJH4q+6u8OqcaUsnsYJp1cBeuB1D9DwZ/Ezr3x/R+1/3hC10rnrs/RHXu19Pvg1N44rnX6WP79YfBU8+33Z7vxMO9DEls1jnX0bHLUXFyz++DfwPdnx+dzKqnnrvW1QsUxuknvCBhP1//6/iVBubVCWZvpbs3mfQmlhRxjZVrxtU+usnsQp3vxu0knnogGAwqOvXRuSFe8idfAE0tD05jZ84n97tur7A1pvPO80Z6v97xYTCoeKcfbNCz1SndXR87/bv2u1pTdpDf6w+8Oz6s+jpn0fx5pzoZvAY799+1dlb56/uq55JHz6aKV1qH7D7+nXVce3rw+9+gUYGZwbOP+lLm6QZIH86fsr8OnO9u9sHfi1e8QDn5AgjJv4J/+sJ0MLgD90CK5NXL+6nRwXfjJ9Rh8sNa8kKz+8J053632vn8jbpW+bi1qjvlxX4wVjZ2XzJ1uQ1+DjovEtyLvfr9Otd5DkTc2D0WnTldo6uduy9S/1W0HqzWfau4WVivlK/YfYueynTftr/bQH8iPoPBu+LV8+dJsJs9kpsfmH8Gkvvzyfvdztmd+9wp3e/cj4P3R/eF+KvqLZ3l6Nwr6v077xU//T7VyW39YXd++H0tuvdXdP3x4V/y7fzcdX1PayiRPcFrV/6n9zXCPJ8MBoPBYDAYDAaDwWAwGPwgzFuawV8L9Kby5G9/2V7nzwo7nHZ073A68RvCV8dncA53/0KBnb1bb1297Owr+mX3r5USHg7dv0zZ/UuWjmz9rdjHR/8/jUrjc7I+T+nvzLedej6Z353fYHbOnKhPx2fuGc/iu36z/YTdO39NoHTu6to9q87t6HwiLoPBYDD4x4Ee4r5+g8mv6OpW+3f0rXwUd6X/1JlUzyvjMzgLV2tuj+139Lke7fK5K+/OnK7nu/X+ynim83KV2ZlnJ2S/S//T9fAkn9T/Ts2dWGeYe8Vr8F1xPm33KT/erQ7v8Hk3X/4lTOz/bfz6bgKDwWl8fen/tSPa7/yGrvvbhFf8JkVx7v6G/wl+g/fHms/Pz3P/qLjTk9ro/lb/FE7xfxdcs+IUb1Ur1zqaT2mNKZkTdfq0fodX10+SrydsdOO8c//7ab34TmA92jnj/hKqo7+ju6ufvYTs8u+e6f41Wgfdc6d6ps74Ou8794VT9XMiV+rMK/kn9dmd5511V1edMyfXGZ+/6R4wL2gGfz1e8QPdnZv8iQflnQG6oyvhx34gY/qd/OD98G43yO4D2c4DnDrf6a/vwpM/xO7+gK1eFtzB0/V5cr59R7+k+apy6w8mdY3ZWK9TTp2aeMX9/V9A9znk1T+YqR7q6ne129HfOfMOtfrEfUDNgxMvA7rrHx+9en46v7vP8+9QLxW79/XkZ4aOfJfTT8S8oBn81XiycTsPn0pu5wcbp/POGWf/iX0nz/YGZ3DFuMbaPeAyXa++WXbt3eVX+7Wj/24978S3PkA7jjtYH7I6HLvyqc7ds0l8TvywkJx7J6w8k5zt3Nc6tfBUHf+r6M6lE3HvPue4H5jv8tm1zc48xWcHT/bL6WfQE+jcl0/lt6v/u2qk80JEzeTkpct6nXLq3BN/yv1zB/OCZvDXYR0MtXFPNfPTA4TdLJBfrxxQrx6Gf/PwfRfcfeHm4G647/4D2RMvEO5g54FpXbu+PxHP3Vipc7sPiLu2d+PDeD5dO3cfoJ+ob6TvpJ136se/Aap+vsPuDp6uh++ID8PujL3Ortd/K3bjs+Jkfk/cv7o/dzg+3fnfkU9fADFOjkuq8ydjXtAM/kpcjV6HlPohkV2jB250htm5uCSyjqP6AaajvyPfxY5+Jv83D9+fjG5+VU2k9aBqIXkYUfsOXf47WPW7h2jGp8NlfWBnM86d7e45nSrGd/3t2lbxcXruzP8d7MYneSBmMmw9fSmkPeLo3n8HHq5GETr11q3PLp+n58PHR/+e9CTUvErOfnz8rBc1r8jvk9h9dqh+d/ol6aF0Hlc5d65zv7jkVznFpcrv9sFgMBgMBoPBYDAYDAaDwWDwPLpv3d8JXwA/Sf9l4wlZJJ/85uqOnVT/eq7rP5JnOnbXn+qJjv47ue7EKLW/E5u7dZRySu0r/ajXlX4l3627E/xP2Hi6/rtgfFjsWd668tV+l6/j37Wxkw90xunZ8fdOHHfXWZwVP8UbnX1K3sWpY4vJp/odn7twfBRHpGfddzFm8ogPk2d8mJ+JX914p7JILuWVculAxfhpW9+hv5tbVXNOf1pL3Trr6u/iDp+dM3d654TsYLD938SpQrv7J0aMg+NWOZ3+U6en9V82nF4Ue/WncEye2Uvk67luPSgfkj+fY3p35FdbzI/qq5J/dXySoZ9yUfw79c7qqhubE/xfEZ8Vd2KV5rczB1f576qfHSS9qOQ78+RubT+lt1MPav53a2m16+SrXZQH5Sv7nnBR/qr6YT3H9LJcstim95pObbo4sXMJKpdE/+ony9sqk3Co8oqP4pDEamf9stfVf2fepvwqz6pP1eduv6e8O7Xb5cPs7Oh2+lMbVb6r38myvjgxF9Q8PxmbVFbx+Q5OO/W/w2Uw+B++CJJzOzLq3O5eB8zfp/Wnsuu6s9Ph5L4n8l1bp+S7+anya1wT26fWvwsnc/B0/tG5tCZS+TTvu/KpzK589dX1wx35Lp9UHs05Jpfa7c4Fpasjz+YJk93JV4f7yblU7Sd9xjg7nt3rV667Ok30qH1VQ2xtx85T8knOE/2n5BEf1ocsv0o+4eL0q/MOJ2qOyamYntC/2nHx7PBhup1+5kcS0ySvqb5UBnHo6OnWpotTxzbjga47fJTdXX/T3DIuio/TORis+N8/Etx5u31hbbB1PTmf/Jamc44Vf+c3JGof6Vc62G8onOwq182D4tWNtZKve8lAuiN/iv9aOzu19+7o3gDe7YZxskZfiRpHNyu68pfMutb9Tc3JWdKVv2TSubRzT3Acn6iTZJ4o3xnXRP7J2l996tp6h348ifQe6MCeKdi93sk7zt2c7conPe30n5R3PrBnrVReyab6kR43R9f9hId6xmJ1lfa7un8pf9GsVPPf6WV+Of2JPoeTc67GP7V1d/4ke937VvIss+am2na11+HD5sidtXWv2kn4dZ8HBv82/veCht0AXFOnQxeh+2DA0B0+O/a6N/ZVNrG5E38mcyKmHbC8u5tjZzh3hqCSv76/ekB2c3JK/tT6K7iqhxSErnzlcEq+Oxt2Z8numUT+yfr5mx9G2Dx5st/rvbbDt2MH3deV3mTtDp9U5yvl3wU1ju5++aS8mu3qeeAp+eqH2n+FPOorxVvJfv0Gu6dUPi6unftXeg+oXFK/kd71/A53x9XZ7ug9xWPHL3ZexbCeSXl06rfq79zzEjnHk51B/ZLkA/VfwqnT/4N/HFdR1s/6Ha1dBcr2md6O/o4vTreTV2fWfae76nJ6mdxOfLo6kr3EX7V/V76e7Q7srr+vWO/yOXnmlPyTsTjt03fF6K58dx6emp875zs+nZ7Pu/I/rc7YOebvtdatN1ZH7P6SyidcE/5df0/JO57fJZ/k5VXyHZ5Py79b/TA5V2udmujUbtXP9ju20brb25VfZb4KEp3uTJrXRL/zxem6I1vjxM65Oribw906S+sfySt/r7U7ee7Evnt28O8C/vlm8maPya/XVf7U23J3pvK6K4+4IP/XPfcGl71Rvvac/534X3yU/TvyiNOKxIdEnp0/Lf+EXjeEVT0k8uxMl9N3ytcz3ZrbrdEnfT4xg+o8cZy68l25E/I7uTo1z9XZUz3/in6v59h9e71OZy66h7n8qbq7UxeMf9ffU/KIt/PxSfl3jc+74B3jw2qezRXWW935zM4ojqfvAd25fGomM/nkDMsrO9vNbz1zh1cq786xmuje85z+NG+oz7rcEac78y3x2d0/3nl2DgaDwWAwGAwGg8FgMBgMBoMuvgI8bf+d9X0XEj+6vq7y13enY9dGov8p/nf0JvpPwOmv6908ufh0/ELyif50lijZND6JDwn/3Tgzue+of3Suk/Mk/q/Gk/Xm9Kt1xzfRfcdOyqUTn5N80nju9l1H/xO5Tfi4OuzYTrHTvz+Rz27uUj61j0/Ep9uDiMsd247PDrcdu38ruvHcmUu1Lh2flPtPwSmfVK5Qzu70BcrZ35ibAcYvL/JfdP8018md/BPGr6+9fyiurt35s7PE/86f83X0oxihgaH4MPnrzxHXT6ZPxZPJM/1Od9XP5J1+Fdf0T1LT+Cj9TD6Jv8odkkHyKD7pn5YqeRX/J/5sNokP0sfkGX9Xr8gWkv/O+u/OPyaf8HeouUN9Wrkj+Z16Y0Dyab52cFp3d7Z1as+tnYzLHXRi6mpQnbtsneSjOL3y/sL0Mv7d2k37F8l34qPmHZPvxKfWwZ18oesn+qtbu9eZTm/scO3e73Z1vkI3s/EuM3IHO/4+qV/Joxrv6k/mNDqb1n89v3LuzENn4yfX3L+C6Iax++Cg5BO9qXyXf+fhzOk/0Qx347/q6OQq4bfTyHceynbkTjwcopx3a2R34J0alk/5cLpfU5yuoyfrh8mf7K2n+Z/mhfY7Ndc507kHnXzg26m3u/Jd/ruoffyUP+mZV/eXmmO13q71hMuu/Odn7/9kyPw6iSRG3fv7HfkkPk/XcZdPYi+pmURPeu6ys3tPVXpXqOcNJuPi4/Q7jqnuHf3Ixs4837nnd++Rp+qs629nxqv95Lkh5ftkTezyTLgwPqdrevAMfn186IZIhscq5xrp+p42yiW7U4TV5i7uNE9X/2UDrTOsDyqJXMpr5ybwBHbioeRPDMTvHGKvtu8eNiufrjzCq3LybrlXDwNrjydzlsknD0zqIbkrf/H4/I3vmB+oPtl+xU79rrJMz678HT4duD5WOM3p6XsXWnf31NP3pUT+FX3TiTWL0aoj6flT8uk9/1Xr3XwletSs3dWP9Clf1bXi6+4jSkb1T8JzF6qm2JmObZePU34o/a+e7Tsx/Q50+7rLfyeW7HlGPTsiuD4fvCm+FqTyib5deXfm1KBMuXX0dc6sfidnduL6xPpXgDvyOz7dlX9K7yttvcKHJ2x0eqAjj+rwpLw7f1L+qRh1eezoZN9P2brD7SQHNfdOyHf53EE6l6vcqVmexuy71xleeT95pV0k/445UTXpfLgj7zitc/lkH9+t25XXjh0nuztDd2ydOPNF8DS3k/3bqdFO/XRrJOWYoKPr3WruiRrdWTs5dwYvwNOFdrowmXx3ECbyT3BHtpObRcfOicZO9joyd+WfyO8ul478K+z9xPif6INX3fzduadq8xU2XhmnjuxP8/cVcbw7exL9qw3Wc+t6pyeZTiTT2ftO+VTHSXl0/l36q557tbyrx1dfJ5zrPkJHZ3qW9fcu97vy73xmt0eTczv91cnTdc3OsPrp2k32nf6uPOuX3d55JffdM7u5SWUG34M//pHgK1FP/cnu01gL7dSfk1e55Bwq+LrG/mw5aZbOn7Fd++oM2uvIvwIqfifk1zOn639nGHfk0bmT9Y84nZRXcUR/7t6Vr3uIwwn5J+fnT67/XU5P1vMq/xPvd3dqByH5TxKYPcfB3SOTOnjyT/C78h8f/j9/QnF7Uv7j43X9ksojqPn8lPz1PZ3lT8snnJPzLB/Xutt3ehL+rE5fOSNZ3NmMVH2Fzrzr81t6htWW66s7z4cJnpo/O3Fwa6qGnpqd6Rn2fJyc6/AZDAaDwWAwGAwGg8FgMBgM/jm03jSu+1Jp4401O3OST9W/I7/Dr/ubhVR+l0+yn/62apVzb2LVG16GO/E8XQ936/lV9fbUfvd6Xa9r87b+78POb4feRX9njt2xcX3/7vp/x9+aud9WDvpI7+Pvqn8wGAwGg8GC62Ep+TPAdH/3T/5O8dmx19HfOZNw3bF3radn7+pYZRKdSl+Cju7T9bljo6svlXF5Qzil332/o3/wM3Fy1n+H/kvnU3X5Cv47GB5/N56O6+RtMBgMBoMXIX2YPP0D8NN8Uluv8vf0fvoDRsLzWnOx6PzAfjc/T8d/Nx+7P9ilZ3br/9Q5tnc33/Nw/774WnBdO/n1XKKbXSdnOvx3ZmLKJeXetdflw/h1z3ZsdPSl+e3kK5Wvst9to8sH7SfyXe7KHpNL+SRrg8FgMBgM/sQvL4KhbrTf8aevjE/3P9fp6u/weupP55+I9+cn/sdZnS10DuGn1M/HB+fz9H8ascYyiemu/vU6lX2y9gbfg7XGrh/K0v8Ubj3n/rPMtHbqmY68Wkv2mGyNSxKj9fqpfun6ctr+zv2iO9M6+a1zM7W1YyPx504t35FXZ9N+rLM/wRP3q8FgMBgM/jl8CSBZp6sjn+hQ67sPnMy/rv6uvyf2V5nEjzSe7FrJuZzc/YHg6fg/XT/O/l35NIfdc7t8OjYH74GdWtidxTsy6ZluT+7IJ7x2YrMzx3b5d+LZ4ZPKMhuJ7mS97t+ZbXfWdmSUfBKHbh66Mon+O3wGg8FgMBh8vN8PwE/r757p8lFnTjwwKd13fzDYeRh1vp54KOvE893q5+7Zzg9TCB2dJ3/IOBHnwWtQ+9n17rrvao3Z6cjdmYk79u5y2qn9ZKbuyO6eqTl25+7M+538no5Rp6Z3Z1s3Rt2a2OnHDpdUP+O9UxuDwWAwGPxreNv/xKl7I3fy9U+R3Zm7PrA/C07/HP763uHR+ZPoDnZ1sRgkua02d+L5FF5RP12c+k8LTvznVMmD+/z5+3th7S/0n/Koc0/zSezcnbeJH91ZvKN/d+47WzWXztYqX88pLp3ZcTe/3Rm342/KJ/W5O187NdHRXXUmvnT0o3mS+DAYDAaDwWAwGAwGg8FgMBgMBoPBYPDt2PrHEzt/rfKEPDqjzp3U7/5SAf2mCJ3r8EJyLD/pbwmVHrXOOCn+HR9YTLu/LWV8urzRuW49u3N36/POX8w8sb9TV3f0P3H98ZH/tncnfp3foq+cKjo95M4o+/Ob78Hgv+j8Vc9PRzrn3xU/nf/gGUwdDAaDH4HrgUM9sCc/QHbk635XvzqXrjm9DsoG+171K/sJf5a7ar/aS/QnMXO8Up7deujw3fHtST67+lIZtZ7Wclf/CR1q/+nrhFNH9kn9ie4d/zv7g8G/iOmLnwd3nxv8e5haGAwG74g//g2ar68//zvs9fpfx5NxOKE7zdXOX2v8tDpQfL+jrp29E1yQX8yuk0PnOvr/FqDe6Px1lItNesbVjspDmsvB4F9Ht9+vPkrl0XpXXp1B5zqyp+QvuWtvnTV1T+lWfND8YrpX+fQvJdG9LuGU+pDem3fXGZ9T9dbN1yv43ImPqoUd/aw+n9DPvu/Ku1ic5t+xUdeSeCa9y/S7M4PBk3jZPxK8+8DxFE49MDH5+vCWDr3dH/R2hx16yKw8nsrPZXv9dHzfBe9Wz5fdNJ539K/XJ/V258bT6DxY7DyEnHjgZujIshkwGPxL2OnHzg9hXf278xX9YJLaPbHOfvjb8TW9j633PSfble/cS9kPu4nekzN45wfjE8/tp+oqrZtVvlNv9Qd4VrO7+n8y3vF5YKee0f5Ofd7hPRjcwf9e0FyFWAuy8wOJOtOV76Kro2uvK9+9ASg73YfEDreEx1UTJ25G1Ta68bE1pfMury7e9caMYncKTz6gsIeCd3xY+C6oGcBk09ip+TTxH/wL6Nb5zn33rg6nv6Ov6+/OHGDPlamNxJ8dv1O9KYcdrPfq9dPxeRecqOeTsUXxPKV71b9en9Rf8d357ua3G5uOfvTzyI5+hnnOHLwjfn189N9CvhvcQ8Cr+St76Oax+yCw+0C2exNV59+pRtQN+jt4ugeGk5zSl2+1V9zNFel1cWb8mI0n86L8va7fpX4r7tQOmzfsJcy7xmAweBLdObaDJ+9H7BnIPYt0bOy+BGHfExunn0078slzz110XiY8XZ9dnKrbp17SJHIrj2s95ZrUptPB+LC1O0D+Ok5IRzJP0hyk+tf1akfp78SPPSul5weD0/hr/hOnnUHZ0ZfKd24OdeAwGyce7E7cCNkDF+PY1XsSbDh/1w+g6mZx8gG9+/B5nd19CEY3NcfhxE3PvXCpHLv62BrTtVNr6Zm7tVPPo9n2XX0xGLwDdh/m0To78/T9qPPc1eXfke/eLxxPtO7snJCvHNg99u4z0L/8/HOKj7q/KU7X2eReXWVYLSsOJ38OYi9currZ2TvzbfeZ68T8UedcXuY5aDAYDAaDwWAwGAwGg8FgMBicxbv9GViXz9PyXfwN/N+pJrp8npbv4t34v6O/Xf1Pynexw+ed8jUYDAaDwWAwGAzO4P++m8BgMBgMBoPBYDAYDAaDwb+OeUEzGAwGg8FgMBgMBoPBYPDN+NX90/eT/6DpCbun/nSf6Xnabhedf9BrR08X31UPzPbJvNz5R9JeBWXzRE38FH9P1f9P6Xe3l8rPP4o3GAwGg8FgMBi8D35957/qnsqqH0RO8L/zL/sn+Pra+99h37W7w2f+rYpBihMvyJ5+yfY0FP+n4tOF4jMYDAaDwWAwGAzeB9v/m+3B34nv/CEutf2OL+w657o/ML/ihd0pXd3/7eoJ/V3s8HmS/096ITUYDAaDwWAwGAyew/wbNIPBYDAYDAaDwWAwGAwG34x5QTMYDAaDwWBTu03/AAAgAElEQVQwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYHATnx8fHx9fX19fVvDz8/P6PvIjP/LvI6/OpXIn+TD5z8/Pz3XvOoPW2HpdU7Y68nXfyTIbTJ+SR7ZQ3lKweLozHZtIfo0dk0/t1DywWO5yX69TPsxfxSfhtpv7akfpqPF3vDr5dflBuqucixny9U6P3EG33t5Nv7L78fF9cR38F8k9Pe3lU3XVmW/MtlqvOrrzE+GVz2OvkEf3RZaTzmxl8uh+zLgjmcRmGqP0XvPKOZre+xL5bj2kZ0/HSZ07Efsn7kedZxS0//J7M0qoWlv3vgpOy9dzXf117zv0d/3txhPJPCGf+HtHnsk5/al85fSU/o6/Sl7VANLF5BSUfiWb8Ej97uhJ9HXkT9RMwiH1Lc3baXwVdOXTfNYYsfMqzoxPIqdsdPmk+WZ27spXrooPW2Po5hfltephNpy+9RrFRNl4Ck/beqUv72h/8F+4GeByhubECS6s951dxyflmc46ZS+VVzE/Ic+4IPlV31N82HfGZ8cft4f8RByUPgcUFxanri+78rv+7Jx74sydfKznu/WT1lVXNjnzBH7dIdB9k9+VX2VSXt23WwkHpjspUvZm+q48Kjb1W5JOcaJ99xuTu/KOE9pzsazXHXn1GwKlvxN/JY9+g6HkfzqQb9/hK4p1dyin+XoyrxfnRGfXPvoNWbWNfvu1nuvcJ6oeJKP2GFaeCR/EH8UN7VUdd+VRbaYz3cXH5dchienKKY0nqlNWB8wHVuu1fpx85b9jl9UB0u/kUf2znnCcTs6hwT2o/Kieqagz426OFa+0phIeqC87cyXVnczGTry7fFcOyb3s0t3JaTd+jBebnfUMqoFuzCvvagvdm5L7lbqHPIWO7/Wekup/hS9P20lrubOOdJ6ahU/iPy9oahM5JMNkV34neF3962fHVmcgpnw6se/mCXFR59G+8vmuPBrg38mnK++avRt/Z/8nod5g7/rU1XfafpfjCbkd++v1agM9PK2fqDYRvzo32RztPgw5PahvkL+Kd3fWX7qUb47TyfVrrX4qdGuM5bfq6uZXybk6S/1E/c7WWT24uVHXOnZZDzL9Sj7hlvi2zoHT82iwBzVv3PMD03Uit+ge8RR2+HbmkHv2REh6BOlNezKxX7+rex6SU7Irb8cLxZDVqZq5bN7VWcpsOp8Ykrzf7ZnEN2bT5fWVePreMPeeP/F/dw5fwbyQnFnlk8b4+o3re6o71d+Vv3ikQ3SXz/U94fMK7DTOzk2vo7urvyvfwc5NXsXzXxxUa/x+uv9pPezUTWp/nZ0KbOaoud6VrzzUTGe9fflTbSCbKxf2AJfef5xPSE/H35QLkk3PVR8cH5VfpAvdp5GNzh5C+izwNO7Op6u+WY9W/U7+BFh+B9+H2ldr7tc83amJ3Z5i9YnmM5vz6Qx+quZP+O5k0uf5K3adPk/uhavuS+Zkj6tZvjtT3OxTefsKUG05dLgzf1AvK92rjMrrU72BbD15b3ha/0/Ef/6CpgtU7Cdk636SvB3965nTxbGjfx1sO7aebqDL1knZVS4dNjv6n4xPV3/Cv97kfvIAO82/q68jf5drfRhiulK5HVQ9qd+J7rVHT82E6vt67R5SulC2KuoMf8rfrm5ma+XdPc94JvrWOCX+rvXuZn6tg4TP0zjRr7UGnX4lP/g7gWr/wto/d+vwhK4nn60Sue6cVrE9hcop4ZPgylXNG7Nxd3Yw3TWGVTf6+adba2su2ZxEnFIk8ThRH5166zyrduR38c76n+CG6vPpGEAel2Er2GzwkR/5kX+NvDqXyp3kg27K13p6Q96RY3aRvIsVe+BA8kymnmfyJx4yEiQPrVVW8encsNjNDnFK6zjlX88q20yP8p/5kPqL5FMf7z7UJP4lulYd6Np9V5y6dct0uvxc3508+r5jN5mTiTzbS+fwnToavAauvk7kMNXF6n+VYf3hPhGXVaercwZ3f/lp8jVmyVxl39PZtXJ1c1vlz+XZxYj56XByzqlZfFe+Ww/XmdS30/WJ7HbO7OjvgsUnmXUneQwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGAwGg8FgMBgM3gyfX19fX7Hw5+fneu3OInm3tur8/PyU/KouZafDe5e743HZTXUrPkx/lw/TW+2iNcRTgdlmOtZ9J6v0o3PfEc9O/XTq7WQ9I9lVHtlSMVK8lZzLl4pFup7GP+G/m69OvTGbaX9UONuqHhCP1G5yZmfe7vJydbBeJzMF5eUUHyeT1HTaw0/Nw478bj0rO4pPqlPZcfeeqjepdaZb8VD7O3yYvtPzdtcHxqd7f1TzWdlw/c/k1doOf6bv1PxJ7zc1Hut5xb8729IZkfaY03NiPndrI5FD9yO2VjmkNhPcnfvd+4LbQzHY4bUrf9mvXNC1s6HA7Dj9TJ/r2a6cO8d4V/nd+1dn3rq+cvI78wzJtQcIK6ju4GFO39WjkPBNk5MMNyajimVtsoSP8/dUw6S+sk/Gn+Wa5SWxz+LActGJz468qzPXF6cGEtJfeSZ8Vpm79ck4d/LlYpT2+qo/8Qn1h+Ko/ELnTvVvtx8Vzx0+yRkk6/xH+0ktdPijOKBYqvnT4e/kr+/VHqupKo/W3N4On1T++s5kWc+qdWZf2UhlU3nnA5NXeT3JP+XDzqS6XD+m9pVdNVMZR+cbqk81Dzv5TeQ7fO/M5zvybAbucE7iX7nsyDIZduZuPFWM78afyXx85M9SaJZ2sDNvq+0deVU7ar1jH/HZkUcx7s4gJbPac2dP9e8dPxy/hE+Hg8rBqkedSeZXrU0mi3xA+OwcYk3tGqwzXFcujBsbKJ0Ccr4qnswfF4+aQFdw7FzlkhRi3WfX1Xa1ieLCziEdjIuLWZo/12COU+WFrndkWT4T/swfxSPhXfmktYX4MF0KST/VNcQvqXmmv+pU/LrxYWuIk+KhkOa4wtUz8r3jd11X9eXOp3qSfcTXyak4srgmNepqzvVS6se1d/FL6qLWfGK7yqd8kE6WR8WbcVJ+Mr86tak4KC7O97rmbFQ96NrxSXKG4Prf8Um4JXJMPunhGmukS/VFrYk7uerUMuJZ7TgZ5kcq3+H0RF+m85XpZdd35N3sSM909Lj4KLk034nsnbjcnRGof139dP1jHCoXJItmBDqX5r0rpz4rRxZT5TPSh2SVnOODOKlZ6uy72kjnT1ee8Vxlf9VFdxhBJRzpqvpWWXQm5ZEUEuOUFJhKIuOO/GA+MX+RraSxUEzU9edvpHFA/qsYKT2soJGuHVv1XBoT5O+672p5ta16ItF/fWc2mDySU3yUbpanagvVZbXPYlFlWIyTfkd8URzrXl1jtqo821/9Qb4hn5j/NTesH1W+Ep6IL+KE+KnaRJ+MV40rqulOvzD+NfesF1gsWY1WH1hPuhyi2FRZtI58U75UecaN6WfyrgfRd9YvaVzqGca/yq/XyX6aSyfD+NUZpGaOq0PFHelzvjLO1cd0BqE4MTsov0ie1YHKE6rrmofaVy5X9VrlauWm8rLqRrpQzzl5dA7F9/M3XMyRvMrJKl/jiGoLySNdOHo52DxwfYHiw2JaZVHP1FisXOoZJIt0qP5hPqm6ZDXB/EF11/Wx+rHqRJ9Kv6ppJOvqi/Gs31fbjIPqGaQvAdJ7B2l8VB7ZuQ5PNsfQ7GB2Vf1UXug7k119Rvn8/Pz8/FUX1+9p87EhimTYIOgOuArU2KxZWXBQIlHRME4syMrfus9iW+3Xgq78Lxk1GNy6ig/Swc4j/sqmayYnrxq7rq28doYKsuFsozxVP1jjusHkYoD4IDsrLyTDfFZ1z3oBnWNyqX9MP/MD9eMq5/qYxQD55XxzdtY1VLfIDurJJGeMX7dnUH2ruq92UZ8jP5QOFqO6hmzU/fUTxYDNMZUv9x1xcvFPZpGTV/F3dY1ioPZZDaXx7/q52mXyaU2z+mT2k3y5nnN17WqmrrlYstlQ+aFedH3D9K/y3X6p+tR1nX+1Lut1PeNyxeST+q/xSvypvqj4oFgl/Y7WXUwVHxVfx6FyZrWeXiPbyFc3HxwvNzeQPVSLSJ71ZK2361PFlgHVDoqTWkd5QPVQ7akcI78rP3SW9SXiifxL/F/9q7XOZkGVQ3YSXswHha6NdU/VN5JL+Kie7HKsYHlTcjtnV59jf1whMiTnEBF07WzXgcTOpLqUDsUTrTP7lbPT73R3eSQ6kL4aH5VD5qPzbVd2Rx5xTlHPJ3IJlA+JHRcDx7uuK44oDsoOk2OckR0nq3gwXS6WLDaVn4qf4qQ4smvHgelUcsxfx0/xUmerfHKmnnX2XSzreuq30ovqoPLt+stsujymepCck09z7GypeLFcdm0w3sp356fjdCI3aE3p2I1Vso5ykcQU7Tn9Cp2aSs47vUqe+ab8ZPq/BJBdJ+fspbIst8huwimNv+Oi+CWyynYSI6QXxQLJqlzw7Ob3XaYfyaH43cFufhFvFp/rE8Vb6VBr7jqJTTd+ac6UnRoPFoeUu4ufA+Pl/EY2HB8VF3fNuDqdikM3Fyw2SDZ+Y/Xxkf0WuMqvMuyNdJVXb6QTLmyPvUV1etB59maT8WB2FbcK9jbZxSDJsXqTrHyocspP5rN6A1/PqTix+lHyaJ35X7mzs0gP+lQ8mB/ujT/jkehSNlYdlbvrD8Ztdz7Ua3bO1VVdc3GovtS6dz3N6iDlyeyt1yyeyezoxr/qQPqTOCK+yn/XgyyWiN+1pmpbxYXVPKsHxr/Tu+gM0qXqw80vVZfMpqoPVq/MLvLRwdWnqzelq/qhZl7dQ/Kqt9M4oP5y8e/KVz5IT1r/jHNXf5rjtN67/JkOVU9KP9Ozu96pZySv7KieQJxQnzCwvlLyzN9E3vWc0p2cRbZUH+7mnelEcH2tzjqkdb+uqdzt1sOlF8VH6Uf82Frl7uZCOt/UvEr6FPmv0Im/05HkyOl3fJjduq70qf7bqU83B9kMQPrTmA8Gg8FgMBgMBoPBYDAYDF6E1m9xrjUkn67vvpHuvD10PnT2T5xR8uoNH1pH+pxsylO9oUz4sHpxsUplEt7sjSTjt8vFxTd9e737lpvFWb2pd/aZLHqjm/SjeqPs6lf5q3imed7xqzODHJe0nlddO+ecDLODrrucuveBtFacn0h/J4+d+jkl1/E38UHZr7lI+aaxV/6gMxXM/7VfWf105ZV/u7OzzpVu/BP9nXmI9HdlUxsqL2gd6XH+pTYTH5yuzh7zs8q7+nd27+pmNlL+FZ06c/LJXKv9Vc+5+c84JP2e5jetbWU3jWsi5+Yw49Sph+5c6s7b1aabochGeibhs+Nvuu50J7ns1P/d+nG6kb5q251xcziZG8oXhZ34nLIR/an9/4Q/8Q9+STG5tfWssov0p0Fw/p2Qv753BtuKtJlZ7E4MdNR4zL7KV11bdSc4FYdkSDiezIazj3QzXixurr+YfKJfgfU74uBy5eLQGWbrmbTP3NBnnJO5turb7XsHNadVzhV255ua6fV75Z/4t8sn4aa4srlXbbpacj50ZNm5CsS97ifztK672ZnKqzP1PItPwv+OvMPqn5q/1V6Hz7rWycGJecjku7Isj4xvOr/Q3FO6ma/ITjLHWL063at+5TuLXxpL53taL8r+br+k8uu1ivEqs665+NV43Kk3VuvIJsuP81X53anZNU4sZkyexbXG00HxZ7KVR0WHz3fWc+rvKpvk+E79O5925gPyl8koPqq/WL06PsjHy2YqW8+o+kx9Vvp/IUVoMK3XqqFXeVUg9fPaZwmqjq06O4WSFA0LVjJI0F7lg9Y6CVZ2Vd4cDxQnFyNVB+mZlZOK5w7W+kriia5R3XUaj9UwsruuVbuKNxtqrLfTnqncXT+ierzipeKf1O2qo/Y+80XFSvmPvqPryld9Z7wSoHysnFTvolpAvFQP13O1Jta1yg19dzWK/FK2nO26pnpa8WH8WbySGKn+S/1T9lbf6llWK66ekC5kl/Vk1VX5r2uuRu/IM7usb1FcWTxQ3BnnyrN+svzVfLn4r9esJp3PSJfiVtcdlE4XT6UP9XXaa2xP6e7qY3HbgZoXaW+nc831elI/nX5WNczs1z5R/cfi4z6ZHVVzVX6VYdeKt6ob1fcod6we1titMoo3irvrCxTHpK5RTV51w/SjGKiYMC6sD1DMkb+srlicVP0rf1nvunpFZ9F5FB9Ww8yGitcOqu9KP9p3a87nGtcqh/L86xKuCWQF5uRRoSB55gQqUOZQ1eOcReddglBQVQOmHNFZVsAoPtc+ahykvxYlWku4VjBuK3/mk2pIxYs1wdogda1TT6jR6h6yVfWxGlx9Yw3MzlR7Se8gn93wrPxVTCrPWleqfhM9qz5Xt6l+50PV2Zk/q44at06f1bNspioZ5pfy0c05lJfUD1dHaZwVR7XGZuFqS3FQPdbpL+QHk794o3XEJa0TxB3l1dUviymqk1oH9Qzy08XurnyNAfuubF3+1FizmKv4Iw7KJ5Qv5Ota/yw2qp7VLEjXma4VzNe6p2qW6WL5rD1zrdfzqj5RnSukcWN+ON1JDhHWermuWU2hTxRLx5vFH31ntc38SP1lPiCerC7Y3Kuy116VQ/2p6kqdYz6weYOjw1941H11Xb+veVN1yuSSvNdPxr/KrvvKTpLrGgfnr6t95sf1HeVR9TzqJQSUz1rHbM31E+o7lSvFTe2575Ujqvkkx/W84r6eQ/K/lDGkJJFPmqdrI03CpcMFMw04s9ttBMZhXWODozai4sWA/GXDQulnfqNYsrzUfTSc1jOrPGsixKXqcYOCXSM/mE/IBxZLxkX1FNLh4oxsOX9VLmsslTzKR5KDWoerDca9ckI2OkiGOJNjfezqt6L6oz5R3hHHVTfiya5VTyCuqw2Uo7QnUxnF280m5B+aS65PGFxd1j5hsVH+uhix2eRmA+LJ9l19snpev69ybL6iGFQfk5wj+4oXmmVfv1H5sWsXfxQz1kMqJpXjelbNjeQ74stym8y3Gp/EVxSvqsvVS4cfqx9WF4g/4u04uP2kHxOwPKIYqHmF6i7hx2LGZgrKb60fFw/mD+oLF6fqh/Lf1TSKJ4sRmxNMt4pH0l9uJrgY1+9MD/K3nq85Z/PjkmX8US5Zfp2/jH96ZuW5+oT0uvyu+qosq3HUP67W3Zo6h2odfaa2Ei5uPiSfrEdVfSEea57/w28tXEV0XXfFVgkyJ9Ua49VF0gidM8l+h1f1062jaxWvTszZWbaP7KcxZfY6OlI9yF+nI+Ge1DXT4zh14PxC/FHOupxUrtC++o5yn9QC8kXZ7fDqrjF+TibRe4fDaf0qdzX+NU91Tdl2eVXcUu5IVvmX2mH+IBuMF9PPzqr4IL4u/kpP9asbn7QWklq5I+/OJ3IoBmi/6nXxd+cQH7Sf5lf5nObLnUs4qhipODt9nZys16tswl+du+sLgqupJBbpeeYj81X5nvq0q1PZqv45P1hcVGwS27t8EjtMplsjivcdrL51c7ius3gy/xwXZQ9xcj6wPWcPxSfxhfmH/Ez4M9+TmnN7XwXsfDeXbD3lX3Xt2FQ8mO669r//xKkKqDW0txqpbzHR27hOkVX7iCM7k+o+JXv5zT6rHhRLtb767oqCvaVUa9XGjr9onfFfz6zxYfFiPle/WFySGCf+Mv0JR9agSq+KIfPLvR1n9YDka65WO6wmkzfprv6uWqj6Ub5ZjFnfXXuuD5SPDEpO1QqbFZ1+7+hP+bHaXffWM2sNVv2VQ8JJQdVs5chqAfnKfKv6ktpAdpnNeq7qZ7pUzaizqL+VjVXmTnxqLdVPpB/1+nrN8s7kWQzVnuOj5kMaf8Ud8UfcUO5VfpH9br5WO4o/A/OVybuc1jXWf6g+Vv1fv1FtIv6I17VW7Vxr6zqSU7bYOspd/a7qBsVxlUM+svqt+lWtX9cq76uM6lkkp/oa1QPrCcUZ6URQulYZFLNVju3V+DD767XSiWLB+pztsfqrPn7+BosX6ivlD4tPGhu0xz4VX9aLKjaMz+o3+6w+p36ovmH1msSzzj8lw3KgcsPkkF3W21UuiSXixfoF9YrTPRgMBoPBYDAYDAaDwWAw+AbY3yj9Idx8y8jeplZ77m0ze0ObyDMujDOSX88gPSwuSAd7M6bikcYnteE4orMIKi+OS8pnR343v2m+VF0lsWf81BvWRD9arxyVvm4e1VvfDp80Nkg3m1mdOqp77JyzoXKneCQ+J9xO8NnRz66V7C4HxSflsaO/2487cqk8mj9prlXv7PYv443mQzL7lN4TvOpehyPTqWahs6v6fHc+JzXX6d9/TR7NZtYvrhZWWcct5YTsKT7duCT8O37u1CjrTRYDlq8qz3pV5UDNnapDySF/lK7T9bxyTOJZdTCeyC9Vz0/yYTKuBzvyai7U80lNJL2R5tetOd6I0y4fpp/pcjWPbCc2duYPs+l0dWrB+RwPCBbwnSbaHUpd59KkJzaVn3XAdP1lvNAZNfCQ/tSGyvmqx+25hu/6y2ynsgiqrl2+6pluflnuEvnuQFFn0nwhTtdetx5c/SbDj62588zH6itCEncVC8V3R3+y18lvypnt7cw3NisZV8fTneucudMvO/O8I1/5VI5IrtpDfZLWJ5JTvjEdTKbjr4uFm01OB9OFOCb9z3zr2kS26zrryafr82+UV/1S+6vuqRrfnc9JLd2Z/24WMH1I/4n55nprRx7t3ZkxConeVP/pej41z90sv3Qo+VN81nNurStf19RcSGoQxRL5ifxX8UFwPBGnOkcSPklumLybV4xPmo9Ev4qhk2c17GLM9P9CgVoP3C0OFDg1IBB59pnIuyCl/Fd/q0+rDBsuinvlhbg6fxMfujHp5AnFAA2enRypJkjPJOjWZ8JHxaLqQ/arfK1BhMot2U9ystNDrkZR/ajc1Vis/bR+uhx0/XE+OL7OPzUTUP6RHJJhtcl0ojlTbTEOKEau/pnOxM/qo9pP1xWPOsOYfcWnEwO0x+r/6iGmI823813xc7VVz1RbtVbXdVd7KVCNVlsoN+g66eP0HNpbua68UHwqf9aTav6p/u3Ko70kLjv6E38786HWoapn5iPq16of2UL5Szgzv1O9ySyssilv5aPqRxZHFLuOvPJR9X4KNEc6nJXdk/WM7Cp+zu6OryrXF59rDfnO8odiWM+jPkR9geJTObBaRtwQJ8Sx9jOqKxYf1WOu55gP60ypdpjPK3enH/mp4qp8UmeUfpe/NF8sJmydcf/jf7Ndi7vbFEiHOosaciWsAqeGELKlClLJooAyf9Q5Vswovuu18h81seLqrl3OkjwlqGdUc9W4dXgxXYpb1+9Efl1f84n6C8Uh5Y90IJlah5W36qPEBrPnBmaiF8VC9fZu/TueyD+kN5Vf9Vf+dY3NDKWfgemveau1gfqxXndmAoLyE8mqOcLkO3qRvlqDqL/VfGL6qt9VXs2SClRr9TuKBbKlao5xVlzqeeRv3Xd14fKO1pANVR9qfq4cFEfEQ+V35Y/2HJdqv9qqcUX8Xb8jLkwX6tVd/eg7q6mknpmeeo7VO+p/hKpn/aw5Yf4ifcj/RB75VfmoOkcxYzoZn1rvqFbZeSePao5dV86qVqpuxIf5j2KVQPU04ohiymLg+pDpXs/XNWVb8VnPoXUWE+YbqwdWV528Ml4qdgk6PeTkUZzX9UQvsqNqD8Ur6TWnn3F0sio+bt4oX2t9IbB+Q3n5VRtvbSzmwEq+XjNn1HBw55LEVHk3GFUjV7nOIKlxYbHs+KU4V26VO8qNK8BOfKos8hPtqdyqoYl8ZdxqEyKbu/pR7SN5Vy8sPsov5msiz3JV+wUNGzWYGCf0yTix/cp71cf6e1e3QlI/u+sdbid8OSV/d74qKD+ZTNJPrleZHXQPUHOY9ZSa2R3+qx7UH+semslqLiXfV73Oj0t+PaPuAfWc083k2fxFUHlB9tUcQDKVi5unSJ6dVX3I8ohsMr/qudoLat3VMOKM/Ff6GZ9uPbMeX2OZ5B19snikdcFqReVLxQPJK/jHUa8AACAASURBVE6Oi8s3qteqR8UT9RKKh5KvfiA9qN7QHuPA+DgZZCetZ7SG6tnZU7WNzqq6VbWc+FH5IKBa60DlpQLlgfXNCXu1DutMSvJTdSl+6Kzqz6R/3Txi9cL6jHFXOp2Pqw2U17UWVT+i+cI4Ir9k7bhmX9dWOHm0V3W4Zq17qXyy35Vhtut+Nz479hP59ZqBnUM+Kf2Og9p3/qVxP8nF6U/2djl3fNip8Wo7qYm67/i4mDL5bny78U/W78gkuUtjk3BQ9lSelbzKQeojW0f1lMQ4seHqA51L7FeZ6oPjyuKouCpfWAxRrNf1nbypszvyjM8ORyXPYuHWlH6Ud7WmdCg5tZ7oVja6+x3+qU/OP1UjKRgvFuMq6/QoOXWeySn+HT+Zr85fJI9ixew7PlW26kV8kIzjouTdeso/0es+3VqXfze/6lyNK8q30qPy69aUH86/1EaiI11zcerYRTGuNpTtqmM31i6eSn9il+2xWCo+lUvi80580jPqmvnEdP9iBhncG6n1Wr3hq2+hvr70X4Ks++gNG5JX3xmvRM8lj+yjN4LuWn0ibio+67lVNnmrq/Llirbz9prlhq3Vsy6PbB/F7a5+J59AnU366659VC/IzyrL+DJe1x6r92of8WFvoRP/78Sog04+Kn9X//VsyqnTpywHCQc235Dszsxg6yjm3RnA5iqSQzlT857Ntxofdk9h9Y/6Qe0jWcWfxYNdO/n1E80GxofNauVT3at2UTyd/lW+00tMtvrI8qnqpnJN+pbx7Miw+LN+T+zs1HONBTu/U88orij+SiapSeaHqx9ks35HPqTy6BrxXteQTmSPrTHbKLaqXli+lH8sJq4uGW/2qWRZnbJ5qrjUeKCaTmu16lzjn/ql1hgf94nsJrOZxWjdQ7Xjat/VsYLr/6/fuNaQ/MUZ5ZTVQMIN8en0b71283D1R/GpOarXTF7Fh51DciiWrC9cftMeHAwGg8FgMBgMBoPBYDAYvBrJG9D0XEcO2ei+3fsK0DmT8HcckbzS72wo/swftK5iwPQiTk6Xssk+XYzQ+glZhlTeybEYqPNszcU1ka/fVd6StTQHKk4JP6enq79+KpvKhjrf1dORT9YRF2SjYxPtdfQrvbv2FS+lw+Vph1uHH1pfc8fOqPif5uNsOL7Vt04NIrvJuY4s43ai/nbX0R7i5uKp5JnPzPduLLtnEHfH4c6aig/7rmLtvnfX0L7jzDh0+St5FhfmC7tmXJKYqDPOV8Zph4uLZVc+4d+VVz4rnsqG053oT7mv61XO+bzj73rdjaWKQ41pytVxUbqT+CSxQ3IdH5y8ik2HX/XV1ZfLLzrP4vlEfOg/LFcPoT/ZYX9ilu47u4n+VXbdQ2tsn32v8swvFS+ks9pjHJG/KB/qu/JNyaP4qz+/UnFD8UF+MT9cLNY1Zof9+dor6jk5o/KAfHD5YfKr32p95eZkTtdzjUnlwvxF+pGvrAarP24GdXup8mdxQN+ZPPLVye7IJ3xQvi4baTxdrHd1sdngar/KK7C8dDh25g/rH+Zrl8+6vupWM6LTj4gfku/o786flYObe+s648h0JzyT3KhcoNynM0mdQ3wUx478apPtVahaSObtqp/1C+otJV/PIC7K1506SfqDxUGtu/52tajipnQjPowb8jfVf6f+kU3Elelw8o6/kmdryB4Cq5+T80H5hNaT2qpyHZt347Mj31lXsh8feF4xuVP8lXzlVGXcbOjwUXWPdLO5gbjX9VUX8ifBVjyvA+yTfVdriERip3u2y6+eYaiyCU92vX6u+pWfirfjXn1IZCuvel75ldhBPijfU5tsT51PdCf2mM/OHxefatt9njznODH+6AySR/o68UL6lW/OL8d3PePil+hIfGL6O/bresq5s4Y+WdxUPFNbyi76VHrrPssF0uHyk5xRNnb96vig9Dr5aivJjdLt/FO1o2om8aHuKbj4qPXEx4QnkmfxYT4gfxJ/HU/Gl+lNOLhziRzyu66hs2qt7iFeScwqHxZTxpnpSOLL9DNfk/3En0R34qf6TPUn9hQv5/tJ+U6e6hlkx607n5VcGs+Et4tJPVO/p3aUTy5uVdbpYvFy9llsnA9On7OVxIDtq5gjGcetxk5BcUh43fGDySEb9XPFLyag3jIjeWSMybPzn79xfU/1uyAwOeVbtbt+X3kie6vu+llt17WaA+YXeivI/FVvpJGfLPYsRoqvimfiZ/WV+Yj8Q7rZm9bU3noujTlaT+v3kkWfdT+RZ/4zXlUHe0PNuCBeKL71rJNduST5QjOlAuVY8ajzqupSc4z1EqrdNP+qnpK8KL6KD/IZnUnqfcc35weyjfQqWy6H7IzrF7WHYl/X6znla+0LdI75WfdQfzGb65m6rvqq6ldzaeWJeFSgHDhb7LvrcXUOxUDxRvIr7zWPqpaqHPus51XtVZ/rebbH1lAtp7MFxRblBdUv60+Xn5pjxK8bg1UvqjeXq1qbjB/iieK18kQ1o+QYX+Q/q3EHp1/ZQ+srUJzROcY7lXfxSeLi6tOBzQsn38mfqnUkqzgxfi7+q002++rZ2ufsk80L1GOMD7NXfUP7CNUms1XnFOtxlJPKj8Xu8zdWGcVN+aI4sj3XO6qPERflKzurcv35+fn5iznQSZhqFibHgrnaSvRXZ+t6MlRYMNfzSrbGpvrN7LNiUnZcnjq+otwqfneHAzqb8na5r7qVPKqn1B7jq+qYyaB4It+QHlVnSp7ZqDFgPaiGzudvIF+ZT53+Zr4hfUgG2WL+rvacDRXPbn9XmbQO3TxkZ1lMWI8kOUKyzBazi/QqP+v5lQPrb1TPKN81HipWqg9VrJA8igXrReVjN5euzpStarfqr5xQn7Bav9Z354WqKxZDpA/FVNUHis/KuxP/xFclw/xO4oT0I37KTtXnYo56O9G98u2cU3oSftcamw+JHqRL9QyqPVSbif4qs9pzNdLpQXZe5ePq/XoO1RDT785Xziy/9Szr3668418/Xa+u164Hqn+uP1GNu/yxPQfG8arbZH4xvbVvmEyVv/io3mN73X50cbxikPjDONbvLL7sXN1jtcPqwMUN6Vr9Qfmp+pFdFBcVf6WjriG/VS/C/a8FjkSV/RKoOhhx5WSinwWe6XUJY/xdbJRt5687o9Cx1fVd5WYXiEMnPu48W+vydnWkzuysMdu1ZpW+HfmEa9Xp/GC5SuRVDaJ959N6riN7Im5KN9Lh9pyNRK/Tg3LG/HWfiBfi4uw7vztcmA4lx2K4E8/EtoqP0pX66rglfrk9pQP5luQ00Y/sVNk093WP5d59ZzFlMUNnUCyQHXaNYpbKJ0jil8Y4OavisspUfQmflDfiguKY6O/GsKtb5UrlndlAcszvRI/i7vxTtp3Orr3T8mkdszMIq1ySS5Z/xwfp382fWr8r6+RZvpxPLP5qX+lLOCSxc7FJeO/4y844TknMknN1rRMPdp3ouiOv1n99ff351kodrG/SPj78b+uZrHtTtr5tUvrruXq2rrM3hcqn1RZaV2dR4tAbTGU34VD9RP6xtY4Pzm7Ca11nvqu8KhuJvIKqo05cVhn2xrSuIb6s1ln9OnlUg2ygsB6sdct8YrlW9d6NscsXqz/HB9Wq4sdiwubPtedqQPFHHNL4deZf5Vx1oE/G3/moasbVXc0ZixezzfZRT60yzh9WS0x+1YlqZMcPJqvuEWpuVI51j+0jm6uM6hfG3dlfz7L+VJwqUAzY+soR1W89w2JW7bO11UfWL+x8UtvVF4VOTVZ5dlblF+X/WmN14/Kz2mVzQHFS/N11UpOJ7cSfClZP9Tv6RLZrnNUZxtnt1fxUzgpde64+1dyq62guMv5s7jBbVSebPUg+4YP6x/mbyrAaS3w9CVUbbCbUfdUbzjabcywXTL/LLbpW9YZmINOF9hF/Nh/cvGL2mayqKaWfrat7B4t1d4YMBoPBYDAYDAaDwWAwGAy+AdEbrHUfKWFvB93a7ltFxCfRzXirt167fJAdxcPpYv6lft9ZZ98VXN3c0Z9yeCd5VUdJXpI+7PBR51zv7tSrs9Hxt9pP37CzGlP+pnm7M3/cmbvryVt95X9aC+x+0YnNqfnvfEN6On3j6jPth1fIr/u79eyw27+MU7fm0j7YrZGVU7cfmb6qF+nZyZeKD6t9tvcu8j+px9g+O3N9T7mcvE5yorgxG8i/jv7KkfXepWvVy/qAcUI4Ja9mbrfv3Z7qJcZN+ZTOT6Q7tZHorbqrr7t9c5dPdz7c1e/WPz74Xz0pG0mc0hpGurGH2f2L2VAzQfFO+lHNnoR/h5/bjxUiolUe6UiGG3I4cWzlUvW4YeGGfje4T/jbiacb0EmhJk2pZFadKraKQ8JdyXfj/7Q8Wt8ZKG6AorOMQ+pDreua386a0o+u0+Gr8n4iv26WnKof1Y/d9WuvM0+T+YX0u09kO50rif6dflQcma+Ob+VeZTs1dFK+9tN1XuUK2UA8lBySSeLv5pXK2516qOuMG5tXTD+qKdYLu/2V9B7yy/Xod8mzekG5YnlwsWT56sq7emNzgvUlOpPUdNKTihfrPYbUhss5s53On3o+8aPTOzvyiV3np/In7TFkJ6m36ifzp+4nNZXUDdJX7Ti7u7oT+etMNz5dTmrmIU5VNp09bO46pPlF+WLxYzOD6U/mM9Klvnd07fBBe0xePnCkDYiGlRpc6VBLC5Ml3+lVSUmHQ5VPh6cbvKmuZJ3Jor1uATF7LD7OtyR3Kscpjy7vpMZP1b9repVLxh/Z7/h0Ik5JHSb6Ucy6+lne7sivPBg35APi7mKWyjGfkrW0PpAt5DfSzXgynVW/8kP553imvDp1g9ZUn5yQr+dcvpxNFxcXQyWfcK8+dH1l8Urq2vWVqu0k7ky3OsdqmelOe0vpZ7p25dOYrTlj+lF+nV+sthL5ytfV86UnseV6mkHVd7c2ETfXL90aqWc6QPF0Nmquk7rdqatkvWOD8Vc+1Fpaz6/XVX89g87VPbSu/E3kmK2kXpJ+ZGeYbLeeGQe37uRO+NuxwfKVcElnEIpZKpvMpZWvsqG4MN9THcgPFZf//W+2V6NVkCVBFXIl4pxiejqFsg6W7nBT/Ou+SkzVXXmwYcj27+LSVz9VTi+5ZLAooDw4nsl+zSGrVcXz2nO5ZfI1npUby6/yV/UhukZ21Xd2XfdO1iDrNzd4V7lVRvW24lD1q3rblUe152qUraEcrbqYfI0tmy+rHpYLdB7Jr2uohuqa0s18UDWMfHNg/eTms7KJ+j7hVHuQra35qr7Us8wf5pfjnc4r1OepfLWj+hr1R/WRnXe1js6juLj9HST9yeqWzRhVA0yvysMlh2wg28yHVSeaIZUrkq97tQeY3qrDxYbJI24KKkeubpUdVtPrd1XnrBZUzBinZOaw+HVjqeqf+VD9Q2eYT9W/jl3nc63d9QyLC/KhckTxSfrV+c64sLrekWV+o/XKG8kxv6t9Vgs1v2gt7fGk5xHv9VzXX7aP1pHviJeaV5WnmhdKFzuz+sT0MA4spown0qXsMh2MC6qfX8pZ1uzVqeuTBTdpWORAbQInX212iwwFSQ0C5S8bPmkDK671e8Il4Y24pr4l37vD13FI5RlcfKtuxMHVdneoVbuMD9LNYs/4MK6uBuu64oR0rtf1bFo/6vxO352QX/1j3JO81HXGiSGdL8636g/LpTu7nuvMIhW3Tq8prmy+1O9qriQxVX4yG0leHFbd1Q7roaqjM68uHeoacWB2kjmI9Ciuq7zqL1cbdZ3NAnWW+eH8RXuqX7o96+SSmkH8kLyqL9e/lz43I5EeFzfWJ9XGus987PBRNbbKuplSY6LqI9G5yrDeUH65tUtHyqXqSWNfZWp9Itvo3qXkHVfER82/9Ezaz0mNsfXERtK37vrzN9Y91wO1ftic2OVTbbs5t6sfAfUu6xdWk4k8O9vNe52RLGZqbjOgfkx7yNUU8onNTWRX6VAxRPXzxyYaVIy42mPySG+iXznxBZDoU43FZBOf1jV0zdaUz45vxyeWtyTnynYqh+Lj9HbzwvinnDvrqPacLbeH9CX8XG535dG+4pnodr65+kH2VT0k8XjCX6Y/9Rn5p+RTn3a4qH2Vg0QG+evOJ77t8kd8EruoVhhSXUoO6Utir/QzHYm/SC/jh3QpLu5T+cDkKm9lt/rL4sC4MCQ+q+/Mjx0dif1kj+nd1bWupej6lcp0fVQ2Uj1df90eu2a8OzJ3Y7/KKV8UL2cjiVWi08mjfSbP9CH5V9hANpW/SrfLW2LX1ca6nuhMfFA8WQ10YpT6q3irmKAziS7EvROjLienm605/Ygbix2TQ/vuOkG1jXT85y9o1k30RgjJJm8ku/Jor/MG0b2tWm2wt4XpG2rEh3Gub4UTfmqdxQLxqWecvLLv3rBe+/VNpzqH+K1r6C0sW+9wTPxNzq8Nvwv3FhvxQbFe99gb5kQe2Vt5rn67PlI+MP2ufpRfKn5pnlT/7ehH8WA+r7lg9V7lUX4S/9CcWnWj74nPlWeVrf2EZKotlt8kpyju7JPVm9KvesBxS33onGexW/dYnFGsKuq8qnXorhN/VN0ova5G0/5CPKo+1oNJPzJ51CM1btUfFx8VDwV03s1Z51fVpXRUOeWPmzNMt9tTayn/dG+V6cwUtI5q4PqOZJM5oGwkfq72V53pnFT6mQ+sR5m+tL6ZPJuvbmYgH9BcUmeq3hqntAdRnFR8WH+r+ClUX5UM41k5p73a6fe0l92ZJAfKF1YLin9Sn+v1em7tYWQP1bCLkZs/tV9Yr6Dz6KyKj4qX8oHpYLFJ9geDwWAwGAwGg8FgMBgMBt8J9BZJvXGtexXORj3nZFPunbPIT3Ze+eT2kriwN3kJH2en+sk+d/XvyLOzqVyHT2LH8WcxdXw6OhJuTi6N+aq38k14oLMJ7w6vHTnGa7ce0CfKsfue8lO8V7s1153aYnt3dKh6SO2pdVdvaQ0rO073jo2u7B35bj1084v0Kj1M9m7NdvKr7Dm+6Vm3V8/X7zvcHO/0LOK6y0PJJudS3iivKffumYS74tM96zikMV3lu7ycjbrv9DJbO3F1Mkh/Ykft7/DePZPm6e56mi/EJznD/OxwdhxU3jvyOz4zf5280tPhgs45vWzPyVabO/FR8iwGyk8VT3auG0PF71Xy8h9Rur67NWTQ/Wla/fO+zp+MsT8DUzbdn3TVP31iPNyfIXWS4/78S/FRf/6E8sW4Ib9VTTidLjfVDwQni/ZTH6sOlPudHnDfO/XZiQ+rRdWfyG/FxckrH9QZpy/RX/dQraY2UW+zftvxLV1TfJCc68ekf5BedOZUPJ+Q7/JxUP3RWe/ovxPPdc6w+vzufH188Nl0p1/UbE34OJ7J/EP6VT7QPtOV9HBnPqdz3/Fg5xSfrnxyrn5HfFVelX8dPoqf4pTIIj/qelLLTj+D4urquJPfS4bVODqb6j8x/5X8xSXRs66rfkb1yXLRlXfXrCaTOq1x2ZVPcuD6iIHlStUZkq9nd+8X1YeOL45nXWf1Wvfqd8cpjQHzl9lfuTJ/EMfOPHl6PuzWw3/eeLm19ZOho7vqQ7qRE3UdnWUBQFzQtZN3vNj3yjM94zg4eZcPJJPk4iQfp0fxcT4l8VR5QXvKH8cz8dWdQbycbOIvk2dcHAd2zfiz+FbdXbtsDfFi/iE99Zz77HJU8Up8UD4nMtV+ek7xP81LfSp9TD/Slejv8K56nXxaf4pDh3Pldidf3fV1L+Xg4pPYV3F19c/q3OmtZ9D5FLs12TnD1lhsUvmUI4ubsovOsD1lC/nQyVtHntlDe467w07drFwct669Thyd3m5+0xpA8kleHJfEN2cT8VN56vpwp9YS+TRm67qC05WcQfFEn4pvKuP4dPx0fqP9qlPZSvl2bLo4oe9pjFic3mX9V12sDl6f6o0Ze9uGPle5de06d62rpKxc1Fvmao/tuTPsGsWhckRxXL+jt5PIRt3vvKVletybbZQfFivkc8JFfUe+rby7+Un5uFp3MVRnKl+lg8VHyaE99aaayTB5lvvLT/b2mtmrvcx8q3t1TrA37igWnZyjfkU2alwQX7SexpPpYTPA5bT6VoHWUX87/sgftI90M78qH8Qx7a1UP1pPezfhve6p2Cs7rK9WX5P6R/KsDt0ayy+rQaVPxTuxV/tJ1ZeaB85/9H2dVfWcsrPKoxmT1CWLm+KA6gFxYmvOPyef5LzWJ8pJckb1JtOVxNchyQnLpYoxix3zk80ANEPdXK05QPIup1Ufq5G1F1ed6DuqEfa96mYxSuRdH6g4KX0uD44fs6N0MHRq39Ws0otkWE2n9VX3UHzSWaaAajjtryQOSIb10nrtcod6pNpDOUA9tcrVOYbqEcWs1jObdcgvxW1F2rvs3En5XzUIbNjVAXfBBbDKsCJFOtOAusQ4e9VmTTYqgqRwmRxrOGSf6U8KsupU8VB+oWZHPro1xb/yRXoqB8cJDQQmh/LOasXZZrKMP+qZRKeKE+sXVXtIP+t3NB+QXla7zCfvOfcF8a+1znxgHJK5yGw7H1W/u7yoGbE7r5CedD4w/i5Hda1bb24mJPlkMUUxcPqZHwqoR9MaumRRPJhvad+gOFf9SJfSz2Kp5lIa/8qH5RfVfxrvZI35wvoF2VR7jD86q/Qjnmk+T8g6eVS7DkjWxdhxS+wrG1Vf90zthbqnah6dQ/Om7qm4s7ph+aryiSyy7Wph7W/mx+o7+u5ypORYbqr99ZrNBHa+M6+uWCD99YyqbxUTVsPMRjpzUh4uBg6rnOoRtJ7MqVovKJ+oVl2MmS3EB9WP0rvGg80RFd9rL+1tlMNVx7p+cVLcWV0kdav4dHsklY96oJJXzrBrFtR13emqe85Wqiflm9hz8ikUl0SexULxcv47nx3PLh/mp+PD4OKW+Ot4qbgonmn8lR3G38WTnUF2mXy1lfhb5RJfUx7sXGetE3uXL6ZD8Unj6eKg1plMtY/i4eLj+Du9aH2V34lPPev8cPxQfNA104vOKzj/1Bnlp+Lm9KnPqsPpd7FDa2lMkG51jWKT6FcckYz7ZHrqHkMSL7ef2EOxdPrRdxU7p4Ndd31W8l8CykZiu+OrqpekhhyXdc3xQjrSmCb57thBvLt+KO5dvrv1qfKb8HD1WeU6Npi/ac4cUt0ov4nPHTifT8gn3JENljdmX8kru2rtjr9o7W7OGJ+d3Hdsob0UO/x/IYPo7U79XM+o6/XctbeScHsr6esNLHLIva1CfqHgVD533owl/FTs0BtV9uYxKUxkS+WX2U1sMZkkX7UeVh7K9pqv1Q+UM1bPyTXjqPSrBmXrrJYqr923xS7/7ozzE/VvvU54sv5fP9Ecqfbqd8dP+cf6EulXcU3jiWKLapHVDIphlUcxUxxQzbg6QrmoMezEh+ULxQlxYD2w7qPYMPkT6OissUM1eQqn/HR1cUo3ylPSH6x2EXfEm52ttphM9YHJqt5EZ1H/Mo5MZ+2t9QzLaxIzpB+tq3mI+Fceyr8n+wXNETZP63xO9Tj+KE91TdUMmi0qpkge1Z+qYWbnWqs+Kz/qejKHOv2l5Jl9xF/Fk/nLOKF+ZdwZTs1mpI/VG6rzXRsILhZqrqOeVfLoLPNJ1SerDVWbJ+bbqov1F+OX6q75Vp9VnnFAc5HVFqqzpO7ZGZdfVTNOx2AwGAwGg8FgMBgMBoPB4IXY+qsCtu7edrI3cEo3+3RcEk67fjKOSt7xQOsVyAZ6o4rkGbq80lgmuhN59IZU6VZvVJUvd/ikcer0Szee677rFcaFcWd9u4LVZhKfE33k+K97Lo6JPSbH+vFUPaT9vtuPXf078qjuXHyUPSSD6q7TawlULTJO7BzrK8X9bv0wG44L4pPqr3IsDjtxRVy68XFy7mxXZsfWx4evZac3jQ3KJ8tzqs/xQvqcDpdbx/9uf3Xl2RxMuDg7nZ5IeDJOCW+Gjr9VPj2TcEhquas7mZ+rjZqbbi07fiznjA8716n/7tzYnTMdu+nccfZ25NH53XravdcwuSTGHf2ud1f9yWy+y2eVSWu6M2OTfnfxYPL/+0+carKqEkYQyTFSLPjqJtAZWKsets7OJFzcTSXlh867AaP4VX9VHrs3ALWP4uxi7+xV/ch31SwsVmzI1UZz/NE5Zhddu3pTZ1F8kH7GxfWr8pnFGOlg8qzuVvmOv515wvJaeaB9VjvrPrPl7Dp/u/2+8knq2fVn1b8rv35X/JAPyv9aa24WJNeqf5hPdY/5Xf2rcatxcFzZnpsNrBcRDyWrYqF4MY7KDqtl1Guo1pAtFR8WF1avSLZySGY2s1H1IllV8zX31S6SZ/XC1lk9uDpB/ZzUU+XCYoX8Vf2cXKPZ1ZFXeXDcUF2r6/V8jauqTdf3LIcsHs5fFZedfLl5guRY77F1pCO1e8m6XrzkWN/VM8me6yt37WYZiwHytyuvfGX6XW0k8UDyrHccXCxRX6pedbxVz616VX8l+ln8GZzvyFZSl4xnnVPoWtVQ6peC0vEfzl+/wQTQNZKvn7v6lc5E1q13eDib6Hv1V8kn+tH6+rnaU/FSa8oO0u/4dnLSqZ8vgSrP1lxMXGwQJ6dLxcLJ7uh3OUP6u3tdu+ysi6PTk1zX3Ccx7aytetB1PYN4JfXg9DN9yk+1z7h15FHcqx6kQ8knuVGxcGD2kjOKT5VJOSUx2IlN/c64sT1mu3Jn8UvsdGKg9tbrjr70LJNFPit9iofjxvxh8VdyVT65ZmupbHLNfFSxULbTuDJZ57s6l/ip/FX6k7POn5QzWq+6En+dzhpbxTuJu7KZxAPJMN2MI4qb0+90dng5m8yOsqE+kd1decTFxQet1XMqNkoWnUn1Ir+dTyombK/aV9x25BiQDPPDxUpxZLZZ7BLbadyVnLLB/P3P/2bbAcmrN5FVnp2/1qs99zYWBaTaW9cTHx1WG+nbcPXmG/mzfne8O/lzg98R2AAAIABJREFUQDZX/fV7wt/5kdRP5YI+kXzlxPQyWVSnK8dVj6r7VD/i6OKD9KmaqDlS/cjqGelduaE6qPyYfOIvqgHEH62p/kXxrPpZj1Rb9buLHYsD8wX5Vs+4fkTfK0cUf7XG+kDlTvFOUf1R8UPrbCagWKgaWmPC6knpTqD0M9n1O6ohpSeRVTJ1neWZ1XX1IakflR8GVhu7UPo6s0DpRrLVVu1NFDMnj/oF8UDxZ5+r/tU2qyVVC4pX1eX879R0PVO5KdkaZ2YrjQ9ad/3i9Kz7NRfITxUn529Sk2zGJf3K5g7zncUKnUNAvaF8ctxWGRRLN2dYfaD99Zr1A1pHMqiHWX+m8ixOKD5JH6N1lHOmk9UW0v31G0qG9Rry1fFHswDpdnOI+cnmCasn5N+lV/FhdYa+s95CPiS2HVivdGfZKvuLBQAFdnUABaZeI3mUlLrOdCOgoKt1xRfxR3tp4tICqv5cMsyO88HJs/0rX3V4oJpg+arxvuMLa3rGielAg2KtE7TOOCfytcbXfReb7oBD9Y16oNpDNajWqwyL03q+6kIxrfJdf9N5wuZZ5VTnBjqL9ly/XDpZ/FhMV12oHxDqGVVzyndX/6hWWX8ojjU+TJ7tVZ0sjih+rN4cb+RDJz9Ivzun+nDVi+qO6VZ94Pii86j2WS+qumRnkY7OnkLtC1cLHb2rfsZZ+e7qX/Ws46POrDH4+g1k9/quZqObZe4cqs/KD81N5A/6ntYeQ82tq13Vl+t5J1/jr2yi/Ll11r9qjd0n2HnEBc0HdK4DNYvqOornLp86J6sOVjvKRtLvbIagXq7yiZ1aJ3XGIb9VX3fkWY0q+XQeIJlql9WG6sE6w3b6C+lh59xMU/HozGiUE6SH6WQ+ID3IB9XXNe9oVjEfXX9VsP5x8szWf/4327uE2ABSZFWjsmGGHEKNh+whvkjeDSN2jeTR4Er5srhUOcRDFXN6nsXfcaz6mY8on2z4IFvoPJLvQtUd44pyrOKz+rfKsHMsPiwnjI/KE+vHZFCh+CdgPeXmiapFNU+qDqY35d31N+Vd46n6FfVM4itbRzMC6UU1xngm9aP2WJ2s+8hvx8X1VeWW1CeTSWo54dCBitt6ndYxqjVlG9WhikUCNZc6M+uSq364mZ3oq5xQL6080fzu2kZcUKxXe7XGqrzrm7q+6ke5cL3MeKTzrMJxULF2NhxvpHvdc/OAySs7aFZ1eiKR6eQX6WIxqfrrnovpjl/dPuvMYZULZ5/ZYbNpXXd1x7go+8gXxafKMptsLqbyzB6SZ7NZ6UNgfdedKWuNX1xcHJXuTp+zc9c1y8uqf/10NlA/r7rVLKs2kD3GYafn2fxJznbnA9K3rv/nBQ1qONWEdW91ThVSbfharM4esv/1GyjRtZgSbigGHVSbqqCVflSonSG5ojvwOgOR8Vjjz+yr+lGDQ8Wynq8yqr5Qfda6Yrlc5djQRPqQTy4+dR3ZY3YqX3Rdda5cEN8qp/Kl8sv8RX4k/JHdldNqr+pOfEWyaH+VUbxVzFGMmD1WX6gfWS2zaxRjFlv1WW0q+xVVD/vO7HX8Z7lm9Z7WqeOg1lQ9Irj6ZefVTEptJWccOvzZ3HA9q3rN+aDmBZsx6xrqIQXWc9WemoNKHtljPqB91G9MR80d6w81g5AexVfNjspN5aX2I+tPVkesJut3lkeXL2aHzUp0hvUX+57EK4lDzTHra2dH7bueZ/4ktcx4qP5jZ12vX99RrJifyj8HpY/1PstbKo/qtMpV/Yynii3aX/Wifvj8DcRD+e1sV93Ivool86/KK52rHJpDTE+nFxwfFqdO7bKeqdzWNaZf1Vm1h+RZLQ4Gg8FgMBgMBoPBYDAYDN4E8DcT7E1O+hbJIXnrjd42srfViH/y9qvDH+nsvAWu+tybNibbectWzzE9u1yqPHsLqeK08zZ5h5PSjfgrXijHq0zSS8oPpR+t3/V3XevqT+S79a/8TevScWVnnX7XN8h23VO2XU6Y7W7NXjrSmdPJLeLnuDqk94xkvZuDup7Uc3q/qPJuDjEfFBemK40Z68Mkhy7+KPadPqg6kK7kTLXNPrt+7cx/ZqPbA916U2c69VP30tgxPtd3pkPluDP3WD67MXWy6Tyt/nXif4Kr68duX6Przqzp8FHxZDJKPp13KjbdXKBYpPbucurIdeq87rM9pU/VAbOv6sDpV/6tOpNaUxwVd9YvjEtqx8moHFWgWF/rrpbdTOjoRvqZLSVzgn8nv6jeoGHVzN2EOf3rcKyBQWdQ8pitVW+V3+Xf9S1p+BqD9Szjdkc3Oq/iwHQoXaheduKp7NXvK9cELofJ0FB9wWod+ej0K78T2y4+zpbjzPhX250aSvQk35Xtk/qRX2u8lA11psNnN78q726eqFh3+7FzxvUd05/ydPPB6XH+JPli/NN6ZvyRPaQnmUNd7lU/8h+dUX6v+/Vskq90bjh/0fdEdxIPZfdV8q4Gk3pL5iaLnYp/d2ay64TnnfmG/EF+ss9EP+Oc6GOxYv6q+mf+VtnKD9nv1JuaEZUPikfid7XL9O/Kd/OPbKD6cj4kNpCsOo/ywfLE8tzRv1NHyRxw+u/mq9pwMso/xmvV5erB+ZbEQMULce7ER82Y3X5JfERI6xLts3prPVQ7wp095sAqywJeedQziG8S8LSgVKKYHRRLdJbFWsmmuhM+bK+zjmRcI6G9nQZbr9O4V6haUb2xyjGd6jvjfOlntY9srLpSPmx4JOeUXcWj7qPvlU8Sy7Rn0bqKg/NF2UL6HcekHtTZ7nxL9DDdyCfnB5JHM8DVf7cnHA8Xu44P176qC+QjOqf4d/zZWUv2XN+h3lL667mkp51dVSc1/pWr09WpN6Zf6Up7y/W964OOLcZf8UY1zeqH+ZPmGK27/Lq+S2cNi4k7w2x3eyzpZaQfcd2tf+Yf8imJfceuyr3ribqf+Kj6BskkvcHiopDUYodr4iPTc3eWsPng9KpaXm3clU/6YuWm8qnsIz6qV5M66vSj48H6lfWdk3XzIJkP6RxRfrI5wnQyoH50cf3jHwlenWGkqrPVAAteLVhX1KhgEM+6jrggG244oWHGZOv6yhnpYnqTxkHfFQ82TJyNmrdVDvFAgyb1WwHlQdlxehNfEz5qcKjacjyV/lWGNTjLG4sZqy8E5ldatyxmSZ3XXmbzwPF3MogDssPir2y53qvnrtmB7CqOiDPLuYon6wt0HvmE6rb64OKnPmv8nK41npXX12+g8zUurC8Rqm7WF843dMbVaPW/fkd8kG8rF6Uf+bheX/qrj3U2VV+R36wnau25+kTf2TXzTemsvqnrCsaByam4JDFF8atrCX+lA8my/lO+oJpGcWCfih/rb5UrVftJfasYrZwS2VUe5cLpdzWrOKP6rz3Ceg7pcblar6ud9RyTQTZcD1XbtacQj8r7kkE9q2KUzhPUz4hXWh/K/+o72mdxVPNjPZfyRPJqBpyUZ3NDxaTGxtWdqzfVUwiov9i1igvSy/qo+ot6En1WbmvcWcxQ3tAn44P8cLbZ9wrH6ePj48//xKljwBWBK1Im60gnhav4o2vHi+lAhVMbl+lGft+Vc+ccp8q/2qtrTAZdI1lkG3FIfEey3YapZ5UOZv9ufSr9tbZQXbBaT/LPfKqcUB2kPaL0oxpA8ul8UjXhZDq1dp3bke/6iuRY7lM+nXii3qj27sZH2WL2lQ3X7wqq7pEdNQsRJ1enKh+Ms+ordpbFyNlhuarnVK0wH5195cNOfTp/XP4VF7SH+raeQXqSPle96nxI+0XlbRcuT6vdNMdpD6tZ3FlnYH1Z9alcqRqv8m5eo1i4WYz86tZBwkXNkpVn4p+67vZBEo/EZyfb4ZLY6NpX8U11OblO7Lv5cvPa1Xmdta5+ELekfli/u5nD5lviX5Xp9JeKg9LnuNV1ZZflKrGR8Omik68a/7Te/jj49RvrejWO1tl3dK3kKpA9xFfB2VUcO+jGRZ11fBL5dY/F7ASfTr46cHlEujv1gNZdHKuMspFwQbar/iSWiR9VVsWxyrlPpqsjX31g3BVntJ5y7OrtyijfEt0duVX2TjzvrDEOLvbJ2h39HXl0xtXLznXaX93rzprTyXiv6OpxOpB8or8Tl5R/l4/ShbimMUzz4zgpXqutTjyrvMov2mNwupSvLgZIVp1J49zlk/Cs/FQMUIzqWRVPpi/NFzrP1ty+yourAxejRD/S0eGicpvoSfaU7TTn3XwpHSlPt3c3Pl0+zF+3r/Qz7PB4Mt7OTsI73at6qw1ki+l0vt+JZSffyVoa819o83qjo4iyN3h3E5W8pU30OA7sbd96rd4Yqu9I/7Wv3rpWf9F+V75yqraf5IPQjWeVdbnfzRc7X8Hq3tVBaoPp73BQqLler139MDvKLvIV9RXzrcbV5Yf1884sSeYMk0HrKJ7J/Onor+uXPban+qDqSHio+Vk51JlY5Vl/ndKfyKtY1PmJYlDrL51fiKfitSLNK4sn4otixuaD6kFVSwiufxUflxsmr/h3+STziH1ndYRkGB/lP1tX9XMazF+0v16rPmDxr+usl1XfobggGytfxBXVhuKJPpENt185ongimWuf+a7qr9qo8UJxVWe69cnijPyu+pV/LKdofd2vdpC/jGd3/qCYKlxnUU2jvLHzyGfHX+VpF45PctbJuDlzrbM+RflCdbHadTXGzjEfq1yiA613ZFX9q896ltmpsWCzB9lJ5dcaUrFO5J6o/8FgMBgMBoPBYDAYDAaDwU3A31Zf1/8TEm900VmHO/LuDTNbR286Pz70bzI68tW2iieSRzJItvOWbeft3iVbz7rrqs/524lPN+frHnqjuup3b6YRl2pL1URXf7WT9mQ3v0xWnalvmNd1pCPp89N5R/t1frBzO36cmg+JnY484oZ4KD3MZtWX2mH80timNrr3F8Vpd94yHt37gpsDCQ8ElfMOnzv3o1VHMifS+k/7v9pX9Y5kr3Wnf4c/4rjKdOsqPZP2zc7cT+fJro1Ev4KaZS6ed3xmXHb4I9u79yMHxu2Ov45Tt7+cbtU3yQxh/O/IOx5VTzJ/mI2kv3brh/W245HOa+Vvd5ZV/c7fej6x1Z23rH/TmahqYYfPXbk7NZLy6MxhpTeR685LZY/piv7sXTWruwHcucEkDrhmSpNYfUwHCDqLfEkK8UTB3V2vTa3yV3mzuHSGfcIz1cFiu+YIybj87tRGqiPhoOKUoFNn157T6fS5nCV2WFy78i6uioPTz3Sy+ZD217rGzrh4OPkknru1qvxDSHpY1WtSy8jfpC9OryGfGR8HZjM5y7je4YP4VZudek5nIJs36YxH9qp+1j/1s+Nv1e1q3/mp+Dq4/mTcE18RT8exO3cq33RPzZlktjEfkH3F67Rst18uqLnQsXHHB9RXa5xRTli81710TjA7btZ25Nk8Ubrc/GE+Ip/v8nccnH+KE5JlthKf1SxhtZboRTaUD06+yrj1tCedT27m7XB18yeJD9tn9bHqZ3qrPKoF51equyv/izVBVXLtJ0WsnE6cR4RZETFdq/z1nRXHDlShID6p7c4AULFiDeN01nMq30i3a8qkZlJeiAuqXzSMWNO5+kd7yN5qg3Fy+lmM3RqDqwnVJ6pnkb4qr/p8/e7sIH1r3tiMSewzOVejqPbT+ZDGVfmI9KdQfbX65+Ki6pDlROmuOtR8QTbR+nWOxZLZQPpQzTq5upbMScanCxX7JKbd+CDbiIeLBZNHdldfVGxZ71e7rq+T+KF11Q+MI+u/bh+huFS5NLfJ/EnmCbKv5gX6RLo6NVqh9K55ZPFXebkDl1Mm43Sq/CgeiS03E938ZLlfz6qZsX5318kcY7WgbCfy13WdK6xfkvnDOKHrVXZFwp+dcbNF+Yl8ZX7UM2nPrTl3tbbyZzaUD9VfdgbFG+lD9cXOuXpUfrDcMH+RvavXXG5cjlG/Ip7VxyRvjJPaq7zT86n8H/9IMBsMyYBARFCgqlwt3k4RrOdXW6sexb2eQ0lF8usn84cVS42PW1PF4YZaYg81cpWvMWAFxxrBcWQcauxQPmotIpsrN5YPVfdqCKx+sZpgsWF6qq+ME7KprhkY7xWqxlc9NUfOflIbNcYsXsy3NA6IQ+0B1rNpLbj5kMbMybu5geRQfzE7qC+UbZUfZKfq6OS9m+9EZ9pXrNeTsylvldsEqB67HBCSOmS1q2Yhmydqbqq+QvMzjSniq/Qrv9EsqH4wfYh39Un1pOrnpM++fqPKoHmi1lGfqPiwvmJriJ/SwWRrDNCcZPlCdVt5V9uVD+PK8sp6vNYIs6fQnV8uZ1W25qjaVPF0sVXynRmAOFY9a80m8nUN9X21X22t+4mt2pfrWtXn+KO5U7khezVmaB/JMX9Z3JTedHahmVT9RDKIn/tkdlBsXR8pjohX9Tf5jvSqOHfnTrWl/Kz+du2sfE/qq7qcvV8uMagZu4XkioCRdWdW/UljMlk0gFABsAJVvtZ1dN7pdQXtfO7IqeGl4ozqRfFmjcrihgYK47xyYXlj+Vb+sGvESfFR+tfYKO7Izi7SukA1wPKh+lXZ//yNa13NE3a+nk1mktpnOpAfrhYUv6QOXd1WOw47viueFZ31NfdMnvms+jTt7fTc+t3xRfWw7il7Ch1ZdhbNmMq1YyedS52Z4WYNyoO6f6jzKf9aP2xOM45IPuknNlvWs4oH2u/W0XWG5Qtdo3igGVZ1M551FnT6EsUAybN5i/Qhbmt8WL46c5TtufhXLlUPs8dsuR5BPe30ohy4vqxzgcUd+V7l0frqA+OPapTxSuQT/Sxu7BzzH8US+ZzwSWp47e265zhW/5y/SKcDq1NVD4gXkkHnKz8XS9aPzD90DsmjOK51VWtBXTP+Na+Ks8sX6ld1psu/8lHraW0psF6zZFRh1HUne+0xKPl0DeljvJRsV1591u/K75RLd1+tM3+Qr4q78lHF0sWhyx3ZcfKr30i/ii/jypDarbnocHL2mB4VT5Uzl8M0nx0+1YfqT8LHnUm5o5gkdlhuFf9ufBiYnNO1ywXpS2XSfCW52uGV5EWdTfkiXV1fnW5VE8p3xyfhtMohm0p3XU9jiWwlPihZtKf0Vznnm+KIdLA8pjFy/jJZpUP56mw7+ep3x1d1JtHr+DGeqU8dm042zeEuh1N+OR/u5sDZTetWxc/lvSOf9te6jmqW6atg+pFOxsvFrp5lsmgdcVH+Io6MR8LV+eHWmC7GW9l2fJQdpUvVRcpn58xqu3uO6XJ2mJ/OF7fugPQwuVX+FyNR3/Sta4r8qly9lXVv/tibVsVx5braYG8rEz6IO1tTPrs3o8x+jb/jqooWnWNFt+7X+KJ4J5zWt6fOD3RW+Vb51DN1r9p3tVW/1zqr+lic0v6qXNGZJP4oZpVvlUF5RjqrDuYnyw3yj/mN/F3XWD4QR2SLxQL1x6qXxSadD4m/Kv5VvnLtgNUE0lvl1niwmkSxTHmhTya3qz/Zd/Wh4pbwRn1U84tmoeK+nmN7iA+bX535U+H6JdWpYun8ZTlL/K06a5+rOZfUA9JR47Fes/yx+VOvk/ye6mlX/453XXOyVeflB5sj6/xS/VfXkQ+1pur3JB5Jn7N4oH2Ud6XbcUP7d2sF+aPqX9l3fFabVXeH55PyNU+78wftMT13+XfyleSb8VQ+Jb1Tdah7Q9WpuCX+1pnk5JFPKYekZ9dYKL6KH1pDM3a1g2a4mutJPlg9KP5JDBRU/3R6rjsnBoPBYDAYDAaDwWAwGAwGD6P1FwxKxr3dY2+mkrfaKR/1Jly9YVNvzxy35EyqNwF7I4lkXbx3/O3w7Jw5Je/y7upNvcFUuuqb+IRvWv+7NZa8DVac1bmqI5WtZzpvjF0uu/Pku+rhbq3vXqe16WpPrSU1h5DcX9jeqiPJF7tP7fjVqTeFn1LPzg6SrboTX+p+wnFXvsuHyXTi4uRRDFco22vMUSy6dc44IC5Vrtrs1DTSxfSjGKS1kvBP9bg4Of5KPo2zs8l8q/4kcpfsnfmt/GJ8k/5zdhM76lzX5zvzPJm/J+dbV75zf9jl062jhI+qg4qk3qrszjxM9jp+OP0oVnfqrcbBzR/Ex/lxp8bSemZ7ab7SuKmZYgcjIrPuJYOFOYpsuRvMzo0gbeydRlbxcejEKBkOd4ZQx48dn1lBPiG/nnMxqkOBDYjuMFG6OvJuYKXDcPVh9eP63pFf0bmJpGdUT96NZ1e+5rrOvDRfru4Yn7vyiOMOn+6MV7WT9mXip9KH8pX6y3xI+z2Z7d8l36nptCbSulnlVQ8h2bRGk1xVeSVXOXXiszt/1Pxc4fLL5OsZxEXZTPPq5qGLXdXFfFb8d+tnPZ/Ir7zSPmNzUJ1n/q3c0jXmYyqnoGJY85DOJzevkG7Gh/WH6hvkU8dPt5dwX3mqfOzMH+SDkq3yT81DttftWcQ9mSPJ7EC1uep1daL2XH+yWLg6R7lL5VEMqmyNretdx2Plw/YYl1W3OrOeQ/67ubGjn639sSn8/Y/c14J6va539SN5dfaO3V2OJ3R2dNyx0z3z/+x923LlSI6k0kz//8tnX8Q2lJffEKSyZs0YL4eMQDgcjot22Nm9TE+1Nr6V35S/U/uW47XvbNnZNv5Tjdr6QXv1y+67s7mX6qCxPbnTxJ9W0svZt/wbfMe7wU2Ym7Nmr+Xv9DytB+fH7Tl8t5+w0G7LX8Wk/CpbZ9/kp8mBe99ySzYNnspXsmd5Y/eTbmyvidPda+rhJF/4zOzbmJx/pTPzmWJm52qv0cDZt1o43Cf1SWcqLsfNaeb4JP5Jk2SneDV6priTr5N4HT/ca7i0ut3Za++5/euMaeJwWj9J9wYbc+B8Jd5391Q9sNhargzTadToqXg0XBU/h5P4I4bTDfkrDi1+49ctpSfqofYam+9kMBd+3WFfptxXL+Xn5M51j32RQ9vJUeEqDkoTxwfPWbxNzNs1/aivee4deWE+2/xubNmXTpeTZL/hmPjfsd98hXa1t7G/zjZ5mz7UXeaT1fdlw3qSPTPuzJ5x3ujTcEX/yAM1SviIc2Fsa/SOPfrHZ+ST4mD8U7zT17RjNYar6UHlU8Xl6pD5U3WI+OirzVuyT/2Y6tnlguUR89nyb/abGkN7dTdxTDPN1a+KxWnB6sPF6XqF1auLV+GnflX5wH5n8alY5/vVFw7f9S3yZHvIC+Nz/c72XV6YPeKj1kp3xFM8MP6kJ8bHfKo7yCX1v6sJxr3hNfeUfo5D0kLNAce/5Zv4Nflq6pnpwu6pelE+0T7Fw/BZ/SjMJv7pJ/XyvO90VP6ZVs4G7VSPs3Pni2nKMFUsTb8p/2y+udnkcqtmGNqqnJ3MzlS/TX0mrvOO8tvMqxTL1xd8oEnDyjlnIrPixmJzgrbFOXGcT+avHdApYexeO1ROl0qqawymkytw9+6GZBOrG3YpXmef4scBxHw5PZ2ti5H5bfXdDAI2HBW32V+ulqcv1pOs/9Ozy5sbcIyr00cNVNU7rqcafMRoa06tDY9p3/phNcDiYXyaeBVfxcedsViR88RgWKnOWK2k+6i56iVczN7dRZtUzw0+mxVoz+JW/hlfhz+X2082yh55OU6IozSYvyz3m5iRN9PxKXsWe9O/7O7l3+0l/FS/jIuaP+oOy5XT5yQHzk87g3CWJH4pJtbDjoeqDfWulpqJiddmPqU7LUfX88yeraamJsbUkc0KrD9X/wmfnSdfSm+2nzBcL53UEpsdTpvNauqP2aUeSflrz1T+Glu0d/WVODEcp5l6/vOzXL01Wk2bRmu8p+43Pd/0DdrNdzYr/5UXFJAtRRTP2LuzQaLOPvFJvjbcFZ9WH1WUiVPDeXO/5aHydjfW5He+u7wq2ya/jf4px3c5pZyk3CCXbUyIpWxdHSR+yb/LVcJy2Fs9Gz5Kh2TPaifpd8InLVc/iovSju1t430qFnWOPhUHFWvzqzRV+JucT3uWh8SnwUfeKl9qTz0zv45Ty8PFkDgx34nnKR/33PjYcG32HRbz28S90ef0nuKt+CNOw9/hOo0ajdNqMFjsKX7ER9xmJVzHMZ013NDmCR7OxulwZ19xThowzs63i7nBd3YsBrePfNxZE0OKudVDLedT2Tr8DY+0n86cPtul4k0aqb3W5m/bN7Ypj2nfYW3wcX1/Ps/8y47LIX4BYl+k1NclddZ+VXS47p7bd1+rGS+MkSWNfXVu+KGeyTfjr/y5L48uBywOpuG0U18b1ddo9eUX391XTYXL4nFxnuyjNiknqQadvTtj9YPauf5VS311Tvqy+meaJbzTvk9fvac948XsWW2xWlBxbmqbcVQz1ukxc694KP8p3u3azkPFW+XL8Uo1x+aQ6xdW346P0rLho95VjarYZ0xTQ6Vb6nG3mruocdKH2St89L/h0+4xf6hto1erKeYv3dvOK8dN1U2DP++jP+d70z9Ml9Tz23pSvbKZa6nn0TZppWai07Vdif/kp3Td9iF7dnlIPeBmQooVF8vP5JT4udmGeA1+szd9sxmF/lTPubwwm3bebuxPlsNQfFTcaoY9wTHNUnx3z8h18sXYEANzyvi5Wkhz2tnjPMF7Vw0jPtNxq386S73LYnI+n6yfd73rXe9617ve9a53vetd73rXu971rncdLvs1nn2FUnsUPHzxvPtF9ISr4sH8Ojy039gq+w0fp9NWV/elccM/fRV0X3MbTopfOm/rOvFmdgnXcWZfhRt7Zqd8IscNL2XT8kpnjV1zf6u722f5dfGe1MN2VjGfyMvlp/GxxdpgJ/536x/PE37ql6+v/l8eMttT/lu737KfsZ72ZLJre8jh/UZtnvBP79va2dTnyfxJnNNcvGxSHC0PtFHxp5l5Gu8de9YrSqvNzD+pydP7T9Ubw2/9ORxXD4xPUz8JP/FpY2R/dza94PDv1lOTm6Zf1J3N35FUr8n2dMa787bXkq3i3mrd1OeG92/GqmzM1XwcAAAgAElEQVRYHpU92jKsr69+np70ynxvapSr8G8MZa/4fSeyeIHtpQAmqUbozSCZwbLAcUhMn4ibRMSliofpobDv8Gl0Z/ZzIS5ya/ljLHif5YFhq1ibPczvtGFxprpTPpyNqnPk0zT9jIf5UrlxdaPq2uWH2Sk929xN3gqTxdTwR3yMx/Us2qR40wxQ/Jm+qtYmlzlvme023pPV1hDubfyqnLP+Ytiuppw+jmMzHxhfx/Wknpseu9svjK+abQyfnat5lnpoo6faY7WJvJp5ixqkd8RX3E77UWnnsJm2jpuKj2m2rTfVz0wzhpPytdXjxH7Ggfqoc8XXcXF76GfyVD7v1NzEcfgsJsRotHdcWZ6VvcNP9ey0ZTXRcELtULNmNjCOrvadfTNPWCysJhx/1VdMC3WvxXBn23lyip/qurFL9enicFxZrbh9Zzt5sx7BuFS8arU96uoixdvEnuaZipH5UjPkX+Q/Y+H+tJ02uMcw2vuKi8JVMeCei8H5O91P/hj3Fj9pzmwbPZl9y/9u3hw+3nO+Hf/GvtHHxeRiTDzwueHcYjkuyc9W98353Xt3ayPp3+ag0czFlPizemMrcUk1kn43d1OMjjfTPmE7fd0dpWNj5+4xvs4m4br4ULvWp+LBftP9xKvhnGJtYnP4LccTDbd3TvTd7DtNle9UR1irT3Ft+CmupzWRbFv7qYXa39TKpi62dZ3uJP/X/lxbfLRp60H5VbWy4bm1Z35P86Vi2cTr8Fvfd/eRa4phE5PCShhNjpKtw9jgs3Olz8aPek4YDV4bRxNT0miz32jG9pp4kf/0w3w+5UPd+cf/N9tfX92/XmFfedQXq5O7c2+STl/X0Dc+X+/qayT74uu+hrkvuS5G5LfhozAdD7bPYlJfwR1/tJ+8MQ4Vk/v6yr5asybBs+YrJi6lHdooPZk97iutpz2LGW1ZX03NJpaKV+mjetfF19qjncqLutdoMN9ZHTB9Vc+neFneHX7qb8Z/8laxq7rHX1cjTE/F82ShL+YbdW/0R71xhig+TIPU76r3XT87/k5jl5vkh8XY8nB8GBe2Zv6Svaq7xJvFweYYu3fZszgRh/FXeWruuLziYppjr7M9pSHat/qq2TM5OA3ZXcdb8UOclIc79dPYI3enBdorTdhSM8bVh+o9N69c7Ki5uuv8umenA9NYnTf2G3zUs+mv5l3Fy+ZEWorb1p7Nk4TP6h71ZDgsRtVfyL3RpMVnsbi5gvl2+GomuV5iz+z3z89y/aPyovCRn+tx3Lv4TAznK8WuYphxNP3VxIv8UQeGiXWcfDD+qVf/9YEGlwNoEpnOnB9s8BSQGip4xooH/SEnvD/tJ6bipzRQjaP4NElHbPTPNGE+1X3FcTaN05kNLOTlGt3VBMNwWjAebjFujBPWA8st4+b6gMU1l8s/881qPfWYyivLKasrhjfPWQ5UfrEXFBd2v+Hm6ljlPeE7bux9xoZ1gHYnNm19Jn3wneGyPaw/poerpVTjbG6wGB0ntVjduDtJn/Su+oP5QS5Jx+QfayDdZf5O4nU+Vd+1/Tz9sHjTnvOh4nP7TCvmQ+UVebr6VNjM1+dnJTuMi/lS+WU5YfcSj4SPmK5+0u9GB9xX9ZX6Rek67RlHlhd8dnaJk4qN8XY8WSzs7MTO3VP1xXKPd7H3XGxqjz3ju5o3+KzyoLCx/ib/hO/44h1W3+mdYTpbtE/4J7Xs+q/NkXtP9YR+2cxRXNiZmxXOlvXPfMZYGCaLF/edpgk/cWU6MVt3l2midGIaXTgyX9N4NqUSHe3uLNfQzAbPkQfya7i2caA2DjvxdzE3fDZxNnvuPfFX3N09FetmP2mZsFK8yo5p7fQ/WRvu03/ac/6aeJu6aWvwxL7Ba/cbzdraafV3dZJ03tRWkyt3d3v+9B3MgdNm2s/zFt/tJ98neWx8NlznmYunXeqe49vaNTErHHfu/LI7Dp/5cpzQl7JRtolLmy/cc/atXdKHPaM9ixftFa/Gj7N3PFRc015pouw3vBrNFWbaYxwa/sil4cg02MaS9Ew6ML8n+E3O1LOKn2nodExxMczEnflsYm3x25XymGJr7jYcVB6a/DUYCV/tOfsmv44346PsWu0YF2afYkt7jlOD0Zwp2/aOyxXDcflEm+9p1Hy9TF+z2LvCSngqyPnsvmCymFxBMW7OV7NQX/V1FP0xTe/6xziaAkz83R3mA2PHPXUf7ZHLZcO+LLtY0RfiOnzFnXFuFtOTYTB8dZdxZLEz7dVXXcfH1RabJVt7V1uMj6stp5nyifh45+682OSIveMz5gbxTuahusfyhftKSxY7i/Xau3gojqp/WayKG7vDZpbrQRYHPqe55+yud5ZbxUlpx3iynM+7zXxw58qf08rxam3Ys9LG1e/UmZ25+lP9qHLnap69M/vtTGL6qBiY3zRvVC2x/mV4isv1PueBq5VpP32xd4zX2TBfrr7Ye2ubaoPhunhVb2OeVW0w+4nb8lE1xLimflc1c9onqWdTrnGx2nL8E+7WXt1R9m7esn5Py+mu6usufpopLT92zmr12nd9oLDd/Gz2WaxuXuM5vmP9Ky3bGJV/9KXqy+WyqXnE3faJi2fiK5xtPb/rXe9617ve9a53vetd73rXu971rne9679YzVecacOe1Zetj1gNh/brc7JnHBOfDb6z3Wqrzje6oX92d6sd47ON42Sp+mH821pT9xoupzFsbRre7DdhObvkn/lSuKr+WG5OcrY9P41V2aflsJpcK//sLvOb8qzuKP3v6ud4phg2WiiOiOfy1di3MTd8Tny3MbQ8JkbCv8Ol4aPsTnCfyNNl08b6N/RhMbQ+no4XMZ/Im+KxxWv4tnfc+Uaf1k9j5/LU1gNiKf9MI4W/iXeD0XJufSde7J3tb/ijvbt3mt+EoWI9wW/iZfvo9xRH3W1xEj/UYKun21O8Gx+Oo1uNjeP7lK7z+Tf4b+zv1NyTvNb/FQwKQv55kPonT/NsEnP2Wz7OF/PJOGz/+Znjk3RLfk54Ov7unyRO3Ba//SeNG02bfzKXcrxZlx+WE/XPIjf7rQ3qyGLc1CfDSnbbPTxz/FXenA2zdTFffpV9M8c29rhSfhVuet/yT/dPar3hk3LV9G1T46p+3F46a/dZnk5qNM3LbQ9gD224TGzWt4wX8+XO2UrnzK7Bx1nUxIyxKvtNHE/UuuLDZpXzvcVXHJX2zex8gs/07fLVnin9m/pxsxjXCT7D2NZiU4Otf8RLs0Fhbuez6y+Fv9lTcbM6m+/Ovq0fZ39HI1Vv7exLOW7r2eGw2Nj5if08b2sxzQyVN4WFejVaO9vWJ4vB6cfi3cak7B2245/qecP/rh27d6f+G/v/XfiMpd4nwHxnz8w+LYaffhUnZ5OwkA+zU8/szOnY6JNsU8wYg9OgzYviw/wpLsrOnW90albSgtm0S2nm3k/jbWJI/pit4pz2Wv8YY7rr/CeOLZeNvYqD5cjd28SR7io9k716Vz43ujB7p5XaU/iMv8JXuWnwU4yMj9Mh+U93Wj7OzyYvCd/FrfBdvjZ2DX8VTxtXc4+dtXGcYKvnJ/CbGDa8tjElmybH25wyG/zd8G3vbPLc6D/P2X3nO+FOG8yF4uXsU2xNTShMZZeeFe8Go9FY2TsOaM/0cn7UfWbvVnPnt3Dv2LYaqWelt9Iz3WN+mtw432pt4kRbZ8+wFQ6LJWnQ2qU4mrNkl/Kx2XOxXet7fj1iX4XxHQH//Kxpe+2jvfvqpgJHW/fFzvmeeGinvoSxWNEXnqPdfMZ77gvcPGM5YLiohYrBaaS4J/wLF89YTW1X0kh9hWR7yMF9dWZauS+7SduTpXpF9SP7dTbInXHA3sK7k6viz3yxnlYxqHpUtXnhqp5VsW7tWfyKK2qh6pjp0T4jNuMy7bGu2F1Wb02/qXzOvCu92F2lp9JA8VbYDb6KU+E7/o3/L7FS/SZ7df/CcDo5H6yeEj+WJ8bF2bJZMjmwHLC6QT/XL+tnFoeKVdW30mODjbExLZ6ouzTfGOfG7pQPq4uNps6PmifprFkTR80K1/vuHO9vsJscqHymXKe+xXc3Exz3NF9U/6X5wHLP+mrGkWaPssc7DFvF12iANirvKp/MP4sB7+L5dqY2Nc38zVypvLP6xvuKh5s7qBv2PM6CxHP6Z5juV2nncoB8VUzKvpkpCpfddzXscsTiSj5ZjzjOTKu2fpX993TMRJ37qcEaAiooR5j5xaJTBcn84TNrTryHuEqLlCBVSGylYkh6MDsVO8NmQwPxFV6Ti3apIcC0wHsNvuLK9lWts/yfxM10RUys9XlXcUZ+zZnSwOXY1UWqCdXHzD71aqMtu8/4ok6Yi2vP9b3iMHOIfafidL3A/KmYMO7rvLHH2kOuqlaUDgxD4bp6S8tplbRMPBV+qvtUY20saQ4mHojDYlM+XH7Vnc1CPZLuTD/MhcObe6zf0a6pQ/Tt7rq6dLG3Wm/7BrFdHaCPxpeqSzWfEbe9f+1NbqrvWf5ZDl1fIE81w1jvnyw1b5FH4qkwUIt51/1tUXhsoT1q4+o9zSeFk/aZJi4ep42bNcxnwk/3mf5tveIeu+f0Qr8KW+maZmM6Y/O2jauZcfPdzWXGk9W3893MmdRrKT+fn3XZuvpu8JM/tVrt3Znj73hcOqIOuIc+Vc22s4bZfzNjN4QcMSSPZ6yQsUAZFhZyGpIuaCzy6ZfxVyIz7riv3hG33VcF0Nxhxat8q0Z39gojNWKz3OBL3Frs5pc1PKvXJ2JGfKx31S/4rBazYf3lYlE5Vn06z5DHqWbNsGPPzGbqOmNgsSkezEb10JN1ghwZN5Ur5IKzkD2rfG54Ib+0/+RMubs28ybN2omn5sxdDokHs0N7d/c3czI1YrPJ1XtbL6zvn46J4ab5hUvN7Q0PNZ8Vl419+/dIzVCVS3xXc1npqzTgCmleGGeKKcXjfNxZqYab+HEOuLmU/uZs6tvZ41mqR1XLSgPmG2ehqj2Gw95T7Tf9omLCxfRkeWXzfvpRM4bZJz4qJnaP2bMcMv5qDmznJcbHOCcdt35VrO6O4tJwcHlhdpv+3s4al2eG0+BvZiuLSeWB7SU+zfy41jcSVw3nyCBZRYg1iRIDybNhpxLWiOEamvFlBcniw+e5h78nBeeaUOUw6dnmM+VH5Ym9M58MV+nDtElnuJ5o+Im1sd/wTD3mepbVycRBu3k/9TP6YvXo+iH1L9YPxtPo4GJp9lVMqtecRi538+zzs1Ar5kdhOB7zHf3O+FkPzrjZ892l9GAxNPXZ6Id30kKsZh6xemn6Q+E3sbP3E0w8a3ovLcfT5T75VPZ41+mgZswm7wqrwWjz4GxdvGw+zzOsxY29ikmtjcYMH3VlPcXuuv5hud9ybZeLj+ntfLH5rs4cZrrHNFfxKY3w97JN9pNT87cAbVRsaKPq/7JlOIwX0wvzq3LDlrJT9aD0nPvJ97bON3PA1RzL6VavxDnVD9rgnEu5Z/cRg8XlZo3rY9dfLM4mfsejuefqQc0rdr45UxwazNnv2Mc4Hxiei5fFuOmXd73rXe9617ve9a53vetd73rXu971rnf95WX/KwrqEp5v352P7Vex069ozG/Dh31FV/E1PP6LeNsvn00eT+6c1NxpDOzOpl6f4PVEj224bOxw76RHnuCzjXeboxbr9Nz5/vrS/8lDMyfcbGrzcdf2jn7KbhPXJsdtXW/7fsPf8Tzhk2yTPeP2xN/fxn+rpeOl7pzos+n3p2r0qXl+UpdPzLft/Nnqhnasj13cKbeb+ac4bbkk/MZ+249Msy3+VnuGc3e+uXsn/NsYNnlr+TDfd3w4P8rXnXqbNbSdq22dJAwV23XW/i1h9shzO3e+xGpqq52hTUxubWv2zt+LaXOiT9OXW/zrzonNBt9xcn2g7KUgjYO/kYB094694o38TxryzrrzhyINOLWa+Jo7Dsfl3Nn/Jv8W29U7209/lFqcJ/jfsZ/vzR9PFWv7R85po/wmW8b9Kf0Z/mZetX18Mm9b/k19/mZ/nfCZ9tcd1FxpzLRk74zLCf+7tozj9u/RvIfxN3WMS/Uv8kz7LE+pV53fyc3Nq3aeJDulnfOX4j3l09T03fmW6m0zV9O8dLXo6g+5K5smXmZ3UvvzDHPe5DrNMhbrCb6KMXFxz8y302djj3sqb039NvjOBzt3fv8Wn8tmg9vOYGZ/Wm8n+CnXbAYyezxPd5uecFqwdTJvG/9J581MaXgo/M3sm3fZu4v97vxxtcf2lPYOw83XufetgmXPc+/aTwlG+4mjhGE2+MyKorGfzy6JSmilzWlBqDus0JNN44ut1LROHzyb+VYNM+th7iVO01Y1RYoTz1VjzF+0Y+eNT6eHwnY6NjFPHmjf4isc5bup61Q/yE/ZsHfF1+UU+bu8znM3c1jMqv6VL7Rv6mLaJn0wJlWLaKt441nT56jnpl8UD5YfFbfiz/KkdHc6uDtOn6T95KfwsfZQF+yHRltm1+bd6aLiYLlnPTX3Fd70peJT8bN6QBuMv+nBbV3gXYXHsJWWiSfj5moa88piYvGwpWpa+WM1rPRzfBqOSYuE1dizmlYYrhYZvps5ThN2X80KxE5auVni9HE2jg+7m3BYDZ6ebzls+bgcJ59svrJeVHPG8d/gN3Gn2azs3dyY55Of67d5T9Wu05/lkvVO8s/imL+qbxIfFw+bh4wb05E9q7pq8dUdVneNFu1yNY128xft7B8yBZwaihV6MxCQqBKUNU5r78RwTfo/wcJAUTGlhlRF1PJCjq0t3pm22zyi3s6HarTLbtM8TbyIibaON2K02KeLaaH4qPspT4mD0n5T6yq36g7L+Z1B2vTUSW8m24TtZmQ7P1OfYvyNNiquJ+ab869iaHLW7DX1wzTY1Nzk32ia7qiaa/ribr42dknPZu46f3fwT3qM6b3tYRWnem7idRrgM7PZ+GH1hljOl8I76cfU0ykO5qvJZ1sHTCN3v62zNnYXI8PYxtvWv7NjmrGV+onpnHyfclK5drgK39W/W0/Y3Z0nrsdYbto8tP3LMNpe2vQL0wH1UFzmuavRTZwNR8XF2SkdHScWt9tj/lAXN7PQDuNQcSl8pQ2LtZ2Drh7TXXWfndf/x4ayc0E5e9xTzZ4StrV3haM4ueJW8d613dxR2rrGbWNt9WH7jqdbrtCnDxarwznhw/RQv3j3ZEA0PpUmaam4215vZwH6dPecbim/LXc2AyY35kPxYrXJeLcxNLlWsWANtHWp4t30kMJUsaq4VG2rGBv+yTbFcDIf1J6KN2G4/XmW4tjOh9N54vI7bbEftvWZ9NzkHntne19xZLFsz5pZq5aLj+G7emWYLQenu7JPc0DxRzzHk/E47VNVl4zjBj/FxxbTz2nm5mqKC20VHxcvWw5rwyntK3+uRxXnlMdp08wr52drz3g5HZEX46r2XE1tsRiX6afBbu1ZHGjr5mKzv6kfhZt6qJ0xzLeqibv12eCzmnRzzMXazJlU95v5ib5nzM5Xqod/3EPj9D73Glvcb/2lX7WaotryuVZzt8VzXNx5Wi5WthS+4+/uK56JU+Lf+GV4Tl+0SfE3eis+zWL4LP5Gz5ZH0vGuD5fT6zlp3uAm7lv87fkGX3HfxLqtv0YfVXvuXuLtcNm7wnWc3L2kR4oh3U/7Tk/cQ10S10a3DVe3lAaMZ3NPnae4m7xtcrBZG5+KN3JSe8jZ2eO50ldhNn6a3xRb0kXZKF2Vb7RPy+E12MlnG5eyb7SctuxOwne5ZPfZHfaLz4ljm3emDfPL4lV7ym/SA/mw+FxcKjbHY2O3jVVxUTlrfTQ5bzVLPFo925gcX5f3BucuPsbS1g5yaLRTzykux8lhKn7b/DZaqvjVucvJHS2v5+/PR3/tvRb7Ouq+fM53hZkKCP3he8Jh+4oP8mb3FD+Mt/n6mL7wuTiar4Ob/YZb0sfxnDpNO4bpdMZiV5wSHqsht6Z/zK+yUU2X1sTH+krNrurC9aCyd2ebeNp7my/mLr/sXM0r9vXb8XTz5MJiub9yquYnqxU3P/EMbVJ/Nfqo2Jk+KvZrT2k6/alnjANjbmsVc+98OX1YHMw+1SnychopvdlKvXnSu808dfh39i58VeeoH6uL2YPMl7JXzyqX7B3tWQ+zeJkOzXIzxeG7XmL1r37xWeVD8XE1wPYZz+1i8/Jkrpzgq1ygPTtj581SfNxcTXONYaDNhh9iKHyng9pncwPPVCxMR/Sp5oOaV4yzwm84KBuVB9RT1R/OMZyNzIZxVPoofGXP3lneNvYp19veVzjbxfpTxedqqNEe721y6+7POBSfaa/6j9VJg69mFYtDaatiUvdYv7O+dzX6rne9613vete73vWud73rXe9617ve9a7/i6v9gsPsmi+XzTvuOU6fsRqOyn+D0TyfcGRnKWaF0eqQuEwstd9wS6u13+jzFL7LS7OvNEu1s8mv89fcOfGLsSZ852/LceuDnSfbDe6JvePS+lPaz3Onb/L3xD7j6Oqosbkbb+La3HG+2FnLa8vD8Trh7jgkXhu7Lf7f5HM9z192rjDSuXtWe43/5hxz3tboho/DZFqq/Tb2pDvapFgTlsNXPtJZw/10P/lQ/Ni7i2OrJ/po+avzJmbHs9VHxc98JJ/Kh8JvtU5xJz6beymm5KOxUXGyM8e5jTnxVX6fsN/quc1Lg7G526wTbbY8Gh3wvPW74bOtH/X79fX19dj/iGD650ifj/8fMGreGTbjo/5JmOKYfM+9eaaeHV+1GJbaY/Er/sqeaea4bONNsbf22/o84ZNqCM/aWkz/lE75TFzu1OeJnq7GlN8Wm+ErDVi8aW9rf1pvGx7zbqrTLZ87/XKip8p76sU0R5q6vVPPWLvOXnHDsw3nTa8wPm7GOw5srjmsJ+Z0UwvtTE32KqZNvTlcxN/E3dbE1n4zb1XfYj9ssR1/N2eaXlR8J4bjxeJnOHNt4t5wdTowfLTf1puLJeGzd8dfxTnvpjgVf1Wfjr/yMzmd2Ke4Uz+5vLscqlpFnKbe1D7Lv/tlMaMPpo+KA+9g/bD7Sn/k5bTc9FXiPu/dsVc908ar4nB9xDA3Z4wvWym/J7OsmRlJn7ZnUw5czMjPajQNPmTNs/Ts3tvfycPtow93xoJn/plfx8s9N4vZJ22czkqDhMHuKd9pv/GL++rZ8XUxbfR3cTFblqdmn523Gjf82V3FCW3Vu+Ov+KSYWvyElbjMO1v7xNfxv4OvfN61d7438WyxcD/l4IR/sm/i28ah4mr8t1wVvxbP2W30bLVwfDC/icfdfcYh8W5qht1TGO5+8nXCf/phmjMbdSflq9GqWcx+E++832hzGi/jks4cPuONPl1MW14nWC4nLkYXb/LNVqMHu8O0ZbydBgpPxd9wdvwdj20MSpM2Ty7O1q86a+NMWM42LcWZ8Wl12vBsuSQcxFJaunwqW2WfNE33XWyMZ+LXxutw8bzBwRgVHos12V+/3/Orjvsqtvni+Pn4L2xuXXeZSO6LNvudNiqGaw/P5v4mHvd12fl1PtgX3KSFih3z5vCQB8sNw9qupK1qGMZ389XTYf/5WWhzxc9s1b7i08bMNFfc8E4bM76zfmjy62J0taV6nmGonmbxbu2d78lTzQ2Hi/jMPvUfO3P3VQxNPCwONmdUPTEbxq+ZbyxOpgN7ZrEzzaZvjFHxa5bqUaeDyovi1tRcM38wPuXP1VeKeZ5vebX2eHZid/lSte5qGM8Yf9UTyC3VqYpL8WW5bOZGy5/NIuVvvmPNJ33mHWeLsaQZ0tYX2rB+VXio+YwBuSqejAvT0umj8NU+2kw+rs9VjvEu1oWKR9njs+oR3G/ynOKfsSTtlAbpHvp2MTA9mI2r+UbnyZ3Fye457qpHGH+Gr2wTh5Y32uCvskkaqbnY8HIxz6XmkpsD0zfT76kZMe2RD8bH5gqLn8Wl8sDuNHxYnTIuyp7V0YXzvRlMipxyjoRP3tEf2iAn/MXnNHzYHUySe1bFMm1VUWFRsIXapyZj9jNP1y/iMe4Yn9IOlxpA6i7Lc7vwLmtk1/iKG6vtFMe8N59ZnpohMnFcvpBvU08uDtajrIaSFuiH9ary0fRGwx05upmiav2kLieGqiOGzebVfHf9vsHZxDDzxuqL9dcWG3tF2bm71zPasXmLeWH8VY+qGNUsYjZqz9Uni1fNFhevq32sG6eB+kU8xXHantqzPKW7rh9xYS5Z/idfdab0ZP6cvYpZxT65I6aKieXS8cFzdYZ8WA86fRxHjB/zO31OLJYvphvDVzpjfyosVYeJk3pv9GH4ijtbky/mGuNVOWdc7vQju690wfcUL2IqPg7P1WLq58Y369WEg/ooHece6tlyZ3zZPsNMM6GN98JWtX+KP20Y/mamNfYbXmjH8qh8udm34YT643xWvXHZu/nVzrFWq1M+6o6yR+6Unxq0TuT022Ck983dkxg2XLY+Ntgn+/jc5ArtNzlz+4m3w2l0TPgnOUP7VoOE4/g2v81K/F1+t7lhfhX/JnbGO/F3HJu4nrbf3m2wTvjc1T/hN7ZJl7aGcE/xd7yUL2ebfCQbpwfG4jRy99n7CfcNhtpz8SjtUy7U2clq9WN7LO4Wcxuj2ttoiHzZfZVLF3/KueKTMBWW49TaJf3neeKieDdclZYpBtRdxej0dOcuZua3fXbYyCtppt7TYvbK51Yfx9NxObFVdzdaKS3auyz+xv+0U1oqfmo5fRT+abxp3cVv+G/t0Se72/B0MTm9lI3ba8+TxgpT5cBho87OX6NdG8P0yXT937+gcV8zp83n0/0na9Ou/SLNFuOlvngjr+sMeaQCwf3tl2HGVeEjHuYD9Wdfl9nXN/VVkcWzabRko3LBYmn8Kfxk775UYj3PZ9Ra1Z3yz9ZsUqf39OFqDWuc8U88W+7Kf8MNbZKe8/7UIeV0y93xTb7u6Kbwpl81O1yPs3pgMai5zWwTXxq7bb4AACAASURBVMZjgzlx5nxm823ab3ppclTxIxe8w/xMvvie9GHxJ97qnuPF9FScVM00NYHxKi2auHCPYTB/+Mzw2r5l9cv6S9VeO98YhstXa69iUpgYK6vtDR8Wv8rffFfzz/Ud45XmH9NHLedHYbV97bil/LQ4DSeFg3O2jQ9XmieqT1V/IXZj73KW9HT1puoYe8nxZ/nDudb4VT7SvGecmL/Pz2L4alYoPjM2fMbfbQ+fxttqssV3WE/Y49xT2k77tm5Z/ao5gfeUTYqJ+WV1MffxLuM/n1mtKX6JD/JnXF19qHpKff2ud73rXe9617ve9a53vetd73rXu971rr+5PmNd7+yX2bvlfM13x2eDjZjJT3Pm7jg+yrfTheE2MTf80eZEz9Zmg93ib+xZrFt/T3M6sU+1gnubukk1q85aP1gPpzE5Ptt4N/bbeyd80nOyd/dO9HT4zjbFfee54a9iT/lq8Z0PZoc+N3XRcEEb9NPwQR9OM2af+Lp8Mg2aeFvbTW6ddpt7Lr9Om8ZHsvsb9ixe9s6wUp7dXrLf6v/b+VKYKYYGu+XfxryJyfFPexsMjFXttdo2q7FvdW/ut7iNn1bbrV6ofeKyye9de/X8BP6p/s7mCZ4NDxdT4p1yy85cvOx8w73l3fJpdU7+Nr5bPs6O/vMyvKT+2ZsCT/8MSmGpQDb+0z/fapIysRQ+Yt7BZxzVWesj6fxb/B1nledUA4kvu7ux3+r5X9ineNlqYk25a+p/vj/RXwqjqae7+9t47+A39Xl3vik9mX2aAZv4m3mjZoWzZ1yUVhgT+mz0cdjOj3tW7w4ffSifzTlyOOX2ZP+2NapW6pmUY9dDDMfVa3rf9HuK+W/ZN7PuOjvlk2Yb4qccOHuVH7R38ah+bPmkpWZkmp/tXFX2zZxV9kwbxt/ZqzPFX/FTZ+6u8nvXj7NLftCu6QGVmzSflX0zK9t+QZ7O/k6/OAxVb8ke76Ta3OqPWDhb7vY6O1PPzP438tXeZ/O2tW+4KT4bPZr8NvPzsl/9H+WbhLK1KSIsTHWHPW8aIHHc4qvhhRyY3WbAJa5zj3Fs+WMhJf7pHuO6GRAp7u2AcLo1w621v/w12ky8RrsZjxowbV23GitOpxgtJmrK1sYW7yRdGLeEzXi1+WV7rn8VxqbeLqwTbslfyttJHbS5Uf3n+DSc0XeKyc0D5S/NFmff5kD1gIqDcUn5Sfo4H5uZ0fi6wyfZNP2KfvF+a6v4pL45wZ/31LvS5ck8N/c2ds3dpv7ZfquBOsMeVP7V+cksaPFVzSG+0tvl4smZuJ1bCmtqsM1P4tTwbvKv8tDUHe61cyLVq8oj2jD7Tb80dcVi2eozz5geDt/tK954T/XYyXzY2Kd84WL6tHP0qfppY1K/Tp/Juak3l0tm/92SbARVTpPtacLdUsLM+worcXD4bRGywaJwWTM2739+Fiu2hr/6vXAnFsNuaofpgsOS8UJ95p3GX8o9850wnL7uXQ1Y1J7pyXRiNeNiUENLxeuGjqof9KfwlQa4tnFu5hf6T0OWcXB9i72Ez6oHXI0rzVI9MXylueKW6kHVLLuj5hWrJ5xvTYwsHoy9zWeqNdXX08adpb6dtuzM6aFyxuxdPcz7rt7Rr6v3ee56E99xrihf835Tx6y+Jrc0H5hNsld3WPwqJqYrxuBwEj/mo9Fi2rlZcT2rmcBy5/o+6cHs1bnLJ1szlomj8snmEvOL8ah6VhopDVFz1b/trNnYM12ac2Wrlqt5xGE6M95Oz8Zno4HLT7vaOm55T9yLE85K1suNPeOteKo42Tu7k/oS91VtT/yJmfRk+WQ9hz2peqj1oeJ0M4Hla6MB6tzgo21bP6iX2mML9XC9gDqgjqp/lR7feMAcJFKu6FLBuGJ0giEGE8rdZ+I0ojX4LYfp09mr4krYCqPlr3DcnjtXg4T5xQZjnFKDMS7O7zx39c5sEz7TiNUA67U0XJgfpQ1qomxcbI2uqe8ZH1fjrC8ZF5WLpt7xnvLZYqteSPNUcWh9buop4bv8THzFH58dd+an4arOPz9L8UIuGDPOn9+oNVZjrP/YO4sPF+qROCZ7Nw/YzGF1zuwdf2fr8N2eqnVW267WlL9tzTPb1OOTo/PDZgGrHaYRq4WGe3OO/XXtsXts9jg79+7yxfCbWkZs1M7hKjzcc/WAPBVf5pfZO59o39T/3Ede6Fdpt+mhZrncTG4qHjWT8a56TrXs+LBf1k94180NVhfTzs1QZt9gM1xWH0kP1b9NvTFcVo+4z36Rg5oBzVxwvdfqo7DTPWbX5JfNSlV3rF6b+mE6OnvGn/Wu0mXeQyy0Yxq6PGIc9A4rMtWU7qxppN/aTzaTs4vzM9YJ/l3+Tvc79lhcidfHrORfPacY2uXy43xvOLb5Z/XT8HVcku6p1ppabHkmvhv+Kh6F73LQxrnFYRzb3DnuLcaJ/onHVv9mNRooPi0ew2VnTQ4Sfltzv7WeqH+1n+qZ+Wc14ny19bbNjcNj+Ilfc66eGS9no94VhxP7Lf/T1WiCexs7Z4vPaO9y7OwbfFVrylfDaYs77dOei6Pho+I5tWfau7jd/oabOmN2TscUT4ufeCnt1Dnq43yru8oPO3O/zf2WX9KheVcxOc22+mIMikfi3HBx+woncWr3m3wzjLSYbYPf4Km4NvliMSsM5l/xUzEpzO/PR/8neC4AFeR8Z1/QNisJeIrhvny1X+sbbic26gu32rswkn362scWy5niy/ae0LD1ufHR1rrS0+mKZ2iPvTDP8Ysys0WfykbxZvFPO7yrMFXuVJ25nLl8uN68WwcN/+a+Otv0P6uZhm/y4WpF4WHdNnWfNGh1nRxZvbKztrYYvuqpea40ZM8n9ixWV/8uPrY2+jAtXD2w+Yf4c49xafLsMF08LNfzTPFlMxLt09xN62Sm4Gr1nLib+lS8mE7z/DpD7Tb13MzEbb8wP24prRiOqmOMo+V20u+OD/6yfKh8ntpjHEnPVH/oQ+mh5prjx+bDE/juPNVD6i+G4Tio/r9+FWfmz8U48VT9Tzxl77RRHJKNq1mWD9cvLHbHi8WW5pzreWXr8BPutD/Jr+px9bzB39qzfpv7Kl/IT9WPyzHuMb9KY7z/rne9613vete73vWud73rXe9617ve9a7/aMX/dBW/nrb28/1fThc47dfD9ksd4qk7iN/EwmwZhvtClr7OJRy3r7DQV7JV3NoaYedN3K4m7vJXXNwddrdZrX1bCwrT+dnGm7Cm/Wn9NL6czW/MpHb+bPnfufO0Pr+N/1/Mk2S/qQkVq+PufKV1Gucm3sbX5u/dhv+JXbL5jRw47CfmwlZ75kPlqK3n7exP9njexIv12/g4+Vu3qec25u3ccHiKV2Ov/P7W368t7mnO5vNv/f1q+zD1HHKd+8rPSf+6WJpz937Svw6z/buj/KL+qY4YDpsvyrc6/1vvjuvpjENNG04M2/nc5KThk/y39ZPubPvG+WC5a7g4fer/Go06S/ZbQqpA3W/LmzUBs0fuyD/tKZ9JH6aB47LFZ7ZNITfnpwPidKA4Pk6XBiP5UnwZ/629OmtrIemp+ncTL+K4GlK/yQfzyWxVzE2vurN2/mz5T/zmzt16S3Nxw2Xastnl7mx6OXGZ+E/Ys7pk/YTxnNb0nfpHfu6+4qtwWi6Kk8JMNk3/Js7bGFIOEv+W2x0+m79VKbeunpWt46PsN3Mxze4WN/U1vuMvs2faq5yoHKiaUvPD4Wz6wWnHzpxmjH+rywm+mrd3+Lg+aPi0s1OdNbOF+Un9mxbTwN1Hvi1/xd3ht3XudHG8Wi4bH6keHf6pfZonKbYZi8NPWrKzhs+m39V+y0U9M98bPsoPclI2btY0Pv8BguvJfXaGe9f73P+I5e4xHIaX7ijfige7k/jhM7vb2Li43X1mmxazZ9qpZ8Rwq+G45T/5sj08YzoqrulX+VJYSRu0VbEqbBev85G4pfiSrbvDODru7L7Lr8JofLj3pGXL1+VW+Wri3GK3Md3h7zg7/8pHY7/xdZfrFgNtEiaLy+0rruzMxdhwbpeL0723eT3h7/RscJOGbjkuDGcT8x17liPcUzqwuDa4DXellXt3OXD7io/i2OjjfDcxK12Zf3XWrhN85c9pqXRJuO0ew3bx4p6LPdkxGxU7s1GrxWz5Mw0wjmSfsFQcLoZWB3cn4SR+7ZpY7Bf3GIetvfP5BB92vtW4wd/k8Y4uDl9xSXE5fb7xoPlKO4HxK/Pcn7bsnNkzX+xLNgbH9phNEgk5nX6hYzqyhCAn9eUNcdUXaMZp2rn7jkeTH+ThuDib6V/lW/GY91XO0I+qe2fvuKPezA/ya/Vuzhleg9P2h6p9NTtU7lLMqkYb/a/7rA7+rcQ/+13pkvrAvWNMLO7Uly4/Kh60a3my88ld6eriTvjqzsyNus/q8449i2dycP2bYnP16N6xdma9Il/k1da0mwdpVjRr1vjmXtODypd6v/bUXcVB9WiaMelM+WMzYoM/+bp6Svo09sznxGn1nnWNdYcc8L7qL9WjrO9d7Tu+G8y539b19KPqAzlj/lP9sHM3T1J9qvjTmpzTfGOxN5qmeCcW4jJNUQcWO+OZalrNFsR1/criUHWBvBx/jJflzNWP0he5MLvJR9X7l1iqhhwXhcf2//ysaePemU+mkfLt8sJ4XmfKp+KTcuziZWcMg8XC4mWclSZsP/UYq0WHq3THxXLJ/H4zgpgU9qwIYCGpgJI9I66aADniXVbcLga3z57ZYv4ctrrXcHH4baFODOZD2akaQC5YwMyeLVdj+Kvin0NIYbphglxYzarhcjIg0pr+NoPJ9ZqK19UtO0v97vymZ5ZvVQuuRl39JF2aPnC1NP1hzWB9IS+lKdY16wVVo6pXVd7dvuoBx13FgzXutGJ8mM9Uz67nFUf2nOJztam4oT2LTd1j9eAWi4H5U3cdl8a/4+Ww1Z3pF9+3+rt+VH3e8EOOqrcwflfPTbzpfjMvXH+yGJROLLcnNcQ0ZVwY92nf9rXSIfHdzAwWm/M1ex7vqp5wXJV/99zWqMJXPaDuuZpT8W3nIWrIZquat67HVP84/p+f5eJJ/XthKB8NfxWvyhnaK33b3kUbxdfViNPL1TPjh3Gw2Nn79MU4MT2nhkxLNd8YdzcH2r50GK6+8Zf5Z3ZKV+WX7TPeTE+GgXXCalnxaPT5TglTIGo1QiV7lgQ3HJzQqoCYkCk2d448troyH40ds2ENyWwd/nVX6evuuiJN9hif2leDh+nOmooNGcRrhgHaI3eG44ZNykmTM3Wm9GnjVecbLsovu6N0Zn5SXV77qX6UveKo4lJ1z2bEfGY8m7jw3eWQ8cQ4J49po2pV4bNY2/ph91XPpNhdPWNsDBtjUHlhflRNb/aSXkx/jI3xVavRkflnPre5VvhuBqgYGu6bleoKfaS6VXPnemZ+WW7QXi2G+YQ2ih/WJatDVruJU9sfbb8xm7beEp7qAzZ7nS81o9xKNk435ofZb3PlzlntN3eVfzaHXC+qHlazXPUv1r+KFWvePaP9yXxjWEwLxoPxZ7zSUnGoGNq+wPha/pvFuLJn1jMYB9Pc9TjbT/3LbFI/sDms6tnpwzghLuu1TSzqnpoLqOe1p3qe5dH5bWv587MYn2n3zQ7QMSPLHCsiLBBnrxpfcVOcGK4SxPFgXJI/xMfBkOwuruwe4+7w576Km8U/7yhfuNhAUbYnS+mhuLZ4bFjhOxtUzP/EVE2o8tXWnIqV5Y3FOM/aeJs5wLgkm8af8su0xj0Vu+svl0u0QV5OI8dHYbF9xZnZYW0rf0pzrEl8dvgYh3pnGK7+E+etPevTJhaVLzxzcZzWT9tfyo+yx3lw3W36hcXlbJIu27vI39m7/DS6qR5WCzWdz2yWMH5q5qi9tn8Qx81She1mg/OFZ6wXXQytHcNkc0DZNvWc/DKu6hn5tfaXz40e7D7iuHpXtdDUqZuhuId92dSJqkEWW4o3zQkXm6t/xGxmjpvNLJa2hjb8m/nMOKi8sbnL+i7dYTqwPkebGaerQ9ULKkbG1cXP+GKNqhphvcLuKb/TP/OtfCncdk4yPZjP5s4Tdqx/ZowpvyyOeSfl8V3vete73vWud73rXe9617ve9a53vetd/1cW+yo8v9C6r37Mdr5v/Koz91VK8UcuymbDR62TmBTfzd2NbzxPPpWGTdxNPMnn3GN+G2ylmeLfxLn1l7gk+4aXs1Gxbjmiv028Gw03vpu4lBZJo4SbeDqbdjX+lW/2rmJV+O0+i8353WjveDS8nsBPOWn8Ji5tTu7EwN43frZ3nozZYTj91Wp4trwT9+0d5DN/nZ4tl4190m1jz+4w+5SzhLHh6uI+tT/lM+8m30nnlrc6395x+VGcN/q3sbb2ij/+NncSfssZ77fxbvH/L9hvtVN6sry1y/lEvMR/U29P65l8prp1Nf/Efnq/4+Mkvw53w8GdP3Un/vN29vsvkKW9Wuqf06nnGBz5J0TKDs/YP+VSfpVtil39MznGHZ+ZLcNWXJ3P5j6LNWHPO3jOlstB4q/OVB21+W20n9xbe3WGfBVPxznZPMGf5Ur53tiqe5t6m/ZKxzvzatu/jhc7R0zHJ9VPwnfxKN7ObuK1vdfkoOlJ52+Djxiuf6et0jblIfHZ8EcuTf+e9qM7n2vLH/eZrspPmoPMdquP0xRrv8HfxnG3X5w96yNX/6296/92380RN5/c34JNbpW94tLgs7lzB9+tk5hb23SW7JHbdn5uZs9pjbq+dHHf4d/6Oq2Hk/q5/KTaRM7Khr0r3209ON4Jt+lfpwWz3/JSduhzE7erEVXrja2yT+9ptTN7cnL5VfgbPspHwm/ru/qSk2w+P0u9q6Vw28V44C/aN1xYLC2fxofzlTg1WjT8lU+37/ZSbAnH7bPzpJvKi8qVzqrWi2E33HEvnSVOja+nOJ7k9zSv6t3llmG3q+F3yh2fn+KyyUHrI2ErO4bf7N3R39kl/EZLxd9hbeNl/Fo90j3FeRvLhlO7nor5DidXI4027neDxTgp7BTXNhdJd1Wz7K7TU/lKGKhHg+1yeZIvZ9v625y7pfRKuCl/DUbDp8XfcFV1pWpF3dn+Th+OcxtLs5603+jo7jk7pVXaa3zPd/bLYmEYabXxOk6qTpj9ho/bb3Pf3G/scT/F3XBmHFI+ks/GH6ufti6d/aZ+kp/qPyVxXwnTLzpNX6XZmXpmXBDHxYU2Da/mfNq58/Q1NWngzmdcTj+lJ7uPNaG4JJ1UDlztuJpsdWp1SHXJ9tliX1hTzpmPtr/cfYxB2ap7bf9u6gCx0S/mPdWE43+HT8LezpSTXr4wVQ8oLqlP29pU/hUGm0VuLjktWz6buJm/VBOpZ9LcUdol3ZFbq1HikPir59O8NXEqPg3GRiPVn60+bo9x3c5bh5lsHP6J/pefpqfRfjNP5l47P9m5enca3KmHBv+OPdOY6cb4M9sGy91pa9rNU7VQF/frMNR56lO2r3yr2djG+sQ8TLanazOn2N2NTdu7jIPy1dT06Xxg87/lspk/aONsk17zXlurbX5wqb5wfYR+mz5j92dc6pxxZXjbWkiLcVMY1/k3GuNzGsbTZv6iEKmh0moKliVxI6Dj55pAxeMKjN11Z2iDmidOLo+qAVxMiaPyq+K+9lJ9sPpUNTux8Tc1o9PSDYu5r2zUoGL2Vw1vh8IdDd3wwz3UU80JpSerN1WbeN7ozzAdH6aJ61+Vi5Qj1hfsDssj68+LV8PZ4Sc9Mb+qf5QPlWuGr2aLq9+mnhQ3dYb15upDYan42UxQsSrezlblt8FreDCM1Fto47ioHk/9yO6w2OZ7M09c37H7yHOLj3ao7Z1+UTxUbateV5jNM95VOWKrqUvFU3FSde80m/jsedolexaTipHVDOPP4lZ6Kb+pp5Wu7L7zk/pa4aiebvExjlnrineKxfU5s3d2zg+73+wpzs7vtMF+Sf62WuJd1qPTn9KW1YLrx5MZiXGnudHOPcaFYam4nX2KC/dR7y9YDHfenb8pV2pWuVno6pLprGZB0pPhOs3nM7NT/P/8+fn/ZluRbIseg2qHQbuaOxiwG3KuOVTcG05KS2XL3h33+cu4qtx8ftafn6W4qrja5bgxnsxG3U3NcOGpAYr+2HPLO+2p2CbHxl5xVPyaxQax4onnjU6I3dhhXzKNVM6THi0f9JXwUZ+TuNk99sx0d7WenlHfjZ7zTppZbh5t+6y1bebbNQ/ZvWnD6i0tN/PbmZD8qb8dzd2U66bW5n01o1xtqPmebNq4mrWdJypH1978dXXT1EZTnw0m2jS1wezcvSa/jt+mdtG+mbObecYwVT8zfDaTZw9t+Kj8q7nbzlYVR+Jw2p/t34akG7NzPlLNTR3x985q/rZtZ9XdtZ23bCYmzZu/l+rvhbJVv39+luKpelj1C+qBe5c/5Oh6Ts1AF4/Dcn9PWvsmr8hnYt3Nsau5tqfRv5tRaTluDjvdY0vVJL5fNt845NnAREIpiIbkXTvkkgqIJZM1IMOae46bKxqWzOlvckx+NkXS5A/5sDM2wJy98j/1UZqw+JmuLl9KD+fLxXHZq4HUNqvLhxt2DV5bn8zXCX8Wz1ZPlWv2e6L/KR/lR+Fcd5HrplcbX65nUB8VY+Mr6Zl6Dbk6O8WtuY+22/5P2MqG7bM5pHJ2YaBPlz+cnxi3mu9OA7bP/LC8Mztc7uyJHmjs3XmT36uvMb/Yd6yWt/iOH4ulmVdsfqZ6YX5VjSt/aDf9Tf9JI3xHbq1G7D3Zs5wqfooT9gnib+rZ+U8zSXFVcap3xkf5Rj9psdnmag19bmzUnGviVT5TP57MvDs4qdbnvsq784VnLmfN3wtcTa+7ucx6zc2DbU0kLBaPw0+zBefpiX0zN5p4UEvGR+nEYmda4PPcc/HMuZbqYN5jvhVX1AKxWNxuRqOOmz5517ve9a53vetd73rXu971rne9613vetdvL/XVbPP11H0lu1Zjf3LmsB2vxqfyp2JK8SK3jb27r3g5f5vcKD6O41YfxT/FlPg8ub/RqsV350wr5w8xE7/EFTk4+2mDzy73yX/D3eG7mDb5u8O7OXtin+VfxbvR7Cn79p7CcLls4p02Db7j1ti0+I0u6YzFu9GHccdfdcf5cDE0cW+wtjG7eBWflpfjurVpfWy4/IY909rVQ2N/J0fKJnHaxI1cHLbDauxP8J2twnT2ykeya7U44c/eW2zH/4QP2ji7xl+yuZM3doYYSaOtpps6YDGd5kzZ/v9qv6nz1s+Wx12eCqOp41Tz7Ly5h5y2ti62jb39J1Lsn4wph7jYP1tyGO6fRLF/luY4T5/sOXFXftU/f3K+FPeJv7FnPk/fGS7yaPhs8qu0ctpt9WRniX9rO7me2qd6nvbtXovt+t3dabRtegJXo0tzrmqF8XH8tnqyOO7Y4h3lu6mfVgvcb+ZPE0fSl81XpX/iv433xD7FOe02tadwmZ9Un02cm3pwPJr+VufNTEn5aTic1rrjc91v9uZ+g61ylGLZ4CfbeedEnw2fy76NleG7ebit4TSPEn6qwZP+Zfiq9pP9aZ8oPm6195xdmle/wYf5xt7e6tnMyJaP44n+7uizqX/Mh5qLyt7xUb3p8Nt4/3+3//rq4z/px2m/xW/tsZee7PcWk81d1/fT7g6fOg/TUD2rlWw+YzU+2Fljfwdf4bBYWExs3/mdext7xcnhJFuMQ2E1/NMd5dNp4WJzsZ6upB8+4y/aJz2UvdKV6eD4ONsm7o32jq86U1zTM/tt8Zmti01pyTDw2Z2374ynwk6xbuJlZ+rcabR5Z7iKP9t/0t7xam1a/R3XUz4zxg0fdb/RNOHPPcTZ+m2f1TmL1dkhdxZnGzOza3yke86GaaJ+nQZuz+no7jaxsudGV4WltEpaOPsUQ9KBrSYeZZ+4bHgnW3cnPTP7+TuxlZ6JE/pO/Nt7eObwXZwqdqeR48Rw1f2kSROHi8udJ97os8FveCv+Dht94LOLlXFptFR+nA6J/9bu5B7LM/4qTZhGLnZ1xnLP9vCM7bk7ikOjg3r+x/9IcDJ2X3zY/vwCxO6qQN2X6WbhXfUFLT3j+5+fxTDR37yr8CfexHL2+I5cXJyXP7RlcbR8lL2qH9RqLvdlMmma7iK/9EVW1TPDUrxQHxZjW0dsH/kyDVQ9q/hZfV3PmNcUL/LEmsMYGKbKw4zP9Z5bjS3jMjVMvcf2mU9Xh65n8VfFpPqD9QWLk8Xi+kBp5uJn2iX+TY/csXd5wb2pnetrhs/ylmpHYbKYtnwUJ4yT4bPfic/2VBwsBoyTxY0anfYh6oH3mY5os9lT/C/8xB8Xy6fSgu2rGki6TBvWFyp+N1uY71RzaYYpH86fstvEoPBYvtQZxsrsWc4VF5dDZou1kvBbHWfuVP+zvnO5ZmfJ1i1lr3pnPk8ueB9jaetGacI0Y3XJ+kFp0/QXw3D+sPZYLTKNWB06DNZvTDf2zmJQ5+wZOW1qUuGmGFnu0V7ts/iSPk4vVtNKJ8RT9cnO2LObA27vZDH9T+3l/zHhiiwV9deX/38gK0EwQak4ne9/BSr4OwHVkHDxNn5ZLFiIyp6dNfxdfp0mDZ+Nfcpz4qN8uLtbDsk2acq4M72aONAn48L666S32vye2DP98Cz19DxztTptXI4cfstHnTv7dGdjq7i6WNFe1QhbbU01dxhXjDfx/xv2LsYUM/pLfO5wSrOmqQfFP/WH06SZPw2flu92L8XV3FHcmt5lfhHHcUeuE89pkH6dj9aujZfNAFXTjR7NSn3X1Pe2d5W90lXxafBTDto6Tb3o7mzrX9WW6n+m3RNxuJ5J/HWE/8Z2tY82ikuqORaH45dwXRwOl/Fo8NO8cTEk3tN2M2/xXNVnwynl2sWx7S+233JPdavsm3pG367fWVztftsrrsfcfNriu5j+AfwZa74rgHYPfbC9hPURq8FnvJqiSRLeHQAAIABJREFUVrpscdIdp3G738THbFRc7ry13+Zik6OmHtq8KSyHnzg47icraYG/DbfWvrVV+O65jTfdSfqkHLH77jzZ//Y+y5G74/hjbtm9ZJ84NTXiOLf8f8OexdzUkjpXcbPFNG383423ued8bPLc8FExpTuJ58RmWitfLrZWy62t29vq1/pTmJtcbHKV9hznpp5OY7jeGx2Zv0YjV4Mtxgl/5lutxMftzzOni4ptk69Gi9ZW8XW5ctxam0b3Ng7FP9mqPG3sVc4bG9Shvdsu5VNpeoLvcqB8bPRBXg22wnfL2SftkjbIH22Yv8bGcdrG5Li1d098f88vO9fXn8uAfdGeZwiGX4/Ul22GpfDxed7HZycC8+1+GV4SE++z2J2GjT17VrycPYuB+VYxJnuXM7bX1Ir6csnyxbiz+NWXXHaOWiUO7EzVLoud+UVu6DfxYu8u7raOZh5Z/CwPmz472Wf6TFtWZwpL+d3anGIq3V2/zjtqPrjn1n76YvON1STjxfKV+P+2Pc4optG0Y/sNfvv7BavpceSe+Dju7B7jkd5ZHGr/4tL0Jas9tdfUg9IEY3NxMS0v36n+ET/1FuPpuDKd5hmL19mwPDt9nI3iozjPnKr+Tfbo1+Wb2aMte1f2rsfV3aQby42qjXnH9arz7WyYLu58clH9v+W2rU9VP0rPFhdtsJZUvbm8qFrY1P/Ed3OD2TBNnP3kgHXA+Fw1sMFHDVp7fJ4aKkxXW42WzJ5hqtqbPTLzivfwWXHa2Cs+Lk6Xd9Xv83z+qhjQD+OtOM5z1fuqrprev2P/rne9613vete73vWud73rXe9617ve9a6/uT5jzb35q+6594S9fW+/dn3IUvbK5gQr4TY4TZzJX6vTFtthMA6KS6OhO7/DZZuTjc+G++bOxu4EfxMDanZyT52j/r9RQy7nW+1c/C4WhaNqTPl2mA3f9vypfWan4nDxOb9qOQ4b7iyfW64bPlv7VpsGZxsT2qvf0xjwLOEmPMTaanTCidm29sl2a6M4bPV09zZxbW0Sj7amHUdWz+ys4XUax6l9ir/lqWJMOj7BX2l+or/LQ8rRyZ2G29xXmrp84Vmjz2/wZ2dtPbTnzL6NtcVP+XH2DZ9kj+eMg8JX2Old7SX+T+vTaIM2yp/iyc5STA2XhK14tdjVf73if8aFDbNv/unbZT8DcP90yf3zsvnM3ude+5v83HlWMSpd8CxxVLjJz6kuc6X9bT202raxbu4xvqlGr/3Gx2l/tRin+rT8TvjP97ZvN/h3+6XRM3F382c+N7X1tD6ItcnviT1yVXtNX7Z6K61P6rmp2YSBWK2mp/qnOmP2G32afLk8J/y015wp+8llcnP2Df/NrGX8Ex/Uk8XB9jbapXy280fptNHotH6mLd5L8yLNjdN6Y5x+216dsZgd9nY+bPk32m9jUvxO7rS4LC4W77Q/yV+rg4sHfU+cptacHzXTmnvsTMXtsNRSM2/uJS3ZHHS1nvgrjG2t331P8WI8jIurIVdv6VdxYT629TC5IDf2nmJzutb7n7HmniKANuqdYTMfzk9rg3a4lL3ix86VRux5Y9/G73Rx8Sauzl/Sx3FQXBS3hO3uuFgdH3bm9FH8ECvdUXvprLlzN46t34ZPqgmWsxab/W64qLpIvptzFSuLN91TtmmdxtL4aPTGX6e/0sDlStkzfo2fkzgbLi3XZL/hn+JldkpndU/l0OWgidHxS/ZNrIz/xv6Ev3ve8Hb81VI4ifcWfxuX89VqwH7bGPBO8q/OUnwn9+/6QwyH1dxJujiclr/yiXvMN+PdnrMYk33ipfaUzs7n5kxpjJycrbuf3t2dpGvjG+NufbVxqD3HRcXQ+mv4N3GgNuyO2ktxb7k29k28iVPDeZsDxYHpz363WrD97+thfm1iv/hVqAn6uoNfsrb3lb37ssZ4zz2G8yWWit0t94VNrY3tZf/nZ833Bl/5Yl+Emy+RzVdD9Mt0ZfXA6gdrS/lrtJk2ruYZ36k/4zLtVHyKq+Kg6pq9p7yd1Nzkm7jOuHCfYbN6VnfcXHLcFRY+J/9KD4xl3sd6npxYzjAmF6/TSMXg6snV83VXxed6DbGbnlF97PqJaez0Uf7RlsXFOLAaSPoojVTMLX/EcvgqJ6pWXA5ZfpAv0yxp43Kr9tqadPazDhWOek/PDNvV98yb4uv2G1vGKenq+hr3GY8UL7vPfrGmnR6qpifmZcPqN2nBeDAbjG/ap5pj9Yd2riYZFssjw5p9Oc9VnpRPts90Qe3anlczQNlsemraq7p0PpsYmviUL9aPuN/UyeTJ7BFX5U5p63SauLPeEFP1QfLN6kvdUX2qakPpNPGTVq4X8V1xwTOn5+SZ8oX9zmqR2SsurrZmHAwbNVM2LjbUyvWV88/O1B6u/32gUcauEZhYrDCcqBgMiqrw0B4DZzjOHnmoc8aZLSd+k5jmLmtaVXCq6FUDJ5+Ml8s544zcnD3iskZzvB0nVccsTsbZNT3LUVuDeFfdZzlng49xTTxUr6Zhpd6Rb/I3ebvzDX7qTdSu6RU1r5C/6kuGic8Yr6phjKWNoVmu/9X55IZ1iPowDNSI9RdisHeFjc8sfy52jFVp7WYU08FhqJ5vdUj77ryxnxokDVGzhm/bk409W8le6dv0V6oDlV93f2I0S82Obb0jJ+SPnNCO5T3Vg+ph1bfNu8rHdYYatX7mHsNx/DBm1tfIXfFSGGiP76lnUPvPz1I5cj4xfvae8tYu1ysOM80ohtNqyPyw++nMcVLnbIapHlQ1pHp3yyXZIb6rt+ucnSE245vmwoa7m2lb3BQP6xcWy5+f5fR09eV6l9VMmg2Ku7JtetHZNH3sluvx0xnzr8WSOgvbDUt11vhzd+beh6xkn7gknk0cyX/Lh507PHXexpuwExY7bzCZPauzVFepfpSejU6n+Ftbt98uxGF7bUztPvrf4DvdGdeUrzamdLa1d7E12uDeVqtpw/w5/EZLx5/5vMM/2WzskN8mh+neab8076zOt/2l+DPs5n1zV3FwmiI22uF+w6u1cfo0uT/VstHFcUzv6s7WBz4n3o1mm1hczluOKc5GX3cv8Wv2W4w2ThXDJl/TVumQ3pX/tFIcipOK6Y4922cYKQcpXqWB4q3OXHyOY7rf5orZK9x2KZ5Opw2Oe8e9jb4Ja4O3wVK/aIv4Gz0bzuxeykv7jvcTz4YHu/OErimeZu/78/n3f+Kh3tWXKGbz9dV/MWSBNF9f3RcxJmayn1/DlJ8Uh0tiigNjvs4afireqSfzz/I17Rt9FPfW16lual99yWQ1hXFderN7rMaRC8bouLC97Vfeuc8wVX229cAwmlyzGJozFquaO4pfwp931V4bQ1v/KYebGOY9xwfx5yxBv9gD81npn/g1dqp3Gnxmr/qNnTG8xNHtpaVwFK+tD9cPrlYYnzk/XD2gPfZVqznWGP4q7m72svtbTdt6bHBVj23uMR6oIZ6xfLX2rPdZTbBcn8SmaorZIQ7eY1wTP4fBam4bL8aJMbp5mHoYNXPxMo3xHH9ZT6m8qL5OtXO3nnAxHTZ4qt7mntKQxdz4VvXGapzlTGG5XxUvO2McsSYYr9nHjKPSY66m3hA75Tnlwu0x7qymN9iubhBf9SWrD6Z/0jMtN2NYLlQfMK1c7ykf23NW/0oDZofxpl7fzhPH/V3vete73vWud73rXe9617ve9a53vetdf2Gt/pM79UWM2auvUux+699xaXAZPvtaqb4qzzts74799suy+4LHfKi4nN9NfhsNGi6tFo097jVc1BfQ9ktswz/pece+jftEn239nO5v83HynuJmHDY6NDOoueNy39Z+6mFXC2iLflnvM26ufxPPLae0hxguv2oWtvne9OOmhpAHi+uER4plU9OnOAnbzdomv87+uvMkf1f7LU5TCxf3hL/pd6XPphZO6kZx2uZX+X9K+xP8Uz4n/dX0/bZ+mnju8FdnW/uW22/wP8Hf2J/+vWCr0e036vnEtrHf8HHzf4vX/j1q4kgzUeFgLyss1t/bOXoy1zf6NDq45WLYxLjBZz5O6vV/PphATfFhUTSJcH80TgafwlIL+c5fZ6/iUHssMU6vzR1sQFUMTG83oFK+HLbyx/Tc5ks1cFtD7VBpG5Hpv+WfeumOPd450SENKMdVcXRc0Ab9MWxm09q72aL03+K7vMz7Td1t51XqT7RxGrjeTrMJfTXzY1OXJ/OEYaYab3qv6V8V/5a/65/tuev3J/vXaXSdNX3k+sBxcvZNXLiXeCIfVfPOHvE2+M4+zYdGhzs5bPg3uWz13ObrRPs7+M7+dL6pfKGuzP6uNk/yP50nCXtjv+FzEu+GzxP9NVfq6wZDnSV7ts98Kjt2b9q3fNLfCcRr7N18dZyenp9KD+f3Kf1b+zTHGa+5XJ1d5+gPfbVaOq6/Mh/mheuZgaAde59LOWW2DG+LPc8UFsNs4m15K1ulm4ojPc93Fkuj00bHFLPSs+HPfDYaMR8OX/HY2rvYHCcWr8vFXXu8y+zVUrYu1jYfSs8mlu2ew3Jxp1gSfuLPbJGH4tr4YXGlPDecU/zoP3FJuqjF/LL4la+kJ9Oi4aB4uDie5M/uN1wwBrZSzEkLFefpGfp051v7hn+ybfRifNg9lyuX0429wmi4NHG4+LYxuT2nv9pTOiWeLf4d+y0fdg91QjymqfK1jU2dO5s2ny7mzXnznnLl+N3RcXM/YbpcK3x1T8Wb7FP8itPWvuXTaIL+2sXsHUaKF+8rbkkvZtNqyX6VbRsn00f5drzSYjlo7iBP3EcO6o6yc2ffX8v1+ez+05/5/OdnIY77+uXOGKcpzuWP+cAYUrIYjuOuvg6y502sjGvzJe96Z3mae4wXxsO0Yl8jGe7EnjrMX8fd5VrpdaJr07zsbnuv+UrN9GnsWZ0lDgkbz1g/Xb+svll+XX82Oqr4WJ+ys0ZTdYYYmH+XI3YfdWjzhjlHG5Uz5NnMQzZnsCdZXJNny4/VQ9vHLgZXM+rOxcfN0BQTm6fMd1uTqJXDZ1wUL+Se+nfmfmKz+mI+2LlbrF5Vfzf2yoeqP1XvCpdp5PiwPnQYKqdKfzY7XOyKo7rP7jjdXf8rnZkeTk/kgPwvvZQPxpnpyeJgZyq/DH/LJ9UHxqrOJzbiYR5ZDlxdsV5icSouzB/TBPdcXtRi+XGL5QHfZ14U38Yfy7vqMaY1q3vESvMCcZP9naXqUtmgzo5P04OXHTtn9Y3YrUao/+TmsFntMSxlw/RTdcnqDXnhHac92qHfu3XE+tjNK8ZxW8/KlunNNPj6+vlA44ZBK5TCcAOEDdyEh9hpMM1nhY/is8GneKkCdfGyQm4aZnJLNszn52dNWyxS1SRO58QB45x6K9yZA9X4rGmcLkwTx1FhtD7Y4HW4uN/0gxo4Cc9hbm1wsRxdWC6n23wpW/eHotEU64rVhbqHdqkPlD2rzU0uUt0inxSTelf1xmJSMavYkt7KHvEcZ+SQuFwzlN1DTJxtatazenP8GabCZzwUB+Yr9W/bDyyW0/yqnmKxNfbKruHQ9BSbI8qexcjqSJ27ukQbxR+5pZmkajDFxTRR+rp5sqkHfE96KH22tYv82H01HzZ80uxh/pnGLsZ5z2mJ/llcqr5mbllN4R1VC4irdFS6prvNzEgr9ajyfZpT9I25UFjzmfU886Fmh7JTK9UCztgNH5yZzB/Da+cKy4Wzdb5ZDKwnrt5s+jH5Y5zVmcsjq70G93TOTr8pNncn1Sk7VzG5Olbzi5J7wibZK4ymARofG/xNElpOG/6neqbfUz4n9i2Ow2b7cyX7xDXhu9XEqPDd3Q3/1r7lfYfPSa0l2zt17GJlNmpvUw8n9vNeEytiJJ3Uc7vwjtJn40PF0fB1d9gZnrecXL4crtKH6aT4NH4ajBRv2k85ShiYl01+lP6KS7uXzpjP9v7JfoPn9HdcN7y3cWEukh9VE028ab/xn+wbbPe88cn2k0Z3+DB9G03SfuMr2bT8XZ23eL/Bv7m3iXcbkzrf3Nnw/w37lhfWAdqpOm/5fMja3Ev8G5xk2+afnTdxNbYNZ4e9uXvqa2OXag6f1a/zleoWz5nt+r/ixJypM/aVzt3HL7jzfH59mvboL3FC/Lnn7NwXOBeje2/0YfEpjiw2Fr/zMW1SPOyLe8NBxXbavJgjlU/ll+G2X23RN+a05YH879qzXGw1VnfxK7Dy1ejjcsXyy+pLfYFmfFjvX78qX66+t/Uz9xke8p/2yBX3kS/TFLmoelB9rmJt8LEmVB00nBCT2bj5wO67GFnMjKO7r3piw9/lluGrWFlcbKX+dXdwz/Uj6z3lw9Vt4uzwWVyNH7cYZtN3KpeoR8qB6z8VQ6ofl0M3N6535r/VxPlxd5lWm/5ocu18Oz5KoxM+SU/0r3yofm90dvExm3mu6l/5SDr9l6vNl5pTcy4yjZgvPNu8sxwle5cvZ+/8sL8Jc25MvebdE/6MS3Of1baqRZZXh4nL/T1CnwmL2TQ6MN8Ndrrn9Ev+NnyQk5uPp3ymDftbhf4Z5rY+3/Wud73rXe9617ve9a53vetd73rXu971t5b7KtvYf2Cd+FNYbCW/jk+DqTjNc/xl8TEbxcndV/hNvNs7jhvaq/hS7Imr8qd8NDo4XZgGDmdjr3iqOJJezHeLrTgp/OSzwW7sXazOpr3nuLV2W8zWT4ON8Z7wVBxVflsdG+03ey73bVxbfKUtw0q2zuaONqf47n46Y7lNfJs7yd7Fe4LPfDEfDT676/a3+pzgs/OGD/pv9XTvyvc2rqf03OAqm4S7idf5dPibOJt6avieaLXFbzVNflr7Rpsn6udOvpo7Gz537J/0sdWiwUv7TV0kvspexeLem/xu+Cfs6cP5dTk+0Uz5bLFaPk/o7/ROHLd6urgwHvs/qoVn6p8F4T/B2xKaPtV9/KdG6p+zNf+s8jpj9szXjJHxZjZMQ/xnT4ipzpU9u8d0YBq4O+5ew3N779QP+52xpLpzuT+tH/bsOLB4WfzKB7Nv4nU6pBix3lMvJXvUtdFqe7/RJdmxe0xLlZutjzYXLOa2v9CeYbdaN1wcJxZjo08Tb6pNx4dhbO1dPST+zrapN8dZ+Um5VLipXlK/NDXAYlUaODtVP5g3FXfiqPRheLg2PacwGKfLPmGnecBidPllXJT/Ez1ZDHOfK5L5tPOhmVmubxgHxqfZb2fc5qyJz8Wj8qtibvVn+HPPxcTOmv7c1rPbb+Zn6g21NndSbT5pP+81NbHBb2v/upNqpKkp9Iv7DP/J/CIG8t3OWuTqfDZ8mng381PNpVZ/pQXDbvRpc7fJ+f9sr0P8VReV/WcsdWezPmEpW7ensDdxq2fGSeE1GqGuyl+j0WY/aZveFTflU8Wt/Cd9FEf263wov0mD1rfj7+JUMTR3lB17VrEpH0ybxh75qPuJe7qrbJiPyZX94rM6c/xdPOysWS0v9tziMLvEp9l32uGeikNpquJiGijMhKXsFUZ7j70z3RR+8um4MH/ML/O5tU+cmvw1+IyTyulGx+1Z0p3xbTXdck3aMb+b/KK9s2vjcLlJ2iZdVLzOB9vfaJy4MV5Kz5SbFM/cUxgJl3FSvlt79472T2ngMJ02aTku7k4bp/PhbBouyZ7xY/o43265OJhOzm6LscVimI2uLf+k1wZn8tjGMG3a5Xi2PNzdZrW2zpfSocVn965F/0eC1QX1Rbk9T2SbL24MU505PuxLpsJTwqsvluz9ssdfFZPjislPeJeNwk5Y7KtyUxduf+qgOCt/SR+2UsOkr8XOvs0n8+1qjeWgtVf8WX3++VkMi/Wk039rn/Rol9PlBHszYJlPdj9pM+uJcW/mItqp+ZZqS+GweZH4NGcpXpUPZTc5MZ7z7nx2PTZnFvJh+OycYSU9WB7wvsJHH0xrpsfETBrjYryUnoqXywOLs8HHeOa+4nJabzN2xVVhz/fUXypmlaO2Hmf9MN+KB/pO9Zb63OVZcXEau33kwzRBLqzOU/yb1dxHPZEje78Wi8/luYkN5wnW9bRh9ag0x/sO39XAaX7cLHN2rnbdXXaP5cbZudjxXdVHGwObX4mbq402h2m1+XZzSOWezQzEYvjKBn2jPqzON/Wl4kKcxF3lxtWL2sN7iSuupH+6z/hMXMfH1TKzV/3G7v358+fPvz7QqISnwmY2brjMoBym86+GkLrDBFE2U/ApLCtkVtiqKJQdauK4I69G/1YjxjnlghVgg9suLN6kD3LZNCZrFObDNeK0TwNL2Su7FHfSP9UEGzIYQ9J/ckj2TZ+rWNt7rQ3rzVQ7bOCy2eFwtn3KnnE+sPssD8zGPStOjg/Wg+o154/NYhYv+mW8mT2bYS6HKq/IEfkyf6hFmhNKT4aXbBo+bqao2K9f1QuuRxivlBvFAfGS1kkfvMPqgPl2Wif97yzkjby2+Wf9x7RgeZp4qmcbe9xnXCduW38MGzVBHuws1c92sXnA9vAZObl76XzycDG5Gld2qhbmnpsDDD/pzeJVWC2ms00z57JpZsW0bfC39aP2Uwyq3tlsUbqrXnf3Xaxzv61v54vZs9pUZ4iptGEaqbhT3Sod2Jxg9ebs2EJ7Vwvb+Ym/+HzS16iP2lN8Ui7VGWrEcvO9Ic8CSIV1sjYDRTW34pMEQRzVnMy/8qG4zfsOj93HOyoe1kjOP/JXmrOmUHgqd67J52L4KibVwKkuVL5UPSMnV0+MB9MQeaNtyu+fn6VwFA88Y/oix4Sp9Mc91b/qnuN1x0bVelMHzP46S/eZb8Xf1RvDbPKl+srdbbgq7g0extXcTzPrwklaIf+7sTNfCSPZqPnC7qp4N3wwH+w+ajbz4ebNxGAzg/nEO66OsU9SL7aLzSpml/ruqdXWHZsLae6m/nP5ZfE2PlN9sx5l3NQMcbyZLePl+sItV3/b+mQ+Vb4YpqtFlo+t7mmleDF/LpZ2sfzenQfMx/Xs4kv+Nzq6/VTHjf9Ulzhn1R3V/84P1qmqe8fLxe16gNUdmwNzn+mg8FMMjv/1vP2bdvL3qsFn9q4W1N8j5MnmwDxT+mOcKQZWH44Pw27tMS62T/8rTugkLSWKSuwGW/lizY0CMT6JR/PHgtmrwmSDB+1SQllTqsJGn6qJnX/VWKromaaqkZS2DeZGn2s/cXZDwdUz08xhsfuqbhC30Yjp0/BPuqAeqDFiqHiVvbo/+2Tiuft43ujtsFRuHH/GIWmGq8kXmzH4fNk736wf3bmqAccfsVy+nK2qZ9Rj8mh1Z/tNjI2Waf5gLMqO6bnBR56px3EP+/Tq0RSPmgPICzkhZvvO8Fs+LE4VH3u/9pp4Ge9UDy7/zXzDOtjc38wwdQf3t3q6nmQrcWR6qmc1g/B+qp8Uw/TT2Lp4VLzqnoqZ+W7yr+6oOk73WnxVPym+1O/J50YrNT8nTlOfDp+9T61VfbJ6YPNA6Zr0cVoxHoq/i5/5ZnGzZ1efzL7Nfcrvln/qZ7awNxwfhav6K/Fw+GyWsjpPPdOsja3jM7EmtzRfmnpxM+dd73rXu971rne9613vete73vWud73rXf/Vur6Gzee5N+3mL953X84Ql9krO8X5BLvZY/EqjU59NHG5M2e39fkEnw1Oqyd7b7VvtPpNexXLRs/mzolds9euzR3HLfFvfJ3G6/w0/k9iSDiN/cZXskvYTnN2R+E6+7QU/8Yu3d3c2ZzNmBvbxEfp+oSe7R7j3Nhv8E/2MTalvcNLeVH2W5zEZ/4m301MKe+YQ6YlW3d9N/HcsXVxPcHfnbt39axi2HBuzlQ+21y1vNm743Tip7X5bfsn4mpz2eRqq3/L4xT/idrdxtpgn8bqcnBSyy6/yQfaJO228Td2d/KV8P9G7aheuhtDk8t5l/736aYR/rMyJwT+sx52V/3zJLaHZw1O8oGxNvEkbbb6OLzN/RQDi9ndOeHT2ir89M64M/t5T8XI9N/m64l62Wjvcogxu7WtBfQxl9L+9HzD32Gkeki+0CbdUXNOxdX0neKv7JPWDUaL42yxZpUWbGY0Om56Sa22/zAuZad0QHuHwbA2tb3pAbdU7av7TX+3+iT+iNnEoGowzVW3XJ1OnLv5VRo539hLjT7M3506Y9wnbqOdWk29JYw79bWZUSe5UT4vDNxz8bS+mlyrWE+4X/tJ4zv2idOJ/l9f3f+7Ya5tTzdz1+nT1ttv6ol+1W/jczMb8M51L2Ew+zbP7Sxo+TT14Hy1vwzL2UxbpcuMYZtfhr2tiaftrztN/WCeTupH+fzf+QWK4G5/ns1z9T4X86H8sruIz7g5n5tYHSf27vBYDI0/xVvF5vyrvbQcH6ZBwx/vs/fm3h39T+y3+yoOZsPiau6kONwd5rfltbVldxp+Ktatj/nLbBUO2jS6pRgUF8cp8UyaqfPEJflOsSatHF/3zp7xV2E0cSj8FMvpHvPR+j7JQXMn4U/cjX3DyelzwrWJwemTzhQ24z8xmhhU7ApLYTe4rX3KmdJP4beaqlylfCkNN3zcXtJWaef4qXjYObNXXJK92kNMp/8Gt+GtfCgbl4+N/sme4Tt/yl75cvEqnkpPt8fO1LPDwrgd/42uePduHCl/zb7jf2p/onOyaTig9o3GajU+0Fej32nsrb3iwPRxfjac1PM3bly/8+sO+7p2PaevuuorY1oTc/pwvtxe48dpwLCZj4SX+Dd8UJtrT/Flz2pP6a74qC+/zl7VEntXzeDiZo3F4mG4T9urXKlzFhcOBVafTvd2ua/A6euvw3pqBly/c7ao/GMsrd+mrtwdtGMxqH2nj5odiltTh9OnqqnEx80vlqNk38aDd1TPz1pxd13tN/fUSnlg+ly/zb6Ke95R3JWNql+Hf6IJ5obdZT2u+gzrWM0xZdPWw6bfWb5ZXMofy9O8q7RTfYD7LhZnz2JQGk9OLteMg7JVuLhUvyjuLN6pHfJHXZVWjLfrPcWL+Wz7DZ+fWExB1FsAAAAgAElEQVSPhhfTtPGF9YzP6Ff1WfKdcneyNvdZL+Nitef8uPpV9okDO2N8WA+qHLpZ5ubVfMd8Y7ysDlBPN9sUPmrT2G96IC1WE4qDw8C77GwuN68mL3xmfeu4Kj9q5ij+uNfkk9UGi1NpiPeZf1zfE4QZu2ZBoVKjt4WohpO6m/ymYaeKiNnjPuPn8LBZGH93H8/nntKXxYx7jHvLRzVJ4j95X8/s/brfDIrZCKwxUKfUSE7Xxp7ln/FkubnOmn5MS/nZDg3Hm8XgntMsSP2OeZyao3aqF6931fusT1FzlgOV03ne5A5zo2r3dCmN2/wyXhgbq1dnz+40NZ/mjophY7dZTa9gD6pzxQlnj+Oc9tQ8Yz5VzK7uET/1v8LE+1hL6i7jjzOA8calepnFw+qQ1TObXcq30ljhuH3GE/VpanTazme842qIxb6pE7dU7lm8jBe7y+yZ3onTXd6qV5HD6axp+af5oOzVPRbjtXA/9S6rK2Xb8m/vqft/ftbGF+vZ+aw0vmyYTkp/NhMY/sRVNcZqUPFRds1cUjzV3rzD/LGeYHXK8NkMSPFuZ53jNrVRnNNyGius6bPJr/KLe2q+Mb7ubvKFtcxs1GxVs5bZIy/J0RFk5+7s87OYPTtT99Fe7SOG49XE2MS10YXZntxTOiCO06R93/CZ9k6jJ/RPcSp8Vy9bexbnBr+NzeEmfLef6kYtdk9hnebwY5bCQV/Klp03fJxPtZImLLYN/m+sTX1u43d1e+JP6etqx+Wk5ZnuTx4MEzltcJWd4pxqd5OTpGHSvo1xw2X6Vj4S9419E4uLm+me8oJ4TR7wPOWsibXh0eTO4Tt/aW3snOZuv9HUcd/q0OTNxanubfJ0wlP53uBt87HZm/h3cuI4nujt7rcatjlMWIiZYknxJJ8NHxVv0jfxYFxYzG18T8Tbck32Ll9uNRo13Le82jpAHyxXjGOT29M95zPF4vT+ZgDui9m1j18dcY+JrPbnwq+W7D6es2fn43SfYav4FN7Fcf6yu+p++sKq8BCriVUVGStEli9XeKx+2HvDOS2MxdVYsld1qeyZnswn2k+NlGapftDv5I++lT+Hr+xZ7Vy+mW6ppplOSjO0w551eUizw/lhz4y/s1U6qhg2++6Zxajy1Po//VVaKz1RV2bf5JvF784VHt5Jta3iYvtqPrg7LudJ03lH1YWLr8VX71gXyIXNH4fJtEPbZgYgn0YDpaHzrxbj6DRCG3bf6Z7mTMqhipXxdXfQTvlU9qpe1BzC+zPfaj6kmdHOH7Zc3pEjs2lqI3FhcbecmzsuHsdJnbtaTtwb/KZ/sbY2OW7rifWi6k+15+47fHY/5YzFqOJV+K6ep636ZX281ZvNjpQfF6+qVZcvNa/wnqsHtZK2aINabvLb8Ev10dq0d9P8YfHivtJtO//f9a53vetd73rXu971rne9613vete73vUfrPi1yH2N+k37zRl+lWJfNNsvuhOH2bZfuNWXuPTVVMXkfKj4FU7SFvfYl1nEY/5ZzElPdabOk3Yp9s0XS5X75qu4un9SQ4zbxt7lA+M9qf+GG547n8w3w221bO41Gm0wFO52Frjl6tPZbrhs97dzz52n+YB3ld0JlxPep/XZ+Llbn04fZpNsW96OD/b+Zk63dbSZoU/Mt7Z3v7783yjM9UldpDtP98xT9Y8xI89Up2mOuHiZNuoO46/sXF2czFbHp8kT47CtH4V/YpdsGo2ausKe25ypOa9835nnCUtxYTlsuG35IBbbv1M/d/RsbV3O73DZrm39qz51NdFqs7FRXP5WPZzYq1wmPKf/dZ5qTuH9Y78hg07/pn2TYNVgaHeyHOb17pqgHepzX3Fh8aL/xt+2YZQeKlam1bRVPtOZil/xZxqj/WbwnNQzw3H2bb7UmeLY5CydOw3SwEr2rjeS762PZL/ho96vPYat+CXuLBbls7nP7Bt9kIOzP61P5KJqkdkqPGe76TG2XH202Hf0VPEm+3R3U+NpNfxVbbc8Wz5be8W/8cF4sndmq2bIpl+39orHSX26s3aeKB3bOsbzO3NE+WlnWoOT4k06Kp+JH/OzrSGF3dxzOVHvd/p3M2fU3Grw23ib2bfFd7lUe5Nb4ufq3uE360RPxeep/eu5rZt57nij7cns2Ng1PbSdK02dMR4JF/E3+9PPdt4qHi5GNTPdau2+PmQpu8077qvfdjF/zWrvOLsT/ni3sVf4jg/TB/2lO0oPp9NGn23sGEPjSy3HbXuv0Z3x3dxLuiiMBifxVLq0fBrfc9/53sSXOCW7VAOMo+LTcEs6Oxtlf3KH8W5jauJttFB82bmzd/FudWnjZPzS710/+Jx0YzxdzAlD8Tg5S5r4zN7Xc567PDHejEeya+4lrIZz48O9M9zT+w2Ww00xKQ3cfYalYmL2Cus37RvtVAytHtM+4TR+nuTN3p02yR9iMA0Qy9mke84v8/Gb+A2eWgyrwU6xtDbqnuPQnjk953PS52Ql3A2HxIfpoGycLWo3fbKzBsftJ7s7+igd2vMn7b6TwXU2v/Cor7zJ+WXvvhYzn8wGl/uyq+6qL2rMxvHFeJ7cR7/uy53SAu8jttNF6ch0ugrd8Ve4qkFYfG6x2mrrp8Wf74rX1J7ZnTTv1FRxTvauhhWHGUPCT3GqemJ3XXxNHSt/LAaWL7Rva0TVMvYfrqZGm1pWGl9nTQ1jbhWHlN/kS+mT+njOM4xLPaMeyiZpo/aRD7NP8Tf9oupe1UfTJyk2PEv9ovKk+DDd3IxKsaj8uHuKo4pX+WV1z3zPumZ2ak65/CD25s5mJTw1N9BO9TViKT3n+ednsTxed/BZ5YS9M9w0QxR35M10UPiJc9Ks4dPcYzGwc9Ru7iMHFYPDUf6xf2Zs+Mz6EGNX9YZcXRzIVWmP+jAt1DNq5fLDuM67jGPyy2JQd1kc6F/Fi+/ujqt5/HW5nVpu+nG72py589QTs+4Vf3aW/Ko8J66XDetVZsvqyHFJM4b5aNYmzu36vgBVUlTyXLPhPTZ4XCJYM6VidQ15JwlMCzYw2MBlscyYkn1qEtx3RY3x4C9iqMZ1Oim/Sn/GNzVnuzZNjHeQY2t77SvNkn6zr6Z/x4vVfYoj9YIaiA2fNBca/7jnekLVKrNXHPBM9Vdbk4rjPGd8HUfEc7FMm6Qrw2zjc/bMv5vDqv/Z7+yTZs4qm9Sb6Cc9Ix8125J2SU9X74wDyzN7TjNC9ZLK9XxOPTHf1YxRfhVfdb/p4wZP1YPy3c491EH1qYrL6aT2FO9Un6mmMUdND6S+dLifnzU1VDjYU2xf+cR9lRuMGfmw3zl3FM/EMfFR2jA8N2dYraI/drfpr9Ye9UEN1FybtqzPMGeKl+t/VhvqjptLKkbGJd1VsUzfKqZU43hP6YI2zp/TT+nB6ny7mpre9MvJUnorG1bfrP5dTcx7KXZXq5s4XD2wO0/r7LjhUrXMztJK8f7DUK1EEgcM7jGcZr/xzXwx/KZonA2Lrb2Hd1Xczp7htzyUf6aPOnfLaYz76VlhtffUneZe6zP5ae22mL9h3/5u+W/snG9XD6pOkxZNjbNzxqfl0dg7vu1Zsjm1dxyc3TaeDc905mzTSvXS5LHRSN0/0XOj8byz1a3JQYvR+E/xneSZ+WjzurV3tu4O3m3ifUILtsf4sBjSWesP99iz08bxn3tJ/7RcXpqcbfLq6qD1veGRtHRc0zmrjzv+m3yj7xPsptaSnbJHXg3PJp8bvui/wWS5VJoxHynWdEfphjE0+Ce26BfP0tr4dhyQi8Ni74l7o63imXgw/yyOxDfxaPYbHZAH08Xpk+K91ndTUJcN+yr5+fgvoHgPsTZfOpWYDYb7wq3e3dfGlHD8qnvXXsXZ8GdfKtMdZsO+niIvdubivmzYV/B07+KbdMPYnB9VY+5c7W++vLd8UjzJ3vVJE1uL32Cr+nHx4RnzwXRO9cV4oH/Gp/2Kj72IsyRp4XR3OVW81XIcmK+k+R0+m3mg/LH6TL+KL8NNZyxvbjZu9WR4zXzDWYB8TufTrHN1hnuXHePjeKk+2eZ3s1Jttzabu0yjhMFqouGclut7dz79s3wobq5/nD+27zRk+qT++POzHF/URcWEHFkvp/nGdGA92Ppzftna9JbLN8sV6sDqQM0KVWNqJihM1VfzDLkyH67+T+aTu8P0dPnEueN8sfpnPlluJr7SLnFk95ozVz+IgfcVV1Z3rLbUYrXV3E/9ihiJm5s3rh6U7qgL01lhq37C2FyMKra0WltVYwpH2TVY73rXu971rne9613vete73vWud73rXe/6Dxb9opwubb5yOvzkj527r0sKz+E0/JsvvCku92Vy3nG8nI82dxvb1gf7+uu+pJ7EsIkP713Pm1pr89XG0dqjlq2OKq5U967m7uRi04t3bZxmCk/ZNndazk2+GO+mFhP/TZy4p2oizUC0cz6aOyfzMNk3XO7gT1s8P+mJy5/T3uWL9XvyfcKfcXd+GV6jQ4uNeG2/NFwQr+GlYnW9PjGe5LPN12auMk7sHZ+d3zv4J/OtwU9cNvaNnzv1u8Fv7JGL0/J03ipu7ExhqDg39g3O3Tu4n2rTzQw3L57sXxUXct1g3anZ5C/x3+xv7U64sH5/cv6w8239N9pctrh3d96hLg6/ieG0X1Ttt3lL55awCnrj8HRAK4wTv01Ru2fEcU2E2C5+ds5wnZ4pX1v9n85Xw1XpMN8TL2WPHNUe8mtjc5phDht75pNxZTEzrpt+cfErDOSyqcPT+kQ9XVy41/ZjM79SvbheVXMj4TktESPxRls305ymKaaEpfqLzT7mD+Nierl6SHFv+DD8Jg+pZnC1taO4nfJh9qkOVH7TcjWidHH8Xb20XFh+XD8m/5v6Yj5cvbQ64T1m086fxMfxTDXXxNvguxjZHWbv+DzZX65enrJvtFf88dmdNXbb+bDBOLFHrtt6mDiuDtu9a99xbPkqngwr2TsOLJbf6q/f7sfLVtko7IbTqf5tzz9RDxsuzqeq9c28avCnHePXcG35sJhYrA2PfxjiYgDznd1hGMpe7aF9E1TjWwmhfDVJQj3UXdRT6atiUXEpLBcLe1Z8Wt6Y08avik3hbPKDeMpPE6+Kjdk5/lt7xjnFzWwcTvLZ+FKcFIbDVnE63Tf7KdYGjz2faMfsFH9m3/hDPIev7ikfGx7MZ3pXfNVz4sS4tXZbPi62rf3k2fBWcTScTvm3nL5gbWy39mxfxYf2Ct/p4vbUmcNlsalnh5/4IIekJ7N3cTvN8NnlzMWQ8FU+HZbTXvE6iVXpl/Ab/Vv+DCPZM/9KY3amFsbg9FD4Kf5Gc+cvLZUbFa/aU1zVXopfaaz2kh4ursR7E6+KJ8Wx4Z/0aPAaW6fLfFd6Jh+n+jX31d0mXoet8FT8CWeTv6RXkwt2xjhvNb3WN/uqrIznar/2ou3Ed19gm4T++VnIX91RXxyZX+VvYjGtkA+LhWmF/pMv9IE8mvgYBvpkXy0VPmrGfKmvoExvhY/v8756xtiSXuoLLOKhvgqXxcPs2TnTVsWn4nc1z/ZTHEoXVjPpl3Fkzy4HbA6w/ZSjNq6pGe65Psd7Clv5aWJgPOYvs2G4Kibkp2rV9XVTY8w23XO1lmLGGJvZw+aV84fYG37IKT23MWF/uHqcfaVidnXfxLKxx4VzxdW8iiHVj/KlsJlvxwe1aHgwO9Wrip+zQXul7/Z94jNM7IUn8J2dqh/mJ+WY9RjLj+Pj8PDX9ZDDdz5xKR9pfv2/dr5sOY4kSRIUwf//MveFMWOj1Ms8ElUt224vmeFuh6pdRAXQ3cy1i+3isXlBG6yXmhPUb7m4netisp2G+Whmz+1btjvUM+OtODPeae+rHa5yhhiafmpn4sGjsDhp52n6Z/td1Rqxf2p+ERPqu7o3ucd7t7NwHyLGhkvyj3OW+CoMDgtyOOGi/H6jQhow5pQB2IJqySl8rhBp4bXx8VlhaYaOYVeNpYYGh1h9Rzvm64nF+KncKMxOHmxuiJ6FtM1jE1fhb20wXww7W8por/Snjhv67cJOvLDurOfcwmO27pP1meLUxGV5ZNzSQk7zpPp8s+OYvsOP+i5PieO8P+GEM5p4ujOHrbVVeUR71nOJ3/SX+Dm8ar4bfdcXbU8oDuwcz1gMNYsJzwn+rX81+6l+ijerA/phe0LhbPAoG9YHTZ/Mc9WDTX6eOxfP5SKdK8wYH/2o7yp/jqeybQRz3Oiqvld1ZXln39n8NlgbPF9f/QuvKU3dna6yUfPi7FnPOhypb5i+yq3Cz3KBcVXNcT6YvdOZM+J4McysFzZzoM7dvDZ4Gn121+6nhhPiaPYuckl82WfKD+tr1Fd6aWewXaR2F/pzM8J6KvlXe1HxbXYa5pjVS31XuUE9KnPQXSOx79PWifKv9NKZwt/4SZymz4a/iqGE2eOd09vgSTk5zY+za2ySuPyxfKr47rzhqny1HFob1w8ufltT9pzy6XA00vLecEo5beuZemTrf2O77UfWE862ySfW28VVkuK09W84NDFcL2/uTvG479taq5gupwx7qnHjq6njBlOr+8Y/487qrmxTPNZPqX8SniZm4r/B3/p2XBnfRq/BovLV4HHnLlfz2XFwnBJnFQN12xokPg6L48zwsBhOWtyJw2k89OHy43KkuKj4LadGt+GQ8G5jNNgmnsZfwvoWzxv90/jO98Y/+9zkP8VPzw0+JlMvnTv/DR52p/wrXRW3iZV0EdPJ2SPf8yK9GXvO5psm9Z09o1+8U2+PWELTmz20UW+zmB57y6f4K6z4hnDaYc7QR8op03e5YDlRcpIfxkXVGPOqajNjOYwb/I8o/NPe5UrpN29zkx7yeu42/ebuVV8lrixXKM1cKH3kOfts6re+5x321OxNxKBibOKpZzb/yafDzPAz/ckN8bCZxbwxHI636nuVs8ZXq5+E7Rr1rOxP+03NoMKEMefdJqeujg4f5oL1z/SnPhWmBv+pf4axyQe7x3Ony+rnZsP5UP3DfLSCM+4+E1bHmelifMaR2bn4CYOTzd5Qso3b7ALUcfES9+R/2qu7hBlxpfuEUXGdugz/pg9aPYWN6bn9qHye9M+sF/p0uFwPoD/mJ/lnnJsZS7rsfDu7yXeTy5P4W/9s9/3+I8p/s2cdnhnH6Tf973q96T18fruv3A5t+orFwpzhnePEYis8291w5cqVK1euXLly5cqVK1euXLly5Qdk9ZtN96a6fZPH3iqn541/jPMW/wmmede8LVU5YroststBy6XRa/g2cZjfidndo06r6/wruxMe6P9kvpxvZvd2HtPdNvYJvtP5Ytw2tdrgPtkRb++ee4fz6+vvWs1cNPuhmSOFWfW72mNqNyo8Cf92FyZ9xVXhVnicvoq/qQGTkzlSsbdY2plGP5v6NpyYbPu5xdPUeOuf8VN1UuL0N/sE7TaYPqF/2vN4n3woTJ/yn/g2e2iL6WRmcHexe2c/xfW/m+2T8xa/8pN25Cf2zyf0078XySblXflSeT3pB8Rzsg/duTvb1LmJuc1ti4Odp7nE+8fPJj8sruKt8Gz3IfpSnwmL49biUXvY7ectX8ZBYf8+XTyqMREUaxr8ngb/1L+zbf3Ps1R8pd80XBp4hmF+V8PJcKo4p8L4YRysyXYo8UzpzvjboVe1bYYLbRATs2H1Uv2Dd4ir7WfEmwRjNz3p/DiMrn8eG9VbbgcoDG4GnL/2WeFIGNl5WzucmWTvZlXViNm7GZz3qM9yx3Lh+LMdoDgmfdW/LGaLx8Vg+XF7iuFTes6OzQzqKg5NPziuzE/q781+UzlinNicpz3CxNmwWjbzOJ8Vt01dFda0r9hMTly//4jqD6e/7R81n44nft/wVWdpttu+YT4wXsMZc9/0i+sRpdvMRuoFZ+N6B3Gd4G8EcbJeSXOz6aFt/jGe6hVno/A3uUWddrcidzbbqL/th2mn9gXTZ/ljXBlWjJviq1gqn6pOzP/Ua/elq9HUV7Vh/e/mze0EVnfFl8VVd4qLywWzVzFb/4w/u3vsv13xMTGuSdjAscQp2ya2SxBrxIlJ+cekNIVJPFlOUlO7QVbihqDVP4nL7Jsmn2dzGU09VYM0uIwP6x/WT8x2YlScGZ6UYzes0z7lhPF3s6owYp9iXtR8O2EYFKbEl3HAe8aB1ZjxZvhTTbfPKUcnmFQ81v/Mns0X1ljlHv2x/lE8FB52r3gxvSbnSt/lXcV3eJ7nxu+JsHq5Oql5SvbPHeMx86juEQu7U2esDxiHtB+m71QP1pusz9nsMC6Yw4av6iM3lwm32wOIz9WN9YvLaaPPaov2SV/1N4rrOzU/DHPyg7l0tu2OYNxU7+OdmiXFlZ0zYXlguBlWNcOnffIGf6r1rz+Ctsw/45Jskm6bZ2bj9gDDgvepX1gMddecKzwKA/aDmwfms6k9w+pm2uFp+1PNNoul/M4eUDsgzZ3jx3aSslGS+lHVt90nCk/TlzOmOt/6Z/7Y/fP9ex5iMpomUYVivjCOemaxXMO7pYQx2HCq+DMG0/v9R1hiVV5VU7NB24jiznRaf6r2KYeIh9UU7TCPaTBZ3Vmc5F/lneXK4VKc2TCqHKQasF5LPez603FpJOljT6ZZVvbJr9odjw6bVfTv+pF9VzluuDH9lJs0Z0mP9W6SjS7Dg7PFZtlxYnPkZtlhcfrOB3JhNo5zgwnz4/Kg9FUPIk72yWIwriofqbfUnKo6svPpS501OWG1UpwVB5YLVaOmb12vpP5HTsk/q7frA8WbnavvTl/hTXM9/eCcKDvVd6jHcupqpPxgPJxHxM78p3gsvsPe6LNzxU/NKqsB9rPzjfpq3h3fBr+Kh5zcfEwd1ff4rPo66SK31EeIO+FXfhUut0PUHM68Kl5tblhsFYPhZ76YLuZn2qs9pnyy84Sl7RvUczOK+qy3kLerGZvpNIPMTxKsiYqNnFnfo2815w6/ioF4lS83J99OSQVlg+yAzCKrYrABYIIFV02BDeIWTos9FUj5bRtG+W7ioE+3dBqMG2FLzOWOLTSFh+UI47lBSv5Rj+XRDb/yofAkYQuN5ZPps+e0FCfubR+oWGzmGJfkD89nrdP8YP+grpsjdabstr2C55u8p52EvfFmrmc85l+doY2bKVZHxc1h/MS5E+zpRk/9m8LO2n8n8NzNGsOlPnF2cccynXk/ddi+crOahPFUeFwvbXazw8jyn2xazo6L8qPqovTZndobzjfqtvpKj2Fj+UgzuKlp6qs0V4mHwuPibrix/d/sX+Uj4VZ4Ut+2/pS+mjnEwOY/xUz4XD+xOdnmX+kxXZaHtOPULmD4kcemvm6+nB3eKR9NP6j5cDhU3vAe/WFepx7LrcPRYHtiKh3EgPFU7tgOYjlneJqexnw1PtE3m6/NbDNODM8bfZeHdK/qRIfWDRo2JjYpC/h7SNJl8Zzu74WkmO0549LyT1iYP6XvMDT27TOKqhfmheVpy0nFdvYsz5t6TT8nOcB7V3vnq8HZnp/2COOxjc/ygvVKeFN93PdWFH+n3/hq/SkfDJuK0+Qj6Tc2k0+rjzlo8Wzwv/Xn+LRcG0yqpg2+Vk74O9zMr7JBHE1dWr6t3Vu+SpK/jf42Ly7PLE76VN838VHP5bPJf4qRfL7thVYSr4Td5UrVRNmkemG8pNueM0wpP4xDw5/pMS6Kp9NL9Tx93uS/5eByrnht8ap6MmwptuLr9BQO1E+5a/C7HJ5waHPj4jB/iXeLzfFUnBsfLH7Dj8VFTA0exfmnnx1Od97YfqtLZaDeUG5snO5z3vh1vpu3a86vs5lvM0/9oL/ph+Gfcd2b2bZJnF7KXfP2WmHF+qZ6I862L1An+VdcFD8Xo+2HplYMF+PU2it9VdMp6i126iXWu+gz8XDcXN7f7Ae0T/jV3L7Bk+ZM9Syr1aPT9I/aPzNms6fYbDA/KTcKP9qmfme5YToqF00+N5gYd5ef1LcML/qfwrioHmb8GFcVB/Gp3lZ8FTeHdcNX1U/pb/qE5UzlEP0iH7ULtvosDuoxHfXJ+tPN4nPPMLEcNXOE+okr2qm+UbtCYWh0mlyxfdPGVLau/5k/zD+bF7a/GMbUn0yfzazC6/yy2VN3Cq+Lze7b/DczinlX+k0tXK3xOfl0mJs5dnPNauT6gdk7/M6W6bDvbGc9MTe1SXhcnjAGw/bgQRxstlFHYcGeZvvhOU/YWW4YNuTLYrnviJn52+i7neP8T9+sti7/V65cuXLlypUrV65cuXLlypUrV/4hefXbAvfmKL0FdnHSWyj01eirN8kbXJv7T/ht8sN4udyn5zaO0lOSeLncsDe12xgNlxRHvXXe4nG+295HG2bf1HfTn0rHnTX52eLY9ENTR8Si/Dk/Ct9b/IjzOW9q1eJhmD7RFwp763eDw+lu9g32wyfwqBrjvZsht5uVX4en3QWq75I/xNnUBjl9Yl+d6qUdvZl9zFnbD06a/nRYN7qNrdNJO3jj/+1+3uzNjd22N0/y/zbGp/SZHuq82Z9vevMn9d/kp7XDM7f32/28xZH4OMxqrzu+GwxtnRym0zwoTK2fT+gzXslX+jeJ2aT5dvoO/z+xr9K/PQyvi73ZDS5XDFOqQVUEpTedp8SmpDXJOV0o7cJXC2PboE2xHpvGN8bY+EdM+J3dM3H2J8+I87Qn2B3z3Qw+i3Giy/CkedgsIrxL+UrPKfcsnpt99OPyo/Bs94nzr3ZW4tliZ7wxBwqL4uSwqHjurtFNO8XVudHfzEsjzt+pPqvJBo+qi+rvbW0nrrSXEn42w2x+t3G384Xx2/lKs56E1QAxq92j/DXclV8nST/1PsPnzph/53eD9828N3u42QWOx3Z/Yu+0/eH0ExZXN9bHj6ged1yZL7XD273kzj+VI4ef4Tj1rXBu57HZtSd5dtzcjCrMKl6aPbZXt/nZ7iGFFc+d3fT9ph/e6GPN1Q7d7B81t5inzfNP50dhUOLrITcAACAASURBVGcMn/u+2Y9unzf5crP8nK3+o9Wdq0XjCCiATUKdfHrxOM5p4Bu+DlvjP2FELO55mwOFW/FQQ7GpcZMnlnPkrRaEGryWK8PU9rjjqLiiNPPF/LR9ue0TVy+1H+b3NHOpH07m8RP5dzpMP+HB3KiYb3dm06tv69vM/Zvau3wwXYX/BE+7Xxgmd5Z4t9ibXKcYjIeza3uL+Wf2zE7VPfXbpqeVT7djlB+WHyZphtVOcLZv9oXTST0zRdWGxWJ94/wm3IlD068JX8MrnaGvh5/qebTb5sbNjMOoxOFUvNJcurylfaLy4nLDOL3JAYvV9jPbM40dw73dG+6M1bKNm3oOfTj97f5xPBos7fMT75Qrw+gwpTusV5sbprfBs+H7PDM8MzbDP23cHnBxXY+5mqg8IX7H4dH/P/8nwYqsShpLFg5pSrxL8GmRWRLY91QUx7eJwxpJYXc5QN+NT9RVtuw+5T01o+KB/cA+mR3iTgPG8sJyoHyijsLg8oDnTA+/K4wqHwqvwjjjqLy7fnvu2ZwzH1hzJmlxqd5VM51itNLaNH07fap6qdhsh7Ced/GZD8XR9cVTS9frrm+wLxNnhWPqp/ln+BlWx4H5wRgMv7tTfY21SngbYfl0MzxjqfyyXYN8FG6WQxaPPaf8sn5jsVWvqPlw8dV8Mb4K6xeR1PuKJ6tHEmXfYntwOb7Mr8ox8634pefpm9UR/aOfpg4ultNXvhnnqcdwtZzYveKi9pTrD+VX9YabX4bb9Q6bf8bN1ZXxPqnT5Jfqos5VfhVf9p35Q2xt7JTPiU3N4aPDaupsld7UP90LybfiiLYNX8cV7xhuhYPhxPyh78QLpdFlHFhOHCbkgrYs36nf1G5R+Jl/ZcMwuJhsJ7C8fisgbjmqBKnGYEPEEqeIMl9JUgFwIFLx1MJLQ+CGG5ekipXy0A6k4pAGW+F9avnoNI3J8sbqoXLhvk9fzcJhPd4OZOohhh97n/nCGCo+44BYWL+hPt6nucR5Rw5v8q+wsXPkq/y3+6Lxx/y7Pmb4Vb3YM5uvdu5dLaefk/w4e7fHJo6m/zeYNn4YdvadYX1ExVF7D/27uVUY2fNj486fT9YPm95pdoLLLcZkvdnuC6Wfarrh2uSU5RP94KfLp5sf9pzqxzjPWGoeEQPaJP8sB4wL3idfykb5mPFU7pmtygFiSfmZnyxW2oMK21N7hUf1L4upuCusiT+LOfVd76iZm/eu51mvuXipHxKfqcPmUeFBXm0s5tPtE1Zrp5POXT8ye9fvaoe62VSzpXpEcUY8bm5VvzNb5b/FrnAybtOni8XsXV+m+ElX9aPrE7xXPlJ+NphVf8/8sNymPDX7o531bwWePbMFhLquIVJjpEKcFCeJWlapmaY0AzK5uqX5+4+4eNN/ozfjoG1aZG7I0W/6rpaY00+cEn6lqxYtLgnG/zlvcujiJkmzhs84nwo/2mM/KBs3y7hYGQb8nPibPmd5Tf5dr6h4TF/VUM2gyqOrl9NPs4Ay943jn86aOjl9VpOGm8sL1m/2iOpj5JfyynAyXOwcbWed1T5htsqmwcD4Oa6sx1mek32bzzmfra2bW8TY6H4CC5svxKNmIPW9kjc62BfIY+q5fnIz9Nyp3LLabOZ9o3/aU4hT1dfhcvcq36pH2L3brYgl6ah7tbdVHSc3Zvecu95x+WHxEp9NjRGT467yNW2ZbsvF8dvc4Rw6/ywfSofNNsOUdjHbQbiH2b7FzzQDuIOwD7e+N7lqOKh+VRzwjNXF5UP5dPPy3Ls5bZ+VP1UX17tuLlt+LAazcfvB8WKYHM6vr6+vb+YMSSsyDGRqkjZGGupJCL8rezeEruHaxp36bNmwJkLfLD+IXy29Zklsnk8aevL9hD6rb6ozs2e+MI8q92lZqHz9+iPTP+OgctDMQOKc5hcxPZhdz7b457nqY+eTcWC5dv4ZbsYZz1Xvo87UQ9vUX420+wHzgXzZd/TBntNuwDgYP+0zxTvtKOdv1iLhT/Os5sB9spwoDG7OGs7NuRKVO+xfnJVmXlI+mS7rVdVvjMeJfoOF5YWdu7qy+Go2PyWsHzCG4oI+GDbFG/VdTIU19fJWP3GYfpTeZr5SnvE7zpz7jjjdPG6k4efmgMVlO2Z+V/coKv+qZ93stbVhz6xODf60szf7Te1RtZ8nVsdv7kPUSf2k7lNPNfVheU788FPVLe1fxx1t1b5Ve971qRPVr81eZdywfxg21TfP3ey9FI/5wbvpV3FDHNNunqneT/lh/tWZ8snylnZZsxOuXLly5cqVK1euXLly5cqVK1eu/NOCb32YsHtmn/w7fRU74cHv6vMEU2vf6G5itH6a3GPOGh+b/Jzobew2+f+E/qfq1WJjcV1fO59Nb5zyVTPoZOMz3TEMShSON3Vr8+/wIA5lm/wprlv/qLuJ4fKQ7phuiol36kzlgsVW31M+HFbHpeHlcsTE6bU4HF8XD3OMd40Px6GxVXabem19t3Yn+GcuE36Vb8WVPbf6m3w6XYehzVPro/WHOilPzq7VbeJu9FPON3l2eJJtq69sfyo/z3ObA3f/b+szXWez8d/2jfLTYD/NT9M/W/8nPdzmh2Fu7U6xneowLD/9vMHH7k/9fap3Nn6fe6y76gf5Z3q/f+s/v32eUQeBuD8DVPoqBouJpNmfr+Fzk0CnyzAye4an4ct84Bn6UDHaP69jeFj8hCflN9Un6SdR/bLxn/788ATPRn/GSTP3Bo+q9T/Nt9kz7I5hd7HafM57hjfpKZ+pH09z0dZL+d/ut3+iHxwepq84uX5HfdcLyq7RcXV39Uz91+RV9SCzd3PG8nPazyf7UNXd8d3M0hYP86nOtvhZvzr8jU7S3/TzCR43Z8i36VGM4Xy4HCkuaKd6+TQ/zW5gfLYz57ApXw0e5tPpMV8O/wbP2/l19if+f1r/6+vdf780No+dmknWX+gn7bcTPMlf25+oq3SS/mbHIOY0ow7LxPOJ+k4/DN8GzwbTloOq92Y/uN5Uvj7dz24fP7q0v2aw3yCoN8/VJ8pGH+M7LO7ZnSvbjW4Th/lmuX7jp/H/E3nc4lH41B2Lu/H1xr/LBeZR5ZVhSLGY7wZPw2XLd5v3TdznuZWNDYuRbDe4Uj6VDeJQti53zI7pbPxv86MwbXGjXYqz9any3gjGa/Myz1FP4VUxWz4ufwyvsnEcWxzMH8PkPhU2h13FVHxO8KQ8bXKW/G/wJ/uku/Gf9PGs1Wf3mDOlm3wkYblD3+jrhC/zjXfb3CjsjqvinM7YndNLths9ZbflpHKh/CjbxOOn9Le1OsGjculyzHROYijczHc6xzOXO5UbZaOk1XOYlK3CnvQnR/bpuKY8JEzb74jfxZifyqd6bnLa+E7nTI9xZOff08i91Znfv778b3sSeKfPfKLexHLyxm9TSLxjb02nsLyhb8alLW58yxbsMJ7KncOkaqTOnLBBc9z+CX3GHc9nndnn1GF5eXRRR81giwd5JzzJP5t/NnvIr34r/JXfXrM759fN1wmupMeE9QXDxLCqWOn51D/OhtNp8uB8sxqzGWn1Zi4c16nH8sTqdCJsnlQuGCe0n5+4Lxz36VP1VJq3Nhdv+831hto/mA+VP/Tj8GNeUl80+VG1Sb2Kcd2sIx5XOzULOAeNvvLvepTdNfdMj+FL88fmX/FAvy1fVwec7ZRvNz9MX+XC9bHj4vKgvrM8sFhMN/lWfFt91wsMl+tF5v+n9Z3uo6/yssWjcjF31OwrVw+1P1Nvup5k+UN913tux6a8tXvEzWGaNyaqnycmtXdanzM/Ttf5VTzS+bZ3Z+1czZ3PFNvltfGPvtEn03nOv+fDBJDIqoFhNuregWRY1CA3zcgaiy0z9w+FwtbgUYvILSXm/ycaRzVJmyOHP8kmhsqhWrKNf7VwVM1S3VV928Uwz9kCUngYBuYf8Sf/OHvIwfFwvaVE9boS1RMqptprmDMV3/FhecNaPjFY/Pnp+kadn/pnPePy6vLt9PF7M4epvuhn2qm+TDhVHOWn1WG7Q9VL7RnVp2l+FV6XD+x1N1+u35itq4nrLRZz6roeUdjVnnL9o3wyfcVJ9SC7c/M+75Od2ysMJ/Pv/KZcuf7De9brqM+4og9mx57ZDKleVHyTf4zDYisObG+4eqqcJHzOP+tP9Z3li+monLX5mfeNftpNzK/qQ4yDeXCYmD76V+cJx6l/lrdUO1dL1HOzzGqqemn2CMs/48Nmup2fhp/DmeZw2jx6m/lC32yGUkzmn+0HNVeqrxW/5pzha32pO9cPzrfSVbEVhs3ZtwLJBpURZWRYwX//kTl0Sl+RbpcMDi/zpwYGC5IGWBVtclVD2g6PWyjN8KY4Kk+pGaces3H1as7mOctvwtXoq/o2g8j6rBleN1dqHttcql6bOBWO1DsnuNRcKv1NXXEumn5NHN7sGrxXtcQcKJ+op/QZR+XX4XD5UDGa85kH1o/M7s2OVGeN3wZTK7gf1J5kcdSd6j0297/+yHxuesL146eE9Xia4c0M4XniMPOUesRhdHHYndvPG/zIQz2z+NjzqQbYS01uXU6Zz6mrOD21evrc+Zhc1fM8n5+Ki+KKtmq+Zvw2pvp0eFydGF7nn9WR9Q/qKD8oE2uTn5QXps9yr/Yk9hLDxHKsbFKusCfT7DgcKtaUpl4qhwy3y63jyXx/QjAPrK6IjZ1Nfsy38znzx2rC8o52ab4YVsSJvlSNp//UE6kn23PGA+0mHvSDNkp/0w8KA9Pd9i3jwXL9nRKshtMVSxWY3St9Fl81O2tMZecaS9mz7wqH46byhxicf9RXftm5ay72rIaTxW/xqNgYCwes1Ud8jX7TyywPrrcdV+Y32aTF5PgznM/35F9xSv2bepVhUb42vad0p0+18xJ+jIH9qXZRwr29T5I4JNn2raoTm3ncxSpfbvcwDO28NjlhsU965uGqdrLi4jgyX/MM86j2n+PS7oITafY0+864NFhY72EPKn12l/aH4/U8Iw5W1y3+Zvep3LIcM1xKb+o3/BUetHH4mU+3i/He5SjxcX3AZrHhiD5ZbVQPoV6qk8Lc4FEcsE+Zv2m39ZPw4F2DH3URM/pnz6ineE17xpHlhPVZ4qRmxInbOQx/Olc5Uj5bYbVK8zjrMnUcxxYzyxu7V/jYfmh6w+0Rdf74UP2gYm111Gy3546Tu3c2TU3UHpmfzFbNhcPJ/Dc1vXLlypUrV65cuXLlypUrV65cufJvSfsWTp2fvAl1d1Na/0p3+mExNvi3vH9SX72dY3wb2+b+TR0af6z2LrbjO88avkmSforV+la2SYfpvemDNv9b/y4/z+c2T6c5VGettHYtpmTX1GTLt+X8Kf+tH9R33FNe2hiOw7RB+9ZPwrHBovA5O+a/rU2DBfOTMG34sXwr3C7+Bo/TaXPT5rexSXHUXWvzib5x9WnxN3WedWj0G56n+hiTfW/ytMW94fFpzj+tn/qh8flJTIjnja/GNvFtz9y9y6Pq2U3s5L/ByGKnuWHPG6zbPmpr7TigXsNzw+kN/tNaneJoeZ/GSdhbUf42usx23tk/nfs/iuLPsxxZ96eDSh99t/7dn94xf+zPlD6B/9/Qxzw0tWn8J3ztn2Vtaqn+1Ezxeltf59/1I/pnuVP5QH94p+wUfsTk9Lf5/2thFPlsMbl+xrOGn+PU5gfjMT1291P9/3Y/NDl2XPEe923D+808Ko4sfltft09YLLRXeTnZJ5uaq/oyPPOsyQXTaXYgPrdzkGK3WBiOGe9T+5D53/hoes3xdfrbGG93ROp11En2KmcsH03ukr6SU333iXjU8yfPGw5qZv5tfdcPKrczTuqRbe9v531i+Qm+n9pvCRPGb/1/ah86/8/3tCdO8rPl66TZf4qHEmbb4vsE/uSf4WznReWnja/8b/cVi6vsEFez+xs+/6PvwLM7PHuef/+RpLeN8cb/tEHbKY1/xNJwUv62ed1gcJgSLidJT+Ha9FdTq8RX6bNnFpfFOY3h9JWuiunE5YX5UdwS5waf4+ewqBq4nLL4yX9r+4mabWubYmxywHSd3y3fLRb081Z/y13p4Ke6dzEmVpY3l9MUv4mbaqZiNViZD4aV6TZcmL+kqzC6PLV4HK+po/KhfKj8pntl4/LiOKfYimfLj+Vug6/FmPgwLu2zygHT2+B0vh02xxV1WC4T1/80fWbjauvuPoFla+dq72xTnZ1d0j/Va/g7Hgmv8uH8J330r763+F2cDR7ElmrxU/nZ6J3eKR2FU/XHJ/LDattySFhYrzibxAPvv9PbzPn86488+tNuvg1SPjYFfT6Tf9Sbz/hma8Zp8ScumB9ll/gz/BOfw8Ds0Ce+rVNYFB91l5oVsTEbVxv2VhVxsJqz+jreirPTY3ll9ukNbBPP2afeZb2RatDGns+Yf6bT5ArxpDlgPrZcGj8Mh+OHz2o/KM4MU9Mvac5xHtOuYbgazPMO52SjPz9df23y1+DZ+EIMafe4nafipt2iashiMbzMH/JVM8FqlWxTfOaHibLd4MEem/hYLVHX7dCZH9Rn8dQ9m70mPsODvJ0u8nd9year6UkVN+lPfCpnqc5q9poZZTjds8Ov7pWuyy/jqnr8P1Uf84B2KifznvWQum/1Va8hR/Y5vzvOii/DjL4cPxQ1Y23cef7gZXOkZon5QDysb9IMqP2ReKmco76rHeKb/tKOYRzSjnDYVVxmi7ERA9NF/5jzVCeVb8U99aTq53mHMZs6uJgbUXO93Q8rEL+HbGzS3fxM/pEgE4V3g9/5VfjTd4cvxWjPHY6Wt4uhcu584x3WhPlOPpR+Wy+GXeFkeipOi8XxcoJYXfyNv/mMHJR+mwOFV+V3g9fdb/wxLCoX6RP9t75bUTHf4kn5TM+KV6vvcJ/ySL7Tszt3fJlfVzNmnzg1+Wh8OTwuDyn3DV7FPZ2r3Dd5U594pjg5Pmjf4nV5SfoNNvWsYrV6qQZOv+HB6uFiKJ/bvCj79vMEz4Zni6/B0uqf4Gn5NjHc+ae4Jl+tncPe8GX1VNLwVrwSHoZjk7fkY3Pn/Kf8tDib+C6veKd8Kz7uTvlo/aZ8nuJSeg6r0m37wdWL6bQcWvwtX8VP6p8mtLnfCiavKajSb20b/Jsz1iSuKbY5TP4xL21chb3B1egxnG09HC+FV/l0/FrbhNfhT9LqNfE2d+hP2Td4WW0d3uYOsTXnyX/issXa5qzFg3qOp9Pd1EOds75o893WeKPv8u3OVVxmg3coqItxnF3DVZ2pfJzcK9wqfvvs4iUsb+xaPBuOb/y3NW3zxuKo2qHf1IvO3mFI+uo7u1Ofyb/LSxKFDXWc3pY/SuKb8rLhnLic6iu+TIf5VvlR5wmXy03SV7EZT5cTFbfls7ljWBQu1HHcEmf3vcHrcnTqs7Vp4rnvm7uWg6tRg9/ZtJw+4R/1U/9MfaaHflJvYA6ZJDzp7jQ/ic/388D+nOxRYn+W0/7Zz2PHntV39qc9yj/7szz3Z17s3vlH+0Zf/RkXs0VsKjbTmXxYHhlm5OJqmrBvnx3OKSoe46XwtUM3+yH1R9JLvedwMH6bHjuJ5+xVnE0/pBptcLD4Kkf4Z5HqHs/QP+ZSxUJd7APs+5Yvm/fN/TzDnKhZZ9iYP+aT+XFzstHHu6b/mzqoujNblROMiblCrq5O21lBfIhZ3WMen++bmTnBk+yVv+aczVjCc4KJ4XB8GR72zPA4nsy+tU39r/g5bqnWDRfGzfUdi4f1Tfti3rHvzL7ZB+zZYVH6+F19Kq6pJmpnMK5uL7J64a5Jn6mHVb/hM/p+zlxuHDeVS6bf2ClJfBu/jm/iiXeOs+snxUHVHTmqmVe9z7hhX7k9oriisJ3A/Lp9M+/d7KW8sLPUzw0/p7/x7/Kt+kdxw1y4PmP9puIwXBgP77b2Kf9M98qVK1euXLly5cqVK1euXLly5cp/iNS/tWvelp68rWr0G73TN7pKEq+Eib2JdjE2vrf6m9y4e+fn+e7e9Dp9vNvUkmFUftI5EzcbqsbKhr2BV7LJ/6ZfTmxP+zjpYm7YG/vTXlA2ikvjr9mVStq38onDxh+bR3en9F0fzrzOT8SV5khxVj7Ufaovw+l8v9mvCkPjY4up0U9zfNrPrX+F1fXOib6zSbza3azuNraOq8vpST+qGEqn/bcn8WhxqZqezt/El3ht9/qn8u90nH67u5Ludt6xb5p96/Bv/l1gd1t9hcedfcq/k7ae7X5sY230mvw8omqj5lHl0p2/ncHEgcVl/l0fKP1P5b/BMzGlmuBsu9ibPsW9gf7f8k25dXsm9VHS+8mZ/H4Co4IigwV2z82QsmZo/Dps2IyMfFsUF78ZTNRn2FoMasE5/WnH7FXOlF+WB+yfZtAmlnZYEAeLx3q49a+GTOk1Pan0ld5J/hVOhgF9tUvX1dbhZTGnzxQLY57mx/l3c8X8ql3Z9oryo/QQqztzMVOPtn2L855269w9aIv+Ey7F2eFzeW5mwO1PxtHlgdk5H8jX9UGj3+xlxY3xnjFYXVMOGHY3l2/08TnVE8/YzKNN82+Iy+XE1dRsi5/1D5tNledtj6f8Iy+1C5r5Y3wZP+ab+VR1ShzZWdMXKj7Wht0ln2pHuB059VkvOixNntn8oj+XE3em7jBW059bPIovs1Oi+gf74NFVzyfzwnbEjO3wIBZVL5xHtXtcb6cZ28x1qgf6ZLmZ94xfwsb2W+pPtiMxnsqTmgW3J9WOTvOEPcH8N3wRx7PDFCa219L8sLi//whywTgNfsaTnf369evX9yQ5lVigqaeCuOZnxVSDkRKIumq4k20StnzcQkrFdoOZPk/0sW5skHB4EtbErakDa0b0wfRYflWeWG+rIVN8mTTDxe5VH827pNPwT/qpH9NcOt8thzfxp53qrdQ/2AdNv6XZwWelx7CrvkRdNjdpZhie5s7pu3wxbPOz6ecUX2FkvaXiqdlgvdTMA2JvelthSX10qp/qhWdMD+Op2Wb+1fxiPDVzrf7krJ5ZftBvyoO7V5hcLhNP1Nnid/2jfDQ97vLvZn3yQXuGVdk77riDXB4ULidsxhJfFh+/u0+Gc/aDiuek4Tt1GF4UlWeXI4ej2U0OF+JhGNjzFs+JPzUHjoOynfwYDtcTrqYns6L4M15NPyQeKf8OJzt3OynhbfSnDeowu/n9tB7tM+4zxonlSvlALGxfuvqq3lFYGXe8V3bqmdXK9QjinrVL/fvtkqekKX7bOC4hKSYjz/QZJsehidHaow/0p/KvGvaNfsot08GcYb3UIDGeDC/DoHhNDGx4Uq6Zf8dV6Sq/atgUR2bD9NWnyqHTV/hVflLPNP3g+KK+ulexHRcWE/uH4Vd+m5lvdJBf02v4XenM5zTLeMfyirouX6yGbj843omj8qOwI555r2wVzhY788v6Y9PPyAfPG31Vs8Sb6bLvjX8U15tpTzl9dqfq5nYI+974ZH6dLtaf5b+Ns/GrfOAd1jL14extvGf9gT2UuKudxXir2U+2KibzhfZqhphfJmqvpr3V4GOxGk7s7sG3mS9VO2WverbN+/xM+1DFTXiwLsxuCuPh5rHBxe5U/7vY7M7l3WGZ8THfqi9cPdwsMB6OlztTs45YlA/Fxc0J053+FEY2Q2q2XD1cXV1eN33P+Db8ED/mV/lAjGrGm15Xu4PlhPUG4mQ98nz+z//EKQXcLCmUVERFHsEqHKiDiUC/7DnJNi9TXMEmFuSQsKtl5JqPLQkc1ok1+UYcbX5U46pab5YQ4mFD53iw59TnWAvMOX5nPcGWhOKp7tqZYX2AOoy3wsLmWs0injNblmvFq+GRcol2qt9Yflk8hV/dMT8qL2lHKEwOK/alws12D9s3rK4sZyxO6gPHWfWhyyX7rnSQR9NDCj/zlfTYvG/0FT4lScdhb+rI+m3iRd9Jf+JisZudozC7GXNzjnbN7DLOCksSNb9zf2L+2DyxfcvwqB5l9XS5YrhUnpRPlbvEH22VsHqp8zmPmNM2zvyOZ6nnt3HwGWeGxXR8HL4GS/I//Sk9tQ9dr21E+VT7Ku0hlxtXV+XXzY2zY5zaeGqu1LyqWUJdhonFOqmt4q/yrvhv+03xns+Yty0vhcn5T3Z453govugP/TKcagZcPzzfcQZYTzc83Cwg/rYf/7pjzfCIcrLRY7HwU+FJSWIYXIwG67RrRemnuCz37jlxVPbOL8N/gsH5VbESznnf5gr9plqwmOkscU+cmt6Y+N1dI2/1U24YXsUR712e2HnjK+FS3DY83JnCrfw6fs7O1aLF+7YeCUfinTi08Td+XQ7V3Sb/rc/Gb1OfpM/y7/xsMLafG/6n+m3N2xhOt+GJ0uJqYzisKW+pP9QdcmnitPlkcZwflXMVq5EG65v7hoPzl+6TTus/1bXx/zwreYMZz5Q96ivdxEPJpgdTPZPNpjcSvrZO7E7pY8wNX5cHVXPHL50lnArXie+Nf4ZL6bCaKN8qhymPbc0Vn5TjTR0VZsaT+W9tlb+mVhs8f2fjf8+/ny/4poe9WXNvDlkw9fZKvama/tXbJdR57B7/KdGKh5Lmbde837zNRB/uOenNT/VmkNX4uWc6U0/VntXY5bepM+sH1HW9xPwhJ/QzsSEO5gftZx5T3tTMKVzpTSvOAH5P/en6W82wElVfxMV8qt51MVWfpP5BbIwf3mONUx9PLM93lX/Fz/lO9wxb6n/3iVyavnX53/SSqmmaT5UHFMdHzRPmIvFtOKc5bPad0n/wqfoynK5fps/JPfln9Zt4Xb2S/qwXi6d20xtdNy8MS9P3GJ99budp8nDnyJHNoOLiZqKZD8TE+m3DEfPE5pnpYR6cuPlhmFiusb/wOfU4i9vwwRygLdZP+XT9w7AkHwmz4jF7kuWK7UPHV2FWWLZcGJYU77RPFb5UX5U/9sywtL2heLAaob6aH4ZD9UdbA4cNMbncNfaIP+1P1h/Ic+6UZmcSLQAAFdZJREFUB+OcG9cPLHbKWbuv5gwzzGw28bypH/phGNwdYnT5cPsBfUx8icOVK1euXLly5cqVK1euXLly5cqVf0iq3x40b+qSvrJPb9cwhvOt3kgxXOltdoqh7t/YuDeHjV/3RrkRlWvmo8WkRPXcttdOsKNNemOrcG7vEs9GpzlPc9O80W7tHR7Fze2aqePeLCtMb3qFyaaf1V3y3+htsEzdtvaqpqofJuZm36rYP7H/8YxhaTGc2mz3p9Nv98BJr876vdn/b/bP6b7a7thm7yl52z9v9vnEp+qlbDa43fw04urP9NRd2idv/ScbFsOds117mnucTeV/i3HeId/N/Kld8KnzLa+T/py+nP2bfZhwN3onPeQwtbibPDe7ZxtnG5fNCovx3Df5nLp47/ZPw4PNt5t3xb+dj9MdxHLS5EHZnOyopk5O3s6j662mPgpP6meMFRukBbTRZ+cK7MkCTYlQ8ol/AE70MYfuDLE2uo5LsxA39W34qmeHrV1K6Vzdtf3W9i36Vj7RRzvwDR7VUy5mypmr35t6sbuEf5uH1LftzDh9x4f5ZTsr2Tgc23lEnKo/mlo2tf3UPkd9FePtPm9tNvlz+Wa96rht99Vmvk7xpxypeJ/Qx/yd9FvLN0mK3+JXc3rqf6P/fFe43Jy2/bzdMw5P6z/Vu81NM6eYD/bM6up4MZztjDI+p/na5LT1n/KI+Wvn1tWl1d/OgMPe6mLsdL/FgpgeO9af8276V89Kf4MnxXCcFY4pCfMJBzV7qnfSvKicf7J/lH6T58kZObDnZr4ZHhb3re60UfquVk8cxi3pp3n+6/Ax+D0EiaKO02/sGAY8d0SUPmJy9063wcB0Gl8qP+os1aXJ04brJk9Nfhqu6r7hgfoJv8uli8/0N5jc81aP3Tv8aOPy0+BisZO0uk0enC7GUPlxPtscOH8Kq+KreCg8W3wKE+q0WBQX9MHOXbz0PcV1uBmHRg/j413Cx3KquG14qBw7TPP5U/hZDKWX7hyu9IkcVY4SzybXyX+bA8cbuSl9lXumt7lLuUlcWG6Yr22c5D/FbP03HNWZyvX2XOkpuw3GBscWP+bW1SP5Y3qqlqq+G3vHudV130/1Wy7KV3PHYiquzK7NDdNHXMqXO0u5YHhYXIZZ4Uv8HD6F0fFvctfqqrsWp/KhbFjs9L3VPbFxPJL/NmdOX/mP/6dDCnxr8/t3/+YvvTH8hL7Cpd4SKt7Kr9NjNgp/8/byJ96wIgdXqw3njW+02XBH/bbOLd+UC9Y/m35Qfpq4E7/LB+PUzFLqr1Sv9JxwpPlguWFYXY2nTsqXqosSt1fUHeo1Pmd+mP5pfzgMm5oqfq6+DMe2HltfU1f5ZL6Zn1TjTX5Q382AmwuW4+nH5UTpb+qL9omr4t7sBqXPYqTabWulOCqu7N5hZxiTbPp/Ewf3x5t5VGcb/1uezayz+Ox7U6/U205X8XA7AfEzH+7Z7QasUeprxOE4NedtLlMOVE4f/WafNLhP9dOOSD62eDf90NjPs2TP8s50mn5p9FRtNzosLnKYNWy4NTOo4jJdlyeVO8wb+t7k/43/LV/2nHRSPV2+mv3genxisf9ANQ2KiWTgWLId+JMkpQbGBDTC/DfF2uhjnljuXJ6SOB8qDvJvc51ywfKihtb5UlxP9Ju8Yy7UncK96V3E3OYKMW3yw+ruesVhQfwJS6vb9stJrtu5YvVWemleGkn1VPoNH1b3xj+zV36a/mnrhmcqp9vaKlsWt9lVzJ/KMZs7xVfhVfsrzYjDw3xs9V1tlZzM4oND3aceYf6YOFwb3I1+M1sPptP5nbHa+xP/6Ev1OPZx8p/2A+Jv84l2zDbNpM5A9tvUfrvjNrqu3io/p3rODjGpXanyyWKzvKn8Mj9p3k7m8U1+sJ6KbxPD5b6xSbP16KseVDOk/l1xeJqaOn5Mt8XBeifNdZsXxtXpKN2TOjl8m3o6O7djlS3yaexb3ElYDZqd3cb59evXr6/fQx5DfMZPJUxfSdLD8+3zxJowpDsWS/nGc5WnhLvBozAmXikvGMPVW/ludDccTp83OWI2G1yN/amPpDfznPyzmrS5YbESPyYpBuPo7hx314vsjMVqOCkeSSfl/iQO4+14fOo8YcW+YbjY96bHWrvUCwrPJqeMb8Mn5aHhincMq8LxFj+Lm/w3OWX6Ko7i73Btct3KiT7j6vKucqR0Vcx0l/LCfLi8OqzJttFJuVD3iN1hYNzTdxZ/o9ucb3UT3sbG6W18ODwb/6oH2b3D4urEfCjbhH+r38RHv+0znjl9lp83eWW+GNcWH8ZymJzuJh8t35QDhSn5d7oq1xs9VpPET+Fl5+qOcX2Dm/FQcRwPxyXpqxjP5zdzzN5IzbvHAXsjuHkrjGCat14bv+kNePMGDfmhHZ4zn+lt57aBH3+I67lTb2oTFvYGevPW1OkzXXbP8s+wKR5NL6UYCbOqF9bF+VP+tzMw9Tdv1VGP1R7vHQfXlxs+rBbq7bOyRR9sHrDHJ36X4w0Xp+NiuR5Os7mVNC8Mz8mMPudYV1UX7Ls07wornqGfVGuGGc/dXCDHNEeOn7pnuXnOmz3oeqDBz3wyfVUfxYVhmzlnuF29lL7iPu9ZPjAe5kn5ZTzZXdp7WAvUZ/fb/sccpHlTnNh3xquNz3aG8o/4XD+zmZ6zpGYbMTE75tvlrckB4sA7pcu+q3ju3D03/ZHwIC+X/6n/3GFvJXvmx2FV+BlnFf9EH+OzHsO8ID/kPM/bfsD8bP1jnVQunK/NHTtP86h2B/Mx+biex2fsb5xf9sn2jftk9XG7o8kN1q7JH8sb6rI6YY+rvM3vqo9VbbbzmOYk6aMu660rV65cuXLlypUrV65cuXLlypUr/6JU/zuvJI0uvt39C0j5xpbpKhzqzbKL2fpO+id6b/3+FP6p/3xPb5VdLBW3PVdvGtVZw1e9uX7rP72ddn3v3jw3b2LVvdJLdu4N72b+0/22L53N5m30ZnYavVTfBs92prd6qj/Z7lT+Uj+cznv6POF8sv/T3lPYH/3tvGxm5SfOnzsVv91Ln9i3G8xOr9mfuIOUbjPDLfZ2vtJuZDpsXlQeVAxVl5MexZorPGne065KOd3mB2cac6fyxPQwvrI59e92ZsKFcTY7trFrdoXr7wbz9N3uvfSsdBQPx1FxaHGc6rf4na8GD5691Xe1bW2xR5sYzvdGX+lucpvuNv4/gae53+q2+1npplibfj7t/cZG7QfFad10jZ7TV/94OHKpIG9iKx9qqFODb/PT2pz6x0Xs7N3i29bD2cznhIfpb88bvmlQ3fct/oQHP5Wv+ax8KiwqNtPHmO1SRHuGR81o4tD6T3KSSxZj288Og7v/if2jMLSzwTCq/tnOS4qLWJ24+drgUfOjcDbzssGBfDb4P51/xjPlZ5Obtp+xNu08nWKaPaTOFP4mR8qW+Zn+WI+6OqZ++BQvlV/3neFv8Lg8nuSnjZ84Nf6VzcZ/yoXCg/puljbz0uBv/W3yhZhZ7ZWc4lNnyd7FTry2HBI25sdh3OD5JP7NjJ7216aXlf5bP5t98gani4nxmJzUd9bqOcOYDV/XtyyOwsN8KbuE2/lX/ftXXR6H8/MRFQiBqO/K5jcRpqsk+WXf0e82ThuX6Ta+lChdhyfpOzyYM5c71Eu2LZ8Ga4Oz8dnkItkkXdVTTp/pOB+Ji9JNvBgm5MTiJh2Fc4On9e/sG0zpnOXH2Sj8Wy4Ky/YT4265MBt23vhkti4/W8zOR9JPuVBYlSRf7tzpJJsN34QfPxOOqZ/iNtibs5R/xYedK52Eu8XecGF3Ch/yY9xcDMZNfbr4iGOr4/A3+m3MN5yVsNwkuy+QrX/FkfHa6KQa4fnGXnF23xNul3cWT52d8FU2KlbCrHA5vy43LX4VU+Ft7lp9xYFxcrotbpejU32GK2FAO6ejYqvvW33Hn907ncZXc8bEcXJniXcbu7VTOFH+MmiCOYd/OSb6LfGEJ/lmGBOf1n/DOcVxfN05q1WLx3Fw/hCHy11j8yYe02GcE9f2PuXOnTE87R3jps5acfqMK8OjcDs+bUyFA+Ns/be4G58pP/NTcXB8Er4N3zc5YbgbvCwOe26xMyzKH+o0PpK+4+g4oL7D73y63DX5dHnY8GXf27wwHoy/e3bnDEOjO58TvmST/LjabPgwH4qX45RiKL3EyZ03OBr8Kv8p9+lMxcB4Ll+Ii+mknCpM6r4528ZJ8Vt7ljv3+UlMKeesf1SttvhO+DQ1Sn2rdN7mV+Un+W/ibnq+6ZuJsc2XwpK4JjyuFi6ui+n8pzo0+m4GnCh+LuYmbw2XhEXxYLEbvvh961/l69H9/v37f//MhhFTyXHy6OCf/bA/SXL+tnimzycW+xM4hxXPZn6YXvrzK4yv8Lg/1UO9eaf+tI/lZ2Jw+JE3q9W8V/lROX+jozC1f/bncjHtlO/EmWHGvlR/3uZwst7G+/Qd8bd8Jx6cQ9ZfTlw9kONT5zS7bYyNYP4wpypW08+PNPOOdwwLqyWLO+cGOaIv5pP1voqrfGFc1V8Yg+2g6cPNouKz1d/WgPWM6lmWF5Yft2uc/iY/yCPhZrV2+8jhVzEUP+eL5RN9pf3GfCt9Zat2iNpxTgc/3V5hfeh0FSbGy837wyH1vJufhJ/VMvFlOWz1kYvqd/TpZtLxwRwqXZUDhtX1JztnmLfzwrhPGzfPCZfLo+t3/GS1VDESX9RVNUT9ZlYfm9mPDRbWk863u3M9xmznuZoV5ifNO54lvAobi4G6riaphoyzmiXGVZ2rnk39yvLR5MZxwfwgNrf/0t6dz8x/qpmrm5sHrKviiznZ+Hc1+KvnJlHW0Ow56TC/SZ+J08MCzTiseGpYN3GUpHum7+IrnTae8tXkh8VJeTrl5vCc4me2W/9Ol+XG5SphcvgdFoapqd+2xi53DecT3+lc4XF5au43mJ1uwyvVwflueDL/Cktr0/JsODg7pZdq7vSbs42+q63DmO5cTjDuJ/PTYGN3bX6c3VsMLnbChPdMHJbEE2M0Z86Hwu74MH4phqoTnjf5Y7Eb/4iVidNn9ik/Ddekr3S2uW5snP5WEp8txnS3vVf6qU7MnvXBG77KvtHf4HfYFNa2D9Wz48ZsG8yOc/LnuLj8qu9N3ZT+Ji+bu7YXt8JqmTD8NqL0me+GE4vZ+Gr7R2F3eg4LO1e52eTt+3lgb4jmJzrBN3HP26qpi2+w2Nsk1GcJQ72pjzoK73OHdgmPizl9Ohum18RneNwbUxUH88Hq9JwrnAwbw5fsELfDPHGyWjNMqieU/4STSZtzlk/Vm9PvSX9uuagYjnejk3bH3BPpLfPEqvRdrja4mY7LqbN384W8EsZphzlgeGde1IwxnZazy4/iPXWb/EwblTfVBxv/jb7aJwrvNn9s9uaMIO8vkIQfc4mx5qebw7RDmh5l+F2Pqjl/gwnzw7hi/qatyxObDce5yUOSqc/yhVw3vmeM+Yl1Zbyx/m4GmU+FX9Wl0Wc42vwwrqjvZnmeu75ETK7/p27zXeFIctIzLo94h3lr4qV+cL2Gflhfb+dwO1/tfnDYk2+0d9jU/mE9lHrSxWMzoj5VXRGvip/q7vg6nwwPs516M6bD2O4XxMOe0655+vx5ZnjZzmzP0N9zx/YRcmS7MHFiPhQe1c+OE7ubHBr/rJ7tPF25cuXKlStXrly5cuXKlStXrlz5F8T+tYF7y7U5V3dJX4I2b5rcG0gXu3nTyd7WYaz2Deh8E7fRR0wMA8PG3gLOc8Wp1dnYuBw+0vRXyl3zJtTpYwx23/JV9U6ck2/GL9lt8Sf7Ns4mR6leyv+8P83nW/wJi7r7pH9WX6arYjj9Ns8OP/pq5gMl7VsVt53pJO0+cWdbm7f5Sfozxua53TPu/pP6m/xv9+R8bvcg008crly5cuXKlSv/nXL0A9zXV//CotVV/lFn8x8fjW76YROxpx+m8D9yUowTfRd/yukP6ClO+qG1sUH7dM98udwxXYZF9cN8Zv8Rlnpa/SCe+vrtPCKnxHny3NgoPRe/idv8B8ybfnDi8rDhhHqqdxJOppP8sz538fFsW+dtX7EZU/GQt8PdcFD5TLlX+JjNtscd1pPZUNLWleX6sWXPbn82nJy81d/086b/065V+m1/Xrly5cqVK1eufH19/d8fNJ7v+Jlsmf5vkNY/2qGPT+g7W8Wt0Vex3dlGX2FLuNkz02/FYWpwJL/Jf8pdk6ek47gmXye8GcaEN/FLtXJ5YdLoNVgcj21tT3g47EkSZ2fjzpOvxn/CxGKp2EpX4WJc2twynC6+y2WLQcVQfjYx2HPKVesfeagcbHGiXxXLYWLPKU6D3eUw2Xzy3tVL6Ux+yeeVK1euXLly5b9bvp8v6rfU7gdG9ptA1He/xWX6yvcnf7v0iR+G0m+O8XxymN+b33KjvvI7Yyp9xd/hUd9RZk1T/dhvxBvfCrf6odn9cK9+C8rq+egr3Ayb4uk4K784d6xejoO6U/mZ2JMPpZ92iPstdPqN8zbnj03qtxmz+WS+mp523JVe4z/1ifKrZvfRnf2fuKHMejd74blTfaHOUu/hnKldwPLpelj1s+sVl6PUawqnm1cVVwn6UnVW/YY5Uf2OHFzMlEsWA+vD4qv6Yz9hzzT+E45UsytXrly5cuXKf598qx9mUPAHdPWDK+qj7vyBTf1Q6X6AnVgVLved/aDlfihufjBNdyxX7Idv9UMgckH+yh/qMj8sTvtd5QZlU2v1A3pbB4yj6q/0G14qv4oj8+fyqTA6/oyD45bm5JSby7frTcYZ8+TiNrlqxGFQPeJ2icLl9gfj1Pp3s824sno0s46YHP5m36Sd5frO7QDckwy/w6S4qd3EYrv+x1q6T7VHHpypFmkPqXM3gy4/WLeZDzffbM9M3Vkflj/3zPxjLVU/sZiNf+TJbK5cuXLlypUrV/4S9wPRp/TxhxT2g3fy42IrST6SDf5gePKDFcZTvpM+YmbP27y250lP8WrxbHG4HDU5cz5dLk/isjis59i5ksRB4UlxHP8mfyf4VeyUY/bd5aY538RNuorrJhbz4+qDuWzz3+bA1SnFb7iqHG1F8WU4FKd0lvC3+W+4pLuk8wkcGKepd4tb6btcb20a/XTHODs/Se+kBleuXLly5cqV/3/lf/6CJv3WCnVO9Oc9++3X6W+Yf1IejF9f+n86ofRRN/1w2OirH1DxN5bsN8fuN9nqvKln8xtRhZnFZ7oMh/rtuOLCejDZoB6LO/2xGVH9kGaAxXR42W+OlW/XC65nWH6mtLOhYjEd9ZtyZcNmSOFy9WL2rjeQp9t1mG819wy/8+84MhwMu4vDYjxnzTyzOC6+00/zNTHhXCie6m7GwzuXf7U7XGxXp5Q3Nk9Mn9k6HC624+vwqDnHZ1ZfxMz8oY3i62wbjsm/6yl3duXKlStXrly5cuXKlStXrly5cuXKlStXrly5cuVfkP8H1LY4auQT5vcAAAAASUVORK5CYII="
	);
	g.asset.imageLoad( "ASCII"  
		,"data:image/png;base64,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"
	);
}//----------------------------------------------------------------------