window.addEventListener('load', function () {
  var
    img = new Image,
    ctx = document.getElementById('myCanvas').getContext('2d');

  img.src = 'assets/img/plane/red-biplane-hi.png';
  img.addEventListener('load', function () {

    var interval = setInterval(function() {
      var x = 50, y = 100;

      return function () {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.rotate(-1*Math.PI/180);
        ctx.drawImage(img, x, y, 10, 5);

        x -= 1;
        if (x <= -30 ){
          x = ctx.canvas.width;
        }
      };
    }(), 1000/40);
  }, false);
}, false);