$(function() {
  var keyCode = 0;
  var position = 0;
  $('body').on('keydown',function(e){
    // 37 is left, 39 is right
    if (( keyCode===37 && e.keyCode===39 ) || ( keyCode===39 && e.keyCode===37 )){
      if (position < 100){
        position += 1;
        keyCode = 0;
        $('.runner').css('left', position + '%');
      }
    }else{
      keyCode = e.keyCode;
    }
  });

  return false;
})