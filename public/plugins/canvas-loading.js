function canvalLoading(elementId){
  var c=document.getElementById(elementId),
    ctx=c.getContext('2d'),
    pi = Math.PI,
    xCenter = c.width/2,
    yCenter = c.height/2,
    radius = c.width/3,
    startSize = radius/3,
    num=5,
    posX=[],posY=[],angle,size,i;

  window.setInterval(function() {
    num++;
    ctx.clearRect ( 0 , 0 , xCenter*2 , yCenter*2 );
    for (i=0; i<9; i++){
      ctx.beginPath();
      ctx.fillStyle = 'rgba(137, 4, 206, 1)';
      if (posX.length==i){
        angle = pi*i*.25;
        posX[i] = xCenter + radius * Math.cos(angle);
        posY[i] = yCenter + radius * Math.sin(angle);
      }
      ctx.arc(
        posX[(i+num)%8],
        posY[(i+num)%8],
        startSize/9*i,
        0, pi*2, 1); 
      ctx.fill();
    }
  }, 100);
  
}