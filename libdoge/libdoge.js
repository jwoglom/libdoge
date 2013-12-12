var animation = (function() {
  var a = {};

  a.fadeOut = function(id, opacity) {
    opacity = (opacity > 1) ? 1 : parseFloat(opacity.toFixed(2));
    opacity = (opacity < 0) ? 0 : parseFloat(opacity.toFixed(2));

    var element = document.getElementById(id);
    element.style.opacity = opacity;
    if (opacity > 0) {
      setTimeout(function() { a.fadeOut(id, opacity-0.1); },100);
    }
    else {
      element.parentElement.removeChild(element);
    }
  };

  return a;
})();

var util = (function() {
  var u = {};

  u.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  u.locate = function(id) {
    var element = document.getElementById(id);
    return {left : parseInt(element.style.left.replace('px', '')), 
      bottom : parseInt(element.style.bottom.replace('px', '')),
      side : element.getAttribute('rel')};
  };

  u.flipElement = function(figure, rotation) {
    var properties = ['transform', 'WebkitTransform', 'msTransform',
      'MozTransform', 'OTransform'];

    var sides = {0 : 'bottom', 270 : 'right', 180 : 'top', 90 : 'left'};
    figure.setAttribute('rel', sides[rotation]);

    for(i in properties) {
      figure.style[properties[i]] = 'rotate(' + rotation + 'deg)';
    }
  };

  return u;
})();

var dataminer = (function() {
  var m = {};

  var contentStopWords = {'a' : true, 'able' : true, 'about' : true, 'across' : true, 'after' : true, 'all' : true, 'almost' : true, 'also' : true, 'am' : true, 'among' : true, 'an' : true, 'and' : true, 'any' : true, 'are' : true, 'as' : true, 'at' : true, 'be' : true, 'because' : true, 'been' : true, 'but' : true, 'by' : true, 'can' : true, 'cannot' : true, 'could' : true, 'dear' : true, 'did' : true, 'do' : true, 'does' : true, 'either' : true, 'else' : true, 'ever' : true, 'every' : true, 'for' : true, 'from' : true, 'get' : true, 'got' : true, 'had' : true, 'has' : true, 'have' : true, 'he' : true, 'her' : true, 'hers' : true, 'him' : true, 'his' : true, 'how' : true, 'however' : true, 'i' : true, 'if' : true, 'in' : true, 'into' : true, 'is' : true, 'it' : true, 'its' : true, 'just' : true, 'least' : true, 'let' : true, 'like' : true, 'likely' : true, 'may' : true, 'me' : true, 'might' : true, 'most' : true, 'must' : true, 'my' : true, 'neither' : true, 'no' : true, 'nor' : true, 'not' : true, 'of' : true, 'off' : true, 'often' : true, 'on' : true, 'only' : true, 'or' : true, 'other' : true, 'our' : true, 'own' : true, 'rather' : true, 'said' : true, 'say' : true, 'says' : true, 'she' : true, 'should' : true, 'since' : true, 'so' : true, 'some' : true, 'than' : true, 'that' : true, 'the' : true, 'their' : true, 'them' : true, 'then' : true, 'there' : true, 'these' : true, 'they' : true, 'this' : true, 'tis' : true, 'to' : true, 'too' : true, 'twas' : true, 'us' : true, 'wants' : true, 'was' : true, 'we' : true, 'were' : true, 'what' : true, 'when' : true, 'where' : true, 'which' : true, 'while' : true, 'who' : true, 'whom' : true, 'why' : true, 'will' : true, 'with' : true, 'would' : true, 'yet' : true, 'you' : true, 'your' : true};

  var prefixes = ['wow', 'so', 'such', 'so much', 'very', 'many', 'lots', 
    'most', 'beautiful', 'all the', 'the', 'very much', 'pretty', 'lol'];

  var suffixes = ['wow', 'plz', 'lol'];
  var presetWords = ['doge'];

  var dictionary = {meta : null, contetn: null};

  var readMeta = function() {
    var words;
    var strings = [];
    strings.push(document.title.trim());

    var intrests = ['keywords','description','author'];
    var metadata = document.getElementsByTagName('meta');

    for (i in metadata) {
      if (intrests.indexOf(metadata[i].name) != -1 && 
        typeof metadata[i].content != 'undefined') {
        strings.push(metadata[i].content.trim());
      }
    }

    words = unescape(strings.join(' ').toLowerCase())
      .replace(/\W/g, ' ')
      .split(/[\s\/]+/g);

    words = words.concat(presetWords);

    return filterWords(words);
  };

  var readContent = function() {
    var content = document.createElement('div');
    // this magic, doge now understand good
    content.innerHTML = document.body.innerHTML.replace(/>/g, '> ');

    var dump = ['script','style'];

    for(i in dump) {
      var dump_pile = content.getElementsByTagName(dump[i]);
      for (var i = (dump_pile.length - 1);  i >= 0;  i--) {
        dump_pile[i].parentElement.removeChild(dump_pile[i]);
      }      
    }

    var words = unescape(content.textContent.toLowerCase().trim())
      .replace(/\W/g, ' ')
      .split(/[\s\/]+/g);

    return filterWords(words);
  };

  var filterWords = function(words) {
    var selected_words = {};

    var stopList = contentStopWords;
    for(i in prefixes) {
      stopList[prefixes[i]] = true;
    }
    for(i in suffixes) {
      stopList[suffixes[i]] = true;
    }

    for (i in words) {
      if (words[i].length <= 2 || words[i].length > 20) {
        continue;
      }

      if (words[i] in stopList) {
        continue;
      }

      if (words[i] in selected_words) {
        selected_words[words[i]]++;
        continue;
      }

      if (parseInt(words[i]).toString() == words[i]) {
        continue;
      }

      selected_words[words[i]] = 1;

    }
    return Object.keys(selected_words);
  };

  dictionary = {
    'meta' : readMeta(),
    'content' : readContent()
  };

  m.getSentence = function() {
    var text = [];
    var selected_dictionaries = [];
    selected_dictionaries.push((Math.random() < 0.5) ? 
      dictionary.content :
      dictionary.meta);

    if (Math.random() < 0.4) {
      selected_dictionaries.push((Math.random() < 0.5) ? 
        dictionary.content :
        dictionary.meta);
    }

    text.push(prefixes[util.random(0, prefixes.length-1)]);

    var content = [];
    for(i in selected_dictionaries) {
      var word = util.random(0, selected_dictionaries[i].length-1);
      if (content.indexOf(selected_dictionaries[i][word]) == -1 ) {
        content.push(selected_dictionaries[i][word]);
      }
    }
    text.push(content.join(' '));

    if (Math.random() <= 0.33) {
      text.push(suffixes[util.random(0, suffixes.length-1)]);
    }

    return text.join(' '); 
  };

  return m;
}());

var doge = function(name) {
  var d = {};
  var id;
  var figure;
  var max_statements = 6;
  var statementNmbr = 1;
  var statements = [];

  // constructor like function
  (function() {
    id = 'doge-' + name + '-' + (new Date().getTime());

    figure = document.createElement('img');

    figure.setAttribute('id', id);
    figure.setAttribute(
      'src', 'https://raw.github.com/ljalonen/libdoge/master/img/doge.png');
    figure.setAttribute('rel', 'bottom');
    figure.style.position = 'fixed';
  
    figure.style.left = '0px';
    figure.style.bottom = '0px';
    figure.style.zIndex = 999999;

    document.body.appendChild(figure);

    setInterval(
      function() {
        d.bark();
      },
      util.random(300,500));
  })();
 
  d.getID = function() {
    return id;
  };

  d.getFigure = function() {
    return figure;
  };

  d.getLocation = function() {
    return {left : parseInt(figure.style.left.replace('px', '')), 
      bottom : parseInt(figure.style.bottom.replace('px', '')),
      side : figure.getAttribute('rel')};
  };

  d.bark = function() {
    if (statements.length >= max_statements) {
      return false;
    }

    var statement_id = id + '-statement-' + statementNmbr;
    statementNmbr++;

    var statement = document.createElement('div');
    statement.style.display = 'inline-block';
    statement.setAttribute('id', statement_id);
    statement.innerHTML = dataminer.getSentence();

    statements.push(statement_id);
    document.body.appendChild(statement);

    var widthBoundaries = {
      left : Math.floor(0.075*window.innerWidth),
      right : Math.floor((0.925*window.innerWidth) - statement.clientWidth)
    };

    var heightBoundaries = {
      bottom : Math.floor(0.075*window.innerHeight),
      top : Math.floor((0.925*window.innerHeight) - statement.clientHeight)
    };

    statement.style.position = 'fixed';
    statement.style.bottom = util.random(heightBoundaries.bottom,
      heightBoundaries.top) + 'px';
    statement.style.left = util.random(widthBoundaries.left,
      widthBoundaries.right) + 'px';
    statement.style.zIndex = 999999;
    statement.style.opacity = 1;
    statement.style.fontSize = '2.75em';
    statement.style.textShadow = '-2px 0px 2px rgba(0, 0, 0, 1)';
    statement.style.fontFamily = 'Comic Sans MS';
    statement.style.color = 'rgb(' + 
      util.random(0, 255) + ',' +
      util.random(0, 255) + ',' + 
      util.random(0, 255) + ')';

    var fadeOutIn = util.random(100, 800);
    setTimeout(
      function() {
        animation.fadeOut(statement_id, 1);
        setTimeout(function() {
          statements.splice(statements.indexOf(statement_id), 1);
        }, fadeOutIn);
      },
      fadeOutIn);
  };

  d.plz = function() {
    if (Math.random() < 0.5) {
      var distance = util.random(500, 1000);
      d.run(distance);
    }
    else {
      d.hide();
    }

  };

  d.hide = function() {
    var location = d.getLocation();
    var doge_hidden = false;

    if (location.side == 'bottom') {
      figure.style.bottom = (location.bottom - 1) + 'px';
      doge_hidden = ((location.bottom - 1) == -figure.clientHeight);
    }
    else if (location.side == 'right') {
      figure.style.left = (location.left + 1) + 'px';
      doge_hidden = ((location.left + 1) == window.innerWidth);
    }
    else if (location.side == 'top') {
      figure.style.bottom = (location.bottom + 1) + 'px';
      doge_hidden = ((location.bottom + 1) == window.innerHeight);
    }
    else if (location.side == 'left') {
      figure.style.left = (location.left - 1) + 'px';
      doge_hidden = ((location.left - 1) == -figure.clientHeight);
    }

    if (!doge_hidden) {
      setTimeout(function() {d.hide()}, 1);
    }
    else {
      setTimeout(function() {
        d.teleport(true);
        d.ambush();
      }, util.random(0, 2500));
    }
  };

  d.teleport = function(is_hidden) {
    var sides = ['top', 'bottom', 'left', 'right'];
    var side = sides[util.random(0, sides.length-1)];
    figure.setAttribute('rel', side);

    if (is_hidden == null) {
      is_hidden = false;
    }

    if (side == 'top') {
      util.flipElement(figure, 180);
      var bottom = (is_hidden) ? 
        window.innerHeight : (window.innerHeight - figure.clientHeight);
      figure.style.bottom = bottom + 'px';
      figure.style.left = util.random(0, window.innerWidth - figure.clientWidth) + 'px';
    }
    else if (side == 'bottom') {
      util.flipElement(figure, 0);
      var bottom = (is_hidden) ? -figure.clientHeight : 0;
      figure.style.bottom = bottom + 'px';
      figure.style.left = util.random(0, window.innerWidth - figure.clientWidth) + 'px';
    }
    else if (side == 'left') {
      util.flipElement(figure, 90);
      figure.style.bottom = util.random(0, window.innerHeight - figure.clientWidth) + 'px';
      var left = (is_hidden) ? -figure.clientHeight : 0;
      figure.style.left = left + 'px';
    }
    else if (side == 'right') {
      util.flipElement(figure, 270);
      figure.style.bottom = util.random(0, window.innerHeight - figure.clientWidth) + 'px';
      var left = (is_hidden) ? window.innerWidth : (window.innerWidth - figure.clientHeight);
      figure.style.left = left + 'px';
    }
  };

  d.ambush = function() {
    var location = d.getLocation();
    var doge_visible = false;

    if (location.side == 'bottom') {
      figure.style.bottom = (location.bottom + 1) + 'px';
      doge_visible = ((location.bottom + 1) == 0);
    }
    else if (location.side == 'right') {
      figure.style.left = (location.left - 1) + 'px';
      doge_visible = ((location.left - 1) == window.innerWidth - figure.clientHeight);
    }
    else if (location.side == 'top') {
      figure.style.bottom = (location.bottom - 1) + 'px';
      doge_visible = ((location.bottom - 1) == window.innerHeight - figure.clientHeight);
    }
    else if (location.side == 'left') {
      figure.style.left = (location.left + 1) + 'px';
      doge_visible = ((location.left + 1) == 0);
    }

    if (!doge_visible) {
      setTimeout(function() {d.ambush()}, 1);
    }
    else {
      setTimeout(function() {
        d.plz();
      }, util.random(0, 2500));
    }
  };

  d.run = function(distance) {
    var location = d.getLocation();

    if (location.side == 'bottom') {
      if (location.left + figure.clientWidth >= window.innerWidth) {
        util.flipElement(figure, 270);
      }
      else {
        figure.style.left = (location.left + 1) + 'px';  
      }      
    }
    else if (location.side == 'right') {
      if (location.bottom + figure.clientWidth >= window.innerHeight) {
        util.flipElement(figure, 180);
      }
      else {
        figure.style.bottom = (location.bottom + 1) + 'px';
      }
    }
    else if (location.side == 'top') {
      if (location.left <= 0) {
        util.flipElement(figure, 90);
      }
      else {
        figure.style.left = (location.left - 1) + 'px';
      }
    }
    else if (location.side == 'left') {
      if (location.bottom <= 0) {
        util.flipElement(figure, 0);
      }
      else {
        figure.style.bottom = (location.bottom - 1) + 'px';
      }
    }

    setTimeout(
      function() {
        if (--distance < 0) {
          d.plz();
        }
        else {
          d.run(distance);
        }
      }, 1);
  };

  d.escape = function() {
    figure.parentNode.removeChild(figure);
    max_statements = 0;
  }

  return d;
};

var controller = (function() {
  var c = {};
  var doges = [];
  var name = 1;

  c.buyDoge = function() {
    var d = new doge(name++);
    d.plz();
    doges.push(d);
  }

  c.sellDoge = function() {
    if (doges.length == 0) {
      return;
    }

    var doge = doges.pop();
    
    // Y U NO SELL DOGE
    doge.escape();
    delete doge;
  }

  return c;
})();

var keybinds = function(e) {
  switch(e.which) {
    case 43:
      controller.buyDoge();
      break;
    case 45:
      controller.sellDoge();
      break;
    default:
      break;
  }

}

document.onkeypress = keybinds;