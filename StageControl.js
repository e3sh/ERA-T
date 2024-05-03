function StageControl(game){

	const ROW = 60;
	const COL = 80;

	let block;
	let blkcnt;
	let rank;

	let g = game;

	this.init = function(){

		rank = 1;
		block = resetblock({on:false, break:false, hit:false, hp:5});

	}

	this.change = function(stage, GObj){

		rank = stage;

		//if (stage%10==1){
		//block = resetblock({on:false, break:false, hit:false, hp:5});

		//setblock( 1, 1, 78, 50,{on:false, break:false, hit:false});
		//setblock(20,20, 40, 10,{on:true, break:false, hit:false});
		//setblock(20,20, 40, 10,{on:true, break:false, hit:false, hp:5});
		//}


		// 0000003F MAPDATA
		// 00000FB0 FORMAT
		// 0003F000 
		// 00FB0000
		// 3F000000
		//let mapform = "3FFFFFFF";
		//let mapform =   "0048C480";//X

		const mapform = [
			"00000000"
			,"0000C000"
			,"00000080"
			,"00000400"
			,"00080000"
			,"00400000"
			,"00021000"
		]
		//let mapform = "00000020";
		//let mapform =   "00000480";//- -
		//let mapform =   "00480000";//- - 
		//let mapform =   "00480480";

		mapping(mapform[rank%7]); 

		let enemy = new GameObj_FlyCanon();
		enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
		//enemy.spriteItem.move(120,1,180);
		//enemy.spriteItem.view();
		
		let t = (rank%2==0)?-1:1;
		let d = (Math.trunc(rank/10)+1)
		let rn = Math.trunc(Math.random()*300);

		enemy.spriteItem.pos(320+t*160,30);

		enemy.init(g,1000/d + rn,(10/d)*t);

		GObj.push(enemy);

		if (rank >= 3){
			rn = Math.trunc(Math.random()*300);
			enemy = new GameObj_FlyCanon();
			enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
			enemy.spriteItem.pos(320,30);
			enemy.spriteItem.move(180, 2, 1000);
			enemy.init(g,1000/d+rn,5*t);
			GObj.push(enemy);
		}
		if (rank >= 5){
			rn = Math.trunc(Math.random()*300);
			enemy = new GameObj_FlyCanon();
			enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
			enemy.spriteItem.pos(320-t*160,30);
			enemy.init(g,1000/d+rn,(10/d)*-t);
			GObj.push(enemy);
		}
		if (rank >= 7){
			rn = Math.trunc(Math.random()*300);
			enemy = new GameObj_FlyCanon();
			enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
			enemy.spriteItem.pos(320-t*280,30);
			enemy.spriteItem.move(180, 2, 1000);
			enemy.init(g,1000/d+rn,(10/d)*-t);
			GObj.push(enemy);

			rn = Math.trunc(Math.random()*300);
			enemy = new GameObj_FlyCanon();
			enemy.spriteItem = g.sprite.itemCreate("Enemy", true, 28, 28);
			enemy.spriteItem.pos(320+t*280,30);
			enemy.spriteItem.move(180, 2, 1000);
			enemy.init(g,1000/d+rn,(10/d)*t);
			GObj.push(enemy);

		}
	}

	function resetblock(sw){

		let blk = new Array(ROW);
		for (let j=0; j<ROW; j++){
			blk[j] = new Array(COL);
			for (let i=0; i<COL; i++){
				blk[j][i] = {}//new sw;
				blk[j][i].on = sw.on;
				blk[j][i].break = sw.break;
				blk[j][i].hit = sw.hit;
				blk[j][i].hp = sw.hp;
			}
		}
		return blk;
	}

	function setblock(x, y, w, h, sw){

		//let blk = new Array(ROW);
		for (let j=y; j<y+h; j++){
			//blk[j] = new Array(COL);
			for (let i=x; i<x+w; i++){
				//blk[j][i] = {}//new sw;
				block[j][i].on = sw.on;
				block[j][i].break = sw.break;
				block[j][i].hit = sw.hit;
				block[j][i].hp = sw.hp;
			}
		}
	}

	function mapping(mds){
		const W = Math.trunc(COL/6);
		const H = Math.trunc(ROW/5);

		let n = parseInt(mds, 16); 
		for (let j=0; j<5; j++){
			for (let i=0; i<6; i++){
				if ((n&1)!=0) {
					setblock(i*W, j*H, W, H,{on:true, break:false, hit:false, hp:1});
				}
				n = n>>1;
				//console.log(n);
			}
		}
	}

	this.step = function(g, input, result){

		

		let spriteTable = g.sprite.itemList();

		//---------------------breakcheck(block sprite hit check
		for (let i in spriteTable){
			let p = spriteTable[i];

			let sp = spriteTable[i];
			if (!sp.living) continue;
			if (!sp.collisionEnable) continue;
			if (!sp.visible) continue;

			let w = p.collision.w;
			let h = p.collision.h;
			for (let cx = Math.trunc((p.x-(w/2))/8); cx <= Math.trunc((p.x+(w/2))/8); cx++){
				for (let cy = Math.trunc((p.y-(h/2))/8); cy <= Math.trunc((p.y+(h/2))/8); cy++){
					//console.log("loop" + cx + "," + cy);
					mapCheck(p, cx,cy);
				}
			}
		}
		//---
		function mapCheck(p, cx, cy){
			if (cy>=0 && cy < block.length){
				if (cx>=0 && cx < block[cy].length){
					if (block[cy][cx].on){
						if (p.id.substring(0,8) == "BULLET_P"){
							block[cy][cx].hp--;
							if (block[cy][cx].hp < 0){
								block[cy][cx].on = false;
								block[cy][cx].break = true;
								block[cy][cx].hit = false;//true;
							}
							if (p.id != "BULLET_P2") p.dispose();
							result.score ++;
						}
						/*
						if (p.id == "BULLET_P2"){
							block[cy][cx].hp--;
							if (block[cy][cx].hp < 0){
								block[cy][cx].on = false;
								block[cy][cx].break = true;
								block[cy][cx].hit = false;//true;
							}
							//p.dispose();
							result.score ++;
						}
						*/
						if (p.id == "BULLET_E"){
							block[cy][cx].hp--;
							if (block[cy][cx].hp < 0){
								block[cy][cx].on = false;
								block[cy][cx].break = true;
								block[cy][cx].hit = false;//true;
							}
							p.dispose();
						}
						if (p.id == "Player"){
							p.wall = true;
							block[cy][cx].on = false;
							block[cy][cx].break = true;
							block[cy][cx].hit = true;
						}
						//console.log("cx,cy" + cx + "," + cy);
						if (p.id == "ARMOR_P"){
							p.wall = true;
						}
						if (p.id == "Enemy"){
							p.wall = true;
						}
					}
					if (block[cy][cx].hit){
						if (p.id == "Player"){
							p.slow = true;
						}
						if (p.id == "Enemy"){
							p.slow = true;
						}
					}
				}
			}
		}
	}

	this.mapDamage = function(sp){
		let p = sp;
		let w = p.collision.w;
		let h = p.collision.h;
		for (let cx = Math.trunc((p.x-(w/2))/8); cx <= Math.trunc((p.x+(w/2))/8); cx++){
			for (let cy = Math.trunc((p.y-(h/2))/8); cy <= Math.trunc((p.y+(h/2))/8); cy++){
				//console.log("loop" + cx + "," + cy);
				if ((cx>=0 && cx<COL) && (cy>=0 && cy<ROW)){
					block[cy][cx].hit = true;
				}
			}
		}
	}

	this.draw = function(g){

		const vp = g.viewport.viewtoReal;
		
		let l = (Math.trunc(g.time()/250)%2);

		let r = vp(0,0);
		g.screen[0].fill(r.x, r.y, g.RESO_X, g.RESO_Y, "darkslategray");

		blkcnt = 0;
		for (let j=0; j<ROW; j++){
			for (let i=0; i<COL; i++){
				if (block[j][i].on){
					let r = vp(i*8,j*8);
					let x = r.x;
					let y = r.y;
					if (r.in){
						if (block[j][i].hp != 0){
							g.screen[0].fill(x,y,8,8,"lightgray");//"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",128)");
							g.screen[0].fill(x,y,7,7,"gray");//"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",128)");
						}else{
							g.screen[0].fill(x+1,y+1,5,5,"gray");//,"rgb(" + (i*8)%256 + "," + (j*8)%256 + ",255)");
						}
						blkcnt++;
				}
				}

				if (block[j][i].hit){
					let r = vp(i*8,j*8);
					let x = r.x;
					let y = r.y;
					if (l==0){
						g.screen[0].fill(x+4,y+4,2,1,"red");//"rgb(" + (i*8)%64+128 + "," + (j*8)%64+128 + ",127)");
					}else{
						g.screen[0].fill(x+4,y+4,1,1,"red");//"rgb(" + (i*8)%64+128 + "," + (j*8)%64+128 + ",127)");
					}
					//g.screen[0].fill(i*32+14,j*32+2,4,2,"rgb(" + (i*8)%64+128 + "," + (j*8)%64+128 + ",127)");
				}
				
			}
		}
	}
   
}