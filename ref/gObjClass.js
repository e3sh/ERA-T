//=============================================================
// GameObjectItem
// ゲームオブジェクトクラス
//=============================================================
function gObjectClass(obCtrl) {
    this.objCtrl = obCtrl;//ParentClass(ObjectControl)

    this.x; 			// X座標
    this.y; 			// Y座標
    this.vx; 		// VX座標
    this.vy; 		// VY座標
    this.mp; 		// MotionPattern No.
    this.vector; 	// ベクトル値(方向)
    this.visible = false; // 表示フラグ（Visible)
    this.center_x; 	// オブジェクトの中心までのX
    this.center_y; 	// オブジェクトの中心までのY　
    this.hit_x; 		// 当たり判定の大きさX
    this.hit_y; 		// 当たり判定の大きさY
    this.mp_cnt_frm = 0;    // モーションパタン用カウンタ
    this.mp_cnt_anm = 0; // モーションパタン用アニメカウント
    this.type; 		// キャラクタタイプ(98:自機 0:味方 1:自弾 2:敵 3:敵弾 4:アイテム 5:その他)
    this.chr; 		// キャラ定義の番号
    this.frame = 0; 	// キャラクタフレームカウント
    this.scenario = []; // シナリオ(ステータス別）
    this.status = 0; // ステータス(0:未使用/廃棄済 1:通常 2:衝突 3:X軸枠外 4:Y軸枠外 5:廃棄処理中）
    this.hp; 		// 耐久力 (弾の場合は攻撃力）
    this.target = -1; //ターゲットにしているオブジェクト（ない場合は－）オブジェクトの参照渡しにしてもいいが、有無をどう判断するか？ステータスチェック？
    this.crash = -1; //衝突した相手のオブジェクトNO　/これも同様に↑に同じだが－
    this.id; 		// ID
    this.name;      // 名前
    this.score = 0; 	//倒したときのスコア
    this.triger = 0; //トリガーの抑止間隔
    this.shot = 0; 	//ショットフラグ
    this.alpha = 255; // ALPHA値(透明度)0:透明～255:不透明
    this.display_size = 1.0; //表示拡大率
    
    this.weight = 1.0; 

    this.message = []; //メッセージスタック

    //sprite motioncontrol param:モーションパタン関連/サイズやアルファグラフィックス関連も？
    //state 状態に関連する奴かな/シナリオで直接参照するやつをまとめてしまってもいいか
    //graphicsState　
    //obstate　基本だから入れなくてもいいか
    //gameparamate　scoreとか
    //systemState

    this.normal_draw_enable = true;
    this.custom_draw_enable = false;

    this.damageflag = false;

    this.damage = { count: 0, vector: 0, dist: 0, no: 0 };

    this.attack = 1;

    this.mapCollision = false;
    this.mapColX = false;
    this.mapColY = false;

    this.alive = 0;

    this.custom_draw = null;

    this.old_x = this.x;
    this.old_y = this.y;

    this.lighton = false; //SubMapで強調表示するか？drawPointで使用。2023/01/30
    this.prioritySurface = false; //SP面以外に表示する場合に、BoolでfalseでDrawで標準面に表示しtrueで表示しない。
    //(Booleanで運用するか、表示面[数値]で運用するかは状況次第）で。ObjCtrlにDrawPs実装し、GameSceneから呼ぶ 。2023/01/30  

    this.shiftx = 0; //扱い座標と表示座標をずらす場合に使用 2023/02/02
    this.shifty = 0; //

    //this.jump; this.jumpcount; //これはplayerでしか使用しないから個別でよい
    //this.jump = 0; //敵でも使うのでここに追加
    //this.jpvec = -5.0;

    this.vecfrm;//1秒で60stepを実行するとしたときを1としたときの、DeltaTimeとの割合(1stepの移動量vx,vyに掛ける)
    this.barthTime;

    //Typeによって当たり判定/ダメージ判定をするが、//
    //状況により個別に判定状態を切り替えられるようにフラグ管理も追加。2023/02/03
    //this.colcheck = true; //false true:当たり判定する。//対objということで地形はtypeで判定
    //this.dmgcheck = true; //false trueの場合　o.hp-o.attackする。アイテムの場合はセット時にattack0,かな
    const PLAYER=98, FRIEND = 0, BULLET_P= 1;
    const ENEMY = 2, BULLET_E=3;
	const ITEM  = 4, ETC    = 5;

    this.setType = function(type){
        this.name = "unknown";

        this.type = type;
        //type （98:自機、0:味方、1:自弾、2:敵機、3:敵弾、4:アイテム、5:只の絵）
        this.colcheck = !(type == ETC);
        this.dmgcheck = !(type == ITEM || type == ETC);
    
        if (type == PLAYER || type == FRIEND || type == ENEMY){ //自機、味方、敵
            this.jump = 0; //敵でも使うのでここに追加
            this.jpvec = -5.0;
            
            this.spec = {LV:0};//敵の武器を表示するのに自分と共有処理の為、参照している
            // 
            /*
                LV: 0, //WeaponLevel ( = state.Game.player.level) 
                HP: 0, //Maxhp (notuse)
                MP: 0, //MagicPoint (notuse) 
                STR: 0,
                DEX: 0,
                AGI: 0,
                VIT: 0, //HPrecover+ : init 3 +
                INT: 0, //BombPower+ : init -10
                MND: 0, //ShieldTime+: init 300flame(5s) +
                LAK: 0,
                ETC: 0
            }
            //キャラクタの内部パラメータ用(Obj以外のリストで持たせてIDで管理でもいいが、
            //バトルシステム的な部分は定まっていないのでこんな感じで
            /*
            let health = [];//Buff.Debuffのリスト配列(オブジェクトでもよいかも)
            let bag = [];//持ち物とか（IDでのリスト）
            */
        }
    }

    //角度からラジアンに変換
    function ToRadian(d) { return (d * (Math.PI / 180.0)); }

    //ラジアンから角度に変換
    //
    function ToDegree(r) { return (r * (180.0 / Math.PI)); }
}

//メソッドのprototype宣言部　===================================
gObjectClass.prototype = {

    test : function () { return 0; },
    reset : function () {
        const ETC=5;

        this.status = 0; //StatusValue.NoUse;
        this.type = ETC;   //TypeValue.Etc;
        this.visible = false;
        this.mp_cnt_frm = 0;
        this.mp_cnt_anm = 0;

        this.scenario = [];

        this.normal_draw_enable = true;
        this.custom_draw_enable = false;

        this.damageflag = false;
    },

    //移動物処理用の関数のデフォルト
    init : function(scrn, o) { o.vset(5); },
    draw : function (scrn, o) { scrn.print(o.mp + "", o.x, o.y); }, 
    move : function(scrn, o) {
        // 移動処理
        //o.x += o.vx; o.y += o.vy;
        o.x += (o.vx * o.vecfrm);  o.y += (o.vy * o.vecfrm);

        let f = 0;
        if (o.x < 0 || o.x > scrn.cw) { f = 1; }
        if (o.y < 0 || o.y > scrn.ch) { f = 1; }

        if (f != 0) return -1;
        
        return 0
    },

    //class内部コマンド群
    vset : function (num) {

        this.vx = Math.cos((Math.PI / 180.0) * (this.vector - 90.0)) * num;
        this.vy = Math.sin((Math.PI / 180.0) * (this.vector - 90.0)) * num;

        //30->60fpsに変更したときにシナリオ修正するのが面倒だった名残
        //this.vx /= 1.5;
        //this.vy /= 1.5;
    },

    //外部メッセージ送信コマンドsubroutine
    set_object : function (src, dst) { //src:ch dst:dummy
        let msg = {}; msg.cmd = "set_object";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    set_object_ex : function (src, tx, ty, tv, tsce, id) {
    //src:ch tx,ty,tv,tsce =x,y,vector,scenario_no
        let msg = {};

        let dst = {};
        dst.x = tx;
        dst.y = ty;
        dst.vector = tv;
        dst.sce = tsce;
        dst.id = id;

        msg.cmd = "set_object_ex";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    get_target : function (src, dst) { //src:ch type dst:dummy
        let msg = {}; msg.cmd = "get_target";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    change_sce : function (src, dst) { //src:scenario_no dst:dummy
        let msg = {}; msg.cmd = "change_sce";

        this.frame = 0;
        this.normal_draw_enable = true;
        this.custom_draw_enable = false;

        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    add_score : function (src, dst) { //src:score dst:dummy
        let msg = {}; msg.cmd = "add_score";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    get_item : function (src, dst) { //src:chr dst:id
        let msg = {}; msg.cmd = "get_item";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    //ここらへんからは外に出してしまってもいいかも
    //bomb系コマンド群（全体に影響を与える）
    bomb : function (src, dst) { //src,dst:dummy
        let msg = {}; msg.cmd = "bomb"; 
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    bomb2 : function (src, dst) { //src,dst:dummy
        let msg = {}; msg.cmd = "bomb2";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    bomb3 : function (src, dst) { //src,dst:dummy
        let msg = {}; msg.cmd = "bomb3";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    bomb4 : function (src, dst) { //src,dst:dummy
        let msg = {}; msg.cmd = "bomb4";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    collect : function (src, dst) { //src,dst:dummy
        let msg = {}; msg.cmd = "collect";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    collect2 : function (src, dst) { //src,dst:dummy　add_2023/1/12　
        let msg = {}; msg.cmd = "collect2";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    collect3 : function (src, dst) { //src,dst:dummy　add_2023/1/12　
        let msg = {}; msg.cmd = "collect3";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },

    //System系コマンド（ゲームの推移に対しての指示）
    SIGNAL : function (src, dst) { //src:SIGNAL_no:処理は受け入れ側で考える,dst:dummy
        let msg = {}; msg.cmd = "SIGNAL";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },
    //itemCombo処理用
    reset_combo : function (src, dst) { //src:Combo_id,dst:dummy
        let msg = {}; msg.cmd = "reset_combo";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },
    //itemのchrでフィールドに存在するか調べる。（KeyInformationCursor実装用）
    //SIGNALだとGameSceneに指示なのでコマンド追加。2023/01/29
    search_target_item : function (src, dst) { //src:chr番号,dst:dummy
        let msg = {}; msg.cmd = "search_target_item";
        msg.src = src; msg.dst = dst; this.message.push(msg);
    },
    //chrNoからmotion_ptnの0番のSpNameを返す。
    dict_ch_sp: function (chr) { //chr:chr番号, return:Spname; add_2024/04/06
        return this.objCtrl.dict_Ch_Sp( chr );
        
    },
    //自分から目標( tx, ty )の
    //	方向角度を調べる(上が角度0の0-359)
    target_r : function (tx, ty) {
        let x = this.x;
        let y = this.y;

        let r;

        let wx = tx - x;
        let wy = ty - y;

        if (wx == 0) {
            if (wy >= 0) r = 180; else r = 0;
        } else {
            r = Math.atan(wy / wx) * (180.0 / Math.PI) //toDegree

            if ((wx >= 0) && (wy >= 0)) r = 90 + r;
            if ((wx >= 0) && (wy < 0)) r = 90 + r;
            if ((wx < 0) && (wy < 0)) r = 270 + r;
            if ((wx < 0) && (wy >= 0)) r = 270 + r;
        }

        return r;
    },
    //自分からtargetに方向転換する処理
    //戻り値がtargetの方向。
    target_v : function () {
        return (!Boolean(this.target)) ? this.vector : this.target_r(this.target.x, this.target.y);
    },
    //自分からtargetに方向転換する処理
    //	ホーミング処理用
    target_rotate_r : function (add) {
        if (!Boolean(this.target)) return;

        let r = this.target_r(this.target.x, this.target.y);
        let d = r; 			//目標角
        if (d > 179) d = -360 + d;

        w = this.vector; //現在の角度
        if (w > 179) w = -360 + w;

        r = d - w;
        if (Math.abs(r) > 180) {
            w = (this.vector + 180) % 360;
            if (w > 179) w = -360 + w;
            r = (d - w) * -1;
        }

        if (Math.abs(r) < add) add = r; //目標角が指定値より小さい場合は小さいままで

        if (r != 0) this.vector = this.vector + ((r / Math.abs(r)) * add);
        if (this.vector < 0) this.vector = 360 + this.vector;
        if (this.vector > 359) this.vector = this.vector - 360;
    },
    //距離を求める。
    target_d : function (tx, ty) {
        let x = this.x;
        let y = this.y;

        return Math.sqrt((Math.abs(tx - x) * Math.abs(tx - x)) + (Math.abs(ty - y) * Math.abs(ty - y)));
    },
    //指定角度回転
    rotate: function(r){
        r = r % 360;
        r = (r > 179)? -360 + r:r;
        this.vector = (this.vector + r);
    },

    // sin 0-360 ↑方向が0の数値をいれて処理する
    Sin : function (vec) { return Math.sin((vec - 90) * (Math.PI / 180.0)); },

    // cos 0-360 ↑方向が0の数値をいれて処理する
    Cos : function (vec) { return Math.cos((vec - 90) * (Math.PI / 180.0)); },

    sc_move : function()
    {
        const PLAYER=98, FRIEND = 0, BULLET_P= 1;
        const ENEMY = 2, BULLET_E=3;
        const ITEM  = 4, ETC    = 5;

        let onst = this.gt.in_view_range(this.x - (this.hit_x / 2), this.y - (this.hit_y / 2), this.hit_x, this.hit_y);

        let f = 0;
        if (this.status == 2) {//状態が衝突の場合
            switch (this.type) {//自身のタイプが...
            case BULLET_P : //自弾
            case BULLET_E : //敵弾
                if (onst) this.sound.effect(12); //hit音
                this.change_sce("effect_vanish"); 
                this.damageflag = false;
                //↑ここで弾を消しているので削除すると弾が消えなくなる。2023/01/20消してしまってbugったので記録。
                break;
            case ENEMY : //敵
                //this.display_size *= 2; //爆発を大きくする
                this.change_sce("effect_bomb_x");//7
                if (onst) this.sound.effect(8); //爆発音 
                
                //this.pick[35] = Math.floor(Math.random() * 3) + 1;
                for (let i = 0, loopend = Math.floor(Math.random() * 3) + 1; i < loopend; i++) {//Coin
                    //this.set_object_ex(35, this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
                    this.pick.push(35);//Coin
                }
                //敵が拾ったアイテムを落とす。
                let itemf = false;
                let num = 0; 
                //for (let i = 0, loopend = this.pick.length; i < loopend; i++) {
                for (let i of this.pick) if ( i != 35 ) num = num + i;
                    //this.set_object_ex(num, this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
                if (num > 0) itemf = true;//敵がCoin以外の何かを拾っていた場合true(宝箱を出すようにする）
                
                if (itemf) {
                    this.set_object_ex(40, this.x, this.y, 0, "enemy_trbox");//宝箱
                }else{
                    //for (let i = 0; i < this.pick[35]; i++) {//Coin
                    for (let i in this.pick) {
                        this.set_object_ex(35, this.x, this.y, Math.floor(Math.random() * 360), "item_movingstop");
                    }
                }
                this.add_score(this.score);
                break;
            case ITEM : //アイテム(敵がアイテムを取得する場合の事は考えていない。/<=拾うようにした）
                if (Boolean(this.crash)) {
                    if (this.crash.pick_enable) {//
                        this.change_sce(6); //拾われたので消す
                        if (this.crash.type == ENEMY) {//相手が敵の場合
                            this.crash.pick.push(this.chr);
                        } 
                        if (this.crash.type == PLAYER) {//自分の場合
                            if ((this.chr != 21) && (this.chr != 22)) {//1up or Key
                                this.sound.effect(9); //cursor音
                            }
                            this.get_item(this.chr, this.id);
                        }
                    }
                }
                break;
            default:
                break;
            }
        }

        if (this.damageflag){
            this.damage.count = 30;
            //let onst = this.gt.in_view_range(this.x - (this.hit_x / 2), this.y - (this.hit_y / 2), this.hit_x, this.hit_y);
            if (onst) {
                this.set_object_ex(6, this.x, this.y, this.vector, "effect_hit");
                //this.sound.effect(12); //hit音
            }
        }
        //ここから移動処理
        let wvec = this.vector;
        let wvx = this.vx; let wvy = this.vy;

        if (this.damage.count > 0) {
            this.damage.count--;
            this.vector = (this.damage.vector + 180) % 360;
            this.vset(this.damage.dist / (10 * this.weight));//反射移動
            if (this.damage.count <15) this.vset(0); //硬直時間 
        }

        if (this.status == 0) f = 1; //未使用ステータスの場合は削除

        // 移動処理
        if (this.mapCollision != true) {
            this.colcnt = 0;

            this.old_x = this.x;
            this.old_y = this.y;

            //this.x += this.vx;
            //this.y += this.vy;
            this.x += (this.vx * this.vecfrm);
            this.y += (this.vy * this.vecfrm);

            this.vector = wvec;
            this.vx = wvx;
            this.vy = wvy;
        } else {
            if (this.colcnt <= 0) {
                this.x = this.old_x;
                this.y = this.old_y;

                switch (this.type) {//自身のタイプが...
                case BULLET_P : //自弾
                case BULLET_E : //敵弾
                    f = 1;
                    break;
                default:
                    if (this.mapColX) {
                        this.vx *= -1;
                        this.vector = 360 - this.vector;
                        if (this.vector < 0) this.vector = 180 + (180 + this.vector);
                    }
                    if (this.mapColY) {
                        this.vy *= -1;
                        this.vector = 180 + this.vector;
                        if (this.vector > 360) this.vector = 360 + 180 - this.vector;
                        this.vector = this.vector % 360;
                    }
                    if ((!this.mapColX) && (!this.mapColY)) {
                        this.vx *= -1;
                        this.vy *= -1;
                        this.vector = (this.vector + 180) % 360;
                    }
                    break;
                }
            }
            this.colcnt++;
            
            if (this.colcnt > 10) {//30
                this.vector = this.target_r(this.startx, this.starty);
                this.vset(1);

                this.x += this.vx ;// * (this.colcount - 30);
                this.y += this.vy; //* (this.colcount - 30);
            }
        }
        //if (this.x < 0 || this.x > this.gt.ww) { f = 2; }
        //if (this.y < 0 || this.y > this.gt.wh) { f = 2; }

        
        if (f != 0) {
            if (f == 2) this.reset_combo(this.type);
            return -1; //0以外を返すと削除される。
        };
        /*    
        if (this.colcnt > 60) {
            if (Boolean(this.crash)) {
                   //この場合は物に当たっているはず(味方同士とか）
                this.crash.mapCollision = false;
            } else {
                this.colcnt =  Math.floor(Math.random() * 60)
            }
        }
        */
        this.damageflag = false;

        return 0;
    }
}
