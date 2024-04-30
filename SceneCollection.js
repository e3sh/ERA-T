//----------------------------------------------------------------------
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
	
		let st="";for (let i=1; i<ene.now;i++)st+="A";
		g.font["std"].putchr("PLAYER:" + st, X, Y);
		g.font["std"].putchr("STAGE :" + result.stage + " SCORE:" + Math.trunc(result.score),  X, Y+8);
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

		g.font["std"].putchr("STAGE CLEAR", X-100, Y-300, 3);
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
		,"[得点/300 ] 得点300点 (Extend5000点)"
		,"[正面/FWD ] 正面追加装甲"
		,"[側面/SIDE] 側面追加装甲"
		,"[子機/ OPT] ターレット(1台目OPTION/以降 設置型)"
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

		g.font["std"	].putchr("GAME OVER",		 X-100, Y-280,4	);
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
//----------------------------------------------------------------------
// VGPadScene(I/Ostatus)
function SceneVGPad(){

	const X = 0;
	const Y = 0;

	let st;

	this.step = function(g, i, p){

		let s = g.vgamepad.check();

		st = [];

		st.push("state button:" + s.button);
		st.push("state deg   :" + s.deg);
		st.push("state distance:" + s.distance);
	}
	this.draw = function(g){

		g.vgamepad.draw(g.screen[0]);

        let cl = {};
        cl.draw = function(device){
            device.globalAlpha = 1.0;
		}
		g.screen[0].putFunc(cl);

		for (let i in st){
		//	g.font["8x8white"].putchr(st[i],X, Y+i*8);
		}
	}
}
