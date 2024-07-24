'use strict';
game.import('play',function(lib,game,ui,get,ai,_status){
	return {
		name:'AIoptimize',
		arenaReady:function(){
/*主公AI*/
lib.skill._fenghuyunlong={
trigger:{
global:"gameStart",
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
mode:["identity"],
filter:function(event,player){
return player.identity=='zhu'&&_status.mode=="normal";
},
content:function(){
game.countPlayer2(function(current){
if(current.identity=='nei') current.addSkill('jlnj');
});
if(game.countPlayer(function(current){
return current.identity=='zhong';
})>0){
var list=[];
for(var i=0;i<game.players.length;i++){
if(game.players[i].identity=='zhong'){
list.push(game.players[i]);
}
}
var target=list.randomGet();
player.storage.dongcha=target;
if(!_status.connectMode){
if(player==game.me){
target.setIdentity('zhong');
target.node.identity.classList.remove('guessing');
target.zhongfixed=true;
}
}else{
player.chooseControl('ok').set('dialog',[get.translation(target)+'是忠臣',[[target.name],'character']]);
}
}
player.addTempSkill('AIoptimize_1_mz');
},
};
lib.skill.AIoptimize_1_mz={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
mode:["identity"],
ai:{
effect:{
player:function(card,player,target,current){
if(get.tag(card,'damage')&&get.attitude(player,target)<=0){
if(!player.isUnderControl(true)&&(card.name=="huogong"||get.name(card)=="juedou")){
return [-0.5,-0.5];
}
if(get.name(card)=="sha"&&!card.nature){
if((target.hasSkill('tengjia3')||target.hasSkill('rw_tengjia4'))&&!(player.getEquip('qinggang')||player.getEquip('zhuque'))){
return "zeroplayertarget";
}
}
if(get.name(card)=="sha"&&get.color(card)=='black'&&(target.hasSkill('renwang_skill')||target.hasSkill('rw_renwang_skill'))){
if(!player.getEquip('qinggang')){
return "zeroplayertarget";
}
}
if(get.attitude(player,target)==0){
return [0.5,0.5];
}
if(get.attitude(player,target)<0){
return 1;
}
}
if(get.name(card)=="guohe"||get.name(card)=="shunshou"||get.name(card)=="lebu"||get.name(card)=="bingliang"||get.name(card)=="caomu"||get.name(card)=="zhujinqiyuan"||get.name(card)=="caochuanjiejian"||get.name(card)=="toulianghuanzhu"){
if(get.attitude(player,target)==0){
return [0.5,0.5];
}
if(get.attitude(player,target)<0){
return 1;
}
}
},
},
},
};
/*主忠残局AI*/
lib.skill._tianxiayitong={
trigger:{
global:["dieAfter"],
},
silent:true,
forced:true,
unique:true,
popup:false,
charlotte:true,
superCharlotte:true,
mode:["identity"],
filter:function(event,player){
var numf=game.countPlayer(function(current){
return current.identity=='fan';
});
return _status.mode=="normal"&&(player.identity=='zhu'||player.identity=='zhong')&&numf==0&&!player.isUnderControl(true);
},
content:function(){
var func=function(){
game.countPlayer(function(current){
current.setIdentity();
});
};
if(player==game.me) func();
else if(player.isOnline()) player.send(func);
if(!player.storage.zhibi) player.storage.zhibi=[];
player.storage.zhibi.addArray(game.players);
player.addSkill('AIoptimize_1_smz');
},
};
lib.skill.AIoptimize_1_smz={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
mode:["identity"],
ai:{
effect:{
player:function(card,player,target,current){
if(!player.isUnderControl(true)&&get.tag(card,'damage')){
if(target.hp>1){
if(target.identity=='zhong'){
return [0.25,0.25];
}
if(target.identity=='nei'){
return [0.5,0.5];
}
}
if(get.name(card)=="nanman"||get.name(card)=="wanjian"){
if(game.countPlayer(function(current){
return current.identity=='nei'&&(current.hasSkill('tengjia1')||current.hasSkill('rw_tengjia1'));
})){
return "zeroplayertarget";
}
}
}
if(get.name(card)=="guohe"||get.name(card)=="shunshou"||get.name(card)=="lebu"||get.name(card)=="bingliang"||get.name(card)=="caomu"||get.name(card)=="zhujinqiyuan"||get.name(card)=="caochuanjiejian"||get.name(card)=="toulianghuanzhu"){
if(target.hp>1){
if(target.identity=='zhong'){
return [0.25,0.25];
}
if(target.identity=='nei'){
return [0.5,0.5];
}
}
if(get.name(card)=="guohe"||get.name(card)=="shunshou"){
if(target.countCards('he')==0&&(target.hasJudge('bingliang')||target.hasJudge('lebu'))){
return 0;
}
}
}
},
},
},
};
/*内奸AI*/
//记录内奸
lib.skill.jlnj={
trigger:{
player:'phaseJieshuBegin',
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
filter:function(event,player){
return player.identity=='nei';
},
init:function(player){
player.storage.jlnj=0;
},
content:function(){
var numz=game.countPlayer(function(current){
return current.identity=='zhong';
});
var numf=game.countPlayer(function(current){
return current.identity=='fan';
});
if(player.getHistory('useCard',function(evt){
if(!evt.card) return false;
if(!((get.tag(evt.card,'damage')&&get.effect(evt.player,evt.card,player,evt.player)<0)||
(get.tag(evt.card,'lose')&&!player.isUnderControl(true))||
get.name(evt.card)=='lebu'||
get.name(evt.card)=='bingliang')) return false;
if(evt.card.name=='nanman'||evt.card.name=='wanjian') return false;
if(!evt.isPhaseUsing()) return false;
if(!evt.targets) return false;
for(var i=0;i<evt.targets.length;i++){
if(evt.targets[i].identity=='zhu'){
if(player.isUnderControl(true)){
return true;
}else{
if(player.hasSkill('tfattzhu'))return true;
}
}
if(evt.targets[i].identity=='zhong'&&evt.targets[i].ai.shown>=0.4){
if(player.isUnderControl(true)){
return true;
}else{
if(player.hasSkill('tfattzhong'))return true;
}
}
}
}).length>0){
//game.log('跳反');
//player.popup('跳反');
if(numf>0&&numz>0&&player.hasSkill('AIoptimize_1_tf')) player.addSkill('atttf');
player.storage.jlnj++;
}
},
};
//空技能
lib.skill.tfattzhu={
charlotte:true,
superCharlotte:true,
};
lib.skill.tfattzhong={
charlotte:true,
superCharlotte:true,
};
lib.skill.atttf={
charlotte:true,
superCharlotte:true,
};
//内奸态度
lib.skill._tanlangshizhu={
trigger:{
global:["changeHp","dieAfter","useSkillAfter","phaseZhunbeiAfter","phaseBefore","phaseJieshuAfter","useCard","respond"],
},
silent:true,
forced:true,
unique:true,
popup:false,
charlotte:true,
superCharlotte:true,
mode:["identity"],
filter:function(event,player){
return _status.mode=="normal"&&get.config('double_nei')==false&&player.identity=='nei';
},
content:function(){
"step 0"
event.cfz=0;
event.cff=0;
player.removeSkill('AIoptimize_1_tz');
player.removeSkill('AIoptimize_1_tf');
player.removeSkill('tfattzhu');
player.removeSkill('tfattzhong');
"step 1"
if(get.mode()=='identity'){
var numz=game.countPlayer(function(current){
return current.identity=='zhong';
});
var mz=game.countPlayer(function(current){
return current.identity=='zhong'&&current.ai.shown>=0.4;
});
var numf=game.countPlayer(function(current){
return current.identity=='fan';
});
var mf=game.countPlayer(function(current){
return current.identity=='fan'&&current.ai.shown>=0.4;
});
var rarez=game.countPlayer(function(current){
return (current.identity=='zhu'||current.identity=='zhong')&&game.getRarity(current.name)=="rare";
})
var epicz=game.countPlayer(function(current){
return (current.identity=='zhu'||current.identity=='zhong')&&game.getRarity(current.name)=="epic";
})
var legendz=game.countPlayer(function(current){
return (current.identity=='zhu'||current.identity=='zhong')&&game.getRarity(current.name)=="legend";
})
event.cfz+=rarez+2*epicz+3*legendz;
var raref=game.countPlayer(function(current){
return current.identity=='fan'&&game.getRarity(current.name)=="rare";
})
var epicf=game.countPlayer(function(current){
return current.identity=='fan'&&game.getRarity(current.name)=="epic";
})
var legendf=game.countPlayer(function(current){
return current.identity=='fan'&&game.getRarity(current.name)=="legend";
})
event.cff+=raref+2*epicf+3*legendf;
//判断忠内血最多
var znmaxhp=function(){
var list=game.filterPlayer((current)=>current.identity=='nei'||current.identity=='zhong');
var list=list.sort(function(a,b){
return b.hp-a.hp;
});
if(list[0].hp==list[1].hp){
if((list[1].countCards('h')>list[0].countCards('h')&&!list[0].getEquip('equip2'))||
list[1].countCards('e')>list[0].countCards('e')&&list[1].getEquip('equip2')) return list[1];
}
return list[0];
}
//判断玩家反装忠时场上血最多
var fanzhuangmaxhp=function(){
var list=game.filterPlayer((current)=>{
if(game.me.isAlive()&&game.me.identity=='fan'){
return current.identity=='nei'||current.identity=='zhong'||current==game.me;
}});
if(list&&list.length>1){
var list=list.sort(function(a,b){
return b.hp-a.hp;
});
if(list[0].hp==list[1].hp){
if((list[1].countCards('h')>list[0].countCards('h')&&!list[0].getEquip('equip2'))||
list[1].countCards('e')>list[0].countCards('e')&&list[1].getEquip('equip2')) return list[1];
}
}
return list[0];
}
var fun=get.attitude;
if(Math.abs(event.cff-event.cfz)<=3){
if(numz>0&&numf>0){
if(numf==1&&numz==1){
player.addTempSkill('AIoptimize_1_tf');
player.addTempSkill('tfattzhu');
player.addTempSkill('tfattzhong');
get.attitude=function(a,b){
if(a.identity=='nei'&&b.identity!='nei'){
if(b.identity=='zhong'){
if(b.ai.shown<0.4) return fun(a,b);
return -6;
}
if(b.identity=='fan'){
if(b.ai.shown<0.4) return fun(a,b);
return 0;
}
if(b.identity=='zhu') return 0;
}
if(a.identity!='nei'&&b.identity=='nei'&&a.ai.shown>=0.4){
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1){
if(a.identity=='zhu') return -2;
if(a.identity=='zhong') return -2;
if(a.identity=='fan') return 2;
}
}
return fun(a,b);
}
event.finish();
}else{
if(game.zhu.hp>=2&&numf<=(numz+1)){
if(!player.hasSkill('atttf')&&((player.storage.jlnj<1&&!player.isUnderControl(true))||player.storage.jlnj<2)&&numf==1&&player.hp+player.countCards(card=>get.tag(card,'recover')>=1)==1){
player.addTempSkill('AIoptimize_1_tz');
}else{
player.addTempSkill('AIoptimize_1_tf');
}
player.addTempSkill('tfattzhu');
player.addTempSkill('tfattzhong');
get.attitude=function(a,b){
if(a.identity=='nei'&&b.identity!='nei'){
if(player.hasSkill('AIoptimize_1_tz')){
if(numf==1&&game.me.identity=='fan'&&game.me.storage.fanzhuang<2){
if(b.identity=='zhong'){
if(b.ai.shown<0.4) return fun(a,b);
return -1;
}
if(b.identity=='fan'){
if(b.ai.shown<0.4) return fun(a,b);
return -1;
}
if(b.identity=='zhu') return 3;
}else{
if(b.identity=='zhong'){
if(b.ai.shown<0.4) return fun(a,b);
return 0;
}
if(b.identity=='fan'){
if(b.ai.shown<0.4) return fun(a,b);
return -1;
}
if(b.identity=='zhu') return 3;
}
}
else{
if(b.identity=='zhong'){
if(b.ai.shown<0.4) return fun(a,b);
return -6;
}
if(b.identity=='fan'){
if(b.ai.shown<0.4) return fun(a,b);
if(game.me==b&&game.me.storage.fanzhuang<2) return -1;
return 0;
}
if(b.identity=='zhu') return 0;
}
}
if(a.identity!='nei'&&b.identity=='nei'&&a.ai.shown>=0.4&&!player.isUnderControl(true)){
if(player.hasSkill('AIoptimize_1_tz')){
if(numf==1&&game.me.identity=='fan'&&game.me.storage.fanzhuang<2){
if(a.identity=='zhu'){
if(player.hp==1) return 0;
return -0.5;
}
if(a.identity=='zhong') return -0.5;
if(a.identity=='fan') return -0.5;
}else{
if(a.identity=='zhu') return 3;
if(a.identity=='zhong') return 0;
if(a.identity=='fan') return -0.5;
}
}
else{
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1){
if(a.identity=='zhu') return -0.5;
if(a.identity=='zhong') return -0.5;
if(a.identity=='fan') return 0.5;
}
}
}
return fun(a,b);
}
event.finish();
}else{
player.addTempSkill('AIoptimize_1_tz');
get.attitude=function(a,b){
if(a.identity=='nei'&&b.identity!='nei'){
if(b.identity=='zhong'){
if(b.ai.shown<0.4) return fun(a,b);
if(numf==1) return 0;
return 6;
}
if(b.identity=='fan'){
if(b.ai.shown<0.4) return fun(a,b);
return -6;
}
if(b.identity=='zhu') return 8;
}
return fun(a,b);
}
event.finish();
}
}
}
if(numf==0&&numz>0){
player.addTempSkill('AIoptimize_1_tf');
player.addTempSkill('tfattzhu');
get.attitude=function(a,b){
if(a.identity=='nei'&&b.identity!='nei'){
if(b.identity=='zhong') return -6;
if(b.identity=='zhu'){
if(!player.hasSkill('atttf')&&((player.storage.jlnj<1&&!player.isUnderControl(true))||player.storage.jlnj<2)) return 0.1;
return 0;
}
}
if(a.identity=='zhu'){
if(b.identity=='zhong'){
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1) return 6;
if(player.hasSkill('atttf')) return 6;
if(b==znmaxhp()) return -1;
return 0;
}
if(b.identity=='nei'){
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1) return -6;
if(player.hasSkill('atttf')) return -6;
if(b==znmaxhp()) return -1;
return 0;
}
}
if(a.identity=='zhong'){
if(b.identity=='zhong'&&b!=a){
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1) return 6;
if(player.hasSkill('atttf')) return 6;
if(b==znmaxhp()) return -6;
return -2;
}
if(b.identity=='nei'){
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1) return -6;
if(player.hasSkill('atttf')) return -6;
if(b==znmaxhp()) return -6;
return -2;
}
}
return fun(a,b);
}
event.finish();
}
if(numf>0&&numz==0){
player.addTempSkill('AIoptimize_1_tz');
get.attitude=function(a,b){
if(a.identity=='nei'&&b.identity!='nei'){
if(b.identity=='fan') return -6;
if(b.identity=='zhu') return 6;
}
if(b.identity=='nei'){
if(a.identity=='zhu'){
if(game.me.identity=='fan'&&game.me.storage.fanzhuang<2){
if(fanzhuangmaxhp()==game.me){
return -6;
}
return 0;
}
return 6;
} 
if(a.identity=='fan') return -3;
}
return fun(a,b);
}
event.finish();
}
if(numz==0&&numf==0){
player.removeSkill('AIoptimize_1_tz');
player.removeSkill('AIoptimize_1_tf');
get.attitude=function(a,b){
if(a==game.zhu&&b.identity=='nei') return -10;
if(a.identity=='nei'&&b==game.zhu) return -10;
return fun(a,b);
}
event.finish();
}
}else{
if((event.cff>=event.cfz)||(game.zhu.hp<2&&numf>0)){
player.addTempSkill('AIoptimize_1_tz');
get.attitude=function(a,b){
if(a.identity=='nei'&&b.identity!='nei'){
if(b.identity=='zhong'){
if(b.ai.shown<0.4) return fun(a,b);
return 6;
}
if(b.identity=='fan'){
if(b.ai.shown<0.4) return fun(a,b);
return -6;
}
if(b.identity=='zhu') return 8;
}
if(a.identity=='zhu'&&b.identity=='nei'){
if(numz==0) return 6;
return 0;
} 
return fun(a,b);
}
event.finish();
}
if(event.cff<event.cfz&&game.zhu.hp>=2){
player.addTempSkill('AIoptimize_1_tf');
player.addTempSkill('tfattzhu');
if(numf>0){
player.addTempSkill('tfattzhong');
}
get.attitude=function(a,b){
if(a.identity=='nei'&&b.identity!='nei'){
if(b.identity=='zhong'){
if(b.ai.shown<0.4) return fun(a,b);
return -6;
}
if(b.identity=='fan'){
if(b.ai.shown<0.4) return fun(a,b);
return 0;
}
if(b.identity=='zhu'){
if(numf==0&&!player.hasSkill('atttf')&&((player.storage.jlnj<1&&!player.isUnderControl(true))||player.storage.jlnj<2)) return 0.1;
return 0;
}
}
if(numf==0){
if(a.identity=='zhu'){
if(b.identity=='zhong'){
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1) return 6;
if(player.hasSkill('atttf')) return 6;
if(b==znmaxhp()) return -1;
return 0;
}
if(b.identity=='nei'){
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1) return -6;
if(player.hasSkill('atttf')) return -6;
if(b==znmaxhp()) return -1;
return 0;
}
}
if(a.identity=='zhong'){
if(b.identity=='zhong'&&b!=a){
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1) return 6;
if(player.hasSkill('atttf')) return 6;
if(b==znmaxhp()) return -6;
return -2;
}
if(b.identity=='nei'){
if((player.storage.jlnj>0&&!player.isUnderControl(true))||player.storage.jlnj>1) return -6;
if(player.hasSkill('atttf')) return -6;
if(b==znmaxhp()) return -6;
return -2;
}
}
}
return fun(a,b);
}
event.finish();
}
}
}
},
};
/*内奸跳忠*/
lib.skill.AIoptimize_1_tz={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
mode:["identity"],
ai:{
effect:{
player:function(card,player,target,current){
if(!player.isUnderControl(true)&&get.tag(card,'damage')){
if(target.identity=='zhu'){
return "zeroplayertarget";
}
if(target.identity=='fan'){
return 1;
}
if(target.identity=='zhong'){
return 0.5;
}
}
if(get.name(card)=="guohe"||get.name(card)=="lebu"||get.name(card)=="bingliang"||get.name(card)=="caomu"||get.name(card)=="zhujinqiyuan"||get.name(card)=="caochuanjiejian"||get.name(card)=="toulianghuanzhu"){
if(target.identity=='zhu'){
return 0.25;
}
if(target.identity=='fan'){
return 1;
}
if(target.identity=='zhong'){
return 0.5;
}
}
},
},
},
};
/*内奸跳反*/
lib.skill.AIoptimize_1_tf={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
mode:["identity"],
ai:{
effect:{
player:function(card,player,target,current){
if(!player.isUnderControl(true)&&get.tag(card,'damage')){
if(target.identity=='zhu'){
return "zeroplayertarget";
}
if(target.identity=='zhong'){
return 1;
}
if(target.identity=='fan'){
return 0.5;
}
}
if(get.name(card)=="guohe"||get.name(card)=="lebu"||get.name(card)=="bingliang"||get.name(card)=="caomu"||get.name(card)=="zhujinqiyuan"||get.name(card)=="caochuanjiejian"||get.name(card)=="toulianghuanzhu"){
if(game.zhu.hp>3&&target.identity=='zhu'){
return 0.25;
}
if(target.identity=='zhong'){
return 1;
}
if(target.identity=='fan'){
return 0.5;
}
}
},
},
},
};
/*AI嘲讽*/
lib.skill._wanjunpiyi={
trigger:{
global:"gameStart",
},
silent:true,
forced:true,
unique:true,
popup:false,
charlotte:true,
superCharlotte:true,
content:function(){
if(game.getRarity(player.name)=="common"){
player.addSkill('chaofeng_common');
}
if(game.getRarity(player.name)=="rare"){
player.addSkill('chaofeng_rare');
}
if(game.getRarity(player.name)=="epic"){
player.addSkill('chaofeng_epic');
}
if(game.getRarity(player.name)=="legend"){
player.addSkill('chaofeng_legend');
}
},
};
lib.skill.chaofeng_common={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
ai:{
threaten:1,
},
};
lib.skill.chaofeng_rare={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
ai:{
threaten:2,
},
};
lib.skill.chaofeng_epic={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
ai:{
threaten:3,
},
};
lib.skill.chaofeng_legend={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
ai:{
threaten:4,
},
};
/*身份场AI*/
lib.skill._AIoptimize_1={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
mode:["identity"],
ai:{
effect:{
player:function(card,player,target,current){
var numz=game.countPlayer(function(current){
return current.identity=='zhong';
});
var numf=game.countPlayer(function(current){
return current.identity=='fan';
});
var numn=game.countPlayer(function(current){
return current.identity=='nei';
});
/*桃补充*/
if(_status.mode=="normal"&&get.name(card)=="tao"&&card.isCard){
if(player.identity=='zhong'&&player.hp>=1&&game.zhu.hp<=1&&player.countCards('hs','tao')<=1&&target.identity!='zhu'){
return "zeroplayertarget";
}
}
/*桃园结义补充*/
if(_status.mode=="normal"&&get.name(card)=="taoyuan"){
if((player.identity=='zhong'||player.identity=='zhu')&&game.zhu.hp==1&&get.recoverEffect(game.zhu,player,player)>0){
return [0.5,0.5];
}
}
/*身份场主内反残局AI*/
if(player.identity=='zhu'&&_status.mode=="normal"&&get.tag(card,'damage')&&numz==0&&numf>0){
if(target.identity=='nei'){
return -1.5;
}
}
if(player.identity=='nei'&&_status.mode=="normal"&&get.tag(card,'damage')&&numz>=2&&numf==1){
if(target.identity=='fan'){
return -1.5;
}
}
if(player.identity=='fan'&&_status.mode=="normal"&&get.tag(card,'damage')){
if(numz>=2&&numf==1){
if(target.identity=='nei'){
return -1.5;
}
}
}
/*杀队友能赢？*/
if(player.isUnderControl(true)&&player.identity=='fan'&&get.tag(card,'damage')&&get.attitude(target,player)>0){
if(target.identity=='fan'&&target.hp==1&&target.countCards('h')<3&&(numz>0||numn>0)){
return "zeroplayertarget";
}
}
},
},
},
}
/*全局AI*/
lib.skill._AIoptimize_1_cs={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
mod:{
/*存牌*/
aiUseful:function(player,card,num){
if(player.hasSkillTag("maixie")&&player.hp>=3){
if(get.name(card)=='shan'){
return num-5;
}
}
if(player.getEquip('bagua')||player.getEquip('rewrite_bagua')||player.getEquip('renwang')||player.getEquip('rewrite_renwang')){
if(get.name(card)=='shan'){
return num-3;
}
}
if(player.hp>=3){
if(get.name(card)=='wuxie'){
return num+2;
}
if(get.name(card)=='shan'){
return num-2;
}
}
if(get.name(card)=='tao'){
return num+3;
}
if(get.name(card)=='jiu'){
return num+2;
}
},
aiValue:function(player,card,num){
/*武器对策*/
if(player.isPhaseUsing()){
if(player.countCards('hes',{name:'qinggang'})>=1&&game.hasPlayer(function(current){
return current!=player&&current.getEquip(2)&&get.attitude(player,current)<0;
})==1){
if(card.name=='qinggang'){
return num+15;
}
}
if(player.countCards('hes',{name:'qilin'})>=1&&game.hasPlayer(function(current){
return current!=player&&current.getEquip(3)&&get.attitude(player,current)<0;
})==1){
if(card.name=='qilin'){
return num+15;
}
}
if(player.countCards('hes',{name:'zhuque'})>=1&&game.hasPlayer(function(current){
return current!=player&&current.hasSkill('tengjia3')&&get.attitude(player,current)<0;
})==1){
if(card.name=='zhuque'){
return num+15;
}
}
if(player.countCards('hes',{name:'guding'})>=1&&game.hasPlayer(function(current){
return current!=player&&current.countCards('h')<=0&&get.attitude(player,current)<0;
})==1){
if(card.name=='guding'){
return num+15;
}
}
}
},
aiOrder:function(player,card,num){
/*观微*/
if(game.countPlayer(function(current){
return get.attitude(player,current)>0&&current.hasSkill('xinfu_guanwei')&&current.countCards('he')>0&&!current.hasSkill('xinfu_guanwei_off');
})){
if(typeof card=='object'&&player.isPhaseUsing()){
var evt=player.getLastUsed();
if(evt&&evt.card&&(get.suit(evt.card)&&get.suit(evt.card)==get.suit(card))){
return num+10;
}
}
}
},
},
ai:{
effect:{
player:function(card,player,target,current){
if(!player.isUnderControl(true)){
var numz=game.countPlayer(function(current){
return current.identity=='zhong';
});
var numf=game.countPlayer(function(current){
return current.identity=='fan';
});
/*横置对策*/
var hzdy=game.countPlayer(function(current){
return current.isLinked()&&!current.hasSkillTag('nodamage')&&get.attitude(current,player)>0;
});
var hzdr=game.countPlayer(function(current){
return current.isLinked()&&!current.hasSkillTag('nodamage')&&get.attitude(current,player)<=0;
});
var hzdyf=game.countPlayer(function(current){
return current.isLinked()&&!(current.hasSkillTag('nodamage')||current.hasSkillTag('nofire'))&&get.attitude(current,player)>0;
});
var hzdrf=game.countPlayer(function(current){
return current.isLinked()&&!(current.hasSkillTag('nodamage')||current.hasSkillTag('nofire'))&&get.attitude(current,player)<=0;
});
var hzdyt=game.countPlayer(function(current){
return current.isLinked()&&!(current.hasSkillTag('nodamage')||current.hasSkillTag('nothunder'))&&get.attitude(current,player)>0;
});
var hzdrt=game.countPlayer(function(current){
return current.isLinked()&&!(current.hasSkillTag('nodamage')||current.hasSkillTag('nothunder'))&&get.attitude(current,player)<=0;
});
var cxhzdyf=game.countPlayer(function(current){
return current.isLinked()&&!(current.hasSkillTag('nodamage')||current.hasSkillTag('nofire'))&&current.hp<=1&&get.attitude(current,player)>0;
});
var cxhzdyt=game.countPlayer(function(current){
return current.isLinked()&&!(current.hasSkillTag('nodamage')||current.hasSkillTag('nothunder'))&&current.hp<=1&&get.attitude(current,player)>0;
});
if(!player.isUnderControl(true)&&get.tag(card,'damage')&&card.nature&&get.attitude(target,player)>0){
if(target.isLinked()&&hzdr>0){
return "zeroplayertarget";
}
}
if(get.tag(card,'damage')&&card.nature&&card.nature=='fire'){
if(target.isLinked()){
if(hzdyf>=hzdrf&&cxhzdyf>=1){
return "zeroplayertarget";
}
if(get.mode()=='identity'){
if(player.identity=='zhong'&&game.zhu.isLinked()&&game.zhu.hp<=3&&!(game.zhu.hasSkillTag('nodamage')||game.zhu.hasSkillTag('nofire'))){
return "zeroplayertarget";
}
if(player.identity=='zhu'&&cxhzdyf>=1){
return "zeroplayertarget";
}
if(player.identity=='nei'&&game.zhu.isLinked()&&game.zhu.hp<=3&&(numz>0||numf>0)){
return "zeroplayertarget";
}
if(player.identity=='nei'&&player.isLinked()&&player.hp<=2&&target.identity!='zhu'){
return "zeroplayertarget";
}
}
}
}
if(get.tag(card,'damage')&&card.nature&&card.nature=='thunder'){
if(target.isLinked()){
if(hzdyt>=hzdrt&&cxhzdyt>=1){
return "zeroplayertarget";
}
if(get.mode()=='identity'){
if(player.identity=='zhong'&&game.zhu.isLinked()&&game.zhu.hp<=3&&!(game.zhu.hasSkillTag('nodamage')||game.zhu.hasSkillTag('nothunder'))){
return "zeroplayertarget";
}
if(player.identity=='zhu'&&cxhzdyt>=1){
return "zeroplayertarget";
}
if(player.identity=='nei'&&game.zhu.isLinked()&&game.zhu.hp<=3&&(numz>0||numf>0)){
return "zeroplayertarget";
}
if(player.identity=='nei'&&player.isLinked()&&player.hp<=2&&target.identity!='zhu'){
return "zeroplayertarget";
}
}
}
}
/*杀对策*/
if(get.name(card)=="sha"){
if(!player.hasSkill('xinpojun')&&!player.hasSkill('repojun')&&!player.hasSkill('decadepojun')&&!player.hasSkillTag('unequip_ai')){
if((target.hasSkill('tengjia3')||target.hasSkill('rw_tengjia4'))&&!card.nature){
if(!(player.getEquip('zhuque')||player.getEquip('qinggang')||player.hasSkillTag('unequip_ai'))){
return "zeroplayertarget";
}
}
if(target.hasSkill('tengjia2')&&card.nature&&get.attitude(player,target)<0){
return 1;
}
if(target.hasSkill('tengjia2')&&player.getEquip('zhuque')&&get.attitude(player,target)<0){
return 1;
}
if(target.hasSkill('renwang_skill')||target.hasSkill('rw_renwang_skill')){
if(get.color(card)=='black'){
if(!(player.getEquip('qinggang')||player.hasSkillTag('unequip_ai'))){
return "zeroplayertarget";
}
}
}
}
if(target.hasSkillTag("useShan")){
if(get.attitude(player,target)>0){
if(player.hasSkill('jiu')){
return -1.5;
}
if(target.getEquip('bagua')&&player.getEquip('qinggang')){
return -1.5;
}
if(card.nature&&target.hasSkill('tengjia2')){
return -1;
}
if(!card.nature&&target.hasSkill('tengjia2')){
return "zeroplayertarget";
}
if(target.hasSkill('renwang_skill')){
if(get.color(card)=='black'){
return "zeroplayertarget";
}
}
if(target.getEquip('bagua')){
return 1;
}
if(target.countCards('hs',{name:'shan'})<=1){
return -0.5;
}
}
if(get.attitude(player,target)<0){
if(player.hasSkillTag('directHit_ai',true,{
target:target,
card:{name:'sha'},
},true)){
return 1.5;
}
}
if(!player.hasSkillTag('directHit_ai',true,{
target:target,
card:{name:'sha'},
},true)){
if(target.countCards('hs')>=3){
return -0.5;
}
}
if(target.countCards('hes')==0){
return 1;
}
}
if(player.hasSkill('jiu')){
if((target.getEquip('baiyin')||target.getEquip('rewrite_baiyin'))&&get.attitude(target,player)<0){
if(!player.hasSkillTag('directHit_ai',true,{
target:target,
card:{name:'sha'},
},true)&&!(player.getEquip('qinggang')||player.hasSkillTag('unequip_ai'))){
return -0.5;
}
}
if(get.attitude(target,player)>0){
if(target.hasSkillTag("maixie")){
return -1.5;
}
if(target.hasSkillTag("useShan")){
return -1;
}
}
}
var qzwz=game.countPlayer(function(current){
return current.getSeatNum()<player.getSeatNum()&&current.identity=='zhong';
});
var qzwf=game.countPlayer(function(current){
return current.getSeatNum()<player.getSeatNum()&&current.identity=='fan';
});
if(game.roundNumber==1){
if(qzwz>=numz){
if(player.identity=='fan'&&target.identity=='fan'){
return "zeroplayertarget";
}
if(player.identity=='fan'&&target.identity!='fan'){
return 1;
}
}
if(qzwf>=numf){
if(player.identity=='zhong'&&target.identity=='zhong'){
return "zeroplayertarget";
}
if(player.identity=='zhong'&&target.identity=='fan'){
return 1;
}
}
if(get.attitude(player,target)<0){
return 1;
}
if(get.attitude(player,target)==0){
return [0.5,0.5];
}
}
}
/*酒对策*/
/*if(get.name(card)=="jiu"){
var tri=_status.event.getTrigger();
if(!player.hasSkill('yun_xiongxu')&&!player.hasSkill('xinfu_tushe')&&!player.hasSkill('hengwu')){
if(player.hp>0&&target==player&&player.countCards('hs','sha')>0&&!game.hasPlayer(function(current){
return current!=player&&player.inRange(current)&&get.attitude(player,current)<0&&!current.hasSkill('baiyin_skill')&&!current.hasSkill('rw_baiyin_skill');
})){
return "zeroplayertarget";
}
if(player.hp>0&&target==player&&player.countCards('hs','sha')==0){
return "zeroplayertarget";
}
}
if(player.identity=='fan'&&tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'){
if(player.countCards('h')<3){
return "zeroplayertarget";
}
}
}*/
//过河拆桥&顺手牵羊对策
if(get.name(card)=="guohe"||get.name(card)=="shunshou"){
if(get.attitude(player,target)<0&&target.getDamagedHp()&&target.countCards('h')==0&&target.countCards('e')==1&&(target.getEquip('baiyin')||target.getEquip('rewrite_baiyin'))){
return "zeroplayertarget";
}
if(get.attitude(player,target)<0&&target.countCards('he')==0&&(target.hasJudge('bingliang')||target.hasJudge('lebu'))){
return "zeroplayertarget";
}
if(get.attitude(player,target)>0&&(target.hasJudge('bingliang')||target.hasJudge('lebu'))){
return 2.5;
}
if(get.attitude(player,target)>0&&(target.hasJudge('shandian')||target.hasJudge('fulei'))&&(target.hasSkillTag('nodamage')||target.hasSkillTag('nothunder')||target.hasSkillTag('rejudge'))){
return "zeroplayertarget";
}
if(game.roundNumber==1){
if(qzwz>=numz){
if(player.identity=='fan'&&target.identity=='fan'){
return "zeroplayertarget";
}
if(player.identity=='fan'&&target.identity!='fan'){
return 1;
}
}
if(qzwf>=numf){
if(player.identity=='zhong'&&target.identity=='zhong'){
return "zeroplayertarget";
}
if(player.identity=='zhong'&&target.identity=='fan'){
return 1;
}
}
if(get.attitude(player,target)<0){
return 1;
}
if(get.attitude(player,target)==0){
return [0.5,0.5];
}
}
}
/*兵乐对策*/
if(get.mode()=='identity'&&game.roundNumber==1){
if(get.name(card)=="bingliang"||get.name(card)=="lebu"){
if(game.roundNumber==1){
if(qzwz>=numz){
if(player.identity=='fan'&&target.identity=='fan'){
return "zeroplayertarget";
}
if(player.identity=='fan'&&target.identity!='fan'){
return 1;
}
}
if(qzwf>=numf){
if(player.identity=='zhong'&&target.identity=='zhong'){
return "zeroplayertarget";
}
if(player.identity=='zhong'&&target.identity=='fan'){
return 1;
}
}
if(get.attitude(player,target)<0){
return 1;
}
if(get.attitude(player,target)==0){
return [0.5,0.5];
}
}
}
}
/*闪电对策*/
var gpdy=game.countPlayer(function(current){
return (current.hasSkillTag('rejudge')||current.hasSkill('yun_dunshu'))&&get.attitude(current,player)>0;
});
if((get.name(card)=="shandian"||get.name(card)=="fulei")&&gpdy==0){
return "zeroplayertarget";
}
/*南蛮万箭对策*/
if(get.name(card)=="nanman"||get.name(card)=="wanjian"){
var dy=game.countPlayer(function(current){
return get.attitude(current,player)>0&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'));
});
var dr=game.countPlayer(function(current){
return get.attitude(current,player)<=0&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'));
});
var mxdy=game.countPlayer(function(current){
return get.attitude(current,player)>0&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&current.hasSkillTag("maixie")&&current.hp>=3;
});
var mxdr=game.countPlayer(function(current){
return get.attitude(current,player)<=0&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&current.hasSkillTag("maixie")&&current.hp>=3;
});
var cxdy=game.countPlayer(function(current){
return current.hp==1&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&get.attitude(current,player)>0;
});
var cxdr=game.countPlayer(function(current){
return current.hp==1&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&get.attitude(current,player)<=0;
});
var cxzc=game.countPlayer(function(current){
return current.hp==1&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&current.identity=='zhong';
});
var cxfz=game.countPlayer(function(current){
return current.hp==1&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&current.identity=='fan';
});
var numz=game.countPlayer(function(current){
return current.identity=='zhong'||current.identity=='mingzhong';
});
var numf=game.countPlayer(function(current){
return current.identity=='fan';
});
if(game.players.length==2){
if(game.hasPlayer(function(current){
return get.attitude(player,current)<0&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))
})){
return 1;
}else{
return "zeroplayertarget";
}
}
if(get.mode()=='identity'){
if((player.identity=='zhu')&&cxzc==0){
return 1;
}
if(player.identity=='zhu'&&cxzc>0){
return "zeroplayertarget";
}
if(player.identity=='zhong'&&(game.zhu.isMinHp()||game.zhu.hp<=2||cxzc>0)){
return "zeroplayertarget";
}
if(player.identity=='zhong'&&cxzc<=0&&game.zhu.hp>2&&cxfz>0){
return 1;
}
if(player.identity=='fan'&&game.zhu.hp<=2){
return 1;
}
if(player.identity=='fan'&&cxfz>cxzc&&cxfz>=2){
return "zeroplayertarget";
}
if(player.identity=='fan'&&game.zhu.hp>=3&&cxfz>cxzc&&cxfz>0){
return "zeroplayertarget";
}
if(player.identity=='nei'){
if(game.zhu.hp>2||(numf==0&&numz==0)) return 1;
}
if(game.zhu.hp<=2&&(numf>=0||numz>=0)){
return "zeroplayertarget";
}
}
if(get.mode()!='identity'){
if(cxdy>=cxdr&&cxdy>0){
return "zeroplayertarget";
}
if(cxdy<(cxdr+1)&&cxdr>0){
return 1;
}
if(dy==0&&dr>0){
return 1;
}
if(dy>=dr&&dy>0&&cxdy<=0){
return "zeroplayertarget";
}
if(mxdr>mxdy&&mxdr>0){
return "zeroplayertarget";
}
if(get.mode()=='doudizhu'&&game.zhu==player&&dr>0){
return 1;
}
if(get.mode()=='doudizhu'&&game.zhu!=player&&dy>0&&game.zhu.hp>2){
return "zeroplayertarget";
}
if(!player.isUnderControl(true)&&get.mode()=='doudizhu'&&game.zhu!=player&&(game.zhu.hasSkill('tengjia1')||game.zhu.hasSkill('rw_tengjia1'))){
return "zeroplayertarget";
}
}
}
}
},
target:function(card,player,target,current){
/*免伤对策*/
if(get.tag(card,'damage')&&!card.nature){
if(target.hasSkillTag('nodamage')) return "zeroplayertarget";
}
if(get.tag(card,'damage')&&card.nature=='thunder'){
if(target.hasSkillTag('nodamage')||target.hasSkillTag('nothunder')) return "zeroplayertarget";
}
if(get.tag(card,'damage')&&card.nature=='fire'){
if(target.hasSkillTag('nodamage')||target.hasSkillTag('nofire')) return "zeroplayertarget";
}
/*卖血对策*/
var dr=game.countPlayer(function(current){
return get.attitude(current,player)<=0&&current!=player;
});
var mxdr=game.countPlayer(function(current){
return get.attitude(current,player)<=0&&current!=player&&current.hasSkillTag("maixie");
});
if(get.tag(card,'damage')){
if(target.hasSkillTag("maixie")){
if(get.attitude(player,target)>0&&(target.hasSkill('lingren_jianxiong')||target.hasSkill('new_rejianxiong')||target.hasSkill('jianxiong')||target.hasSkill('huituo')||target.hasSkill('qianlong')||target.hasSkill('reandong')||target.hasSkill('fenyong2')||target.hasSkillTag('nodamage')||target.hasSkill('fenyong2')||target.hasSkill('hunzi')||target.hasSkill('rehunzi')||target.hasSkill('olhunzi'))){
return false;
}
if(!target.hasSkillTag("maixie_defend")){
if(get.attitude(player,target)>0){
if(player.hasSkillTag('jueqing',false,target)){
return [0,-2.5];
}
if(get.name(card)=="sha"&&player.hasSkill('jiu')){
return [0,-2.5];
}
if(get.name(card)=="huogong"&&target.getEquip('tengjia')){
return [-2.5,-2.5];
}
if(get.name(card)=="huogong"&&target.hp<=3){
return [-2.5,-2.5];
}
if(get.name(card)=="huogong"&&player.countCards('h')<=5){
return [-2.5,-2.5];
}
if(get.name(card)=="sha"&&target.countCards('h')==0&&player.getEquip('guding')){
return [0,-2.5];
}
if(get.name(card)=="sha"&&card.nature&&target.hasSkill('tengjia2')){
return [0,-2.5];
}
}
if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
if(player.hasSkillTag('ignoreSkill',false,target)) return [1,-1];
if(!target.hasFriend()) return;
if(get.attitude(player,target)>0){
if(target.hp>=3&&target.countCards('hs','tao')>=1){
return [0.25,0.25];
}
if(target.hp>=3){
return [0.15,0.15];
}
if(target.hp==2&&target.countCards('hs','tao')>=1){
return [0.05,0.05];
}
if(target.hp==2){
return [-0.15,-0.15];
}
if(target.hp==1){
return [-0.25,-0.25];
}
}
}
}
if(get.attitude(player,target)<0){
if(!target.hasFriend()) return;
if(player.hasSkillTag('jueqing',false,target)) return [1,-1.5];
if(player.hasSkillTag('ignoreSkill',false,target)) return [1,-1];
if(player!=target&&target.hasSkillTag("maixie_defend")){
return [0.5,0.5];
}
}
}
},
},
},
}
/*无懈对策*/
lib.skill._AIoptimize_1_wuxie={
trigger:{
global:"useCardToPlayered",
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
filter:function(event,player){
return get.type(event.card)=='trick';
},
content:function(){
if(get.mode()=='identity'){
if(get.tag(trigger.card,'damage')){
if((player.identity=='zhu'||player.identity=='zhong')&&trigger.target.identity=='fan'){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
if((trigger.target.identity=='zhu'||trigger.target.identity=='zhong')&&player.identity=='fan'){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
}
if(player.countCards('hs',{name:'wuxie'})==1&&(player.hasJudge('lebu')||player.hasJudge('bingliang'))&&player!=_status.currentPhase){
if(get.attitude(player,trigger.target)>0&&get.tag(trigger.card,'damage')){
if(get.mode()=='identity'&&player.identity=='zhong'&&trigger.target==game.zhu){
if(game.zhu.hp>2&&player.hp>1){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
if(trigger.target.hp>=2&&player.hp>1){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
if(get.attitude(player,trigger.target)<0&&!get.tag(trigger.card,'damage')){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
if(get.attitude(player,trigger.target)>0&&!get.tag(trigger.card,'damage')){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
if((get.name(trigger.card)=='guohe'||get.name(trigger.card)=='shunshou')&&get.attitude(player,trigger.player)>0&&get.attitude(player,trigger.target)>0){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
if(get.name(trigger.card)=='guohe'&&get.attitude(player,trigger.target)>0&&get.attitude(player,trigger.player)<=0){
if(!trigger.target.getEquip(2)&&!trigger.target.getEquip(3)){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
if(get.name(trigger.card)=='guohe'&&trigger.target.countCards('h',{name:'wuxie'})==1&&trigger.target.countCards('h')==1){
if(trigger.target!=player){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
if(get.name(trigger.card)=='huogong'){
if(get.attitude(player,trigger.target)>0&&get.attitude(player,trigger.player)<=0&&player.countCards('hs',{name:'wuxie'})==1){
if(!trigger.target.hasSkill('tengjia2')&&(trigger.target.hp>=2||trigger.target.hasSkillTag('nofire')||trigger.target.hasSkillTag('nodamage'))){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
if(get.attitude(player,trigger.player)>0){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
if(get.name(trigger.card)=='juedou'){
if(get.attitude(player,trigger.player)>0&&get.attitude(player,trigger.target)<=0){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
if(get.attitude(player,trigger.player)<=0&&get.attitude(player,trigger.target)>0&&trigger.target.hp>2&&trigger.target!=player){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
if(get.name(trigger.card)=='tiesuo'){
var hz=game.countPlayer(function(current){
return current.isLinked()&&!current.hasSkillTag('nodamage')&&get.attitude(current,player)>0;
});
if(get.attitude(player,trigger.target)>0&&(!trigger.target.hasSkill('tengjia2')||trigger.target.hp>2||hz<=1)){
player.addTempSkill('AIoptimize_1_wuxie_fy','useCardToAfter');
}
}
},
}
lib.skill._AIoptimize_1_wuxie_jiedao={
trigger:{
global:"useCard",
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
filter:function(event,player,card){
return player.countCards('hs',{name:'wuxie'})==1&&event.card.name=='jiedao';
},
content:function(){
player.addTempSkill('AIoptimize_1_wuxie_fy','jiedaoAfter');
},
}
lib.skill._AIoptimize_1_wuxie_lei={
trigger:{
global:"phaseJudgeBefore",
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
filter:function(event,player,card){
return event.player.countCards('j')<=1&&(event.player.hasJudge('shandian')||event.player.hasJudge('fulei'))&&(player.hasSkillTag('rejudge')||event.player.hasSkillTag('nodamage')||event.player.hasSkillTag('nothunder'));
},
content:function(){
player.addTempSkill('AIoptimize_1_wuxie_fy','phaseJudgeAfter');
},
}
lib.skill.AIoptimize_1_wuxie_fy={
trigger:{
global:"useCard",
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
filter:function(event,player){
return event.card.name=='wuxie';
},
content:function(){
player.removeSkill('AIoptimize_1_wuxie_fy');
},
ai:{
effect:{
player:function(card,player,target){
if(get.name(card)=='wuxie'){
return "zeroplayertarget";
}
},
},
},
}
/*五谷对策*/
lib.skill._AIoptimize_1_wugu={
trigger:{
global:"wuguBegin",
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
content:function(){
if(player.getDamagedHp()){
player.addTempSkill('AIoptimize_1_wugu_ss_pai','wuguAfter');
}
if(!player.getDamagedHp()){
player.addTempSkill('AIoptimize_1_wugu_wss_pai','wuguAfter');
}
},
}
lib.skill.AIoptimize_1_wugu_ss_pai={
mod:{
aiValue:function(player,card,num){
if(card.name=="tao") return num+10;
if(card.name=="wuzhong") return num+9;
if(card.name=="jiu") return num+8;
if(card.name=="wuxie") return num+7;
if(card.name=="shunshou") return num+6;
if(card.name=="guohe") return num+5;
if(card.name=="lebu") return num+4;
if(card.name=="bingliang") return num+3;
},
},
}
lib.skill.AIoptimize_1_wugu_wss_pai={
mod:{
aiValue:function(player,card,num){
if(card.name=="wuzhong") return num+10;
if(card.name=="wuxie") return num+9;
if(card.name=="shunshou") return num+8;
if(card.name=="tao") return num+7;
if(card.name=="guohe") return num+6;
if(card.name=="lebu") return num+5;
if(card.name=="bingliang") return num+4;
if(card.name=="jiu") return num+3;
},
},
}
/*弃置牌对策*/
lib.skill._AIoptimize_1_Discard={
trigger:{
player:"chooseToDiscardBefore",
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
filter:function(event,player,card){
if(game.countPlayer(function(current){
return current.hp==1&&get.attitude(current,player)<0;
})>0) return false;
var evt=event.getParent('phaseDiscard');
return evt&&evt.name!='phaseDiscard';
},
content:function(){
player.addTempSkill('AIoptimize_1_Discard_key','chooseToDiscardAfter');
},
}
lib.skill.AIoptimize_1_Discard_key={
mod:{
aiValue:function(player,card,num){
if(player.hp>2&&player.countCards('h')<=2){
if(card.name=="wuzhong") return num+3;
}
if(player.hasJudge('lebu')||player.hasJudge('bingliang')){
if(card.name=="wuxie") return num+3;
}
if(player.hp<=2){
if(card.name=="tao") return num+3;
}
if(player.hp<=1){
if(card.name=="tao") return num+3;
if(card.name=="jiu") return num+3;
if(card.name=="du") return num+3;
}
},
aiUseful:function(player,card,num){
if(player.hp>2&&player.countCards('h')<=2){
if(card.name=="wuzhong") return num+3;
}
if(player.hasJudge('lebu')||player.hasJudge('bingliang')){
if(card.name=="wuxie") return num+3;
}
if(player.hp<=2){
if(card.name=="tao") return num+3;
}
if(player.hp<=1){
if(card.name=="tao") return num+3;
if(card.name=="jiu") return num+3;
if(card.name=="du") return num+3;
}
},
},
}
lib.skill._AIoptimize_1_Discard_du={
trigger:{
player:"phaseDiscardBefore",
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
filter:function(event,player,card){
return player.countCards('h',{name:'du'})>=player.hp;
},
content:function(){
player.addTempSkill('AIoptimize_1_Discard_du_useful','phaseDiscardAfter');
},
}
lib.skill.AIoptimize_1_Discard_du_useful={
aiUseful:function(player,card,num){
if(get.name(card)=='du'){
return get.useful({name:'jiu'})-0.5;
}
},
}
/*小人AI*/
lib.skill._AIoptimize_1_doudizhu={
trigger:{
target:"useCardToTargeted",
},
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
filter:function(event,player,card){
return event.card&&event.card.name=='sha'&&_status.currentPhase!=player;
},
content:function(){
'step 0'
var hzdy=game.countPlayer(function(current){
return current.isLinked()&&get.attitude(current,player)>0;
});
var hzdr=game.countPlayer(function(current){
return current.isLinked()&&get.attitude(current,player)<=0;
});
var hzcxdy=game.countPlayer(function(current){
return current.isLinked()&&get.attitude(current,player)>0&&current!=player&&current.hp<=1;
});
var hzcxdr=game.countPlayer(function(current){
return current.isLinked()&&get.attitude(current,player)<=0&&current!=player&&current.hp<=1;
});
if(trigger.player.hasSkill('yun_zhaoying')||trigger.player.hasSkill('yun_jiwu_damage')||trigger.player.hasSkill('luoyi2')||trigger.player.hasSkill('reluoyi2')||trigger.player.hasSkill('repojun')||trigger.player.hasSkill('hanbing_skill')||trigger.player.hasSkill('xinfu_zengdao2')||trigger.player.hasSkill('xinliegong')||trigger.player.hasSkill('anjian')||trigger.player.hasSkill('reanjian')||trigger.player.hasSkill('xinanjian')||trigger.player.hasSkill('lkzhongzhuang')||trigger.player.hasSkill('decadexianzhen2')||trigger.player.hasSkill('twxuhe_damage')||trigger.player.hasSkill('twchuanshu_effect')||trigger.player.hasSkill('xinqingxi')||trigger.player.hasSkill('twqingxi')||trigger.player.hasSkill('nsshijun')||trigger.player.hasSkill('liyong2')||trigger.player.hasSkill('wangong2')||trigger.player.hasSkill('pyzhuren_diamond')||trigger.player.hasSkill('tuxing2')||trigger.player.hasSkill('spjiedao')||trigger.player.hasSkill('yun_yijue')||trigger.player.hasSkill('yun_wusheng')||trigger.player.hasSkill('yun_poshi')||trigger.player.hasSkill('dcyiyong')||trigger.player.hasSkill('rezhiman')||player.hasSkill('zhenlie')||player.hasSkill('bazhen')||player.hasSkill('juezhen')||player.hasSkill('lingren_adddamage')||player.hasSkill('yun_lingren_damage')||player.hasSkill('cuijin')||player.hasSkill('shouli_thunder')||player.hasSkill('twyiju')||player.hasSkill('twzhongchi_effect')||player.hasSkill('reyanzhu2')||player.hasSkill('twqiongji')||player.hasSkill('yise_damage')||player.hasSkill('dcshizhao_effect')||player.getEquip('bagua')||player.hasSkillTag("useShan")||player.hasSkillTag("respondShan")||(trigger.card.nature=='fire'&&player.hasSkillTag('tengjia3'))||player.countMark('xionghuo')>0||player.countMark('dcfudao_deadmark')>0){
event.finish();
}
'step 1'
if(trigger.player.countCards('hs',{name:'sha'})>=1&&trigger.player.getCardUsable('sha')>=1&&trigger.getParent(1).jiu!=true&&player.countCards('hs',{name:'shan'})==1&&player.hp>1){
player.addTempSkill('AIoptimize_1_shan_fy','shaAfter');
}
},
}
lib.skill.AIoptimize_1_shan_fy={
forced:true,
unique:true,
popup:false,
silent:true,
charlotte:true,
superCharlotte:true,
ai:{
effect:{
player:function(card,player,target){
if(get.name(card)=='shan'){
return "zeroplayertarget";
}
},
},
},
}
/*本体武将AI修改*/
/*整肃*/
lib.skill.zhengsu={
trigger:{
player:"phaseDiscardEnd",
},
forced:true,
charlotte:true,
filter:function(event,player){
return (player.storage.zhengsu_leijin||player.storage.zhengsu_bianzhen||player.storage.zhengsu_mingzhi);
},
content:function(){
player.chooseDrawRecover(2,'整肃奖励：摸两张牌或回复1点体力');
},
subSkill:{
leijin:{
mark:true,
trigger:{
player:"useCard1",
},
lastDo:true,
charlotte:true,
forced:true,
popup:false,
onremove:true,
filter:function(event,player){
return player.isPhaseUsing()&&player.storage.zhengsu_leijin!==false;
},
content:function(){
var list=player.getHistory('useCard',function(evt){
return evt.isPhaseUsing(player);
});
var goon=true;
for(var i=0;i<list.length;i++){
var num=get.number(list[i].card);
if(typeof num!='number'){
goon=false;
break;
}
if(i>0){
var num2=get.number(list[i-1].card);
if(typeof num2!='number'||num2>=num){
goon=false;
break;
}
}
}
if(!goon){
game.broadcastAll(function(player){
player.storage.zhengsu_leijin=false;
if(player.marks.zhengsu_leijin) player.marks.zhengsu_leijin.firstChild.innerHTML='╳';
delete player.storage.zhengsu_leijin_markcount;
},player);
}
else{
if(list.length>2){
game.broadcastAll(function(player,num){
if(player.marks.zhengsu_leijin) player.marks.zhengsu_leijin.firstChild.innerHTML='○';
player.storage.zhengsu_leijin=true;
player.storage.zhengsu_leijin_markcount=num;
},player,num);
}
else game.broadcastAll(function(player,num){
player.storage.zhengsu_leijin_markcount=num;
},player,num);
}
player.markSkill('zhengsu_leijin');
},
intro:{
content:"<li>条件：回合内所有于出牌阶段使用的牌点数递增且不少于三张。",
},
mod:{
aiOrder:function(player,card,num){
if(typeof card.number!='number') return;
var history=player.getHistory('useCard',function(evt){
return evt.isPhaseUsing();
});
if(history.length==0) return num+10*(14-card.number);
var num=get.number(history[0].card);
if(!num) return;
for(var i=1;i<history.length;i++){
var num2=get.number(history[i].card);
if(!num2||num2<=num) return;
num=num2;
}
if(card.number>num) return num+10*(14-card.number);
},
},
sub:true,
},
bianzhen:{
mark:true,
trigger:{
player:"useCard1",
},
firstDo:true,
charlotte:true,
forced:true,
popup:false,
onremove:true,
filter:function(event,player){
return player.isPhaseUsing()&&player.storage.zhengsu_bianzhen!==false;
},
content:function(){
var list=player.getHistory('useCard',function(evt){
return evt.isPhaseUsing();
});
var goon=true,suit=get.suit(list[0].card,false);
if(suit=='none'){
goon=false;
}
else{
for(var i=1;i<list.length;i++){
if(get.suit(list[i])!=suit){
goon=false;
break;
}
}
}
if(!goon){
game.broadcastAll(function(player){
player.storage.zhengsu_bianzhen=false;
if(player.marks.zhengsu_bianzhen) player.marks.zhengsu_bianzhen.firstChild.innerHTML='╳';
},player);
}
else{
if(list.length>1){
game.broadcastAll(function(player){
if(player.marks.zhengsu_bianzhen) player.marks.zhengsu_bianzhen.firstChild.innerHTML='○';
player.storage.zhengsu_bianzhen=true;
},player);
}
else game.broadcastAll(function(player,suit){
if(player.marks.zhengsu_bianzhen) player.marks.zhengsu_bianzhen.firstChild.innerHTML=get.translation(suit);
},player,suit);
}
player.markSkill('zhengsu_bianzhen');
},
intro:{
content:"<li>条件：回合内所有于出牌阶段使用的牌花色相同且不少于两张。",
},
mod:{
aiOrder:function(player,card,num){
if(typeof card=='object'&&player.isPhaseUsing()){
var evt=player.getLastUsed();
if(evt&&evt.card&&(get.suit(evt.card)&&get.suit(evt.card)==get.suit(card))){
return num+10;
}
}
},
},
sub:true,
},
mingzhi:{
mark:true,
trigger:{
player:"loseAfter",
},
firstDo:true,
charlotte:true,
forced:true,
popup:false,
onremove:true,
filter:function(event,player){
if(player.storage.zhengsu_mingzhi===false||event.type!='discard') return false;
var evt=event.getParent('phaseDiscard');
return evt&&evt.player==player;
},
content:function(){
var goon=true,list=[];
player.getHistory('lose',function(event){
if(!goon||event.type!='discard') return false;
var evt=event.getParent('phaseDiscard');
if(evt&&evt.player==player){
for(var i of event.cards2){
var suit=get.suit(i,player);
if(list.contains(suit)){
goon=false;
break;
}
else list.push(suit);
}
}
});
if(!goon){
game.broadcastAll(function(player){
player.storage.zhengsu_mingzhi=false;
if(player.marks.zhengsu_mingzhi) player.marks.zhengsu_mingzhi.firstChild.innerHTML='╳';
delete player.storage.zhengsu_mingzhi_list;
},player);
}
else{
if(list.length>1){
game.broadcastAll(function(player,list){
if(player.marks.zhengsu_mingzhi) player.marks.zhengsu_mingzhi.firstChild.innerHTML='○';
player.storage.zhengsu_mingzhi=true;
player.storage.zhengsu_mingzhi_list=list;
player.storage.zhengsu_mingzhi_markcount=list.length;
},player,list);
}
else game.broadcastAll(function(player,list){
player.storage.zhengsu_mingzhi_list=list;
player.storage.zhengsu_mingzhi_markcount=list.length;
},player,list);
}
player.markSkill('zhengsu_mingzhi');
},
intro:{
content:"<li>条件：回合内所有于弃牌阶段弃置的牌花色均不相同且不少于两张。",
},
sub:true,
},
},
};
/*地主飞扬*/
lib.skill.feiyang={
trigger:{
player:"phaseJudgeBegin",
},
charlotte:true,
direct:true,
filter:function(event,player){
return _status.mode!='online'&&_status.mode!='binglin'&&player==game.zhu&&player.countCards('j')&&player.countCards('h')>1;
},
content:function(){
"step 0"
player.chooseToDiscard('h',2,'是否发动【飞扬】，弃置两张手牌并弃置自己判定区的一张牌？').set('logSkill','feiyang').ai=function(card){
if(player.countCards('j')<=1&&(player.hasSkillTag('rejudge')||player.hasSkillTag('nodamage')||player.hasSkillTag('nothunder'))&&(player.hasJudge('shandian')||player.hasJudge('fulei'))) return false;
return 6-get.value(card);
};
"step 1"
if(result.bool){
player.discardPlayerCard(player,'j',true).ai=function(card){
if(player.countCards('h')<2&&(!player.hasJudge('shandian')||!player.hasJudge('fulei'))){
return -ai.get.value(card);
}
return ai.get.value(card);
};
}
},
};
/*椎锋*/
lib.skill.dbzhuifeng={
audio:2,
groupSkill:true,
enable:'phaseUse',
usable:2,
viewAsFilter:function(player){
return player.group=='wei'&&player.hp>0;
},
viewAs:{name:'juedou',isCard:true},
filterCard:()=>false,
selectCard:-1,
log:false,
precontent:function(){
player.logSkill('dbzhuifeng');
player.loseHp();
},
group:'dbzhuifeng_self',
subSkill:{
self:{
trigger:{player:'damageBegin2'},
forced:true,
filter:function(event,player){
var evt=event.getParent();
return evt.skill=='dbzhuifeng'&&evt.player==player;
},
content:function(){
trigger.cancel();
player.getStat().skill.dbzhuifeng=2;
},
},
},
ai:{
order:function(){
return get.order({name:'juedou'})-0.5;
},
result:{
player:function(player,target){
if(player.hp==1) return -999;
},
},
},
};
/*修好*/
lib.skill.olxiuhao={
audio:2,
trigger:{
player:'damageBegin4',
source:'damageBegin2',
},
usable:1,
filter:function(event,player){
return event.source&&event.source.isIn()&&event.source!=event.player;
},
logTarget:function(event,player){
return player==event.player?event.source:event.player;
},
check:function(event,player){
_status.olxiuhao_judging=true;
var bool=false;
if(player==event.source){
if(get.attitude(player,event.player)>0) bool=true;
if(get.damageEffect(event.player,player,player,event.nature)<=0) bool=true;
}else{
if(get.attitude(player,event.source)>0) bool=true;
if(get.damageEffect(player,event.source,player,event.nature)<0){
if(event.source.hasSkillTag('nogain')) bool=true;
if(event.num>=player.hp+player.countCards('hs',{name:['tao','jiu']})&&(!player.hasFriend()||player==get.zhu(player))) bool=true;
}
}
delete _status.olxiuhao_judging;
return bool;
},
content:function(){
trigger.cancel();
trigger.source.draw(2);
},
ai:{
effect:{
target:function(card,player,target){
if(target!=player&&!_status.olxiuhao_judging&&get.tag(card,'damage')&&get.attitude(target,player)>0&&(!target.storage.counttrigger||!target.storage.counttrigger.olxiuhao)) return [0,0.5,0,0.5];
},
player:function(card,player,target){
if(target!=player&&!_status.olxiuhao_judging&&get.tag(card,'damage')&&get.attitude(player,target)>0&&(!player.storage.counttrigger||!player.storage.counttrigger.olxiuhao)) return [0,0.5,0,0.5];
},
},
},
};
/*赠刀*/
lib.skill.xinfu_zengdao={
audio:2,
unique:true,
limited:true,
enable:"phaseUse",
filter:function(event,player){
return player.countCards('e')>0;
},
filterTarget:lib.filter.notMe,
skillAnimation:true,
animationColor:'thunder',
position:"e",
filterCard:true,
selectCard:[1,Infinity],
discard:false,
lose:false,
content:function(){
player.awakenSkill('xinfu_zengdao');
target.addToExpansion(cards,player,'give').gaintag.add('xinfu_zengdao2');
target.addSkill('xinfu_zengdao2');
},
ai:{
order:1,
result:{
target:function(card,player,target){
if(player.countCards('e')>=2){
return 1;
}
},
},
},
mark:true,
intro:{
content:"limited",
},
};
/*挫锐*/
lib.skill.recuorui={
audio:"cuorui",
enable:"phaseUse",
limited:true,
skillAnimation:true,
animationColor:"thunder",
filter:function(event,player){
return player.hp>0&&game.hasPlayer(function(current){
return current!=player&&current.countGainableCards(player,'h')>0;
})
},
filterTarget:function(card,player,target){
return target!=player&&target.countGainableCards(player,'h')>0;
},
selectTarget:function(){
return [1,_status.event.player.hp];
},
content:function(){
if(num==0) player.awakenSkill('recuorui');
player.gainPlayerCard(target,true,'h');
},
mark:true,
intro:{
content:"limited",
},
init:function(player,skill){
player.storage[skill]=false;
},
ai:{
order:9,
result:{
player:1,
target:-1,
},
},
};
/*引裾*/
lib.skill.yinju={
audio:2,
enable:"phaseUse",
limited:true,
filterTarget:function(card,player,target){
return player!=target;
},
skillAnimation:true,
animationColor:"water",
content:function(){
player.awakenSkill('yinju');
player.storage.yinju2=target;
player.addTempSkill('yinju2');
},
mark:true,
intro:{
content:"limited",
},
init:function(player,skill){
player.storage[skill]=false;
},
ai:{
order:10,
result:{
target:function(card,player,target){
var nm=player.getCards('hs','nanman');
var wj=player.getCards('hs','wanjian')
if(nm+wj>=2){
return 1;
}
},
},
},
};
lib.skill.yinju2={
trigger:{
player:"useCardToPlayered",
source:"damageBefore",
},
forced:true,
onremove:true,
filter:function(event,player,name){
if(name=='useCardToPlayered') return event.target==player.storage.yinju2;
return event.player==player.storage.yinju2;
},
logTarget:function(event){
return event[event.name=='damage'?'player':'target'];
},
content:function(){
'step 0'
if(trigger.name=='damage'){
trigger.cancel();
trigger.player.recover(trigger.num);
event.finish();
}else{
game.asyncDraw([player,trigger.target]);
}
'step 1'
game.delayx();
},
ai:{
effect:{
player:function(card,player,target){
if(card.name=="nanman"||card.name=="wanjian"){
return [1,1];
}
},
},
},
};
/*游龙*/
lib.skill.youlong={
enable:"chooseToUse",
audio:2,
audioname:["key_sakuya"],
zhuanhuanji:true,
marktext:"☯",
mark:true,
intro:{
content:function(storage,player){
return storage?'每轮限一次，你可以废除你的一个装备栏，视为使用一张未以此法使用过的基本牌。':'每轮限一次，你可以废除你的一个装备栏，视为使用一张未以此法使用过的普通锦囊牌。';
},
},
init:function(player){
player.storage.youlong=false;
if(!player.storage.youlong2) player.storage.youlong2=[];
},
hiddenCard:function(player,name){
if(player.storage.youlong2.contains(name)||player.countDisabled()>=5) return false;
if(player.hasSkill('youlong_'+(player.storage.youlong||false))) return false;
var type=get.type(name);
if(player.storage.youlong) return type=='basic';
return type=='trick';
},
filter:function(event,player){
if(player.storage.youlong2.contains(name)||player.countDisabled()>=5) return false;
if(player.hasSkill('youlong_'+(player.storage.youlong||false))) return false;
var type=player.storage.youlong?'basic':'trick';
for(var name of lib.inpile){
if(player.storage.youlong2.contains(name)) continue;
if(get.type(name)!=type) continue;
if(event.filterCard({name:name,isCard:true},player,event)) return true;
}
return false;
},
chooseButton:{
dialog:function(event,player){
var dialog=ui.create.dialog('游龙','hidden');
var table=document.createElement('div');
table.classList.add('add-setting');
table.style.margin='0';
table.style.width='100%';
table.style.position='relative';
for(var i=1;i<6;i++){
if(player.isDisabled(i)) continue;
var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
td.innerHTML='<span>'+get.translation('equip'+i)+'</span>';
td.link=i;
td.addEventListener(lib.config.touchscreen?'touchend':'click',ui.click.button);
for(var j in lib.element.button){
td[j]=lib.element.button[j];
}
table.appendChild(td);
dialog.buttons.add(td);
}
dialog.content.appendChild(table);
var type=player.storage.youlong?'basic':'trick';
var list=[];
for(var name of lib.inpile){
if(player.storage.youlong2.contains(name)) continue;
if(get.type(name)!=type) continue;
if(event.filterCard({name:name,isCard:true},player,event)){
list.push([type,'',name]);
if(name=='sha'){
for(var j of lib.inpile_nature) list.push(['基本','','sha',j]);
}
}
}
dialog.add([list,'vcard']);
return dialog;
},
filter:function(button){
if(ui.selected.buttons.length&&typeof button.link==typeof ui.selected.buttons[0].link) return false;
return true;
},
select:2,
check:function(button){
var player=_status.event.player;
if(typeof button.link=='number'){
var card=player.getEquip(button.link);
if(card){
var val=get.value(card);
if(val>0) return 0;
return 5-val;
}
switch(button.link){
case 3:return 4.5;break;
case 4:return 4.4;break;
case 5:return 4.3;break;
case 2:return (3-player.hp)*1.5;break;
case 1:{
if(game.hasPlayer(function(current){
return (get.realAttitude||get.attitude)(player,current)<0&&get.distance(player,current)>1;
})) return 0;
return 3.2;
}
}
}
var name=button.link[2];
var evt=_status.event.getParent();
if(get.type(name)=='basic'){
if(name=='shan') return 2;
if(evt.type=='dying'){
if(get.attitude(player,evt.dying)<2) return false;
if(player.hp<1&&name=='jiu') return 2.1;
return 1.9;
}
if(evt.type=='phase') return player.getUseValue({name:name,nature:button.link[3],isCard:true});
return 1;
}
if(!['chuqibuyi','shuiyanqijunx','juedou','nanman','wanjian','shunshou','zhujinqiyuan'].contains(name)) return 0;
var card={name:name,isCard:true};
if(['shunshou','zhujinqiyuan'].contains(card.name)){
if(!game.hasPlayer(function(current){
return get.attitude(player,current)!=0&&get.distance(player,current)<=1&&player.canUse(card,current)&&get.effect(current,card,player,player)>0;
})) return 0;
return player.getUseValue(card)-7;
}
return player.getUseValue(card)-4;
},
backup:function(links,player){
if(typeof links[1]=='number') links.reverse();
var equip=links[0];
var name=links[1][2];
var nature=links[1][3];
return {
filterCard:function(){return false},
selectCard:-1,
equip:equip,
viewAs:{
name:name,
nature:nature,
isCard:true,
},
popname:true,
precontent:function(){
player.logSkill('youlong');
player.disableEquip(lib.skill.youlong_backup.equip);
delete event.result.skill;
player.addTempSkill('youlong_'+(player.storage.youlong||false),'roundStart');
player.changeZhuanhuanji('youlong');
player.storage.youlong2.add(event.result.card.name);
},
}
},
prompt:function(links,player){
if(typeof links[1]=='number') links.reverse();
var equip='equip'+links[0];
var name=links[1][2];
var nature=links[1][3];
return '废除自己的'+get.translation(equip)+'栏，视为使用'+(get.translation(nature)||'')+get.translation(name);
},
},
ai:{
respondSha:true,
respondShan:true,
skillTagFilter:function(player,tag,arg){
if(arg=='respond') return false;
if(!player.storage.youlong||player.hasSkill('youlong_true')) return false;
var name=(tag=='respondSha'?'sha':'shan');
return !player.storage.youlong2.contains(name);
},
order:1,
result:{
player:1,
},
},
};
/*扎符*/
lib.skill.zhafu={
audio:2,
enable:"phaseUse",
limited:true,
skillAnimation:true,
animationColor:"wood",
filterTarget:function(card,player,target){
return player!=target;
},
content:function(){
player.awakenSkill('zhafu');
target.addSkill('zhafu_hf');
target.storage.zhafu_hf=player;
},
ai:{
order:1,
result:{
target:function(player,target){
if(get.attitude(player,target)<0){
var num=target.countCards('h');
return -num;
if(target.hasJudge('lebu')) return -num*2;
}
return 0;
},
},
},
subSkill:{
hf:{
trigger:{
player:"phaseDiscardBegin",
},
forced:true,
popup:false,
charlotte:true,
onremove:true,
content:function(){
'step 0'
if(player.countCards('h')<=1||player.storage.zhafu_hf.isDead()) event.finish();
'step 1'
player.storage.zhafu_hf.logSkill('zhafu_hf',player);
player.chooseCard('h',true,'选择保留一张手牌，将其余的手牌交给'+get.translation(player.storage.zhafu_hf)).ai=get.value;
'step 2'
var cards=player.getCards('h');
cards.remove(result.cards[0]);
player.storage.zhafu_hf.gain(cards,player,'giveAuto');
'step 3'
player.removeSkill('zhafu_hf');
},
sub:true,
},
},
mark:true,
intro:{
content:"limited",
},
init:function(player,skill){
player.storage[skill]=false;
},
};
/*武烈*/
lib.skill.wulie={
trigger:{
player:"phaseJieshuBegin",
},
audio:2,
direct:true,
limited:true,
skillAnimation:true,
animationColor:"wood",
unique:true,
filter:function(event,player){
return player.hp>0;
},
content:function(){
'step 0'
player.chooseTarget([1,player.hp],get.prompt2('wulie'),lib.filter.notMe).set("ai",function(target){
if(player.hp<=3) return false;
if(player.hp>=4){
if(get.mode()=='identity'){
if(player.identity=='zhu'){
if(player.hp<=4){
return false;
}
if(player.hp>=5){
return get.attitude(player,target);
}
}
}
if(player.hp>=4){
return get.attitude(player,target);
}
}else{
return false;
}
});
'step 1'
if(result.bool){
var targets=result.targets.sortBySeat();
player.logSkill('wulie',targets);
player.awakenSkill('wulie');
player.loseHp(targets.length);
while(targets.length){
targets[0].addSkill('wulie2');
targets.shift().addMark('wulie2');
}
}
},
mark:true,
intro:{
content:"limited",
},
init:function(player,skill){
player.storage[skill]=false;
},
};
/*激昂*/
lib.skill.jiang={
shaRelated:true,
audio:2,
preHidden:true,
audioname:["sp_lvmeng","re_sunben","re_sunce"],
trigger:{
player:"useCardToPlayered",
target:"useCardToTargeted",
},
filter:function(event,player){
if(!(event.card.name=='juedou'||(event.card.name=='sha'&&get.color(event.card)=='red'))) return false;
return player==event.target||event.getParent().triggeredTargets3.length==1;
},
frequent:true,
content:function(){
player.draw();
},
ai:{
effect:{
target:function(card,player,target){
if(get.color(card)=='red'&&get.name(card)=='sha'&&get.attitude(player,target)<0) return 1.5;
},
player:function(card,player,target){
if(get.color(card)=='red'&&get.name(card)=='sha'&&get.attitude(player,target)<0) return 1.5;
},
},
},
};
/*英魂*/
lib.skill.yinghun={
audio:2,
audioname:["re_sunjian","sunce","re_sunben","re_sunce","ol_sunjian","re_sunyi"],
trigger:{
player:"phaseZhunbeiBegin",
},
direct:true,
preHidden:true,
content:function(){
"step 0"
player.chooseTarget(get.prompt2('yinghun'),function(card,player,target){
return player!=target;
}).set('ai',function(target){
var player=_status.event.player;
if(player.getDamagedHp()==1&&target.countCards('he')==0){
return 0;
}
if(get.attitude(_status.event.player,target)>0){
return 10+get.attitude(_status.event.player,target);
}
if(player.getDamagedHp()==1){
return -1;
}
return 1;
}).setHiddenSkill(event.name);
"step 1"
if(result.bool){
event.num=player.getDamagedHp();
player.logSkill(event.name,result.targets);
event.target=result.targets[0];
if(event.num==1){
event.directcontrol=true;
}
else{
var str1='摸'+get.cnNumber(event.num,true)+'弃一';
var str2='摸一弃'+get.cnNumber(event.num,true);
player.chooseControl(str1,str2,function(event,player){
if(player.isHealthy()) return 1-_status.event.choice;
return _status.event.choice;
}).set('choice',(get.attitude(player,event.target)>0)?0:1);
event.str=str1;
}
}
else{
event.finish();
}
"step 2"
if(event.directcontrol||result.control==event.str){
if(event.num>0) event.target.draw(event.num);
event.target.chooseToDiscard(true,'he');
}
else{
event.target.draw();
if(event.num>0) event.target.chooseToDiscard(event.num,true,'he');
}
},
ai:{
effect:{
target:function(card,player,target){
if(get.tag(card,'damage')&&player.hp==player.maxHp) return 1.5;
if(get.tag(card,'recover')&&player.hp>=(player.maxHp-1)) return "zeroplayertarget";
},
},
},
};
lib.skill.gzyinghun={
audio:"yinghun",
audioname:["re_sunjian","sunce","re_sunben","re_sunce","ol_sunjian","re_sunyi"],
trigger:{
player:"phaseZhunbeiBegin",
},
filter:function(event,player){
return player.getDamagedHp()>0;
},
direct:true,
preHidden:true,
content:function(){
"step 0"
player.chooseTarget(get.prompt2('gzyinghun'),function(card,player,target){
return player!=target;
}).set('ai',function(target){
var player=_status.event.player;
if(player.getDamagedHp()==1&&target.countCards('he')==0){
return 0;
}
if(get.attitude(_status.event.player,target)>0){
return 10+get.attitude(_status.event.player,target);
}
if(player.getDamagedHp()==1){
return -1;
}
return 1;
}).setHiddenSkill(event.name);
"step 1"
if(result.bool){
event.num=player.getDamagedHp();
player.logSkill(event.name,result.targets);
event.target=result.targets[0];
if(event.num==1){
event.directcontrol=true;
}
else{
var str1='摸'+get.cnNumber(event.num,true)+'弃一';
var str2='摸一弃'+get.cnNumber(event.num,true);
player.chooseControl(str1,str2,function(event,player){
return _status.event.choice;
}).set('choice',get.attitude(player,event.target)>0?str1:str2);
event.str=str1;
}
}
else{
event.finish();
}
"step 2"
if(event.directcontrol||result.control==event.str){
event.target.draw(event.num);
event.target.chooseToDiscard(true,'he');
}
else{
event.target.draw();
event.target.chooseToDiscard(event.num,true,'he');
}
},
ai:{
effect:{
target:function(card,player,target){
if(get.tag(card,'damage')&&player.hp==player.maxHp) return 1.5;
if(get.tag(card,'recover')&&player.hp>=(player.maxHp-1)) return "zeroplayertarget";
},
},
threaten:function(player,target){
if(target.hp==target.maxHp) return 0.5;
if(target.hp==1) return 2;
if(target.hp==2) return 1.5;
return 0.5;
},
maixie:true,
},
};
/*诏缚*/
lib.skill.xinzhaofu={
mark:false,
init:function(player){
if(player.hasZhuSkill('xinzhaofu')){
player.markSkill('xinzhaofu');
player.storage.xinzhaofu=false;
}
},
audio:"zhaofu",
enable:"phaseUse",
usable:1,
filter:function(event,player){
return player.hasZhuSkill('xinzhaofu');
},
limited:true,
skillAnimation:true,
animationColor:"wood",
selectTarget:[1,2],
filterTarget:function(card,player,target){
return player!=target;
},
contentBefore:function(){
player.awakenSkill('xinzhaofu');
},
content:function(){
target.addSkill('xinzhaofu_effect');
target.markAuto('xinzhaofu_effect',[player]);
},
ai:{
order:6,
result:{
target:-1,
},
},
subSkill:{
effect:{
charlotte:true,
mark:true,
intro:{
content:"已视为在其他吴势力角色的攻击范围内",
},
mod:{
inRangeOf:function(from,to){
if(from.group!='wu') return;
var list=to.getStorage('xinzhaofu_effect');
for(var i of list){
if(i!=from) return true;
}
},
},
sub:true,
},
},
intro:{
content:"limited",
},
};
/*雄乱*/
lib.skill.drlt_xiongluan={
audio:2,
unique:true,
enable:'phaseUse',
mark:true,
skillAnimation:true,
animationColor:'gray',
limited:true,
init:function(player){
player.storage.drlt_xiongluan=false;
},
filter:function(event,player){
if(player.storage.drlt_xiongluan) return false;
return true;
},
filterTarget:function(card,player,target){
return target!=player;
},
content:function(){
player.awakenSkill('drlt_xiongluan');
player.storage.drlt_xiongluan=true;
player.disableEquip('equip1');
player.disableEquip('equip2');
player.disableEquip('equip3');
player.disableEquip('equip4');
player.disableEquip('equip5');
player.disableJudge();
player.addTempSkill('drlt_xiongluan1');
player.storage.drlt_xiongluan1=target;
target.addSkill('drlt_xiongluan2');
target.markSkillCharacter('drlt_xiongluan1',player,'雄乱','无法使用或打出任何手牌');
},
ai:{
order:13,
result:{
target:function(player,target){
if(target.getEquip('bagua')||target.getEquip('rewrite_bagua')) return 0;
var hs=player.countCards('hs',function(card){
return ['sha','juedou'].contains(card.name)&&get.effect(target,card,player,player)!=0;
});
var ts=target.hp;
if(hs>=ts&&ts>1) return -1;
return 0;
},
},
},
intro:{
content:'limited'
},
},
lib.skill.drlt_xiongluan1={
onremove:function(player){
player.storage.drlt_xiongluan1.removeSkill('drlt_xiongluan2');
player.storage.drlt_xiongluan1.unmarkSkill('drlt_xiongluan1');
delete player.storage.drlt_xiongluan1;
},
mod:{
targetInRange:function(card,player,target){
if(target.hasSkill('drlt_xiongluan2')){
return true;
}
},
cardUsableTarget:function(card,player,target){
if(target.hasSkill('drlt_xiongluan2')) return true;
},
},
charlotte:true,
ai:{
effect:{
player:function(card,player,target){
if(get.tag(card,'damage')&&target.hasSkill('drlt_xiongluan2')) return [99,99];
},
},
},
},
lib.skill.drlt_xiongluan2={
mod:{
cardEnabled2:function(card,player){
if(get.position(card)=='h') return false;
},
},
charlotte:true,
};
/*屯军*/
lib.skill.xinfu_tunjun={
skillAnimation:true,
animationColor:"metal",
limited:true,
unique:true,
enable:"phaseUse",
audio:2,
filter:function(event,player){
if(player.storage.xinfu_tunjun) return false;
return player.storage.xinfu_lveming&&player.storage.xinfu_lveming>0;
},
filterTarget:true,
selectTarget:1,
content:function(){
"step 0"
player.awakenSkill('xinfu_tunjun');
event.num=player.storage.xinfu_lveming;
event.toequip=[];
"step 1"
var equip=get.cardPile(function(card){
var bool1=true;
for(var i=0;i<event.toequip.length;i++){
if(get.type(card)=='equip'&&get.subtype(card)==get.subtype(event.toequip[i])) bool1=false;
}
return (get.type(card)=='equip'&&!event.toequip.contains(card)&&target.isEmpty(get.subtype(card))&&bool1);
});
if(equip) event.toequip.push(equip);
else event.num=0;
event.num--;
"step 2"
if(event.num>0) event.goto(1);
"step 3"
for (var i=0;i<event.toequip.length;i++){
target.chooseUseTarget(event.toequip[i],true).set('animate',false).set('nopopup',true);
}
},
ai:{
order:1,
result:{
target:function(card,player,target){
if(player.storage.xinfu_lveming>=2){
return 1;
}
},
},
},
mark:true,
intro:{
content:"limited",
},
init:function(player){
player.storage.xinfu_tunjun=false;
},
};
/*慷忾*/
lib.skill.xinfu_kaikang={
audio:2,
trigger:{
global:"useCardToTargeted",
},
filter:function(event,player){
return event.card.name=='sha'&&get.distance(player,event.target)<=1&&event.target.isIn();
},
check:function(event,player){
return get.attitude(player,event.target)>0;
},
logTarget:"target",
content:function(){
"step 0"
player.draw();
if(trigger.target!=player){
player.chooseCard(true,'he','交给'+get.translation(trigger.target)+'一张牌').set('ai',function(card){
if(get.position(card)=='e') return -1;
if(card.name=='shan') return 1;
if(get.type(card)=='equip') return 0.5;
return 0;
});
}else{
event.finish();
}
"step 1"
trigger.target.gain(result.cards,player,'give');
game.delay();
event.card=result.cards[0];
"step 2"
if(trigger.target.getCards('h').contains(card)&&get.type(card)=='equip'){
trigger.target.chooseUseTarget(card);
}
},
ai:{
threaten:1.1,
},
};
/*立牧*/
lib.skill.xinfu_limu={
mod:{
targetInRange:function (card,player,target){
if(player.countCards('j')&&player.inRange(target)){
return true;
}
},
cardUsableTarget:function(card,player,target){
if(player.countCards('j')&&player.inRange(target)) return true;
},
aiValue:function(player,card,num){
if(card.name=='zhangba') return 30;
if(player.getEquip('zhangba')&&player.countCards('hs')>1&&['shan','tao','jiu'].contains(card.name)) return 0;
if(card.name=='shan'||card.name=='tao'||card.name=='jiu') return num/3;
},
},
locked:false,
audio:2,
enable:"phaseUse",
discard:false,
filter:function (event,player){
if(player.hasJudge('lebu')) return false;
return player.countCards('hes',{suit:'diamond'})>0;
},
viewAs:{
name:"lebu",
},
position:"hes",
filterCard:function(card,player,event){
return get.suit(card)=='diamond'&&player.canAddJudge({name:'lebu',cards:[card]});
},
selectTarget:-1,
filterTarget:function (card,player,target){
return player==target;
},
check:function(card){
var player=_status.event.player;
if(!player.getEquip('zhangba')&&player.countCards('hs','sha')<2){
if(player.countCards('h',function(cardx){
return cardx!=card&&cardx.name=='shan';
})>0) return 0;
var damaged=player.maxHp-player.hp-1;
var ts=player.countCards('h',function(cardx){
return cardx!=card&&cardx.name=='tao';
});
if(ts>0&&ts>damaged) return 0;
}
if(card.name=='shan') return 15;
if(card.name=='tao') return 10;
return 9-get.value(card);
},
onuse:function (links,player){
var next=game.createEvent('limu_recover',false,_status.event.getParent());
next.player=player;
next.setContent(function(){player.recover()});
},
ai:{
result:{
target:1,
ignoreStatus:true,
},
order:function(item,player){
if(player.countCards('hs','zhangba')||player.countCards('h',function(card){
return get.suit(card)=='diamond'&&get.type(card)=='basic';
})==1&&player.countCards('h',function(card){
return get.name(card)!='sha'&&get.type(card)=='basic';
})==1&&player.countCards('h',{type:'trick'})>0){
return get.order({name:'sha'})+1;
}
if(player.getDamagedHp()>=2) return 5;
if(game.hasPlayer(function(current){
return current!=player&&player.inRange(current)&&get.attitude(player,current)<=0;
})){
if(player.countCards('hs','sha')>1) return 3;
if(player.countCards('h','sha')>0&&player.countCards('h','tao')==0&&player.countCards('h','shan')==0&&player.countCards('h','jiu')==0) return 3;
if(player.countCards('h',function(card){
return get.suit(card)=='diamond'&&get.type(card)=='basic';
})==1&&player.countCards('h',function(card){
return get.name(card)!='sha'&&get.type(card)=='basic';
})==1&&(player.countCards('h','taoyuan')>0||player.countCards('h','wugu')>0||player.countCards('h','tiesuo')>0||player.countCards('h','nanman')>0||player.countCards('h','wanjian')>0)) return 12;
}
if(player.getEquip('zhangba')) return 15;
return 0;
},
effect:{
player:function(card,player,target){
if(card.name=="zhangba"&&player.hasSkill('xinfu_tushe')){
return [3.5,3.5];
}
if((player.countCards('h','jiu')+player.countCards('h','tao')==1)&&player.countCards('h',{type:'basic'})==1&&player.hasSkill('xinfu_tushe')){
if(card.name=="tao"){
return [2.5,2.5];
}
if(card.name=="jiu"){
return [2.5,2.5];
}
}
if(player.getEquip('zhangba')&&player.hasSkill('xinfu_tushe')){
if(card.name=="sha"){
if(get.attitude(player,target)<=0){
return [2.5,2.5];
}
}
if(card.name=="jiu"){
return [2.5,2.5];
}
if(!player.countCards('h',{type:'basic'})){
if(get.type2(card)=='trick'){
return [3,3];
}
}
}
if(!player.countCards('h',{type:'basic'})&&player.countCards('j')&&player.hasSkill('xinfu_tushe')){
if(card.name=="wugu"||card.name=="taoyuan"||card.name=="tiesuo"){
return [1,1.5];
}
}
},
},
basic:{
order:1,
useful:1,
value:8,
},
tag:{
skip:"phaseUse",
},
},
};
/*天匠*/
lib.skill.pytianjiang_move={
audio:"pytianjiang",
prompt:"将装备区里的一张牌移动至其他角色的装备区",
enable:"phaseUse",
position:"e",
filter:function(event,player){
return player.countCards('e')>0;
},
check:function(){return 1},
filterCard:true,
filterTarget:function(event,player,target){
return target!=player&&target.canEquip(ui.selected.cards[0],true);
},
prepare:"give",
discard:false,
lose:false,
content:function(){
target.equip(cards[0]);
if(cards[0].name.indexOf('pyzhuren_')==0) player.draw(2);
},
ai:{
order:function(item,player){
return get.order({name:'sha'})-0.1;
},
expose:0.2,
result:{
target:function(player,target){
if(ui.selected.cards.length){
var card=ui.selected.cards[0];
if(target.getEquip(card)||target.countCards('h',{subtype:get.subtype(card)})) return 1;
return get.effect(target,card,player,target);
}
return 0;
},
},
},
};
/*荐杰*/
lib.skill.xinfu_jianjie={
derivation:["jianjie_faq"],
group:["xinfu_jianjie1","xinfu_jianjie2"],
audio:3,
trigger:{
player:"phaseZhunbeiBegin",
},
direct:true,
filter:function(event,player){
if(player.phaseNumber>1) return false;
return !game.hasPlayer(function(current){
return current.hasSkill('smh_huoji')||current.hasSkill('smh_lianhuan');
});
},
content:function(){
"step 0"
player.chooseTarget('请将「龙印」交给一名角色',true,function(card,player,target){
return target!=player;
}).set('ai',function(target){
var player=_status.event.player;
return get.attitude(player,target);
});
"step 1"
if(result.bool&&result.targets&&result.targets.length){
var target=result.targets[0];
player.logSkill('xinfu_jianjie',target);
player.line(target,'fire');
target.addSkill('smh_huoji');
game.delay();
}
if(game.hasPlayer(function(current){
return !current.hasSkill('smh_huoji')&&current!=player
})){
player.chooseTarget('请将「凤印」交给一名角色',true,function(card,player,target){
return target!=player&&!target.hasSkill('smh_huoji');
}).set('ai',function(target){
var player=_status.event.player;
return get.attitude(player,target);
});
}
else event.finish();
"step 2"
if(result.bool&&result.targets&&result.targets.length){
var target=result.targets[0];
player.logSkill('xinfu_jianjie',target);
player.line(target,'green');
target.addSkill('smh_lianhuan');
game.delay();
}
},
};
lib.skill.xinfu_jianjie1={
audio:3,
prompt:"你的第一个准备阶段，你令两名不同的角色分别获得龙印与凤印；出牌阶段限一次（你的第一个回合除外），或当拥有龙印、凤印的角色死亡时，你可以转移龙印、凤印。",
enable:"phaseUse",
usable:1,
filter:function (event,player){
if(player.phaseNumber==1) return false;
if(!game.hasPlayer(function(current){
return current.hasSkill('smh_huoji')||current.hasSkill('smh_lianhuan');
})) return false;
return true;
},
filterTarget:function (card,player,target){
if(ui.selected.targets.length==1){
return true;
}else{
return target.hasSkill('smh_huoji')||target.hasSkill('smh_lianhuan');
}
},
targetprompt:["移走印","得到印"],
selectTarget:2,
multitarget:true,
content:function (){
'step 0'
if(targets[0].hasSkill('smh_huoji')&&targets[0].hasSkill('smh_lianhuan')){
player.chooseControl('龙印','凤印').set('prompt','请选择要移动的印');
}
else{
if(targets[0].hasSkill('smh_huoji')) event._result={control:'龙印'};
else event._result={control:'凤印'};
}
'step 1'
if(result.control=='龙印'){
targets[0].removeSkill('smh_huoji');
targets[1].addSkill('smh_huoji');
}
else{
targets[0].removeSkill('smh_lianhuan');
targets[1].addSkill('smh_lianhuan');
}
},
ai:{
order:8,
result:{
target:function (player,target){
var att=get.attitude(player,target);
if(ui.selected.targets.length==0){
return get.attitude(player,target)<0?-999:-3;
return get.attitude(player,target)>=0?0:att;
return target==player&&get.attitude(player,target)>=0?0:1;
return target!=player&&get.attitude(player,target)>=0?0:2;
}
else{
if(target!=player){
if(target.hasSkill('smh_huoji')||target.hasSkill('smh_lianhuan')) return target.countCards('h')+2;
return target.countCards('h')+1;
}
if(target==player){
if(target.hasSkill('smh_huoji')||target.hasSkill('smh_lianhuan')) return target.countCards('h')+1;
return target.countCards('h')+0.5;
}
}
},
},
expose:0.4,
threaten:3,
},
};
/*隐士*/
lib.skill.xinfu_yinshi={
audio:2,
trigger:{
player:"damageBegin4",
},
forced:true,
filter:function (event,player){
if(player.hasSkill('smh_huoji')||player.hasSkill('smh_lianhuan')) return false;
if(!player.isEmpty(2)) return false;
if(event.nature) return true;
return get.type(event.card,'trick')=='trick';
},
content:function (){
trigger.cancel();
},
ai:{
notrick:true,
nofire:true,
nothunder:true,
effect:{
player:function(card,player,target){
if(!player.hasSkill('smh_huoji')&&!player.hasSkill('smh_lianhuan')){
if(get.type(card)=='equip'&&get.subtype(card)=='equip2') return 'zeroplayertarget';
}
},
target:function (card,player,target,current){
if(target.hasSkill('smh_huoji')||target.hasSkill('smh_lianhuan')) return;
if(player==target&&get.subtype(card)=='equip2'){
if(get.equipValue(card)<=8) return 0;
}
if(!target.isEmpty(2)) return;
if(card.name=='tiesuo') return 'zeroplayertarget';
if(get.tag(card,'natureDamage')) return 'zerotarget';
if(get.type(card)=='trick'&&get.tag(card,'damage')){
return 'zeroplayertarget';
}
},
},
},
};
/*观微*/
lib.skill.xinfu_guanwei={
audio:2,
usable:1,
trigger:{
global:"phaseUseEnd",
},
filter:function (event,player){
var history=event.player.getHistory('useCard',function(evt){
return evt.getParent('phaseUse')==event;
});
var num=0;
var suit=false;
for(var i=0;i<history.length;i++){
var suit2=get.suit(history[i].card);
if(!suit2) continue;
if(suit&&suit!=suit2) return false;
suit=suit2;
num++;
}
return num>1;
},
direct:true,
content:function (){
'step 0'
player.chooseToDiscard('he',get.prompt('xinfu_guanwei',trigger.player),'弃置一张牌，令其摸两张牌并进行一个额外的出牌阶段。').set('ai',function(card){
if(get.attitude(_status.event.player,_status.currentPhase)<1) return 0;
return 9-get.value(card);
}).set('logSkill','xinfu_guanwei');
'step 1'
if(result.bool){
player.addTempSkill('xinfu_guanwei_off');
player.line(trigger.player,'green');
trigger.player.draw(2);
}else{
event.finish();
}
'step 2'
var next=trigger.player.phaseUse();
event.next.remove(next);
trigger.getParent('phase').next.push(next);
},
ai:{
expose:0.5,
},
subSkill:{
off:{
charlotte:true,
superCharlotte:true,
sub:true,
},
},
};
/*空城*/
lib.skill.kongcheng={
mod:{
targetEnabled:function(card,player,target,now){
if(target.countCards('h')==0){
if(card.name=='sha'||card.name=='juedou') return false;
}
},
aiUseful:function(player,card,num){
if(get.name(card)=='sha'){
return num/2;
}
},
},
group:"kongcheng1",
audio:"kongcheng1",
audioname:["re_zhugeliang"],
ai:{
noh:true,
skillTagFilter:function(player,tag){
if(tag=='noh'){
if(player.countCards('h')!=1) return false;
}
},
},
};
/*断肠*/
lib.skill.duanchang={
audio:2,
audioname:["re_caiwenji"],
forbid:["boss"],
trigger:{
player:"die",
},
forced:true,
forceDie:true,
skillAnimation:true,
animationColor:"gray",
filter:function(event){
return event.source&&event.source.isIn();
},
content:function(){
trigger.source.clearSkills();
},
logTarget:"source",
ai:{
threaten:function(player,target){
if(target.hp==1) return 0.2;
return 1.5;
},
effect:{
target:function(card,player,target,current){
if(!target.hasFriend()) return;
if(target.hp<=1&&get.tag(card,'damage')) return [1,0,-1,-2.5];
},
},
},
};
/*业仇*/
lib.skill.yechou={
audio:2,
trigger:{
player:"die",
},
direct:true,
forceDie:true,
skillAnimation:true,
animationColor:"wood",
content:function(){
"step 0"
player.chooseTarget(get.prompt2('yechou'),function(card,player,target){
return player!=target&&target.getDamagedHp()>1
}).set('forceDie',true).set('ai',function(target){
var num=get.attitude(_status.event.player,target);
return -num;
});
"step 1"
if(result.bool){
var target=result.targets[0];
player.logSkill('yechou',target);
player.line(target,'green');
target.addTempSkill('yechou2',{player:'phaseZhunbeiBegin'});
}
},
ai:{
"maixie_defend":true,
effect:{
target:function(card,player,target){
if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
if(target.hp<=1&&get.attitude(player,target)<=0&&(get.tag(card,'damage')||get.damageEffect(target,player,player)>0)&&target.hasFriend()) return [1,0,0,-9];
// if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
},
},
},
};
/*武魂*/
lib.skill.twwuhun={
trigger:{
player:"die",
},
forceDie:true,
skillAnimation:true,
animationColor:"soil",
locked:true,
check:function(event,player){
return game.hasPlayer(function(current){
return current!=player&&current.hasMark('twwuhun')&&get.attitude(player,current)<0;
});
},
content:function(){
'step 0'
player.judge(function(card){
var name=get.name(card,false);
if(name=='tao'||name=='taoyuan') return -25;
return 15;
}).set('forceDie',true).judge2=function(result){
return result.bool;
};
'step 1'
var num=game.countPlayer(function(current){
return current!=player&&current.hasMark('twwuhun');
});
if(result.bool&&num>0){
player.chooseTarget('请选择【武魂】的目标','选择至少一名拥有“梦魇”标记的角色。令这些角色各自失去X点体力（X为其“梦魇”标记数）',true,[1,num],function(card,player,target){
return target!=player&&target.hasMark('twwuhun');
}).set('forceDie',true).set('ai',function(target){
return -get.attitude(_status.event.player,target);
});
}
else event.finish();
'step 2'
var targets=result.targets.sortBySeat();
player.line(targets,'fire');
event.targets=targets;
'step 3'
var target=targets.shift();
var num=target.countMark('twwuhun');
if(num>0) target.loseHp(num);
if(targets.length>0) event.redo();
},
marktext:"魇",
intro:{
name:"梦魇",
content:"mark",
onunmark:true,
},
group:"twwuhun_gain",
subSkill:{
gain:{
trigger:{
player:"damageEnd",
source:"damageSource",
},
forced:true,
filter:function(event,player,name){
if(event.player==event.source) return false;
var target=lib.skill.twwuhun_gain.logTarget(event,player);
if(!target||!target.isAlive()) return false;
return name=='damageEnd'||target.hasMark('twwuhun');
},
logTarget:function(event,player){
if(player==event.player) return event.source;
return event.player;
},
content:function(){
var target=lib.skill.twwuhun_gain.logTarget(trigger,player);
target.addMark('twwuhun',player==trigger.source?1:trigger.num);
game.delayx();
},
ai:{
"maixie_defend":true,
effect:{
target:function(card,player,target){
if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
if(target.hp<=1&&get.attitude(player,target)<=0&&(get.tag(card,'damage')||get.damageEffect(target,player,player)>0)&&target.hasFriend()) return [1,0,0,-9];
// if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
},
},
},
sub:true,
},
},
};
lib.skill.new_wuhun={
audio:"wuhun21",
group:["new_wuhun_mark","new_wuhun_die","wuhun22","wuhun23"],
trigger:{
player:"damageEnd",
},
forced:true,
filter:function (event,player){
return event.source!=undefined;
},
content:function (){
trigger.source.addMark('new_wuhun_mark',trigger.num);
},
ai:{
"maixie_defend":true,
effect:{
target:function(card,player,target){
if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
if(target.hp<=1&&get.attitude(player,target)<=0&&(get.tag(card,'damage')||get.damageEffect(target,player,player)>0)&&target.hasFriend()) return [1,0,0,-9];
// if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
},
},
},
subSkill:{
die:{
skillAnimation:true,
animationColor:"soil",
trigger:{
player:"die",
},
forced:true,
forceDie:true,
direct:true,
filter:function (event,player){
return game.hasPlayer(function(current){
return current!=player&&current.hasMark('new_wuhun_mark');
});
},
content:function (){
"step 0"
var num=0;
for(var i=0;i<game.players.length;i++){
var current=game.players[i];
if(current!=player&&current.countMark('new_wuhun_mark')>num){
num=current.countMark('new_wuhun_mark');
}
}
player.chooseTarget(true,'请选择【武魂】的目标',function(card,player,target){
return target!=player&&target.countMark('new_wuhun_mark')==_status.event.num;
}).set('ai',function(target){
return -get.attitude(_status.event.player,target);
}).set('forceDie',true).set('num',num);
"step 1"
if(result.bool&&result.targets&&result.targets.length){
var target=result.targets[0];
event.target=target;
player.logSkill(Math.random()<0.5?'wuhun22':'wuhun23',target);
player.line(target,{color:[255, 255, 0]});
game.delay(2);
}
"step 2"
target.judge(function(card){
if(['tao','taoyuan'].contains(card.name)) return 10;
return -10;
}).judge2=function(result){
return result.bool==false?true:false;
};
"step 3"
if(!result.bool){
lib.element.player.die.apply(target,[]);
}
},
sub:true,
},
mark:{
marktext:"魇",
intro:{
name:"梦魇",
content:"mark",
},
sub:true,
},
},
ai:{
threaten:0.01,
notemp:true,
},
};
/*活墨*/
lib.skill.huomo={
audio:2,
audioname:["huzhao"],
enable:"chooseToUse",
onChooseToUse:function(event){
if(game.online||event.huomo_list) return;
var list=lib.skill.huomo.getUsed(event.player);
event.set('huomo_list',list);
},
getUsed:function(player){
var list=[];
player.getHistory('useCard',function(evt){
if(get.type(evt.card,null,false)=='basic') list.add(evt.card.name);
});
return list;
},
hiddenCard:function(player,name){
if(get.type(name)!='basic') return false;
var list=lib.skill.huomo.getUsed(player);
if(list.contains(name)) return false;
return player.hasCard(function(card){
return get.color(card)=='black'&&get.type(card)!='basic';
},'eh');
},
filter:function(event,player){
if(event.type=='wuxie'||!player.hasCard(function(card){
return get.color(card)=='black'&&get.type(card)!='basic';
},'eh')) return false;
var list=event.huomo_list||lib.skill.huomo.getUsed(player);
for(var name of lib.inpile){
if(get.type(name)!='basic'||list.contains(name)) continue;
var card={name:name,isCard:true};
if(event.filterCard(card,player,event)) return true;
if(name=='sha'){
for(var nature of lib.inpile_nature){
card.nature=nature;
if(event.filterCard(card,player,event)) return true;
}
}
}
return false;
},
chooseButton:{
dialog:function(event,player){
var vcards=[];
var list=event.huomo_list||lib.skill.huomo.getUsed(player);
for(var name of lib.inpile){
if(get.type(name)!='basic'||list.contains(name)) continue;
var card={name:name,isCard:true};
if(event.filterCard(card,player,event)) vcards.push(['基本','',name]);
if(name=='sha'){
for(var nature of lib.inpile_nature){
card.nature=nature;
if(event.filterCard(card,player,event)) vcards.push(['基本','',name,nature]);
}
}
}
return ui.create.dialog('活墨',[vcards,'vcard'],'hidden');
},
check:function(button){
var player=_status.event.player;
var card={name:button.link[2],nature:button.link[3]};
if(_status.event.getParent().type!='phase'||game.hasPlayer(function(current){
return player.canUse(card,current)&&get.effect(current,card,player,player)>0;
})){
switch(button.link[2]){
case 'tao':case 'shan':return 5;
case 'jiu':{
if(player.countCards('he',{color:'black'})>0) return 3;
};
case 'sha':
if(button.link[3]=='fire') return 2.95;
else if(button.link[3]=='thunder'||button.link[3]=='ice') return 2.92;
else return 2.9;
}
}
return 0;
},
backup:function(links,player){
return {
check:function(card,player,target){
if(!ui.selected.cards.length&&get.color(card)=='black') return 10;
else return 8-get.value(card);
},
filterCard:function(card){
return get.type(card)!='basic'&&get.color(card)=='black';
},
viewAs:{
name:links[0][2],
nature:links[0][3],
suit:'none',
number:null,
isCard:true,
},
position:'he',
popname:true,
ignoreMod:true,
precontent:function(){
'step 0'
player.logSkill('huomo');
var card=event.result.cards[0];
event.card=card;
player.$throw(card,1000);
game.log(player,'将',card,'置于牌堆顶');
event.result.card={name:event.result.card.name,nature:event.result.card.nature};
event.result.cards=[];
player.lose(card,ui.cardPile,'visible','insert');
'step 1'
game.delay();
},
}
},
prompt:function(links,player){
return '将一张黑色非基本牌置于牌堆顶并视为使用一张'+get.translation(links[0][3]||'')+get.translation(links[0][2]);
},
},
ai:{
order:function(){
var player=_status.event.player;
var event=_status.event;
if(event.filterCard({name:'jiu'},player,event)&&get.effect(player,{name:'jiu'})>0&&player.countCards('he',{color:'black'})){
return 3.3;
}
return 3.1;
},
skillTagFilter:function(player,tag,arg){
if(tag=='fireAttack') return true;
if(player.countCards('he',{color:'black'})) return false;
if(!player.hasCard(function(card){
return get.color(card)=='black';
},'hes')){
return false;
}
},
result:{
player:1,
},
respondSha:true,
respondShan:true,
fireAttack:true,
},
};
/*诏颂*/
lib.skill.zhaosong={
trigger:{
global:"phaseDrawAfter",
},
logTarget:"player",
check:function(event,player){
return get.attitude(player,event.player)>0||(get.attitude(player,event.player)<=0&&event.player.countCards('h')<=2);
},
filter:function(event,player){
if(player==event.player||!event.player.countCards('h')) return false;
var types=['basic','trick','equip'];
for(var i of types){
if(event.player.hasMark('zhaosong_'+i)) return false;
}
return true;
},
"prompt2":"令其交给你一张手牌，并根据类型获得对应的标记",
content:function(){
'step 0'
event.target=trigger.player;
event.target.chooseCard('h',true,get.translation(player)+'发动了【诏颂】；请交给其一张手牌');
'step 1'
if(result.bool){
var card=result.cards[0];
player.gain(card,target,'give');
var type=get.type2(card,target);
if(lib.skill['zhaosong_'+type]){
target.addSkill('zhaosong_'+type);
target.addMark('zhaosong_'+type);
}
}
},
subSkill:{
basic:{
marktext:"颂",
intro:{
name:"诏颂(颂)",
"name2":"颂",
content:"当你使用【杀】选择唯一目标时，你可移去“颂”，并为此【杀】增加至多两个目标。",
},
trigger:{
player:"useCard2",
},
direct:true,
charlotte:true,
onremove:true,
filter:function(event,player){
return player.hasMark('zhaosong_basic')&&event.card.name=='sha'&&
event.targets.length==1&&game.hasPlayer(function(current){
return current!=player&&current!=event.targets[0]&&lib.filter.targetEnabled2(event.card,player,current);
});
},
content:function(){
'step 0'
player.chooseTarget([1,2],'是否弃置“颂”标记？','为'+get.translation(trigger.card)+'增加至多两个目标',function(card,player,target){
var evt=_status.event.getTrigger();
return target!=player&&target!=evt.targets[0]&&lib.filter.targetEnabled2(evt.card,player,target);
}).set('ai',function(target){
var evt=_status.event.getTrigger();
return get.effect(target,evt.card,evt.player,evt.player);
});
'step 1'
if(result.bool){
if(player!=event.player&&!player.isOnline()) game.delayx();
//player.addTempSkill('zhaosong_shaloss');
}
else event.finish();
'step 2'
var targets=result.targets;
player.logSkill('zhaosong_basic',targets);
player.removeMark('zhaosong_basic',1);
player.removeSkill('zhaosong_basic');
trigger.targets.addArray(targets);
trigger.zhaosong_basic=true;
},
sub:true,
},
trick:{
marktext:"诔",
intro:{
name:"诏颂(诔)",
"name2":"诔",
content:"当你进入濒死状态时，你可移去“诔”，然后将体力回复至1点并摸一张牌。",
},
trigger:{
player:"dying",
},
prompt:"是否弃置“诔”标记？",
"prompt2":"回复体力至1点并摸一张牌。",
charlotte:true,
onremove:true,
filter:function(event,player){
return player.hasMark('zhaosong_trick')&&player.hp<1;
},
check:function(event,player){
if(player.maxHp<2||player.countCards('h',function(card){
var mod2=game.checkMod(card,player,'unchanged','cardEnabled2',player);
if(mod2!='unchanged') return mod2;
var mod=game.checkMod(card,player,event.player,'unchanged','cardSavable',player);
if(mod!='unchanged') return mod;
var savable=get.info(card).savable;
if(typeof savable=='function') savable=savable(card,player,event.player);
return savable;
})>=1+event.num-event.player.hp) return false;
return true;
},
content:function(){
player.removeMark('zhaosong_trick',1);
player.removeSkill('zhaosong_trick');
//player.loseMaxHp();
if(player.hp<1) player.recover(1-player.hp);
player.draw();
},
sub:true,
},
equip:{
marktext:"赋",
intro:{
name:"诏颂(赋)",
"name2":"赋",
content:"出牌阶段开始时，你可移去“赋”并弃置一名角色区域内的至多两张牌。",
},
trigger:{
player:"phaseUseBegin",
},
direct:true,
charlotte:true,
onremove:true,
filter:function(event,player){
return player.hasMark('zhaosong_equip')&&game.hasPlayer(function(current){
return current.hasCard(function(card){
return lib.filter.canBeDiscarded(card,player,current);
},'hej');
});
},
content:function(){
'step 0'
player.chooseTarget('是否弃置“赋”标记？','弃置一名角色区域内的至多两张牌',function(card,player,current){
return current.hasCard(function(card){
return lib.filter.canBeDiscarded(card,player,current);
},'hej');
}).set('ai',function(target){
var player=_status.event.player,att=get.attitude(player,target)>0?2:1;
return get.effect(target,{name:'guohe_copy'},player,player)*att;
});
'step 1'
if(result.bool){
var target=result.targets[0];
event.target=target;
player.logSkill('zhaosong_equip',target);
player.removeMark('zhaosong_equip',1);
player.removeSkill('zhaosong_equip');
player.discardPlayerCard(target,true,'hej',[1,2]);
}
},
sub:true,
},
},
};
/*新父荫*/
lib.skill.xinfu_fuyin={
trigger:{
target:"useCardToTargeted",
},
forced:true,
audio:2,
filter:function(event,player){
if(event.player.countCards('h')<player.countCards('h')) return false;
if(event.card.name!='sha'&&event.card.name!='juedou') return false;
return !game.hasPlayer2(function(current){
return current.getHistory('useCard',function(evt){
return evt!=event.getParent()&&evt.card&&['sha','juedou'].contains(evt.card.name)&&evt.targets.contains(player);
}).length>0;
});
},
content:function(){
trigger.getParent().excluded.add(player);
player.addTempSkill('xinfu_fuyin_off');
},
ai:{
effect:{
target:function(card,player,target,current){
if((card.name=='sha'||card.name=='juedou')&&target.countCards('h')<player.countCards('h')&&!target.hasSkill('xinfu_fuyin_off')){
return "zeroplayertarget";
if(card.name=='sha'&&player.getCardUsable('sha')<=1&&player.countCards('hs',{name:'sha'})<2){
return "zeroplayertarget";
}
if(player.getCardUsable('sha')>=1&&player.countCards('hs',{name:'sha'})>0&&player.countCards('hs',{name:'juedou'})>0){
if(card.name=='sha'||card.name=='juedou'){
if(!target.hasFriend()) return [1,-1];
}
}
}
},
},
},
};
lib.skill.xinfu_fuyin_off={
charlotte:true,
superCharlotte:true,
};
/*放权*/
lib.skill.fangquan={
audio:2,
trigger:{
player:"phaseUseBefore",
},
filter:function(event,player){
return player.countCards('h')>0&&!player.hasSkill('fangquan3');
},
direct:true,
preHidden:true,
content:function(){
"step 0"
var fang=player.countMark('fangquan2')==0&&player.hp>=2&&player.countCards('h')<=player.hp+2;
player.chooseBool(get.prompt2('fangquan')).set('ai',function(){
if(!_status.event.fang) return false;
return game.hasPlayer(function(target){
if(target.hasJudge('lebu')||target.classList.contains('turnedover')||target==player) return false;
if(get.attitude(player,target)>4){
return (get.threaten(target)/Math.sqrt(target.hp+1)/Math.sqrt(target.countCards('h')+1)>0);
}
return false;
});
}).set('fang',fang).setHiddenSkill(event.name);
"step 1"
if(result.bool){
player.logSkill('fangquan');
trigger.cancel();
player.addTempSkill('fangquan2');
player.addMark('fangquan2',1,false);
//player.storage.fangquan=result.targets[0];
}
},
};
lib.skill.olfangquan={
audio:2,
audioname:["shen_caopi"],
trigger:{
player:"phaseUseBefore",
},
filter:function(event,player){
return player.countCards('h')>0&&!player.hasSkill('olfangquan3');
},
direct:true,
content:function(){
"step 0"
var fang=player.countMark('olfangquan2')==0&&player.hp>=2&&player.countCards('h')<=player.hp+2;
player.chooseBool(get.prompt2('olfangquan')).set('ai',function(){
if(!_status.event.fang) return false;
return game.hasPlayer(function(target){
if(target.hasJudge('lebu')||target.classList.contains('turnedover')||target==player) return false;
if(get.attitude(player,target)>4){
return (get.threaten(target)/Math.sqrt(target.hp+1)/Math.sqrt(target.countCards('h')+1)>0);
}
return false;
});
}).set('fang',fang);
"step 1"
if(result.bool){
player.logSkill('olfangquan');
trigger.cancel();
player.addTempSkill('olfangquan2');
player.addMark('olfangquan2',1,false);
}
},
};
lib.skill.refangquan={
audio:2,
trigger:{
player:"phaseUseBefore",
},
filter:function(event,player){
return player.countCards('h')>0&&!player.hasSkill('fangquan3');
},
direct:true,
content:function(){
"step 0"
var fang=player.countMark('fangquan2')==0&&player.hp>=2&&player.countCards('h')<=player.hp+2;
player.chooseBool(get.prompt2('refangquan')).set('ai',function(){
if(!_status.event.fang) return false;
return game.hasPlayer(function(target){
if(target.hasJudge('lebu')||target.classList.contains('turnedover')||target==player) return false;
if(get.attitude(player,target)>4){
return (get.threaten(target)/Math.sqrt(target.hp+1)/Math.sqrt(target.countCards('h')+1)>0);
}
return false;
});
}).set('fang',fang);
"step 1"
if(result.bool){
player.logSkill('refangquan');
trigger.cancel();
player.addTempSkill('fangquan2','phaseAfter');
player.addMark('fangquan2',1,false);
player.addTempSkill('refangquan2');
//player.storage.fangquan=result.targets[0];
}
},
};
lib.skill.fangquan2={
trigger:{
player:"phaseEnd",
},
forced:true,
popup:false,
audio:false,
onremove:true,
content:function(){
"step 0"
event.count=player.countMark(event.name);
player.removeMark(event.name,event.count);
"step 1"
event.count--;
player.chooseToDiscard('是否弃置一张牌并令一名其他角色进行一个额外回合？').set('logSkill',player.name=='re_liushan'?'refangquan':'fangquan').ai=function(card){
return 20-get.value(card);
};
"step 2"
if(result.bool){
player.chooseTarget(true,'请选择进行额外回合的目标角色',lib.filter.notMe).ai=function(target){
if(target.hasJudge('lebu')||target.classList.contains('turnedover')) return -1;
if(get.attitude(player,target)>0){
return get.threaten(target)/Math.sqrt(target.hp+1)/Math.sqrt(target.countCards('h')+1);
if(target.isUnderControl(true)){
return 2*(get.threaten(target)/Math.sqrt(target.hp+1)/Math.sqrt(target.countCards('h')+1)>0);
}
}
return -1;
};
}
else event.finish();
"step 3"
var target=result.targets[0];
player.line(target,'fire');
target.markSkillCharacter('fangquan',player,'放权','进行一个额外回合');
target.insertPhase();
target.addSkill('fangquan3');
if(event.count>0) event.goto(1);
},
};
lib.skill.olfangquan2={
trigger:{
player:"phaseDiscardBegin",
},
forced:true,
popup:false,
audio:false,
onremove:true,
content:function(){
"step 0"
event.count=player.countMark(event.name);
player.removeMark(event.name,event.count,false);
"step 1"
event.count--;
player.chooseToDiscard('是否弃置一张牌并令一名其他角色进行一个额外回合？').set('logSkill','olfangquan').ai=function(card){
return 20-get.value(card);
};
"step 2"
if(result.bool){
player.chooseTarget(true,'请选择进行额外回合的目标角色',lib.filter.notMe).ai=function(target){
if(target.hasJudge('lebu')||target.classList.contains('turnedover')) return -1;
if(get.attitude(player,target)>0){
return get.threaten(target)/Math.sqrt(target.hp+1)/Math.sqrt(target.countCards('h')+1);
if(target.isUnderControl(true)){
return 2*(get.threaten(target)/Math.sqrt(target.hp+1)/Math.sqrt(target.countCards('h')+1)>0);
}
}
return -1;
};
}
else event.finish();
"step 3"
var target=result.targets[0];
player.line(target,'fire');
target.markSkillCharacter('olfangquan',player,'放权','进行一个额外回合');
target.insertPhase();
target.addSkill('olfangquan3');
if(event.count>0) event.goto(1);
},
};
/*镇庭*/
lib.skill.spzhenting={
audio:2,
trigger:{
global:"useCardToTarget",
},
usable:1,
filter:function(event,player){
return (event.card.name=='sha'||get.type(event.card,false)=='delay')&&
event.player!=player&&!event.targets.contains(player)&&player.inRange(event.target);
},
logTarget:"target",
check:function(event,player){
var target=event.target,source=event.player;
if(get.attitude(player,event.target)<=0||(event.card.name=='sha'&&player.hp==1&&player.countCards('h','shan')==0)) return false;
var eff2=get.effect(player,event.card,source,player);
if(eff2>=0) return true;
var eff1=get.effect(target,event.card,source,player);
if(eff1>=0) return false;
if(eff1)
if(event.card.name=='sha'){
if(player.hasShan()) return true;
if(eff1>eff2) return false;
if(player.hp>2) return true;
if(player.hp==2) return eff2>eff1/3;
if(player.hp==1) return eff2>eff1/5;
return false;
}
if(event.card.name=='shandian'||event.card.name=='bingliang') return true;
if(event.card.name=='lebu') return !player.needsToDiscard()&&target.needsToDiscard();
return false;
},
content:function(){
'step 0'
var target=trigger.target,evt=trigger.getParent();
evt.triggeredTargets2.remove(target);
evt.targets.remove(target);
evt.triggeredTargets2.add(player);
evt.targets.add(player);
game.log(trigger.card,'的目标被改为了',player);
trigger.untrigger();
'step 1'
if(!trigger.player.countDiscardableCards(player,'h')) event._result={index:0};
else player.chooseControl().set('choiceList',[
'摸一张牌',
'弃置'+get.translation(trigger.player)+'的一张手牌',
]);
'step 2'
if(result.index==0) player.draw();
else{
player.line(trigger.player,'fire');
player.discardPlayerCard(trigger.player,true,'h');
}
},
ai:{
threaten:1.4,
},
};
/*败移*/
lib.skill.baiyi={
enable:"phaseUse",
usable:1,
filterTarget:function(card,player,target){
return player!=target;
},
selectTarget:2,
limited:true,
skillAnimation:true,
filter:function(event,player){
return player.isDamaged()&&game.players.length>2;
},
multitarget:true,
multiline:true,
changeSeat:true,
content:function(){
player.awakenSkill('baiyi');
game.broadcastAll(function(target1,target2){
game.swapSeat(target1,target2);
},targets[0],targets[1])
},
ai:{
order:function(item,player){
return get.order({name:'tao'})+3;
},
result:{
target:function(player,target){
if(player.hasUnknown()&&target!=player.next&&target!=player.previous) return 0;
var distance=Math.pow(get.distance(player,target,'absolute'),2);
if(!ui.selected.targets.length) return distance;
var distance2=Math.pow(get.distance(player,ui.selected.targets[0],'absolute'),2);
return Math.min(0,distance-distance2);
},
},
},
mark:true,
intro:{
content:"limited",
},
init:function(player,skill){
player.storage[skill]=false;
},
};
/*手杀-邀名*/
lib.skill.sbyaoming={
audio:2,
chargeSkill:true,
enable:"phaseUse",
filter:function(event,player){
return player.countMark('charge')>0;
},
filterTarget:true,
prompt:function(){
var num=_status.event.player.storage.sbyaoming_status;
var list=['弃置一名手牌数不小于你的角色的一张牌','；或令一名手牌数不大于你的角色摸一张牌']
if(typeof num=='number') list[num]+='（上次选择）';
return list[0]+list[1];
},
content:function(){
'step 0'
player.removeMark('charge',1);
var num=target.countCards('h'),num2=player.countCards('h');
if(num==num2&&target.countCards('he')>0){
var choice=get.attitude(player,target)>0?1:0;
var str=get.translation(target),choiceList=[
'弃置'+str+'的一张牌',
'令'+str+'摸一张牌',
];
if(typeof player.storage.sbyaoming_status=='number') choiceList[player.storage.sbyaoming_status]+='（上次选择）';
var next=player.chooseControl().set('choiceList',choiceList);
next.set('ai_choice',choice);
next.set('ai',()=>_status.event.ai_choice);
}
else event._result={index:num>num2?0:1};
'step 1'
if(result.index==0){
player.discardPlayerCard(target,true,'he');
}
else target.draw();
if(typeof player.storage.sbyaoming_status=='number'&&result.index!=player.storage.sbyaoming_status){
player.addMark('charge',1);
delete player.storage.sbyaoming_status;
}
else{
player.storage.sbyaoming_status=result.index;
}
},
ai:{
order:6,
result:{
target:function(player,target){
var att=get.attitude(player,target),eff=[0,0];
var hs=player.countCards('h'),ht=target.countCards('h');
if(hs>=ht){
eff[0]=get.effect(target,{name:'wuzhong'},player,player)/2;
if(player.storage.sbyaoming_status==0) eff[0]*=1.2;
}
if(hs<ht){
eff[1]=get.effect(target,{name:'guohe_copy2'},player,player);
if(player.storage.sbyaoming_status==1) eff[1]*=1.2;
}
return Math.max.apply(Math,eff);
},
},
},
group:["sbyaoming_damage","sbyaoming_init"],
subSkill:{
damage:{
trigger:{
player:"damageEnd",
},
direct:true,
content:function(){
'step 0'
var num=Math.min(trigger.num,4-player.countMark('charge'));
if(num>0){
player.logSkill('sbyaoming_damage');
player.addMark('charge',num);
game.delayx();
}
'step 1'
player.chooseTarget(get.prompt('sbyaoming'),lib.skill.sbyaoming.prompt()).set('ai',function(target){
var player=_status.event.player;
return get.effect(target,'sbyaoming',player,player)
});
'step 2'
if(result.bool){
player.useSkill('sbyaoming',result.targets);
}
},
sub:true,
},
init:{
trigger:{
global:"phaseBefore",
player:"enterGame",
},
forced:true,
locked:false,
filter:function(event,player){
return (event.name!='phase'||game.phaseNumber==0)&&player.countMark('charge')<4;
},
content:function(){
player.addMark('charge',Math.min(2,4-player.countMark('charge')));
},
sub:true,
},
},
};
/*放逐*/
lib.skill.fangzhu={
audio:2,
trigger:{
player:"damageEnd",
},
direct:true,
preHidden:true,
content:function(){
"step 0"
player.chooseTarget(get.prompt('fangzhu'),'令一名其他角色将武将牌翻面并摸'+get.cnNumber(player.getDamagedHp())+'张牌',function(card,player,target){
return player!=target
}).setHiddenSkill('fangzhu').ai=function(target){
if(target.hasSkillTag('noturn')) return 0;
var player=_status.event.player;
if(get.attitude(_status.event.player,target)>0&&target.classList.contains('turnedover')) return 10*player.getDamagedHp();
if(target.classList.contains('turnedover')) return -1;
if(_status.currentPhase==target&&player.getDamagedHp()<2&&get.attitude(_status.event.player,_status.currentPhase)<=0) return get.attitude(_status.event.player,target)<=0;
if(_status.currentPhase==target&&player.getDamagedHp()>=2&&get.attitude(_status.event.player,_status.currentPhase)>0) return get.attitude(_status.event.player,target);
if(_status.currentPhase!=target) return 2*-get.attitude(_status.event.player,target);
return 0;
}
"step 1"
if(result.bool){
player.logSkill('fangzhu',result.targets);
result.targets[0].draw(player.getDamagedHp());
result.targets[0].turnOver();
}
},
ai:{
maixie:true,
"maixie_hp":true,
effect:{
target:function(card,player,target){
if(get.tag(card,'damage')){
if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
if(target.hp<=1) return;
if(!target.hasFriend()) return;
var hastarget=false;
var turnfriend=false;
var players=game.filterPlayer();
for(var i=0;i<players.length;i++){
if(get.attitude(target,players[i])<0&&!players[i].isTurnedOver()){
hastarget=true;
}
if(get.attitude(target,players[i])>0&&players[i].isTurnedOver()){
hastarget=true;
turnfriend=true;
}
}
if(get.attitude(player,target)>0&&!hastarget) return;
if(turnfriend||target.hp==target.maxHp) return [0.5,1];
if(target.hp>1) return [1,0.5];
}
},
},
},
};
lib.skill.refangzhu={
audio:2,
trigger:{
player:"damageEnd",
},
direct:true,
content:function (){
"step 0"
player.chooseTarget(get.prompt2('refangzhu'),function(card,player,target){
return player!=target
}).ai=function(target){
if(target.hasSkillTag('noturn')) return 0;
var player=_status.event.player;
if(get.attitude(_status.event.player,target)>0&&target.classList.contains('turnedover')) return 10*player.getDamagedHp();
if(target.classList.contains('turnedover')) return -1;
if(_status.currentPhase==target&&player.getDamagedHp()<3) return get.attitude(_status.event.player,target)<=0;
if(_status.currentPhase!=target) return 2*-get.attitude(_status.event.player,target);
return 0;
}
"step 1"
if(result.bool){
player.logSkill('refangzhu',result.targets);
event.target=result.targets[0];
if(player.isHealthy()) event._result={bool:false};
else event.target.chooseToDiscard('he',player.getDamagedHp()).set('ai',function(card){
var player=_status.event.player;
if(player.isTurnedOver()||_status.event.getTrigger().player.getDamagedHp()>2) return -1;
return (player.hp*player.hp)-get.value(card);
}).set('prompt','弃置'+get.cnNumber(player.getDamagedHp())+'张牌并失去一点体力；或选择不弃置，将武将牌翻面并摸'+get.cnNumber(player.getDamagedHp())+'张牌。');
}
else event.finish();
"step 2"
if(result.bool){
event.target.loseHp();
}
else{
if(player.isDamaged()) event.target.draw(player.getDamagedHp());
event.target.turnOver();
}
},
ai:{
maixie:true,
"maixie_hp":true,
effect:{
target:function (card,player,target){
if(get.tag(card,'damage')){
if(player.hasSkillTag('jueqing',false,target)) return [1,-1.5];
if(target.hp<=1) return;
if(!target.hasFriend()) return;
var hastarget=false;
var turnfriend=false;
var players=game.filterPlayer();
for(var i=0;i<players.length;i++){
if(get.attitude(target,players[i])<0&&!players[i].isTurnedOver()){
hastarget=true;
}
if(get.attitude(target,players[i])>0&&players[i].isTurnedOver()){
hastarget=true;
turnfriend=true;
}
}
if(get.attitude(player,target)>0&&!hastarget) return;
if(turnfriend||target.hp==target.maxHp) return [0.5,1];
if(target.hp>1) return [1,0.5];
}
},
},
},
};
/*极略-放逐*/
lib.skill.jilue_fangzhu={
audio:1,
trigger:{
player:"damageEnd",
},
direct:true,
filter:function(event,player){
return player.hasMark('renjie');
},
content:function(){
"step 0"
player.chooseTarget('是否弃置一枚“忍”，并发动【放逐】？',function(card,player,target){
return player!=target
}).ai=function(target){
if(target.hasSkillTag('noturn')) return 0;
if(target.hasSkillTag('noturn')) return 0;
var player=_status.event.player;
if(get.attitude(_status.event.player,target)>0&&target.classList.contains('turnedover')) return 10*player.getDamagedHp();
if(target.classList.contains('turnedover')) return -1;
if(_status.currentPhase==target&&player.getDamagedHp()<2&&get.attitude(_status.event.player,_status.currentPhase)<=0) return get.attitude(_status.event.player,target)<=0;
if(_status.currentPhase==target&&player.getDamagedHp()>=2&&get.attitude(_status.event.player,_status.currentPhase)>0) return get.attitude(_status.event.player,target);
if(_status.currentPhase!=target) return 2*-get.attitude(_status.event.player,target);
return 0;
}
"step 1"
if(result.bool){
player.removeMark('renjie',1);
player.logSkill('jilue_fangzhu',result.targets);
result.targets[0].draw(player.maxHp-player.hp);
result.targets[0].turnOver();
}
},
};
/*极略-完杀*/
lib.skill.jilue_wansha={
audio:"wansha",
audioname:["shen_simayi"],
enable:"phaseUse",
usable:1,
filter:function(event,player){
return player.hasMark('renjie');
},
content:function(){
player.removeMark('renjie',1);
player.addTempSkill('rewansha');
},
ai:{
order:function(item,player){
return get.order({name:'sha'})+1.5;
},
result:{
player:function(player,target){
var cx=game.hasPlayer(function(current){
return current!=player&&current.hp==1&&player.inRange(current)&&get.attitude(player,current)<0;
});
if(cx>0&&((player.countCards('hs','sha')>0&&player.getCardUsable('sha')>0)||player.countCards('hs',function(card){
return get.name(card)!='sha'&&get.tag(card,'damage');
})>0)){
return 1;
}
return 0;
},
},
effect:{
player:function(card,player,target,current){
if(player.hasSkill('rewansha')){
if(get.tag(card,'damage')){
if(get.attitude(player,target)<0&&target.hp==1){
return [1,1.5];
}
}
}
},
},
},
};
/*决生*/
lib.skill.juesheng={
audio:2,
enable:"phaseUse",
limited:true,
skillAnimation:true,
animationColor:"orange",
viewAs:{
name:"juedou",
isCard:true,
},
filterCard:()=>false,
selectCard:-1,
precontent:function(){
player.awakenSkill('juesheng');
player.addTempSkill('juesheng_counter');
},
ai:{
result:{
player:function(player,target){
if(game.roundNumber<2) return 0;
},
target:function(player,target){
if(game.roundNumber<2) return 0;
var num=target.getAllHistory('useCard',function(evt){
return evt.card.name=='sha'
}).length;
var hs1=player.countCards('hs','sha');
var hs2=target.countCards('hs','sha');
if(hs2-hs1==0){
var hs3=-1;
}else var hs3=hs2-hs1;
if(get.attitude(player,target)<0){
if(num<target.hp){
return 0;
}else{
return num*hs3;
}
}
},
},
wuxie:function(target,card,player,viewer){
if(player==game.me&&get.attitude(viewer,player)>0){
return 0;
}
},
basic:{
order:5,
useful:1,
value:5.5,
},
tag:{
respond:2,
respondSha:2,
damage:1,
},
},
subSkill:{
counter:{
trigger:{
global:"damageBegin1",
},
forced:true,
charlotte:true,
filter:function(event,player){
var evt=event.getParent();
return evt.skill=='juesheng'&&evt.player==player;
},
content:function(){
var target=trigger.getParent().target;
trigger.num=target.getAllHistory('useCard',(evt)=>evt.card.name=='sha').length;
target.addTempSkill('juesheng',{player:'phaseAfter'});
},
sub:true,
},
},
mark:true,
intro:{
content:"limited",
},
init:function(player,skill){
player.storage[skill]=false;
},
};
/*节应*/
lib.skill.hfjieying2={
mod:{
cardEnabled:function(card,player){
if(player.storage.hfjieying2) return false;
},
cardSavable:function(card,player){
if(player.storage.hfjieying2) return false;
},
targetInRange:function(card,player){
if(player==_status.currentPhase&&(card.name=='sha'||get.type(card)=='trick')) return true;
},
aiOrder:function(player,card,num){
var info=get.info(card);
if(!get.tag(card,'damage')&&(!info||!info.toself)) return num+20;
},
},
onremove:true,
trigger:{
player:"useCard2",
},
direct:true,
filter:function(event,player){
if(player!=_status.currentPhase) return false;
var card=event.card;
if(card.name!='sha'&&get.type(card)!='trick')return false;
var info=get.info(card);
if(info.allowMultiple==false) return false;
if(event.targets&&!info.multitarget){
if(game.hasPlayer(function(current){
return !event.targets.contains(current)&&lib.filter.targetEnabled2(card,player,current);
})){
return true;
}
}
return false;
},
content:function(){
'step 0'
var prompt2='为'+get.translation(trigger.card)+'增加一个目标'
player.chooseTarget(get.prompt('hfjieying2'),function(card,player,target){
var player=_status.event.player;
return !_status.event.targets.contains(target)&&lib.filter.targetEnabled2(_status.event.card,player,target);
}).set('prompt2',prompt2).set('ai',function(target){
var trigger=_status.event.getTrigger();
var player=_status.event.player;
return get.effect(target,trigger.card,player,player);
}).set('card',trigger.card).set('targets',trigger.targets);
'step 1'
if(result.bool){
if(!event.isMine()&&!event.isOnline()) game.delayx();
event.targets=result.targets;
}
else{
event.finish();
}
'step 2'
if(event.targets){
player.logSkill('hfjieying2',event.targets);
trigger.targets.addArray(event.targets);
}
},
group:"hfjieying3",
mark:true,
intro:{
content:function(player){
if(player) return '不能使用牌直到回合结束';
return '使用【杀】或普通锦囊牌时无距离限制且可以多指定一个目标';
},
},
};
/*神郭嘉-慧识*/
/*lib.skill.reshuishi={
audio:"shuishi",
enable:"phaseUse",
usable:1,
filter:function(event,player){
return player.maxHp<10;
},
content:function(){
'step 0'
event.cards=[];
event.suits=[];
'step 1'
player.judge(function(result){
var evt=_status.event.getParent('reshuishi');
if(evt&&evt.suits&&evt.suits.contains(get.suit(result))) return 0;
return 1;
}).set('callback',function(){
event.getParent().orderingCards.remove(event.judgeResult.card);
}).judge2=function(result){
return result.bool?true:false;
};
'step 2'
event.cards.push(result.card);
if(result.bool&&player.maxHp<10){
event.suits.push(result.suit);
player.gainMaxHp();
event.goto(1);
}
else{
cards=cards.filterInD();
if(cards.length) player.chooseTarget('将'+get.translation(cards)+'交给一名角色',true).set('ai',function(target){
var player=_status.event.player;
var att=get.attitude(player,target)/Math.sqrt(1+target.countCards('h'));
if(target.hasSkillTag('nogain')) att/=10;
return att;
});
else event.finish();
}
'step 3'
if(result.bool){
var target=result.targets[0];
event.target=target;
player.line(target,'green');
target.gain(cards,'gain2');
}
'step 4'
if(target.isMaxHandcard()) player.loseMaxHp();
},
ai:{
order:12,
result:{
player:1,
},
},
};*/
/*屯田*/
lib.skill.tuntian={
audio:2,
audioname:["gz_dengai"],
trigger:{
player:"loseAfter",
global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
},
frequent:true,
preHidden:true,
filter:function(event,player){
if(player==_status.currentPhase) return false;
if(event.name=='gain'&&event.player==player) return false;
var evt=event.getl(player);
return evt&&evt.cards2&&evt.cards2.length>0;
},
content:function(){
'step 0'
var next=player.judge(function(card){
if(get.suit(card)=='heart') return -1;
return 1;
});
next.judge2=function(result){
return result.bool;
};
if(get.mode()!='guozhan'){
next.callback=lib.skill.tuntian.callback;
event.finish();
}
'step 1'
if(!result.bool||get.position(result.card)!='d'){
//game.cardsDiscard(card);
event.finish();
return;
}
event.card=result.card;
player.chooseBool('是否将'+get.translation(event.card)+'作为【田】置于武将牌上？').ai=function(){
return true;
};
'step 2'
if(!result.bool&&!event.directbool){
return;
};
player.addToExpansion(event.card,'gain2').gaintag.add('tuntian');
},
callback:function(){
if(!event.judgeResult.bool){
event.finish();
return;
}
player.addToExpansion(event.judgeResult.card,'gain2').gaintag.add('tuntian');
},
marktext:"田",
intro:{
content:"expansion",
markcount:"expansion",
},
onremove:function(player,skill){
var cards=player.getExpansions(skill);
if(cards.length) player.loseToDiscardpile(cards);
},
group:"tuntian_dist",
locked:false,
subSkill:{
dist:{
locked:false,
mod:{
globalFrom:function(from,to,distance){
var num=distance-from.getExpansions('tuntian').length;
if(_status.event.skill=='jixi_backup'||_status.event.skill=='gzjixi_backup') num++;
return num;
},
},
sub:true,
},
},
ai:{
effect:{
target:function(card,player,target,current){
if(get.name(card)=='sha'&&get.attitude(player,target)>0&&target.countCards('hs',{name:'shan'})<=0){
return 0;
}
if(get.name(card)=='juedou'&&get.attitude(player,target)>0){
return 0;
}
if(!target.hasFriend()&&!player.hasUnknown()) return;
if(_status.currentPhase==target) return;
if(card.name!='shuiyanqijunx'&&get.tag(card,'loseCard')&&target.countCards('he')){
if(target.hasSkill('ziliang')) return 0.7;
return [0.5,Math.max(2,target.countCards('h'))];
}
if(target.isUnderControl(true,player)){
if((get.tag(card,'respondSha')&&target.countCards('h','sha'))||
(get.tag(card,'respondShan')&&target.countCards('h','shan'))){
if(target.hasSkill('ziliang')) return 0.7;
return [0.5,1];
}
}
else if(get.tag(card,'respondSha')||get.tag(card,'respondShan')){
if(get.attitude(player,target)>0&&card.name=='juedou') return;
if(get.tag(card,'damage')&&target.hasSkillTag('maixie')) return;
if(target.countCards('h')==0) return 2;
if(target.hasSkill('ziliang')) return 0.7;
if(get.mode()=='guozhan') return 0.5;
return [0.5,Math.max(target.countCards('h')/4,target.countCards('h','sha')+target.countCards('h','shan'))];
}
},
},
threaten:function(player,target){
if(target.countCards('h')==0) return 2;
return 0.5;
},
nodiscard:true,
nolose:true,
},
};
lib.skill.oltuntian={
inherit:"tuntian",
filter:function(event,player){
if(player==_status.currentPhase){
if(event.type!='discard') return false;
var evt=event.getl(player);
return evt&&evt.cards2&&evt.cards2.filter(function(i){
return get.name(i,evt.hs.contains(i)?player:false)=='sha';
}).length>0;
};
if(event.name=='gain'&&event.player==player) return false;
var evt=event.getl(player);
return evt&&evt.cards2&&evt.cards2.length>0;
},
audio:2,
audioname:["gz_dengai"],
trigger:{
player:"loseAfter",
global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
},
frequent:true,
preHidden:true,
content:function(){
'step 0'
var next=player.judge(function(card){
if(get.suit(card)=='heart') return -1;
return 1;
});
next.judge2=function(result){
return result.bool;
};
if(get.mode()!='guozhan'){
next.callback=lib.skill.tuntian.callback;
event.finish();
}
'step 1'
if(!result.bool||get.position(result.card)!='d'){
//game.cardsDiscard(card);
event.finish();
return;
}
event.card=result.card;
player.chooseBool('是否将'+get.translation(event.card)+'作为【田】置于武将牌上？').ai=function(){
return true;
};
'step 2'
if(!result.bool&&!event.directbool){
return;
};
player.addToExpansion(event.card,'gain2').gaintag.add('tuntian');
},
callback:function(){
if(!event.judgeResult.bool){
event.finish();
return;
}
player.addToExpansion(event.judgeResult.card,'gain2').gaintag.add('tuntian');
},
marktext:"田",
intro:{
content:"expansion",
markcount:"expansion",
},
onremove:function(player,skill){
var cards=player.getExpansions(skill);
if(cards.length) player.loseToDiscardpile(cards);
},
group:"tuntian_dist",
locked:false,
subSkill:{
dist:{
locked:false,
mod:{
globalFrom:function(from,to,distance){
var num=distance-from.getExpansions('tuntian').length;
if(_status.event.skill=='jixi_backup'||_status.event.skill=='gzjixi_backup') num++;
return num;
},
},
sub:true,
},
},
ai:{
effect:{
target:function(card,player,target,current){
if(get.name(card)=='sha'&&get.attitude(player,target)>0&&target.countCards('hs',{name:'shan'})<=0){
return 0;
}
if(get.name(card)=='juedou'&&get.attitude(player,target)>0){
return 0;
}
if(!target.hasFriend()&&!player.hasUnknown()) return;
if(_status.currentPhase==target) return;
if(card.name!='shuiyanqijunx'&&get.tag(card,'loseCard')&&target.countCards('he')){
if(target.hasSkill('ziliang')) return 0.7;
return [0.5,Math.max(2,target.countCards('h'))];
}
if(target.isUnderControl(true,player)){
if((get.tag(card,'respondSha')&&target.countCards('h','sha'))||
(get.tag(card,'respondShan')&&target.countCards('h','shan'))){
if(target.hasSkill('ziliang')) return 0.7;
return [0.5,1];
}
}
else if(get.tag(card,'respondSha')||get.tag(card,'respondShan')){
if(get.attitude(player,target)>0&&card.name=='juedou') return;
if(get.tag(card,'damage')&&target.hasSkillTag('maixie')) return;
if(target.countCards('h')==0) return 2;
if(target.hasSkill('ziliang')) return 0.7;
if(get.mode()=='guozhan') return 0.5;
return [0.5,Math.max(target.countCards('h')/4,target.countCards('h','sha')+target.countCards('h','shan'))];
}
},
},
threaten:function(player,target){
if(target.countCards('h')==0) return 2;
return 0.5;
},
nodiscard:true,
nolose:true,
},
};
lib.skill.retuntian={
audio:2,
trigger:{
player:"loseAfter",
global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
},
frequent:true,
filter:function(event,player){
if(player==_status.currentPhase) return false;
if(event.name=='gain'&&event.player==player) return false;
var evt=event.getl(player);
return evt&&evt.cards2&&evt.cards2.length>0;
},
content:function(){
player.judge(function(card){
return 1;
}).callback=lib.skill.retuntian.callback;
},
callback:function(){
'step 0'
if(event.judgeResult.suit=='heart'){
player.gain(card,'gain2');
event.finish();
}
else if(get.mode()=='guozhan'){
player.chooseBool('是否将'+get.translation(card)+'作为【田】置于武将牌上？').set('frequentSkill','retuntian').ai=function(){
return true;
};
}
else event.directbool=true;
'step 1'
if(!result.bool&&!event.directbool){
//game.cardsDiscard(card);
return;
};
player.addToExpansion(card,'gain2').gaintag.add('tuntian');
},
group:"tuntian_dist",
locked:false,
ai:{
effect:{
target:function(card,player,target,current){
if(get.name(card)=='sha'&&get.attitude(player,target)>0&&target.countCards('hs',{name:'shan'})<=0){
return 0;
}
if(get.name(card)=='juedou'&&get.attitude(player,target)>0){
return 0;
}
return lib.skill.tuntian.ai.effect.target.apply(this,arguments);
},
},
threaten:function(player,target){
if(target.countCards('h')==0) return 2;
return 0.5;
},
nodiscard:true,
nolose:true,
},
};
/*朝凤*/
lib.skill.chaofeng={
audio:2,
trigger:{
source:"damageBegin1",
},
direct:true,
filter:function(event,player){
return player.countCards('he')>0&&player.isPhaseUsing()&&!player.hasSkill('chaofeng2');
},
content:function(){
'step 0'
var str='弃置一张牌并摸一张牌',color,type;
if(trigger.card){
type=get.type2(trigger.card,false);
color=get.color(trigger.card,false);
if(color!='none') str+='；若弃置'+get.translation(color)+'牌则改为摸两张牌';
if(type) str+='；若弃置类型为'+get.translation(type)+'的牌则伤害+1';
}
var next=player.chooseToDiscard('he',get.prompt('chaofeng',trigger.player),str);
next.set('ai',function(card){
var player=_status.event.player,suit=_status.event.color,number=_status.event.type;
var val=4-get.value(card);
if(get.color(card)==suit) val+=3;
if(get.attitude(player,trigger.player)<=0&&get.type2(card)==number) val+=4;
if(get.attitude(player,trigger.player)>0&&get.type2(card)==number) val=0;
return val;
});
next.logSkill=['chaofeng',trigger.player];
if(color!='none'){
event.color=color;
next.set('color',color);
}
if(type){
event.type=type;
next.set('type',type);
}
'step 1'
if(result.bool){
player.addTempSkill('chaofeng2','phaseUseEnd');
var card=result.cards[0];
player.draw((event.color&&get.color(card,card.original=='h'?player:false)==event.color)?2:1);
if(event.type&&get.type2(card,card.original=='h'?player:false)==event.type) trigger.num++;
}
},
};
/*居功*/
lib.skill.jugong={
audio:["jingong",2],
trigger:{
global:"damageEnd",
},
usable:1,
frequent:true,
locked:false,
notemp:true,
marktext:"功",
init:function (player){
player.storage.jugong=[];
},
filter:function (event,player){
return event.card&&(event.card.name=='sha'||event.card.name=='juedou')&&event.notLink()
&&_status.currentPhase!=player;
},
content:function (){
"step 0"
player.draw();
"step 1"
if(player.countCards('h')){
player.chooseCard('将'+get.cnNumber(1)+'张手牌置于武将牌上作为“功”',1,true);
}
else{
event.finish();
}
"step 2"
if(result.cards&&result.cards.length){
player.lose(result.cards,ui.special);
player.storage.jugong=player.storage.jugong.concat(result.cards);
player.syncStorage('jugong');
player.markSkill('jugong');
game.log(player,'将',result.cards,'置于武将牌上作为“功”');
}
},
intro:{
content:"cards",
},
group:"jugong_1",
subSkill:{
"1":{
trigger:{
player:"damageBegin",
},
filter:function (event,player){
return player.storage.jugong.length>1;
},
content:function (){
"step 0" 
player.chooseCardButton('移去两张“功”',2,player.storage.jugong,true);
"step 1"
if(event.directresult||result.bool){
player.logSkill('jugong');
var links=event.directresult||result.links;
for(var i=0;i<links.length;i++){
player.storage.jugong.remove(links[i]);
}
player.syncStorage('jugong');
if(!player.storage.jugong.length){
player.unmarkSkill('jugong');
}
else{
player.markSkill('jugong');
}
player.$throw(links);
game.log(player,'被移去了',links);
for(var i=0;i<links.length;i++){
ui.discardPile.appendChild(links[i]);
}
}
"step 2"
trigger.cancel();
},
sub:true,
},
},
};
/*新胆守*/
lib.skill.xindanshou={
audio:2,
trigger:{
global:"phaseJieshuBegin",
target:"useCardToTargeted",
},
direct:true,
filter:function(event,player,name){
return ((name=='phaseJieshuBegin'&&event.player!=player&&player.countCards('he')>=event.player.countCards('h'))||
(event.targets&&event.targets.contains(player)&&['basic','trick'].contains(get.type(event.card,'trick'))))
&&!player.hasSkill('xindanshou_as');
},
content:function(){
'step 0'
if(event.triggername=='phaseJieshuBegin'){
var num=trigger.player.countCards('h');
if(num>0) player.chooseToDiscard(get.prompt('xindanshou',trigger.player),num,'弃置'+get.cnNumber(num)+'张牌并对'+get.translation(trigger.player)+'造成1点伤害','he').set('logSkill',['xindanshou',trigger.player]).set('ai',function(card){
if(num>3&&trigger.player.hp>1) return false;
if(get.damageEffect(_status.event.getTrigger().player,_status.event.player,_status.event.player)>0) return Math.max(5.5,8-_status.event.selectTarget)-get.value(card);
return -1;
});
else player.chooseBool(get.prompt('xindanshou',trigger.player),'对'+get.translation(trigger.player)+'造成1点伤害').ai=function(){
return get.damageEffect(trigger.player,player,player)>0
};
}
else{
var num=0;
game.countPlayer2(function(current){
var history=current.getHistory('useCard');
for(var j=0;j<history.length;j++){
if(['basic','trick'].contains(get.type(history[j].card,'trick'))&&history[j].targets&&history[j].targets.contains(player)) num++;
}
});
event.num=num;
player.chooseBool(get.prompt('xindanshou')+'（可摸'+get.cnNumber(num)+'张牌）',get.translation('xindanshou_info')).set('ai',function(){
return _status.event.choice;
}).set('choice',function(){
if(player.isPhaseUsing()){
if(player.countCards('h',function(card){
return ['basic','trick'].contains(get.type(card,'trick'))&&player.canUse(card,player,null,true)&&get.effect(player,card,player)>0&&player.getUseValue(card,null,true)>0;
})) return false;
return true;
}
if(num>2) return true;
var card=trigger.card;
if(get.tag(card,'damage')&&player.hp<=trigger.getParent().baseDamage&&(!get.tag(card,'respondShan')||!player.hasShan())&&(!get.tag(card,'respondSha')||!player.hasSha())) return true;
var source=_status.currentPhase,todis=(source.countCards('h')-Math.max(0,source.needsToDiscard()));
if(todis<=Math.max(Math.min(2+(source.hp<=1?1:0),player.countCards('he',function(card){
return get.value(card,player)<Math.max(5.5,8-todis)
})),player.countCards('he',function(card){
return get.value(card,player)<=0;
}))&&get.damageEffect(source,player,player)>0) return false;
if(!source.isPhaseUsing()||get.attitude(player,source)>0) return true;
if(card.name=='sha'&&!source.getCardUsable('sha')) return true;
return Math.random()<num/3;
}());
}
'step 1'
if(result.bool){
if(!result.cards||!result.cards.length){
player.logSkill('xindanshou',trigger.player);
}
if(event.triggername=='useCardToTargeted'){
player.draw(num);
player.addTempSkill('xindanshou_as');
}
else{
trigger.player.damage('nocard');
}
}
},
subSkill:{
as:{
sub:true,
},
},
ai:{
threaten:0.6,
effect:{
target:function(card,player,target,current){
if(get.attitude(player,target)<=0){
if(typeof card!='object'||target.hasSkill('xindanshou_as')||!['basic','trick'].contains(get.type(card,'trick'))) return;
var num=0;
game.countPlayer2(function(current){
var history=current.getHistory('useCard');
for(var j=0;j<history.length;j++){
if(['basic','trick'].contains(get.type(history[j].card,'trick'))&&history[j].targets&&history[j].targets.contains(player)) num++;
}
});
if(player==target&&current>0) return [1.1,num];
return [0.9,num];
}
},
},
},
};
/*拥嫡*/
lib.skill.yongdi={
audio:2,
audioname:["xinping"],
unique:true,
limited:true,
trigger:{
player:"phaseZhunbeiBegin",
},
animationColor:"thunder",
skillAnimation:"legend",
filter:function(event,player){
return !player.storage.yongdi;
},
init:function(player){
player.storage.yongdi=false;
},
mark:true,
intro:{
content:"limited",
},
direct:true,
content:function(){
'step 0'
player.chooseTarget(get.prompt2('yongdi'),function(card,player,target){
return (target.hasSex('male')||target.name=='key_yuri')&&target!=player;
}).set('ai',function(target){
if(!_status.event.goon) return 0;
var player=_status.event.player;
var att=get.attitude(player,target);
if(att<=0) return 0;
var mode=get.mode();
if(mode=='identity'||(mode=='versus'&&_status.mode=='four')){
if(target.name&&lib.character[target.name]){
for(var i=0;i<lib.character[target.name][3].length;i++){
if(lib.skill[lib.character[target.name][3][i]].zhuSkill){
return att*2;
}
}
}
}
return get.attitude(player,target);
}).set('goon',!player.hasUnknown());
'step 1'
if(result.bool){
player.awakenSkill('yongdi');
player.storage.yongdi=true;
player.logSkill('yongdi',result.targets);
var target=result.targets[0];
target.gainMaxHp(true);
target.recover();
var mode=get.mode();
if(mode=='identity'||(mode=='versus'&&_status.mode=='four')){
if(target.name&&lib.character[target.name]){
var skills=lib.character[target.name][3];
target.storage.zhuSkill_yongdi=[];
for(var i=0;i<skills.length;i++){
var info=lib.skill[skills[i]];
if(info.zhuSkill){
target.storage.zhuSkill_yongdi.push(skills[i]);
if(info.init){
info.init(target);
}
if(info.init2){
info.init2(target);
}
}
}
}
}
}
},
ai:{
expose:0.2,
},
};
lib.skill.dcyongdi={
audio:"yongdi",
audioname:["xinping"],
unique:true,
limited:true,
enable:"phaseUse",
filterTarget:function(card,player,target){
return target.hasSex('male');
},
animationColor:"thunder",
skillAnimation:"legend",
mark:true,
intro:{
content:"limited",
},
direct:true,
content:function(){
'step 0'
player.awakenSkill('dcyongdi');
player.logSkill('dcyongdi',target);
if(!game.hasPlayer(current=>current.maxHp<target.maxHp)){
target.gainMaxHp();
}
'step 1'
if(target.isMinHp()){
target.recover();
}
'step 2'
if(target.isMinHandcard()){
target.draw(Math.min(5,target.maxHp));
}
'step 3'
game.delayx();
},
ai:{
expose:0.3,
order:1,
result:{
target:function(player,target){
if(get.attitude(player,target)>0){
var val=0;
var bool1=!game.hasPlayer(current=>current.maxHp<target.maxHp),bool2=target.isMinHp(),bool3=target.isMinHandcard();
if(bool1) val+=5;
if(bool2){
if(bool1) target.maxHp++;
val+=get.recoverEffect(target,player,player);
if(bool1) target.maxHp--;
}
if(bool3){
var num=Math.min(5,target.maxHp+(bool1?1:0));
val+=5*num;
}
return val;
}
},
},
},
init:function(player,skill){
player.storage[skill]=false;
},
};
/*SP善檄*/
lib.skill.spshanxi={
audio:2,
trigger:{
player:"phaseUseBegin",
},
direct:true,
filter:function(event,player){
return game.hasPlayer(function(current){
return current!=player&&!current.hasMark('spshanxi');
});
},
content:function(){
'step 0'
var eff=0;
var target=game.findPlayer(function(current){
return current!=player&&!current.hasMark('spshanxi');
});
if(target) eff=(-get.attitude(player,target)/Math.sqrt(Math.max(1,target.hp)));
player.chooseTarget(get.prompt('spshanxi'),'令一名其他角色获得“檄”',function(card,player,target){
return target!=player&&!target.hasMark('spshanxi');
}).set('ai',function(target){
return (-get.attitude(_status.event.player,target)/Math.sqrt(Math.max(1,target.hp)))-_status.event.eff;
}).set('eff',eff);
'step 1'
if(result.bool){
var target=result.targets[0];
player.logSkill('spshanxi',target);
game.countPlayer(function(current){
if(current==target){
current.addMark('spshanxi',1);
current.addSkill('spshanxi_bj');
}else{
var num=current.countMark('spshanxi');
if(num>0){
current.removeMark('spshanxi',num);
current.removeSkill('spshanxi_bj');
}
}
});
}
},
marktext:"檄",
intro:{
"name2":"檄",
content:"已被设下索命檄文",
},
group:"spshanxi_suoming",
ai:{
threaten:3.3,
},
};
lib.skill.spshanxi_bj={
charlotte:true,
superCharlotte:true,
};
/*TW孝廉*/
lib.skill.twxiaolian={
audio:2,
trigger:{
global:"useCardToTarget",
},
logTarget:"target",
filter:function(event,player){
return event.card&&event.card.name=='sha'&&event.player!=player&&
event.targets.length==1&&event.targets[0]!=player;
},
check:function(event,player){
return player.hp>1&&get.attitude(player,event.target)>0;
},
content:function(){
trigger.getParent().twxiaolian=trigger.targets[0];
trigger.targets.length=0;
trigger.getParent().triggeredTargets2.length=0;
trigger.targets.push(player);
},
group:"twxiaolian_damage",
subSkill:{
distance:{
sub:true,
charlotte:true,
init:function(player,skill){
if(!player.storage[skill]) player.storage[skill]=[];
},
mark:true,
marktext:"马",
intro:{
content:"cards",
onunmark:"throw",
},
mod:{
globalTo:function(from,to,distance){
if(from!=to&&to.storage.twxiaolian_distance) return distance+to.storage.twxiaolian_distance.length;
},
},
},
damage:{
sub:true,
trigger:{
player:"damageEnd",
},
direct:true,
filter:function(event,player){
return event.getParent(2).twxiaolian!=undefined;
},
content:function(){
'step 0'
var target=trigger.getParent(2).twxiaolian;
event.target=target;
player.chooseCard('是否将一张牌当做【马】置于'+get.translation(target)+'的武将牌旁？','he').ai=function(card){
if(get.attitude(_status.event.player,_status.event.getParent('twxiaolian_damage').target)>2) return 7-get.value(card);
return 0;
};
'step 1'
if(result.bool){
player.logSkill('twxiaolian',target);
player.lose(result.cards,ui.special,'toStorage');
target.addSkill('twxiaolian_distance');
target.storage.twxiaolian_distance.addArray(result.cards);
target.markSkill('twxiaolian_distance');
}
},
},
},
};
/*TW伺怠*/
lib.skill.twsidai={
audio:2,
enable:"phaseUse",
usable:1,
locked:false,
limited:true,
skillAnimation:true,
animationColor:"fire",
filter:function(event,player){
var cards=player.getCards('h',{type:'basic'});
if(!cards.length) return false;
for(var i of cards){
if(!game.checkMod(i,player,'unchanged','cardEnabled2',player)) return false;
}
return event.filterCard(get.autoViewAs({name:'sha',storage:{twsidai:true}},cards),player,event);
},
viewAs:{
name:"sha",
storage:{
twsidai:true,
},
},
filterCard:{
type:"basic",
},
selectCard:-1,
check:()=>1,
onuse:function(result,player){
player.awakenSkill('twsidai');
player.addTempSkill('twsidai_effect');
},
ai:{
order:2.9,
result:{
target:function(player,target){
if(get.attitude(player,target)>0) return "zeroplayertarget";
var cards=ui.selected.cards.slice(0);
var names=[];
for(var i of cards) names.add(i.name);
if(names.length<player.hp) return 0;
if(player.hasUnknown()&&(player.identity!='fan'||!target.isZhu)) return 0;
if(get.attitude(player,target)>=0) return -20;
return lib.card.sha.ai.result.target.apply(this,arguments);
},
},
yingbian:function(card,player,targets,viewer){
if(get.attitude(viewer,player)<=0) return 0;
var base=0,hit=false;
if(get.cardtag(card,'yingbian_hit')){
hit=true;
if(targets.filter(function(target){
return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
})) base+=5;
}
if(get.cardtag(card,'yingbian_all')){
if(game.hasPlayer(function(current){
return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
})) base+=5;
}
if(get.cardtag(card,'yingbian_damage')){
if(targets.filter(function(target){
return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true))&&!target.hasSkillTag('filterDamage',null,{
player:player,
card:card,
jiu:true,
})
})) base+=5;
}
return base;
},
canLink:function(player,target,card){
if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)) return false;
if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
return true;
},
basic:{
useful:[5,3,1],
value:[5,3,1],
},
tag:{
respond:1,
respondShan:1,
damage:function(card){
if(card.nature=='poison') return;
return 1;
},
natureDamage:function(card){
if(card.nature) return 1;
},
fireDamage:function(card,nature){
if(card.nature=='fire') return 1;
},
thunderDamage:function(card,nature){
if(card.nature=='thunder') return 1;
},
poisonDamage:function(card,nature){
if(card.nature=='poison') return 1;
},
},
},
mod:{
cardUsable:function(card){
if(card.storage&&card.storage.twsidai) return Infinity;
},
targetInRange:function(card){
if(card.storage&&card.storage.twsidai) return true;
},
},
subSkill:{
effect:{
charlotte:true,
trigger:{
source:"damageBegin1",
},
filter:function(event,player){
if(!event.card||!event.card.storage||!event.card.storage.twsidai||event.getParent().type!='card') return false;
for(var i of event.cards){
if(i.name=='jiu') return true;
}
return false;
},
forced:true,
popup:false,
content:function(){
trigger.num*=2;
game.log(trigger.card,'的伤害值','#y×2');
},
group:["twsidai_tao","twsidai_shan"],
sub:true,
},
tao:{
trigger:{
source:"damageSource",
},
filter:function(event,player){
if(!event.card||!event.card.storage||!event.card.storage.twsidai||!event.player.isIn()) return false;
for(var i of event.cards){
if(i.name=='tao') return true;
}
return false;
},
forced:true,
popup:false,
content:function(){
trigger.player.loseMaxHp();
},
sub:true,
},
shan:{
trigger:{
player:"useCardToPlayered",
},
filter:function(event,player){
if(!event.card||!event.card.storage||!event.card.storage.twsidai||!event.target.isIn()) return false;
for(var i of event.cards){
if(i.name=='shan') return true;
}
return false;
},
forced:true,
popup:false,
content:function(){
'step 0'
trigger.target.chooseToDiscard('h',{type:'basic'},'弃置一张基本牌，否则不能响应'+get.translation(trigger.card)).set('ai',function(card){
var player=_status.event.player;
if(player.hasCard('hs',function(cardx){
return cardx!=card&&get.name(cardx,player)=='shan';
})) return 12-get.value(card);
return 0;
});
'step 1'
if(!result.bool) trigger.directHit.add(trigger.target);
},
sub:true,
},
},
mark:true,
intro:{
content:"limited",
},
init:function(player,skill){
player.storage[skill]=false;
},
};
/*精械*/
lib.skill.xinfu_jingxie1={
position:"he",
audio:'xinfu_jingxie',
enable:["phaseUse","chooseToUse"],
filter:function(event,player){
if(event.type=='dying'){
if(player!=event.dying) return false;
return player.countCards('he',function(card){
return get.subtype(card)=='equip2';
})>0;
}
else {
var he=player.getCards('he');
for(var i=0;i<he.length;i++){
if(["bagua","baiyin","lanyinjia","renwang","tengjia","zhuge"].contains(he[i].name)) return true;
}
};
return false;
},
filterCard:function(card){
return _status.event.parent.name=='phaseUse'?["bagua","baiyin","lanyinjia","renwang","tengjia","zhuge"].contains(card.name):get.subtype(card)=='equip2';
},
discard:false,
get lose(){
return _status.event.parent&&_status.event.parent.type=='dying';
},
get loseTo(){
if(_status.event.parent&&_status.event.parent.type=='dying')return 'discardPile';
},
get prepare(){
if(_status.event.parent&&_status.event.parent.type=='dying')return (function(cards,player){
player.$throw(cards,1000);
game.log(player,'将',cards,'置入了弃牌堆');
});
},
delay:false,
check:function(){
return 1;
},
content:function(){
"step 0"
if(event.getParent(2).type=='dying')player.draw();
else player.showCards(cards);
"step 1"
if(event.getParent(2).type=='dying'){
var num=1-player.hp;
if(num) player.recover(num);
return;
};
var card=cards[0];
var bool=(get.position(card)=='e');
if(bool) player.removeEquipTrigger(card);
game.addVideo('skill',player,['xinfu_jingxie',[bool,get.cardInfo(card)]])
game.broadcastAll(function(card){
card.init([card.suit,card.number,'rewrite_'+card.name]);
},card);
if(bool){
var info=get.info(card);
if(info.skills){
for(var i=0;i<info.skills.length;i++){
player.addSkillTrigger(info.skills[i]);
}
}
}
},
ai:{
get order(){
if(_status.event.type=='dying')return 0.5;
},
basic:{
order:10,
},
result:{
player:function (){
return _status.event.type=='dying'?10:1;
},
},
skillTagFilter:function(player,arg,target){
if(player!=target) return false;
return player.countCards('he',function(card){
if(_status.connectMode&&get.position(card)=='h') return true;
return get.subtype(card)=='equip2';
})>0;
},
save:true,
},
};
/*忠佐*/
lib.skill.zhongzuo={
audio:2,
trigger:{
global:"phaseJieshuBegin",
},
direct:true,
filter:function(event,player){
return player.getHistory('damage').length>0||player.getHistory('sourceDamage').length>0;
},
content:function(){
'step 0'
player.chooseTarget(get.prompt('zhongzuo'),'令一名角色摸两张牌。若其已受伤，则你摸一张牌。').set('ai',function(target){
if(target.hasSkillTag('nogain')&&target!=_status.currentPhase) return target.isDamaged()?0:1;
if(target==player) return 2;
if(get.attitude(_status.event.player,target)>0){
if(target.isDamaged()&&target==player){
return 3.5;
}
if(target.isDamaged()){
return 3;
}
return 2;
}
if(get.attitude(_status.event.player,target)<=0) return 0;
return 0;
});
'step 1'
if(result.bool){
var target=result.targets[0];
player.logSkill('zhongzuo',target);
target.draw(2);
if(target.isDamaged()) player.draw();
}
},
};
/*进谏*/
lib.skill.jinjian={
audio:2,
trigger:{
source:"damageBegin1",
},
logTarget:"player",
filter:function(event,player){
return !event.jinjian_source2&&!player.hasSkill('jinjian_source2');
},
"prompt2":"令即将对其造成的伤害+1",
check:function(event,player){
return get.attitude(player,event.player)<0&&!event.player.hasSkillTag('filterDamage',null,{
player:player,
card:event.card,
});
},
content:function(){
trigger.jinjian_source=true;
trigger.num++;
player.addTempSkill('jinjian_source2')
},
group:"jinjian_player",
subSkill:{
player:{
audio:"jinjian",
trigger:{
player:"damageBegin3",
},
filter:function(event,player){
return !event.jinjian_player2&&!player.hasSkill('jinjian_player2');
},
"prompt2":"令即将受到的伤害-1",
content:function(){
trigger.jinjian_player=true;
trigger.num--;
player.addTempSkill('jinjian_player2')
},
sub:true,
},
"source2":{
trigger:{
source:"damageBegin1",
},
forced:true,
charlotte:true,
filter:function(event,player){
return !event.jinjian_source;
},
content:function(){
trigger.num--;
trigger.jinjian_source2=true;
player.removeSkill('jinjian_source2');
},
marktext:" -1 ",
intro:{
content:"下次造成的伤害-1",
},
sub:true,
},
"player2":{
trigger:{
player:"damageBegin3",
},
forced:true,
charlotte:true,
filter:function(event,player){
return !event.jinjian_player;
},
content:function(){
trigger.num++;
trigger.jinjian_player2=true;
player.removeSkill('jinjian_player2');
},
marktext:" +1 ",
intro:{
content:"下次受到的伤害+1",
},
sub:true,
},
},
ai:{
"maixie_defend":true,
threaten:0.9,
effect:{
target:function(card,player,target){
if(player.hasSkillTag('jueqing')) return;
if(target.hujia) return;
if(player._jinjian_tmp) return;
if(_status.event.getParent('useCard',true)||_status.event.getParent('_wuxie',true)) return;
if(get.tag(card,'damage')){
if(target.hasSkill('jinjian_player2')){
return [1,-2];
}
else{
if(get.attitude(player,target)<0&&!player.hasSkillTag('damageBonus')){
var sha=player.getCardUsable({name:'sha'});
player._jinjian_tmp=true;
var num=player.countCards('h',function(card){
if(card.name=='sha'){
if(sha==0){
return false;
}
else{
sha--;
}
}
return get.tag(card,'damage')&&player.canUse(card,target)&&get.effect(target,card,player,player)>0;
});
delete player._jinjian_tmp;
if(player.hasSkillTag('damage')){
num++;
}
if(num<2){
return [0,0.8];
}
}
}
}
},
},
},
};
/*雷击*/
lib.skill.xinleiji={
group:"xinleiji_misa",
audio:2,
derivation:"xinleiji_faq",
audioname:["boss_qinglong"],
trigger:{
player:["useCard","respond"],
},
filter:function(event,player){
return event.card.name=='shan'||event.name=='useCard'&&event.card.name=='shandian';
},
judgeCheck:function(card,bool){
var suit=get.suit(card);
if(suit=='spade'){
if(bool&&get.number(card)>1&&get.number(card)<10) return 5;
return 4;
}
if(suit=='club') return 2;
return 0;
},
content:function(){
player.judge(lib.skill.xinleiji.judgeCheck).judge2=function(result){
return result.bool?true:false;
};
},
ai:{
useShan:true,
effect:{
target:function(card,player,target,current){
if(get.tag(card,'respondShan')&&!player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)){
var hastarget=game.hasPlayer(function(current){
return get.attitude(target,current)<0;
});
var be=target.countCards('e',{color:'black'});
if(target.countCards('h','shan')&&be){
if(!target.hasSkill('xinguidao')) return 0;
return [0,hastarget?target.countCards('he')/2:0];
}
if(target.countCards('h','shan')&&target.countCards('h')>2){
if(!target.hasSkill('xinguidao')) return 0;
return [0,hastarget?target.countCards('h')/4:0];
}
if(target.countCards('h')>3||(be&&target.countCards('h')>=2)){
return [0,0];
}
if(target.countCards('h')==0){
return [1.5,0];
}
if(target.countCards('h')==1&&!be){
return [1.2,0];
}
if(!target.hasSkill('xinguidao')) return [1,0.05];
return [1,Math.min(0.5,(target.countCards('h')+be)/4)];
}
if(get.name(card)=="lebu"||get.name(card)=="bingliang"){
if(get.attitude(target,player)<0&&(target.countCards('e',{color:'black'})>0||target.countCards('h')>2)){
return [0,0.5];
}
}
},
},
},
};
/*战绝*/
lib.skill.zhanjue={
audio:2,
enable:"phaseUse",
filterCard:true,
selectCard:-1,
position:"h",
filter:function(event,player){
if(player.getStat().skill.zhanjue_draw&&player.getStat().skill.zhanjue_draw>=2) return false;
var hs=player.getCards('h');
if(!hs.length) return false;
for(var i=0;i<hs.length;i++){
var mod2=game.checkMod(hs[i],player,'unchanged','cardEnabled2',player);
if(mod2===false) return false;
}
return true;
},
viewAs:{
name:"juedou",
},
group:["zhanjue4"],
ai:{
damage:true,
order:function(item,player){
if(player.countCards('h','tao')>0){
return get.order({name:'tao'}) -1;
}
return 0.5;
},
effect:{
player:function(card,player,target){
if(_status.event.skill=='zhanjue'){
if(player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)) return;
if(player.countCards('h')>=3||target.countCards('h')>=3) return 'zeroplayertarget';
if(player.countCards('h','tao')) return 'zeroplayertarget';
if(target.countCards('h','sha')>1) return 'zeroplayertarget';
}
},
},
wuxie:function(target,card,player,viewer){
if(player==game.me&&get.attitude(viewer,player)>0){
return 0;
}
},
basic:{
order:5,
useful:1,
value:5.5,
},
result:{
target:-1.5,
player:function(player,target,card){
if(player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)){
return 0;
}
if(get.damageEffect(target,player,target)>0&&get.attitude(player,target)>0&&get.attitude(target,player)>0){
return 0;
}
var hs1=target.countCards('hs','sha');
var hs2=player.countCards('hs','sha');
if(hs1>(hs2+1)){
return -2;
}
if(player.hp==1&&hs2==0&&hs1>=1){
return -2;
}
var hsx=target.countCards('hs');
if(hsx.length==0){
return 0;
}
if(hsx>3&&hs2==0){
return -2;
}
return -0.5;
},
},
tag:{
respond:2,
respondSha:2,
damage:1,
},
},
};
lib.skill.rezhanjue={
audio:2,
enable:"phaseUse",
filterCard:function(card){
return !card.hasGaintag('reqinwang');
},
selectCard:-1,
position:"h",
filter:function(event,player){
var stat=player.getStat().skill;
if(stat.rezhanjue_draw&&stat.rezhanjue_draw>=3) return false;
var hs=player.getCards('h',function(card){
return !card.hasGaintag('reqinwang');
});
if(!hs.length) return false;
for(var i=0;i<hs.length;i++){
var mod2=game.checkMod(hs[i],player,'unchanged','cardEnabled2',player);
if(mod2===false) return false;
}
return event.filterCard(get.autoViewAs({name:'juedou'},hs))
},
viewAs:{
name:"juedou",
},
onuse:function(links,player){
player.addTempSkill('rezhanjue_effect','phaseUseEnd');
},
ai:{
order:function(item,player){
if(player.countCards('h','tao')>0){
return get.order({name:'tao'}) -1;
}
return 0.5;
},
tag:{
respond:2,
respondSha:2,
damage:1,
},
result:{
target:-1.5,
player:function(player,target){
if(player.hasSkillTag('directHit_ai',true,{
target:target,
card:{name:'juedou'},
},true)){
return 0;
}
if(get.damageEffect(target,player,target)>0&&get.attitude(player,target)>0&&get.attitude(target,player)>0){
return 0;
}
var hs1=target.getCards('h','sha');
var hs2=player.getCards('h',function(card){
return card.hasGaintag('reqinwang')&&get.name(card)=='sha';
});
if(hs1.length>hs2.length+1){
return -2;
}
var hsx=target.getCards('h');
if(hsx.length>2&&hs2.length==0&&hsx[0].number<6){
return -2;
}
if(hsx.length>3&&hs2.length==0){
return -2;
}
if(hs1.length>hs2.length&&(!hs2.length||hs1[0].number>hs2[0].number)){
return -2;
}
return -0.5;
},
},
wuxie:function(target,card,player,viewer){
if(player==game.me&&get.attitude(viewer,player)>0){
return 0;
}
},
basic:{
order:5,
useful:1,
value:5.5,
},
},
};
/*制衡*/
lib.skill.zhiheng={
audio:2,
audioname:["gz_jun_sunquan"],
enable:"phaseUse",
usable:1,
position:"he",
filterCard:true,
selectCard:[1,Infinity],
prompt:"弃置任意张牌并摸等量的牌",
check:function(card){
return 6-get.value(card)
},
content:function(){
player.draw(cards.length);
},
ai:{
order:function(item,player){
if(player.countCards('h','tao')>0){
return get.order({name:'tao'}) -1;
}
return 0.5;
},
result:{
player:1,
},
threaten:1.5,
},
};
lib.skill.rezhiheng={
audio:2,
audioname:["shen_caopi"],
enable:"phaseUse",
usable:1,
position:"he",
filterCard:function(card,player,event){
event=event||_status.event;
if(typeof event!='string') event=event.getParent().name;
var mod=game.checkMod(card,player,event,'unchanged','cardDiscardable',player);
if(mod!='unchanged') return mod;
return true;
},
discard:false,
lose:false,
delay:false,
selectCard:[1,Infinity],
check:function(card){
var player=_status.event.player;
if(get.position(card)=='h'&&!player.countCards('h','du')&&(player.hp>2||!player.countCards('h',function(card){
return get.value(card)>=8;
}))){
return 1;
}
return 6-get.value(card)
},
content:function(){
'step 0'
player.discard(cards);
event.num=1;
var hs=player.getCards('h');
if(!hs.length) event.num=0;
for(var i=0;i<hs.length;i++){
if(!cards.contains(hs[i])){
event.num=0;break;
}
}
'step 1'
player.draw(event.num+cards.length);
},
subSkill:{
draw:{
trigger:{
player:"loseEnd",
},
silent:true,
filter:function(event,player){
if(event.getParent(2).skill!='rezhiheng'&&event.getParent(2).skill!='jilue_zhiheng') return false;
if(player.countCards('h')) return false;
for(var i=0;i<event.cards.length;i++){
if(event.cards[i].original=='h') return true;
}
return false;
},
content:function(){
player.addTempSkill('rezhiheng_delay',trigger.getParent(2).skill+'After');
},
sub:true,
forced:true,
popup:false,
},
delay:{
sub:true,
},
},
ai:{
order:function(item,player){
if(player.countCards('h')==1){
if(player.countCards('h','tao')==0&&player.countCards('h','wuzhong')==0) return 10;
}
if(player.countCards('h','tao')>0){
return get.order({name:'tao'}) -1;
}
return 0.5;
},
result:{
player:1,
},
threaten:1.55,
},
};
/*诛侫*/
lib.skill.zhuning={
audio:2,
enable:"phaseUse",
usable:2,
filter:function(event,player){
if(!player.countCards('he')) return false;
return (!player.getStat('skill').zhuning||player.hasSkill('zhuning_double'));
},
filterCard:true,
position:"he",
filterTarget:function(card,player,target){
return player!=target;
},
selectCard:[1,Infinity],
delay:false,
lose:false,
discard:false,
check:function(card){
if(ui.selected.cards.length&&ui.selected.cards[0].name=='du') return 0;
if(!ui.selected.cards.length&&card.name=='du') return 20;
var player=get.owner(card);
if(ui.selected.cards.length>=Math.max(1,player.countCards('h')-player.hp)) return 0;
return 10-get.value(card);
},
content:function(){
'step 0'
player.give(cards,target).gaintag.add('fengxiang_tag');
target.addSkill('fengxiang_card');
'step 1'
var list=[];
for(var name of lib.inpile){
var type=get.type(name);
if(type!='basic'&&type!='trick') continue;
var card={name:name,isCard:true};
if(get.tag(card,'damage')>0&&player.hasUseTarget(card)){
list.push([type,'',name]);
}
if(name=='sha'){
for(var i of lib.inpile_nature){
card.nature=i;
if(player.hasUseTarget(card)) list.push([type,'',name,i]);
}
}
}
if(list.length){
player.chooseButton(['是否视为使用一张伤害牌？',[list,'vcard']]).set('ai',function(button){
return _status.event.player.getUseValue({name:button.link[2]});
});
}
else event.finish();
'step 2'
if(result.bool){
player.chooseUseTarget({name:result.links[0][2],nature:result.links[0][3],isCard:true},true,false);
}
else event.finish();
'step 3'
if(!player.hasHistory('sourceDamage',function(evt){
if(!evt.card) return false;
var evtx=evt.getParent('useCard');
return evtx.card==evt.card&&evtx.getParent(2)==event;
})) player.addTempSkill('zhuning_double');
},
subSkill:{
double:{
sub:true,
},
},
ai:{
fireAttack:true,
order:4,
result:{
target:function(player,target){
if(target.hasSkillTag('nogain')) return 0;
if(ui.selected.cards.length&&ui.selected.cards[0].name=='du'){
if(target.hasSkillTag('nodu')) return 0;
return -10;
}
if(target.hasJudge('lebu')) return 0;
var nh=target.countCards('h');
var np=player.countCards('h');
if(player.hp==player.maxHp||player.storage.rerende<0||player.countCards('h')<=1){
if(nh>=np-1&&np<=player.hp&&!target.hasSkill('haoshi')) return 0;
}
return Math.max(1,5-nh);
},
},
},
};
lib.skill.fengxiang_card={
trigger:{
player:"loseEnd",
},
forced:true,
popup:false,
silent:true,
filter:function(event,player,card){
return player.getCards('h',function(card){
return card.hasGaintag('fengxiang_tag');
}).length==0;
},
content:function(){
player.removeSkill('fengxiang_card');
},
mod:{
aiOrder:function(player,card,num){
if(game.countPlayer(function(current){
return get.attitude(player,current)>0&&current.hasSkill('fengxiang');
})){
if(get.itemtype(card)=='card'&&card.hasGaintag('fengxiang_tag')){
return num+10;
}
}
},
},
};
/*手杀节钺*/
lib.skill.rejieyue={
audio:2,
trigger:{
player:"phaseJieshuBegin",
},
direct:true,
filter:function(event,player){
return player.countCards('he')>0;
},
content:function(){
'step 0'
player.chooseCardTarget({
prompt:get.prompt2('rejieyue'),
filterCard:true,
position:'he',
filterTarget:lib.filter.notMe,
ai1:function(card){
var player=_status.event.player;
if(get.name(card)=='du') return 20;
if(get.position(card)=='e'&&get.value(card)<=0) return 14;
if(get.position(card)=='h'&&game.hasPlayer(function(current){
return current!=player&&get.attitude(player,current)>0&&current.getUseValue(card)>player.getUseValue(card)&&current.getUseValue(card)>player.getUseValue(card);
})) return 12;
if(game.hasPlayer(function(current){
return current!=player&&get.attitude(player,current)>0;
})){
if(card.name=='wuxie') return 11;
if(card.name=='shan'&&player.countCards('h','shan')>1) return 9
}
return 6/Math.max(1,get.value(card));
},
ai2:function(target){
var player=_status.event.player;
var card=ui.selected.cards[0];
var att=get.attitude(player,target);
if(card.name=='du') return -6*att;
if(att>0){
if(get.position(card)=='h'&&target.getUseValue(card)>player.getUseValue(card)) return 4*att;
if(get.value(card,target)>get.value(card,player)) return 2*att;
return 1.2*att;
}
return -att*Math.min(5,target.countCards('he'))/5;
},
});
'step 1'
if(result.bool){
var target=result.targets[0];
event.target=target;
player.logSkill('rejieyue',target);
player.give(result.cards,target);
}
else event.finish();
'step 2'
var num=0;
if(target.countCards('h')) num++;
if(target.countCards('e')) num++;
if(num>0){
var next=target.chooseCard('he',num,'选择保留每个区域的各一张牌，然后弃置其余的牌。或点取消，令'+get.translation(player)+'摸三张牌',function(card){
for(var i=0;i<ui.selected.cards.length;i++){
if(get.position(ui.selected.cards[i])==get.position(card)) return false;
}
return true;
});
next.set('complexCard',true);
next.set('goon',get.attitude(target,player)>=0);
next.set('maxNum',num);
next.set('ai',function(card){
if(_status.event.player.countCards('he')>=4) return -1;
if(_status.event.goon) return -1;
var num=_status.event.maxNum;
if(ui.selected.cards.length>=num-1){
var val=get.value(player.getCards('he',function(cardx){
return cardx!=card&&!ui.selected.cards.contains(cardx);
}));
if(val>=14) return 0;
}
return get.value(card);
});
}
else event._result={bool:false};
'step 3'
if(!result.bool) player.draw(3);
else {
var cards=target.getCards('he');
cards.removeArray(result.cards);
if(cards.length) target.discard(cards);
}
},
ai:{
threaten:1.3,
expose:0.2,
},
};
/*曹婴 凌人*/
lib.skill.xinfu_lingren={
usable:1,
audio:2,
trigger:{
player:"useCardToPlayered",
},
direct:true,
filter:function(event,player){
if(event.getParent().triggeredTargets3.length>1) return false;
if(!player.isPhaseUsing()) return false;
if(!['basic','trick'].contains(get.type(event.card))) return false;
if(get.tag(event.card,'damage')) return true;
return false;
},
content:function(){
'step 0'
player.chooseTarget(get.prompt('xinfu_lingren'),'选择一名目标角色并猜测其手牌构成',function(card,player,target){
return _status.event.targets.contains(target);
}).set('ai',function(target){
return 2-get.attitude(_status.event.player,target);
}).set('targets',trigger.targets);
'step 1'
if(result.bool){
player.logSkill('xinfu_lingren',result.targets);
var target=result.targets[0];
event.target=target;
event.choice={
basic:false,
trick:false,
equip:false,
}
player.chooseButton(['凌人：猜测其有哪些类别的手牌',[['basic','trick','equip'],'vcard']],[0,3],true).set('ai',function(button){
switch(button.link[2]){
case 'basic':
var rand=0.95;
if(!target.countCards('h',{type:['basic']})) rand=0.05;
if(!target.countCards('h')) rand=0;
if(target.countCards('h')>0) return Math.random()<rand?true:false;
if(target.countCards('h')==0) return false;
case 'trick':
var rand=0.9;
if(!target.countCards('h',{type:['trick','delay']})) rand=0.1;
if(target.countCards('h')>0) return Math.random()<rand?true:false;
if(target.countCards('h')==0) return false;
case 'equip':
var rand=0.75;
if(!target.countCards('h',{type:['equip']})) rand=0.25;
if(target.countCards('h')>0) return Math.random()<rand?true:false;
if(target.countCards('h')==0) return false;
}
})
}
else{
player.storage.counttrigger.xinfu_lingren--;
event.finish();
}
'step 2'
if(result.bool){
var choices=result.links.map(i=>i[2]);
if(!event.isMine()&&!event.isOnline()) game.delayx();
var list=[];
event.num=0;
['basic','trick','equip'].forEach(type=>{
if(choices.contains(type)==target.hasCard(function(card){
return get.type2(card)==type;
},'h')) event.num++;
})
}
'step 3'
player.popup('猜对'+get.cnNumber(event.num)+'项');
game.log(player,'猜对了'+get.cnNumber(event.num)+'项');
if(event.num>0){
target.addTempSkill('lingren_adddamage');
target.storage.lingren={
card:trigger.card,
//player:event.targett,
}
}
if(event.num>1) player.draw(2);
if(event.num>2){
player.addTempSkill('lingren_jianxiong',{player:'phaseBegin'});
player.addTempSkill('lingren_xingshang',{player:'phaseBegin'});
}
},
ai:{
threaten:2.4,
},
};
/*滔乱*/
lib.skill.taoluan={
enable:"chooseToUse",
popup:false,
filter:function(event,player){
return !player.hasSkill('taoluan3')&&player.countCards('hes')>0;
},
hiddenCard:function(player,name){
return (!player.getStorage('taoluan').contains(name)&&player.countCards('hes')>0&&!player.hasSkill('taoluan3')&&lib.inpile.contains(name));
},
init:function(player){
if(!player.storage.taoluan) player.storage.taoluan=[];
},
onremove:true,
chooseButton:{
dialog:function(event,player){
var list=[];
for(var i=0;i<lib.inpile.length;i++){
var name=lib.inpile[i];
if(player.storage.taoluan.contains(name)) continue;
if(name=='sha'){
list.push(['基本','','sha']);
list.push(['基本','','sha','fire']);
list.push(['基本','','sha','thunder']);
list.push(['基本','','sha','ice']);
}
else if(get.type(name)=='trick') list.push(['锦囊','',name]);
else if(get.type(name)=='basic') list.push(['基本','',name]);
}
if(list.length==0){
return ui.create.dialog('滔乱已无牌可用');
}
return ui.create.dialog('滔乱',[list,'vcard']);
},
filter:function(button,player){
return _status.event.getParent().filterCard({
name:button.link[2]
},player,_status.event.getParent());
},
check:function(button){
if(_status.event.getParent().type!='phase') return 1;
var player=_status.event.player;
if(['wugu','zhulu_card','yiyi','lulitongxin','lianjunshengyan','diaohulishan'].contains(button.link[2])) return 0;
return player.getUseValue({
name:button.link[2],
nature:button.link[3],
});

},
backup:function(links,player){
return{
filterCard:true,
selectCard:1,
popname:true,
check:function(card){
return 6-get.value(card);
},
position:'hse',
viewAs:{
name:links[0][2],nature:links[0][3]
},
onuse:function(result,player){
player.logSkill('taoluan');
player.storage.taoluan.add(result.card.name);

},
}
},
prompt:function(links,player){
return '将一张牌当做'+(get.translation(links[0][3])||'')+get.translation(links[0][2])+'使用';
},
},
ai:{
fireAttack:true,
save:true,
respondSha:true,
respondShan:true,
skillTagFilter:function(player){
if(!player.countCards('hse')) return false;
},
order:4,
basic:{
useful:[6,4,3],
value:[6,4,3],
},
result:{
player:function(player){
if(_status.event.dying) return get.attitude(player,_status.event.dying);
return 1;
},
},
},
group:["taoluan_2"],
subSkill:{
2:{
trigger:{
player:["useCardAfter", "respondAfter"],
},
forced:true,
popup:false,
filter:function(event,player){
return event.skill=='taoluan_backup';
},
content:function(){
'step 0'
player.chooseTarget(true,function(card,player,target){
return target!=player;
},'滔乱<br><br><div class="text center">令一名其他角色选择一项：1.交给你一张与你以此法使用的牌类别相同的牌；2.你失去1点体力').set('ai',function(target){
var player=_status.event.player;
if(get.attitude(player,target)>0){
if(get.attitude(target,player)>0){
return target.countCards('he');
}
return target.countCards('he')/2;
}
return 0;
});
'step 1'
var target=result.targets[0];
event.target=target;
player.line(target,'green');
var type=get.type(trigger.card,'trick');
target.chooseCard('滔乱<br><br><div class="text center">交给'+get.translation(player)+'一张不为'+get.translation(type)+'牌的牌，或令其失去一点体力且滔乱无效直到回合结束','he',function(card,player,target){
return get.type(card,'trick')!=_status.event.cardType;
}).set('cardType',type).set('ai',function(card){
if(_status.event.att){
return 11-get.value(card);
}
return 0;
}).set('att',get.attitude(target,player)>0);
'step 2'
var target=event.target;
if(result.bool){
target.give(result.cards,player);
}
else{
player.addTempSkill('taoluan3');
var next=player.loseHp();
event.next.remove(next);
event.getParent('phase').after.push(next);
}
},
sub:true,
},
},
};
/*DIY文鸯 膂力*/
lib.skill.lvli={
audio:2,
init:function(player,skill){
player.storage[skill]=0;
},
enable:"chooseToUse",
filter:function(event,player){
if(player.storage.lvli>1) return false;
if(player.storage.lvli>0&&(player!=_status.currentPhase||!player.storage.choujue)) return false;
return true;
},
chooseButton:{
dialog:function(event,player){
var list=[];
for(var i=0;i<lib.inpile.length;i++){
var name=lib.inpile[i];
if(name=='sha'){
list.push(['基本','','sha']);
list.push(['基本','','sha','fire']);
list.push(['基本','','sha','thunder']);
}
else if(get.type(name)=='trick') list.push(['锦囊','',name]);
else if(get.type(name)=='basic') list.push(['基本','',name]);
}
return ui.create.dialog(event.lvli6?get.prompt('lvli'):'膂力',[list,'vcard']);
},
filter:function(button,player){
var evt=_status.event.getParent();
if(evt&&typeof evt.filterCard=='function') return evt.filterCard({name:button.link[2]},player,evt);
return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
},
check:function(button){
var player=_status.event.player;
if(player.countCards('h',button.link[2])) return 0;
if(_status.event.getParent().type!='phase'&&!_status.event.getParent().lvli6) return 1;
return player.getUseValue({name:button.link[2]});
},
backup:function(links,player){
return {
filterCard:function(){return false;},
audio:'lvli',
selectCard:-1,
check:function(card){
return 1;
},
viewAs:{name:links[0][2],nature:links[0][3],isCard:true},
}
},
prompt:function(links,player){
return '请选择'+(get.translation(links[0][3])||'')+get.translation(links[0][2])+'的目标';
},
},
ai:{
fireAttack:true,
save:true,
respondSha:true,
respondShan:true,
skillTagFilter:function(player){
if(!player.countCards('hse')) return false;
},
order:10,
basic:{
useful:[6,4,3],
value:[6,4,3],
},
result:{
player:function(player){
if(_status.event.type=='dying'){
return get.attitude(player,_status.event.dying);
}
else{
return 1;
}
},
},
},
group:["lvli2","lvli3","lvli6"],
};
lib.skill.dawu={
trigger:{
player:"phaseJieshuBegin",
},
direct:true,
filter:function(event,player){
return player.getExpansions('qixing').length;
},
audio:2,
content:function(){
"step 0"
var num=Math.min(game.countPlayer(),player.getExpansions('qixing').length);
player.chooseTarget(get.prompt('dawu'),'令至多'+get.cnNumber(num)+'名角色获得“大雾”标记',
[1,num]).set('ai',function(target){
if(target.isMin()) return 0;
if(target.hasSkill('biantian2')) return 0;
var att=get.attitude(player,target);
if(att>=4){
if(target.hp>2&&!target.getDamagedHp()) return 0;
if(target.hp>=3&&target.hasSkillTag("maixie")) return 0;
if(_status.event.allUse) return att;
if(target.hp==1) return att;
if(target.hp==2&&target.countCards('he')<=2) return att*0.7;
return 0;
}
return -1;
}).set('allUse',player.getExpansions('qixing').length>=game.countPlayer(function(current){
return get.attitude(player,current)>4;
})*2);
"step 1"
if(result.bool){
player.logSkill('dawu',result.targets,'thunder');
var length=result.targets.length;
for(var i=0;i<length;i++){
result.targets[i].addSkill('dawu2');
}
player.chooseCardButton('选择弃置'+get.cnNumber(length)+'张“星”',length,player.getExpansions('qixing'),true);
player.addSkill('dawu3');
}
else{
event.finish();
}
"step 2"
player.loseToDiscardpile(result.links);
},
ai:{
combo:"qixing",
},
};
//袁姬 蒙斥
lib.skill.dcmengchi={
audio:2,
trigger:{
player:["linkBefore","damageEnd"],
},
forced:true,
filter:function(event,player){
var num=player.getStat('gain');
if(num&&num>0) return false;
if(event.name=='link') return !player.isLinked();
return !event.nature;
},
content:function(){
if(trigger.name=='link') trigger.cancel();
else player.recover();
},
ai:{
filterDamage:true,
effect:{
target:function(card,player,target,current){
if(!target.hasFriend()) return;
if(target.getStat('gain')) return;
if(get.tag(card,'natureDamage')) return;
if(target.hp==1) return 0.75;
if(card.name=='sha'&&!player.hasSkill('jiu')||target.hasSkillTag('filterDamage',null,{
player:player,
card:card,
})) return [1,0.75+0.25*target.hp];
},
},
},
mod:{
cardEnabled:function(card,player){
if(!player.getStat('gain')) return false;
},
cardSavable:function(card,player){
if(!player.getStat('gain')) return false;
},
},
};
/*讽言*/
lib.skill.dcfengyan={
enable:"phaseUse",
usable:2,
chooseButton:{
dialog:function(event,player){
var dialog=ui.create.dialog('讽言：请选择一项','hidden');
dialog.add([[
['gain','令一名体力值不大于你的其他角色交给你一张手牌'],
['sha','视为对一名手牌数不大于你的其他角色使用一张【杀】']
],'textbutton']);
return dialog;
},
filter:function(button,player){
return !player.hasSkill('dcfengyan_'+button.link,null,null,false);
},
check:function(button){
var player=_status.event.player;
if(button.link=='gain'&&game.hasPlayer(function(current){
return lib.skill.dcfengyan_gain.filterTarget(null,player,current)&&get.effect(current,'dcfengyan_gain',player,player)>0;
})) return 4;
if(button.link=='sha'&&game.hasPlayer(function(current){
return lib.skill.dcfengyan_sha.filterTarget(null,player,current)&&get.effect(current,'dcfengyan_sha',player,player)>0;
})) return 4;
return 2;
},
backup:function(links){
return get.copy(lib.skill['dcfengyan_'+links[0]]);
},
prompt:function(links){
if(links[0]=='gain') return '令一名体力值不大于你的其他角色交给你一张手牌';
return '视为对一名手牌数不大于你的其他角色使用【杀】';
},
},
ai:{
order:10,
threaten:1.7,
result:{
player:0.1,
target:-1,
},
},
subSkill:{
backup:{
audio:"dcfengyan",
sub:true,
},
gain:{
audio:"dcfengyan",
filterTarget:function(card,player,target){
return target!=player&&target.hp<=player.hp&&target.countCards('h')>0;
},
filterCard:()=>false,
selectCard:-1,
charlotte:true,
content:function(){
'step 0'
player.addTempSkill('dcfengyan_gain','phaseUseAfter');
target.chooseCard('h',true,'交给'+get.translation(player)+'一张牌');
'step 1'
if(result.bool) target.give(result.cards,player);
},
ai:{
tag:{
loseCard:1,
gain:1,
},
result:{
player:0.1,
target:-1,
},
},
sub:true,
},
sha:{
audio:"dcfengyan",
filterTarget:function(card,player,target){
return target!=player&&target.countCards('h')<=player.countCards('h')&&player.canUse('sha',target,false);
},
filterCard:()=>false,
selectCard:-1,
charlotte:true,
content:function(){
player.addTempSkill('dcfengyan_sha','phaseUseAfter');
player.useCard({
name:'sha',
isCard:true,
},target,false);
},
ai:{
result:{
player:function(player,target){
return get.effect(target,{
name:'sha',
isCard:true,
},player,player);
},
},
},
sub:true,
},
},
};
/*王荣 丰姿*/
lib.skill.olfengzi={
audio:2,
trigger:{
player:"useCard",
},
direct:true,
usable:1,
filter:function(event,player){
if(event.olfengzi_buff||!event.targets.length||!player.isPhaseUsing()||player.hasSkill('olfengzi_buff')) return false;
var type=get.type(event.card,false);
if(type!='basic'&&type!='trick') return false;
return player.hasCard(function(i){
if(_status.connectMode) return true;
return get.type2(i,player)==type;
},'h');
},
content:function(){
'step 0'
if(player!=game.me&&!player.isUnderControl()&&!player.isOnline()) game.delayx();
var type=get.type(trigger.card,false);
player.chooseToDiscard('h',get.prompt('olfengzi'),'弃置一张'+get.translation(type)+'牌，令'+get.translation(trigger.card)+'结算两次',function(card,player){
return get.type2(card,player)==_status.event.type;
}).set('type',type).set('ai',function(card){
if(get.value(trigger.card)<=7) return false;
if(trigger.card.name=='tiesuo'||trigger.card.name=='huogong'||trigger.card.name=='shunshou'||trigger.card.name=='guohe') return false;
return 8-get.value(card);
}).logSkill='olfengzi';
'step 1'
if(result.bool){
player.addTempSkill('olfengzi_buff','phaseUseAfter');
trigger.olfengzi_buff=player;
}
else player.storage.counttrigger.olfengzi--;
},
subSkill:{
buff:{
trigger:{
global:"useCardToTargeted",
},
forced:true,
charlotte:true,
popup:false,
lastDo:true,
filter:function(event,player){
return (event.parent.olfengzi_buff==player&&event.targets.length==event.parent.triggeredTargets4.length);
},
content:function(){
trigger.getParent().targets=trigger.getParent().targets.concat(trigger.targets);
trigger.getParent().triggeredTargets4=trigger.getParent().triggeredTargets4.concat(trigger.targets);
},
onremove:function(player){
delete player.storage.counttrigger.olfengzi;
},
sub:true,
},
},
};
lib.skill.xinkuangfu={
enable:"phaseUse",
usable:1,
audio:2,
delay:false,
filterTarget:function(card,player,target){
if(player==target) return player.countCards('e',function(card){
return lib.filter.cardDiscardable(card,player);
})>0;
return target.countDiscardableCards(player,'e')>0;
},
filter:function(event,player){
return game.hasPlayer(function(current){
return current.countCards('e')>0;
});
},
content:function(){
'step 0'
if(player==target) player.chooseToDiscard('e',true);
else player.discardPlayerCard(target,'e',true);
'step 1'
player.chooseUseTarget('sha',true,false,'nodistance');
'step 2'
var bool=game.hasPlayer2(function(current){
return current.getHistory('damage',function(evt){
return evt.getParent(4)==event;
}).length>0
});
if(player==target&&bool) player.draw(2);
else if(player!=target&&!bool) player.chooseToDiscard('h',2,true);
},
ai:{
order:function(){
return get.order({name:'sha'})+0.3;
},
result:{
target:function(player,target){
var att=get.attitude(player,target);
var max=0;
var min=1;
target.countCards('e',function(card){
var val=get.value(card,target);
if(val>max) max=val;
if(val<min) min=val;
});
if(att>0&&min<=0) return target.hasSkillTag('noe')?3:1;
if(att<0&&max>0){
if(target.hasSkillTag('noe')) return max>6?(-max/3):0;
return -max;
}
var cxdr=game.countPlayer(function(current){
return current.hp==1&&player.inRange(current)&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&get.attitude(current,player)<0;
});
if(player.countCards('e')>0&&(player.countCards('hs')<=1||player.countCards('hs',{name:'sha'})<=0||cxdr>0)&&target==player){
return 1;
}
return 0;
},
},
},
};
//神荀彧
lib.skill.tianzuo = {
audio:2,
trigger:{
global:"phaseBefore",
player:"enterGame",
},
forced:true,
filter:function(event,player){
return (event.name!='phase'||game.phaseNumber==0)&&!lib.inpile.contains('qizhengxiangsheng');
},
content:function(){
game.addGlobalSkill('tianzuo_global');
for(var i=2;i<10;i++){
var card=game.createCard2('qizhengxiangsheng',i%2?'club':'spade',i);
ui.cardPile.insertBefore(card,ui.cardPile.childNodes[get.rand(0,ui.cardPile.childNodes.length)]);
}
game.broadcastAll(function(){lib.inpile.add('qizhengxiangsheng')});
game.updateRoundNumber();
},
ai:{
effect:{
target:function(card,player,target){
if(get.name(card)=='qizhengxiangsheng'){ 
if(get.attitude(player,target)<=0) return [0,1,0,-10];
return [0,1,0,0];
}
},
},
},
group:"tianzuo_remove",
subSkill:{
remove:{
audio:"tianzuo",
trigger:{
target:"useCardToBefore",
},
forced:true,
priority:15,
filter:function(event,player){
return event.card&&event.card.name=='qizhengxiangsheng';
},
content:function(){
trigger.cancel();
},
ai:{
target:function(card,player,target){
if(card&&card.name=='qizhengxiangsheng') return 'zerotarget';
},
},
sub:true,
},
global:{
trigger:{
player:"useCardToPlayered",
},
forced:true,
popup:false,
filter:function(event,player){
return event.card.name=='qizhengxiangsheng';
},
content:function(){
'step 0'
var target=trigger.target;
event.target=target;
player.chooseControl('奇兵','正兵').set('prompt','请选择'+get.translation(target)+'的标记').set('choice',function(){
var e1=1.5*get.sgn(get.damageEffect(target,player,target));
var e2=0;
if(target.countGainableCards(player,'h')>0&&!target.hasSkillTag('noh')) e2=-1;
var es=target.getGainableCards(player,'e');
if(es.length) e2=Math.min(e2,function(){
var max=0;
for(var i of es) max=Math.max(max,get.value(i,target))
return -max/4;
}());
if(Math.abs(e1-e2)<=0.3) return Math.random()<0.5?'奇兵':'正兵';
if(e1<e2) return '奇兵';
return '正兵';
}()).set('ai',function(){
return _status.event.choice;
});
'step 1'
var map=trigger.getParent().customArgs,id=target.playerid;
if(!map[id]) map[id]={};
map[id].qizheng_name=result.control;
},
sub:true,
},
rewrite:{
audio:"tianzuo",
trigger:{
global:"useCardToTargeted",
},
filter:function(event,player){
return event.card.name=='qizhengxiangsheng';
},
logTarget:"target",
"prompt2":"观看其手牌并修改“奇正相生”标记",
content:function(){
'step 0'
var target=trigger.target;
event.target=target;
if(player!=target&&target.countCards('h')>0) player.viewHandcards(target);
player.chooseControl('奇兵','正兵').set('prompt','请选择'+get.translation(target)+'的标记').set('choice',function(){
var shas=target.getCards('h','sha'),shans=target.getCards('h','shan');
var e1=1.5*get.sgn(get.damageEffect(target,player,target));
var e2=0;
if(target.countGainableCards(player,'h')>0&&!target.hasSkillTag('noh')) e2=-1;
var es=target.getGainableCards(player,'e');
if(es.length) e2=Math.min(e2,function(){
var max=0;
for(var i of es) max=Math.max(max,get.value(i,target))
return -max/4;
}());
if(get.attitude(player,target)>0){
if(shas.length>=Math.max(1,shans.length)) return '奇兵';
if(shans.length>shas.length) return '正兵';
return e1>e2?'奇兵':'正兵';
}
if(shas.length) e1=-0.5;
if(shans.length) e2=-0.7;
if(Math.abs(e1-e2)<=0.3) return Math.random()<0.5?'奇兵':'正兵';
var rand=Math.random();
if(e1<e2) return rand<0.1?'奇兵':'正兵';
return rand<0.1?'正兵':'奇兵';
}()).set('ai',()=>(_status.event.choice));
'step 1'
var map=trigger.getParent().customArgs,id=target.playerid;
if(!map[id]) map[id]={};
map[id].qizheng_name=result.control;
map[id].qizheng_aibuff=get.attitude(player,target)>0;
},
sub:true,
},
},
};
lib.skill.lingce.ai={
threaten:4.2,
effect:{
target:function(card,player,target){
var numf=game.countPlayer(function(current){
return target.getFriends().contains(current);
});
var nume=game.countPlayer(function(current){
return player.getFriends().contains(current);
});
if(get.attitude(player,target)<0){
if(numf>0||nume>0){
if(!target.getStorage('dinghan').contains(card.name)){
if(get.type(card)=='delay'){
if(player.countCards('hs',{name:card.name})>1)return [1,0,1,0];
return [0.01,0,0,0];
}
if(get.type(card)=='trick'&&get.name(card)!='wugu'){
if(player.countCards('hs',{name:card.name})>1)return [1,0,1,0];
return [0.2,0,0,0];
}
}
}
if(nume==0&&numf==0){
if(get.type(card)=='trick'||get.type(card)=='delay'&&get.name(card)!='wugu'){
if(!target.getStorage('dinghan').contains(card.name)){
if(player.countCards('hs',{name:card.name})>1){
return [1,0.5,1,0];
}
return [0,1,0,0];
}
if(target.getStorage('dinghan').contains(card.name)){
return [1,1,1,0];
}
}
}
}
},
},
};
//神马超
lib.skill.shouli = {
audio:2,
mod:{
cardUsable:function(card){
if(card.storage&&card.storage.shouli) return Infinity;
},
},
enable:["chooseToUse","chooseToRespond"],
hiddenCard:function(player,name){
if(player!=_status.currentPhase&&(name=='sha'||name=='shan')) return true;
},
filter:function(event,player){
if(event.responded||event.shouli||event.type=='wuxie') return false;
if(game.hasPlayer(function(current){
return current.getEquip(4);
})&&event.filterCard({
name:'sha',
storage:{shouli:true},
},player,event)) return true;
if(game.hasPlayer(function(current){
return current.getEquip(3);
})&&event.filterCard({
name:'shan',
storage:{shouli:true},
},player,event)) return true;
return false;
},
delay:false,
locked:true,
filterTarget:function(card,player,target){
var event=_status.event,evt=event;
if(event._backup) evt=event._backup;
var equip3=target.getEquip(3);
var equip4=target.getEquip(4);
if(equip3&&evt.filterCard(get.autoViewAs({
name:'shan',
storage:{shouli:true},
},[equip3]),player,event)) return true;
var sha=get.autoViewAs({
name:'sha',
storage:{shouli:true},
},[equip4]);
if(equip4&&evt.filterCard(sha,player,event)){
if(!evt.filterTarget) return true;
return game.hasPlayer(function(current){
return evt.filterTarget(sha,player,current);
})
};
return false;
},
prompt:"将场上的一张坐骑牌当做【杀】或【闪】使用或打出",
content:function(){
'step 0'
var evt=event.getParent(2);
evt.set('shouli',true);
var list=[];
var equip3=target.getEquip(3);
var equip4=target.getEquip(4);
var backupx=_status.event;
_status.event=evt;
try{
if(equip3){
var shan=get.autoViewAs({
name:'shan',
storage:{shouli:true},
},[equip3]);
if(evt.filterCard(shan,player,event)) list.push('shan');
}
if(equip4){
var sha=get.autoViewAs({
name:'sha',
storage:{shouli:true},
},[equip4]);
if(evt.filterCard(sha,player,evt)&&(!evt.filterTarget||game.hasPlayer(function(current){
return evt.filterTarget(sha,player,current);
}))) list.push('sha');
};
}catch(e){game.print(e)};
_status.event=backupx;
if(list.length==1) event._result={
bool:true,
links:[list[0]=='shan'?equip3:equip4],
}
else player.choosePlayerCard(true,target,'e').set('filterButton',function(button){
var type=get.subtype(button.link);
return type=='equip3'||type=='equip4';
});
'step 1'
var evt=event.getParent(2);
if(result.bool&&result.links&&result.links.length){
var name=get.subtype(result.links[0])=='equip3'?'shan':'sha';
if(evt.name=='chooseToUse'){
game.broadcastAll(function(result,name){
lib.skill.shouli_backup.viewAs={
name:name,
cards:[result],
storage:{shouli:true},
};
lib.skill.shouli_backup.prompt=('选择'+get.translation(name)+'（'+get.translation(result)+'）的目标');
},result.links[0],name);
if(player!=target) target.addTempSkill('fengyin');
target.addTempSkill('shouli_thunder');
player.addTempSkill('shouli_thunder');
evt.set('_backupevent','shouli_backup');
evt.backup('shouli_backup');
evt.set('openskilldialog','选择'+get.translation(name)+'（'+get.translation(result.links[0])+'）的目标');
evt.set('norestore',true);
evt.set('custom',{
add:{},
replace:{window:function(){}}
});
}
else{
delete evt.result.skill;
delete evt.result.used;
evt.result.card=get.autoViewAs({
name:name,
cards:[result],
storage:{shouli:true},
},result.links);
evt.result.cards=[result.links[0]];
target.$give(result.links[0],player,false);
if(player!=target) target.addTempSkill('fengyin');
target.addTempSkill('shouli_thunder');
player.addTempSkill('shouli_thunder');
evt.redo();
return;
}
}
evt.goto(0);
},
ai:{
respondSha:true,
respondShan:true,
skillTagFilter:function(player,tag){
var subtype=(tag=='respondSha'?'equip4':'equip3');
return game.hasPlayer(function(current){
return current.getEquip(subtype);
});
},
order:function(item,player){
for(var i=0;i<game.players.length;i++){
var current=game.players[i];
if(_status.currentPhase!=player&&get.attitude(player,_status.currentPhase)<0){
if(get.translation(_status.event=="杀")){
if((_status.currentPhase.getEquip('guanshi')&&_status.currentPhase.countCards('hes')>4)
||(_status.currentPhase.getEquip('qinglong')&&_status.currentPhase.countCards('h',{name:'sha'})>(player.countCards('h',{name:'shan'})+current.countCards('e',function(card){return get.subtype(card)=='equip3'})))
||(_status.currentPhase.getEquip('zhuge')&&_status.currentPhase.countCards('h',{name:'sha'})>(player.countCards('h',{name:'shan'})+current.countCards('e',function(card){return get.subtype(card)=='equip3'})))) return 0;
}
if(get.translation(_status.event=="决斗")){
if(_status.currentPhase.countCards('h',{name:'sha'})>(player.countCards('h',{name:'sha'})+current.countCards('e',function(card){return get.subtype(card)=='equip4'}))) return 0;
return 1;
} 
} 
if(get.translation(_status.event!="决斗")&&_status.currentPhase==player&&!player.hasCard('wuzhong')&&!player.hasCard(function(card){return get.type(card)=='trick'&&player.hasUseTarget(card)&&!get.tag(card,'damage')&&get.name(card)!='wugu'&&get.name(card)!='wuxie'}))return 45; 
return 1;
}
},
result:{
player:function(player,target){
var att=get.attitude(player,target);
var eff=Math.max(0,get.effect(target,get.autoViewAs({name:'sha'},['equip4']),player,player));
if(_status.event.type!='phase') return 11-att;
if(!player.hasValueTarget({name:'sha'})) return 0;
if(_status.event.type=='phase'){
if(player.hasValueTarget({name:'sha'})&&
game.hasPlayer(function(current){return get.attitude(player,current)<0&&current.hp<=2&&current.hasSkill('shouli_thunder')&&!player.hasCard(function(card){
return get.tag(card,'damage')&&player.hasUseTarget(card);
})})) return 15-att+3*eff;
return 9-att+3*eff;
} 
},
},
},
group:"shouli_init",
subSkill:{
thunder:{
charlotte:true,
trigger:{
player:"damageBegin1",
},
forced:true,
mark:true,
content:function(){
trigger.num++;
trigger.nature='thunder';
},
marktext:"⚡",
intro:{
content:"受到的伤害+1且改为雷属性",
},
sub:true,
},
init:{
trigger:{
global:"phaseBefore",
player:"enterGame",
},
forced:true,
filter:function(event,player){
return event.name!='phase'||game.phaseNumber==0;
},
logTarget:()=>game.filterPlayer(),
content:function(){
'step 0'
var targets=game.filterPlayer().sortBySeat(player.getNext());
event.targets=targets;
event.num=0;
'step 1'
var target=event.targets[num];
if(target.isIn()){
var card=get.cardPile2(function(card){
if(get.cardtag(card,'gifts')) return false;
var type=get.subtype(card);
if(type!='equip3'&&type!='equip4'&&type!='equip6') return false;
return target.canUse(card,target);
});
if(card) target.chooseUseTarget(card,'nopopup','noanimate',true);
}
event.num++;
if(event.num<targets.length) event.redo();
},
audio:"shouli",
sub:true,
},
},
};
lib.skill.hengwu = {
audio:2,
trigger:{
player:["useCard","respond"],
},
frequent:true,
filter:function(event,player){
var suit=get.suit(event.card);
if(!lib.suit.contains(suit)||player.hasCard(function(card){
return get.suit(card,player)==suit;
},'h')) return false;
return game.hasPlayer(function(current){
return current.hasCard(function(card){
return get.suit(card,current)==suit;
},'e')
})
},
content:function(){
var suit=get.suit(trigger.card);
player.draw(game.countPlayer(function(current){
return current.countCards('e',function(card){
return get.suit(card,current)==suit;
});
}));
},
mod:{
aiUseful:function(player,card,num){
var suit=get.suit(card);
var es=game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==suit})}); 
var hs=player.getCards('h');
if(player.hp>2){
//杀
for(var i=0;i<hs.length;i++){
if(!game.hasPlayer(function(current){return current.hasCard(function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])},'e')}))continue;
if(get.name(hs[i])!='sha')continue;
var shu=game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})
var max=0;
var list=[];
for(var j=1;j<shu.length;j++){
if(shu[j]>max){
max=shu[j];
}
}
if(game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})==max) list.add(i);
var list=list.sort(function(a,b){return get.number(b)-get.number(a)});
var ka=list[0];
if(card==ka)return num+(5*es);
if(player.hasCard(ka)&&card.name=='sha'&&get.suit(ka)==suit&&card!=ka)return num-20;
}
//闪
for(var i=0;i<hs.length;i++){
if(!game.hasPlayer(function(current){return current.hasCard(function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])},'e')}))continue;
if(get.name(hs[i])!='shan')continue;
var shu=game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})
var max=0;
var list=[];
for(var j=1;j<shu.length;j++){
if(shu[j]>max){
max=shu[j];
}
}
if(game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})==max) list.add(i);
var list=list.sort(function(a,b){return get.number(b)-get.number(a)});
var ka=list[0];
if(card==ka)return num+(3*es);
if(player.hasCard(ka)&&card.name=='shan'&&get.suit(ka)==suit&&card!=ka)return num-20;
}
//桃
for(var i=0;i<hs.length;i++){
if(!game.hasPlayer(function(current){return current.hasCard(function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])},'e')}))continue;
if(get.name(hs[i])!='tao')continue;
var shu=game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})
var max=0;
var list=[];
for(var j=1;j<shu.length;j++){
if(shu[j]>max){
max=shu[j];
}
}
if(game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})==max) list.add(i);
var list=list.sort(function(a,b){return get.number(b)-get.number(a)});
var ka=list[0];
if(card==ka)return num+(4*es);
if(player.hasCard(ka)&&card.name=='tao'&&get.suit(ka)==suit&&card!=ka&&!game.hasPlayer(function(current){return current!=player&&get. attitude(player,current)>0&&current.hp<3}))return num-20;
if(player.hasCard(ka)&&card.name=='tao'&&get.suit(ka)==suit&&card!=ka&&game.hasPlayer(function(current){return current!=player&&get. attitude(player,current)>0&&current.hp<3}))return num+10;
}
//酒
for(var i=0;i<hs.length;i++){
if(!game.hasPlayer(function(current){return current.hasCard(function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])},'e')}))continue;
if(get.name(hs[i])!='jiu')continue;
var shu=game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})
var max=0;
var list=[];
for(var j=1;j<shu.length;j++){
if(shu[j]>max){
max=shu[j];
}
}
if(game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})==max) list.add(i);
var list=list.sort(function(a,b){return get.number(b)-get.number(a)});
var ka=list[0];
if(card==ka)return num+(4*es);
if(player.hasCard(ka)&&card.name=='jiu'&&get.suit(ka)==suit&&card!=ka)return num-20;
}
//无懈
for(var i=0;i<hs.length;i++){
if(!game.hasPlayer(function(current){return current.hasCard(function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])},'e')}))continue;
if(get.name(hs[i])!='wuxie')continue;
var shu=game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})
var max=0;
var list=[];
for(var j=1;j<shu.length;j++){
if(shu[j]>max){
max=shu[j];
}
}
if(game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==get.suit(hs[i])})})==max) list.add(i);
var list=list.sort(function(a,b){return get.number(b)-get.number(a)});
var ka=list[0];
if(card==ka)return num+(4*es);
if(player.hasCard(ka)&&card.name=='wuxie'&&get.suit(ka)==suit&&card!=ka)return num-20;
}
}
},
aiOrder:function(player,card,num){
var suit=get.suit(card);
var hs=player.countCards('h',function(cardx){return get.suit(cardx)==suit});
var es=game.countPlayer(function(current){return current.countCards('e',function(cardx){return cardx!=card&&get.suit(cardx,current)==suit})});
var canusek=player.getCards('h',function(cardx){return get.type(cardx)=='trick'||get.type(cardx)=='delay'});
if(get.type(card)=='equip'){
var stp=get.subtype(card);
if(!player.getEquip(stp)) return num+50;
}
if(game.hasPlayer(function(current){return current.hasCard(function(cardx){return cardx!=card&&get.suit(cardx,current)==suit},'e')})){
if(hs==1){
if(get.name(card)=='sha'){
if(player.getEquip('zhuge')||player.getEquip('qinglong')) return num+(2*es);
return num+0.1;
}
if(get.name(card)!='sha'||get.name(card)!='jiu') return num+(7*es);
}
if(get.name(card)=='jiu'){
if(hs==1) return num+(3*es);
if(player.hasCard('sha'))return get.order({name:'sha'})+0.4;
}
if(!['tao','shan','wuxie','jiu','sha'].contains(card.name)){
if(player.hasCard(function(cardx){return 
cardx!=card&&get.suit(cardx)==suit&&
(get.name(cardx)!='tao'
&&get.name(cardx)!='shan'
&&get.name(cardx)!='wuxie'
)},'h')){
if((player.countCards('h',function(cardx){return cardx!=card&&get.suit(cardx)==suit&&get.name(cardx)=='jiu'})==0
||(player.countCards('h',function(cardx){return cardx!=card&&get.suit(cardx)==suit&&get.name(cardx)=='jiu'})==1&&player.countUsed('jiu',true)==0))
||(player.countCards('h',function(cardx){return cardx!=card&&get.suit(cardx)==suit&&get.name(cardx)=='sha'})==0
||(player.countCards('h',function(cardx){return cardx!=card&&get.suit(cardx)==suit&&get.name(cardx)=='sha'})==1&&player.countUsed('sha',true)==0))
){
if(get.effect(target,card,player,player)>=0&&!player.hasCard(function(cardx){return cardx!=card&&get.suit(cardx)==suit&&get.effect(target,cardx,player,player)<0},'h')){
if(get.type(card)=='equip')return num+(15*es/hs);
return num+(7*es/hs);
}
}
}
}
}
},
},
ai:{
effect:{
player:function(card,player,target){
var suit=get.suit(card);
var hs=player.countCards('h',function(cardx){return get.suit(cardx)==suit});
var sd=game.countPlayer(function(current){return (current.hasSkillTag('rejudge')&&get.attitude(current,player)<0)});
var canusek=player.getCards('h',function(cardx){return get.suit(cardx)==suit});
/*if(game.hasPlayer(function(current){return current.getEquip('tengjia')&&get.attitude(player,current)<0})&&card.name=='zhuque') return [1,5];*/
if(game.hasPlayer(function(current){return get.attitude(player,current)<=0&&current.hasSkill('shouli_thunder')})){
if(get.tag(card,'damage')) {
if(player.inRange(target)){
if(target.hasSkill('shouli_thunder')&&get.attitude(player,target)<=0){
if(!target.hasSkillTag('nodamage'&&'filterDamage'&&'nothunder')) return [2,4,2,-4];
if(target.hasSkillTag('nodamage'||'nothunder')) return "zeroplayertarget";
}
if(!target.hasSkill('shouli_thunder')){
if(!game.hasPlayer(function(current){return current.hasSkill('shouli_thunder')&&!current.hasSkillTag('nodamage'||'filterDamage'||'nothunder')})) return "zeroplayertarget";
return [1,0,1,0];
}
}
}
}
if(game.hasPlayer(function(current){return current.hasCard(function(cardx){return cardx!=card&&get.suit(cardx,current)==suit},'e')})){
if(get.type(card)=='equip'){
var stp=get.subtype(card);
if(player.getEquip(stp)&&!player.hasCard(function(card){return card==canusek&&!player.hasUseTarget(card)})){
if(get.subtype(card)=='equip1'){
if(player.getEquip('zhuge')&&(player.hasValueTarget({name:'sha'})||player.hasCard('wuzhong'))) return "zeroplayertarget";
if(card.name=='zhuge'&&!game.hasPlayer(function(current){
return get.distance(player,current)<=1&&player.canUse('sha',current)&&get.effect(current,{name:'sha'},player,player)>0;
})) return "zeroplayertarget";
}
return[1,5];
}
return [0,0];
}
if(card.name=='jiu'&&hs==1) return [1,2];
if(card.name=='tiesuo'&&hs==1) return [2,0,2,0];
if(card.name=='shandian'){
if(sd==0&&hs==1) return [1,1];
return [0,-2,0,0];
}
}
},
target:function(card,player,target){
if(card.name=='sha'&&!player.hasSkillTag("directHit_ai",true,{
target:target,
card:card,
},true)){
if(game.hasPlayer(function(current){return current.hasCard(function(cardx){return get.subtype(cardx)=='equip3'},'e')})) return[0,-0.5];
}
},
},
},
};
lib.skill.shouli_backup={
sourceSkill:'shouli',
precontent:function(){
delete event.result.skill;
var cards=event.result.card.cards;
event.result.cards=cards;
var owner=get.owner(cards[0]);
event.target=owner;
owner.$give(cards[0],player,false);
player.popup(event.result.card.name,'metal');
game.delayx();
event.getParent().addCount=false;
},
filterCard:function(){return false},
prompt:'请选择【杀】的目标',
selectCard:-1,
};
//曹髦
//潜龙
lib.skill.qianlong = {
audio:2,
trigger:{
player:"damageEnd",
},
frequent:true,
content:function(){
'step 0'
var cards=get.cards(3);
event.cards=cards;
game.cardsGotoOrdering(cards);
//展示牌
game.log(player,'展示了',event.cards);
event.videoId=lib.status.videoId++;
game.broadcastAll(function(player,id,cards){
if(player==game.me||player.isUnderControl()) return;
var str=get.translation(player)+'发动了【潜龙】';
var dialog=ui.create.dialog(str,cards);
dialog.videoId=id;
},player,event.videoId,event.cards);
game.addVideo('showCards',player,[get.translation(player)+'发动了【潜龙】',get.cardsInfo(event.cards)]);
if(player!=game.me&&!player.isUnderControl()&&!player.isOnline()) game.delay(2);
//选牌
var next=player.chooseToMove('潜龙：获得至多'+get.cnNumber(Math.min(3,player.getDamagedHp()))+'张牌并将其余牌置于牌堆底');
next.set('list',[
['置于牌堆底',cards],
['自己获得'],
])
next.set('filterMove',function(from,to,moved){
if(moved[0].contains(from.link)){
if(typeof to=='number'){
if(to==1){
if(moved[1].length>=_status.event.player.getDamagedHp()) return false;
}
return true;
}
}
return true;
});
next.set('processAI',function(list){
var cards=list[0][1].slice(0),player=_status.event.player;
cards.sort(function(a,b){
return get.value(b,player)-get.value(a,player);
});
if(player.hasCard('sha')&&player.storage.juetao==false){
var gain,bottom=[];
var pai=cards.filter(function(card){return card.name!='sha'});
if(pai.length<=player.getDamagedHp()){
var gain=pai;
}else{
pai.sort(function(a,b){
return get.value(b,player)-get.value(a,player);
});
var gain=pai.splice(0,player.getDamagedHp());
var bottom=bottom.push(pai);
}
return [bottom,gain];
}else{
return [cards,cards.splice(0,_status.event.player.getDamagedHp())];
}
});
'step 1'
game.broadcastAll('closeDialog',event.videoId);
game.addVideo('cardDialog',null,event.videoId);
var moved=result.moved;
if(moved[0].length>0){
for(var i of moved[0]){
i.fix();
ui.cardPile.appendChild(i);
}
}
if(moved[1].length>0) player.gain(moved[1],'gain2');
},
ai:{
maixie:true,
"maixie_hp":true,
effect:{
target:function(card,player,target){
if(get.tag(card,'damage')){
if(player.hasSkillTag('jueqing',false,target)) return;
if(!target.hasFriend()) return;
var num=1;
if(!player.needsToDiscard()&&target.isDamaged()){
num=0.7;
}
else{
num=0.5;
}
if(target.hp>=4) return [1,num*2];
if(target.hp==3) return [1,num*1.5];
if(target.hp==2) return [1,num*0.5];
}
},
},
},
};
//决讨
lib.skill.juetao = {
audio:2,
trigger:{
player:"phaseUseBegin",
},
direct:true,
limited:true,
skillAnimation:true,
animationColor:"thunder",
filter:function(event,player){
return player.hp==1;
},
content:function(){
'step 0'
player.chooseTarget(get.prompt2('juetao'),lib.filter.notMe).set('ai',function(target){
var att=get.attitude(_status.event.player,target);
if(att<0){
if(!target.hasSkillTag('nodamage')){
if(target.getEquip('tengjia')) return -att;
if(target.getEquip('bagua')) return 6-att;
if(target.getEquip('renwang')) return 4-att; 
if(!target.getEquip(2)||target.getEquip('baiyin'||'rewrite_baiyin')) return 10-att;
return 3-att;
}else{
return 0.5;
} 
}else{
return 0;
} 
});
'step 1'
if(result.bool){
var target=result.targets[0];
event.target=target;
player.logSkill('juetao',target);
player.awakenSkill('juetao');
}
else event.finish();
'step 2'
var card=get.bottomCards()[0];
game.cardsGotoOrdering(card);
player.showCards(card);
player.chooseUseTarget(card,true,false,'nodistance').set('filterTarget',function(card,player,target){
var evt=_status.event;
if(_status.event.name=='chooseTarget') evt=evt.getParent();
if(target!=player&&target!=evt.juetao_target) return false;
return lib.filter.targetEnabledx(card,player,target);
}).set('juetao_target',target);
'step 3'
if(result.bool&&target.isIn()) event.goto(2);
},
mark:true,
intro:{
content:"limited",
},
init:function(player,skill){
player.storage[skill]=false;
},
};
/*神甘宁 劫营*/
lib.skill.drlt_jieying={
audio:2,
locked:false,
ai:{
effect:{
player:function(card,player,target){
if(get.name(card)=='lebu'&&get.attitude(player,target)<0) return target.countCards('h')*0.8+target.getHandcardLimit()*0.7;
},
},
},
global:'drlt_jieying_mark',
group:["drlt_jieying_1","drlt_jieying_2","drlt_jieying_3"],
subSkill:{
'1':{
audio:'drlt_jieying',
trigger:{
player:'phaseZhunbeiBegin'
},
forced:true,
filter:function(event,player){
return !game.hasPlayer(function(current){
return current.hasMark('drlt_jieying_mark');
});
},
content:function(){
player.addMark('drlt_jieying_mark',1);
},
},
'2':{
audio:'drlt_jieying',
trigger:{
player:"phaseJieshuBegin",
},
direct:true,
filter:function(event,player){
return player.hasMark('drlt_jieying_mark');
},
content:function(){
'step 0'
player.chooseTarget(get.prompt('drlt_jieying'),"将“营”交给一名角色；其摸牌阶段多摸一张牌，出牌阶段使用【杀】的次数上限+1且手牌上限+1。该角色回合结束后，其移去“营”标记，然后你获得其所有手牌。",function(card,player,target){
return target!=player;
}).ai=function(target){
if(get.attitude(player,target)>0&&target.countCards('h')>3&&(target.hp>2||(target.hp>1&&target.getEquip(2)))) return 0.8*target.countCards('h');
if(get.attitude(player,target)<1&&target.countCards('h')>=0&&target.countCards('j',{name:'lebu'})>0) return target.countCards('h')*0.8+target.getHandcardLimit()*0.7+2;
if(get.attitude(player,target)<1&&target.countCards('h')>0){
if(target.hasSkillTag('directHit_ai',true,{
target:player,
card:{name:'sha'},
},true)) return 0;
if(target.getEquip('zhangba')||target.getEquip('guanshi')) return 0;
if(player.countCards('e',function(card){
return get.subtype(card)=='equip2'&&get.name(card)!='baiyin';
})&&!target.hasSkillTag('unequip_ai')) return target.countCards('h')*0.8+target.getHandcardLimit()*0.7;
if(player.countCards('h',{name:'shan'})>1&&!target.getEquip('qinglong')) return target.countCards('h')*0.8+target.getHandcardLimit()*0.7;
if(!target.inRange(player)) return target.countCards('h')*0.8+target.getHandcardLimit()*0.7;
}
return 0;
};
'step 1'
if(result.bool){
var target=result.targets[0];
player.line(target);
player.logSkill('drlt_jieying',target);
var mark=player.countMark('drlt_jieying_mark');
player.removeMark('drlt_jieying_mark',mark);
target.addMark('drlt_jieying_mark',mark);
};
},
},
'3':{
audio:'drlt_jieying',
trigger:{
global:'phaseEnd',
},
forced:true,
filter:function(event,player){
return player!=event.player&&event.player.hasMark('drlt_jieying_mark')&&event.player.isAlive();
},
logTarget:'player',
content:function(){
if(trigger.player.countCards('h')>0){
trigger.player.give(trigger.player.getCards('h'),player);
}
trigger.player.removeMark('drlt_jieying_mark',trigger.player.countMark('drlt_jieying_mark'));
},
},
},
};
/*界颜良文丑 双雄*/
lib.skill.reshuangxiong = {
trigger:{
player:"phaseDrawBegin1",
},
group:"reshuangxiong2",
audio:"shuangxiong",
audioname:["re_yanwen"],
check:function (event,player){
if(player.countCards('h')>player.hp) return true;
if(player.countCards('h')>3) return true;
return false;
},
filter:function(event,player){
return !event.numFixed;
},
content:function (){
"step 0"
trigger.changeToZero();
event.cards=get.cards(2);
event.videoId=lib.status.videoId++;
game.broadcastAll(function(player,id,cards){
var str;
if(player==game.me&&!_status.auto){
str='【双雄】选择获得其中一张牌';
}
else{
str='双雄';
}
var dialog=ui.create.dialog(str,cards);
dialog.videoId=id;
},player,event.videoId,event.cards);
event.time=get.utc();
game.addVideo('showCards',player,['双雄',get.cardsInfo(event.cards)]);
game.addVideo('delay',null,2);
"step 1"
var next=player.chooseButton([1,1],true);
next.set('dialog',event.videoId);
next.set('ai',function(button){
var player=_status.event.player;
var color=get.color(button.link);
var value=get.value(button.link,player);
if(player.countCards('h',{color:color})>player.countCards('h',['red','black'].remove(color)[0])) value+=7;
return value;
});
"step 2"
if(result.bool&&result.links){
var cards2=[];
for(var i=0;i<result.links.length;i++){
cards2.push(result.links[i]);
cards.remove(result.links[i]);
}
game.cardsDiscard(cards);
event.card2=cards2[0];
}
var time=1000-(get.utc()-event.time);
if(time>0){
game.delay(0,time);
}
"step 3"
game.broadcastAll('closeDialog',event.videoId);
var card2=event.card2;
player.gain(card2,'gain2');
player.addTempSkill('shuangxiong2');
player.storage.shuangxiong=get.color(card2);
player.storage.shuangxiong_m='';
num=player.storage.shuangxiong=='red'?"♠️️♣️️️决斗":"♦️♥️决斗";
player.addMark('shuangxiong_m',num) 
},
};
lib.skill.shuangxiong2 = {
audio:true,
audioname:["re_yanwen"],
enable:"chooseToUse",
prompt:function(){
var player=_status.event.player;
var str='将一张'+(player.storage.shuangxiong!='red'?'红':'黑')+'色手牌当做【决斗】使用';
return str;
},
viewAs:{
name:"juedou",
},
position:"hs",
onremove:function (player) {
player.removeMark('shuangxiong_m');
},
filterCard:function(card,player){
return get.color(card)!=player.storage.shuangxiong;
},
check:function(card){
var player=_status.event.player;
if(player.needsToDiscard()>=2) return 15-get.value(card);
return 8-get.value(card);
},
ai:{
basic:{
order:function(){
var player=_status.event.player;
if(player.hasCard(function(card){
return get.tag(card,'gain')&&get.color(card)==player.storage.shuangxiong&&card.name=='tiesuo';
})) return 7.1;
return 12;
},
useful:1,
value:5.5,
},
wuxie:function(target,card,player,viewer){
if(player==game.me&&get.attitude(viewer,player)>0){
return 0;
}
},
result:{
target:-1.5,
player:function(player,target,card){
if(player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)){
return 0;
}
if(get.damageEffect(target,player,target)>0&&get.attitude(player,target)>0&&get.attitude(target,player)>0){
return 0;
}
var hs1=target.getCards('h','sha');
var hs2=player.getCards('h','sha');
if(hs1.length>hs2.length+1){
return -2;
}
var hsx=target.getCards('h');
if(hsx.length>2&&hs2.length==0&&hsx[0].number<6){
return -2;
}
if(hsx.length>3&&hs2.length==0){
return -2;
}
if(hs1.length>hs2.length&&(!hs2.length||hs1[0].number>hs2[0].number)){
return -2;
}
return -0.5;
},
},
tag:{
respond:2,
respondSha:2,
damage:1,
},
},
};
/*谋孙权 统业*/
lib.skill.sbtongye = {
audio:2,
trigger:{
player:"phaseJieshuBegin",
},
forced:true,
onremove:true,
content:function(){
'step 0'
player.chooseControl('变化','不变',function(){
var player=_status.event.player;
if(game.countPlayer()>3)return '变化';
if(game.countPlayer(function(current){
return current.hasCard({type:'equip'},'e')})<game.countPlayer()
) return '变化';
if(game.countPlayer()==2&&
game.countPlayer(function(current){
if(current!=player){
return current.countCards('e',{type:'equip'})+current.storage.disableEquip.length}})==5) return '不变';
if(Math.random()<0.3) return '变化';
return '不变';
}).set('prompt','统业：猜测场上装备数是否于你下回合准备阶段前发生变化');
'step 1'
if(result.control=='变化'){
player.addSkill('sbtongye_change',1);
player.chat('变！');
}else{
player.addSkill('sbtongye_nochange',1);
player.chat('不变！');
}
var num=game.filterPlayer().map(i=>i.countCards('e')).reduce((p,c)=>p+c,0);
player.removeMark('sbtongye_count',player.countMark('sbtongye_count'),false);
if(num>0) player.addMark('sbtongye_count',num,false);
player.addSkill('sbtongye_settle');
},
marktext:"业",
intro:{
name:"统业",
"name2":"业",
content:"mark",
},
subSkill:{
broadcast:{
trigger:{
global:["loseAfter","equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
},
charlotte:true,
silent:true,
filter:function(event,player){
var num=0;
game.countPlayer(function(current){
var evt=event.getl(current);
if(evt&&evt.es) num+=evt.es.length;
});
if(event.name=='equip') num--;
return num!=0;
},
content:function(){
if(player.hasSkill('sbtongye_change')) player.markSkill('sbtongye_change');
if(player.hasSkill('sbtongye_nochange')) player.markSkill('sbtongye_nochange');
},
sub:true,
forced:true,
popup:false,
},
settle:{
audio:"sbtongye",
init:function(player){
player.addSkill('sbtongye_broadcast');
},
trigger:{
player:"phaseZhunbeiBegin",
},
forced:true,
charlotte:true,
filter:function(event,player){
return player.hasSkill('sbtongye_change')||player.hasSkill('sbtongye_nochange');
},
content:function(){
var delta=game.filterPlayer().map(i=>i.countCards('e')).reduce((p,c)=>p+c,0)-player.countMark('sbtongye_count');
if(player.hasSkill('sbtongye_change')&&delta!=0||player.hasSkill('sbtongye_nochange')&&delta==0){
game.log(player,'猜测','#g正确');
if(player.countMark('sbtongye')<2) player.addMark('sbtongye',1);
}else{
game.log(player,'猜测','#y错误');
player.removeMark('sbtongye',1);
}
player.removeSkill('sbtongye_change');
player.removeSkill('sbtongye_nochange');
player.removeSkill('sbtongye_settle');
player.removeSkill('sbtongye_broadcast');
},
sub:true,
},
change:{
charlotte:true,
mark:true,
marktext:"变",
intro:{
markcount:function(storage,player){
return game.filterPlayer().map(i=>i.countCards('e')).reduce((p,c)=>p+c,0)-player.countMark('sbtongye_count');
},
mark:function(dialog,storage,player){
dialog.addText(get.translation(player)+'猜测场上装备数发生变化');
var delta=game.filterPlayer().map(i=>i.countCards('e')).reduce((p,c)=>p+c,0)-player.countMark('sbtongye_count');
if(delta==0) dialog.addText('(当前未发生变化)');
else dialog.addText('(当前已'+(delta>0?'增加':'减少')+get.cnNumber(Math.abs(delta))+'张装备牌)');
},
},
sub:true,
},
nochange:{
charlotte:true,
mark:true,
marktext:"<span style=\"text-decoration:line-through;\">变</span>",
intro:{
markcount:function(storage,player){
return game.filterPlayer().map(i=>i.countCards('e')).reduce((p,c)=>p+c,0)-player.countMark('sbtongye_count');
},
mark:function(dialog,storage,player){
dialog.addText(get.translation(player)+'猜测场上装备数不发生变化');
var delta=game.filterPlayer().map(i=>i.countCards('e')).reduce((p,c)=>p+c,0)-player.countMark('sbtongye_count');
if(delta==0) dialog.addText('(当前未发生变化)');
else dialog.addText('(当前已'+(delta>0?'增加':'减少')+get.cnNumber(Math.abs(delta))+'张装备牌)');
},
},
sub:true,
},
},
};
/*山包界蔡文姬 悲歌*/
lib.skill.olbeige.check=function(event,player){
if(event.player.hasSkill('xinleiji')) return get.attitude(player,event.player)>0;
if(get.attitude(player,event.player)<0){
if(get.attitude(player,_status.currentPhase)&&_status.currentPhase.isTurnedOver()) return true;
return false;
}
return true;
};
/*刘辩 诗怨*/
lib.skill.shiyuan = {
audio:2,
trigger:{
target:"useCardToTargeted",
},
frequent:true,
filter:function(event,player){
var num=1;
if(_status.currentPhase&&_status.currentPhase!=player&&_status.currentPhase.group=='qun'&&player.hasZhuSkill('yuwei',_status.currentPhase)) num=2;
return player!=event.player&&player.getHistory('gain',function(evt){
return evt.getParent(2).name=='shiyuan'&&evt.cards.length==(2+get.sgn(event.player.hp-player.hp));
}).length<num;
},
content:function(){
player.draw(2+get.sgn(trigger.player.hp-player.hp));
},
ai:{
threaten:1,
effect:{
target:function(card,player,target){
var num=1;
if(player.group=='qun') num=2;
if(get.tag(card,'damage')||get.tag(card,'lose')){
if(!target.hasFriend()) return;
if(target==player) return;
if(get.attitude(player,target)>0) return;
if(player.getHistory('gain',function(evt){
return evt.getParent(2).name=='shiyuan'&&evt.cards.length==(2+get.sgn(target.hp-player.hp));
}).length<num) return [1,(2+get.sgn(player.hp-target.hp))];
}
},
},
},
};
/*旧曹冲 仁心*/
lib.skill.oldrenxin={
trigger:{
global:"dying",
},
filter:function(event,player){
return event.player!=player&&event.player.hp<=0&&player.countCards('h')>0;
},
check:function(event,player){
if(get.attitude(player,event.player)<=0) return false;
if(player.countCards('h',{name:['tao','jiu']})+event.player.hp<0) return false;
return true;
},
content:function(){
'step 0'
player.turnOver();
'step 1'
player.give(player.getCards('h'),trigger.player);
'step 2'
trigger.player.recover();
},
};
/*周宣 寤寐*/
lib.skill.dcwumei={
audio:2,
trigger:{
player:"phaseBegin",
},
filter:function(event,player){
return !player.hasSkill('dcwumei_used');
},
priority:10,
direct:true,
content:function(){
'step 0'
player.chooseTarget(get.prompt2('dcwumei')).set('ai',target=>{
return get.attitude(_status.event.player,target);
});
'step 1'
if(result.bool){
var target=result.targets[0];
player.logSkill('dcwumei',target);
player.addTempSkill('dcwumei_used','roundStart');
target.insertPhase();
target.addTempSkill('dcwumei_wake');
var targets=game.filterPlayer();
if(!target.storage.dcwumei_wake) target.storage.dcwumei_wake=[[],[]];
for(var targetx of targets){
target.storage.dcwumei_wake[0].push(targetx);
target.storage.dcwumei_wake[1].push(targetx.hp);
}
target.markSkill('dcwumei_wake');
if(!trigger._finished){
trigger.finish();
trigger.untrigger(true);
trigger._triggered=5;
var evt=player.insertPhase();
delete evt.skill;
}
}
},
subSkill:{
used:{
charlotte:true,
sub:true,
},
wake:{
trigger:{
player:"phaseJieshuBegin",
},
charlotte:true,
popup:false,
forced:true,
onremove:true,
filter:function(event,player){
return player.storage.dcwumei_wake&&player.storage.dcwumei_wake.length;
},
content:function(){
var storage=player.storage.dcwumei_wake;
for(var i=0;i<storage[0].length;i++){
var target=storage[0][i];
if(target&&target.isIn()){
if(target.hp!=storage[1][i]){
game.log(target,'将体力从',get.cnNumber(target.hp,true),'改为',get.cnNumber(storage[1][i],true));
target.changeHp(storage[1][i]-target.hp)._triggered=null;
}
}
}
player.removeSkill('dcwumei_wake');
},
marktext:"寐",
intro:{
markcount:function(storage,player){
if(!storage||!storage.length) return 0;
return storage[0].length;
},
content:function(storage,player){
if(!storage||!storage.length) return '无信息';
var str='所有角色于回合开始时的体力值：<br>';
for(var i=0;i<storage[0].length;i++){
var str2=get.translation(storage[0][i])+'：'+storage[1][i];
if(!storage[0][i].isIn()) str2='<span style="opacity:0.5">'+str2+'（已故）</span>';
str+='<li>'+str2;
}
return str;
},
},
ai:{
effect:{
"player_use":function(card,player,target){
if(get.tag(card,'damage')) return 0.5;
},
target:function(card,player,target){
var tri=_status.event.getTrigger();
if(get.tag(card,'recover')&&target.hp>0){
if(get.name(card)!='jiu') return "zeroplayertarget";
}
},
},
},
sub:true,
},
},
};
/*司马师 夷灭*/
lib.skill.yimie={
audio:2,
usable:1,
preHidden:true,
trigger:{
source:"damageBegin1",
},
filter:function(event,player){
return player!=event.player&&event.num<event.player.hp;
},
check:function(event,player){
if(event.player.hasSkillTag('filterDamage')) return false;
if(event.player.hasSkillTag('nodamage')) return false;
if(get.attitude(player,event.player)>-2) return false;
if(player.hp>2) return true;
if(player.hp==2&&event.player.hp<3) return false;
return player.hp>1;
},
logTarget:"player",
content:function(){
player.loseHp();
trigger.player.addTempSkill('yimie2');
trigger.yimie_num=trigger.player.hp-trigger.num;
trigger.num=trigger.player.hp;
},
};
/*马休马铁 垦伤*/
lib.skill.rekenshang={
audio:"olkenshang",
enable:"chooseToUse",
filterCard:true,
selectCard:[2,Infinity],
viewAsFilter:function(player){
return player.countCards('hes')>1;
},
check:function(card){
var player=_status.event.player;
if(game.countPlayer(function(current){
return current!=player&&player.canUse('sha',current)&&get.effect(current,{
name:'sha'
},player,player)>0;
})<=ui.selected.cards.length) return 0;
if(_status.event.player.countCards('hes')>=3) return 8-ui.selected.cards.length-get.value(card);
return 6-ui.selected.cards.length-get.value(card);
},
position:"hes",
viewAs:{
name:"sha",
storage:{
olkenshang:true,
},
},
onuse:function(links,player){
player.addTempSkill('rekenshang_effect');
},
ai:{
order:function(item,player){
if(player.countCards('hes')>=3){
return 6;
}
return 4;
},
respondSha:true,
skillTagFilter:player=>player.countCards('hes')>1,
yingbian:function(card,player,targets,viewer){
if(get.attitude(viewer,player)<=0) return 0;
var base=0,hit=false;
if(get.cardtag(card,'yingbian_hit')){
hit=true;
if(targets.filter(function(target){
return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
})) base+=5;
}
if(get.cardtag(card,'yingbian_all')){
if(game.hasPlayer(function(current){
return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
})) base+=5;
}
if(get.cardtag(card,'yingbian_damage')){
if(targets.filter(function(target){
return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true))&&!target.hasSkillTag('filterDamage',null,{
player:player,
card:card,
jiu:true,
})
})) base+=5;
}
return base;
},
canLink:function(player,target,card){
if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)) return false;
if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
return true;
},
basic:{
useful:[5,3,1],
value:[5,3,1],
},
result:{
target:function(player,target,card,isLink){
var eff=function(){
if(!isLink&&player.hasSkill('jiu')){
if(!target.hasSkillTag('filterDamage',null,{
player:player,
card:card,
jiu:true,
})){
if(get.attitude(player,target)>0){
return -7;
}
else{
return -4;
}
}
return -0.5;
}
return -1.5;
}();
if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)) return eff/1.2;
return eff;
},
},
tag:{
respond:1,
respondShan:1,
damage:function(card){
if(card.nature=='poison') return;
return 1;
},
natureDamage:function(card){
if(card.nature) return 1;
},
fireDamage:function(card,nature){
if(card.nature=='fire') return 1;
},
thunderDamage:function(card,nature){
if(card.nature=='thunder') return 1;
},
poisonDamage:function(card,nature){
if(card.nature=='poison') return 1;
},
},
},
subSkill:{
effect:{
audio:"olkenshang",
trigger:{
player:"useCard2",
},
charlotte:true,
group:"rekenshang_after",
direct:true,
filter:function(event,player){
return event.card.storage&&event.card.storage.olkenshang&&game.countPlayer(function(current){
return current!=player&&lib.filter.targetEnabled2(event.card,player,current)&&lib.filter.targetInRange(event.card,player,current);
})>=event.cards.length;
},
content:function(){
'step 0'
player.chooseTarget(
trigger.cards.length,
'是否更改'+get.translation(trigger.card)+'的目标？',
'选择'+get.cnNumber(trigger.cards.length)+'名角色作为'+get.translation(trigger.card)+'的目标，覆盖原先存在的目标',
function(card,player,target){
var evt=_status.event.getTrigger();
return target!=player&&lib.filter.targetEnabled2(evt.card,player,target)&&lib.filter.targetInRange(evt.card,player,target);
}).set('ai',function(target){
var evt=_status.event.getTrigger();
return get.effect(target,evt.card,evt.player,evt.player);
});
'step 1'
if(result.bool){
if(player!=event.player&&!player.isOnline()) game.delayx();
}
else event.finish();
'step 2'
var targets=result.targets;
player.logSkill('rekenshang_effect',targets);
trigger.targets.length=0;
trigger.targets.addArray(targets);
game.log(targets,'成为了',trigger.card,'的新目标');
},
sub:true,
},
after:{
audio:"olkenshang",
trigger:{
player:"useCardAfter",
},
forced:true,
charlotte:true,
filter:function(event,player){
if(event.card.name!='sha'||!event.card.storage||!event.card.storage.olkenshang) return false;
var num=0;
game.countPlayer2(current=>{
current.getHistory('damage',evt=>{
if(evt.card==event.card) num+=evt.num;
})
});
return num<event.cards.length;
},
content:function(){
player.draw();
},
sub:true,
},
},
};
/*王瓘 谬焰*/
lib.skill.olmiuyan={
audio:2,
enable:"chooseToUse",
viewAsFilter:function(player){
return !player.hasSkill('olmiuyan_blocker')&&player.hasCard(card=>get.color(card)=='black','hes')
},
viewAs:{
name:"huogong",
},
filterCard:{
color:"black",
},
position:"hes",
check:function(card){
var player=_status.event.player,suits=lib.suit.slice(0);
if(player.countCards('h')>=4&&player.hasCard(function(card){
suits.remove(get.suit(card));
return suits.length==0;
},'h')) return 8-get.value(card);
return 6-get.value(card);
},
promptfunc:function(){
if(_status.event.player.storage.olmiuyan) return '转换技。你可以将一张黑色牌当做【火攻】使用。若此牌未造成伤害，则你令此技能失效直到本轮结束。';
return '转换技。你可以将一张黑色牌当做【火攻】使用。若此牌造成了伤害，则你获得此阶段内所有被展示过的牌。';
},
precontent:function(){
player.changeZhuanhuanji('olmiuyan');
var card=event.result.card;
if(!card.storage) card.storage={};
if(player.storage.olmiuyan){
card.storage.olmiuyan_gain=true;
player.addTempSkill('olmiuyan_gain');
}
else{
card.storage.olmiuyan_remove=true;
player.addTempSkill('olmiuyan_remove');
}
},
init:function(player){
player.addSkill('olmiuyan_counter');
},
onremove:function(player){
player.removeSkill('olmiuyan_counter');
},
zhuanhuanji:true,
mark:true,
marktext:"☯",
ai:{
order:function(item,player){
if(player.storage.olmiuyan) return 6;
if(player.countCards('h')>=4) return 8;
return 7;
},
basic:{
order:4,
value:[3,1],
useful:1,
},
wuxie:function(target,card,player,current,state){
if(get.attitude(current,player)>=0&&state>0) return false;
},
result:{
player:function(player){
var nh=player.countCards('h');
if(nh<=player.hp&&nh<=4&&_status.event.name=='chooseToUse'){
if(typeof _status.event.filterCard=='function'&&
_status.event.filterCard({name:'huogong'},player,_status.event)){
return -10;
}
if(_status.event.skill){
var viewAs=get.info(_status.event.skill).viewAs;
if(viewAs=='huogong') return -10;
if(viewAs&&viewAs.name=='huogong') return -10;
}
}
return 0;
},
target:function(player,target){
if(target.hasSkill('huogong2')||target.countCards('h')==0) return 0;
if(player.countCards('h')<=1) return 0;
if(target==player){
if(typeof _status.event.filterCard=='function'&&
_status.event.filterCard({name:'huogong'},player,_status.event)){
return -1.15;
}
if(_status.event.skill){
var viewAs=get.info(_status.event.skill).viewAs;
if(viewAs=='huogong') return -1.15;
if(viewAs&&viewAs.name=='huogong') return -1.15;
}
return 0;
}
return -1.15;
},
},
tag:{
damage:1,
fireDamage:1,
natureDamage:1,
norepeat:1,
},
},
intro:{
content:function(storage){
if(storage) return '转换技。你可以将一张黑色牌当做【火攻】使用。然后若此牌未造成伤害，则你令此技能失效直到本轮结束。';
return '转换技。你可以将一张黑色牌当做【火攻】使用。然后若此牌造成了伤害，则你获得此阶段内所有被展示过的牌。';
},
},
subSkill:{
counter:{
trigger:{
global:["showCardsEnd","phaseZhunbeiBefore","phaseJudgeBefore","phaseDrawBefore","phaseUseBefore","phaseDiscardBefore","phaseJieshuBefore"],
},
forced:true,
charlotte:true,
popup:false,
firstDo:true,
filter:function(event,player){
if(event.name=='showCards') return get.itemtype(event.cards)=='cards';
return true;
},
content:function(){
if(trigger.name=='showCards'){
game.broadcastAll(function(cards){
cards.forEach(card=>card.addGaintag('olmiuyan_tag'));
},trigger.cards);
}
else game.players.forEach(current=>current.removeGaintag('olmiuyan_tag'));
},
sub:true,
},
gain:{
trigger:{
player:"useCardAfter",
},
forced:true,
charlotte:true,
filter:function(event,player){
return event.card.storage&&event.card.storage.olmiuyan_gain&&player.hasHistory('sourceDamage',function(evt){
return evt.card==event.card;
})&&game.hasPlayer(function(current){
return current!=player&&current.hasCard(card=>card.hasGaintag('olmiuyan_tag'))
});
},
logTarget:function(event,player){
return game.filterPlayer(function(current){
return current!=player&&current.hasCard(card=>card.hasGaintag('olmiuyan_tag'))
});
},
content:function(){
var cards=[],players=game.filterPlayer(current=>current!=player).sortBySeat();
players.forEach(current=>{
var cardsx=current.getCards('h',function(card){
return card.hasGaintag('olmiuyan_tag');
});
if(cardsx.length) cards.addArray(cardsx);
});
player.gain(cards,'give');
},
sub:true,
},
remove:{
trigger:{
player:"useCardAfter",
},
forced:true,
charlotte:true,
filter:function(event,player){
return event.card.storage&&event.card.storage.olmiuyan_remove&&!player.hasHistory('sourceDamage',function(evt){
return evt.card==event.card;
});
},
content:function(){
player.addTempSkill('olmiuyan_blocker','roundStart');
game.log(player,'的','#g【谬焰】','失效了');
},
sub:true,
},
blocker:{
charlotte:true,
sub:true,
},
},
};
/*丁原 备诛*/
lib.skill.beizhu={
audio:3,
enable:"phaseUse",
usable:1,
filterTarget:function(card,player,target){
return target!=player&&target.countCards('h')>0;
},
content:function(){
'step 0'
player.addTempSkill('beizhu_draw');
player.viewHandcards(target);
'step 1'
var cards = target.getCards('h', 'sha');
if (cards.length) {
event.cards = cards;
event.goto(5);
} else player.discardPlayerCard('he', target, true);
'step 2'
player.chooseBool('是否令' + get.translation(target) + '获得一张【杀】？').set('ai', function () {
var evt = _status.event.getParent();
return get.attitude(evt.player, evt.target) > 0;
});
'step 3'
if (result.bool) {
var card = get.cardPile2(function (card) {
return card.name == 'sha';
});
if (card) target.gain(card, 'gain2');
} else event.finish();
'step 4'
game.updateRoundNumber();
event.finish();
'step 5'
var hs = target.getCards('h');
cards = cards.filter(function (card) {
return (
hs.contains(card) &&
get.name(card, target) == 'sha' &&
target.canUse(
{
name: 'sha',
isCard: true,
cards: [card]
},
player,
false
)
);
});
if (cards.length) {
var card = cards.randomRemove(1)[0];
target.useCard(player, false, card).card.beizhu = true;
event.redo();
}
},
ai:{
order:5,
result:{
player:function(player,target){
var hs1=target.countCards('h','sha');
var hs2=player.countCards('h','shan');
if(hs1<hs2){
return 1;
}
var hsx=target.countCards('h');
if(hsx>3){
return -1;
}
if(hs2==0){
return -0.5;
}
return 0;
},
target:function(player,target){
var hs1=target.countCards('h','sha');
var hs2=player.countCards('h','shan');
if(hs1<=hs2){
return -1;
}
var hsx=target.countCards('h');
if(hsx<=3){
return -0.5;
}
},
},
},
};
/*曹冲 称象*/
lib.skill.oldchengxiang={
audio:"chengxiang",
inherit:"chengxiang",
frequent:true,
trigger:{
player:"damageEnd",
},
content:function() {
'step 0'
var cards = get.cards(4);
var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 4, false);
guanXing.doubleSwitch = true;
guanXing.caption = '【称象】';
guanXing.header2 = '获得的牌';
guanXing.callback = function(){
var num = 0;
for (var i = 0; i < this.cards[1].length; i++) {
num += get.number(this.cards[1][i]);
}

return num > 0 && num <= 13;
};

game.broadcast(function(player, cards, callback){
if (!window.decadeUI) return;
var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 4, false);
guanXing.caption = '【称象】';
guanXing.header2 = '获得的牌';
guanXing.callback = callback;
}, player, cards, guanXing.callback);

var player = event.player;
event.switchToAuto = function(){
var cards = guanXing.cards[0];
var num, sum, next;
var index = 0;
var results = [];

for (var i = 0; i < cards.length; i++) {
num = 0;
sum = 0;
next = i + 1;
for (var j = i; j < cards.length; j++) {
if (j != i && j < next)
continue;

num = sum + get.number(cards[j]);
if (num <= 13) {
sum = num;
if (!results[index]) results[index] = [];
results[index].push(cards[j]);
}

if (j >= cards.length - 1) index++;
}

if (results[index] && results[index].length == cards.length) break;
}

var costs = [];
for (var i = 0; i < results.length; i++) {
costs[i] = {
value: 0,
index: i,
};
for (var j = 0; j < results[i].length; j++) {
costs[i].value += get.value(results[i][j], player);
if (results[i][j] == 'tao') {
costs[i].value += 6;
}
if (results[i][j] == 'jiu') {
costs[i].value += 4;
}
// 如果有队友且有【仁心】且血量不低，优先选择装备牌
if (player.hasFriend() && player.hasSkill('renxin') && get.type(results[i][j]) == 'equip' && player.hp > 1) {
costs[i].value += 5;
}

// 如果自己有延时牌且没有无懈可击，优先选择无懈可击
if (player.node.judges.childNodes.length > 0 && !player.hasWuxie() && results[i][j] == 'wuxie') {
costs[i].value += 5;
}
}
}

costs.sort(function(a, b) {
return b.value - a.value;
});

var time = 500;
var result = results[costs[0].index];

for (var i = 0; i < result.length; i++) {
setTimeout(function(move, finished){
guanXing.move(move, guanXing.cards[1].length, 1);
if (finished) guanXing.finishTime(1000);
}, time, result[i], (i >= result.length - 1));
time += 500;
}
};

if (event.isOnline()) {
event.player.send(function(){
if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
}, event.player);

event.player.wait();
decadeUI.game.wait();
} else if (!event.isMine()) {
event.switchToAuto();
}
'step 1'
if (event.result && event.result.bool) {
game.cardsDiscard(event.cards1);
player.gain(event.cards2, 'log', 'gain2');
}
},
ai:{
maixie:true,
"maixie_hp":true,
effect:{
target:function(card, player, target) {
if (get.tag(card, 'damage')) {
if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
if (!target.hasFriend()) return;
if (target.hp >= 4) return [1, 2];
if (target.hp == 3) return [1, 1.5];
if (target.hp == 2) return [1, 0.5];
}
},
},
},
};
lib.skill.chengxiang={
audio:2,
frequent:true,
trigger:{
player:"damageEnd",
},
content:function() {
'step 0'
var cards = get.cards(4);
var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 4, false);
guanXing.doubleSwitch = true;
guanXing.caption = '【称象】';
guanXing.header2 = '获得的牌';
guanXing.callback = function(){
var num = 0;
for (var i = 0; i < this.cards[1].length; i++) {
num += get.number(this.cards[1][i]);
}

return num > 0 && num <= 13;
};

game.broadcast(function(player, cards, callback){
if (!window.decadeUI) return;
var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, 4, false);
guanXing.caption = '【称象】';
guanXing.header2 = '获得的牌';
guanXing.callback = callback;
}, player, cards, guanXing.callback);

var player = event.player;
event.switchToAuto = function(){
var cards = guanXing.cards[0];
var num, sum, next;
var index = 0;
var results = [];

for (var i = 0; i < cards.length; i++) {
num = 0;
sum = 0;
next = i + 1;
for (var j = i; j < cards.length; j++) {
if (j != i && j < next)
continue;

num = sum + get.number(cards[j]);
if (num <= 13) {
sum = num;
if (!results[index]) results[index] = [];
results[index].push(cards[j]);
}

if (j >= cards.length - 1) index++;
}

if (results[index] && results[index].length == cards.length) break;
}

var costs = [];
for (var i = 0; i < results.length; i++) {
costs[i] = {
value: 0,
index: i,
};
for (var j = 0; j < results[i].length; j++) {
costs[i].value += get.value(results[i][j], player);
if (results[i][j] == 'tao') {
costs[i].value += 6;
}
if (results[i][j] == 'jiu') {
costs[i].value += 4;
}
// 如果有队友且有【仁心】且血量不低，优先选择装备牌
if (player.hasFriend() && player.hasSkill('renxin') && get.type(results[i][j]) == 'equip' && player.hp > 1) {
costs[i].value += 5;
}

// 如果自己有延时牌且没有无懈可击，优先选择无懈可击
if (player.node.judges.childNodes.length > 0 && !player.hasWuxie() && results[i][j] == 'wuxie') {
costs[i].value += 5;
}
}
}

costs.sort(function(a, b) {
return b.value - a.value;
});

var time = 500;
var result = results[costs[0].index];

for (var i = 0; i < result.length; i++) {
setTimeout(function(move, finished){
guanXing.move(move, guanXing.cards[1].length, 1);
if (finished) guanXing.finishTime(1000);
}, time, result[i], (i >= result.length - 1));
time += 500;
}
};

if (event.isOnline()) {
event.player.send(function(){
if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
}, event.player);

event.player.wait();
decadeUI.game.wait();
} else if (!event.isMine()) {
event.switchToAuto();
}
'step 1'
if (event.result && event.result.bool) {
game.cardsDiscard(event.cards1);
player.gain(event.cards2, 'log', 'gain2');
}
},
ai:{
maixie:true,
"maixie_hp":true,
effect:{
target:function(card, player, target) {
if (get.tag(card, 'damage')) {
if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
if (!target.hasFriend()) return;
if (target.hp >= 4) return [1, 2];
if (target.hp == 3) return [1, 1.5];
if (target.hp == 2) return [1, 0.5];
}
},
},
},
};
/*藤芳兰 落宠*/
lib.skill.dcluochong={
audio:2,
trigger:{global:'roundStart'},
filter:function(event,player){
return game.hasPlayer(current=>current.countDiscardableCards(player,'hej')>0);
},
direct:true,
content:function(){
'step 0'
var num=4-player.countMark('dcluochong');
var dialog=[];
dialog.push('###'+get.prompt('dcluochong')+'###<div class="text center">弃置任意名角色区域内共计至多'+get.cnNumber(num)+'张牌</div>');
game.filterPlayer().sortBySeat().forEach(target=>{
if(target.countDiscardableCards(player,'hej')<=0) return false;
var name=(target==player?'你':get.translation(target));
if(target.countCards('h')){
dialog.add('<div class="text center">'+name+'的手牌区</div>');
if(player.hasSkillTag('viewHandcard',null,target,true)||player==target) dialog.push(target.getCards('h'));
else dialog.push([target.getCards('h'),'blank']);
}
if(target.countCards('e')) dialog.addArray(['<div class="text center">'+name+'的装备区</div>',target.getCards('e')]);
if(target.countCards('j')) dialog.addArray(['<div class="text center">'+name+'的判定区</div>',target.getCards('j')]);
});
player.chooseButton([1,num]).set('createDialog',dialog).set('filterButton',button=>{
return lib.filter.canBeDiscarded(button.link,_status.event.player,get.owner(button.link));
}).set('ai',button=>{
var card=button.link;
var player=_status.event.player,target=get.owner(card);
if(target==player&&ui.cardPile.childNodes.length>80){
var num=ui.selected.buttons.filter(i=>get.owner(i.link)==player).length;
if(player.countCards('j')<=1&&num>0) return 0;
if(player.countCards('j')==2&&num>1) return 0;
if(player.countCards('j')<=0&&get.type(card)=='equip'&&player.countCards('he',cardx=>{
var stp=get.subtype(card);
return cardx!=card&&get.subtype(cardx)==stp;
})){
return 70-get.value(card,player);
}else{
if(get.value(card,player)<6&&get.type(card)!='equip') return 60-get.value(card,player);
}
return 0;
}
var num=ui.selected.buttons.filter(i=>get.owner(i.link)==target).length;
var dr=game.countPlayer(current=>get.attitude(player,current)<0);
var mark=4-player.countMark('dcluochong');
if(get.position(card)=='j'){
return 10*get.attitude(player,target)*get.value(card,target);
}else{
if(dr==1){
if(get.mode()=='identity'&&game.roundNumber==1&&num<=1) return -get.attitude(player,target)*get.value(card,target);
if(mark<=3&&num<=1) return -get.attitude(player,target)*get.value(card,target);
if(mark>3&&!(get.mode()=='identity'&&game.roundNumber==1)) return -get.attitude(player,target)*get.value(card,target);
}else{
if(num<=1){
if(num>0) return -2*get.attitude(player,target)*get.value(card,target);
return -get.attitude(player,target)*get.value(card,target);
}
}
}
});
'step 1'
if(result.bool){
var links=result.links;
var lose_list=[];
var log=false;
for(var target of game.players){
var cards=links.filter(card=>get.owner(card)==target);
if(cards.length){
if(cards.length>2){
player.addMark('dcluochong',1,false);
log=true;
}
lose_list.push([target,cards]);
}
}
player.logSkill('dcluochong',lose_list.map(i=>i[0]));
if(log) game.log(player,'可弃置牌数','#g-1');
if(lose_list[0].length==1) lose_list[0][0].discard(lose_list[0][1]);
else{
game.loseAsync({
lose_list:lose_list,
discarder:player,
}).setContent('discardMultiple');
}
}
},
ai:{
threaten:2.5,
effect:{
target:function(card,player,target,current){
if(get.type(card)=='delay'&&current<0){
var current=_status.currentPhase;
if(current.getSeatNum()>target.getSeatNum()) return 'zerotarget';
}
},
},
},
};
/*辣个男人 激昂*/
lib.skill.oljiang = {
audio:"jiang",
inherit:"jiang",
group:"oljiang_gain",
subSkill:{
gain:{
audio:"jiang",
audioname:["sp_lvmeng","re_sunben","re_sunce"],
trigger:{
global:["loseAfter","loseAsyncAfter"],
},
usable:1,
filter:function(event,player){
if(player.hp<1||event.type!='discard'||event.position!=ui.discardPile) return false;
var filter=(card)=>(card.name=='juedou'||(card.name=='sha'&&get.color(card,false)=='red'));
var cards=event.getd().filter(filter);
if(!cards.filter((card)=>(get.position(card,true)=='d')).length) return false;
var searched=false;
if(game.getGlobalHistory('cardMove',function(evt){
if(searched||evt.type!='discard'||evt.position!=ui.discardPile) return false;
var evtx=evt;
if(evtx.getlx===false) evtx=evt.getParent();
var cards=evtx.getd().filter(filter);
if(!cards.length) return false;
searched=true;
return evtx!=event;
}).length>0) return false;
return true;
},
"prompt2":function(event,player){
var cards=event.getd().filter(function(card){
return (card.name=='juedou'||(card.name=='sha'&&get.color(card,false)=='red'))&&get.position(card,true)=='d';
});
return '失去1点体力并获得'+get.translation(cards);
},
check:function(event,player){
return player.hp>1&&!player.storage.olhunzi;
},
content:function(){
player.loseHp();
var cards=trigger.getd().filter(function(card){
return (card.name=='juedou'||(card.name=='sha'&&get.color(card,false)=='red'))&&get.position(card,true)=='d';
});
if(cards.length>0) player.gain(cards,'gain2');
},
sub:true,
},
},
shaRelated:true,
preHidden:true,
audioname:["sp_lvmeng","re_sunben","re_sunce"],
trigger:{
player:"useCardToPlayered",
target:"useCardToTargeted",
},
filter:function(event,player){
if(!(event.card.name=='juedou'||(event.card.name=='sha'&&get.color(event.card)=='red'))) return false;
return player==event.target||event.getParent().triggeredTargets3.length==1;
},
frequent:true,
content:function(){
player.draw();
},
mod:{
aiOrder:function(player,card,num){
if(get.color(card)=='red'&&get.name(card)=='sha')return get.order({name:'sha'})+0.1;
},
},
ai:{
effect:{
target:function(card,player,target){
if(get.color(card)=='red'&&get.name(card)=='sha'&&get.attitude(player,target)<0) return [1,1.5];
},
player:function(card,player,target){
if(get.color(card)=='red'&&get.name(card)=='sha'&&get.attitude(player,target)<0) return [1,1.5];
},
},
},
};
lib.skill.jiang = {
shaRelated:true,
audio:2,
preHidden:true,
audioname:["sp_lvmeng","re_sunben","re_sunce"],
trigger:{
player:"useCardToPlayered",
target:"useCardToTargeted",
},
filter:function(event,player){
if(!(event.card.name=='juedou'||(event.card.name=='sha'&&get.color(event.card)=='red'))) return false;
return player==event.target||event.getParent().triggeredTargets3.length==1;
},
frequent:true,
content:function(){
player.draw();
},
mod:{
aiOrder:function(player,card,num){
if(get.color(card)=='red'&&get.name(card)=='sha')return get.order({name:'sha'})+0.1;
},
},
ai:{
effect:{
target:function(card,player,target){
if(get.color(card)=='red'&&get.name(card)=='sha'&&get.attitude(player,target)<0) return [1,1.5];
},
player:function(card,player,target){
if(get.color(card)=='red'&&get.name(card)=='sha'&&get.attitude(player,target)<0) return [1,1.5];
},
},
},
};
/*界陆逊 谦逊*/
lib.skill.reqianxun.ai = {
effect:function(card,player,target){
if(!target.hasFriend()) return;
if(player==target) return;
var type=get.type(card);
var dy=game.countPlayer(current=>get.attitude(target,current)>0);
var nh=target.countCards();
if(get.attitude(player,target)<=0){
if(type=='trick'){
if(!get.tag(card,'multitarget')||get.info(card).singleCard){
if(get.tag(card,'damage')){
if(nh<3||target.hp<=2) return 0.8;
}else{
if(nh>=dy) return [1,dy/1.2];
return [1,nh/1.2];
}
}
}
else if(type=='delay'){
return [0.5,0.5];
}
}
},
};
/*徐氏 问卦*/
lib.skill.wengua2={
audio:"wengua",
enable:"phaseUse",
filter:function(event,player){
if(player.hasSkill('wengua3')) return false;
return player.countCards('he')&&game.hasPlayer(function(current){
return current.hasSkill('wengua');
});
},
direct:true,
delay:false,
filterCard:true,
discard:false,
lose:false,
position:"he",
prompt:function(){
var player=_status.event.player;
var list=game.filterPlayer(function(current){
return current.hasSkill('wengua');
});
if(list.length==1&&list[0]==player) return '将一张牌置于牌堆顶或是牌堆底';
var str='将一张牌交给'+get.translation(list);
if(list.length>1) str+='中的一人';
return str;
},
check:function(card){
if(card.name=='sha') return 5;
return 8-get.value(card);
},
content:function(){
"step 0"
var targets=game.filterPlayer(function(current){
return current.hasSkill('wengua');
});
if(targets.length==1){
event.target=targets[0];
event.goto(2);
}
else if(targets.length>0){
player.chooseTarget(true,'选择【问卦】的目标',function(card,player,target){
return _status.event.list.contains(target);
}).set('list',targets).set('ai',function(target){
var player=_status.event.player;
return get.attitude(player,target);
});
}
else{
event.finish();
}
"step 1"
if(result.bool&&result.targets.length){
event.target=result.targets[0];
}
else{
event.finish();
}
"step 2"
if(event.target){
player.logSkill('wengua',event.target);
player.addTempSkill('wengua3','phaseUseEnd');
event.card=cards[0];
if(event.target!=player){
player.give(cards,event.target);
}
}
else{
event.finish();
}
delete _status.noclearcountdown;
game.stopCountChoose();
"step 3"
if(event.target.getCards('he').contains(event.card)){
event.target.chooseControlList('问卦','将'+get.translation(event.card)+'置于牌堆顶','将'+get.translation(event.card)+'置于牌堆底',event.target==player,function(){
if(get.attitude(event.target,player)<0) return 2;
return 1;
});
}
else{
event.finish();
}
"step 4"
event.index=result.index;
if(event.index==0||event.index==1){
var next=event.target.lose(event.card,ui.cardPile);
if(event.index==0) next.insert_card=true;
game.broadcastAll(function(player){
var cardx=ui.create.card();
cardx.classList.add('infohidden');
cardx.classList.add('infoflip');
player.$throw(cardx,1000,'nobroadcast');
},event.target);
}
else event.finish();
"step 5"
game.delay();
"step 6"
if(event.index==1){
game.log(event.target,'将获得的牌置于牌堆底');
if(ui.cardPile.childElementCount==1||player==event.target){
player.draw();
}
else{
game.asyncDraw([player,target],null,null);
}
}
else if(event.index==0){
game.log(player,'将获得的牌置于牌堆顶');
if(ui.cardPile.childElementCount==1||player==event.target){
player.draw('bottom');
}
else{
game.asyncDraw([player,target],null,null,true);
}
}
},
ai:{
order:function(item,player){
if(player.countCards('hs','sha')>1) return get.order({name:'sha'})+1;
if(player.countCards('hs','sha')<=1) return 2;
},
threaten:1.5,
result:{
player:function(player,target){
var target=game.findPlayer(function(current){
return current.hasSkill('wengua');
});
if(target){
return get.attitude(player,target);
}
},
},
},
};
/*张华 弼昏 剑合*/
lib.skill.olbihun = {
audio:2,
trigger:{
player:"useCardToPlayer",
},
forced:true,
filter:function(event,player){
return event.isFirstTarget&&player.countCards('h')>player.getHandcardLimit()&&event.targets.some(target=>target!=player);
},
content:function(){
if(trigger.targets.length==1){
var cards=trigger.cards.filterInD();
if(cards.length){
game.delayx();
trigger.targets[0].gain(cards,'gain2');
}
}
var targets=trigger.targets.filter(target=>target!=player);
trigger.targets.removeArray(targets);
trigger.getParent().triggeredTargets1.removeArray(targets);
},
ai:{
threaten:0.8,
halfneg:true,
effect:{
player:function(card,player,target){
if((!card.isCard||!card.cards)&&get.itemtype(card)!='card') return;
if(target&&player!=target&&player.countCards('h')>player.getHandcardLimit()+1){
if(get.attitude(player,target)>0) return[0,0,0,0.5];
return [0,-1,0,5];
} 
},
},
},
};
lib.skill.oljianhe = {
audio:2,
enable:"phaseUse",
filterTarget:function(card,player,target){
return !player.getStorage('oljianhe_chosen').contains(target);
},
filterCard:function(card,player){
if(ui.selected.cards.length){
var cardx=ui.selected.cards[0];
if(get.type(cardx)=='equip') return get.type(card)=='equip';
return get.name(card)==get.name(cardx);
}
var cards=player.getCards('he');
for(var cardx of cards){
if(card!=cardx){
if(get.type(cardx)=='equip'&&get.type(card)=='equip') return true;
if(get.name(card)==get.name(cardx)) return true;
}
}
return false;
},
selectCard:[2,Infinity],
position:"he",
complexCard:true,
discard:false,
visible:true,
prepare:"throw",
loseTo:"discardPile",
delay:0.5,
check:function(card){
var player=_status.event.player;
var cards=player.getCards('he',card=>get.subtype(card)=='equip1');
cards=cards.sort(function(a,b){
return get.value(b)-get.value(a);
});
if(get.type(card)=='equip'){
if(get.subtype(card)=='equip1'&&card==cards[0]) return 0;
return 15-get.value(card);
}else{
if(!player.hasValueTarget(card)) return 20-get.value(card);
return 7-get.value(card);
} 
},
content:function(){
'step 0'
player.draw(cards.length);
player.addTempSkill('oljianhe_chosen','phaseUseAfter');
player.markAuto('oljianhe_chosen',[target]);
'step 1'
var type=get.type2(cards[0]);
target.chooseCard(get.translation(player)+'对你发动了【剑合】','请重铸'+get.cnNumber(cards.length)+'张'+get.translation(type)+'牌，或点“取消”受到1点雷电伤害',cards.length,'he',(card,player,target)=>{
return get.type2(card)==_status.event.type;
}).set('ai',card=>{
if(_status.event.goon) return (get.type(card)=='equip'?15:7)-get.value(card);
return 0;
}).set('type',type).set('goon',get.damageEffect(target,player,target,'thunder')<0);
'step 2'
if(result.bool){
var cards=result.cards;
target.loseToDiscardpile(cards);
target.draw(cards.length);
}
else{
target.damage(player,'thunder');
}
'step 3'
game.delayx();
},
ai:{
order:function(item,player){
if(player.hasSkill('olbihun')&&player.countCards('h')-player.countCards('h',card=>player.hasValueTarget(card))>player.getHandcardLimit()) return 11;
return 4;
},
threaten:2.4,
expose:0.1,
result:{
target:function(player,target){
var cards=ui.selected.cards,type=get.type2(cards[0]);
if(target.countCards('he',card=>{
return get.type(card)==type&&get.value(card)<=5;
})>=cards.length) return 1;
return -1;
},
},
},
subSkill:{
chosen:{
charlotte:true,
onremove:true,
intro:{
content:"本阶段已对$发动过技能",
},
sub:true,
},
},
};
/*司马懿 反馈*/
lib.skill.refankui={
audio:2,
trigger:{
player:"damageEnd",
},
direct:true,
filter:function(event,player){
return (event.source&&event.source.countGainableCards(player,event.source!=player?'he':'e')&&event.num>0);
},
content:function(){
"step 0"
event.count=trigger.num;
"step 1"
event.count--;
player.gainPlayerCard(get.prompt('refankui',trigger.source),trigger.source,get.buttonValue,trigger.source!=player?'he':'e').set('ai',function(target){
if(get.attitude(_status.event.player,trigger.source)>0) return false;
if(get.attitude(_status.event.player,trigger.source)<=0) return true;
}).set('logSkill',[event.name,trigger.source]);
"step 2"
if(result.bool&&event.count>0&&trigger.source.countGainableCards(player,trigger.source!=player?'he':'e')>0) event.goto(1);
},
ai:{
"maixie_defend":true,
effect:{
target:function(card,player,target){
if(player.countCards('he')>1&&get.tag(card,'damage')){
if(player.hasSkillTag('jueqing',false,target)) return [1,-1.5];
if(get.attitude(target,player)<0) return [1,1];
}
},
},
},
};
//新贾诩 拥嫡
if (lib.skill.dcyongdi) {
lib.skill.dcyongdi.ai = {
expose: 0.3,
order: 1,
result: {
target: function (player, target) {
let val = 0,
att = get.attitude(_status.event.player, target);
if (att <= 0) return 0;
let bool1 = !game.hasPlayer((current) => current.maxHp < target.maxHp),
bool2 = target.isMinHp(),
bool3 = target.isMinHandcard();
if (bool1) val += 6.5;
if (bool2) {
if (bool1) target.maxHp++;
val += get.recoverEffect(target, player, player);
if (bool1) target.maxHp--;
}
if (bool3) val += 5 * Math.min(5, target.maxHp + (bool1 ? 1 : 0));
return val;
}
}
};
}
//王悦王桃 护关 摇佩
if (lib.skill.huguan) {
lib.skill.huguan.content = function () {
'step 0';
player
.chooseControl(lib.suit, 'cancel2')
.set('prompt', get.prompt('huguan', trigger.player))
.set('prompt2', '令某种花色的手牌不计入其本回合的手牌上限')
.set('ai', function () {
let player = _status.event.player,
target = _status.event.getTrigger().player,
att = get.attitude(player, target);
if (att <= 0) {
if (!player.hasSkill('yaopei') || target.needsToDiscard() - target.needsToDiscard(-target.countCards('h') / 4) > 1 || get.recoverEffect(target, player, _status.event.player) > 0) return 'cancel2';
}
let list = lib.suit.slice(0);
if (att <= 0 && target.getStorage('huguan_add'))
for (let i of target.getStorage('huguan_add')) {
if (list.contains(i)) return i;
}
list.removeArray(target.getStorage('huguan_add'));
if (list.length) return list.randomGet();
return 'cancel2';
});
'step 1'
if (result.control != 'cancel2') {
let target = trigger.player;
player.logSkill('huguan', target);
game.log(player, '选择了', '#g' + get.translation(result.control), '花色');
target.addTempSkill('huguan_add');
target.markAuto('huguan_add', [result.control]);
}
};
lib.skill.huguan.global = 'huguan_all';
}
lib.skill.huguan_all = {
mod: {
aiValue: function (player, card, num) {
if (player && player.storage.huguan_all && get.itemtype(card) == 'card' && get.color(card, player) == 'red') {
if (player.storage.huguan_all < 0) return num * 0.4;
return num + player.storage.huguan_all;
}
}
},
trigger: {
player: ['phaseUseBegin', 'useCard']
},
filter: function (event, player) {
if (event.name == 'useCard') return player.storage.huguan_all;
return true;
},
silent: true,
charlotte: true,
content: function () {
'step 0';
if (trigger.name == 'useCard') {
player.storage.huguan_all = 0;
event.finish();
}
'step 1'
let num = -157;
game.countPlayer(function (current) {
if (current.hasSkill('huguan')) num = Math.max(num, get.attitude(_status.event.player, current));
});
if (num == -157) game.removeGlobalSkill('huguan_all');
else if (num == 0) player.storage.huguan_all = 6;
else if (num > 0) player.storage.huguan_all = 9;
else player.storage.huguan_all = -1;
}
};
if (lib.skill.yaopei){
lib.skill.yaopei.content = function () {
'step 0'
let suits = [];
trigger.player.getHistory('lose', function (evt) {
if (evt.type == 'discard' && evt.getParent('phaseDiscard') == trigger) {
for (let i of evt.cards2) suits.add(get.suit(i, evt.hs.contains(i) ? evt.player : false));
}
});
player.chooseCardTarget({
prompt: get.prompt('yaopei', trigger.player),
prompt2: '操作提示：选择要弃置的牌，并选择执行摸牌选项的角色，另一名角色执行回复体力的选项。',
suits: suits,
position: 'he',
filterCard: function (card, player) {
return !_status.event.suits.contains(get.suit(card)) && lib.filter.cardDiscardable(card, player, 'yaopei');
},
filterTarget: function (card, player, target) {
return target == player || target == _status.event.getTrigger().player;
},
ai1: function (card) {
let player = _status.event.player,
source = _status.event.getTrigger().player;
if (get.attitude(player, source) > 0 && (get.recoverEffect(player, player, player) > 0 || get.recoverEffect(source, player, player) > 0)) return 12 - get.value(card);
return 8 - get.value(card);
},
ai2: function (target) {
let player = _status.event.player,
source = _status.event.getTrigger().player;
let recoverer = player == target ? source : player;
if (recoverer.isHealthy()) return get.attitude(player, target);
let rec = get.recoverEffect(recoverer, player, player);
return Math.abs(get.attitude(player, recoverer)) * get.recoverEffect(recoverer, player, player) + 6 * get.attitude(player, target);
}
});
'step 1'
if (result.bool) {
let target = trigger.player;
player.logSkill('yaopei', target);
player.discard(result.cards);
if (player == result.targets[0]) {
target.recover();
player.draw(2);
} else {
target.draw(2);
player.recover();
}
}
};
//祝融 长标
if (lib.skill.changbiao) {
lib.skill.changbiao.check = function (card) {
let player = _status.event.player;
if (ui.selected.cards.length) {
let list = game
.filterPlayer(function (current) {
return current != player && player.canUse('sha', current, false) && get.effect(current, {name: 'sha'}, player, player) > 0;
})
.sort(function (a, b) {
return get.effect(b, {name: 'sha'}, player, player) - get.effect(a, {name: 'sha'}, player, player);
});
if (!list.length) return 0;
let target = list[0],
cards = ui.selected.cards.concat([card]),
color = [];
for (let i of cards) {
if (!color.contains(get.color(i, player))) color.add(get.color(i, player));
}
if (color.length != 1) color[0] = 'none';
if (
player.hasSkillTag(
'directHit_ai',
true,
{
target: target,
card: {name: 'sha', suit: 'none', color: color[0], cards: cards, isCard: true}
},
true
)
)
return 6.5 - get.value(card, player);
if (Math.random() * target.countCards('hs') < 1 || player.needsToDiscard(-ui.selected.cards.length)) return 6 - get.value(card, player);
return 0;
}
return 6.3 - get.value(card);
};
}
}
//李婉 别君
lib.skill.biejun={
audio:2,
global:"biejun_give",
trigger:{
player:"damageBegin4",
},
filter:function(event,player){
return !player.hasSkill('biejun_used')&&player.countCards('h',card=>{
return card.hasGaintag('biejun');
})==0;
},
"prompt2":"翻面并防止此伤害",
check:function(event,player){
return player.isTurnedOver()||event.num>=player.hp||get.distance(_status.currentPhase,player,'absolute')>=3;
},
content:function(){
player.addTempSkill('biejun_used');
player.turnOver();
trigger.cancel();
},
ai:{
effect:{
target:function(card,player,target){
if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
if(get.tag(card,'damage')){
if(lib.skill.biejun.filter(null,target)) return "zeroplayertarget";
if(player.getNext()==target&&lib.skill.biejun.filter(null,target)&&target.isTurnedOver()) return [0,1];
}
},
},
},
subSkill:{
used:{
charlotte:true,
sub:true,
},
give:{
audio:2,
enable:"phaseUse",
usable:1,
filter:function(event,player){
if(!player.countCards('h')) return false;
var targets=game.filterPlayer(function(current){
return current!=player&&current.hasSkill('biejun');
});
if(!targets.length) return false;
return true;
},
selectCard:1,
filterCard:true,
filterTarget:function(card,player,target){
return target.hasSkill('biejun');
},
selectTarget:function(){
var player=_status.event.player;
var targets=game.filterPlayer(function(current){
return current!=player&&current.hasSkill('biejun');
});
return targets.length>1?1:-1;
},
complexSelect:true,
prompt:function(){
var player=_status.event.player;
var targets=game.filterPlayer(function(current){
return current!=player&&current.hasSkill('biejun');
});
return '将一张手牌交给'+get.translation(targets)+(targets.length>1?'中的一人':'');
},
position:"h",
discard:false,
lose:false,
delay:false,
check:function(card){
var player=_status.event.player;
if(game.hasPlayer(function(current){
return lib.skill.biejun_give.filterTarget(null,player,current)&&get.attitude(player,current)>0;
})){
return 5-get.value(card);
}
if(get.name(card)=='shan') return 0;
return -get.value(card);
},
content:function(){
game.trySkillAudio('biejun',target);
player.give(cards,target).gaintag.add('biejun');
target.addTempSkill('biejun_tag');
},
ai:{
order:function(item,player){
var current=game.filterPlayer(function(current){
return current!=player&&current.hasSkill('biejun');
});
if(player.countCards('h')>=3&&(player.countCards('hs',{name:'juedou'})>0||player.countCards('hs',{name:'huogong'})>0||player.countCards('hs',{name:'sha'})>0||player.countCards('hs',{name:'nanman'})>0||player.countCards('hs',{name:'wanjian'})>0)) return 7;
return 2;
},
result:{
target:function(player,target){
if(get.attitude(player,target)>0) return 1;
if(get.attitude(player,target)<0&&get.distance(player,target,'attack')<=1) return -1;
},
},
},
sub:true,
},
tag:{
charlotte:true,
forced:true,
onremove:function(player){
player.removeGaintag('biejun');
},
ai:{
threaten:5,
},
sub:true,
},
},
};
//曹嵩 贯纵
lib.skill.guanzong={
audio:2,
enable:"phaseUse",
usable:1,
filterTarget:function(card,player,target){
return player!=target;
},
selectTarget:2,
multitarget:true,
targetprompt:["伤害来源","受伤角色"],
content:function(){
targets[1].damage(targets[0]).setContent(lib.skill.guanzong.viewAsDamageContent);
},
viewAsDamageContent:function(){
'step 0'
if(lib.config.background_audio){
game.playAudio('effect','damage'+(num>1?'2':''));
}
game.broadcast(function(num){
if(lib.config.background_audio){
game.playAudio('effect','damage'+(num>1?'2':''));
}
},num);
var str='视为受到了';
if(source) str+='来自<span class="bluetext">'+(source==player?'自己':get.translation(source))+'</span>的';
str+=get.cnNumber(num)+'点';
if(event.nature) str+=get.translation(event.nature)+'属性';
str+='伤害';
game.log(player,str);
if(player.stat[player.stat.length-1].damaged==undefined){
player.stat[player.stat.length-1].damaged=num;
}
else {
player.stat[player.stat.length-1].damaged+=num;
}
if(source){
source.getHistory('sourceDamage').push(event);
if(source.stat[source.stat.length-1].damage==undefined){
source.stat[source.stat.length-1].damage=num;
}
else {
source.stat[source.stat.length-1].damage+=num;
}
}
player.getHistory('damage').push(event);
if(event.animate!==false){
player.$damage(source);
game.broadcastAll(function(nature,player){
if(lib.config.animation&&!lib.config.low_performance){
if(nature=='fire'){
player.$fire();
}
else if(nature=='thunder'){
player.$thunder();
}
}
},event.nature,player);
var numx=Math.max(0,num-player.hujia);
player.$damagepop(-numx,'gray');
}
'step 1'
event.trigger('damageSource');
},
ai:{
result:{
target:function(player,target){
if(game.countPlayer(i=>i!=player)<2) return 0;
var list=game.filterPlayer(current=>current!=player).map(current=>{
var _hp=current.hp,_maxhp=current.maxHp;
current.hp=10; current.maxHp=10;
var eff=get.damageEffect(current,player,current)+10;
current.hp=_hp; current.maxHp=_maxhp;
return [current,eff];
}).sort((a,b)=>b[1]-a[1])[0];
if(list[1]<0) return 0;
var targetx=list[0],sign=get.sgnAttitude(player,target);
if(ui.selected.targets.length) return target==targetx?sign:0;
return sign*(game.filterPlayer(current=>{
return current!=player&&current!=targetx;
}).map(current=>{
var _hp=targetx.hp,_maxhp=targetx.maxHp;
targetx.hp=10; targetx.maxHp=10;
var eff=get.damageEffect(targetx,current,player);
targetx.hp=_hp; targetx.maxHp=_maxhp;
return [current,eff];
}).sort((a,b)=>b[1]-a[1])[0][0]==target?10:1);
if(targetx.hasSkillTag("maixie")) return 10;
},
},
order:9.5,
expose:0.2,
},
};
//怨语
lib.skill.yuanyu={
audio:2,
enable:"phaseUse",
usable:1,
content:function(){
'step 0'
player.draw();
'step 1'
if(player.countCards('h')>0){
var suits=lib.suit.slice(0),cards=player.getExpansions('yuanyu');
for(var i of cards) suits.remove(get.suit(i,false));
var str='选择一张手牌，作为“怨”置于武将牌上；同时选择一名其他角色，令该角色获得〖怨语〗的后续效果。'
if(suits.length){
str+='目前“怨”中未包含的花色：';
for(var i of suits) str+=get.translation(i);
}
player.chooseCardTarget({
filterCard:true,
filterTarget:lib.filter.notMe,
position:'h',
prompt:'怨语：选择置于武将牌上的牌和目标',
prompt2:str,
suits:suits,
forced:true,
ai1:function(card){
var val=get.value(card),evt=_status.event;
if(evt.suits.contains(get.suit(card,false))) return 8-get.value(card);
return 5-get.value(card);
},
ai2:function(target){
var player=_status.event.player;
if(player.storage.yuanyu_damage&&player.storage.yuanyu_damage.contains(target)) return 0;
return -get.attitude(player,target);
},
});
}
else event.finish();
'step 2'
var target=result.targets[0];
player.addSkill('yuanyu_damage');
player.markAuto('yuanyu_damage',result.targets);
player.line(target,'green');
if(!target.storage.yuanyu_mark){
target.storage.yuanyu_mark=player;
target.markSkillCharacter('yuanyu_mark',player,'怨语','已获得〖怨语〗效果');
target.addSkill('yuanyu_mark');
}
player.addToExpansion(result.cards,player,'give').gaintag.add('yuanyu');
},
intro:{
content:"expansion",
markcount:"expansion",
},
onremove:function(player,skill){
var cards=player.getExpansions(skill);
if(cards.length) player.loseToDiscardpile(cards);
player.removeSkill('yuanyu_damage');
},
ai:{
order:7,
result:{
player:1,
},
},
subSkill:{
mark:{
mark:"怨",
intro:{
content:"已获得〖怨语〗效果",
onunmark:true,
},
sub:true,
},
damage:{
trigger:{
global:["damageSource","phaseDiscardBegin"],
},
forced:true,
charlotte:true,
onremove:function(player,skill){
if(player.storage[skill]){
for(var i of player.storage[skill]){
if(i.storage.yuanyu_mark==player) i.unmarkSkill('yuanyu_mark');
}
}
delete player.storage[skill];
},
filter:function(event,player){
if(event.name=='damage'){
var source=event.source;
return source&&player.getStorage('yuanyu_damage').contains(source)&&source.countCards('h')>0;
}
else{
if(player==event.player){
return player.getStorage('yuanyu_damage').some(function(target){
return target.isIn()&&target.countCards('h')>0;
});
}
else if(player.getStorage('yuanyu_damage').contains(event.player)){
return event.player.countCards('h')>0;
}
return false;
}
},
content:function(){
'step 0'
if(trigger.name=='phaseDiscard'){
if(trigger.player==player){
event.targets=player.getStorage('yuanyu_damage').filter(function(target){
return target.isIn()&&target.countCards('h')>0;
}).sortBySeat();
}
else event.targets=[trigger.player];
}
else event.targets=[trigger.source];
'step 1'
event.target=event.targets.shift();
event.count=trigger.name=='damage'?trigger.num:1;
'step 2'
event.count--;
var suits=lib.suit.slice(0),cards=player.getExpansions('yuanyu');
for(var i of cards) suits.remove(get.suit(i,false));
var next=target.chooseCard('h',true,'将一张手牌置于'+get.translation(player)+'的武将牌上');
next.set('suits',suits);
next.set('ai',function(card){
var val=get.value(card),evt=_status.event;
if(evt.suits.contains(get.suit(card,false))) return 5-get.value(card);
return 8-get.value(card);
});
if(suits.length){
var str='目前未包含的花色：';
for(var i of suits) str+=get.translation(i);
next.set('prompt2',str);
}
'step 3'
player.addToExpansion(result.cards,target,'give').gaintag.add('yuanyu');
'step 4'
if(!player.hasSkill('yuanyu_damage')) event.finish();
else if(event.count>0&&target.countCards('h')>0) event.goto(2);
else if(event.targets.length>0) event.goto(1);
},
sub:true,
},
},
};
//DIY 张宝 符火
lib.skill.nsfuhuo2={
trigger:{
player:["respondAfter","useCardAfter"],
},
forced:true,
priority:10,
mark:true,
popup:false,
filter:function(event,player){
return event.card&&event.card.name=='shan'&&player.storage.nsfuhuo3&&player.storage.nsfuhuo3.isIn();
},
content:function(){
'step 0'
player.storage.nsfuhuo3.logSkill('nsfuhuo',player);
player.judge(function(card){
var suit=get.suit(card);
if(suit=='heart'||suit=='diamond'){
return -1;
}
else{
return 0;
}
});
'step 1'
var source=player.storage.nsfuhuo3;
if(result.suit=='diamond'){
player.damage('fire',source);
if(player.countCards('h')){
player.randomDiscard('h');
}
}
else if(result.suit=='heart'){
player.damage('fire',2,source);
}
},
intro:{
content:"card",
},
onremove:function(player){
player.storage.nsfuhuo2.discard();
delete player.storage.nsfuhuo2;
delete player.storage.nsfuhuo3;
},
ai:{
noShan:true,
},
};
/*本体武将技能优化*/

/*本体装备优化*/
/*霹雳车*/
lib.card.ly_piliche={
fullskin:true,
derivation:"liuye",
type:"equip",
subtype:"equip1",
distance:{
attackFrom:-8,
},
skills:["ly_piliche"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
ai:{
equipValue:9,
basic:{
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return 8+get.equipValue(card,player)/20;
}
},
useful:2,
equipValue:9,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
};
/*霹雳投石车*/
lib.card.pilitoushiche={
fullskin:true,
derivation:"dc_liuye",
cardimage:"ly_piliche",
type:"equip",
subtype:"equip5",
skills:["pilitoushiche"],
destroy:true,
ai:{
equipValue:9,
basic:{
equipValue:9,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return 8+get.equipValue(card,player)/20;
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
/*大攻车*/
lib.card.dagongche={
fullskin:true,
derivation:"zhangfen",
type:"equip",
subtype:"equip5",
skills:["dagongche_skill"],
cardPrompt:function(card){
if(!card.storage) return '出牌阶段开始时，你可以视为使用一张【杀】，且当此【杀】因执行效果而对目标角色造成伤害后，你弃置其一张牌。若此【大攻车】未被强化，则其他角色无法弃置你装备区内的【大攻车】。当此牌离开你的装备区后，销毁之。';
var str='出牌阶段开始时，你可以视为使用一张';
if(card.storage.大攻车选项一) str+='无距离限制且无视防具的';
str+='【杀】';
if(card.storage.大攻车选项二) str+=('（此【杀】的目标上限+'+card.storage.大攻车选项二+'）');
str+='，且当此【杀】因执行效果而对目标角色造成伤害后，你弃置其';
var num=1;
if(card.storage.大攻车选项三) num+=card.storage.大攻车选项三;
str+=get.cnNumber(num);
str+='张牌。当此牌离开你的装备区后，销毁之。';
return str;
},
destroy:true,
ai:{
equipValue:9,
basic:{
equipValue:9,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return 8+get.equipValue(card,player)/20;
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
/*
//古锭刀
lib.card.guding = {
fullskin:true,
type:"equip",
subtype:"equip1",
distance:{
attackFrom:-1,
},
ai:{
equipValue:function(card,player){
if(!game.hasPlayer(function(current){
if(!player.hasCard({subtype:'equip4'},'he')) return current!=player&&get.distance(player,current)<=2&&get.attitude(player,current)<0;
return current!=player&&get.distance(player,current)<=3&&get.attitude(player,current)<0;
})) return 1;
if(!player.hasCard({subtype:'equip4'},'he')){
for(var i=0;i<game.players.length;i++){
if(!(game.players[i]!=player&&game.players[i].countCards('h')<=0&&get.distance(player,game.players[i])<=2&&get.attitude(player,game.players[i])<0)) continue;
var target1=game.players[i];
if(game.hasPlayer(function(current){
return current==target1})){
if(game.hasPlayer(function(current){
return current==target1&&player.hasCard(function(card){return get.name(card)=='sha'&&get.effect(current,card,player,player)>0})&&
player.canUse('sha',current)&&player.getCardUsable('sha')>=1;
})){
if(player.getEquip('zhuge')&&player.countCards('h',function(card){
return get.name(card)=='sha'&&player.hasValueTarget(card);
})>=3) return 4.5;
return 11;
}
return 4.5;
}
}
}else{
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&game.players[j].countCards('h')<=0&&get.distance(player,game.players[j])<=3&&get.attitude(player,game.players[j])<0)) continue;
var target2=game.players[j];
if(game.hasPlayer(function(current){
return current==target2})){
if(game.hasPlayer(function(current){
return current==target2&&player.hasCard(function(card){return get.name(card)=='sha'&&get.effect(current,card,player,player)>0})&&player.canUse('sha',current)&&player.getCardUsable('sha')>=1;
})){
if(player.getEquip('zhuge')&&player.countCards('h',function(card){
return get.name(card)=='sha'&&player.hasValueTarget(card);
})>=3) return 4.5;
return 11;
}
return 4.5;
}
}
}
if((player.hasSkill('repojun')||player.hasSkill('pojun'))&&
game.hasPlayer(function(current){
if(!player.hasCard({subtype:'equip4'},'he')) return current!=player&&get.distance(player,current)<=2&&get.attitude(player,current)<0;
return current!=player&&get.distance(player,current)<=3&&get.attitude(player,current)<0;
})){ 
if(player.hasCard({name:'zhuge'})&&player.getCardUsable('sha')==0&&player.countCards('h',function(card){
return get.name(card)=='sha'&&player.hasValueTarget(card);
})>=2) return 4.5;
return 12;
}
return 2.4;
},
basic:{
equipValue:2,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
skills:["guding_skill"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//诸葛连弩
lib.card.zhuge = {
fullskin:true,
type:"equip",
subtype:"equip1",
ai:{
order:function(){
return get.order({name:'sha'})-0.1;
},
equipValue:function(card,player){
if(!game.hasPlayer(function(current){
if(!player.hasCard({subtype:'equip4'},'he')) return current!=player&&get.distance(player,current)<=1&&get.attitude(player,current)<0;
return current!=player&&get.distance(player,current)<=2&&get.attitude(player,current)<0;
})) return 1;
if(player.hasSha()&&_status.currentPhase==player){
if(!player.hasCard({subtype:'equip4'},'he')&&game.hasPlayer(function(current){
return current!=player&&get.distance(player,current)<=1&&get.attitude(player,current)<0&&
player.hasCard(function(card){return get.name(card)=='sha'&&get.effect(current,card,player,player)>0})&&player.canUse('sha',current);
})){
if(player.getEquip('zhuge')){
if(player.countCards('he',function(card){return get.name(card)=='sha'})<=1&&player.countUsed('sha',true)==0) return 0;
return 10;
}
if(player.getCardUsable('sha')==0)return 10;
}
if(player.hasCard({subtype:'equip4'},'he')&&player.getCardUsable('sha')==0&&game.hasPlayer(function(current){
return current!=player&&get.distance(player,current)<=2&&get.attitude(player,current)<0&&
player.hasCard(function(card){return get.name(card)=='sha'&&get.effect(current,card,player,player)>0})&&player.canUse('sha',current);
})){
if(player.getEquip('zhuge')){
if(player.countCards('he',function(card){return get.name(card)=='sha'})<=1&&player.countUsed('sha',true)==0) return 0;
}
if(player.getCardUsable('sha')==0)return 10;
}
}
if(_status.currentPhase==player){
if(!player.hasSha()&&!player.hasUsableCard('sha')) return 0;
if(!game.hasPlayer(function(current){
return get.attitude(player,current)<0&&get.effect(current,{name:'sha'},player,player);
})) return 0;
} 
var num=player.countCards('h');
if(_status.currentPhase!=player) return Math.min((2+num),10);
},
basic:{
equipValue:5,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return 8+get.equipValue(card,player)/20;
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
tag:{
valueswap:1,
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
skills:["zhuge_skill"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//贯石斧
lib.card.guanshi = {
fullskin:true,
type:"equip",
subtype:"equip1",
distance:{
attackFrom:-2,
},
ai:{
equipValue:function(card,player){
var he=player.countCards('he',function(card){
return card.name!='guanshi'});
var num=Math.max(he,2);
if(!game.hasPlayer(function(current){
if(!player.hasCard({subtype:'equip4'},'he')) return current!=player&&get.distance(player,current)<=3&&get.attitude(player,current)<0;
return current!=player&&get.distance(player,current)<=4&&get.attitude(player,current)<0;
})) return 2;
if(!player.hasCard({subtype:'equip4'},'he')){
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=3&&
get.attitude(player,game.players[j])<0&&
player.canUse('sha',game.players[j])&&
(game.players[j].hasShan()||game.players[j].countCards('h')>2))) continue;
var target1=game.players[j];
if(game.hasPlayer(function(current){
return current==target1;
})){
if(game.hasPlayer(function(current){
return current==target1&&player.getCardUsable('sha')>=1&&
player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0})&&he>2;
})){
if(player.getEquip('zhuge')&&player.countCards('h',function(card){
return get.name(card)=='sha'&&player.hasValueTarget(card);
})>=2)return Math.min(num,9);
return Math.min(num+2,12);
}
if(_status.currentPhase!=player&&game.hasPlayer(function(current){
return current!=player&&get.distance(player,current)<=3&&get.attitude(player,current)<0&&current.hp==1;
})) return 10;
return Math.min(num+1,6);
}
}
}else{
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=4&&
get.attitude(player,game.players[j])<0&&
player.canUse('sha',game.players[j])&&
(game.players[j].hasShan()||game.players[j].countCards('h')>2)))continue;
var target2=game.players[j];
if(game.hasPlayer(function(current){
return current==target2;
})){
if(game.hasPlayer(function(current){
return current==target2&&player.getCardUsable('sha')>=1&&
player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0})&&he>2;
})){
if(player.getEquip('zhuge')&&player.countCards('h',function(card){
return get.name(card)=='sha'&&player.hasValueTarget(card);
})>=2)return Math.min(num,9);
return Math.min(num+2,12);
}
if(_status.currentPhase!=player&&game.hasPlayer(function(current){
return current!=player&&get.distance(player,current)<=3&&get.attitude(player,current)<0&&current.hp==1;
})) return 10;
return Math.min(num+1,6);
}
}
}
return 4;
},
basic:{
equipValue:4.5,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
skills:["guanshi_skill"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//丈八蛇矛
lib.card.zhangba = {
fullskin:true,
type:"equip",
subtype:"equip1",
distance:{
attackFrom:-2,
},
ai:{
equipValue:function(card,player){
var num=Math.min(4+player.countCards('h')/3,8);
if(!game.hasPlayer(function(current){
if(!player.hasCard({subtype:'equip4'},'he')) return current!=player&&get.distance(player,current)<=3&&get.attitude(player,current)<0;
return current!=player&&get.distance(player,current)<=4&&get.attitude(player,current)<0;
})) return 1.5;
if(!player.hasCard({subtype:'equip4'},'he')){
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=3&&
get.attitude(player,game.players[j])<0&&
player.canUse('sha',game.players[j])&&
(game.players[j].getEquip('renwang')||game.players[j].getEquip('rewrite_renwang')))) continue;
var target1=game.players[j];
if(game.hasPlayer(function(current){
return current==target1;
})){
if(game.hasPlayer(function(current){
return current==target1&&!player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0});
})) return Math.max(num,5);
return 3.5;
}
}
}else{
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=4&&
get.attitude(player,game.players[j])<0&&
player.canUse('sha',game.players[j])&&
(game.players[j].getEquip('renwang')||game.players[j].getEquip('rewrite_renwang')))) continue;
var target2=game.players[j];
if(game.hasPlayer(function(current){
return current==target2;
})){
if(game.hasPlayer(function(current){
return current==target2&&!player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0});
})) return Math.max(num,5);
return 3.5;
}
}
}
if(player.hasSkill('xinfu_tushe')) return 12;
return 3.1;
},
basic:{
equipValue:3.5,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
skills:["zhangba_skill"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//雌雄双股剑
lib.card.cixiong = {
fullskin:true,
type:"equip",
subtype:"equip1",
distance:{
attackFrom:-1,
},
ai:{
equipValue:function(card,player){
if(!game.hasPlayer(function(current){
if(!player.hasCard({subtype:'equip4'},'he')) return current!=player&&get.distance(player,current)<=2&&get.attitude(player,current)<0;
return current!=player&&get.distance(player,current)<=3&&get.attitude(player,current)<0;
})) return 1;
if(!player.hasCard({subtype:'equip4'},'he')){
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=2&&
get.attitude(player,game.players[j])<0&&
player.differentSexFrom(game.players[j])&&
player.canUse('sha',game.players[j])))continue;
var target1=game.players[j];
if(game.hasPlayer(function(current){
return current==target1;
})){
if(game.hasPlayer(function(current){
return current==target1&&
player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0});
})) return 6;
return 4;
}
}
}else{
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=3&&
get.attitude(player,game.players[j])<0&&
player.differentSexFrom(game.players[j])&&
player.canUse('sha',game.players[j])))continue;
var target2=game.players[j];
if(game.hasPlayer(function(current){
return current==target2;
})){
if(game.hasPlayer(function(current){
return current==target2&&
player.canUse('sha',current)&&player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0});
})) return 6;
return 4;
}
}
}
return 2.3;
}, 
basic:{
equipValue:2,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
skills:["cixiong_skill"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//青釭剑
lib.card.qinggang = {
fullskin:true,
type:"equip",
subtype:"equip1",
distance:{
attackFrom:-1,
},
ai:{
equipValue:function(card,player){
if(!game.hasPlayer(function(current){
if(!player.hasCard({subtype:'equip4'},'he')) return current!=player&&get.distance(player,current)<=2&&get.attitude(player,current)<0;
return current!=player&&get.distance(player,current)<=3&&get.attitude(player,current)<0;
})) return 1.9;
if(!player.hasCard({subtype:'equip4'},'he')){
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=2&&
get.attitude(player,game.players[j])<0&&
game.players[j].getEquip(2)&&
player.canUse('sha',game.players[j])))continue;
var target1=game.players[j];
if(game.hasPlayer(function(current){
return current==target1;
})){
if(game.hasPlayer(function(current){
return current==target1&&
player.hasSha()&&
!player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0});
})) return 11;
return 7;
}
}
}else{
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=3&&
get.attitude(player,game.players[j])<0&&
game.players[j].getEquip(2)&&
player.canUse('sha',game.players[j])))continue;
var target2=game.players[j];
if(game.hasPlayer(function(current){
return current==target2;
})){
if(game.hasPlayer(function(current){
return current==target2&&
player.hasSha()&&
!player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0});
})) return 11;
return 7;
}
}
}
return 3.5;
},
basic:{
equipValue:2,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
skills:["qinggang_skill"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//朱雀羽扇
lib.card.zhuque = {
fullskin:true,
type:"equip",
subtype:"equip1",
distance:{
attackFrom:-3,
},
ai:{
equipValue:function(card,player){
if(!game.hasPlayer(function(current){
if(!player.hasCard({subtype:'equip4'},'he')) return current!=player&&get.distance(player,current)<=4&&get.attitude(player,current)<0;
return current!=player&&get.distance(player,current)<=5&&get.attitude(player,current)<0;
})) return 1.5;
if(!player.hasCard({subtype:'equip4'},'he')){
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=4&&
get.attitude(player,game.players[j])<0&&
game.players[j].getEquip('tengjia')&&
!game.players[j].hasSkillTag('nofire')&&
player.canUse('sha',game.players[j])))continue;
var target1=game.players[j];
if(game.hasPlayer(function(current){
return current==target1;
})){
if(game.hasPlayer(function(current){
return current==target1&&player.hasSha()&&!player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0});
})) return 12;
return 8;
}
}
}else{
for(var j=0;j<game.players.length;j++){
if(!(game.players[j]!=player&&
get.distance(player,game.players[j])<=5&&
get.attitude(player,game.players[j])<0&&
game.players[j].getEquip('tengjia')&&
!game.players[j].hasSkillTag('nofire')&&
player.canUse('sha',game.players[j])))continue;
var target2=game.players[j];
if(game.hasPlayer(function(current){
return current==target2;
})){
if(game.hasPlayer(function(current){
return current==target2&&player.hasSha()&&!player.hasCard(function(card){
return get.name(card)=='sha'&&get.effect(current,card,player,player)>0});
})) return 12;
return 8;
}
}
}
return 3;
},
basic:{
equipValue:2,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
skills:["zhuque_skill"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//方天画戟
lib.card.fangtian.ai={
basic:{
equipValue:2.2,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
};
//寒冰剑
lib.card.hanbing.ai={
basic:{
equipValue:2,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
};
//麒麟弓
lib.card.qilin.ai={
basic:{
equipValue:2.5,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
};
//青龙偃月刀
lib.card.qinglong.ai={
equipValue:function(card,player){
return Math.min(2.5+player.countCards('h','sha'),4);
},
basic:{
equipValue:3.5,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
};
//藤甲
lib.card.tengjia = {
fullskin:true,
type:"equip",
subtype:"equip2",
ai:{
value:function(card,player,index,method){
if(player.isDisabled(2)) return 0.01;
if(card==player.getEquip(2)){
if(player.hasSkillTag('noDirectDamage')) return 10;
if(game.hasPlayer(function(current){
return current!=player&&get.attitude(current,player)<0&&current.hasSkillTag('fireAttack',null,null,true);
})) return 0;
return 6;
}
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
equipValue:function(card,player){
if(player.hasSkillTag('maixie')&&player.hp>1){
if(player.hp>2) return 0;
if(player.countCards('h',{name:'tao'}))return 0;
}
if(player.hasSkillTag('useShan')&&player.hp>1) return 0;
if(player.hasSkillTag('nofire')) return 10;
if(get.damageEffect(player,player,player,'fire')>=0) return 10;
if(player.hasSkillTag('noDirectDamage')) return 8;
if(game.hasPlayer(function(current){
return get.attitude(player,current)<0&&
((current.inRange(player)&&current.canUse('sha',player)&&current.getEquip('zhuque'))||
current.hasSkillTag('fireAttack'))
})) return 0; 
if(player.hp==1) return 10;
if(player.hp==2) return 8;
if(player.hp>2) return 3;
},
basic:{
equipValue:3,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
skills:["tengjia1","tengjia2","tengjia3"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//仁王盾
lib.card.renwang = {
fullskin:true,
type:"equip",
subtype:"equip2",
skills:["renwang_skill"],
ai:{
equipValue:function(card,player){
if(game.hasPlayer(function(current){
return get.attitude(player,current)<0&&
current.inRange(player)&&(
current.getEquip('zhangba')||current.hasUsableCard('sha'));
})) return 7;
return 7.5;
},
basic:{
equipValue:7.5,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//八卦阵
lib.card.bagua = {
fullskin:true,
type:"equip",
subtype:"equip2",
ai:{
equipValue:function(card,player){
if(game.hasPlayer(function(current){
return get.attitude(player,current)<0&&current.inRange(player)&&(
current.getEquip('guanshi')||current.hasSkillTag('directHit_ai',true,{
target:player,
card:{name:'sha'},
},true));
})) return 7;
return 7.5;
},
basic:{
equipValue:7.5,
order:function(card,player){
if(player&&player.hasSkillTag('reverseEquip')){
return 8.5-get.equipValue(card,player)/20;
}
else{
return Math.min(7.2,7+get.equipValue(card,player)/60);
}
},
useful:2,
value:function(card,player,index,method){
if(player.isDisabled(get.subtype(card))) return 0.01;
var value=0;
var info=get.info(card);
var current=player.getEquip(info.subtype);
if(current&&card!=current){
value=get.value(current,player);
}
var equipValue=info.ai.equipValue;
if(equipValue==undefined){
equipValue=info.ai.basic.equipValue;
}
if(typeof equipValue=='function'){
if(method=='raw') return equipValue(card,player);
if(method=='raw2') return equipValue(card,player)-value;
return Math.max(0.1,equipValue(card,player)-value);
}
if(typeof equipValue!='number') equipValue=0;
if(method=='raw') return equipValue;
if(method=='raw2') return equipValue-value;
return Math.max(0.1,equipValue-value);
},
},
result:{
target:function(player,target,card){
return get.equipResult(player,target,card.name);
},
},
},
skills:["bagua_skill"],
enable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player;
},
modTarget:true,
allowMultiple:false,
content:function(){
if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
},
toself:true,
};
//本体装备技能优化
//贯石斧
lib.skill.guanshi_skill = {
equipSkill:true,
trigger:{
player:["shaMiss","eventNeutralized"],
},
direct:true,
audio:true,
filter:function(event,player){
if(event.type!='card'||event.card.name!='sha') return false;
return player.countCards('he',function(card){
return card!=player.getEquip('guanshi');
})>=2&&event.target.isAlive();
},
content:function(){
"step 0"
var next=player.chooseToDiscard(get.prompt('guanshi'),2,'he',function(card){
return _status.event.player.getEquip('guanshi')!=card;
});
next.logSkill='guanshi_skill';
next.set('ai',function(card){
var evt=_status.event.getTrigger();
if(get.attitude(evt.player,evt.target)<0){
if(player.needsToDiscard()>=2) return 15-get.value(card);
if(evt.baseDamage+evt.extraDamage>=Math.min(2,evt.target.hp)) return 8-get.value(card)
return 5-get.value(card)
}
return -1;
});
"step 1"
if(result.bool){
if(event.triggername=='shaMiss'){
trigger.untrigger();
trigger.trigger('shaHit');
trigger._result.bool=false;
trigger._result.result=null;
}
else{
trigger.unneutralize();
}
}
},
ai:{
"directHit_ai":true,
skillTagFilter:function(player,tag,arg){
if(player._guanshi_temp) return;
player._guanshi_temp=true;
var bool=(get.attitude(player,arg.target)<0&&arg.card&&arg.card.name=='sha'&&player.countCards('he',function(card){
return card!=player.getEquip('guanshi')&&card!=arg.card&&(!arg.card.cards||!arg.card.cards.contains(card))&&get.value(card)<5;
})>1);
delete player._guanshi_temp;
return bool;
},
},
};
//雌雄双股剑
lib.skill.cixiong_skill={
equipSkill:true,
trigger:{
player:"useCardToPlayered",
},
audio:true,
logTarget:"target",
check:function(event,player){
if(get.attitude(player,event.target)>0) return true;
var target=event.target;
return target.countCards('h')==0||!target.hasSkillTag('noh');
},
filter:function(event,player){
if(event.card.name!='sha') return false;
return player.differentSexFrom(event.target);
},
content:function(){
"step 0"
trigger.target.chooseToDiscard('弃置一张手牌，或令'+get.translation(player)+'摸一张牌').set('ai',function(card){
var trigger=_status.event.getTrigger();
if((trigger.target.countCards('h','shan')==1||trigger.target.countCards('h','tao')==1||trigger.target.countCards('h','jiu')==1)&&trigger.target.countCards('h')==1){
return false;
}
return -get.attitude(trigger.target,trigger.player)-get.value(card);
});
"step 1"
if(result.bool==false) player.draw();
},
};
//寒冰剑
lib.skill.hanbing_skill={
equipSkill:true,
trigger:{
source:"damageBegin2",
},
audio:true,
filter:function(event){
return event.card&&event.card.name=='sha'&&event.notLink()&&event.player.getCards('he').length>0;
},
check:function(event,player){
var target=event.player;
if(event.getParent(2).jiu==true) return false;
var eff=get.damageEffect(target,player,player,event.nature);
if(get.attitude(player,target)>0){
if(eff>=0) return false;
return true;
}
if(eff<=0) return true;
if(target.hp>=2&&target.countCards('he')>=2&&player.hasSkill('yun_shangshi')&&event.getParent(2).jiu!=true) return true;
if(target.hp==1) return false;
if(event.num>1||player.hasSkill('tianxianjiu')||
player.hasSkill('luoyi2')||player.hasSkill('reluoyi2')) return false;
if(target.countCards('he')<2) return false;
var num=0;
var cards=target.getCards('he');
for(var i=0;i<cards.length;i++){
if(get.value(cards[i])>=6) num++;
}
if(num>=3&&event.getParent(2).jiu!=true) return true;
if(num>=2&&target.hasSkillTag("maixie")&&event.getParent(2).jiu!=true) return true;
if(num>=2&&player.hasSkill('yun_shangshi')&&event.getParent(2).jiu!=true) return true;
return false;
},
logTarget:"player",
content:function(){
"step 0"
trigger.cancel();
"step 1"
if(trigger.player.countDiscardableCards(player,'he')){
player.line(trigger.player);
player.discardPlayerCard('he',trigger.player,true);
}
"step 2"
if(trigger.player.countDiscardableCards(player,'he')){
player.line(trigger.player);
player.discardPlayerCard('he',trigger.player,true);
}
},
};
//丈八蛇矛
lib.skill.zhangba_skill={
equipSkill:true,
enable:["chooseToUse","chooseToRespond"],
filterCard:true,
selectCard:2,
position:"hs",
viewAs:{
name:"sha",
},
complexCard:true,
filter:function(event,player){
return player.countCards('hs')>=2;
},
audio:true,
prompt:"将两张手牌当杀使用或打出",
check:function(card){
let player=_status.event.player;
if(player.needsToDiscard()>=2&&!player.countCards('h',function(card){return player.hasValueTarget(card)})) return 15-get.value(card);
if(player.hasCard(function(card){
return get.name(card)=='sha'||get.name(card)=='tao'||get.name(card)=='jiu';
})) return 0;
if(_status.currentPhase==player){
if(player.hasCard(function(card){
return get.name(card)=='wuxie'||get.name(card)=='wuzhong'||get.name(card)=='guohe'||get.name(card)=='shunshou'||get.name(card)=='bingliang'||get.name(card)=='lebu';
})) return 0;
}
if(player.hasSkill('xinfu_tushe')&&player.hasCard(function(card){
return get.type2(card)!='trick'&&(get.name(card)=='tao'||get.name(card)=='jiu'||get.name(card)=='shan');
})){
return 15-get.value(card);
}
if(player.hp<=2&&player.countCards('hs','sha')<=0) return 10-get.value(card);
return 5-get.value(card);
},
ai:{
respondSha:true,
skillTagFilter:function(player){
return player.countCards('hs')>=2;
},
yingbian:function(card,player,targets,viewer){
if(get.attitude(viewer,player)<=0) return 0;
var base=0,hit=false;
if(get.cardtag(card,'yingbian_hit')){
hit=true;
if(targets.filter(function(target){
return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
})) base+=5;
}
if(get.cardtag(card,'yingbian_all')){
if(game.hasPlayer(function(current){
return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
})) base+=5;
}
if(get.cardtag(card,'yingbian_damage')){
if(targets.filter(function(target){
return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true))&&!target.hasSkillTag('filterDamage',null,{
player:player,
card:card,
jiu:true,
})
})) base+=5;
}
return base;
},
canLink:function(player,target,card){
if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)) return false;
if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
return true;
},
basic:{
useful:[5,3,1],
value:[5,3,1],
},
order:function(item,player){
if(player.hasSkillTag('presha',true,null,true)) return 10;
if(lib.linked.contains(get.nature(item))){
if(game.hasPlayer(function(current){
return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
})&&game.countPlayer(function(current){
return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
})>1) return 3.1;
return 3;
}
return 3.05;
},
result:{
target:function(player,target,card,isLink){
var eff=function(){
if(!isLink&&player.hasSkill('jiu')){
if(!target.hasSkillTag('filterDamage',null,{
player:player,
card:card,
jiu:true,
})){
if(get.attitude(player,target)>0){
return -7;
}
else{
return -4;
}
}
return -0.5;
}
return -1.5;
}();
if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)) return eff/1.2;
return eff;
},
},
tag:{
respond:1,
respondShan:1,
damage:function(card){
if(card.nature=='poison') return;
return 1;
},
natureDamage:function(card){
if(card.nature) return 1;
},
fireDamage:function(card,nature){
if(card.nature=='fire') return 1;
},
thunderDamage:function(card,nature){
if(card.nature=='thunder') return 1;
},
poisonDamage:function(card,nature){
if(card.nature=='poison') return 1;
},
},
},
};*/
/*红缎枪*/
lib.skill.pyzhuren_heart={
audio:true,
trigger:{
source:"damageSource",
},
usable:1,
equipSkill:true,
filter:function(event,player){
return event.getParent().name=='sha';
},
check:function(event,player){
return true;
},
content:function(){
'step 0'
player.judge(function(card){
var player=_status.event.getParent('pyzhuren_heart').player;
if(player.isHealthy()&&get.color(card)=='red') return 0;
return 2;
});
'step 1'
if(result.color=='red') player.recover();
else player.draw(2);
},
};
/*
//本体卡牌优化
//桃
lib.card.tao={
fullskin:true,
type:"basic",
cardcolor:"red",
toself:true,
enable:function(card,player){
return player.hp<player.maxHp;
},
savable:true,
selectTarget:-1,
filterTarget:function(card,player,target){
return target==player&&target.hp<target.maxHp;
},
modTarget:function(card,player,target){
return target.hp<target.maxHp;
},
content:function(){
target.recover(event.baseDamage||1);
},
ai:{
basic:{
order:function(card,player){
if(player.hasSkillTag('pretao')) return 5;
return 2;
},
useful:function(card,i){
let player=_status.event.player;
if(player.isDamaged()&&!game.checkMod(card,player,'unchanged','cardEnabled2',player)) return 2/(1+i);
let fs=game.filterPlayer(function(current){
return get.attitude(player,current)>0&&current.hp<=2;
}),damaged=0,needs=0;
for(let f of fs){
if(!lib.filter.cardSavable(card,player,f)) continue;
if(f.hp>1) damaged++;
else needs++;
}
if(needs&&damaged) return 5*needs+3*damaged;
if(needs+damaged>1||player.hasSkillTag('maixie')) return 8;
if(player.hp/player.maxHp<0.7) return 7+Math.abs(player.hp/player.maxHp-0.5);
if(needs) return 7;
if(damaged) return Math.max(3,6.4-i);
return 6.8-Math.min(5,player.hp);
},
value:function(card,player,i){
let fs=game.filterPlayer(function(current){
return get.attitude(_status.event.player,current)>0;
}),damaged=0,needs=0;
for(let i of fs){
if(!player.canUse('tao',i)) continue;
if(i.hp<=1) needs++;
else if(i.hp==2) damaged++;
}
if(needs>2) return 11;
if(needs>1) return 10;
if(needs&&damaged||player.hasSkillTag('maixie')) return 9;
if(needs||damaged>1) return 8;
if(damaged) return 7.5;
return Math.max(1,9.2-player.hp);
}
},
result:{
target:2,
"target_use":function(player,target){
if(get.attitude(target,player)<0){
return "zeroplayertarget";
}
if(player.countCards('hs','tao')>0){
var numt=player.countCards('hs','tao');
}
if(player.countCards('hs')==0){
var numt=player.countCards('hs','tao')+1;
}
if(player.canSave(target)){
if(player.hasSkill('longhun')||player.hasSkill('relonghun')){
var numt=player.countCards('hs','tao')+player.countCards('hes',function(card){
return get.suit(card,player)=='heart'&&get.name(card)!='tao';
});
}
}
var tri=_status.event.getTrigger();
var numz=game.countPlayer(function(current){
return current.identity=='zhong'||current.identity=='mingzhong';
});
var numf=game.countPlayer(function(current){
return current.identity=='fan';
});
var cxdy=game.countPlayer(function(current){
return current.hp<=1&&get.attitude(player,current)>0;
});
if(cxdy>=1&&player.hp>1&&player.countCards('hs','tao')<=1&&player==target){
return "zeroplayertarget";
}
if(tri&&tri.name=='dying'){
if(target.hasSkill('spshanxi_bj')&&target.countCards('he')<2){
return "zeroplayertarget";
}
}
if(_status.mode=="normal"){
if(tri&&tri.name=='dying'){
if(player.identity=='zhu'&&get.attitude(player,target)>0){
if(target.identity=='zhong'||target.identity=='mingzhong'){
if((numt+target.hp)>0&&player.hp>=2){
return 1;
}else{
return 0;
}
}
if(target.identity=='nei'&&numf>=3&&player.hp>=2&&target.hasSkill('AIoptimize_1_tz')){
if((numt+target.hp)>0&&player.hp>=2){
return 1;
}else{
return 0;
}
}
if(target.identity=='fan'){
return 0;
}
}
if(player.identity=='zhong'&&get.attitude(player,target)>0){
if(target!=player&&(target.identity=='zhong'||target.identity=='mingzhong')){
if((numt+target.hp)>0){
return 1;
}else{
return 0;
}
}
if(target.identity=='zhu'){
return 1;
}
if(target.identity=='zhong'&&target==player){
return 1;
}
if(target.identity=='nei'&&numf>=3&&numz<=1&&target.hasSkill('AIoptimize_1_tz')){
if((numt+target.hp)>0&&player.hp>=2){
return 1;
}else{
return 0;
}
}
if(target.identity=='fan'){
return 0;
}
}
if(player.identity=='nei'&&(player.hasSkill('AIoptimize_1_tz')||player.hasSkill('AIoptimize_1_tf'))){
if(target.identity=='zhu'){
return 1;
}
if(player.hasSkill('AIoptimize_1_tz')&&(target.identity=='zhong'||target.identity=='mingzhong')){
if((numt+target.hp)>0&&player.hp>=2&&numf>=3&&numz<=1){
return 1;
}else{
return 0;
}
}
if(player.hasSkill('AIoptimize_1_tf')&&target.identity=='fan'&&tri.source&&tri.source!=player){
if((numt+target.hp)>0&&player.hp>=2&&numf<=1&&numz>=2){
return 1;
}else{
return 0;
}
}
}
if(player.identity=='fan'){
if(target.identity=='fan'&&tri.source&&tri.source.identity=='fan'&&get.attitude(player,target)>0){
if(target.countCards('h')>=3&&(numt+target.hp)>0){
return 1;
}else{
if(target.countCards('h')<3||(numt+target.hp)<=0){
if(player.countCards('hs','tao')>0) return 0;
}
}
}
if(target.identity=='fan'&&tri.source&&tri.source.identity!='fan'&&get.attitude(player,target)>0){
if(target==player){
return 1;
}else{
if(target!=player){
if((numt+target.hp)>0){
return 1;
}else{
if((numt+target.hp)<=0){
if(player.countCards('hs','tao')>0) return 0;
}
}
}
}
}
if(target.identity=='fan'&&!tri.source&&get.attitude(player,target)>0){
if(target==player){
return 1;
}else{
if(target!=player){
if((numt+target.hp)>0){
return 1;
}else{
if((numt+target.hp)<=0){
if(player.countCards('hs','tao')>0) return 0;
}
}
}
}
}
if(target.identity=='nei'&&numf<=1&&numz>=2&&target.hasSkill('AIoptimize_1_tf')){
if((numt+target.hp)>0&&player.hp>=2){
return 1;
}
}
if(target.identity=='zhu'||target.identity=='zhong'){
return 0;
}
}
}
}else{
if(tri&&tri.name=='dying'){
if(target==player){
return 1;
}
if(target!=player&&get.attitude(player,target)>0){
if((numt+target.hp)>0){
return 1;
}else{
if((numt+target.hp)<=0){
if(player.countCards('hs','tao')>0) return 0;
}
}
}
}
}
// if(player==target&&player.hp<=0) return 2;
if(player.hasSkillTag('nokeep',true,null,true)) return 2;
var nd=player.needsToDiscard();
var keep=false;
if(nd<=0){
keep=true;
}
else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
keep=true;
}
var mode=get.mode();
if(target.hp>=2&&keep&&target.hasFriend()){
if(target.hp>2||nd==0) return 0;
if(target.hp==2){
if(game.hasPlayer(function(current){
if(target!=current&&get.attitude(target,current)>=3){
if(current.hp<=1) return true;
if((mode=='identity'||mode=='versus'||mode=='chess')&&current.identity=='zhu'&&current.hp<=2) return true;
}
})){
return 0;
}
}
}
var att=get.attitude(player,target);
if(att<3&&att>=0&&player!=target) return 0;
if(mode=='identity'&&player.identity=='fan'&&target.identity=='fan'){
if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'&&tri.source!=target){
var num=game.countPlayer(function(current){
if(current.identity=='fan'){
return current.countCards('h','tao');
}
});
if(num>1&&player==target) return 2;
return 0;
}
}
if(mode=='identity'&&player.identity=='zhu'&&target.identity=='nei'){
if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='zhong'){
return 0;
}
}
if(mode=='stone'&&target.isMin()&&player!=target&&tri&&tri.name=='dying'&&player.side==target.side&&tri.source!=target.getEnemy()){
return 0;
}
return 2;
},
},
tag:{
recover:1,
save:1,
},
},
};
//决斗
lib.card.juedou={
audio:true,
fullskin:true,
type:"trick",
enable:true,
"yingbian_prompt":"你令此牌不可被响应",
"yingbian_tags":["hit"],
yingbian:function(event){
event.directHit.addArray(game.players);
},
filterTarget:function(card,player,target){
return target!=player;
},
content:function(){
"step 0"
if(event.turn==undefined) event.turn=target;
if(typeof event.baseDamage!='number') event.baseDamage=1;
if(typeof event.extraDamage!='number'){
event.extraDamage=0;
}
if(!event.shaReq) event.shaReq={};
if(typeof event.shaReq[player.playerid]!='number') event.shaReq[player.playerid]=1;
if(typeof event.shaReq[target.playerid]!='number') event.shaReq[target.playerid]=1;
event.playerCards=[];
event.targetCards=[];
"step 1"
event.trigger('juedou');
event.shaRequired=event.shaReq[event.turn.playerid];
"step 2"
if(event.directHit){
event._result={bool:false};
}
else{
var next=event.turn.chooseToRespond({name:'sha'});
if(event.shaRequired>1){
next.set('prompt2','共需打出'+event.shaRequired+'张杀')
}
next.set('ai',function(card){
var event=_status.event;
var player=event.splayer;
var target=event.starget;
if(player.hasSkillTag('notricksource')) return 0;
if(target.hasSkillTag('notrick')) return 0;
if(event.shaRequired>1&&player.countCards('h','sha')<event.shaRequired) return 0;
if(event.player==target){
if(player.hasSkill('naman')) return -1;
if(get.attitude(target,player)<0||event.player.hp<=1){
return get.order(card);
}
return -1;
}
else{
if(target.hasSkill('naman')) return -1;
if(get.attitude(player,target)<0||event.player.hp<=1){
return get.order(card);
}
return -1;
}
});
next.set('splayer',player);
next.set('starget',target);
next.set('shaRequired',event.shaRequired);
next.autochoose=lib.filter.autoRespondSha;
if(event.turn==target){
next.source=player;
}
else{
next.source=target;
}
}
"step 3"
if(event.target.isDead()||event.player.isDead()){
event.finish();
}
else{
if(result.bool){
event.shaRequired--;
if(event.turn==target){
if(result.cards) event.targetCards.addArray(result.cards);
if(event.shaRequired>0) event.goto(2);
else{
event.turn=player;
event.goto(1);
}
}
else{
if(result.cards) event.playerCards.addArray(result.cards);
if(event.shaRequired>0) event.goto(2);
else{
event.turn=target;
event.goto(1);
}
}
}
else{
if(event.turn==target){
target.damage(event.baseDamage+event.extraDamage);
}
else{
player.damage(target,event.baseDamage+event.extraDamage);
}
}
}
},
ai:{
wuxie:function(target,card,player,viewer){
if(player==game.me&&get.attitude(viewer,player)>0){
return 0;
}
},
basic:{
order:5,
useful:1,
value:5.5,
},
result:{
target:-1,
player:function(player,target,card){
if(player.hasSkillTag('directHit_ai',true,{
target:target,
card:card,
},true)){
return 0;
}
if(get.damageEffect(target,player,target)>0&&get.attitude(player,target)>0){
return 0;
}
var hs1=target.countCards('hs','sha');
var hs2=player.countCards('hs','sha');
if(hs1>(hs2+1)){
return -1.5;
}
if(player.hp==1&&hs2==0&&hs1>=1){
return -1.5;
}
var hsx1=target.countCards('hs');
var hsx2=player.countCards('hs');
if(hsx1.length==0){
return 0;
}
if(hsx1>3&&hs2==0){
return -1.5;
}
if(hs2>=3&&hsx1<=hsx2){
return 0;
}
return -0.5;
},
},
tag:{
respond:2,
respondSha:2,
damage:1,
},
},
selectTarget:1,
};
//过河拆桥
lib.card.guohe={
audio:true,
fullskin:true,
type:"trick",
enable:true,
selectTarget:1,
postAi:function(targets){
return targets.length==1&&targets[0].countCards('j');
},
filterTarget:function(card,player,target){
if(player==target) return false;
return target.countDiscardableCards(player,get.is.single()?'he':'hej');
},
"yingbian_prompt":"当你使用此牌选择目标后，你可为此牌增加一个目标",
"yingbian_tags":["add"],
yingbian:function(event){
event.yingbian_addTarget=true;
},
content:function(){
'step 0'
if(!get.is.single()&&target.countDiscardableCards(player,'hej')){
if(player.hasSkill('hengwu')&&!game.hasPlayer(function(current){
return get.attitude(player,current)>0&&current.countCards('j')&&player.canUse('guohe',current);
})){
player.discardPlayerCard('hej',target,true).set('ai',function(button){
var player=_status.event.player;
var target=_status.event.target;
var att=get.attitude(player,target);
var val=get.buttonValue(button);
if(player.hasSkill('hengwu')&&att<0){
if(get.subtype(button.link)=='equip4') return 0
if(get.subtype(button.link)=='equip3'&&(player.inRange(target)||player.hasCard(function(card){return get.subtype(card)=='equip1'},'he'))) return 0;
return val;
}
});
}else{
player.discardPlayerCard('hej',target,true);
}
event.finish();
}
else{
var bool1=target.countDiscardableCards(player,'h');
var bool2=target.countDiscardableCards(player,'e');
if(bool1&&bool2){
player.chooseControl('手牌区','装备区').set('ai',function(){
return Math.random()<0.5?1:0;
}).set('prompt','弃置'+(get.translation(target))+'装备区的一张牌，或观看其手牌并弃置其中的一张牌。');
}
else event._result={control:bool1?'手牌区':'装备区'};
}
'step 1'
var pos=result.control=='手牌区'?'h':'e';
player.discardPlayerCard(target,pos,true,'visible');
},
ai:{
basic:{
order:9,
useful:5,
value:5,
},
yingbian:function(card,player,targets,viewer){
if(get.attitude(viewer,player)<=0) return 0;
if(game.hasPlayer(function(current){
return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
})) return 6;
return 0;
},
result:{
target:function(player,target){
var att=get.attitude(player,target);
var nh=target.countCards('h');
if(att>0){
if(target.countCards('j',function(card){
var cardj=card.viewAs?{name:card.viewAs}:card;
return get.effect(target,cardj,target,player)<0;
})>0) return 5;
if(target.getEquip('baiyin')&&target.isDamaged()&&get.recoverEffect(target,player,player)>0){
if(target.hp==1) return 3;
return 1;
}
if(target.countCards('e',function(card){
if(get.position(card)=='e') return get.value(card,target)<0;
})>0) return 1;
}
if(att<=0&&target.countCards('he')) return -1.5;
if(att<0&nh<=0&&(!target.getEquip(2)||!target.getEquip(3)||!target.getEquip(5))){
return 0;
}
var es=target.getCards('e');
var noe=(es.length==0||target.hasSkillTag('noe'));
var noe2=(es.filter(function(esx){
return get.value(esx,target)>0;
}).length==0);
var noh=(nh==0||target.hasSkillTag('noh'));
if(noh&&(noe||noe2)) return 0;
if(att<=0&&!target.countCards('he')) return 1.5;
return -1.5;
},
},
tag:{
loseCard:1,
discard:1,
},
},
};
//顺手牵羊
lib.card.shunshou={
audio:true,
fullskin:true,
type:"trick",
enable:true,
range:{
global:1,
},
selectTarget:1,
postAi:function(targets){
return targets.length==1&&targets[0].countCards('j');
},
filterTarget:function(card,player,target){
if(player==target) return false;
return target.countGainableCards(player,get.is.single()?'he':'hej')>0;
},
content:function(){
var position=get.is.single()?'he':'hej';
if(target.countGainableCards(player,position)){
if(player.hasSkill('hengwu')&&!game.hasPlayer(function(current){
return get.attitude(player,current)>0&&current.countCards('j')&&player.canUse('shunshou',current);
})){
player.gainPlayerCard(position,target,true).set('ai',function(button){
var player=_status.event.player;
var target=_status.event.target;
var att=get.attitude(player,target);
var val=get.buttonValue(button);
if(player.hasSkill('hengwu')&&att<0){
if(get.subtype(button.link)=='equip4'&&player.countCards('he',function(card){return get.subtype(card)=='equip4'})) return 0
if(get.subtype(button.link)=='equip3'&&player.countCards('he',function(card){return get.subtype(card)=='equip3'})) return 0;
return val;
}
});
}else{
player.gainPlayerCard(position,target,true);
}
}
},
ai:{
wuxie:function(target,card,player,viewer){
if(get.attitude(viewer,player)>0&&get.attitude(viewer,target)>0){
return 0;
}
},
basic:{
order:7.5,
useful:4,
value:9,
},
result:{
target:function(player,target){
if(get.attitude(player,target)<=0) return (target.countCards('he',function(card){
return get.value(card,target)>0&&card!=target.getEquip('jinhe');
})>0)?-1.5:1.5;
return (target.countCards('ej',function(card){
if(get.position(card)=='e') return get.value(card,target)<=0;
var cardj=card.viewAs?{name:card.viewAs}:card;
return get.effect(target,cardj,target,player)<0;
})>0)?1.5:-1.5;
},
player:function(player,target){
if(get.attitude(player,target)<0&&!target.countCards('he',function(card){
return get.value(card,target)>0&&card!=target.getEquip('jinhe');
})){
return 0;
}
if(get.attitude(player,target)>1){
return (target.countCards('ej',function(card){
if(get.position(card)=='e') return get.value(card,target)<=0;
var cardj=card.viewAs?{name:card.viewAs}:card;
return get.effect(target,cardj,target,player)<0;
})>0)?1.5:-1.5;
}
return 1;
},
},
tag:{
loseCard:1,
gain:1,
},
},
};
//南蛮入侵
lib.card.nanman={
audio:true,
fullskin:true,
type:"trick",
enable:true,
selectTarget:-1,
"yingbian_prompt":"当你使用此牌选择目标后，你可为此牌减少一个目标",
"yingbian_tags":["remove"],
yingbian:function(event){
event.yingbian_removeTarget=true;
},
filterTarget:function(card,player,target){
return target!=player;
},
reverseOrder:true,
content:function(){
"step 0"
if(typeof event.baseDamage!='number') event.baseDamage=1;
if(event.directHit) event._result={bool:false};
else{
var next=target.chooseToRespond({name:'sha'});
next.set('ai',function(card){
var evt=_status.event.getParent();
if(get.damageEffect(evt.target,evt.player,evt.target)>=0) return 0;
if(evt.player.hasSkillTag('notricksource')) return 0;
if(evt.target.hasSkillTag('notrick')) return 0;
return get.order(card);
});
next.autochoose=lib.filter.autoRespondSha;
}
"step 1"
if(result.bool==false){
target.damage(event.baseDamage,event.customSource||player);
}
},
ai:{
wuxie:function(target,card,player,viewer,status){
var cxdy=game.countPlayer(function(current){
return current.hp==1&&current!=viewer&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&get.attitude(current,viewer)>0;
});
if(get.mode()!='identity'){
if(cxdy>0&&viewer.hp>1&&(viewer.hp+viewer.hujia+viewer.countCards('hs','jiu')>1)&&get.attitude(viewer,target)>0&&target.hp>1){
return 0;
}
}
if(get.mode()=='identity'){
if((viewer.identity=='zhong'||viewer.identity=='nei')&&(viewer.hp+viewer.hujia+viewer.countCards('hs','jiu')>1)&&game.zhu.hp==1&&game.zhu.hujia<1&&!target.isZhu){
return 0;
}
if(viewer.identity=='fan'&&cxdy>0&&(viewer.hp+viewer.hujia+viewer.countCards('hs','jiu')>1)&&get.attitude(viewer,target)>0&&target.hp>1){
return 0;
}
}
let att=get.attitude(viewer,target);
if(status*att<0) return 0;
let evt=_status.event.getParent('useCard'),t=target,has=0;
if(viewer==target) return;
if(att>0&&viewer.hasSkillTag('viewHandcard',null,target,true)){
if(target.hasCard(function(card){
return get.name(card,target)=='sha'&&lib.filter.cardRespondable(card,target);
},'h')||target.hasCard(function(card){
return get.name(card)=='wuxie'&&lib.filter.cardEnabled(card,target);
},'h')) return 0;
if(!target.hasSkillTag('respondSha',true,'respond',true)) return;
}
if(get.attitude(viewer,target)<=0) has=-1;
if(evt&&evt.targets){
if(!evt.targets.contains(viewer)) has=-1;
for(let i=0;i<evt.targets.length;i++){
if(has||evt.targets[i]==viewer) break;
if(evt.targets[i]==target){
has=1;
break;
}
}
}
if(has==1){
if(target.isZhu){
if(target.hp>viewer.hp&&(target.hp>2||target.countCards('hs')>viewer.countCards('hs'))) return 0;
}
else if(viewer.hp<=target.hp&&!viewer.countCards('hs','sha')&&!viewer.hasSkillTag('respondSha',true,'respond',true)||target.countCards('hs')>3||target.countCards('hs')&&Math.random()<0.3) return 0;
}
else{
if(target.hp>4||target.countCards('hs')>3||target.hp>2&&Math.random()<1/(4+target.countCards('hs'))||target.hp>viewer.hp&&target.hasSkillTag('respondSha',true,'respond',true)) return 0;
}
},
basic:{
order:function(item,player){
if(player.countCards('hs','juedou')>0&&player.countCards('hs','sha')==0){
return get.order({name:'juedou'})+0.5;
}
var cxdr=game.countPlayer(function(current){
return current.hp==1&&current!=player&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&get.attitude(current,player)<=0;
});
if(cxdr>0){
return get.order({name:'sha'})+0.5;
}
return get.order({name:'sha'})-0.5;
},
useful:[5,1],
value:5,
},
result:{
"target_use":function(player,target){
if(player.hasUnknown(2)&&get.mode()!='guozhan') return 0;
var nh=target.countCards('h');
if(get.mode()=='identity'){
if(target.isZhu&&nh<=2&&target.hp<=1){
if(player.identity=='nei'){
return -1;
}
return -100;
}
}
if(nh==0) return -2;
if(nh==1) return -1.7
return -1.5;
},
target:function(player,target){
var nh=target.countCards('h');
if(get.mode()=='identity'){
if(target.isZhu&&nh<=2&&target.hp<=1){
if(player.identity=='nei'){
return -1;
}
return -100;
}
}
if(nh==0) return -2;
if(nh==1) return -1.7
return -1.5;
},
},
tag:{
respond:1,
respondSha:1,
damage:1,
multitarget:1,
multineg:1,
},
},
};
//万箭齐发
lib.card.wanjian={
audio:true,
fullskin:true,
type:"trick",
enable:true,
selectTarget:-1,
reverseOrder:true,
"yingbian_prompt":"当你使用此牌选择目标后，你可为此牌减少一个目标",
"yingbian_tags":["remove"],
yingbian:function(event){
event.yingbian_removeTarget=true;
},
filterTarget:function(card,player,target){
return target!=player;
},
content:function(){
"step 0"
if(typeof event.baseDamage!='number') event.baseDamage=1;
if(event.directHit) event._result={bool:false};
else{
var next=target.chooseToRespond({name:'shan'});
next.set('ai',function(card){
var evt=_status.event.getParent();
if(get.damageEffect(evt.target,evt.player,evt.target)>=0) return 0;
if(evt.player.hasSkillTag('notricksource')) return 0;
if(evt.target.hasSkillTag('notrick')) return 0;
if(evt.target.hasSkillTag('noShan')){
return -1;
}
return get.order(card);
});
next.autochoose=lib.filter.autoRespondShan;
}
"step 1"
if(result.bool==false){
target.damage(event.baseDamage);
}
},
ai:{
wuxie:function(target,card,player,viewer,status){
var cxdy=game.countPlayer(function(current){
return current.hp==1&&current!=viewer&&(!current.hasSkill('tengjia1')&&!current.hasSkill('rw_tengjia1'))&&get.attitude(current,viewer)>0;
});
if(get.mode()!='identity'){
if(cxdy>0&&viewer.hp>1&&(viewer.hp+viewer.hujia+viewer.countCards('hs','jiu')>1)&&get.attitude(viewer,target)>0&&target.hp>1){
return 0;
}
}
if(get.mode()=='identity'){
if((viewer.identity=='zhong'||viewer.identity=='nei')&&(viewer.hp+viewer.hujia+viewer.countCards('hs','jiu')>1)&&game.zhu.hp==1&&game.zhu.hujia<1&&get.attitude(viewer,target)>0&&target.identity!='zhu'){
return 0;
}
if(viewer.identity=='fan'&&cxdy>0&&(viewer.hp+viewer.hujia+viewer.countCards('hs','jiu')>1)&&get.attitude(viewer,target)>0&&target.hp>1){
return 0;
}
}
let att=get.attitude(viewer,target);
if(status*att<0) return 0;
let evt=_status.event.getParent('useCard'),t=target,has=0;
if(viewer==target) return;
if(att>0&&viewer.hasSkillTag('viewHandcard',null,target,true)){
if(target.hasCard(function(card){
return get.name(card,target)=='shan'&&lib.filter.cardRespondable(card,target);
},'h')||target.hasCard(function(card){
return get.name(card)=='wuxie'&&lib.filter.cardEnabled(card,target);
},'h')) return 0;
if(!target.hasSkillTag('respondShan',true,'respond',true)) return;
}
if(get.attitude(viewer,target)<=0) has=-1;
if(evt&&evt.targets){
if(!evt.targets.contains(viewer)) has=-1;
for(let i=0;i<evt.targets.length;i++){
if(has||evt.targets[i]==viewer) break;
if(evt.targets[i]==target){
has=1;
break;
}
}
}
if(has==1){
if(target.isZhu){
if(target.hp>viewer.hp&&(target.hp>2||target.countCards('hs')>viewer.countCards('hs'))) return 0;
}
else if(viewer.hp<=target.hp&&!viewer.countCards('hs','shan')&&!viewer.hasSkillTag('respondShan',true,'respond',true)||target.countCards('hs')>2||target.countCards('hs')&&Math.random()<0.4) return 0;
}
else{
if(target.hp>4||target.countCards('hs')>2||target.hp>2&&Math.random()<1/(3+target.countCards('hs'))||target.hp>viewer.hp&&target.hasSkillTag('respondShan',true,'respond',true)) return 0;
}
},
basic:{
order:function(item,player){
return get.order({name:'sha'})+0.5;
},
useful:1,
value:5,
},
result:{
"target_use":function(player,target){
if(player.hasUnknown(2)&&get.mode()!='guozhan') return 0;
var nh=target.countCards('h');
if(target.isZhu&&nh<=2&&target.hp<=1){
if(player.identity=='nei'){
return -1;
}
return -100;
}
if(nh==0) return -2;
if(nh==1) return -1.7
return -1.5;
},
target:function(player,target){
var nh=target.countCards('h');
if(get.mode()=='identity'){
if(target.isZhu&&nh<=2&&target.hp<=1){
if(player.identity=='nei'){
return -1;
}
return -100;
}
}
if(nh==0) return -2;
if(nh==1) return -1.7
return -1.5;
},
},
tag:{
respond:1,
respondShan:1,
damage:1,
multitarget:1,
multineg:1,
},
},
};
//桃园结义
lib.card.taoyuan={
audio:true,
fullskin:true,
type:"trick",
enable:true,
selectTarget:-1,
cardcolor:"red",
reverseOrder:true,
"yingbian_prompt":"当你使用此牌选择目标后，你可为此牌减少一个目标",
"yingbian_tags":["remove"],
yingbian:function(event){
event.yingbian_removeTarget=true;
},
filterTarget:function(card,player,target){
//return target.hp<target.maxHp;
return true;
},
ignoreTarget:function(card,player,target){
return target.isHealthy();
},
content:function(){
target.recover();
},
ai:{
basic:{
order:function(item,player){
var ssdy=game.countPlayer(function(current){
return current.getDamagedHp()&&get.attitude(current,player)>0&&get.recoverEffect(current,player,player)>0;
});
var ssdr=game.countPlayer(function(current){
return current.hp==1&&get.attitude(current,player)<=0;
});
var cxdy=game.countPlayer(function(current){
return current.hp==1&&get.attitude(current,player)>0&&get.recoverEffect(current,player,player)>0;
});
var cxdr=game.countPlayer(function(current){
return current.getDamagedHp()&&get.attitude(current,player)<=0;
});
if(ssdy>ssdr&&ssdr==0){
return get.order({name:'wanjian'})+1;
}
if(ssdy>ssdr&&cxdy>0){
return get.order({name:'wanjian'})+1;
}
if(cxdr>cxdy){
return get.order({name:'nanman'})-1;
}
},
useful:[3,1],
value:0,
},
result:{
target:function(player,target){
return (target.hp<target.maxHp)?2:0;
},
},
tag:{
recover:0.5,
multitarget:1,
},
},
};
lib.card.huogong={
audio:true,
fullskin:true,
type:'trick',
enable:true,
cardcolor:'red',
cardnature:'fire',
filterTarget:function(card,player,target){
return target.countCards('h')>0;
},
content:function(){
'step 0'
if(target.countCards('h')==0){
event.finish();
return;
}
target.chooseCard(true).ai=function(card){
if(_status.event.getRand()<0.5) return Math.random();
return get.value(card);
};
'step 1'
event.dialog=ui.create.dialog(get.translation(target)+'展示的手牌',result.cards);
event.videoId=lib.status.videoId++;
game.broadcast('createDialog',event.videoId,get.translation(target)+'展示的手牌',result.cards);
game.addVideo('cardDialog',null,[get.translation(target)+'展示的手牌',get.cardsInfo(result.cards),event.videoId]);
event.card2=result.cards[0];
game.log(target,'展示了',event.card2);
event._result={};
player.chooseToDiscard({suit:get.suit(event.card2)},function(card){
let evt=_status.event.getParent();
if(get.damageEffect(evt.target,evt.player,evt.player,'fire')>0) return 8-get.value(card,evt.player);
return -1;
}).set('prompt',false);
game.delay(2);
'step 2'
if(result.bool) target.damage('fire',event.baseDamage||1);
else target.addTempSkill('huogong2');
event.dialog.close();
game.addVideo('cardDialog',null,event.videoId);
game.broadcast('closeDialog',event.videoId);
},
ai:{
basic:{
order:9.2,
value:[3,1],
useful:0.6,
},
wuxie:function(target,card,player,viewer,status){
if(status*get.attitude(viewer,target)<0||get.attitude(viewer,player)>=0||Math.random()*4>player.countCards('h')) return 0;
},
result:{
player:function(player,target){
if(get.attitude(player,target)>0) return -1;
let evt=_status.event,h=1,suits=[];
if(!ui.selected.cards) h=0;
let ph=player.getCards('h',function(card){
if(h>0&&ui.selected.cards.contains(card)) return false;
if(!h&&get.name(card)=='huogong'){
h=-1;
return false;
}
let suit=get.suit(card);
if(!suits.contains(suit)) suits.push(suit);
return true;
});
if(!ph.length){
if(player.hasSkillTag('noh')&&player.countCards('h')) return 0;
return -10;
}
if(suits.length<4){
if(player.hasSkillTag('viewHandcard',null,target,true)){
let has=0;
for(let i of target.getCards('h')){
if(suits.contains(get.suit(i,target))) has++;
}
if(!has) return -10;
if(has==target.countCards('h')) return -1;
}
if(target.hasSkill('huogong2')) return -1.6;
if(suits.length&&player.needsToDiscard()) return -0.8/player.needsToDiscard();
if(Math.random()>suits.length/4) return -10;
if(ph.length<=player.hp&&evt.name=='chooseToUse'){
if(typeof evt.filterCard=='function'&&evt.filterCard({name:'huogong'},player,evt)) return -1.35;
if(evt.skill){
let viewAs=get.info(evt.skill).viewAs;
if(viewAs=='huogong') return -1.35;
if(viewAs&&viewAs.name=='huogong') return -1.35;
}
}
}
return -1;
},
target:function(player,target){
if(get.attitude(player,target)>0) return "zeroplayertarget";
if(target.countCards('h')==0) return 0;
let evt=_status.event,h=1,suits=[];
if(!ui.selected.cards) h=0;
let ph=player.getCards('h',function(card){
if(h>0&&ui.selected.cards.contains(card)) return false;
if(!h&&get.name(card)=='huogong'){
h=-1;
return false;
}
let suit=get.suit(card);
if(!suits.contains(suit)) suits.push(suit);
return true;
});
if(!ph.length) return 0;
if(target==player){
if(typeof evt.filterCard=='function'&&evt.filterCard({name:'huogong'},player,evt)) return -1.15;
if(evt.skill){
let viewAs=get.info(evt.skill).viewAs;
if(viewAs=='huogong') return -1.15;
if(viewAs&&viewAs.name=='huogong') return -1.15;
}
return 0;
}
if(target.hasSkill('huogong2')&&suits.length<4) return 0;
if(get.attitude(player,target)>=0) return -0.15;
if(player.hasSkillTag('viewHandcard',null,target,true)) return -0.5*suits.length;
return -0.45*suits.length;
}
},
tag:{
damage:1,
fireDamage:1,
natureDamage:1,
discard:0.5,
norepeat:1
}
}
};
//铁索
lib.card.tiesuo={
audio:true,
fullskin:true,
type:'trick',
enable:true,
filterTarget:true,
cardcolor:'black',
selectTarget:[1,2],
complexTarget:true,
content:function(){
target.link();
},
chongzhu:true,
wuxie:function(target,card,player,viewer){
if(target.hasSkillTag('nodamage')||target.hasSkillTag('nofire')||target.hasSkillTag('nothunder')||_status.event.getRand()<0.5||get.attitude(viewer,player)>0) return 0;
},
ai:{
basic:{
order:7,
useful:4,
value:4,
},
result:{
target:function(player,target){
if(target.hasSkillTag('link')) return 0;
let curs=game.filterPlayer(function(current){
if(current.hasSkillTag('nodamage')) return false;
return !current.hasSkillTag('nofire')||!current.hasSkillTag('nothunder');
});
if(curs.length<=1) return 0;
let f=target.hasSkillTag('nofire'),t=target.hasSkillTag('nothunder'),res=0.9;
if(f&&t||target.hasSkillTag('nodamage')) return 0;
if(f||t) res=0.45;
if(target.getEquip('tengjia')) res*=2;
if(!target.isLinked()) res=-res;
if(ui.selected.targets.length) return res;
let fs=0,es=0,att=get.attitude(player,target),linkf=false,alink=true;
for(let i of curs){
let atti=get.attitude(player,i);
if(atti>0){
fs++;
if(i.isLinked()) linkf=true;
}
if(atti<0){
es++;
if(!i.isLinked()) alink=false;
}
}
if(es==1&&!alink){
if(att<=0||att>0&&linkf&&fs<=1) return 0;
}
return res;
}
},
tag:{
multitarget:1,
multineg:1,
norepeat:1
}
}
};
*/
//奇正相生
lib.card.qizhengxiangsheng={
enable:true,
type:"trick",
fullskin:true,
derivation:"shen_xunyu",
filterTarget:function(card,player,target){
return player!=target;
},
content:function(){
'step 0'
if(!event.qizheng_name){
if(player.isAlive()) player.chooseControl('奇兵','正兵').set('prompt','请选择'+get.translation(target)+'的标记').set('choice',function(){
var e1=1.5*get.sgn(get.damageEffect(target,player,target));
var e2=0;
if(target.countGainableCards(player,'h')>0&&!target.hasSkillTag('noh')) e2=-1;
var es=target.getGainableCards(player,'e');
if(es.length) e2=Math.min(e2,function(){
var max=0;
for(var i of es) max=Math.max(max,get.value(i,target))
return -max/4;
}());
if(Math.abs(e1-e2)<=0.3) return Math.random()<0.5?'奇兵':'正兵';
if(e1<e2) return '奇兵';
return '正兵';
}()).set('ai',function(){
return _status.event.choice;
});
else event.finish();
}
'step 1'
if(!event.qizheng_name&&result&&result.control) event.qizheng_name=result.control;
if(event.directHit) event._result={bool:false};
else target.chooseToRespond('请打出一张杀或闪响应奇正相生',function(card,player){
var name=get.name(card);
return name=='sha'||name=='shan';
}).set('ai',function(card){
if(_status.event.choice=='all'){
var rand=get.rand('qizhengxiangsheng');
if(rand>0.5) return 0;
return 1+Math.random();
}
if(get.name(card)==_status.event.choice) return get.order(card);
return 0;
}).set('choice',function(){
if(target.hasSkillTag('useShan')) return 'shan';
if(typeof event.qizheng_aibuff=='boolean'){
var shas=target.getCards('h','sha'),shans=target.getCards('h','shan');
if(event.qizheng_aibuff){
if(shas.length>=Math.max(1,shans.length)) return 'shan';
if(shans.length>shas.length) return 'sha';
return false;
}
if(!shas.length||!shans.length) return false;
}
var e1=1.5*get.sgn(get.damageEffect(target,player,target));
var e2=0;
if(target.countGainableCards(player,'h')>0&&!target.hasSkillTag('noh')) e2=-1;
var es=target.getGainableCards(player,'e');
if(es.length) e2=Math.min(e2,function(){
var max=0;
for(var i of es) max=Math.max(max,get.value(i,target))
return -max/4;
}());
if(e1-e2>=0.3) return 'shan';
if(e2-e1>=0.3) return 'sha';
return 'all';
}());
'step 2'
var name=result.bool?result.card.name:null,require=event.qizheng_name;
if(require=='奇兵'&&name!='sha') target.damage();
else if(require=='正兵'&&name!='shan'&&target.countGainableCards(player,'he')>0) player.gainPlayerCard(target,true,'he');
},
ai:{
order:5,
tag:{
damage:0.5,
gain:0.5,
loseCard:1,
respondShan:1,
respondSha:1,
},
result:{
player:function(player,target,card){
if(target.hasSkill('tianzuo_remove')){
return 'zeroplayertarget';
}
},
target:function(player,target){
if(target.hasSkill('tianzuo_remove')){
return 'zeroplayertarget';
}
var e1=1.5*get.sgn(get.damageEffect(target,player,target));
var e2=0;
if(target.countGainableCards(player,'h')>0&&!target.hasSkillTag('noh')) e2=-1;
var es=target.getGainableCards(player,'e');
if(es.length) e2=Math.min(e2,function(){
var max=0;
for(var i of es) max=Math.max(max,get.value(i,target))
return -max/4;
}());
if(game.hasPlayer(function(current){
return current.hasSkill('tianzuo')&&get.attitude(current,player)<=0;
})) return Math.max(e1,e2);
return Math.min(e1,e2);
},
},
},
selectTarget:1,
};
/*本体优化*/
		},
	};
});
