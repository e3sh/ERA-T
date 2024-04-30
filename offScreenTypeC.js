
// offScreenクラス
// (offscreen buffer)
//
// offScreenCanvasに随時描画
//(Chrome69＿Sep.2018でサポートとの事なので対応
//
//一度作成したらあまり書き換えないといった使い方をする場合に良い
//UIを作成したあとにフレーム毎ではなく必要時書き換えで使うとか
//全画面表示したいので表示はキャンバスを重ねないようにする
//(mainのCanvasに全部表示させる）

function offScreenTypeC( w, h, ix, iy ){//typeOffscreenCanvas版
    //w : width, h:height
    let element = new OffscreenCanvas( w, h );

    const offset_x = ix;
    const offset_y = iy;
/*
const offscreenCanvas = new OffscreenCanvas(200, 200);
const offscreenContext = offscreenCanvas.getContext('2d');
offscreenContext.fillStyle = 'red';
offscreenContext.fillRect(0, 0, 200, 200);

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.drawImage(offscreenCanvas, 0, 0);
*/
//2018頃にOFFSCREENcanvasが実装されたみたいなのでOFFSCREENCとして実装

    //var element = document.createElement("canvas");
    //element.width = w;
    //element.height = h;

    let device = element.getContext("2d");

    let enable_draw_flag = true;
    let enable_reset_flag = true;

    let _2DEffectEnable = false;//事前にオンしないと効果が動作しない(DEBUG)
    let view_angle = 0;

    this.view = function ( flg ){ //flg : bool
        if (typeof flg == "boolean") {
            enable_draw_flag = flg;
        }
        return enable_draw_flag;
    }

    this.flip = function( flg ){
        if (typeof flg == "boolean") {
            enable_reset_flag = flg;
        }
        return enable_draw_flag;
    }
    //2024/04/29 new Function turn
    this.turn = function( r ){
        if  (_2DEffectEnable) 
            view_angle = r;
    }

    this._2DEF = function(f){
        _2DEffectEnable = f

        if (f) {
            //回転で枠外が乱れるのでBackbufferを縦横2倍にする
            element = new OffscreenCanvas( w*2, h*2 );
            //書き込み位置の原点(0,0)を中心近くに寄せる
            device = element.getContext("2d");
            device.translate(w/2,h/2);
        } else {
            element = new OffscreenCanvas( w, h );
            device = element.getContext("2d");
            device.translate(0, 0);
        }
    }

    //this.flip = function ( outdev ) {

    //    outdev.putImageData(device.getImageData(0, 0, element.width, element.height), 0, 0);
    //}

    //-------------------------------------------------------------
    //SP_PUT
    //use img, sx, sy, sw, sh, dx, dy, dw, dh, m11, m12, m21, m22, tx, ty, alpha, r
    //-------------------------------------------------------------
    this.spPut = function (img, sx, sy, sw, sh, dx, dy, dw, dh, m11, m12, m21, m22, tx, ty, alpha, r) {

        device.save();
        if (_2DEffectEnable){tx+=w/2; ty+=h/2};
        device.setTransform(m11, m12, m21, m22, tx, ty);
        if (r != 0) { device.rotate(Math.PI / 180 * r); }

        if (alpha == 255) {
            device.globalCompositeOperation = "source-over";
        } else {
            //if (this.light_enable) device.globalCompositeOperation = "lighter"; //source-over
            device.globalAlpha = alpha * (1.0 / 255);
        }
        //if (_2DEffectEnable){device.translate(w/2,h/2);};
        device.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

        device.restore();
        //device.setTransform( 1,0,0,1,0,0 );
    }

    //-------------------------------------------------------------
    //DRAWIMG_XYWH_XYWH
    //use img, sx, sy, sw, sh, dx, dy, dw, dh
    //-------------------------------------------------------------
    this.drawImgXYWHXYWH = function (img, sx, sy, sw, sh, dx, dy, dw, dh) {

        device.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }

    //-------------------------------------------------------------
    //FILLTEXT
    //use text, sx, sy, color
    //-------------------------------------------------------------
    this.fillText = function (str, x, y, c) {

        if (!Boolean(c)) { c = "limegreen"; }

        device.fillStyle = c;
        device.fillText(str, x, y);
    }
   
    //------------------------------------------------------------
    //DRAWIMG_XY
    //use img, sx, sy, sw, sh
    //------------------------------------------------------------
    this.drawImgXY = function (img, sx, sy) {
        
        device.drawImage(img, sx, sy);
    }

    //------------------------------------------------------------
    //DRAWIMG_XYWH
    //use img, sx, sy, sw, sh
    //------------------------------------------------------------
    this.drawImgXYWH = function (img, sx, sy, sw, sh) {

        device.drawImage(img, sx, sy, sw, sh);
    }

    //------------------------------------------------------------
    //PUTIMAGETRANSFORM
    //use img, m11, m12, m21, m22, tx, ty
    //------------------------------------------------------------
    this.putImageTransform = function (img, x, y, m11, m12, m21, m22) {

        device.save();

        device.setTransform(m11, m12, m21, m22, x, y);
        device.drawImage(img, 0, 0);

        device.restore();
    }

    //---------------------------------------------------------
    //TRANSFORM
    //use m11, m12, m21, m22, tx, ty
    //---------------------------------------------------------
    this.transform = function (m11, m12, m21, m22) {
        //dummy
    }

    //------------------------------------------------------------
    // クラスで表示コマンドを登録して表示させる。
    // 引数 cl:class
    //------------------------------------------------------------
    this.putFunc = function (cl) {

        cl.draw(device);
        //ここで登録するクラスには表示の為に"draw( device )" functionを必ず登録
    }

    //---------------------------------------------------------
    //ALLCLEAR
    //use sx, sy, sw, sh
    //---------------------------------------------------------
    this.allClear = function (sx, sy, sw, sh) {

        device.save();

        device.setTransform(1, 0, 0, 1, 0, 0);
        device.clearRect(sx, sy, sw, sh);

        device.restore();
    }

    //-----------------------------------------------------
    //FILLRECT
    //use sx, sy, sw, sh, color
    //----------------------------------------------------
    this.fillRect = function (sx, sy, sw, sh, color) {

        if (Boolean(color)) {
            device.fillStyle = color;
            device.fillRect(sx, sy, sw, sh);
        } else {
            device.clearRect(sx, sy, sw, sh);
        }
    }

    //----------------------------------------------------------
    //描画バッファ配列のリセット(offScreenバッファのクリア)
    //----------------------------------------------------------
    this.reset = function () {

        if (enable_reset_flag){
            this.allClear(0, 0, w, h);
        }
    }

    //----------------------------------------------------------
    //(flameloopで実行用）offScreenバッファのクリア
    //----------------------------------------------------------
    this.reflash = function () {

        if (enable_reset_flag){
            this.reset();
        }
    }

    //----------------------------------------------------------
    //描画
    //----------------------------------------------------------
    this.draw = function ( outdev ) {
        //2024/04/29 new Function turn
        if (enable_draw_flag){
            if (!_2DEffectEnable){ 
                //outdev.clearRect(0, 0, w, h);
                outdev.drawImage(element, offset_x, offset_y);
            }else{
                let w = element.width;
                let h = element.height;

                outdev.fillStyle = "green";
                outdev.fillRect(0,0,w/2,h/2);

                //outdev.clearRect(0, 0, w/2, h/2);
                
                outdev.save();
                outdev.translate(w/4,h/4);
                outdev.rotate((Math.PI/180)*((view_angle)%360));
                
                outdev.drawImage(element, offset_x-w/2, offset_y-h/2);
                //outdev.drawImage(element, offset_x, offset_y);

                outdev.restore();
                //console.log("e" + view_angle%360);
                device.fillStyle = "red";
                device.fillRect(-w/4,-h/4,w,h);
            }
        }
    }
    //----------------------------------------------------------
    //
    //----------------------------------------------------------
    this.count = function () {
        //dummy
        return "mode";
    }

    //----------------------------------------------------------
    //
    //----------------------------------------------------------
    this.max = function () {
        //dummy
        return "C";
    }



    //
}



