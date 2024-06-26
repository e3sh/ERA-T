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
        function normal_move(delta){
            this.alive--;

            this.x += this.vx * (delta/(1000/60));
            this.y += this.vy * (delta/(1000/60));

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

            let rf = true;                       
            if (Boolean(g.viewport)){
                let rs = g.viewport.viewtoReal(x,y);
                x  = rs.x;
                y  = rs.y;
                rf = rs.in;
            }
            if (rf){
                if (!Boolean(pattern_[this.id])){
                    buffer_.fillText( this.index + " " + this.count , x, y);
                }else{
                    spPut(pattern_[this.id].image, pattern_[this.id].pattern[this.pcnt], x, y, r, z);
                    this.count++;
                    if (this.count > pattern_[this.id].wait) { this.count = 0; this.pcnt++; }
                    if (this.pcnt > pattern_[this.id].pattern.length - 1) { this.pcnt = 0; }
                }
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
        //simple = true;

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
                    sw.moveFunc(g.deltaTime());
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
                        let rx= sw.x;
                        let ry= sw.y;
                        let rf = true;                       
                        if (Boolean(g.viewport)){
                            let rs = g.viewport.viewtoReal(rx,ry);
                            rx = rs.x;
                            ry = rs.y;
                            rf = rs.in;
                        }
                        if (rf){
                            if (!Boolean(pattern_[sw.id])) {
                                buffer_.fillText(i + " " + sw.count, rx, ry);
                            } else {
                                spPut(pattern_[sw.id].image, pattern_[sw.id].pattern[sw.pcnt], rx, ry, sw.r, sw.z);
                                sw.count++;
                                if (sw.count > pattern_[sw.id].wait) { sw.count = 0; sw.pcnt++; }
                                if (sw.pcnt > pattern_[sw.id].pattern.length - 1) { sw.pcnt = 0; }
                            }
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
}