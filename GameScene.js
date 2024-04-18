//----------------------------------------------------------------------
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
		/*
		let enemy = new GameObj_FlyCanon();
		enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
		enemy.spriteItem.pos(320,30);
		enemy.spriteItem.view();
		enemy.init(g);
		
		GObj.push(enemy);
		*/
		stageCtrl.change(1, GObj);
		/*
		block = resetblock({on:false, break:false, hit:false});
		setblock(20, 20, 40, 10,{on:true, break:false, hit:false});
		*/
		for (let i in this.spriteTable){
			spriteTable[i].visible = false;
		}

		/*
		player = {r:0, vr:0, x:0, y:0, trgger_delay:0, turlet: new turlet_vec_check()
			,op: { ptr: 0, x: Array(40), y: Array(40) }
		};

        player.op.ptr = 0;
        player.op.x.fill(0);
        player.op.y.fill(0);
		*/

		ene = {now:3,max:3,before: this.now};
		result = {score:0, time:g.time(), stage:1, clrf:false, govf:false};

		delay = 0;
		trig_wait = 0;
	}
	/*
	function resetblock(sw){

		let blk = new Array(ROW);
		for (let j=0; j<ROW; j++){
			blk[j] = new Array(COL);
			for (let i=0; i<COL; i++){
				blk[j][i] = {}//new sw;
				blk[j][i].on = sw.on;
				blk[j][i].break = sw.break;
				blk[j][i].hit = sw.hit;
				blk[j][i].hp = 1;
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
				block[j][i].hp = 1;
			}
		}
	}

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
			if (wr >= 270) turlet+=3;s
			if (wr <=  90) turlet-=3;
		}
        this.vector = function(){
            return turlet;//turVector[turlet];
        }
    }
	*/
	//=====
	// Step
	this.step = function(g, input, param){
		/*
		let x = input.x;
		let y = input.y;
		let trigger = input.trigger;
		let lock = (input.left || input.right)?true:false;
		*/
		stagetime = Math.trunc((g.time() - result.time)/100);

		//g.sprite.CollisionCheck(); 
		for (let o of GObj){
			o.step(g, input);
		}

		//myship.step(g, input);
		/*
		if (true) {
			if (trig_wait < g.time()){
				trig_wait = g.time()+100;

				//let n = g.sprite.get();//空値の場合は未使用スプライトの番号を返す。
				let sp = g.sprite.itemCreate("BULLET_E", true, 4, 4);

				let r = g.time()%180+90;//player.turlet.vector();
				let px = 320 + Math.cos((Math.PI/180)*r)*8
				let py = 30 + Math.sin((Math.PI/180)*r)*8 

				sp.pos(px, py, 0, 1);
				sp.move(r, 3, 3000);// number, r, speed, lifetime//3kf 5min
				//spriteTable.push(g.sprite.get(n));
			}
		}
		*/
		/*
		//let vx = Math.cos((Math.PI/180)*player.r)*4*-y;
		//let vy = Math.sin((Math.PI/180)*player.r)*4*-y;
		let vx = 3*x;
		let vy = 3*y;

		player.x = player.x + vx;
		player.y = player.y + vy;

		if (player.x < 0)	player.x = 0;
		if (player.x > RESO_X)	player.x = RESO_X;
		if (player.y < 0)	player.y = 0;
		if (player.y > RESO_Y)	player.y = RESO_Y;

		if (!lock) player.turlet.check(player.r);
		if (vx!=0 || vy!=0) {
			player.r = player.turlet.vecToR(vx,vy);
			op = player.op;
			op.x[op.ptr] = player.x;
			op.y[op.ptr] = player.y;
			op.ptr++;
			op.ptr = op.ptr % op.x.length; 
		}
		*/
		//if (lb)	player.r-=4; 
		//if (rb)	player.r+=4;
		//test section
		//const ctx = g.systemCanvas.getContext("2d");
		//const imgdata = ctx.getImageData(player.x,player.y,1,1);
		//let st = imgdata.data;
		//player.dotpic = st;
		//GameScene.js:192  Uncaught DOMException: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.
		//Localではこれが出る模様
		//----------------/

		
		if (delay < g.time()) {

			delay = g.time()+500;
			//spriteTable = flashsp(spriteTable);

			ene.before = ene.now;
			result.clrf = false; 

			g.sprite.itemIndexRefresh();

			let ec = 0;
			let spt = g.sprite.itemList();
			for (let o of spt) if (o.id == "Enemy") ec++;

			for (let o of spt){
				if (!o.visible && o.alive==0){
					if (o.id == "BULLET_P") o.dispose();
					if (o.id == "BULLET_E") o.dispose();
				}	
			}
			
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
				//block = resetblock({on:true, break:false, hit:false});
				//for ( let i in block[24]){
				//	block[24][i].break = true;
				//}

				//ene.now = (ene.now +30>ene.max)?ene.max:ene.now +30;//ENERGY

				result.clrf = true; 
				delay = g.time()+1500;//MESSAGE WAIT
			}
			/*
			//dead
			if (!myship.spriteItem.living){
				ene.now--;
				if (ene.now >0){
					myship.spriteItem = g.sprite.itemCreate("Player", true, 28, 28);
					myship.spriteItem.pos(320,320);

					myship.x = 320; myship.y = 320;
				}
			}
			*/
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
			if (sp.id == "Player" || sp.id == "FRIEND_P" || sp.id == "ARMOR_P"){

				//for (let i=0; i<=0; i++){
				//let c = g.sprite.check(i);//対象のSpriteに衝突しているSpriteNoを返す
				let c = sp.hit;//戻りは衝突オブジェクトのリスト
				for (let lp in c) {
					let spitem = c[lp];//SpNo指定の場合は、SpriteItem
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
							sp.mode = Math.pow(2,(spitem.mode-1));
						}
						spitem.dispose();
						//spitem.vx = spitem.x - myship.x//vx*-1;//.05;
						//spitem.vy = spitem.y - myship.y//spitem.vy*-1;//.05;
	//					console.log("h" + spitem.id);
						//stageCtrl.mapDamage(sp);
						//sp.dispose();
					}
				}
					/*
					if (spitem.id == "block"){
						spitem.vx = spitem.x - myship.x//vx*-1;//.05;
						spitem.vy = spitem.y - myship.y//spitem.vy*-1;//.05;
						ene.now -=7; 
					}
					*/
					//ene.now--;
				
			}
			if (sp.id == "Enemy"){
				let c = sp.hit;
				for (let lp in c) {
					let spitem = c[lp];//SpNo指定の場合は、SpriteItem
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

			if (sp.id == "POWERUP"){
				let c = sp.hit;
				for (let lp in c) {
					let spitem = c[lp];//SpNo指定の場合は、SpriteItem
					if (spitem.id == "BULLET_P"){
						sp.mode++
						if (sp.mode>3)  sp.mode = 0;
						spitem.dispose();
					}
				}
			}
		}
		spriteTable = flashsp(g.sprite.itemList());
		function flashsp(s){
			let ar = new Array(0);
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
				if (p.visible) ar.push(s[i]);
			}
			return ar;
		}
		//spriteTable = g.sprite.itemList();
		//---------------------breakcheck(block sprite hit check

		stageCtrl.step(g, input, result);
		/*
		for (let i in spriteTable){
			let p = spriteTable[i];

			let cx = Math.trunc(p.x/8);
			let cy = Math.trunc(p.y/8);
			if (cy < block.length){
				if (cx < block[cy].length){
					if (block[cy][cx].on){
						if (p.id == "Enemy"){
							block[cy][cx].hp--;
							if (block[cy][cx].hp < 0){
								block[cy][cx].on = false;
								block[cy][cx].break = true;
								block[cy][cx].hit = true;
							}
							p.dispose();
							
							/*
							if (p.beforehit){
								p.vx = p.vx*-1;//.05
								p.vy = p.vy*-1;//.05;
							}else{
								if (Math.abs(p.vx) >= Math.abs(p.vy)) p.vx = p.vx*-1;//.05
								if (Math.abs(p.vx) <= Math.abs(p.vy)) p.vy = p.vy*-1;//.05;
							}
							p.beforehit = true;
							*/
							/*
							result.score ++;
						}else{
							if (p.id == "block"){
								if (cy>=1){
									block[cy-1][cx].on = true;
									block[cy-1][cx].break = false;
									//this._bhtm[cy-1][cx] = false;
									p.dispose();
								}
							}
						}
					}else{
						p.beforehit = false;
					}
				}
			}
		}
		*/
		//-scan
		/*
		let f = false;
		c = []; 
		for (let i=0; i<ROW; i++){
			for (let j=COL-1; j>=0; j--){
				if (block[j][i].on){
						if (!f){
							c.push({x:i,y:j});
						}
						f = true;
					}else{
						//this._block.break[j][i] = true;		
						f = false;
					continue;
				}	
			}
		}
		*/
		/*
		for (let i in c){
			if (!this._block.break[c[i].y][c[i].x]){
				this._block.break[c[i].y][c[i].x] = true;
			}else{
				delete c[i];
			}
		}
		*/
		/*
		for (let i in c){
			if (!block[c[i].y][c[i].x].break){
				block[c[i].y][c[i].x].break = true;
				block[c[i].y][c[i].x].on = false;
				//let n = g.sprite.get();//空値の場合は未使用スプライトの番号を返す。
				let sp = g.sprite.itemCreate("block", true, 15, 15);
				sp.pos(c[i].x*16, c[i].y*16+16);
				sp.move(180, 4, 500);// number, r, speed, lifetime
				//spriteTable.push(g.sprite.get(n));
			}
		}
		*/
		watchdog.run();
	}

	//==========
	//Draw 
	this.draw = function(g){

		let wdt = watchdog.check();

		stageCtrl.draw(g);

		/*
		let l = (Math.trunc(g.time()/100)%2);
		blkcnt = 0;
		for (let j=0; j<ROW; j++){
			for (let i=0; i<COL; i++){
				if (block[j][i].on){
					if (block[j][i].hp != 0){
						g.screen[0].fill(i*8,j*8,7,7,"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",128)");
					}else{
						g.screen[0].fill(i*8+1,j*8+1,5,5,"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",255)");
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
				/*
				if (block[j][i].hit){
					if (l==0){
						g.screen[0].fill(i*8+4,j*8+4,2,1,"rgb(" + (i*8)%64+128 + "," + (j*8)%64+128 + ",127)");
					}else{
						g.screen[0].fill(i*8+4,j*8+4,1,1,"rgb(" + (i*8)%64+128 + "," + (j*8)%64+128 + ",127)");
					}
					//g.screen[0].fill(i*32+14,j*32+2,4,2,"rgb(" + (i*8)%64+128 + "," + (j*8)%64+128 + ",127)");
				}
				
			}
		}

		/*
		spriteTable = g.sprite.itemList();
		for (let i in spriteTable){
			let p = spriteTable[i];
			if (p.id == "block"){
				g.screen[0].fill(p.x,p.y-16,15,12,"white");
				g.screen[0].fill(p.x+1,p.y-15,13,10,"rgb(" + (Math.trunc(p.x/32)*8)%256 + "," + (Math.trunc((p.y-32)/32)*8)%256 + ",255)");
			}
		}
		*/
		if (!result.govf){

			for (let o of GObj){
				o.draw(g);
			}
				//myship.draw(g);

			/*
			for (let i=0; i < player.op.x.length - 5; i+=10){
				let op = player.op;
				g.screen[0].fill(
					op.x[(op.ptr + i) % op.x.length]-3,
					op.y[(op.ptr + i) % op.x.length]-3,7,7,"gray"
				);
			}	
			let op = player.op;
			g.screen[0].fill(
				op.x[(op.ptr) % op.x.length]-8,
				op.y[(op.ptr) % op.x.length]-8,15,15,"white"
			);

			myship.spriteItem.pos(player.x, player.y, (player.r+90)% 360, 1);
			myship.spriteItem.view();
			g.screen[0].fill(player.x-15, player.y-15,30,30,"orange");

			let w = {x:player.x, y:player.y, c:"blue", r:player.r
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
			
			w = {x:player.x, y:player.y, c:((ene.now/ene.max)<0.2)?"red":"yellow", r:player.turlet.vector()
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
			//g.kanji.print(player.dotpic, player.x, player.y);
			//console.log("array:" + player.dotpic);
			*/
		}
		/*
		if (wdt){//watchdog.check()){
			if ((ene.now != ene.before)&&(ene.now >0)){
				let w = {x:player.x, y:player.y, c:((ene.now/ene.max)<0.2)?"red":"yellow"
					, draw(dev){
						dev.beginPath();
						dev.strokeStyle = this.c;
						dev.lineWidth = 2;
						dev.arc(this.x, this.y, 32, 0, 2 * Math.PI, false);
						dev.stroke();
					} 
				}
				g.screen[0].putFunc(w);
				//g.screen[0].fill(this._x-32, this._y-32, 64 ,64,"yellow");
			}
		}
		*/
		//g.screen[0].fill(player.x, player.y, 32,32,(watchdog.check())?"cyan":"red");

		/*
		//　DEBUG DRAW 
		let p = g.sprite.itemList();
		for (let i in p){
			
			g.screen[0].fill(
				p[i].x - p[i].collision.w/2
				, p[i].y - p[i].collision.h/2 
				, p[i].collision.w
				, p[i].collision.h
				,"green"
			);
			

			g.font["std"].putchr(p[i].id,p[i].x, p[i].y);
			let st = ((p[i].living)?"L":"-") 
			if (p[i].visible) st += " A:" + p[i].alive;

			g.font["std"].putchr(st,p[i].x, p[i].y+8);
		}
		*/
		watchdog.set();
	}
}