$(function() {
  var keyCode = 0;
  var position = 0;
  $('body').on('keydown',function(e){
    // 37 is left, 39 is right
    if (( keyCode===37 && e.keyCode===39 ) || ( keyCode===39 && e.keyCode===37 )){
      if (position < 100){
        position += 1;
        keyCode = 0;
        $('#myself .runner').css('left', position + '%');
      }
    }else{
      keyCode = e.keyCode;
    }

    return false;

  });

  var player = $('.player').detach();
  var myself = player.clone().attr('id','myself');

  var socket = io.connect();
  socket
    .on('setPlayer', function (data) {
      if ( data > 0 ) {
        $('body').append(myself.addClass('player'+data));
      }
    })
    .on('addPlayer', function (data) {
      player.clone()
            .addClass('player'+data)
            .appendTo('body');
    })
    .on('delPlayer', function (data) {
      $('.player'+data).remove();
    })
})
