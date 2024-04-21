function GameObject(){let t,i,e,s,h,n;this.r=0,this.vr=0,this.x=0,this.y=0,this.old_X=0,this.old_y=0,this.triggerDelay=0,this.op={ptr:0,x:Array(40),y:Array(40),r:Array(40)},this.turlet=new function(){let t=0;this.vecToR=function(t,i){return(270+(0==t?i>=0?180:0:Math.atan(i/t)*(180/Math.PI)+(t>=0?90:270)))%360},this.check=function(i){let e=Math.trunc(180+i-t)%360;e>=180&&t++,e<=180&&t--,e>=210&&(t+=3),e<=150&&(t-=3),e>=270&&(t+=3),e<=90&&(t-=3)},this.move=function(i){t=(360+t+i)%360},this.vector=function(){return t}};let r,o=0;this.spriteItem;let l=!1;function a(t,i,e,s=0,h=360){for(let n=s;n<h;n+=30)sp=t.sprite.itemCreate("BULLET_P",!0,8,8),sp.pos(i,e,n),sp.move(n,2,30)}this.init=function(o){this.r=0,this.vr=0,this.x=this.spriteItem.x,this.y=this.spriteItem.y,this.old_x=this.x,this.old_y=this.y,this.triggerDelay=0,this.op.ptr=0,this.op.x.fill(this.x),this.op.y.fill(this.y),this.op.r.fill(0),this.spriteItem.mode=0,t={sp:o.sprite.itemCreate("Turlet",!1,32,32),re:!1},t.sp.priority=1,i={sp:o.sprite.itemCreate("FRIEND_P",!0,32,32),re:!1},e={sp:o.sprite.itemCreate("Turlet",!1,32,32),re:!1},s={sp:o.sprite.itemCreate("ARMOR_P",!0,32,32),re:!1},h={sp:o.sprite.itemCreate("ARMOR_P",!0,32,32),re:!1},n={sp:o.sprite.itemCreate("ARMOR_P",!0,32,32),re:!1},r=!1,l=!1,i.sp.dispose(),i.re=!0,e.sp.dispose(),e.re=!0,s.sp.dispose(),s.re=!0,h.sp.dispose(),h.re=!0,n.sp.dispose(),n.re=!0},this.step=function(p,c,m){this.spriteItem.collisionEnable=!m.clrf;let u=c.x,f=c.y,d=c.trigger,y=!(!c.left&&!c.right);if(d&&this.triggerDelay<p.time()){this.triggerDelay=p.time()+250;let t=p.sprite.itemCreate(l?"BULLET_P2":"BULLET_P",!0,8,8),e=this.turlet.vector(),s=this.x+16*Math.cos(Math.PI/180*e),h=this.y+16*Math.sin(Math.PI/180*e);t.pos(s,h,0,.6),t.move((e+90)%360,6,3e3),i.sp.living&&(op=this.op,t=p.sprite.itemCreate("BULLET_P",!0,8,8),t.pos(op.x[op.ptr%op.x.length],op.y[op.ptr%op.x.length],0,.6),t.move((op.r[op.ptr%op.x.length]+90)%360,6,3e3))}let g=3+o;Boolean(this.spriteItem.slow)&&(this.spriteItem.slow?(g/=2,this.spriteItem.slow=!1):this.spriteItem.slow=!1);let w=g*u,x=g*f;if(m.clrf&&0==w&&0==x){p.time(),m.time;w=Math.trunc((320-this.x)/40),x=Math.trunc((320-this.y)/40)}let v=!1,I=!!Boolean(this.spriteItem.wall)&&!!this.spriteItem.wall,M=!1,_=!1,P=!1,b=!1;this.spriteItem.living?(b=!!Boolean(this.spriteItem.mode)&&0!=this.spriteItem.mode,b&&(0!=(1&this.spriteItem.mode)&&(s.sp.living||(s={sp:p.sprite.itemCreate("ARMOR_P",!0,32,32),re:!1})),0!=(2&this.spriteItem.mode)&&(h.sp.living||(h={sp:p.sprite.itemCreate("ARMOR_P",!0,32,32),re:!1}),n.sp.living||(n={sp:p.sprite.itemCreate("ARMOR_P",!0,32,32),re:!1})),0!=(4&this.spriteItem.mode)&&(i.sp.living||(i={sp:p.sprite.itemCreate("FRIEND_P",!0,32,32),re:!1},e={sp:p.sprite.itemCreate("Turlet",!1,32,32),re:!1})),0!=(8&this.spriteItem.mode)&&(l=!l),this.spriteItem.mode=0),r=!1):r||(a(p,this.x,this.y),r=!0,t.sp.hide(),i.sp.living&&i.sp.dispose(),s.sp.living&&s.sp.dispose(),h.sp.living&&h.sp.dispose(),n.sp.living&&n.sp.dispose(),l=!1),i.sp.living||e.sp.living&&e.sp.dispose(),s.sp.living&&(M=!!Boolean(s.wall)&&!!s.wall,s.wall=!1),h.sp.living&&(_=!!Boolean(s.wall)&&!!h.wall,h.wall=!1),n.sp.living&&(P=!!Boolean(s.wall)&&!!n.wall,n.wall=!1),v=!!(I||M||_||P),v&&(this.x=this.old_x,this.y=this.old_y,this.spriteItem.wall=!1),r||(y||this.turlet.check(this.r),0!=w||0!=x?(this.old_x=Math.trunc(this.x),this.old_y=Math.trunc(this.y),this.x=this.x+w,this.y=this.y+x,this.x<32&&(this.x=32),this.x>608&&(this.x=608),this.y<32&&(this.y=32),this.y>432&&(this.y=432),this.r=this.turlet.vecToR(w,x),op=this.op,op.x[op.ptr]=Math.trunc(this.x),op.y[op.ptr]=Math.trunc(this.y),op.r[op.ptr]=this.turlet.vector(),op.ptr++,op.ptr=op.ptr%op.x.length):(c.left&&this.turlet.move(-1),c.right&&this.turlet.move(1)))},this.draw=function(r){if(i.sp.living){for(let t=0;t<this.op.x.length-5;t+=3){let i=this.op;r.screen[0].fill(i.x[(i.ptr+t)%i.x.length]-2,i.y[(i.ptr+t)%i.x.length]-2,3,3,"gray")}let t=this.op;i.sp.pos(t.x[t.ptr%t.x.length],t.y[t.ptr%t.x.length],t.r[t.ptr%t.x.length]+90,.8),e.sp.pos(t.x[t.ptr%t.x.length],t.y[t.ptr%t.x.length],t.r[t.ptr%t.x.length]+90,.8),i.sp.view(),e.sp.view()}else i.re||(a(r,op.x[op.ptr%op.x.length],op.y[op.ptr%op.x.length]),e.sp.dispose(),i.re=!0);let o=Math.trunc(this.x),l=Math.trunc(this.y);s.sp.living?(s.sp.pos(Math.trunc(o+20*Math.cos(this.r*(Math.PI/180))),Math.trunc(l+20*Math.sin(this.r*(Math.PI/180))),(this.r+90)%360,1),s.sp.view()):s.re||(a(r,o+20*Math.cos(this.r*(Math.PI/180)),l+20*Math.sin(this.r*(Math.PI/180))),s.re=!0),h.sp.living?(h.sp.pos(Math.trunc(o+20*Math.cos((this.r-90)*(Math.PI/180))),Math.trunc(l+20*Math.sin((this.r-90)*(Math.PI/180))),this.r%360,1),h.sp.view()):h.re||(a(r,o+16*Math.cos((this.r-90)*(Math.PI/180)),l+16*Math.sin((this.r-90)*(Math.PI/180))),h.re=!0),n.sp.living?(n.sp.pos(Math.trunc(o+17*Math.cos((this.r+90)*(Math.PI/180))),Math.trunc(l+17*Math.sin((this.r+90)*(Math.PI/180))),this.r%360,1),n.sp.view()):n.re||(a(r,Math.trunc(o+16*Math.cos((this.r+90)*(Math.PI/180))),Math.trunc(l+16*Math.sin((this.r+90)*(Math.PI/180)))),n.re=!0),this.spriteItem.pos(o,l,(this.r+90)%360,1),this.spriteItem.view(),t.sp.living&&(t.sp.pos(o,l,(this.turlet.vector()+90)%360,1),t.sp.view()),w={x:this.x,y:this.y,c:"white",r:this.turlet.vector(),draw(t){t.beginPath(),t.fillStyle=this.c,t.strokeStyle=this.c,t.lineWidth=2,t.arc(this.x,this.y,6,0,2*Math.PI,!1),t.fill(),t.moveTo(this.x,this.y),t.lineTo(this.x+24*Math.cos(this.r*(Math.PI/180)),this.y+24*Math.sin(this.r*(Math.PI/180))),t.stroke()}},r.screen[0].putFunc(w)}}function GameObj_Friend(){}function GameObj_Enemy(){}function GameObj_FlyCanon(){this.r=0,this.vr=0,this.x=0,this.y=0,this.old_X=0,this.old_y=0,this.triggerDelay=0,this.triggerCount=0;let t,i,e;function s(t,i,e){const s=t.sprite.itemList();let h=-1;for(let t in s)"Player"==s[t].id&&(h=t);let n=-1;return-1!=h&&(n=function(t,i){return(270+(0==t?i>=0?180:0:Math.atan(i/t)*(180/Math.PI)+(t>=0?90:270)))%360}(i-s[h].x,e-s[h].y)),n}this.spriteItem,this.init=function(s,h=1e3,n=10){this.r=this.spriteItem.r,this.vr=0,this.x=this.spriteItem.x,this.y=this.spriteItem.y,this.old_X=this.x,this.old_y=this.y,this.triggerDelay=0,this.triggerCount=0,t=!1,i=h,e=n},this.step=function(h,n,r){if(this.spriteItem.living){if(this.triggerDelay<h.time()){if(this.triggerDelay=h.time()+i,this.triggerCount++,this.triggerCount%2>0){let t=h.sprite.itemCreate("BULLET_E",!0,4,4),i=s(h,this.x,this.y),e=-1!=i?i-90:this.r+(h.time()%180+90);this.triggerCount%3==0&&(e=this.r);let n=this.x,r=this.y;t.pos(n,r,0,1),t.move(e,3,3e3)}this.r+=e,this.spriteItem.move(this.r,2,100)}t=!1}else t||(!function(t,i,e,s=0,h=360){for(let n=s;n<h;n+=30)sp=t.sprite.itemCreate("BULLET_E",!0,8,8),sp.pos(i,e,n),sp.move(n,2,30)}(h,this.x,this.y),t=!0);!!Boolean(this.spriteItem.wall)&&!!this.spriteItem.wall&&(this.r+=5*e,this.r=this.r%360,this.spriteItem.vx=0,this.spriteItem.vy=0,this.spriteItem.wall=!1),Boolean(this.spriteItem.slow)&&(this.spriteItem.slow?(this.spriteItem.vx/=1.05,this.spriteItem.vy/=1.05,this.spriteItem.slow=!1):this.spriteItem.slow=!1),t||(this.old_x=this.x,this.old_y=this.y,this.x=this.spriteItem.x,this.y=this.spriteItem.y,this.r=this.spriteItem.r,this.x<32&&(this.spriteItem.x=32),this.x>608&&(this.spriteItem.x=608),this.y<32&&(this.spriteItem.y=32),this.y>432&&(this.spriteItem.y=432))},this.draw=function(t){this.spriteItem.living&&this.spriteItem.view()}}function GameObj_Horming(){}function GameObj_GradeUpItem(){this.r=0,this.vr=0,this.x=0,this.y=0,this.old_X=0,this.old_y=0,this.triggerDelay=0;let t;function i(t,i,e){const s=t.sprite.itemList();let h=-1;for(let t in s)"Player"==s[t].id&&(h=t);let n=-1;return-1!=h&&(n=function(t,i){return(270+(0==t?i>=0?180:0:Math.atan(i/t)*(180/Math.PI)+(t>=0?90:270)))%360}(i-s[h].x,e-s[h].y)),n}this.mode=0,this.blink=!0,this.spriteItem,this.init=function(i){this.r=this.spriteItem.r,this.vr=0,this.x=this.spriteItem.x,this.y=this.spriteItem.y,this.old_X=this.x,this.old_y=this.y,this.triggerDelay=0,this.mode=0,this.spriteItem.mode=this.mode,t=!1},this.step=function(e,s,h){if(h.clrf&&h.time+750>e.time()){let t=i(e,this.x,this.y);this.spriteItem.move((t+260)%360,4,1)}this.spriteItem.living?(this.triggerDelay<e.time()&&(this.triggerDelay=e.time()+250,this.mode=this.spriteItem.mode!=this.mode?this.spriteItem.mode:this.mode,this.spriteItem.priority=this.mode,this.blink=!this.blink),t=!1):t||(t=!0),t||(this.x=this.spriteItem.x,this.y=this.spriteItem.y,this.r=this.spriteItem.r,this.x<32&&(this.spriteItem.x=32),this.x>608&&(this.spriteItem.x=608),this.y<32&&(this.spriteItem.y=32),this.y>432&&(this.spriteItem.y=432))},this.draw=function(t){const i=[[" --","正面","側面","子機","弾種"],["None","FWD","SIDE"," OPT","CHNG"]],e=[["black","peru","navy","teal","indigo"],["rgb(64,64,64)","orange","blue","green","blueviolet"]];let s=this.blink?0:1;if(this.spriteItem.living){this.spriteItem.view();let h=this.spriteItem;const n=Math.trunc(h.x-h.collision.w/2),r=Math.trunc(h.y-h.collision.h/2),o=h.collision.w,l=h.collision.h;t.screen[0].fill(n,r,o,l,"white"),t.screen[0].fill(n+1,r+1,o-2,l-2,e[s][this.mode]),t.kanji.print(i[s][this.mode],n+2,r+4)}}}function SceneGame(){let t,i,e,s,h,n,r,o,l,a;Array(40),Array(40);function p(){let t,i;this.run=function(){t++},this.set=function(){i=0,t=0},this.check=function(){return t!=i}}this.state=function(){return{ene:o,result:e,time:n,stage:e.stage,score:e.score,delay:s,block:undefined,collision:0,sprite:i.length,clear:e.clrf,gameover:e.govf}},this.init=function(e){l=new p,t=[],a=new StageControl(e),a.init(),i=e.sprite.itemList(),this.reset(e)},this.reset=function(n){a.init(),t=[],n.sprite.itemFlash(),r=new GameObject,r.spriteItem=n.sprite.itemCreate("Player",!0,28,28),r.spriteItem.pos(320,320),r.init(n),t.push(r),a.change(1,t);for(let t in this.spriteTable)i[t].visible=!1;o={now:3,max:3,before:this.now},e={score:0,time:n.time(),stage:1,clrf:!1,govf:!1},s=0,h=0},this.step=function(h,p,c){n=Math.trunc((h.time()-e.time)/100);for(let i of t)i.step(h,p,e);if(s<h.time()){s=h.time()+500,o.before=o.now,e.clrf=!1,h.sprite.itemIndexRefresh();let i=0,n=h.sprite.itemList();for(let t of n)"Enemy"==t.id&&i++;if(r.spriteItem.living||(o.now--,o.now>0&&(r.spriteItem=h.sprite.itemCreate("Player",!0,28,28),r.spriteItem.pos(320,320),r.x=320,r.y=320)),0==i){let i=1e4-(h.time()-e.time);e.score+=i<0?100:i+100,e.time=h.time(),e.stage++;let n=[];for(let i in t)t[i].spriteItem.living&&n.push(t[i]);t=n,a.change(e.stage,t);let r=h.sprite.itemList();for(let t of r)"BULLET_P"==t.id&&t.dispose(),"BULLET_E"==t.id&&t.dispose();e.clrf=!0,s=h.time()+1500}o.now<=0&&(s=h.time()+3e3,o.now=0,e.govf=!0)}h.sprite.CollisionCheck(),i=h.sprite.itemList();for(let e in i){let s=i[e];if(s.living&&(s.collisionEnable&&s.visible)){if("Player"==s.id||"FRIEND_P"==s.id||"ARMOR_P"==s.id){let t=s.hit;for(let i in t){let e=t[i];e.visible&&("BULLET_E"==e.id&&(a.mapDamage(s),s.dispose(),e.dispose()),"Player"==s.id&&"POWERUP"==e.id&&(e.mode>0&&(Boolean(s.mode)&&isNaN(s.mode)?s.mode+=Math.pow(2,e.mode-1):s.mode=Math.pow(2,e.mode-1)),e.dispose()))}}if("Enemy"==s.id){let i=s.hit;for(let e in i){let n=i[e];if(n.visible&&"BULLET_P"==n.id.substring(0,8)){a.mapDamage(s);let i=new GameObj_GradeUpItem;i.spriteItem=h.sprite.itemCreate("POWERUP",!0,28,16),i.spriteItem.pos(s.x,s.y),i.init(h),t.push(i),s.dispose(),n.dispose()}}}if("BULLET_P"==s.id.substring(0,8)){let t=s.hit;for(let i in t){let e=t[i];e.visible&&("BULLET_E"==e.id&&(a.mapDamage(s),s.dispose(),e.dispose()))}}if("BULLET_E"==s.id){let t=s.hit;for(let i in t){let e=t[i];e.visible&&("BULLET_P"==s.id.substring(0,8)&&(a.mapDamage(s),s.dispose(),e.dispose()))}}if("POWERUP"==s.id){let t=s.hit;for(let i in t){let e=t[i];e.visible&&("BULLET_P"==e.id.substring(0,8)&&(s.mode++,s.mode>4&&(s.mode=0),e.dispose()),e.id==s.id&&Math.trunc(e.x)==Math.trunc(s.x)&&Math.trunc(e.y)==Math.trunc(s.y)&&(s.vx=2*(4*Math.random()-2),s.vy=2*(4*Math.random()-2)))}}}}!function(t){for(let i in t){let e=t[i];(e.x<0||e.x>640||e.y<0||e.y>464)&&((e.x<0||e.x>640)&&e.dispose(),(e.y<0||e.y>464)&&e.dispose())}}(h.sprite.itemList()),a.step(h,p,e),l.run()},this.draw=function(i){l.check();if(1){let t=i.sprite.itemList();for(let e in t)"BULLET"==t[e].id.substring(0,6)&&i.screen[0].fill(t[e].x-t[e].collision.w/2,t[e].y-t[e].collision.h/2,t[e].collision.w,t[e].collision.h,"BROWN")}if(a.draw(i),!e.govf)for(let e of t)e.draw(i);l.set()}}class GameTask_Main extends GameTask{_x=0;_y=0;_sm={};_dtt=0;_result;_titlef;titlewait;_wh=0;scene;_dv;constructor(t){super(t)}pre(t){this.scene=[],this.scene.Game=new SceneGame,this.scene.UI=new SceneGameUI,this.scene.Debug=new SceneDebug,this.scene.Result=new SceneResult,this.scene.GameOver=new SceneGameOver,this.scene.Title=new SceneTitle,this.scene.Gpad=new SceneGPad,t.sprite.setPattern("Player",{image:"SPGraph",wait:0,pattern:[{x:0,y:0,w:32,h:32,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("Turlet",{image:"SPGraph",wait:0,pattern:[{x:0,y:32,w:32,h:32,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("BULLET_P",{image:"SPGraph",wait:0,pattern:[{x:48,y:48,w:8,h:32,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("BULLET_P2",{image:"SPGraph",wait:0,pattern:[{x:16,y:16,w:8,h:32,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("Enemy",{image:"SPGraph",wait:10,pattern:[{x:32,y:32,w:32,h:32,r:0,fv:!1,fh:!1},{x:32,y:64,w:32,h:32,r:0,fv:!1,fh:!1},{x:32,y:96,w:32,h:32,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("BULLET_E",{image:"SPGraph",wait:0,pattern:[{x:48,y:48,w:4,h:16,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("ARMOR_P",{image:"SPGraph",wait:0,pattern:[{x:0,y:64,w:32,h:8,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("ARMOR_E",{image:"SPGraph",wait:0,pattern:[{x:0,y:0,w:2,h:2,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("FRIEND_P",{image:"SPGraph",wait:0,pattern:[{x:0,y:0,w:32,h:32,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("POWERUP",{image:"SPGraph",wait:0,pattern:[{x:0,y:0,w:2,h:2,r:0,fv:!1,fh:!1}]}),t.sprite.setPattern("block",{image:"SPGraph",wait:0,pattern:[{x:0,y:0,w:2,h:2,r:0,fv:!1,fh:!1}]}),this.scene.Game.init(t),this._initGame(t),this._sm={x:0,y:0,old_x:0,old_y:0}}_initGame(t){this.scene.Game.reset(t),this._titlef=!0,this.titlewait=t.time()+1e3}step(t){let i=t.keyboard.check(),e=!1;Boolean(i[65])&&i[65]&&(e=!0);let s=!1;Boolean(i[68])&&i[68]&&(s=!0);let h=!1;Boolean(i[87])&&i[87]&&(h=!0);let n=!1;Boolean(i[83])&&i[83]&&(n=!0);let r=!1;Boolean(i[81])&&i[81]&&(r=!0);let o=!1;Boolean(i[69])&&i[69]&&(o=!0);let l=!1;Boolean(i[38])&&i[38]&&(l=!0);let a=!1;Boolean(i[40])&&i[40]&&(a=!0);let p=!1;Boolean(i[37])&&i[37]&&(p=!0);let c=!1;Boolean(i[39])&&i[39]&&(c=!0);let m=!1;Boolean(i[32])&&i[32]&&(m=!0);let u=!1;Boolean(i[90])&&i[90]&&(u=!0);let f=!1;Boolean(i[36])&&i[36]&&(f=!0);let d=!1;Boolean(i[80])&&i[80]&&(d=!0);let y=t.gamepad.check(),g=t.gamepad.btn_lb,w=t.gamepad.btn_rb,x=t.gamepad.btn_a,v=t.gamepad.btn_x,I=t.gamepad.btn_back,M=t.gamepad.r,_=t.gamepad.axes;l=!(!l&&!h),a=!(!a&&!n),p=!(!p&&!e),c=!(!c&&!s),!(!f&&!I)&&(document.fullscreenElement||t.systemCanvas.requestFullscreen()),y&&-1!=M?(this._x=_[0],this._y=_[1]):(this._x=p?-1:c?1:0,this._y=l?-1:a?1:0);let P=g||u||r,b=w||u||o,E=x||v||m,G={x:this._x,y:this._y,trigger:E,left:P,right:b,keycode:i},L=this.scene.Game.state();this._result=L.result,this._titlef?(L.block=0,L.sprite=0,this.scene.Title.step(t,G,{delay:this.titlewait})&&(this._titlef=!1)):L.gameover?this.scene.GameOver.step(t,G,L)&&this._initGame(t):this.scene.Game.step(t,G),this._result.clrf&&this.scene.Result.step(t,G),this.scene.UI.step(t,G,L),this.scene.Debug.step(t,G,L),this._dv=!!d,this._dv&&this.scene.Gpad.step(t,G,L)}draw(t){this._titlef||this.scene.Game.draw(t),this._titlef||this.scene.UI.draw(t),this._dv&&this.scene.Debug.draw(t),this._result.clrf&&this.scene.Result.draw(t),this._result.govf&&this.scene.GameOver.draw(t),this._titlef&&this.scene.Title.draw(t),this._dv&&this.scene.Gpad.draw(t)}}function main(){const t=new GameCore({canvasId:"layer0",screen:[{resolution:{w:640,h:480,x:0,y:0}}]});pictdata(t);const i=SpriteFontData();for(let e in i)t.setSpFont(i[e]);t.kanji=new fontPrintControl(t,t.asset.image.ASCII.img,6,8,t.asset.image.JISLV1.img,12,8),t.task.add(new GameTask_Main("main")),t.screen[0].setBackgroundcolor("black"),t.screen[0].setInterval(1),t.run()}function SpriteFontData(){let t=[];for(let i=0;i<7;i++)for(j=0;j<16;j++)ptn={x:12*j,y:16*i,w:12,h:16},t.push(ptn);let i=[],e=["white","red","green","blue"];for(let t=0;t<=3;t++){let s=[];for(let t=0;t<7;t++)for(let i=0;i<16;i++)ptn={x:6*i,y:8*t+16,w:6,h:8},s.push(ptn);i[e[t]]=s}return[{name:"std",id:"ASCII",pattern:i.white},{name:"8x8red",id:"ASCII",pattern:i.red},{name:"8x8green",id:"ASCII",pattern:i.green},{name:"8x8blue",id:"ASCII",pattern:i.blue},{name:"8x8white",id:"ASCII",pattern:i.white}]}function pictdata(t){t.asset.imageLoad("SPGraph","pict/cha.png"),t.asset.imageLoad("JISLV1","pict/k12x8_jisx0208c.png"),t.asset.imageLoad("ASCII","pict/k12x8_jisx0201c.png")}function SceneGameUI(){let t,i,e;this.step=function(s,h,n){t=n.ene,i=n.result,e=n.time},this.draw=function(e){let s="";for(let i=1;i<t.now;i++)s+="▲";e.kanji.print("PLAYER:"+s,0,448),e.kanji.print("STAGE :"+i.stage,0,456)}}function SceneResult(){this.step=function(t,i){},this.draw=function(t){t.font.std.putchr("STAGE CLEAR",220,244,3),t.font.std.putchr("STAGE CLEAR",320,464)}}function SceneTitle(){let t;const i=["テーマ  アップグレード/強化(土日スレ16)","","     TANK BATTLE Style/ERA-TANK","","","","","","           START SPACE KEY","                     or GamePad Button X/A","","","","[操作]移動    : WASD or 矢印キー or GamePad 左アナログスティック","      攻撃    : SPACE key or GamePad Button X/A","攻撃方向の固定: Z key  or GamePad Button L/R","停止時砲塔旋回: Q,Ekey or GamePad Button L/R","","","敵を倒すと出てくるアップグレードパーツ(弾を当てて切り替え)","[ -  /None] 効果なし ","[正面/FWD ] 正面追加装甲","[側面/SIDE] 側面追加装甲","[子機/ OPT] 有線ドローン(OPTION)","[弾種/CHNG] 弾の種類切り替え(通常<->ブロック貫通)","  注：重複効果はありません。"];this.step=function(i,e,s){t=e,delay=s.delay-i.time()<0;let h=!1;return delay&&e.trigger&&(h=!0),h},this.draw=function(t){for(let e in i)t.kanji.print(i[e],160,140+8*e)}}function SceneGameOver(){let t,i,e;this.step=function(s,h,n){if(t=n.stage,i=Math.trunc(n.score),e=n.delay-s.time()<0,e&&(s.sprite.itemFlash(),h.trigger))return!0},this.draw=function(t){t.font.std.putchr("GAME OVER",220,248,4),t.font["8x8white"].putchr(":"+(e?"OK":"WAIT"),320,456)}}function SceneDebug(){let t,i,e,s,h;this.step=function(n,r,o){t=o.block,i=n.deltaTime().toString().substring(0,5),e=o.collision,s=o.sprite,h=r},this.draw=function(t){t.font["8x8white"].putchr("DeltaT:"+i,540,0);let e=0!=h.x?h.x>0?"R":"L":"-",s=0!=h.y?h.y>0?"D":"U":"-",n=h.trigger?"T":"-",r=h.right?"S":"-";t.font["8x8green"].putchr("Input:"+s+":"+e+":"+n+":"+r,540,16)}}function SceneGPad(){let t;this.step=function(i,e,s){t=i.gamepad.infodraw();let h=e.keycode,n="";for(let t in h)Boolean(h[t])&&(n+="["+t+"]");t.push(""),t.push("[Keyboard]"),t.push(n)},this.draw=function(i){for(let e in t)i.font["8x8white"].putchr(t[e],0,48+8*e)}}function GameSpriteControl(t){let i,e=[],s=[],h=!0;function n(){this.x=0,this.y=0,this.r=0,this.z=0,this.vx=0,this.vy=0,this.priority=0,this.collisionEnable=!0,this.collision={w:0,h:0},this.id="",this.count=0,this.pcnt=0,this.visible=!1,this.hit=[],this.alive=0,this.index=0,this.living=!0,this.normalDrawEnable=!0,this.customDraw=function(t){},this.moveFunc,this.view=function(){this.visible=!0},this.hide=function(){this.visible=!1},this.pos=function(t,i,e=0,s=0){this.x=t,this.y=i,this.r=e,this.z=s},this.move=function(t,i,e){this.visible=!0;let s=(t-90)*(Math.PI/180);this.vx=Math.cos(s)*i,this.vy=Math.sin(s)*i,this.r=t,this.alive=e},this.moveFunc=function(){this.alive--,this.x+=this.vx,this.y+=this.vy,this.alive<=0?this.visible=!1:this.visible=!0},this.stop=function(){this.alive=0,this.vx=0,this.vy=0},this.dispose=function(){this.alive=0,this.visible=!1,this.living=!1},this.put=function(t,e,h=0,n=1){Boolean(s[this.id])?(r(s[this.id].image,s[this.id].pattern[this.pcnt],t,e,h,n),this.count++,this.count>s[this.id].wait&&(this.count=0,this.pcnt++),this.pcnt>s[this.id].pattern.length-1&&(this.pcnt=0)):i.fillText(this.index+" "+this.count,t,e)},this.reset=function(){this.x=0,this.y=0,this.r=0,this.z=0,this.vx=0,this.vy=0,this.priority=0,this.collisionEnable=!0,this.collision={w:0,h:0},this.id="",this.count=0,this.pcnt=0,this.visible=!1,this.hit=[],this.alive=0,this.index=0,this.living=!0,this.normalDrawEnable=!0},this.debug=function(){let t=[];return t.push("this.x,"+this.x),t.push("this.y,"+this.y),t.push("this.r,"+this.r),t.push("this.z,"+this.z),t.push("this.vx,"+this.vx),t.push("this.vy,"+this.vy),t.push("this.priority,"+this.priority),t.push("this.collisionEnable,"+this.collisionEnable),t.push("this.collision,"+this.collision),t.push("this.id,"+this.id),t.push("this.count,"+this.count),t.push("this.pcnt,"+this.pcnt),t.push("this.visible,"+this.visible),t.push("this.hit,"+this.hit),t.push("this.alive,"+this.alive),t.push("this.index,"+this.index),t.push("this.living,"+this.living),t.push("this.normalDrawEnable,"+this.normalDrawEnable),t}}function r(t,e,s,h,n,r,o){if(Boolean(n)||(n=e.r),Boolean(o)||(o=255),Boolean(r)||(r=1),!e.fv&&!e.fh&&0==n&&255==o)i.drawImgXYWHXYWH(t,e.x,e.y,e.w,e.h,s+-e.w/2*r,h+-e.h/2*r,e.w*r,e.h*r);else{let l=e.fv?-1:1,a=e.fh?-1:1;i.spPut(t,e.x,e.y,e.w,e.h,-e.w/2*r,-e.h/2*r,e.w*r,e.h*r,a,0,0,l,s,h,o,n)}}this.itemCreate=function(t,i=!1,s=0,h=0){const r=new n;let o=e.length;return e.push(r),r.reset(),r.index=o,r.id=t,r.count=0,r.pcnt=0,r.collisionEnable=i,r.collision={w:s,h:h},r},this.itemList=function(){return e},this.itemFlash=function(){e=[]},this.itemIndexRefresh=function(){let t=[];for(let i in e)e[i].living&&t.push(e[i]);for(let i in t)t[i].index=i;return e=t,e},this.manualDraw=function(t=!0){h=!t},this.useScreen=function(e){i=t.screen[e].buffer},this.setPattern=function(i,e){s[i]={image:t.asset.image[e.image].img,wait:e.wait,pattern:e.pattern}},this.CollisionCheck=function(){let t=[];for(let i in e){let s=e[i];s.living&&s.collisionEnable&&t.push(s)}for(let i in t){let e=t[i];e.hit=[];for(let s in t)if(i!=s){let i=t[s];Math.abs(e.x-i.x)<e.collision.w/2+i.collision.w/2&&Math.abs(e.y-i.y)<e.collision.h/2+i.collision.h/2&&e.hit.push(i)}}};const o=new function(){let t=[];this.add=i=>{t.push(i)},this.sort=()=>{t.sort(((t,i)=>t.priority-i.priority))},this.buffer=()=>t,this.reset=()=>{t=[]}};this.allDrawSprite=function(){if(h){o.reset();for(let t in e){let i=e[t];i.living&&o.add(i)}o.sort();let t=o.buffer();for(let e in t){let h=t[e];h.alive>0&&h.moveFunc(),h.visible&&(Boolean(s[h.id])?(r(s[h.id].image,s[h.id].pattern[h.pcnt],h.x,h.y,h.r,h.z),h.count++,h.count>s[h.id].wait&&(h.count=0,h.pcnt++),h.pcnt>s[h.id].pattern.length-1&&(h.pcnt=0)):i.fillText(e+" "+h.count,h.x,h.y))}}}}function StageControl(t){const i=60,e=80;let s,h,n,r=t;function o(t,i,e,h,n){for(let r=i;r<i+h;r++)for(let i=t;i<t+e;i++)s[r][i].on=n.on,s[r][i].break=n.break,s[r][i].hit=n.hit,s[r][i].hp=n.hp}this.init=function(){n=1,s=function(t){let s=new Array(i);for(let h=0;h<i;h++){s[h]=new Array(e);for(let i=0;i<e;i++)s[h][i]={},s[h][i].on=t.on,s[h][i].break=t.break,s[h][i].hit=t.hit,s[h][i].hp=t.hp}return s}({on:!1,break:!1,hit:!1,hp:5})},this.change=function(t,i){n=t;!function(t){const i=Math.trunc(e/6),s=Math.trunc(12);let h=parseInt(t,16);for(let t=0;t<5;t++)for(let e=0;e<6;e++)0!=(1&h)&&o(e*i,t*s,i,s,{on:!0,break:!1,hit:!1,hp:1}),h>>=1}(["00000000","0000C000","00000080","00000400","00080000","00400000","00021000"][n%7]);let s=new GameObj_FlyCanon;s.spriteItem=r.sprite.itemCreate("Enemy",!0,28,28);let h=n%2==0?-1:1,l=Math.trunc(n/10)+1,a=Math.trunc(300*Math.random());s.spriteItem.pos(320+160*h,30),s.init(r,1e3/l+a,10/l*h),i.push(s),n>=3&&(a=Math.trunc(300*Math.random()),s=new GameObj_FlyCanon,s.spriteItem=r.sprite.itemCreate("Enemy",!0,28,28),s.spriteItem.pos(320,30),s.spriteItem.move(180,2,1e3),s.init(r,1e3/l+a,5*h),i.push(s)),n>=5&&(a=Math.trunc(300*Math.random()),s=new GameObj_FlyCanon,s.spriteItem=r.sprite.itemCreate("Enemy",!0,28,28),s.spriteItem.pos(320-160*h,30),s.init(r,1e3/l+a,10/l*-h),i.push(s)),n>=7&&(a=Math.trunc(300*Math.random()),s=new GameObj_FlyCanon,s.spriteItem=r.sprite.itemCreate("Enemy",!0,28,28),s.spriteItem.pos(320-280*h,30),s.spriteItem.move(180,2,1e3),s.init(r,1e3/l+a,10/l*-h),i.push(s),a=Math.trunc(300*Math.random()),s=new GameObj_FlyCanon,s.spriteItem=r.sprite.itemCreate("Enemy",!0,28,28),s.spriteItem.pos(320+280*h,30),s.spriteItem.move(180,2,1e3),s.init(r,1e3/l+a,10/l*h),i.push(s))},this.step=function(t,i,e){let h=t.sprite.itemList();for(let t in h){let i=h[t],e=h[t];if(!e.living)continue;if(!e.collisionEnable)continue;if(!e.visible)continue;let s=i.collision.w,r=i.collision.h;for(let t=Math.trunc((i.x-s/2)/8);t<=Math.trunc((i.x+s/2)/8);t++)for(let e=Math.trunc((i.y-r/2)/8);e<=Math.trunc((i.y+r/2)/8);e++)n(i,t,e)}function n(t,i,e){e>=0&&e<s.length&&i>=0&&i<s[e].length&&(s[e][i].on&&("BULLET_P"==t.id&&(s[e][i].hp--,s[e][i].hp<0&&(s[e][i].on=!1,s[e][i].break=!0,s[e][i].hit=!1),t.dispose()),"BULLET_P2"==t.id&&(s[e][i].hp--,s[e][i].hp<0&&(s[e][i].on=!1,s[e][i].break=!0,s[e][i].hit=!1)),"BULLET_E"==t.id&&(s[e][i].hp--,s[e][i].hp<0&&(s[e][i].on=!1,s[e][i].break=!0,s[e][i].hit=!1),t.dispose()),"Player"==t.id&&(t.wall=!0,s[e][i].on=!1,s[e][i].break=!0,s[e][i].hit=!0),"ARMOR_P"==t.id&&(t.wall=!0),"Enemy"==t.id&&(t.wall=!0)),s[e][i].hit&&("Player"==t.id&&(t.slow=!0),"Enemy"==t.id&&(t.slow=!0)))}},this.mapDamage=function(t){let h=t,n=h.collision.w,r=h.collision.h;for(let t=Math.trunc((h.x-n/2)/8);t<=Math.trunc((h.x+n/2)/8);t++)for(let n=Math.trunc((h.y-r/2)/8);n<=Math.trunc((h.y+r/2)/8);n++)t>=0&&t<e&&n>=0&&n<i&&(s[n][t].hit=!0)},this.draw=function(t){let n=Math.trunc(t.time()/250)%2;h=0;for(let r=0;r<i;r++)for(let i=0;i<e;i++)s[r][i].on&&(0!=s[r][i].hp?(t.screen[0].fill(8*i,8*r,8,8,"lightgray"),t.screen[0].fill(8*i,8*r,7,7,"gray")):t.screen[0].fill(8*i+1,8*r+1,5,5,"gray"),h++),s[r][i].hit&&(0==n?t.screen[0].fill(8*i+4,8*r+4,2,1,"red"):t.screen[0].fill(8*i+4,8*r+4,1,1,"red"))}}