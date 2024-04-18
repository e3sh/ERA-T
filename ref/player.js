// シナリオ
//　scenario processor version Javascript
//　各オブジェクトの行動を指定するリスト。
//

// 本シナリオ内にtutorialmessageを表示させる処理あり(202024/03/26)
// 使ってないitem No.のアイテム取得をメッセージ表示のトリガーにしている。
// get_item(0) 操作説明
// get_item(1) 魔法陣について
// get_item(2) 扉について
// get_item(4) 武器の強化について
// get_item(5) レベルアップについて
// get_item(7) スピードアップについて
// get_item(8) オプションについて
// 定義ファイルはtutorialCommentTable.js
// Item関係ないメッセージで使用可能IDは0-14

// 自機の動作に関するシナリオ
function sce_player( gObjc ) {

    const SHIELD_TIME_BASE = 300;
    let SHIELD_TIME = SHIELD_TIME_BASE;
    const TRIG_WAIT = 20;

    let op = {
        ptr: 0,
        x: Array(40),
        y: Array(40)
    }
    /*
    const wpn = {
        0:{ch:6,sce:"common_vset8"    },//wand
        1:{ch:10,sce:"friend_rotate"    },//sword
        2:{ch:38,sce:"friend_rotate_full"   },//axe
        3:{ch:37,sce:"friend_boom"          },//boom
        4:{ch:36,sce:"friend_straight"          },//spear
        5:{ch:46,sce:"common_vset10"          } //arrow
    }
    */
    const weaponlist = [
        {no: 0,chr:15, name:"rod"  ,auto: false },
        {no: 1,chr:16, name:"sword",auto: true },
        {no: 2,chr:17, name:"axe"  ,auto: true },
        {no: 3,chr:19, name:"spear",auto: true },
        {no: 4,chr:18, name:"boom" ,auto: true },
        {no: 5,chr:50, name:"bow"  ,auto: true }
    ];

    function turlet_vec_check(SEP){
        //separate 分割数
        if (!Boolean(SEP)) SEP = 16;
        //turlet check
        /*
        let turVector = [];
        for (let i=0; i<16; i++){
            turVector[i] = 22.5*i;
        }
        */
        let turlet = 0;
        let now = 0;

        let D0 = SEP*0;
        let D3 = SEP*0.25;
        let D6 = SEP*0.5;
        let D9 = SEP*0.75;

        this.check = function(key){

            //now++;
            //if (now%6!=0) return;

            if (key.up){
                if (turlet != D0){
                        if ((turlet > D3) && (turlet < D9) && (turlet != D0)) {
                            turlet = D0;
                    }else{
                        if (turlet >= D9) {
                            if (turlet < SEP) turlet++;}
                        if (turlet <= D3) { 
                            if (turlet > D0) turlet--;}
                        //turlet = turlet%SEP;
                    }
                } 
            }
            if (key.right){
                if (turlet != D3){
                    if (turlet > D6) {
                        turlet= D3;
                    } else {
                        if ((turlet <= D6) && (turlet >D3)) turlet--;
                        if (turlet < D3)  turlet++;
                    }
                }
            }  
            if (key.down){
                if (turlet != D6){
                    if (turlet > D9 || turlet < D3) {
                        turlet= D6;
                    }else{
                        if ((turlet >= D3) && (turlet < D6)) turlet++;
                        if ((turlet > D6) && (turlet <=D9 ))  turlet--;
                    }
                }
            } 
            if (key.left){
                if (turlet != D9){
                    if ((turlet < D6) && (turlet !=D0)) {
                        turlet= D9;
                    } else {
                        if ((turlet >= D6) && (turlet <D9)) turlet++;
                        if ((turlet > D9) || (turlet == D0)) {
                            if (turlet == D0) turlet = SEP;
                            turlet--;
                        }
                    }
                }
            }

            if ((key.up)&&(key.right))  { turlet = SEP*(  0+0.125);} 
            if ((key.up)&&(key.left))   { turlet = SEP*(  1-0.125);}
            if ((key.down)&&(key.right)){ turlet = SEP*(0.5-0.125);}
            if ((key.down)&&(key.left)) { turlet = SEP*(0.5+0.125);}
            /*
            if (Math.abs(turlet - now)>3) {
                turlet = now%16;
            } else {
                if (turlet > now){
                    turlet = turlet -1;
                    if (turlet < 0) turlet = 15;
                }
                if (turlet < now) turlet = turlet +1;
                turlet = turlet%16;
            }
            */
        }
        this.vector = function(){
            return turlet * (360/SEP);//turVector[turlet];
        }
        this.num = function(){
            let w = "S:" + SEP + ".0:" + D0 + ".3:" + D3 + ".6:" + D6 + ".9:" + D9;    
            
            
            return turlet + "." + w;}//debug

    }

    let delay_st;
    let lvupf;
    let stageclrf;

	function get_weapon_check( o ){

        let player = o.gameState.player;
        let wtut = [];//武器チュートリアル実施回数チェックwork
        let wtuc=0;
        /*
		let weaponlist = [
			{no: 0,chr:15, name:"rod"  },
			{no: 1,chr:16, name:"sword"},
			{no: 2,chr:17, name:"axe"  },
			{no: 3,chr:19, name:"spear"},
			{no: 4,chr:18, name:"boom" },
			{no: 5,chr:50, name:"bow"  }
		];
        */
		this.check = checksub;

		function checksub(){

            if (wtut.length > 5) wtuc++;
            if (wtuc>3) {gObjc.tutTable(11); wtuc=0; wtut=[];}//Ctrlキーの説明

			let execute = false;

            if (!Boolean(player.stack)) return execute;
            if (player.stack.length > 0){
                let w = player.stack.pop();

                for (let p of weaponlist){
                    if (w.ch == p.chr) {
                        if (o.item[p.chr] > 0) o.item[p.chr]--;

                        if (player.weapon == p.no){
                            wtut[p.no] = true;
                            if ( p.name  == "rod" ) {
                                if (Boolean(o.item[20])){
                                    o.item[20] += 7;
                                }else{
                                    o.item[20] = 7;
                                }
                                }//get ball
                            else {
                                player.level++;
                                if (!Boolean(o.item[4])){//<-tutorialCommentTable
                                    //if (player.level > 0) 
                                    o.get_item(4);//武器の強化の説明
                                    wtut[4] = true;
                                }
                            }
                        }else{
                            player.level = w.id;
                        }
                        player.weapon = p.no;
                        execute = true;
                    } else {
                        execute = false;
                    }
                }
            }
            return execute;
		}
	}

    let hpbbw; //hp bar before width
    let portalwarp = { vx:0, vy:0, cnt:0 };

    // 自機の移動　====
    //-----------------------------------------------------------------------
    this.init = function (scrn, o) {
        o.name = "mayura";

        o.triger = 10;//Zkey Lockwait Counter
        o.shot = 0; //Zkey trig ok:0 ng:1
        o.trigerSub = 10; //Xkey Lockwait Counter
        o.shotSub = 0; //Xkey trig ok:0 ng:1
        o.autotrig = 10;//AutoWeapon wait counter
        o.autoshot = 0;//Autowapon trig ok:0 ng:1

        o.jump = 0;
        o.jpcount = 40;
        o.jpvec = -8;//-8;

        o.shiftx = 0;
        o.shifty = 0;//-200;

        o.mvkeytrig = 0;        
        o.maxspeed = 4;
        //o.int_shot = 0;
        //	        o.mp = 1;
        o.custom_draw_enable = true;

        o.gt.viewpos(o.x - o.gt.viewwidth / 2, o.y - o.gt.viewheight / 2);

        //o.display_size = 1.5;

        o.old_x = o.x;
        o.old_y = o.y;

        o.hp = o.gameState.player.hp;
        o.maxhp = o.gameState.player.maxhp;
        o.barrier = o.gameState.player.barrier;

        o.before_hp = o.hp;
        o.before_weapon = o.gameState.player.weapon;
        o.before_wlevel = o.gameState.player.level;

        if (!Boolean(o.gameState.player.stack)) o.gameState.player.stack = [];

        o.lighton = false;//true;

        o.doorflag = false;
        o.turndoorkey = false;
        o.homeflag = false;
        o.portalflag = false;
        o.warptime = o.alive;

        o.startx = o.x;
        o.starty = o.y;

        o.turlet = new turlet_vec_check(180);

        o.repro = false;//Option出力済みf
        o.w_repro = false;//Wand用

        o.getweapon = new get_weapon_check( o );

        gObjc.keyitem_enhance_check(); 
        o.spec = o.gameState.player.spec;

        o.spec.LV = o.gameState.player.level;
        o.spec.HP = o.gameState.player.maxhp;

        /*
        o.spec.STR = o.gameState.player.spec.STR;
        o.spec.DEX = o.gameState.player.spec.DEX;
        o.spec.VIT = o.gameState.player.spec.VIT;
        o.spec.INT = o.gameState.player.spec.INT;
        o.spec.MND = o.gameState.player.spec.MND;
        o.spec.ETC = o.gameState.player.spec.ETC;
        */
        //o.gameState.player.spec = o.spec;
    
        SHIELD_TIME = SHIELD_TIME_BASE + o.spec.VIT*30; //0.5s(30f)

        //o.spec.VIT = 0; //HPrecover+ : init 3 +
        //o.spec.INT = 0, //BombPower+ : init -10
        //o.spec.MND = 0, //ShieldTime+: init 300flame(5s) +

        lvupf = false;
        stageclrf = false;
        hpbbw = Math.trunc((o.gameState.player.hp / o.gameState.player.maxhp)*32);

        ws_charge_t = o.alive;
        ws_charge_c = -2; 

        op.ptr = 0;
        op.x.fill(o.x);
        op.y.fill(o.y);

        //残機無限増やしの抑制の為、ExtendItemを状況により消す。
        if (o.gameState.player.zanki >= Math.floor(o.gameState.nowstage / 5) + 2) {
            o.bomb4(21); //Extendのステータスを0にする。
        }
        o.set_object(100);//InformationCursorSetup

        o.get_item(0);//オープニング説明実施

        o.frame = SHIELD_TIME;
    }

    this.draw = damage_gr1;

    this.move = function (scrn, o) {

        let powup = 0;
        let oneup = 0;
        let keyget = 0;

        for (let i in o.item) {
            if (i == 20) powup  = o.item[i];
            if (i == 21) oneup  = o.item[i];
            if (i == 22) keyget = o.item[i];
        }

        o.frame+= o.vecfrm;

        let SPEC_SPEED = 4.0 + ((powup>40)?2.0:(powup/20));
        o.maxspeed = SPEC_SPEED;//通常時の移動速度
        if (!Boolean(o.item[7])) {
            if (SPEC_SPEED > 4.5) o.get_item(7);//オプションの説明
        }

        if (o.frame <= SHIELD_TIME) {
            o.hp = o.maxhp; //出現して5秒間は無敵(60fps)
            o.attack = 10;
            o.gameState.player.barrier = true;
            o.gameState.player.shieldtime = Math.trunc(((SHIELD_TIME - o.frame)/SHIELD_TIME)*100);
            o.lighton = true;
            //    o.damageflag = false;
            if (o.gameState.player.weapon !=0 ) o.maxspeed = SPEC_SPEED-1.5;//4.5;//SHIELD中はスピードダウン/RODでは減速無し
        }
        if ((o.frame > SHIELD_TIME) && o.gameState.player.barrier) {
            //無敵時間終わったら瞬間に元に戻す
            o.hp = o.before_hp;
            o.attack = 1;
            o.gameState.player.hp = o.before_hp;
            o.gameState.player.barrier = false;
            o.gameState.player.shieldtime = 0;
            o.lighton = false;
        }

        if (o.jump == 0) o.vset(0);
        let speed = 0;
        
        let upkey = o.entrypadaxis.up;
        let downkey = o.entrypadaxis.down;
        let leftkey = o.entrypadaxis.left;
        let rightkey = o.entrypadaxis.right;

        if (leftkey)  o.vector = 270;
        if (upkey)    o.vector = 0;
        if (rightkey) o.vector = 90;
        if (downkey)  o.vector = 180;

        if (upkey   && leftkey)  o.vector = 360 - 45;//315
        if (upkey   && rightkey) o.vector =   0 + 45;//45
        if (downkey && leftkey)  o.vector = 180 + 45;//225
        if (downkey && rightkey) o.vector = 180 - 45;//135

        if (upkey || downkey || leftkey || rightkey) {
            //加速制御
            //動き始め(15f[0.25s]はゆっくりとなるように(手触り感調整)
            //o.mvkeytrig++;
            //if (v != o.vector) o.mvkeytrig = 12; //入力方向が変わったあとの加速まで 3fwait　0.05s
            o.mvkeytrig = (o.mvkeytrig + o.vecfrm > 30)?30 : o.mvkeytrig + o.vecfrm; // keyoff後の加速維持動作入力猶予0.25s
            //speed = (o.mvkeytrig/4 > o.maxspeed)? o.maxspeed: o.mvkeytrig/5;
            //speed = (o.mvkeytrig > 8)? o.maxspeed: o.maxspeed * (o.mvkeytrig/8);
            speed = (o.mvkeytrig > 15)? o.maxspeed: 1; //加速始動時　15fwait　0.25s
            //if (v != o.vector) o.mvkeytrig=0;
            
            //speed = o.maxspeed;
            if (o.jump == 0) o.vset(speed);

            let ctrlkey = false;
            if (Boolean(o.key_state[17])) { if (o.key_state[17]) ctrlkey = true; gObjc.tutTable(11);} //ctrlkey

            if (!ctrlkey) o.turlet.check(o.entrypadaxis);//Ctrl入力中はターレット固定
        }else{
            o.mvkeytrig-= o.vecfrm;
            o.mvkeytrig = (o.mvkeytrig-o.vecfrm < 0)?0 : o.mvkeytrig;
        }

        if (o.vector > 180) { o.mp = 2; } else { o.mp = 1; }

        let zkey = false;
        if (Boolean(o.key_state[90])) { if (o.key_state[90]) zkey = true; }
        if (Boolean(o.key_state[32])) { if (o.key_state[32]) zkey = true; } //spacebar

        let xkey = false;
        if (Boolean(o.key_state[88])) { if (o.key_state[88]) xkey = true; }

        //let ctrlkey = false;
        //if (Boolean(o.key_state[17])) { if (o.key_state[17]) ctrlkey = true; } //ctrlkey
        
        let ckey = false;
        if (Boolean(o.key_state[67])) { if (o.key_state[67]) ckey = true; }
        
        let hkey = false;//Debug Help action test 
        if (Boolean(o.key_state[72])) { if (o.key_state[72]) hkey = true; }

        let esckey = false;
        if (Boolean(o.key_state[27])) { if (o.key_state[27]) esckey = true; }

        //トリガーの入力間隔WAIT
        o.triger-= o.vecfrm;
        if ((o.triger <= 0) && (!zkey)) {
            o.shot = 0;
            o.triger = 5;
        }

        o.trigerSub-= o.vecfrm;
        if ((o.trigerSub <= 0) && (!xkey)) {
            o.shotSub = 0;
            o.trigerSub = 5;
        }

        o.autotrig-= o.vecfrm;
        if (o.autotrig <= 0) {
            o.autoshot = 0;
            o.autotrig = 5;
        }

        if (zkey) {
            if (o.shot == 0) {
                o.shot = 1;

                o.sound.effect(7); //スイング音
                o.triger = 15;
                let t = o.vector;
                o.vector = o.turlet.vector(); 

                switch (o.gameState.player.weapon) {
                    case 0:
                        o.set_object(39); //wand
                        if ((powup > 0) || (o.config.shotfree)) {
                            o.set_object(6);//直進弾
                            o.set_object(7);//回転弾
                            o.item[20]--;
                            if (o.item[20] < 0) o.item[20] = 0;

                            o.triger = TRIG_WAIT;
                        }
                        //break;
                        
                    //case 1:
                        //o.set_object(10); //sword
                        //break;
                    //case 2:
                        //o.set_object(38); //spare
                        //break;
                    //case 3:
                        //let t = o.vector;
                        //o.vector = o.turlet.vector(); 
                        //o.set_object(37); //boom
                        //t = o.vector;
                        //o.triger = 180 /(o.gameState.player.level + 1);
                        //o.triger = TRIG_WAIT;
                        //break;
                    //case 4:
                        //o.set_object(36); //axe
                        //break;
                    default://自動攻撃の武器使用時はショットボタンは画面内アイテム回収/玉消費
                        if ((powup > 0) || (o.config.shotfree)) {
                            o.collect2();
                            o.item[20]--;
                            if (o.item[20] < 0) o.item[20] = 0;

                            o.triger = TRIG_WAIT;
                        }
                    break;   
                }
                t = o.vector;
            }
        }

        if (xkey) {
            if (o.shotSub == 0) {
                o.shotSub = 1;
                if (o.itemstack.length > 0) {
                    let w = o.itemstack.pop();

                    if (w == 23) {　//BOMB
                        o.sound.effect(13);
                        o.bomb3(o.spec.INT*2);
                        o.set_object_ex(6, o.x, o.y, 0, 47); //Bomb爆発演出(赤)
                        o.item[23]--;
                    }

                    if (w == 24) {　//SHIELD
                        o.sound.effect(10);
                        if (!o.gameState.player.barrier) o.before_hp = o.hp;

                        SHIELD_TIME = SHIELD_TIME_BASE + o.spec.VIT*30;
                        o.frame = 0;
                        o.item[24]--;
                    }

                    if (w == 25) {　//LIFE
                        let rhp = 3 + o.spec.MND;

                        o.sound.effect(10);
                        if (o.frame <= SHIELD_TIME) {
                            o.before_hp += rhp;
                            o.maxhp++;

                            if (o.before_hp > o.maxhp) o.before_hp = o.maxhp;

                            o.gameState.player.hp = o.before_hp;
                        } else {
                            let rhp = 3 + o.spec.MND;

                            o.hp += rhp;//3+MND;
                            o.maxhp++;

                            if (o.hp > o.maxhp) o.hp = o.maxhp;

                            o.gameState.player.hp = o.hp;
                        }
                        o.gameState.player.maxhp = o.maxhp;
                        o.spec.HP = o.maxhp;
                        o.item[25]--;
                        o.set_object_ex(20, o.x, o.y, 0, 43, "+"+rhp );
                    }

                    o.trigerSub = TRIG_WAIT;
                }
            }
        }
        
        if (ckey) { //Jump
            if (o.shot == 0 && o.jump == 0) {
                o.shot = 1;

                o.jump = 1;
                o.jpcount = 40;
                o.jpvec = -5.6 - 0.4 * o.vecfrm;;
                o.colcheck = false;

                o.triger = TRIG_WAIT;
            }
            
        }
        
        if (hkey) {
            if (o.shot == 0){
                o.shot = 1;

                if (!gObjc.ceilflag){//inTheWall HELP mode
                    if (o.item[35]<10) o.item[35] += 10;
                    o.portalflag = true;
                }else{
                    o.set_object_ex(20, o.x, o.y, 0, 43, "Hi!" );
                    //helomode none
                }
                o.triger = TRIG_WAIT;
                gObjc.tutTable(12);//当キーの説明
            }
        }
        
        if (esckey) {
            if (o.shot == 0) {
                o.shot = 1;
                o.SIGNAL(1); //pause
                o.triger = TRIG_WAIT;
            }
        }

        if (o.jump == 1){
            //o.autoshot = 1;//Jump中、攻撃抑止
            o.jpcount--;
            o.shifty = o.shifty + o.jpvec;
            o.jpvec = o.jpvec + 0.4 * o.vecfrm;
            o.prioritySurface = true;
            if (o.shifty > 0){
                o.jump = 0;
                o.shifty = 0;
                o.prioritySurface = false;
                o.colcheck = true;
            }
        }

        //AutoWeapon
        //o.vset(4);
        if ((o.autoshot == 0) && (weaponlist[o.gameState.player.weapon].auto)) {
//          if (o.gameState.player.weapon !=0 ) {
            o.autoshot = 1;
            //o.collect3();
            //o.sound.effect(7); //スイング音
            let wdelay = ((o.gameState.player.level >3 )? 3 : o.gameState.player.level)*4;
            // lv.0 20 0.3s /lv.1 16 0.25s /lv.2 12 0.2s /lv.3 08 0.12s(Max)
            o.autotrig = 20 -wdelay;//20 0.3s
            //o.set_object_ex(20, o.x, o.y, 0, 43, o.gameState.player.weapon + "_");
            let t = o.vector;
            o.vector = o.turlet.vector();
            switch (o.gameState.player.weapon) {
                case 1:
                    o.set_object(10); //sword
                    //o.autotrig = 30;
                    break;
                case 2:
                    o.set_object(38); //axe
                    //o.autotrig = 30;
                    break;
                case 3:
                    o.set_object(37); //boom
                    //o.autotrig = 240 /(o.gameState.player.level + 1);
                    //o.autotrig = 30;
                    break;
                case 4:
                    o.set_object(36); //spare
                    //o.autotrig = 30;
                    break;
                case 5:
                    //let t = o.vector;
                    //o.vector = o.turlet.vector();
                    o.set_object_ex(46, o.x, o.y + o.shifty , o.vector - 10, "common_vset10");
                    o.set_object_ex(46, o.x, o.y + o.shifty , o.vector, "common_vset10");
                    o.set_object_ex(46, o.x, o.y + o.shifty , o.vector + 10, "common_vset10");
                    //o.set_object(46)
                    o.set_object(47); //Bow and Arrow
                    //o.vector = t;
                    //o.autotrig = 30;
                    break;
                default:
                    //if (o.alive > ws_charge_t){
                    //    ws_charge_t = o.alive + 5000; //5s;
                    //    if (ws_charge_c < 3) ws_charge_c++;
                    //}
                    /*
                    if ((powup > 0) || (o.config.shotfree)) {
                        if ((ws_charge_c>0)&&(!o.w_repro)){
                            o.set_object(6);//pl_bullet_rotate_circle"
                            o.item[20]--;
                            if (o.item[20] < 0) o.item[20] = 0;
                            //o.w_repro = true;
                            ws_charge_c--;
                            o.set_object(39); //wand
                        }
                    }
                    */
                    break;
            }
            o.vector = t;
            /*
            if (o.alive > ws_charge_t){
                ws_charge_t = o.alive + 5000; //5s;
                if (ws_charge_c < 3) ws_charge_c++;
            }
            */
        }
        
        //武器取得チェック(武器用スタックに何かあるか)
        o.getweapon.check();

        //武器持ち替え
        if (o.gameState.player.weapon != o.before_weapon) {

            let ww = [15, 16, 17, 19, 18, 50];

            let w = ww[o.before_weapon];
            let wv = ((o.vector + (o.before_weapon - 2)*18) + 180) % 360;
            //置いたときに重ならないように角度を変える

            this.set_object_ex(w,
                    o.x + o.Cos(wv) * 30,
                    o.y + o.Sin(wv) * 30,
                    wv, 38//"common_vset0"
                    ,o.before_wlevel 
            );

            o.before_weapon = o.gameState.player.weapon;
            o.spec.LV = o.gameState.player.level;
            //o.before_wlevel = o.gameState.player.level;
            o.autotrig = 5;//持ち替えた場合にwaitなしに
        }
        o.before_wlevel = o.gameState.player.level;
        
        //Damege表示
        if (o.damageflag) {
            if (o.frame > SHIELD_TIME) {
                o.set_object_ex(20, o.x, o.y, 0, 42, "-" + o.damage.no);
                o.gameState.player.hp = o.hp;
                o.set_object_ex(6, o.x, o.y, o.vector, "effect_hit");
            }else{
                o.set_object_ex(6, o.x, o.y, o.vector, "effect_hit_shield");
            }
            o.damage.count = 15;

            //effect_hit_shield
            //o.gameState.player.hp = o.hp;
        }

        let wvec = this.vector;
        let wvx = this.vx;
        let wvy = this.vy;

        if (o.damage.count > 0) {
            o.damage.count--;
            o.vector = (o.damage.vector + 180) % 360;

            o.vset(this.damage.dist / 10);
        }

        o.damageflag = false;

        if (o.warptime > o.alive) o.mapCollision = false;

        // 移動処理
        if (!o.mapCollision) {
            o.old_x = o.x;
            o.old_y = o.y;
            //o.x += o.vx;  o.y += o.vy;
            o.x += (o.vx * o.vecfrm);  o.y += (o.vy * o.vecfrm);

            if ((o.x == o.old_x)&&(o.y == o.old_y)){}else{
                op.x[op.ptr] = o.x;
                op.y[op.ptr] = o.y + o.shifty;
                op.ptr++;
                op.ptr = op.ptr % op.x.length; 
            }
            //let w = o.gt.worldtoWorld(o.x, o.y);
            //o.x = w.x;  o.y = w.y;

        } else {
            o.x = o.old_x;
            o.y = o.old_y;
        }

        //視点変更処理（自機以外では基本的に発生しない）(演出では使えるかもしれない）
        let w = o.gt.worldtoView(o.x, o.y);

        // view shift
        let sx = o.gt.world_x;
        let sy = o.gt.world_y;

        if ((o.gt.viewwidth/2) - (w.x - w.sx) > 120 ){ sx = o.x  - (o.gt.viewwidth/2) + 120;}
        if ((o.gt.viewwidth/2) - (w.x - w.sx) < -120){ sx = o.x  - (o.gt.viewwidth/2) - 120;}
        if ((o.gt.viewheight/2) - (w.y - w.sy) > 50){ sy = o.y  - (o.gt.viewheight/2) + 50;}
        if ((o.gt.viewheight/2) - (w.y - w.sy) < -50){sy = o.y  - (o.gt.viewheight/2)  - 50;}

        if (!o.gt.in_view(o.x, o.y)){
           if (o.x != o.old_x) sx = o.x - o.gt.viewwidth/2;
           if (o.y != o.old_y) sy = o.y - o.gt.viewheight/2;
        }

        o.gt.viewpos(sx, sy);
        //

        o.vector = wvec;
        o.vx = wvx;
        o.vy = wvy;

        //Door in (StageClear)
        if (!stageclrf && !o.turndoorkey && o.doorflag && o.jump == 0) {//
            if (!Boolean(o.item[2])) o.get_item(2);//扉の説明実施
            if (keyget > 0) {
                //o.item[22] = 0;//ドアを開けたタイミングでキーを消すと入る前に倒された場合、鍵がなくなってステージクリア不可となる
                o.turndoorkey = true;//ドア開けた連絡用

                delay_st = o.alive;
            }
        }

        if (!stageclrf && o.turndoorkey && (o.alive > delay_st +100)){//0.1s wait
            //ドア開けて0.1s後にステージクリアフラグをオンにしてジャンプ
            stageclrf = true;

            o.jump = 1;
            o.jpcount = 40;
            o.jpvec = -2.8 - 0.2 * o.vecfrm;;
            o.colcheck = false;

            o.triger = TRIG_WAIT;

            delay_st = o.alive;
        }

        if (stageclrf){//DoorOpenFlag

            o.vx = Math.sign(o.startx - o.x)*2;
            o.vy = Math.sign(o.starty - o.y)*2;

            if (o.alive > delay_st +250 && o.doorflag && o.jump == 0){//0.25s
                o.item[22] = 0;//クリア時に鍵を消す
                o.gameState.player.hp = o.hp;
                /*
                o.gameState.player.spec.VIT = o.spec.VIT;
                o.gameState.player.spec.INT = o.spec.INT;
                o.gameState.player.spec.MND = o.spec.MND;
                o.gameState.player.spec.ETC = o.spec.ETC;
                */
                o.SIGNAL(835);//STAGE CLEAR
            }
        }
        o.doorflag = false;
        //LvUp (score > o.spec.MIN,VIT,INT)
        /*
        o.spec.VIT = o.gameState.player.spec.VIT;
        o.spec.INT = o.gameState.player.spec.INT;
        o.spec.MND = o.gameState.player.spec.MND;

        let total_st = o.spec.VIT + o.spec.INT + o.spec.MND; 
        */
        let lups = Math.pow(o.spec.ETC+1 , 2)* 100 ;//100, 400, 900, 1600, 2500,....
        if ((o.score >= lups)&& !lvupf && o.homeflag && o.jump==0 ){
            if (!Boolean(o.item[1])) o.get_item(1);//魔法陣の説明
            //o.set_object_ex(20, o.x, o.y, 0, 43, "Lvup");
            //o.spec.ETC++;
            o.sound.effect(14);
            delay_st = o.alive;
            //o.SIGNAL(1709);//LVUP
            lvupf = true;
            o.lighton = true;
        } else o.homeflag = false;

        if (lvupf){ //↑のLvUp検出で音を鳴らしてから0.5秒後にLvUpMenuへ
            //スコア数値の表示演出完了待ち（数字じゃなくてゲージにするか？）
            if (o.alive > delay_st +250){//0.25s
                o.spec.ETC++; 
                lvupf = false;
                o.lighton = false;
                o.set_object_ex(20, o.x, o.y, 0, 43, "Lvup");
                o.SIGNAL(1709);//LVUP
                if (!Boolean(o.item[5])){//<-tutorialCommentTable
                    if (o.spec.ETC > 2) o.get_item(5);//レベルアップの説明    
                }
            }
        }

        //PortalWarp
        if ((o.warptime <= o.alive)&&o.portalflag && o.jump==0){
            if (!Boolean(o.item[10])) o.get_item(10);//Portalの説明実施
            if (o.item[35] >= 10){
                //o.item[35] = o.item[35] - 10;
                o.item[35]--;

                o.warptime = o.alive + 1000;//ms
                o.portalflag = false;

                //o.x = o.startx;
                //o.y = o.starty;

                o.jump = 1;
                o.jpcount = 60;
                o.jpvec = -14.6;
                o.colcheck = false;

                o.triger = TRIG_WAIT;

                //portal distance
                portalwarp.vx =  o.startx - o.x;
                portalwarp.vy =  o.starty - o.y;
                portalwarp.cnt = 0;

                o.sound.effect(17);//jump音

                o.portalflag = false;
            }else{
                o.portalflag = false;
            }
        }

        if (o.warptime > o.alive){
            let n = o.warptime - o.alive;
            //if (o.item[35] > 0) o.item[35] = o.item[35] - 0.1;
            //o.item[35] = n/10;

            if ( portalwarp.cnt%5 == 0 ) o.item[35]--;
            portalwarp.cnt++;            

            //到着チェック
            /*
            let u = Math.abs(o.x - o.startx);
            let h = Math.abs(o.y - o.startx);
            if ( Math.sqrt(u * u + h * h) < 48){
                o.warptime = o.alive;
                o.portalflag = false;
                //o.jump = 0;

                o.vx = 0;
                o.vy = 0;
                /*
                o.shifty = 0;
                o.prioritySurface = false;
                o.colcheck = true;
                */
            //}else{
                
                let d = 60 - portalwarp.cnt; 
                if (d > 1){
                    o.vx = portalwarp.vx/d;
                    o.vy = portalwarp.vy/d;
                }else{
                    o.vx = (o.startx - o.x)/2;
                    o.vy = (o.starty - o.y)/2;
                }

                //portalwarp.vx -= o.vx; 
                //portalwarp.vy -= o.vy;
                portalwarp.vx =  o.startx - o.x;
                portalwarp.vy =  o.starty - o.y;
                //o.warptime = o.alive + 100;
                if (portalwarp.vx >16 && portalwarp.vy>16){
                    o.jump = 1;
                    o.colcheck = false;
                }
            //}
        }

        //option
        if ((o.item[20] >= 10) && !o.repro){
            o.set_object_ex(0, o.x, o.y, o.vector, "sce_friend_option_0");
            o.repro = true;
            if (!Boolean(o.item[8])) o.get_item(8);//オプションの説明
        }
        if (o.item[20] < 10) o.repro = false;

        let f = 0;

        if (o.status == 2) {//状態が衝突の場合

            if (o.config.itemreset) {

                //if (powup == 0) powup = 1;
                //ball
                let bn = (powup > 10) ? 10 : powup;
                for (i = 1; i <= bn; i++) {

                    this.set_object_ex(20, o.x, o.y, Math.floor(Math.random() * 360), 38);
                }

                //items
                let n = o.itemstack.length;

                if (n > 10) n = 10;

                for (i = 0; i < n; i++) {
                    let dropitem = o.itemstack.pop();
                    this.set_object_ex(dropitem, o.x, o.y, Math.floor(Math.random() * 360), 38);
                }

                if (keyget > 0) {
                    this.set_object_ex(22, o.x, o.y, Math.floor(Math.random() * 360), "common_vset0");
                }
                //Clear Items
                for (let i=51; i<59; i++){
                    if (Boolean(o.item[i]))
                    if (o.item[i] > 0) {
                        this.set_object_ex(i, o.x, o.y, Math.floor(Math.random() * 360), 38);
                    }
                }
            }
            o.display_size = 1.3;
            o.change_sce("effect_bomb_x");//7

            o.sound.change(5);
            o.sound.play(5);

            o.superviser.ceildelay += 1500;//死亡時に部屋の明かりが消える時間を遅延

            o.bomb4(33); //timeoverキャラのステータスを0にする。         
        }

        if (o.alive < 1400) {
        //    o.normal_draw_enable = (o.normal_draw_enable)?false:true;
        //    o.vset(0);
        }

        if (o.status == 0) f = 1; //未使用ステータスの場合は削除

        return f;
    }

    //===以下表示用=============================================================================
    function damage_gr1(scrn, o) {
        //次に使うITEMの表示
        inv_gr(scrn, o);
        //自機のダメージゲージ表示とSHIELDび￥の表示
        shiled_lbar_gr(scrn, o);
    }

    function shiled_lbar_gr(scrn, o){   
        
        let barriref = false;

        //Shield Display
        if (o.frame <= SHIELD_TIME) {

            let cl = {};
            let w = o.gt.worldtoView(o.x, o.y);

            cl.x = w.x + o.shiftx;
            cl.y = w.y + o.shifty;
            cl.r = 25 + o.frame % 5;
            let sp =  ((SHIELD_TIME - o.frame)/SHIELD_TIME);
            let cR = Math.trunc(63  * sp) + 192;
            let cG = Math.trunc(127 * sp) + 128;
            let cB = Math.trunc(255 * sp);
            cl.c = "rgb(" + cR + "," + cG + "," + cB + ")";
            cl.lw = Math.trunc(o.frame) % Math.trunc(30 * sp); 
            cl.draw = function (device) {
                device.beginPath();
                device.strokeStyle = this.c; //"white";
                device.lineWidth = this.lw;//"1";
                device.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
                device.stroke();
            }
            //if (Math.trunc(o.frame % 1)== 0)
             scrn.putFunc(cl);

            barriref = true;
        }
        
        lbar = {}

        lbar.hp = o.hp;
        lbar.mhp = o.maxhp;
        let w = o.gt.worldtoView(o.x, o.y);

        lbar.x = w.x + o.shiftx;
        lbar.y = w.y + o.shifty + o.hit_y + 3;
        //lbar.br = barriref ? "skyblue" : (lbar.hp/lbar.mhp>0.3)?"limegreen":"red";

        lbar.bbw = hpbbw;

        let now_bw = Math.trunc((o.gameState.player.hp / o.gameState.player.maxhp)*32);
        if (hpbbw > now_bw) hpbbw = hpbbw - 0.32;
        if (hpbbw <= now_bw) hpbbw = now_bw;

        lbar.cbar = (barriref)?"skyblue" : (lbar.hp/lbar.mhp>0.5)?"limegreen":"yellowgreen";//(lbar.hp/lbar.mhp>0.3)?"yellowgreen":"red"; 
		lbar.cborder = (lbar.hp/lbar.mhp>0.5)?"white":(lbar.hp/lbar.mhp>0.3)?"yellow":"orange"; 

        lbar.draw = function(device){
            device.beginPath();
	        device.fillStyle = "red";
	        device.lineWidth = 1;
	        device.fillRect(this.x -16, this.y +3, this.bbw, 2);
	        device.stroke();

            device.beginPath();
	        device.fillStyle = this.cbar;
	        device.lineWidth = 1;
	        device.fillRect(this.x -16, this.y +3, (this.hp/this.mhp)*32, 2);
	        device.stroke();

	        device.beginPath();
	        device.strokeStyle = this.cborder;  
	        device.lineWidth = 1;
	        device.rect(this.x -17, this.y +2, 34, 4);
	        device.stroke();
        }
        if (o.hp != o.maxhp) scrn.putFunc(lbar);

        for (let i=0; i < op.x.length - 5; i++){
            let w = o.gt.worldtoView(
                op.x[(op.ptr + i) % op.x.length],
                op.y[(op.ptr + i) % op.x.length]
            );
            
            if (i > op.x.length - o.item[20]) {
                /*
                if (((i-1) % 10) == 0){
                    //scrn.fill(w.x-8, w.y-8,16,16,c);
                    scrn.putFunc( {   x: w.x ,y: w.y ,r: 6 - o.frame%6/2,
                            draw: function (device) {
                                device.beginPath();
                                device.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                                device.fillStyle = "white";
                                device.fill();
                            }
                        } );
                }else{
                    */
                    scrn.fill(w.x, w.y, 2, 2,"gray");
                }
            /*
            }else{
                //scrn.fill(w.x, w.y, 2, 2,"gray");
            }
            */     
                  
            if (i > op.x.length - o.itemstack.length){    
                if (Boolean(o.itemstack[op.x.length - i])){
                    scrn.fill(w.x, w.y, 2, 2,"white");
                    /*
                    if (o.itemstack[op.x.length - i] == 23){
                        scrn.fill(w.x, w.y, 3, 3,"Orange");
                    }else if (o.itemstack[op.x.length - i] == 24){
                        scrn.fill(w.x, w.y, 3, 3,"Cyan");
                    }else if (o.itemstack[op.x.length - i] == 25){
                        scrn.fill(w.x, w.y, 3, 3,"Green");
                    }
                    */
                }
            }
            
        }
    }

    function inv_gr(scrn, o){
 
        if (o.itemstack.length != 0) {//アイテム持っていない場合、処理せず。
            //chrno.23:(B) 24:(S) 25:(L)
            let spname = ["BallB1", "BallS1", "BallL1"];
            let f = o.itemstack[o.itemstack.length-1]-23; //next use item
            let v = o.turlet.vector();//o.vector;

            if (!(f < 0 || f > 2)) {
                let w = o.gt.worldtoView(o.x, o.y);

                let tx = w.x + o.shiftx;
                let ty = w.y + o.shifty;

                tx = tx - o.Cos(v) * 16;
                ty = ty - o.Sin(v) * 16;

                scrn.put(spname[f], tx, ty);
                //scrn.putchr8("_" + o.turlet.num(), tx, ty); 

            }
        }
        if (o.gameState.player.weapon != 3) return;//Boomは分かりにくいので表示
        
        let wweapon = ["Wand", "Knife", "Axe", "BoomR", "Spear", "Bow"];

		if (!Boolean(o.gameState.player.weapon)) o.gameState.player.weapon = 0;

        let w = o.gt.worldtoView(o.x, o.y);

        let tx = w.x + o.shiftx;
        let ty = w.y + o.shifty;

        let v = o.turlet.vector();//o.vector;
        tx = tx + o.Cos(v) * 16;
        ty = ty + o.Sin(v) * 16;

        scrn.put(wweapon[o.gameState.player.weapon], tx, ty);
    }
}

function sce_player_start() {
    //　自機の発進の動き
    //-----------------------------------------------------------------------
    let cnt;

    this.init = function (scrn, o) {
        o.type = 98;
        //      o.mp = 1;
        o.vector = 0;
        o.vset(0);

        cnt = 0;
    }

    this.move = function (scrn, o) {

        //視点変更処理（自機以外では基本的に発生しない）(演出では使えるかもしれない）
        let w = o.gt.worldtoView(o.x, o.y);

        // view shift
        let sx = o.gt.world_x;
        let sy = o.gt.world_y;

        if ((o.gt.viewwidth/2) - (w.x - w.sx) > 120 ){ sx = o.x  - (o.gt.viewwidth/2) + 120;}
        if ((o.gt.viewwidth/2) - (w.x - w.sx) < -120){ sx = o.x  - (o.gt.viewwidth/2) - 120;}
        if ((o.gt.viewheight/2) - (w.y - w.sy) > 50){ sy = o.y  - (o.gt.viewheight/2) + 50;}
        if ((o.gt.viewheight/2) - (w.y - w.sy) < -50){sy = o.y  - (o.gt.viewheight/2)  - 50;}

        if (!o.gt.in_view(o.x, o.y)){
            if (o.x != o.old_x) sx = o.x - o.gt.viewwidth/2;
            if (o.y != o.old_y) sy = o.y - o.gt.viewheight/2;
        }
        o.gt.viewpos(sx, sy);

        cnt++;
        if (cnt%3==0) o.normal_draw_enable = (o.normal_draw_enable)?false:true;
        
        if (o.alive > 1500) o.change_sce("player"); 
        //o.shitfy = -5*o.frame;
        /*
        switch (o.frame) {
            case 90:
                o.change_sce("player");
                break;
            default:
                break;
        };
        o.frame++;
        */
        return o.sc_move();
    }
}