(function() {
  "use strict";

  var urls = [],
    page,
    offset;

  var fatal = function(message, err) {
    console.error(err);
    $('body').html('<h1>' + message + '</h1>');
  };
  
  if(!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g,'');
    };
  }
  
  var show = function(i) {
    if (!urls.length) { return; }
    
    if (i >= urls.length) { i = 0; }
    if (i < 0 ) { i = urls.length - 1; }
    
    $('iframe').attr('src', urls[(i + offset) % urls.length]);
    
    return i;
  };
  
  // load the gist and get our stack of urls
  var init = function(options) {
    console.log(options);
    offset = options.offset;
    var ns = options.gist + "-" + options.file;
    
    $.ajax({
      url: "https://api.github.com/gists/" + options.gist,
      dataType: "jsonp",
      success: function(data) {
        try {
          var content = data.data.files[options.file].content;
          var potentialUrls = content.split(/\n/);
          for (var i = 0, candidate; i < potentialUrls.length; i++) {
            candidate = potentialUrls[i].trim();
            if (candidate) { urls.push(candidate); }
          }
        } catch (err) {
          fatal("Sorry. Error parsing gist.", err);
          return;
        }
        
        page = show(options.page);
        
        // socket io
        var socket = io.connect(location.protocol + '//' + location.hostname);
        socket.on('flip', function(data) {
          if (data.ns == ns) { show(data.page); }
        });

        // the manual controls
        var change = function(increment) {
          page = show(page + increment, true);
          socket.emit('flip', {ns: ns, page: page});
        }
        $('#flipper .next').click(function() { change(1); });
        $('#flipper .previous').click(function() { change(-1); });
        
        // timer
        if (options.timer) {
          setInterval(function() {
            change(1); 
          }, options.timer * 1000);
        }
      },
      error: function(err) {
        fatal("Sorry. Error loading gist.", err);
      }
    });
  };
  
  window.init = init;
  
})();