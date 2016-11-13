// YOUR CODE HERE:
//should have an obj named app
var app = {
  server: 'https://api.parse.com/1/classes/messages',
  friends: {},
  data: null,

  init: () => {
    //make initial ajax request to get data
    app.fetch(app.server);
    //grab window scope search url for username
    var username = this.location.search;

    $('#send .submit')
    .off('click submit')
    .on('click', function() {
      $(this).trigger('submit');
    })
    .on('submit', function() {
      app.handleSubmit(username, $('#message').val());
    });
  },

  send: (message, url) => {
    $.ajax({
      url: url || 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function(data) {
        console.log('POST request finished');
      },
      error: function(data) {
        console.error('POST request failed', data);
      }
    });
  },

  fetch: (url) => {
    $.ajax({
      url: url || app.server,
      type: 'GET',
      //data: { 'order': '-createdAt' },
      contentType: 'application/json',
      success: function(data) {
        console.log('GET request finished');
        //save data into app.data
        app.data = data.results;
        app.renderMessage(app.data);
      },
      error: function(data) {
        console.error('GET request failed', data);
      }
    });
  },

  clearMessages: () => {
      $('#chats').empty();
  },

  renderMessage: (dataObj) => {
    //handle user input case
    //this will be a single object, not nest obj
    if (dataObj['text']) {
      //wrap it in an obj so we can use fn below
      dataObj = {
        dataObj
      };
    }
    //handle all input and append to DOM
    _.each(dataObj, (data) => {
      //save variables
      var name = data['username'];
      var message = data['text'];

      //build empty divs
      var elementName = $('<span class="username"></span>');
      var elementMessage = $('<span class="messageText"></span>');

      //give divs the messages and usernames and add to body
      elementName.text(name);
      elementMessage.text(message);

      var elements = $('<div class="messages"></div>');
      elements.append(elementName, elementMessage);
      $('#chats').append(elements);
    });

    //add click handles for usernames and grab val and pass to other fn
    $('.username').on('click', function() {
      app.handleUsernameClick($(this).text());
    })
  },

  renderRoom: function(roomName){
    var room = $('<option class="rooms"></option>');
    room.append(roomName);
    $('#roomSelect').append(room);
  },

  handleUsernameClick: function(userName){
    //add selected name to friends list obj
    app.friends[userName] = userName;
  },

  handleSubmit: function(urlName, messageText){
    //remove extra from username in url
    var name = urlName.replace('?username=','');
    //build the obj to pass into the send method
    var message = {};
    message.username = name;
    message.text = messageText;
    message.roomname = 'lobby'; //will change later
    app.send(message);
  }

};