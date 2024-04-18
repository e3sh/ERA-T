// ----------------------------------------------------------------------
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
}