// Render users
var params = new URLSearchParams(window.location.search);

var user = params.get('name');
var room = params.get('room');

var divUsers = $('#divUsuarios');
var divChatbox = $('#divChatbox');
var messageForm = $('#formEnviar');
var message = $('#message');

function renderUsers(users) {
  console.log('Users:', users);
  var html = '';
  html += '<li>';
  html += '    <a href="javascript:void(0)" class="active"> Chat de <span> '+ room +'</span></a>';
  html += '</li>';

  users.forEach(user => {
    html += '<li>';
    html += '    <a data-id="'+ user.id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' +user.name+ ' <small class="text-success">online</small></span></a>';
    html += '</li>';
  });

  divUsers.html(html);
}

function renderMessages (message, me = false) {
  var date = new Date(message.date);
  var time = date.getHours() + ':' + date.getMinutes();
  var html = '';
  var adminClasss = 'info';
  if (message.name === 'Admin') {
    adminClasss = 'danger';
  }

  if (me) {
    html += '<li class="reverse animated fadeIn">';
    html += '    <div class="chat-content">';
    html += '        <h5>'+message.name+'</h5>';
    html += '        <div class="box bg-light-inverse">'+ message.message +'</div>';
    html += '    </div>';
    html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
    html += '    <div class="chat-time">'+ time +'</div>';
    html += '</li>';
  } else {
    html += '<li class="animated fadeIn">';
    if (message.name !== 'Admin') {
      html += '  <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    }
    html += '  <div class="chat-content">';
    html += '      <h5>'+message.name+'</h5>';
    html += '      <div class="box bg-light-'+ adminClasss +'">'+ message.message +'</div>';
    html += '  </div>';
    html += '  <div class="chat-time">'+ time +'</div>';
    html += '</li>';
  }

  divChatbox.append(html);
  scrollBottom()
}

function scrollBottom() {

  // selectors
  var newMessage = divChatbox.children('li:last-child');

  // heights
  var clientHeight = divChatbox.prop('clientHeight');
  var scrollTop = divChatbox.prop('scrollTop');
  var scrollHeight = divChatbox.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      divChatbox.scrollTop(scrollHeight);
  }
}

// Listeners

divUsers.on('click', 'a', function(e) {
  var id = $(this).data('id');
});

messageForm.on('submit', function(e) {
  e.preventDefault();
  if (!message.val().trim().length) {
    return;
  }

  socket.emit('sendMessage', {
      name,
      message: message.val(),
  }, function(resp) {
      console.log('respuesta server: ', resp);
      message.val('').focus();
      renderMessages(resp, true);
  });
})