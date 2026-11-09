const WarehouseElectrical = (() => {
  const sparkDuration = 520;
  function label(ctx, word, x, y, width) {
    ctx.fillStyle = '#fff5d1';
    ctx.font = 'bold 25px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, x, y, width);
  }
  function plug(ctx, x, y, word) {
    const rect = (dx, dy, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x+dx,y+dy,w,h); };
    rect(-17,-26,34,34,'#10101b');
    rect(-13,-22,26,24,'#bcc7d2');
    rect(-13,-22,26,5,'#fff8e7');
    rect(-13,-17,4,17,'#e6edf2');
    rect(9,-17,4,17,'#738498');
    rect(-8,-12,16,2,'#8194a7');
    rect(-8,-7,16,2,'#8194a7');
    rect(-12,-34,7,13,'#ffcd52');
    rect(5,-34,7,13,'#ffcd52');
    rect(-4,2,8,12,'#10101b');
    rect(-1,-15,5,5,'#ffe16c');
    rect(-4,-10,8,4,'#ffca47');
    rect(-4,-6,4,4,'#e79833');
    rect(-70,15,140,28,'#111726');
    label(ctx,word,x,y+29,130);
  }
  function station(ctx, z, word, lit, connected) {
    const x=z.x+69, y=z.y+36;
    const rect = (dx, dy, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x+dx,y+dy,w,h); };
    rect(-69,-36,138,72,'#0c1424');
    rect(-66,-33,132,66,'#52667c');
    rect(-63,-29,126,59,'#30455e');
    rect(-63,-29,3,59,'#627990');
    rect(58,-29,5,59,'#223245');
    rect(-58,-25,4,4,'#9aafbd');
    rect(54,-25,4,4,'#9aafbd');
    rect(-17,-6,34,25,'#e6ddd0');
    rect(-13,-3,26,18,'#bab2a7');
    rect(-13,-3,26,3,'#fff4db');
    rect(-13,12,26,3,'#817b77');
    rect(-9,1,5,8,'#171923');
    rect(4,1,5,8,'#171923');
    if(connected)rect(-13,1,26,14,'#e8edf0');
    if(lit){
      rect(-16,-32,32,20,'#845527');
      rect(-2,-35,4,4,'#fff19e');
      rect(-19,-25,4,4,'#ffb443');
      rect(15,-25,4,4,'#ffb443');
    }
    rect(-11,-29,22,14,lit?'#ffce4e':'#78818a');
    rect(-7,-32,14,20,lit?'#ffe982':'#a3abb2');
    rect(-5,-12,10,5,'#4f5664');
    rect(-5,-11,10,2,'#8797a7');
    rect(-7,-27,5,3,lit?'#fff9db':'#d0d7dd');
    rect(2,-18,5,3,lit?'#d98932':'#758290');
    rect(-65,18,130,30,'#101726');
    label(ctx,word,x,y+33,122);
  }
  function cable(ctx, source, x, y, lane, progress) {
    const bend=source.y+lane;
    const points=[[source.x,source.y],[source.x,bend],[x,bend],[x,y]];
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for(const point of points.slice(1))ctx.lineTo(...point);
    ctx.strokeStyle='#101423';ctx.lineWidth=7;ctx.stroke();
    ctx.strokeStyle='#f4ac48';ctx.lineWidth=3;ctx.stroke();
    if(progress===undefined||progress>=1)return;
    const lengths=[Math.abs(bend-source.y),Math.abs(x-source.x),Math.abs(y-bend)];
    let travel=progress*lengths.reduce((a,b)=>a+b,0);
    for(let i=0;i<lengths.length;i++){
      const length=lengths[i];
      if(!length||travel>length){travel-=length;continue;}
      const [ax,ay]=points[i], [bx,by]=points[i+1];
      const sx=ax+(bx-ax)*travel/length, sy=ay+(by-ay)*travel/length;
      ctx.fillStyle='#ffb743';ctx.fillRect(sx-6,sy-6,12,12);
      ctx.fillStyle='#fff9c1';ctx.fillRect(sx-3,sy-3,6,6);
      break;
    }
  }
  function draw(ctx,s,zones,source,word){
    const lane=i=>12+i*6;
    for(const [i,at] of s.connections){
      const z=zones[s.positions[i]];
      cable(ctx,source,z.x+69,z.y+45,lane(i),Math.min(1,(s.elapsed-at)/sparkDuration));
    }
    if(s.carrying)cable(ctx,source,s.x,s.y-101,lane(s.order[s.index]));
    s.roundPairs.forEach((pair,i)=>{
      const at=s.connections.get(i);
      station(ctx,zones[s.positions[i]],pair[0],at!==undefined&&s.elapsed-at>=sparkDuration,at!==undefined);
    });
    ctx.fillStyle='#111726';ctx.fillRect(source.x-122,source.y-49,244,98);
    ctx.fillStyle='#a27d42';ctx.fillRect(source.x-118,source.y-45,236,90);
    ctx.fillStyle='#3d4857';ctx.fillRect(source.x-113,source.y-40,226,80);
    ctx.fillStyle='#1c2738';ctx.fillRect(source.x-109,source.y-36,218,72);
    ctx.fillStyle='#2e4055';ctx.fillRect(source.x-27,source.y-23,128,32);
    label(ctx,'POWER BOX',source.x+37,source.y-7,120);
    const socketX=source.x-52;
    ctx.fillStyle='#e6ddd0';ctx.fillRect(socketX-25,source.y-30,50,36);
    ctx.fillStyle='#bab2a7';ctx.fillRect(socketX-20,source.y-26,40,28);
    ctx.fillStyle='#171923';
    ctx.fillRect(socketX-12,source.y-20,7,12);
    ctx.fillRect(socketX+5,source.y-20,7,12);
    for(let i=0;i<4;i++){
      ctx.fillStyle=i<s.connections.size?'#ffdd64':'#8193a1';
      ctx.fillRect(source.x+9+i*14,source.y+22,7,5);
    }
    if(!s.carrying&&!s.powering&&word)plug(ctx,socketX,source.y+5,word);
  }
  return {sparkDuration,plug,draw};
})();
