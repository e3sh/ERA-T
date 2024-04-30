//viewport
//size .w,.h 
//repeat
//homeposition .x,.y
//camera
//--------------------
//viewport
//x, y, w, h
//repeat  //折り返し表示の有無　overflow してる場合反対側に表示するか
//size(w,h);//
//repeat(mode);
//setPos(px,py);実座標をスプライト座標としてviewportの左上をどこに置くか指定
//viewtoReal(x,y)ビューポート変換後の画面表示座標
//（スプライト座標！＝画面表示座標とする処理
//戻り値｛x:,y:表示座標,in:(true:表示範囲内(false:表示範囲外)}
function viewport(){

    let x_, y_, w_, h_, repeat_= true;
    x_ = 0; y_ = 0, ix_ = 0, iy_ = 0;

    this.x = 0;
    this.y = 0;
    this.w = w_;
    this.h = h_;
    this.ix = ix_;
    this.iy = iy_;
    
    function update(){
        this.x = x_;
        this.y = y_;
        this.w = w_;
        this.h = h_;
        this.ix = ix_;
        this.iy = iy_;
    }
    this.repeat = function(mode=true){
        repeat_ = mode;
    }

    this.size = function(w, h){
        w_ = w; h_ = h;
        update();
    }
    this.setPos = function(x, y){
        x_ = x; y_ = y;
        update();
    }

    this.border = function(w, h){
        ix_ = w; iy_ = h;
        update();
    }

    this.viewtoReal = function(sx,sy){
        let rx = sx + x_;
        let ry = sy + y_;
        let f = false;
    
        if (repeat_){ // repeat true;
            if (rx<0)   rx = w_ + rx;
            if (rx>w_)  rx = rx % w_;
            if (ry<0)   ry = h_ + ry;
            if (ry>h_)  ry = ry % h_;
        }

        f = (rx + ix_ <0 || rx >w_+ix_ || ry + iy_ <0 || ry>h_+iy_)?false:true; 

        //console.log("x" + x_ + ",y" + y_ + ",w" + w_);

        return {x:rx, y:ry, in:f};
    }

}