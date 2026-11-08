const WarehouseElectrical = (() => {
  const sparkDuration = 520;
  function label(ctx, word, x, y, width) {
    ctx.fillStyle = '#fff5d1';
    ctx.font = 'bold 17px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, x, y, width);
  }
  function plug(ctx, x, y, word) {
    const rect = (dx, dy, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x+dx,y+dy,w,h); };
    rect(-17,-26,34,34,'#10101b');
    rect(-13,-22,26,24,'#e5e8eb');
    rect(-12,-34,7,13,'#ffcd52');
    rect(5,-34,7,13,'#ffcd52');
    rect(-4,2,8,12,'#10101b');
    rect(-4,-17,8,14,'#d08b23');
    rect(-64,15,128,23,'#111726');
    label(ctx,word,x,y+27,118);
  }
  function station(ctx, z, word, lit, connected) {
    const x=z.x+69, y=z.y+36;
    const rect = (dx, dy, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x+dx,y+dy,w,h); };
    rect(-69,-36,138,72,'#0c1424');
    rect(-66,-33,132,66,'#34465c');
    rect(-17,-6,34,25,'#e6ddd0');
    rect(-13,-3,26,18,'#bab2a7');
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
    label(ctx,word,x,y+25,124);
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
    ctx.fillStyle='#111726';ctx.fillRect(source.x-69,source.y-39,138,78);
    ctx.fillStyle='#91703c';ctx.fillRect(source.x-65,source.y-35,130,70);
    ctx.fillStyle='#2d3442';ctx.fillRect(source.x-60,source.y-30,120,60);
    label(ctx,'POWER BOX',source.x,source.y-19,110);
    if(!s.carrying&&!s.powering&&word)plug(ctx,source.x,source.y+9,word);
  }
  return {sparkDuration,plug,draw};
})();
