$(function() {
  var keyCode = 0;
  var position = 0;
  $('body').on('keydown',function(e){
    // 37 is left, 39 is right
    if (( keyCode===37 && e.keyCode===39 ) || ( keyCode===39 && e.keyCode===37 )){
      keyCode = 0;
      socket.emit('run');
      if (position < 100){
        position += 1;
        $('#myself .runner').css('left', position + '%');
      }
    }else{
      keyCode = e.keyCode;
    }

    return false;

  });

  var player = $('.player').detach();
  var myself = player.clone().attr('id','myself');
  var myId = null

  var socket = io.connect();
  socket
    .on('setPlayer', function (data) {
      if ( data > 0 ) {
        myId = data;
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
    .on('runner', function (runner) {
      if (runner instanceof Array){
        for (var i = runner.length - 1; i >= 0; i--) {
          if (i==myId) continue;
          $('.player'+(i+1)+' .runner').css('left', runner[i] + '%');
        };
      }
    });
})
