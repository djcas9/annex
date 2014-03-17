(function(root) {

    function Annex() {
      var self = this;

      self.routes = {};
      self._events = [];
      self.params = [];

      self.current = {
        hash: window.location.hash,
        get: function() {
          return (window.location.hash) ? window.location.hash.split('#/')[1] : '';
        },
        set: function(route) {
          window.location.hash = (!route) ? '' : route;
          return self;
        },
        clear: function() {
          return this.set(false);
        }
      };

      self.init();
      return self;
    };

    Annex.prototype._forEach = function(a, callback) {
      var self = this; 

      if (typeof Array.prototype.forEach === 'function') return Array.prototype.forEach.call(a, callback);

      return function(c, next){
        for(var i=0, n=this.length; i<n; ++i){
          c.call(next, this[i], i, this);
        }
      }.call(a, callback);
    };

    Annex.prototype.on = Annex.prototype.bind = function(event, handler) {
      var self = this;

      var events = (typeof event === 'string') ? event.split() : event;
      // Add listeners
      self._forEach(events, function(event){
        self._events.push({ event : event, handler : handler });
      });

      return self;
    };

    Annex.prototype._trigger = function(event) {
      var self = this;

      var params = Array.prototype.slice.call(arguments, 1);
      // Call matching events
      self._forEach(self._events, function(listener){
        // Apply callback
        if(listener.event == event) listener.handler.apply(self, params);
      });

      return self;
    };

    Annex.prototype.init = function() {
      var self = this;
      self.on(['initialized', 'hashchange'], function() {
        var parsed = self.parse();
        self.value = parsed.value;
        self.params = parsed.params;
      });

      window.onhashchange = function(){
        self._trigger('hashchange');
      }

      return self._trigger('initialized');
    };

    Annex.prototype.regexpRoute = function(path, keys, sensitive, strict) {
      var self = this;
    
      if(path instanceof RegExp) return path;
      if(path instanceof Array) path = '(' + path.join('|') + ')';
      // Build route RegExp
      path = path.concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
               .replace(/\+/g, '__plus__')
               .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
                 keys.push({ name : key, optional : !!optional });
                 slash = slash || '';

                 return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
               })
               .replace(/([\/.])/g, '\\$1')
               .replace(/__plus__/g, '(.+)')
               .replace(/\*/g, '(.*)');

      return new RegExp('^' + path + '$', sensitive ? '' : 'i');
    };

    Annex.prototype.add = function(path, handler) {
      var self = this;

      self.routes[path] = handler;
    
      var keys = [];
      var regex = new this.regexpRoute(path, keys);

      self.build(regex, function(_v, _p, event){
        var req = { params : {}, keys : keys, matches : event.regex.slice(1) };

        self._forEach(req.matches, function(value, i){
          var key = (keys[i] && keys[i].name) ? keys[i].name : i;
          req.params[key] = (value) ? decodeURIComponent(value) : undefined;
        });

        handler.call(self, req.params, self.params);
      });

      return self;
    };

    Annex.prototype.get = function(path, params, callback) {
      var self = this;
//       console.log(path, params, callback);
    };

    Annex.prototype.build = function(name, handler) {
      var self = this;


      var invoke = function(){

        var current = self.current.get().split('?').shift();
        var regex = (name instanceof RegExp) ? current.match(name) : false;

        if (regex || current == name) {

          var event = { 
            name : name, 
            value : current, 
            handler : handler, 
            params : self.params, 
            regex : regex
          };

          self._trigger('change', event);

          handler.call(self, self.value, self.params, event);
        }
        return self;
      }
      return invoke().on(['initialized', 'hashchange'], invoke);
    };
    
    Annex.prototype.parse = function() {
      var self = this; 

      var anchor = self.current.get().split("?").pop();

      self._trigger('parse', self);

      if (anchor && (anchor.search(/\=/) !== -1)) {
        var chunks = anchor.split('&');
        var params = Object();

        for (var i=0; i < chunks.length ; i++) {
          var chunk = chunks[i].split('=');
          if(chunk[0].search("\\[\\]") !== -1) {
            var key = chunk[0].split('[').shift();

            if (typeof params[key] === 'undefined') {
              params[key] = [chunk[1]];
            } else {
              params[key].push(chunk[1]);
            };


          } else if (chunk[0].match(/\w+\[(\w+)\]/)) { 

            var key = chunk[0].split('[').shift();
            var value = chunk[0].match(/\w+\[(\w+)\]/)[1];

            if (!params.hasOwnProperty(key)) {
              params[key] = {}; 
            };

            params[key][value] = chunk[1]; 

          } else {
            params[chunk[0]] = chunk[1];
          }
        }
      } else {
        params = {};
      };

      return {
        value : anchor,
        params : params
      };
    };


    if ('function' === typeof root.define) {
        root.Annex = Annex;
        root.define(function(require) {
            return Annex;
        });
    } else if ('object' === typeof exports) {
        exports.Annex = Annex;
    } else {
        root.Annex = Annex;
    };

}).call({}, window);
