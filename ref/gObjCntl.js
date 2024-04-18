function gObjectControl(scrn, state) {
    
    //メイン
    let cdt;// = new CLinear4TreeManager();
    //if (!cdt.init(5, 0, 0, 3000, 3000)) { alert("!"); }

    let debug_colnum;
    let debug_cflag;

    let dev = state.System.dev;

    delobj = 0;//使ってない

    this.score = 0;

    this.interrapt = false;

    this.SIGNAL = 0;

    //	this.restart = 0;

    //以下はコンティニューでもリセット
    //ここらへんもStateGameに持たせるべきか？

    let item_ = [];
    let itemstack_ = [];
    let itemlv_= 0;

    this.item = item_; //現在取得しているアイテム(リセットオンだとやられると0）(消す処理自体はgameSceneで処理）

    this.combo = []; //連続して敵を倒したり、アイテム[20]を取った数。逃げられたり取りそこなうと0

    this.obCount = []; //出現したキャラクタの総数

    this.combomax = []; //comboが続いた内の最大値

    this.total = []; //種類別の倒した総数(主に敵）　倒した総数/出現した数で撃墜率などを算出で使用予定 combo関係の名残

    this.itemstack = itemstack_;

    this.collisioncount  = 0;

    this.itemlv = itemlv_; //武器Weaponを拾った時のItemLevel保持用work

    this.ceilflag = false; //天井の下にいるかF
    this.ceildelay = 0; //消した後すぐには再表示させないための遅延カウンタ
    this.ceilindex = -1; //消す天井のmapChip_index
    this.ceilshadow = "rgba(4,4,4,0.8)"; //天井の暗さ(影に入っている場合)

    //
    this.hidan = 0;

    this.nonmove = 0;

    /*
    let stockscore = 0;
    let stockcount = 0;
    let stockrate = 1;
    let stockdisp_x = 128;
    let stockdisp_y = 96;
    */

    this.rollcall = rollcall_attendance;
    function rollcall_attendance( name ){

        let flag = false;
        if (Boolean(obj_namecheck_list[name])) flag = obj_namecheck_list[name];
        return flag;
    }

    function priorityBuffer(){
        // キャラクタ表示の個別重ね合わせ制御用
        // 画面全体表示のプライオリティ制御は画面別でシステムでやってる。
        //(なので、システム側にスプライトの機能として持たせる？)
        // Y座標でソートして表示

        let inbuf = [];
        let count = 0;
    
        this.add = ( obj )=> {
            inbuf[count] = obj;
            count++;
        }
    
        this.sort = () => {
            inbuf.sort((a,b)=> a.y - b.y );
        }
            
        this.buffer =()=> { return inbuf; }
    
        this.reset =()=> {
            inbuf = [];
            count = 0;
        }
    }

    const pbuf = new priorityBuffer();
    
    let restart_count = 0;
    let map_sc;

    let before_int;
    let before_SIG;
    //  let map_sc = mapScenro();
    let ch_ptn = character();
    let motion_ptn = motionPattern();

    let sce = scenario(this);

    // オブジェクトの情報をArrayで管理
    let obj = [];//これをState側に持たせれば全体から管理可能となるか。

    let obj_namecheck_list = [];

    //当たり判定用マップ

    let csmap = []; //collisonmap　0:当たり判定なし 1:当たり判定/ダメージ判定 2:当たり判定のみ　//2は機能していない(0かnot0のみ)
    //         自･弾･敵･弾･物･他
    csmap[0] = [0, 0, 2, 1, 1, 0]; //自機味方
    csmap[1] = [0, 0, 1, 0, 0, 0]; //自弾
    csmap[2] = [2, 1, 2, 0, 1, 0]; //敵
    csmap[3] = [1, 0, 0, 0, 0, 0]; //敵弾
    csmap[4] = [1, 0, 1, 0, 0, 0]; //アイテム
    csmap[5] = [0, 0, 0, 0, 0, 0]; //その他

    let restartFlag = true;

    let msglog = new textbufferControl(25);
    let msgview = new textbufferControl(26);
    let msgcnsl = new textbufferControl(21);

    this.messagelog = msglog;
    this.messageview = msgview;
    this.messageconsole = msgcnsl;

    let itemtable = {//表示用のアイテムリスト
    //  (ITEMLIST) 
        0:"操作説明",
        1:"魔法陣説明",
        2:"扉説明",
        15:"杖"  ,  // MP38 Wand
        16:"剣"  , // MP15 Knife
        17:"戦斧",   // MP37 Axe
        18:"槍"  , // MP35 Spear
        19:"ﾌﾞｰﾒﾗﾝ",  // MP36 Boom
        20:"球"  ,  // MP26 Ball1-3
        21:"1UP" ,   // MP 1 Mayura1-4
        22:"鍵"  ,   // MP27 Key
        23:"爆弾",// MP28 BallB1-3
        24:"ﾊﾞﾘｱ",// MP29 BallS1-3
        25:"回復",// MP30 BallL1-3
        26:"ﾗﾝﾌﾟ",  // MP33 Lamp
        27:"地図",   // MP34 Map
        35:"ｺｲﾝ",  // MP32 Coin1-4
        40:"宝箱", // MP39 TrBox
        50:"弓矢"    // MP43 Bow
        ,51:"AmuletR"// MP50 AmuletR
        ,52:"AmuletG"// MP51,AmuletG
        ,53:"AmuletB"// MP52,AmuletB
        ,54:"ﾛｳｿｸR"// MP53,CandleR
        ,55:"ﾛｳｿｸB"// MP54,CandleB
        ,56:"指輪R"// MP55,RingR
        ,57:"指輪B"// MP56,RingB
        ,58:"鏡"// MP57,Mirror
    }
    this.itemTable = itemtable;

    let tutcnsl = new textbufferControl(5);
    this.tutorialconsole = tutcnsl;
    let tutComment = tutorialCommentTable();//return comment [[],[],[]];
    this.tutTable = tutCheck;
    let tutDtime = 0;
    this.tutorialDisplayTime = tutDtime;

    let tutoDone = [];

    function tutCheck(num){
        let h = "> ";        
        if (Boolean(tutComment[num])){
            if (!Boolean(tutoDone[num])){
                for (let m of tutComment[num]){
                    this.tutorialconsole.write(h + m);
                    h = "  ";
                }
                this.tutorialDisplayTime = state.System.time() + 10000;//10s
                tutoDone[num] = true;//説明済みFlag 
            }else {
                //objc.tutorialconsole.write("> " + itemtable[num] + "is done.");
                //if (num < 15) this.item[num] = 2;//説明済み
            }
        }
    }

    function textbufferControl(num = 20){

        const LINE = num + 1;
        const WIDTH = 40;
    
        let buffer = [];
    
        this.read = function(){
    
            return buffer;
        }
    
        this.write = function(str){
    
            if (str.length > WIDTH) str = str.substring(0,WIDTH);
    
            buffer.push(str);
    
            let bfw = [];
            for (let i in buffer){
                if (i > (buffer.length-LINE)){
                    bfw.push(buffer[i]);
                }
            }
            buffer = bfw;
        }

        this.clear = function(){
            buffer =[];
        }
    }
    let cmdlog = "-----";
    let cmdcnt = 0;

    const PLAYER=98, FRIEND = 0, BULLET_P= 1;
    const ENEMY = 2, BULLET_E=3;
	const ITEM  = 4, ETC    = 5;

    //再読み込み無しの再起動
    this.reset = function (cont_flag) {

        restartFlag = true;//リセットした状態（マップコリジョン登録等を再処理する為のフラグ）

        cdt = new CLinear4TreeManager();
        if (!cdt.init(6, 0, 0, 3000, 3000)) { alert("!"); }

        delobj = 0; //不要かも

        restart_count = 0;

        if (state.Game.cold) {
            this.score = 0;

            this.obCount = []; //出現したキャラクタの総数
            this.combomax = []; //comboが続いた内の最大値
            this.total = []; //種類別の倒した総数(主に敵）　倒した総数/出現した数で撃墜率などを算出で使用予定
            this.hidan = 0;
            this.combo = [];
            this.item = [];
            this.itemstack = [];

            tutoDone = [];//tutorialを見たフラグリセット

            msglog.write("ObjCtrl Init.");
        }

        if (!cont_flag) {
            this.interrapt = false;
            this.SIGNAL = 0;

            obj = [];
            state.Config.cold = true;
            //    this.item = [];

            msglog.write("ObjCtrl Reset.");

        }

        if (state.Config.fullpower) {
            //this.item[7] = 10;
        }

        //this.item[35] = 0; //coinclear;

        msglog.write("ObjCtrl Run.");
        msgcnsl.clear();
        tutcnsl.clear();
    }

    //move ======================================
    //オブジェクトの移動/各処理のループ

    this.move = function (mapsc) {

        map_sc = mapsc;

        //    let mstate = dev.mouse_state.check();
        //let mstate = dev.mouse_state.check_last();
        let kstate = dev.key_state.check();

        this.nonmove = 0;
        // 移動などの処理

        obj_namecheck_list = [];
        for (let i in obj) {
            //for (let i = 0, loopend = obj.length; i < loopend; i++) {
            let o = obj[i];

            o.vecfrm = 60/(1000/state.System.deltaTime()); o.vecfrm = (o.vecfrm >3)?3:o.vecfrm;//フレームレート低下弊害抑止(20f/s<は処理落ち)
            o.alive =  state.System.time() - o.barthTime;
            //o.vecfrm = 1;
            //o.colitem && o.colitem.remove();
            //o.alive--;

            if (Boolean(o.name)) obj_namecheck_list[o.name] = true;

            //let onst = o.gt.in_stage_range(o.x - (o.hit_x / 2), o.y - (o.hit_y / 2), o.hit_x, o.hit_y);
            let onst = o.gt.in_view_range(o.x - (o.hit_x / 2), o.y - (o.hit_y / 2), o.hit_x, o.hit_y);

            if (!onst) {
                if ((o.type == BULLET_P) || (o.type == BULLET_E)) {
                    if (state.Config.bulletmode) o.status = 0; //画面外から弾が飛んでこないようにする処理(飛んできたら難しすぎたので）
                    //.bulletmode：trueで表示画面外の弾は消滅。
                    if (!o.gt.in_world(o.x, o.y))o.status = 0; //画面外に出ている弾を消す。
                }
            }
            //let instage = o.gt.in_stage(o.x , o.y);

            //let wgs = dev.gs.nowstagepos();
            //if ((o.x < wgs.x) || (o.x > wgs.x + wgs.w) || (o.y < wgs.y) || (o.y > wgs.y + wgs.h)) {

            if (state.Game.outviewCollision) onst = true; //画面外も処理な為強制的にon
            if (!onst) {
                this.nonmove++;
                //                o.state_moving = false;
                //if ((o.type == 1) || (o.type == 3)) {
                //    o.status = 0; //画面外から弾が飛んでこないようにする処理
                //}
                if (o.type != ETC) continue;
            }

            /*
            if (!o.state_moving && o.type != 5) {//画面外から復帰時は移動処理を1回待つ
            o.state_moving = true;
            continue;
            }
            */
            //o.mouse_state = mstate;
            if (o.type == PLAYER ) { 
                o.key_state = kstate;
                o.entrypadaxis = dev.directionM( kstate );
                o.score = this.score;
            }

            //let w = o.gt.worldtoWorld(o.x, o.y);
            //o.x = w.x;  o.y = w.y;
            if (o.move(scrn, o, mapsc) != 0) {//戻り値0がNormalEnd‗/Normal以外はコリジョンリストに載せない。
                o.colitem && o.colitem.remove();
                o.colitem = null;
                delete obj[i];
                delobj++;
                //o.status = 0;
            } else {
                if (o.type != ETC) { //その他は当たり判定リストに載せない
                    if (!o.firstRunning || ((o.x != o.old_x) || (o.y != o.old_y))) { //移動している場合
                        if (!o.gt.in_world(o.x, o.y)){
                            if ((o.type != BULLET_P) && (o.type != BULLET_E)){//弾の場合は反対側に座標変換しない。
                                o.x = o.gt.worldtoWorld_x(o.x);
                                o.y = o.gt.worldtoWorld_y(o.y);
                            }
                        }
                        o.colitem && o.colitem.remove();
                        if (!o.colitem) {
                            o.colitem = cdt.createObjectForTree();
                            o.colitem.obj = o;
                        }

                        cdt.register(
                            /*
                            o.x + o.center_x - o.hit_x/2, 
                            o.y + o.center_y - o.hit_y/2,
                            o.x + o.center_x + o.hit_x/2, 
                            o.y + o.center_y + o.hit_y/2,
                            */
                            o.x - o.hit_x/2, 
                            o.y - o.hit_y/2,
                            o.x + o.hit_x/2, 
                            o.y + o.hit_y/2,
		                    o.colitem);

                        o.crash = null;

                        o.firstRunning = true;
                    }
                }
            }

            //messageの処理

            for (let mcnt = 0, loopend = o.message.length; mcnt < loopend; mcnt++) {

                let ms = o.message[mcnt];

                let r = ObjCmdDecode(ms, o, obj, state, sce);

                if (r.exec){
                    if (ms.cmd != cmdlog){//logfilter
                        let rc = (cmdcnt/5 > 10)? 10: cmdcnt/5;
                        
                        msgview.write("." + "=".repeat(rc) + cmdlog );
                        if (r.log) msglog.write("." + ms.cmd);
                        cmdlog = ms.cmd;
                        cmdcnt = 0;
                    }else{
                        cmdcnt++;
                    }
                }

            }
            
            o.message = [];

            o.mapCollision = false;
            o.mapColX = false;
            o.mapColY = false;
        }

        //score view display 
        /*
        if (stockcount > 0) {
            //coin get score display 
            stockcount--;

            if (stockcount == 0) {

                this.score += stockscore;

                let wid = stockscore + "pts";
                if (stockrate != 1) {
                    wid += "(" + stockrate + "coin)";
                }

                //map_sc.add(128, 96, 0, 20, 39, wid); //43green
                map_sc.add(stockdisp_x, stockdisp_y, 0, 20, 39, wid); //43green

                stockscore = 0;
                stockrate = 0;
            }
        }
        */
        //Hit

        //restartFlag = false;
        if (restartFlag) {
            let mapchip = map_sc.mapChip();

            //mapchipのtypeの変更は元でされています。10: 床　11: 壁　12: 扉

            for (let k = 0, loopend = mapchip.length; k < loopend; k++) {
                let w = mapchip[k];

                //w.colitem && w.colitem.remove();
                //if ((w.c) && (w.view)) { //画面外は当たり判定を行わない
                if (w.c) { //表示させなかった画面外の壁も当たり判定を行う
                    //当たり判定のある壁を当たり判定ツリーに追加

                    //12:Door 13:Ciel 14:Circle 16:StoneB 
                    //当たり判定のあるmapchipの画像を初期化(クリアした面に戻るとドアが開いたままの画像になっている為)                            
                    switch(w.type){
                        case 12: w.no = "Door"; break;
                        case 13: break;
                        case 14: w.no = "Portal"; break;
                        case 16: break;
                        default: break;
                    }
                    
                    if (!w.colitem) {
                        w.colitem = cdt.createObjectForTree();
                        w.colitem.obj = w;
                    }

                    cdt.register(w.x, w.y,
                    w.x + w.w, w.y + w.h,
		            w.colitem);
                }
            }
            restartFlag = false;
        }
        //
        let res = cdt.getAllCollisionList();

        debug_colnum = res.length;
        this.collisioncount = debug_colnum/2;

        if (state.System.time() > this.ceildelay+300) this.ceilflag = false;//再表示までの遅延

        for (let i = 0, loopend = res.length; i < loopend; i += 2) {

            let o = res[i];
            let e = res[i + 1];

            let type_w1 = (o.type == PLAYER) ? 0 : o.type;
            let type_w2 = (e.type == PLAYER) ? 0 : e.type;

            if ((type_w1 >= 10) && (type_w2 >= 10)) continue;

            // mob and mob
            if ((type_w1 < 10) && (type_w2 < 10)) {

                let flag = csmap[type_w1][type_w2];

                if (flag == 0) continue;

                if (!(o.colcheck && e.colcheck)) continue;//両方とも衝突チェック有りの場合に処理

                if ((Math.abs(o.x - e.x) < (o.hit_x + e.hit_x) / 2) && (Math.abs(o.y - e.y) < (o.hit_y + e.hit_y) / 2)) {

                    o.status = 2;
                    e.status = 2;
                    o.crash = e;
                    e.crash = o;
                }
            } else {
                // mob and wall ( map collision )
                if (type_w2 < 10) {
                    o = res[i + 1];
                    e = res[i];
                }

                let w = e;
                //            for (let m in colchip) {
                //              let w = colchip[m];
                let c = false; //カベ壊しフラグ

                let bupCol = o.mapCollision;
                let bupColX = o.mapColX;
                let bupColY = o.mapColY;

                if (w.c) { //((w.c) && (w.view)) {
                    if ((Math.abs((o.x + o.vx) - (w.x + w.w / 2)) < (o.hit_x + w.w) / 2) && (Math.abs((o.y + o.vy) - (w.y + w.h / 2)) < (o.hit_y + w.h) / 2)) {
                        o.mapCollision = true;
                        c = true;
                    }
                    if ((Math.abs((o.x + o.vx) - (w.x + w.w / 2)) < (o.hit_x + w.w) / 2) && (Math.abs(o.y - (w.y + w.h / 2)) < (o.hit_y + w.h) / 2)) {
                        o.mapColX = true;
                    }
                    if ((Math.abs(o.x - (w.x + w.w / 2)) < (o.hit_x + w.w) / 2) && (Math.abs((o.y + o.vy) - (w.y + w.h / 2)) < (o.hit_y + w.h) / 2)) {
                        o.mapColY = true;
                    }

                    //if(true){
                    if (c) {
                        //if ((w.type == 10) && ((o.type == 98) || (o.type == 98))) {
                        //    delete mapchip[m];
                        //}
                        if ([12, 13, 14, 16].includes(w.type)) {
                        //12:Door 13:Ciel 14:Circle 16:StoneB                            
                            if (o.type == PLAYER){
                                switch(w.type){
                                    case 12:
                                        o.doorflag = true;
                                        if (o.turndoorkey){ 
                                            w.no = "OpDoor";
                                            o.startx = w.x + w.w/2;
                                            o.starty = w.y + w.h/2;
                                        }  else {
                                            w.no = "Door";
                                        } 
                                        //13:DoorGraphics
                                        //14:PortalGraphics
                                        break;
                                    case 13:
                                        this.ceilflag = true; //天井
                                        this.ceildelay = state.System.time();//最後に消した基準タイム
                                        this.ceilindex = w.index;
                                        break;
                                    case 14:
                                        o.homeflag = true;
                                        if (o.lighton){ w.no = "LPortal";}  else {w.no = "Portal";} 
                                        break;
                                    case 16:
                                        o.portalflag = true;
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                if ((o.type == ENEMY)||(o.type == BULLET_E)){
                                    switch(w.type){
                                        case 13:
                                            if (mapsc.startroom_id() == w.index){ //開始部屋に入れない処理
                                                bupCol  = o.mapCollision; bupColX = o.mapColX; bupColY = o.mapColY;
                                            } 
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                            o.mapCollision = bupCol;// || o.mapCollision;
                            o.mapColX = bupColX;// || o.mapColX;
                            o.mapColY = bupColY;// || o.mapColY;
                        }
                    }
                }
                //wall and wall
            }
        }

        let cmap = mapsc.cmap();

        for (i in obj) {
            o = obj[i];

            if (o.type == ETC) continue;//その他(effect)は地形当たり判定しない。

            ///*2023/01/22 debug(動作忘れたため)
            //地形との当たり判定（MAP配列）
            if (Boolean(cmap)){ //cmap有効の場合cmapで当たり判定
                let lt = {};
                let rb = {};

                lt.x = o.x - o.hit_x / 2;
                lt.y = o.y - o.hit_y / 2;
                rb.x = o.x + o.hit_x / 2;
                rb.y = o.y + o.hit_y / 2;

                lt.mx = Math.floor((lt.x - 96) / 32);
                lt.my = Math.floor((lt.y - 96) / 32);
                rb.mx = Math.floor((rb.x - 96) / 32);
                rb.my = Math.floor((rb.y - 96) / 32);


                if ((lt.mx < 0) || (lt.my < 0) ||
                    (rb.mx > cmap.length) || (rb.my > cmap.length)) {
                    o.mapCollision = true;
                } else {
                    if (Boolean(cmap[lt.mx])){
                        if (Boolean(cmap[lt.mx][lt.my])){
                             o.mapCollision = true; //
                             //if (o.type == 98){cmap[lt.mx][lt.my] = false;}
                        } 
                        if (Boolean(cmap[lt.mx][rb.my])){
                             o.mapCollision = true; //
                             //if (o.type == 98){cmap[lt.mx][rb.my] = false;}
                        }
                    }

                    if (Boolean(cmap[rb.mx])){
                        if (Boolean(cmap[rb.mx][lt.my])){ 
                            o.mapCollision = true; //
                            //if (o.type == 98){cmap[rb.mx][lt.my] = false;}
                        }
                        if (Boolean(cmap[rb.mx][rb.my])){
                            o.mapCollision = true; //
                            //if (o.type == 98){cmap[rb.mx][rb.my] = false;}
                        }
                    }
                }
            }
            //*/
            //
            let onst = o.gt.in_stage_range(o.x - (o.hit_x / 2), o.y - (o.hit_y / 2), o.hit_x, o.hit_y);
            //画面外？
            //if ((o.x < wgs.x) || (o.x > wgs.x + wgs.w) || (o.y < wgs.y) || (o.y > wgs.y + wgs.h)) {

            if (state.Game.outviewCollision) onst = true; //画面外も処理な為強制的にon
            if (!onst) {
                continue;
            }

            if (o.crash) {

                let wo_stat = 0;
                let wo_crst = 0;
                let wo_vect = 0;

                if ((o.type == BULLET_P) || (o.type == BULLET_E)) {
                    //弾の場合はそのまま消滅
                } else {
                    let bf = true;

                    if (bf) { //衝突でのhp/damegeflag処理　(バトルシステムを入れる場合はここになる）

                        let whp = o.hp;

                        //if (o.type == 4) o.hp = 0; //item取得の場合はhp減少が発生しないようにする。
                        //(アイテムに当たり判定があるのは自分と友軍なので取得の判定はアイテムが衝突死したところで行う)
                        //hpが攻撃力ではなくなっているのではないかと思うので不要？ダメージ有りアイテムは個別にdmgcheckをtrueに
                        //すればよいかも

                        if (o.type != o.crash.type) {
                            //if (o.crash.type != 4) o.hp -= o.crash.attack; // ((o.crash.hp > 0) ? o.crash.hp : 1);
                            if (o.damage.count <=10 ){ //吹き飛び中(硬直)時間中はダメージが入らないようにする
                                if (o.crash.dmgcheck) o.hp -= o.crash.attack; // ((o.crash.hp > 0) ? o.crash.hp : 1);
                            }
                        } else {
                            o.mapCollision = true; // whp = -1; //同じtype同士が衝突した場合はダメージ発生無しの衝突処理のみ
                        }

                        if (o.hp > 0) {//生き残った場合はstatusを2(衝突して死亡)から1(通常)にしてdamegeflagをオン
                            o.status = 1;
                            if (whp != o.hp) {
                                //if (o.type == 98) this.hidan++;
                                o.damageflag = true;
                                o.crash.damageflag = true;
                                o.damage.vector = o.target_r(o.crash.x, o.crash.y);
                                o.damage.dist = o.target_d(o.crash.x, o.crash.y);
                                o.damage.no = o.crash.attack;
                            }
                            o.crash = null;
                        } else {
                            if (o.type == PLAYER){
                                state.Game.player.hp = o.hp;
                            }
                            if (o.type == ENEMY) {
                                //this.combo_sub(2);
                            }
                        }
                    }
                }
            }
        }

        //    if (delobj > 10){obj.sort(); delobj = 0;}//消した配列が10個超えたらソート
        //    if (!obj[obj.length-1]) {obj.pop();}//空の配列を削除します。
        /*
        let f = 0;
        for (i in obj) {
            if (obj[i].type == 98) f++;
            //if (obj[i].type == 4) and 
        }

        if (f == 0) {
            */
        if (!this.rollcall("mayura")){

            restart_count+= 60/(1000/state.System.deltaTime());//60fに対して現在のフレームレート補正値を加算
            //state.Game.player.hp = 0;
            //this.ceilflag = true; //天井
            this.ceildelay = state.System.time()+1000;//部屋で死んだ場合の消灯時間延長　<-playerでも実施

            //if (!dev.sound.running()) dev.sound.volume(0.0);
            if (restart_count > (dev.sound.duration(5)*60)- 60) {//no:5 MUSIC_MISS 
                //dev.sound.volume(0.0);//MISS MUSICが鳴り終わったら、BGMが鳴らないように音量抑止。
                //MISS_MUSICはplayer.jsで鳴らして、BGMはgameSceneで鳴らしているので
                //まだこの時点ではgameSceneに死亡状態が伝わっていない為、ここで抑止している。
            }

            if (restart_count > 135) {//2.1秒後
                before_int = this.interrapt;
                before_SIG = this.SIGNAL;
                this.interrapt = true;
                this.SIGNAL = 4649;

                //dev.sound.volume(1.0);//ボリューム戻し(戻さないと開始音が鳴らなくなる。)
                //画面から自機がいなくなったらリスタートシグナルを上げる(数字は適当で仮）  
            }
        } 

        //restartFlag = false;
    }

    this.combo_sub = function (num) {
        if (!Boolean(this.combo[num])) {
            this.combo[num] = 1;
        } else {
            this.combo[num]++;
        }

        if (!Boolean(this.combomax[num])) {
            this.combomax[num] = this.combo[num];
        } else {
            if (this.combo[num] > this.combomax[num]) this.combomax[num] = this.combo[num];
        }

        if (!Boolean(this.total[num])) {
            this.total[num] = 1
        } else {
            this.total[num]++;
        }

        return this.combo[num];
    }

    //外部からリスタート指示の為のコマンド  
    this.restart = function () {

        map_sc.start(false);
        restart_count = 0;

        this.interrapt = before_int;
        this.SIGNAL = before_SIG;
    }

    // draw ======================================
    // オブジェクトの描画

    this.draw = function (wscreen, mode) {

        if (!Boolean(mode)) mode = false;
        //mode: prioritySurface
        if (!Boolean(wscreen)) wscreen = scrn;

        //SPprioritycontroll-Y
        pbuf.reset();

        for (let i in obj) {
            let o = obj[i];

            if (o.visible && (o.prioritySurface == mode)) {
                if (o.normal_draw_enable || o.custom_draw_enable) {
                    if (dev.gs.in_stage(o.x, o.y)){
                        pbuf.add(o);
                    }
                }
            }
        }

        pbuf.sort();
        let wo = pbuf.buffer();

        for (let i in wo) {
            let o = wo[i];

            if (o.normal_draw_enable) {
                o.draw(wscreen, o);

                if (state.Config.debug) {
                    let w = o.gt.worldtoView(o.x, o.y);
                    let cl = {}
                    cl.x = w.x - o.hit_x/2 ;
                    cl.y = w.y - o.hit_y/2 ;
                    cl.w = o.hit_x;
                    cl.h = o.hit_y;
                    cl.draw = function(device){
                        device.beginPath();
                        device.strokeStyle = "green";
                        device.lineWidth = 2;
                        device.rect(this.x, this.y, this.w, this.h );
                        device.stroke();
                    }
                    if (o.type != ETC) wscreen.putFunc(cl);
                    /*
                    if ('spec' in o){
                        if ('LV' in o.spec){
                            wscreen.putchr8c("Lv" + o.spec.LV, w.x -12, w.y, 1);
                        }
                    }
                    */
                    //wscreen.putchr8c(i, w.x, w.y, 0);
                } 
            }

            if (o.custom_draw_enable) {
                if (Boolean(o.custom_draw)) {
                    o.custom_draw(wscreen, o);
                }
            }
        }
    }

    // drawPoint ==================================
    // 縮小マップ用オブジェクト位置描画

    this.drawPoint = function (wscreen, flag) {
        //flag true: lamp on false:lamp off
        let col = ["skyblue", "skyblue", "red", "orange", "yellow", "yellow"];
        col[98] = "white";

        if (!Boolean(wscreen)) wscreen = scrn;

        let nt = Date.now();

        let cl = {};

        cl.obj = obj;
        cl.col = col;
        cl.draw = function (device) {

            for (let i in this.obj) {
                let o = this.obj[i];

                if (o.visible) {

                    if ((o.type == BULLET_P) || (o.type == BULLET_E) || (o.type == ETC)) continue;

                    if ((o.type != PLAYER) && (!flag)) continue;

                    if (o.normal_draw_enable) {
                        device.beginPath();
                        device.strokeStyle = this.col[o.type];
                        device.lineWidth = 1;
                        device.rect(
                            dev.layout.map_x + o.x / 20, 
                            dev.layout.map_y + o.y / 20,
                            o.hit_x / 20, o.hit_y / 20);
                        device.stroke();
                    }

                    if (o.lighton) {
                        device.beginPath();
                        device.strokeStyle = this.col[o.type];
                        device.lineWidth = 1;
                        device.arc(
                            dev.layout.map_x + (o.x + o.hit_x/2) / 20,
                            dev.layout.map_y + (o.y + o.hit_y/2) / 20,
                             (nt%27)/9*2, 0, 2 * Math.PI, false);
                        device.stroke();
                    }
                }
            }
        }

        wscreen.putFunc(cl);
    }

    //BG面にCharacter用のShadowをDrawする。用に作成
    this.drawShadow = function(wscreen){

        if (!Boolean(wscreen)) wscreen = scrn;

        let cl = {};
        cl.obj = obj;
        cl.draw = function (device) {
            for (let i in this.obj) {
                let o = this.obj[i];
                
                if (!o.visible) continue;
                //shadow 
                //bullet/effectには影つけない
                if ((o.type == BULLET_P) || (o.type == BULLET_E) || (o.type == ETC)) continue;
                if (!o.gt.in_view(o.x,o.y)) continue;
                if (o.normal_draw_enable) {
                    if (dev.gs.in_stage(o.x, o.y)){
                        let w = o.gt.worldtoView(o.x, o.y);

                        let ww = o.center_x * o.display_size + (o.shifty/8);//shiftyはJUMP時に
                        let wh = o.center_y * o.display_size + (o.shifty/8);//影を小さくする補正処理の為

                        if (ww>0 && wh>0){
                            device.beginPath();
                            device.fillStyle = "rgba(0,0,0,0.6)";
                            device.ellipse(w.x, w.y + wh, ww, wh/4, 0,  0, Math.PI*2, true );
                            device.fill();
                        }
                    }
                }
            }
        }
        wscreen.putFunc(cl);
    }

    // =======================================================
    // オブジェクトのセット
    this.set_s = set_sce;

    function set_sce(x, y, r, ch, sc, id, parent) {

        let o = new gObjectClass(this);

        o.reset();

        o.firstRunning = false;

        o.parent = parent;

        o.superviser = this;//ObCtrl;

        //o.scrn = scrn;
        //o.graphicsLayer = dev.graphics;
        //o.mouse_state = dev.mouse_state.check_last();
        o.gt = dev.gs;
        o.gameState = state.Game;
        o.sound = dev.sound;
        
        if (ch_ptn[ch].type == FRIEND || ch_ptn[ch].type == PLAYER){
            o.item = this.item;
            o.itemstack = this.itemstack;
            o.config = state.Config;
        }

        o.pick = [];
        o.pick_enable = true; //falseだとアイテムを拾わない。

        o.x = x;
        o.y = y;

        o.startx = x; //何に使ってる？
        o.starty = y; //

        o.vector = r;
        o.chr = ch;
        o.visible = true;

        o.mp = ch_ptn[ch].mp;
        o.hp = ch_ptn[ch].hp;
        o.maxhp = o.hp;
        //o.type = ch_ptn[ch].type; 
        o.setType( ch_ptn[ch].type );
        o.center_x = ch_ptn[ch].center_x;
        o.center_y = ch_ptn[ch].center_y;
        o.hit_x = ch_ptn[ch].size_x;
        o.hit_y = ch_ptn[ch].size_y;

        if (!Boolean(id)) id = ch_ptn[ch].id;
        o.id = id;

        o.score = ch_ptn[ch].score; 
        o.status = 1; //StatusValue.Normal ;

        if (!Boolean(sc)) sc = ch_ptn[ch].senario[0];

        o.init = sce.init[sc];
        o.move = sce.move[sc];
        o.draw = cntl_draw;
        o.custom_draw = sce.draw[sc];

        o.attack = 3;//characterパラメータで設定できない為、Scenarioかここで設定している(仮
        if ((o.type == BULLET_P) || (o.type == BULLET_E)) {
            o.attack = o.hp;
            //STATUSによる攻撃力アップ処理
            if (o.type == BULLET_P) o.attack += (state.Game.player.spec.STR + state.Game.player.spec.DEX);
        }

        o.init(scrn, o);

        let epty = -1;

        for (let i = 0,loopend = obj.length; i < loopend; i++) {
            if (!obj[i]) {//空の配列を探す。
                epty = i;
                break;
            }
        }

        if (epty == -1) {
            obj[obj.length] = o;
        } else {
            obj[epty] = o;
        }

        if (Boolean(this.obCount[o.type])) {
            this.obCount[o.type]++;
        } else {
            this.obCount[o.type] = 1;
        }

        o.barthTime = state.System.time();
        //if ((o.type == 1)&&(o.type == 3)) o.alive = 90;
    };

    this.num = function () {

        return obj.length;
    }

    this.cnt = function () {

        let c = 0;

        for (let i in obj) {
            c++;
        }
        return c;
    }

    function cntl_draw(scrn, o) {
        //表示
        if (Boolean(motion_ptn[o.mp].wait)) {
            o.mp_cnt_frm++;
            if (o.mp_cnt_frm > motion_ptn[o.mp].wait / 2) {
                o.mp_cnt_anm++;
                o.mp_cnt_frm = 0;
                if (o.mp_cnt_anm >= motion_ptn[o.mp].pattern.length) o.mp_cnt_anm = 0;
            }
        }

        let w = o.gt.worldtoView(o.x, o.y);

        mtnptn_put(scrn, 
            w.x + o.shiftx,
            w.y + o.shifty, 
            o.mp, o.mp_cnt_anm, 
            o.vector, o.alpha, o.display_size);
    
    }
 
    function mtnptn_put(scrn, x, y, mp, mpcnt, r, alpha, size){
        //mtnptn_put(scrn, x, y, mp,[mpcnt],[r],[alpha],[size])
        if (!Boolean(mpcnt)) mpcnt = 0;
        if (!Boolean(r)) r = 0;
        if (!Boolean(alpha)) alpha = 0;
        if (!Boolean(size)) size = 0;
        
        let ptn;
        try {
            ptn = motion_ptn[mp].pattern[mpcnt][0];
        }
        catch (e) {
            mpcnt = 0;
            ptn = motion_ptn[mp].pattern[mpcnt][0];
        }

        let wvh = motion_ptn[mp].pattern[mpcnt][1];
        let wr = motion_ptn[mp].pattern[mpcnt][2];

        if ((wvh == -1) && (wr == -1)) {
            wvh = 0;
            wr = r;
        };

        scrn.put(ptn, x, y, wvh, wr, alpha, size);
        //scrn.putchr("mp:"+ o.mp, w.x, w.y);
    }

    this.list = function(){
        let st = [];

        for (let j=0; j < obj.length; j++){
            let n = "   "+String(j);
            st[j] =  n.substring(n.length-3) +".No.Object";
        }

        // type ,x ,y ,status, mp
        for (let i in obj) {
            let o = obj[i];
            let inv = o.gt.in_view(o.x, o.y)?"v":"-"; 
            //let inw = o.gt.in_world(o.x, o.y)?"wo":"w-";
            //let s = "" + o.type + "," + Math.trunc(o.x) + "," + Math.trunc(o.y) + ","  + o.status + "," + o.mp;
            //type, inview, hp, status,mp,chr
            let n = "   "+String(i);
            let s = n.substring(n.length-3) + ":" + o.type + "," + inv + "," + o.hp + ","  + o.status + "," + o.mp + "," +o.chr;
            
            st[i] = s;
            //st.push(s);
        }        
        return st;
    }

    this.lookObj = function(num){

        let st = [];

        if (obj[num] instanceof Object){

            let o = Object.entries(obj[num]);

            o.forEach(function(element){
                let w = String(element).split(",");
                //let w = element.split(",");
                //st.push(element);
                let s = w[0];
                if (s.length < 13){
                    s = s + " ".repeat(13);
                    s = s.substring(0, 13);
                }
                let s2 = w[1];
                /*
                for (let i = 2; i < w.length; i++){
                    s2 = s2 + w[i];
                }
                */
                st.push("."+ s + ":" + s2);
            });
            st.push("");
            st.push("Object.entries end.");
        } else{
            st.push("No.Object");
        }
        st.push("");
        st.push("Return [1-9] Key.");

        return st;
    }

    this.lookObjv = function(scrn, num, x, y){

        let result = false;

        if (obj[num] instanceof Object){

            let o = obj[num];

            if (o.visible){
                mtnptn_put(scrn, 
                    x, y, o.mp,
                    o.mp_cnt_anm, 
                    o.vector, 
                    o.alpha,
                    o.display_size
                );
                result = true;
            }
        }

        return result;
    }

    this.player_objv = function(scrn){
        
        let rc = {x:0, y:0};

        for (let o of obj) {
            if (o instanceof Object){
            if (Boolean(o.type)){
            if (o.type == PLAYER){
                cntl_draw(scrn, o);
                rc = o.gt.worldtoView(o.x, o.y);
                break;
            } }
        }}
        return rc;
    }

    this.lookpick = function(scrn, num, x, y){

        let result = false;

        if (obj[num] instanceof Object){
            /*
            let spname = [];
            spname[15] = "Wand";
            spname[16] = "Knife";
            spname[17] = "Axe";
            spname[18] = "Spear";
            spname[19] = "Boom";
            spname[20] = "Ball1";
            spname[21] = "miniMay";
            spname[22] = "sKey";
            spname[23] = "BallB1";
            spname[24] = "BallS1";
            spname[25] = "BallL1";
            spname[26] = "Lamp";
            spname[27] = "Map";
            spname[35] = "Coin1";
            spname[50] = "Bow";            
            */
            let o = obj[num];

            if (o.type == ENEMY){
                if (o.pick.length > 0){
                    for (let i of o.pick){
                        //scrn.put(spname[i], x, y);
                        mtnptn_put(scrn, x, y, ch_ptn[i].mp);
                        x = x + 16;
                    }
                    result = true;
                } 
            }
            if (o.type == ITEM){
                mtnptn_put(scrn, x, y, o.mp);//, mpcnt, r, alpha, size){
                //scrn.put(spname[o.chr], x, y);
                result = true;
            }
        }
        return result;
    }
    // GameScene以外のSceneからItem追加する為のMethod
    this.get_item = function( num ){

        if (Boolean(this.item[ num ])) {
            this.item[ num ]++;
        } else {
            this.item[ num ] = 1;
        }

        if ((num == 23) || (num == 24) || (num == 25)) {
            //useble items
            let w = num;
            this.itemstack.push(w);
        }

        if (((num >= 15) && (num <= 19)) || (num == 50)){
            state.Game.player.stack.push({ch:num, id:0});
        }

        dev.sound.effect(11); //get音

        this.messageconsole.write(this.itemTable[num] + ".GET");
    };

    this.keyitem_view_draw = function(device){

        let ypos = 400 -24;
        for (let i=51; i<59; i++){
            if (Boolean(this.item[i])){
                if (this.item[i] > 0) {
                    device.put(
                        motion_ptn[ch_ptn[i].mp].pattern[0][0]
                        , 12, ypos);
                    if (this.item[i] > 1){
                        device.kprint("+" + (this.item[i]-1),12+2, ypos+6);
                    }
                    //device.kprint(motion_ptn[[ch_ptn[i].mp]].pattern[0],12,ypos);

                    //device.kprint("ch-mp:" + ch_ptn[i].mp,12,ypos);
                    //device.kprint("mp:" + motion_ptn[ch_ptn[i].mp].pattern[0][0],12,ypos+8);
                    ypos -= 24;
                }
            }
        }
        this.keyitem_enhance_check();
    }

    this.keyitem_reset = function(){
        for (let i=51; i<59; i++){
            this.item[i] = 0;
        }
    }

    this.keyitem_enhance_check = function(){

        for (let i=51; i<59; i++){
            if (!Boolean(this.item[i])){this.item[i] = 0;}
        }

        state.Game.player.enh.INT = (this.item[51] > 0)?this.item[51]: 0;//AmuletR
        state.Game.player.enh.MND = (this.item[52] > 0)?this.item[52]: 0;//AmuletG
        state.Game.player.enh.VIT = (this.item[53] > 0)?this.item[53]: 0;//AmuletB

        state.Game.player.enh.STR = (this.item[56] > 0)?this.item[56]: 0;//RingR
        state.Game.player.enh.DEX = (this.item[57] > 0)?this.item[57]: 0;//RingB

        this.ceilshadow = (this.item[55] > 0)?"rgba( 0,64,64,0.2)"://CandleB:      
            ((this.item[54] > 0)?"rgba(48,48, 0,0.4)":"rgba(4,4,4,0.8)");//CandleR:None

        state.Game.spec_check();
    }
    
    this.dict_Ch_Sp = function(ch){
        return motion_ptn[ch_ptn[ch].mp].pattern[0][0];
    }
}


// gObjCmdDec
// ObjectControll  
// obj command Decode 2023/04/05 

function ObjCmdDecode(msg, sobj, obj, state, sce){

    const PLAYER=98, FRIEND = 0, BULLET_P= 1;
    const ENEMY = 2, BULLET_E=3;
	const ITEM  = 4, ETC    = 5;
    /*
     let command = {
         "set_object",
         "set_object_ex",
         "get_target",
         "change_sce",
         "add_score",
         "get_item",
         "bomb",//敵の弾消滅
         "bomb2",//敵の弾を回収状態にする
         "bomb3",//画面内の敵一律hp-10の範囲攻撃
         "bomb4",//特定キャラクタタイプを消す(タイムオーバーの敵消滅処理)
         "collect",//無条件でアイテムを回収状態に(画面外含む)
         "collect2",//画面内のアイテムを回収状態にする
         "collect3",//自機半径100px以内のアイテムを回収状態にする
         "SIGNAL",
         "reset_combo",//combo管理していないので無効
         "search_target_item"//Key(指定アイテム)の有無や方向のチェック
     };
     */
 
     objc = state.obCtrl;
     mapsc = state.mapsc;
     dev = state.System.dev;
 
     let execute = true;    
     let wlog = true; 
 
     switch (msg.cmd){
         case "set_object":
             mapsc.add(
                 sobj.x, sobj.y + sobj.shifty ,
                 sobj.vector,
                 msg.src , 0, 0,
                 sobj
             );
             wlog = false; 
             break;
         case "set_object_ex":
             mapsc.add(
                 msg.dst.x,
                 msg.dst.y,
                 msg.dst.vector,
                 msg.src ,
                 msg.dst.sce,
                 msg.dst.id,
                 sobj
             );
             wlog = false; 
             break;
         case "get_target":
 
             let wdist = 99999;
     
             sobj.target = null; //o; //{}; 見つからなかった場合
     
             for (let i in obj) {
                 let wo = obj[i];
                 if (wo.type != msg.src) continue;
     
                 let d = wo.target_d(sobj.x, sobj.y);
                 if (d < wdist) {
                     sobj.target = wo;
                     wdist = d;
                 }
             }
             wlog = false; 
             break;
         case "change_sce":
             sobj.init = sce.init[msg.src];
             sobj.move = sce.move[msg.src];
             sobj.custom_draw = sce.draw[msg.src];
     
             sobj.init(null, sobj);
     
             wlog = false; 
             break;
 
         case "add_score":
             objc.score += msg.src;
             break;
 
         case "get_item":
             if (Boolean(objc.item[msg.src])) {
                 objc.item[msg.src]++;
             } else {
                 objc.item[msg.src] = 1;
             }

             if (msg.src > 14){ //説明文を出す処理では処理しない。(0-14説明用)
                
                objc.score += sobj.score;

                let x = sobj.x;
                let y = sobj.y;
    
                let wid = "Get Item." + msg.src;
    
                if (msg.src == 35) {
                    wid = sobj.score + "pts.";
                    dev.sound.effect(11); //get音
                    mapsc.add(x, y, 0, 20, 39, wid); //43green
                }
    
                if (msg.src == 21) {
                    wid = "Extend!";
                    mapsc.add(x, y, 0, 20, 39, wid);
                }
    
                if (msg.src == 22) {
                    wid = "GetKey!";
                    dev.sound.effect(11); //get音
                    mapsc.add(x, y, 0, 20, 39, wid);
                }
    
                if (((msg.src >= 15) && (msg.src <= 19)) || (msg.src==50)){
                    state.Game.player.stack.push({ch:msg.src, id:msg.dst});
                    wid = "Weapon!"; 
                    dev.sound.effect(11); //get音
                    mapsc.add(x, y, 0, 20, 39, wid);
                }
    
                let f = false;
                if ((msg.src == 23) || (msg.src == 24) || (msg.src == 25)) {
                    //dev.sound.effect(9); //cursor音
                    f = true;
                }
    
                if (f) { //useble items
                    let w = msg.src;
                    objc.itemstack.push(w);
                }
            
                objc.messageconsole.write(objc.itemTable[msg.src] + ".GET");
                objc.keyitem_enhance_check();
            }
            objc.tutTable(msg.src);
             /*
             if (Boolean(objc.tutTable[msg.src])){
                for (let m of objc.tutTable[msg.src]){
                    objc.tutorialconsole.write(m);
                }
                objc.tutorialconsole.write("---");
             }
             */
             break;
 
         case "bomb":
             for (let i in obj) {
                 if (obj[i].type == BULLET_E) {//敵の弾を消滅
     
                     obj[i].change_sce(7);
                 }
             }
             break;
 
         case "bomb2":
             for (let i in obj) {
                 let o = obj[i];
     
                 if (o.type == BULLET_E) {//敵の弾を回収状態に
                     o.type = ITEM;
                     o.mp = 18;
                     o.score = 8;
                      //test用
                     if (o.chr != 7) {
                         let witem = [18, 22, 26, 27, 29, 30];
     
                         o.mp = witem[Math.floor(Math.random() * witem.length)];
                     }
                     o.change_sce(30);
                 }
             }
             break;
 
         case "bomb3":
             //msg.src : add attack power
             let atrpwr = isNaN(msg.src)? 0: msg.src;

             for (let i in obj) {
                 //画面内にいる敵のみ
                 let onst = sobj.gt.in_view_range(
                     obj[i].x - (obj[i].hit_x / 2),
                     obj[i].y - (obj[i].hit_y / 2), obj[i].hit_x, obj[i].hit_y);
     
                 if (onst) {
                     if (obj[i].type == ENEMY) {//敵には一律10のダメージ
                         obj[i].hp -= (10 + atrpwr);
                         if (obj[i].hp <= 0) obj[i].status = 2;
                     }
     
                     if (obj[i].type == BULLET_E) {//敵の弾を消滅
     
                         obj[i].change_sce(7);
                     }
                 }
             }
             objc.messageconsole.write("=BOMB=");
             break;
 
         case "bomb4":
             for (let i in obj) {
 
                 if (obj[i].chr == msg.src) {
                     obj[i].status = 0; //接触でなく消滅させる
                     obj[i].hp = 0;//消えなかったりするのでhp=0してみる。
                 }
             }
             break;
 
         case "collect":
 
             for (let i in obj) {
                 let o = obj[i];
                 if (o.type == ITEM) {//アイテムを回収モードに変更（上のほうに行ったときに）
                     if (!Boolean(o.collection_mode)) {
                         o.collection_mode = true;
                         o.change_sce(30);
                     }
                 }
             }
             break;
 
         case "collect2":
             for (let i in obj) {
                 //画面内にいるアイテムのみ　2023/1/12追加コマンド
                 let onst = sobj.gt.in_view_range(
                     obj[i].x - (obj[i].hit_x / 2),
                     obj[i].y - (obj[i].hit_y / 2), obj[i].hit_x, obj[i].hit_y);
     
                 if (onst) {
                     //アイテム回収モードにする
                     if (obj[i].type == ITEM) {//アイテム
                             obj[i].change_sce(30);
                     }
                 }
             }
             objc.messageconsole.write("=COLLECT=");
             break;
 
         case "collect3":
             for (let i in obj) {
                 //自機の半径n内にいるアイテムのみ　2023/1/12追加コマンド
                 if (obj[i].type == ITEM){//アイテム
                     if ( sobj.target_d( obj[i].x, obj[i].y ) < 100){//半径
                             obj[i].change_sce(30);
                     }
                 }
             }
             break;
 
         case "SIGNAL":
             if (objc.interrapt) {
                 objc.interrapt = false;
                 objc.SIGNAL = 0;
             } else {
                 objc.interrapt = true;
                 objc.SIGNAL = msg.src;
 
                 if (msg.src == 0) objc.interrapt = false;
             }
             break;
      
         case "search_target_item":
             //稼働中objに対象のCHNOが存在するか？(KEYSEARCH用) 
             //無かったら、敵の持ち物をチェックする。
             //ない場合はkeyon=false;//自分の持ち物にある場合はこれでチェックしない。
             //戻り値はState.game.keyon,key_x,key_yに入れる。
             let onflag = false;
             let wx = 0;
             let wy = 0;
 
             for (let i in obj) {
                 let wo = obj[i];
                 if (wo.type == ENEMY){//enemy
                     //wo.lighton = true;                
                     for (let j of wo.pick){
                         if (j == msg.src){
                             onflag = true;
                             wx = wo.x;
                             wy = wo.y;
                             wo.lighton = true;
                         }
                         if (onflag) break;
                     }
                     continue;
                 }
                 if (wo.type == ITEM){//item
                     //wo.lighton = true;
                     if (wo.chr == msg.src){
                         onflag = true;
                         wx = wo.x;
                         wy = wo.y;
                         wo.lighton = true;
                         break;
                     }    
                     continue;
                 }
             }
             state.Game.keyon = onflag;
             state.Game.key_x = wx;
             state.Game.key_y = wy;
 
             wlog = false; 
             break;
         default:
             execute = false;
             wlog = false; 
             break;
     }
     
     let result = {exec: execute, log:wlog};
 
     return result;
 }
 

