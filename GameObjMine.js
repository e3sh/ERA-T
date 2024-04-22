function GameObj_Mine(){

    this.triggerDelay = 0;
    this.turlet = new turlet_vec_check();

    let MyTurlet;

    this.spriteItem;
    let reexf;

    function turlet_vec_check(){
		let turlet = 0;

        this.check = function(g, wx, wy){

            check(Search(g, wx, wy));
            //Search一番近い敵に対してターレットの方向を向かわせる。
        }

        function check(r){
			let wr = Math.trunc(180 + r - turlet)%360;
			if (wr >= 180) turlet++;
			if (wr <= 180) turlet--;
			if (wr >= 210) turlet+=3;
			if (wr <= 150) turlet-=3;
			if (wr >= 270) turlet+=3;
			if (wr <=  90) turlet-=3;
		}

        this.move = function(vr){
            turlet = (turlet + vr)%360;
        }

        this.vector = function(){
            return turlet;//turVector[turlet];
        }

        function vecToR(wx, wy){
			let r = (wx == 0)?
			((wy >= 0)?180: 0):
			((Math.atan(wy / wx) * (180.0 / Math.PI)) + ((wx >= 0)? 90:270))
			
			return (270+r)%360;
		}

        function Search(g, wx, wy){
            const l = g.sprite.itemList();
            let d = 999;
            let c = -1;
            for (let i in l){
                if (l[i].id  == "Enemy"){
                    let wd = distance({x:wx, y:wy},l[i]);// console.log(wd); 
                    if (wd <= d) {
                        c = i;
                        d = wd;
                    }
                }
            }
            let rc = -1;
            if (c != -1){
                rc = vecToR(
                    wx - l[c].x,
                    wy - l[c].y
                );
           }
           return (rc+180)%360;
        }

        function distance(s, t){
            return Math.sqrt((Math.abs(t.x - s.x) * Math.abs(t.x - s.x)) + (Math.abs(t.y - s.y) * Math.abs(t.y - s.y)));
        }
   }
    this.init = function(g){

        this.triggerDelay = 0;

        MyTurlet = {sp:g.sprite.itemCreate("Turlet", false, 32, 32) , re:false};
        MyTurlet.sp.priority = 1;

        reexf = false;
    }
  
    this.step = function(g, input, result){
        if (this.spriteItem.living){

            this.spriteItem.collisionEnable = (result.clrf)?false:true;

            if (!result.clrf){//リザルト中には発射しない
                this.turlet.check(g, this.spriteItem.x, this.spriteItem.y);
                if (this.triggerDelay < g.time()){
                    this.triggerDelay = g.time()+1000;

                    //let n = g.sprite.get();//空値の場合は未使用スプライトの番号を返す。
                    let sp = g.sprite.itemCreate("BULLET_P", true, 8, 8);
                    
                    //this.turlet.check(g, this.spriteItem.x, this.spriteItem.y);
                    let r =  this.turlet.vector();
                    let px = this.spriteItem.x + Math.cos((Math.PI/180)*r)*16
                    let py = this.spriteItem.y + Math.sin((Math.PI/180)*r)*16 

                    sp.pos(px, py, 0, 0.6 );
                    sp.move((r+90)% 360, 6, 3000);// number, r, speed, lifetime//3kf 5min
                }
            }
            //自機生存状態
            reexf = false;//爆発済みf
        }else{
            if (!reexf){
                 explose(g,
                    this.spriteItem.x, this.spriteItem.y);
                reexf = true;
                MyTurlet.sp.dispose();
            }
        }

        if (reexf) return;
    }
    
    this.draw = function(g){

        let tx = Math.trunc(this.spriteItem.x);
        let ty = Math.trunc(this.spriteItem.y);

        this.spriteItem.pos(tx, ty, (this.r+90)% 360, 0.8);
        this.spriteItem.view();
        if (MyTurlet.sp.living){
            MyTurlet.sp.pos(tx, ty, (this.turlet.vector()+90)% 360, 0.8); 
            MyTurlet.sp.r = (this.turlet.vector()+90)% 360;
            MyTurlet.sp.view();
        }
    }

    function explose(g, x, y, sr=0, w=360){

        for (let r=sr; r<w; r+=(360/12)){
            sp = g.sprite.itemCreate("BULLET_P", true, 8, 8);
            sp.pos(x, y, r);
            sp.move(r, 2, 30);// number, r, speed, lifetime//
        }
    }
}

