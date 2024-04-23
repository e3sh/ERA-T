//----------------------------------------------------------------------
//Scene
//----------------------------------------------------------------------
// GameMain
function SceneGame(){

	const RESO_X = 640;
	const RESO_Y = 480-16;

	let GObj;
	let spriteTable;
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
			//result.clrf = false; 

			g.sprite.itemIndexRefresh();

			let ec = 0;
			let spt = g.sprite.itemList();
			for (let o of spt) if (o.id == "Enemy") ec++;

			if (!myship.spriteItem.living){//dead

				ene.now--;
				if (ene.now >0){
					myship.spriteItem = g.sprite.itemCreate("Player", true, 28, 28);
					myship.spriteItem.pos(320,320);

					myship.x = 320; myship.y = 320;
				}
			}

			if (result.score > (ene.max-2)*5000){//extend
				//extend message
				const msg = g.sprite.itemCreate("BULLET_P", false, 1, 1);
				msg.priority = 5;
				msg.normalDrawEnable = false;
				msg.customDraw = function(g, screen){
					let x = Math.trunc(this.x-28);
					let y = Math.trunc(this.y);
					screen.fill(x,y,48,8,"Black");
					g.kanji.print("Extend.", x, y); 
				};
				msg.pos(myship.x, myship.y);
				msg.move(0, 1, 45);

				ene.now++; 
				ene.max++;
			}

			if (ec == 0){ //(blkcnt <=0){ //Stage Clear;
				if (result.clrf){

					//TimeBonus
					//let b = (10000-(g.time()-result.time));
					//result.score += (b < 0)?100: b+100;//SCORE
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
				}else{
					result.clrf = true; 
					delay = g.time()+3000;//MESSAGE WAIT
				}
			}else{
				result.clrf = false; 
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
						if (spitem.mode == 3){//Option(Mine)
							
							if (sp.linkedOption){ 
								let opt = new GameObj_Mine();
								opt.spriteItem = g.sprite.itemCreate("FRIEND_P", true, 24, 24);
								opt.spriteItem.pos(sp.x,sp.y);
								opt.init(g);
								GObj.push(opt);
							}
						}

						result.score += ((spitem.mode ==0)?300:0);
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
						result.score +=10;
						break;//複数弾同時弾着でパワーアップが複数出てしまうので１回出たらLOOPをBreak;
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
					//if (spitem.id == "BULLET_P3") continue;//Option用玉の場合貫通(強くなりすぎるから戻し)
					if (spitem.id.substring(0,7) == "BULLET_"){
						sp.mode++;
						if (sp.mode>4)  sp.mode = 0;

						sp.x -= (spitem.x - sp.x)/5;
						sp.y -= (spitem.y - sp.y)/5;
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
}