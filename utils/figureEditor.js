(function (self, $, undefined) {
  // figure editor
  self.figureEditor = function (param) {
    /*
     * PRIVATE
     */
    var that = {
      image: null,
      param: null,
      scale: 1,
      cropPoints: [],
      loaderCb: function() {}
    };
    that.param = param;

    var getCanvas = function () {
      if ('canvas' in that.param) {
        return that.param.canvas;
      }
      return document.getElementById(that.param.id);
    };
    var getContext = function () {
      return getCanvas().getContext('2d');
    };
    var loader = function () {
      that.img.removeEventListener("load", loader);
      console.log('loaded');
      that.loaderCb();
      drawImage();
    };
    var drawCropPoints = function () {
      drawImage();
      var context = getContext();
      var canvas = getCanvas();
      for (var k = 0; k < that.cropPoints.length; k++) {
        // vertical
        context.beginPath();
        context.moveTo(that.cropPoints[k].x, 0);
        context.lineTo(that.cropPoints[k].x, canvas.height);
        context.stroke();
        // horizontal
        context.beginPath();
        context.moveTo(0, that.cropPoints[k].y);
        context.lineTo(canvas.width, that.cropPoints[k].y);
        context.stroke();
      }
    };
    var drawImage = function () {
      var canvas = getCanvas();      
      var context = getContext();
      var w = that.img.width;
      var h = that.img.height;
      var scaleW = w > that.param.maxWidth ? that.param.maxWidth / w : 1;
      var scaleH = h > that.param.maxHeight ? that.param.maxHeight / h : 1;
      var scale = Math.min(scaleW, scaleH);
      that.scale = scale;
      var newW = Math.round(w * scale);
      var newH = Math.round(h * scale);
      canvas.width = newW;
      canvas.height = newH;
      context.drawImage(that.img, 0, 0, newW, newH);
    };
    /*
     * PUBLIC
     */
    this.drawFullImage = function (file,cb) {
      var reader = new FileReader();
      that.img = new Image();
      that.loaderCb = cb;
      that.img.addEventListener("load", loader, false);
      reader.onload = function (evt) {      
        that.img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    };
    // crop
    this.setCropPoint = function (x, y) {
      if (that.cropPoints.length < 2) {
        that.cropPoints.push({x: x, y: y});
      }
      else {
        var dist0 = Math.sqrt(Math.pow(that.cropPoints[0].x - x, 2) + Math.pow(that.cropPoints[0].y - y, 2));
        var dist1 = Math.sqrt(Math.pow(that.cropPoints[1].x - x, 2) + Math.pow(that.cropPoints[1].y - y, 2));
        var replaceInd = dist0 < dist1 ? 0 : 1;
        that.cropPoints[replaceInd] = {x: x, y: y};
      }
      drawCropPoints();
    };
    this.getCropPoints = function () {
      var cropPoints = [];
      for (var k = 0; k < that.cropPoints.length; k++) {
        cropPoints.push({
          x: Math.round(that.cropPoints[k].x / that.scale),
          y: Math.round(that.cropPoints[k].y / that.scale)
        });
      }
      return cropPoints;
    };
    // perspective change
    this.setProjectPoint = function (x, y) {

    }    
  };  
}(window.mcc = window.mcc || {}, jQuery));