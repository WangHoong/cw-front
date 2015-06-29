require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],3:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":1,"./encode":2}],4:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":5}],5:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = '' + str;
  if (str.length > 10000) return;
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],6:[function(require,module,exports){
(function (global){
var AuthEngine = function () {
  this._internalStorage = {};
};

AuthEngine.prototype.saveToken = function (name, token, options, callback) {
  if (global.localStorage) {
    global.localStorage.setItem(name, token);
  } else {
    this._internalStorage[name] = token;
  }
  callback && callback();
};

AuthEngine.prototype.removeToken = function (name, callback) {
  if (global.localStorage) {
    global.localStorage.removeItem(name);
  }
  delete this._internalStorage[name];
  
  callback && callback();
};

AuthEngine.prototype.loadToken = function (name, callback) {
  var token;
  
  if (global.localStorage) {
    token = global.localStorage.getItem(name);
  } else {
    token = this._internalStorage[name] || null;
  }
  callback(null, token);
};

module.exports.AuthEngine = AuthEngine;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
module.exports.create = (function () {
  function F() {};

  return function (o) {
    if (arguments.length != 1) {
      throw new Error('Object.create implementation only accepts one parameter.');
    }
    F.prototype = o;
    return new F();
  }
})();
},{}],8:[function(require,module,exports){
var Response = function (socket, id) {
  this.socket = socket;
  this.id = id;
};

Response.prototype._respond = function (responseData) {
  this.socket.send(this.socket.stringify(responseData));
};

Response.prototype.end = function (data) {
  if (this.id) {
    var responseData = {
      rid: this.id
    };
    if (data !== undefined) {
      responseData.data = data;
    }
    this._respond(responseData);
  }
};

Response.prototype.error = function (error, data) {
  if (this.id) {
    var err;
    if (error instanceof Error) {
      err = {name: error.name, message: error.message, stack: error.stack};      
    } else {
      err = error;
    }
    
    var responseData = {
      rid: this.id,
      error: err
    };
    if (data !== undefined) {
      responseData.data = data;
    }
    
    this._respond(responseData);
  }
};

Response.prototype.callback = function (error, data) {
  if (error) {
    this.error(error, data);
  } else {
    this.end(data);
  }
};

module.exports.Response = Response;

},{}],9:[function(require,module,exports){
(function (global){
var SCEmitter = require('sc-emitter').SCEmitter;
var SCChannel = require('sc-channel').SCChannel;
var Response = require('./response').Response;
var AuthEngine = require('./auth').AuthEngine;
var SCTransport = require('./sctransport').SCTransport;
var querystring = require('querystring');
var LinkedList = require('linked-list');

if (!Object.create) {
  Object.create = require('./objectcreate');
}

var isBrowser = typeof window != 'undefined';


var SCSocket = function (options) {
  var self = this;
  
  SCEmitter.call(this);
  
  var opts = {
    port: null,
    autoReconnect: true,
    autoProcessSubscriptions: true,
    ackTimeout: 10000,
    hostname: global.location && location.hostname,
    path: '/socketcluster/',
    secure: global.location && location.protocol == 'https:',
    timestampRequests: false,
    timestampParam: 't',
    authEngine: null,
    authTokenName: 'socketCluster.authToken',
    binaryType: 'arraybuffer'
  };
  for (var i in options) {
    opts[i] = options[i];
  }
  
  this.id = null;
  this.state = this.CLOSED;
  
  this.ackTimeout = opts.ackTimeout;
  
  // pingTimeout will be ackTimeout at the start, but it will
  // be updated with values provided by the 'connect' event
  this.pingTimeout = this.ackTimeout;
  
  var maxTimeout = Math.pow(2, 31) - 1;
  
  var verifyDuration = function (propertyName) {
    if (self[propertyName] > maxTimeout) {
      throw new Error('The ' + propertyName +
        ' value provided exceeded the maximum amount allowed');
    }
  };
  
  verifyDuration('ackTimeout');
  verifyDuration('pingTimeout');
  
  this._localEvents = {
    'connect': 1,
    'connectAbort': 1,
    'disconnect': 1,
    'message': 1,
    'error': 1,
    'raw': 1,
    'fail': 1,
    'kickOut': 1,
    'subscribe': 1,
    'unsubscribe': 1,
    'setAuthToken': 1,
    'removeAuthToken': 1
  };
  
  this._connectAttempts = 0;
  
  this._emitBuffer = new LinkedList();
  this._channels = {};
  this._base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  
  this.options = opts;
  
  if (this.options.autoReconnect) {
    if (this.options.autoReconnectOptions == null) {
      this.options.autoReconnectOptions = {};
    }
    
    var reconnectOptions = this.options.autoReconnectOptions;
    if (reconnectOptions.initialDelay == null) {
      reconnectOptions.initialDelay = 10000;
    }
    if (reconnectOptions.randomness == null) {
      reconnectOptions.randomness = 10000;
    }
    if (reconnectOptions.multiplier == null) {
      reconnectOptions.multiplier = 1.5;
    }
    if (reconnectOptions.maxDelay == null) {
      reconnectOptions.maxDelay = 60000;
    }
  }
  
  if (this.options.subscriptionRetryOptions == null) {
    this.options.subscriptionRetryOptions = {};
  }
  
  if (this.options.authEngine) {
    this.auth = this.options.authEngine;
  } else {
    this.auth = new AuthEngine();
  }

  this.options.path = this.options.path.replace(/\/$/, '') + '/';
  
  this.options.query = opts.query || {};
  if (typeof this.options.query == 'string') {
    this.options.query = querystring.parse(this.options.query);
  }

  this.options.port = opts.port || (global.location && location.port ?
    location.port : (this.options.secure ? 443 : 80));
  
  this.connect();
  
  this._channelEmitter = new SCEmitter();
  
  if (isBrowser) {
    var unloadHandler = function () {
      self.disconnect();
    };

    if (global.attachEvent) {
      global.attachEvent('onunload', unloadHandler);
    } else if (global.addEventListener) {
      global.addEventListener('beforeunload', unloadHandler, false);
    }
  }
};

SCSocket.prototype = Object.create(SCEmitter.prototype);

SCSocket.CONNECTING = SCSocket.prototype.CONNECTING = SCTransport.prototype.CONNECTING;
SCSocket.OPEN = SCSocket.prototype.OPEN = SCTransport.prototype.OPEN;
SCSocket.CLOSED = SCSocket.prototype.CLOSED = SCTransport.prototype.CLOSED;

SCSocket.ignoreStatuses = {
  1000: 'Socket closed normally',
  1001: 'Socket hung up'
};

SCSocket.errorStatuses = {
  1001: 'Socket was disconnected',
  1002: 'A WebSocket protocol error was encountered',
  1003: 'Server terminated socket because it received invalid data',
  1005: 'Socket closed without status code',
  1006: 'Socket hung up',
  1007: 'Message format was incorrect',
  1008: 'Encountered a policy violation',
  1009: 'Message was too big to process',
  1010: 'Client ended the connection because the server did not comply with extension requirements',
  1011: 'Server encountered an unexpected fatal condition',
  4000: 'Server ping timed out',
  4001: 'Client pong timed out',
  4002: 'Server failed to sign auth token',
  4003: 'Failed to complete handshake',
  4004: 'Client failed to save auth token'
};

SCSocket.prototype._privateEventHandlerMap = {
  '#fail': function (data) {
    this._onSCError(data);
  },
  '#publish': function (data) {
    var isSubscribed = this.isSubscribed(data.channel, true);
    
    if (isSubscribed) {
      this._channelEmitter.emit(data.channel, data.data);
    }
  },
  '#kickOut': function (data) {
    var channelName = data.channel;
    var channel = this._channels[channelName];
    if (channel) {
      SCEmitter.prototype.emit.call(this, 'kickOut', data.message, channelName);
      channel.emit('kickOut', data.message, channelName);
      this._triggerChannelUnsubscribe(channel);
    }
  },
  '#setAuthToken': function (data, response) {
    var self = this;
    
    if (data) {
      var tokenOptions = {
        expiresInMinutes: !!data.expiresInMinutes
      };
      
      var triggerSetAuthToken = function (err) {
        if (err) {
          // This is a non-fatal error, we don't want to close the connection 
          // because of this but we do want to notify the server and throw an error
          // on the client.
          response.error(err.message || err);
          self._onSCError(err);
        } else {
          SCEmitter.prototype.emit.call(self, 'setAuthToken', data.token);
          response.end();
        }
      };
      
      this.auth.saveToken(this.options.authTokenName, data.token, tokenOptions, triggerSetAuthToken);
    } else {
      response.error('No token data provided with setAuthToken event');
    }
  },
  '#removeAuthToken': function (data, response) {
    var self = this;
    
    this.auth.removeToken(this.options.authTokenName, function (err) {
      if (err) {
        // Non-fatal error - Do not close the connection
        response.error(err.message || err);
        self._onSCError(err);
      } else {
        SCEmitter.prototype.emit.call(self, 'removeAuthToken');
        response.end();
      }
    });
  },
  '#disconnect': function (data) {
    this.transport.close(data.code, data.data);
  }
};

SCSocket.prototype.getState = function () {
  return this.state;
};

SCSocket.prototype.getBytesReceived = function () {
  return this.transport.getBytesReceived();
};

SCSocket.prototype.removeAuthToken = function (callback) {
  var self = this;
  
  this.auth.removeToken(this.options.authTokenName, function (err) {
    callback && callback(err);
    if (err) {
      // Non-fatal error - Do not close the connection
      self._onSCError(err);
    } else {
      SCEmitter.prototype.emit.call(self, 'removeAuthToken');
    }
  });
};

SCSocket.prototype.connect = SCSocket.prototype.open = function () {
  var self = this;
  
  if (this.state == this.CLOSED) {
    clearTimeout(this._reconnectTimeout);
    
    this.state = this.CONNECTING;
    
    if (this.transport) {
      this.transport.off();
    }
    
    this.transport = new SCTransport(this.auth, this.options);

    this.transport.on('open', function (status) {
      self.state = self.OPEN;
      self._onSCOpen(status);
    });
    
    this.transport.on('error', function (err) {
      self._onSCError(err);
    });
    
    this.transport.on('close', function (code, data) {
      self.state = self.CLOSED;
      self._onSCClose(code, data);
    });
    
    this.transport.on('openAbort', function (code, data) {
      self.state = self.CLOSED;
      self._onSCClose(code, data, true);
    });
    
    this.transport.on('event', function (event, data, res) {
      self._onSCEvent(event, data, res);
    });
  }
};

SCSocket.prototype.disconnect = function (code, data) {
  code = code || 1000;
  
  if (this.state == this.OPEN) {
    var packet = {
      code: code,
      data: data
    };
    this.transport.emit('#disconnect', packet);
    this.transport.close(code);
    
  } else if (this.state == this.CONNECTING) {
    this.transport.close(code);
  }
};

SCSocket.prototype._tryReconnect = function (initialDelay) {
  var self = this;
  
  var exponent = this._connectAttempts++;
  var reconnectOptions = this.options.autoReconnectOptions;
  var timeout;
  
  if (initialDelay == null || exponent > 0) {
    var initialTimeout = Math.round(reconnectOptions.initialDelay + (reconnectOptions.randomness || 0) * Math.random());
    
    timeout = Math.round(initialTimeout * Math.pow(reconnectOptions.multiplier, exponent));
  } else {
    timeout = initialDelay;
  }
  
  if (timeout > reconnectOptions.maxDelay) {
    timeout = reconnectOptions.maxDelay;
  }
  
  clearTimeout(this._reconnectTimeout);
  
  this._reconnectTimeout = setTimeout(function () {
    self.connect();
  }, timeout);
};

SCSocket.prototype._onSCOpen = function (status) {
  var self = this;
  
  if (status) {
    this.id = status.id;
    this.pingTimeout = status.pingTimeout;
    this.transport.pingTimeout = this.pingTimeout;
  }
  
  this._connectAttempts = 0;
  if (this.options.autoProcessSubscriptions) {
    this.processPendingSubscriptions();
  }
  
  // If the user invokes the callback while in autoProcessSubscriptions mode, it
  // won't break anything - The processPendingSubscriptions() call will be a no-op.
  SCEmitter.prototype.emit.call(this, 'connect', status, function () {
    self.processPendingSubscriptions();
  });
  
  this._flushEmitBuffer();
};

SCSocket.prototype._onSCError = function (err) {
  var self = this;
  
  // Throw error in different stack frame so that error handling
  // cannot interfere with a reconnect action.
  setTimeout(function () {
    if (self.listeners('error').length < 1) {
        throw err;
    } else {
      SCEmitter.prototype.emit.call(self, 'error', err);
    }
  }, 0);
};

SCSocket.prototype._suspendSubscriptions = function () {
  var channel, newState;
  for (var channelName in this._channels) {
    channel = this._channels[channelName];
    if (channel.state == channel.SUBSCRIBED ||
      channel.state == channel.PENDING) {
      
      newState = channel.PENDING;
    } else {
      newState = channel.UNSUBSCRIBED;
    }
    
    this._triggerChannelUnsubscribe(channel, newState);
  }
};

SCSocket.prototype._onSCClose = function (code, data, openAbort) {
  var self = this;
  
  this.id = null;
  
  if (this.transport) {
    this.transport.off();
  }
  clearTimeout(this._reconnectTimeout);

  this._suspendSubscriptions();
  
  if (openAbort) {
    SCEmitter.prototype.emit.call(self, 'connectAbort', code, data);
  } else {
    SCEmitter.prototype.emit.call(self, 'disconnect', code, data);
  }
  
  // Try to reconnect
  // on server ping timeout (4000)
  // or on client pong timeout (4001)
  // or on close without status (1005)
  // or on handshake failure (4003)
  // or on socket hung up (1006)
  if (this.options.autoReconnect) {
    if (code == 4000 || code == 4001 || code == 1005) {
      // If there is a ping or pong timeout or socket closes without
      // status, don't wait before trying to reconnect - These could happen
      // if the client wakes up after a period of inactivity and in this case we
      // want to re-establish the connection as soon as possible.
      this._tryReconnect(0);
      
    } else if (code == 1006 || code == 4003) {
      this._tryReconnect();
    }
  }
  
  if (!SCSocket.ignoreStatuses[code]) {
    var err = new Error(SCSocket.errorStatuses[code] || 'Socket connection failed for unknown reasons');
    err.code = code;
    this._onSCError(err);
  }
};

SCSocket.prototype._onSCEvent = function (event, data, res) {
  var handler = this._privateEventHandlerMap[event];
  if (handler) {
    handler.call(this, data, res);
  } else {
    SCEmitter.prototype.emit.call(this, event, data, res);
  }
};

SCSocket.prototype.parse = function (message) {
  return this.transport.parse(message);
};

SCSocket.prototype.stringify = function (object) {
  return this.transport.stringify(object);
};

SCSocket.prototype._flushEmitBuffer = function () {
  var currentNode = this._emitBuffer.head;
  var nextNode;

  while (currentNode) {
    nextNode = currentNode.next;
    var eventObject = currentNode.data;
    currentNode.detach();
    this.transport.emitRaw(eventObject);
    currentNode = nextNode;
  }
};

SCSocket.prototype._handleEventAckTimeout = function (eventObject, eventNode) {
  var errorMessage = "Event response for '" + eventObject.event + "' timed out";
  var error = new Error(errorMessage);
  error.type = 'timeout';
  
  var callback = eventObject.callback;
  delete eventObject.callback;
  if (eventNode) {
    eventNode.detach();
  }
  callback.call(eventObject, error, eventObject);
  this._onSCError(error);
};

SCSocket.prototype._emit = function (event, data, callback) {
  var self = this;
  
  if (this.state == this.CLOSED) {
    this.connect();
  }
  var eventObject = {
    event: event,
    data: data,
    callback: callback
  };
  
  var eventNode = new LinkedList.Item();
  eventNode.data = eventObject;
  
  // Events which do not have a callback will be treated as volatile
  if (callback) {
    eventObject.timeout = setTimeout(function () {
      self._handleEventAckTimeout(eventObject, eventNode);
    }, this.ackTimeout);
  }
  this._emitBuffer.append(eventNode);
  
  if (this.state == this.OPEN) {
    this._flushEmitBuffer();
  }
};

SCSocket.prototype.emit = function (event, data, callback) {
  if (this._localEvents[event] == null) {
    this._emit(event, data, callback);
  } else {
    SCEmitter.prototype.emit.call(this, event, data);
  }
};

SCSocket.prototype.publish = function (channelName, data, callback) {
  var pubData = {
    channel: channelName,
    data: data
  };
  this.emit('#publish', pubData, function (err) {
    callback && callback(err);
  });
};

SCSocket.prototype._triggerChannelSubscribe = function (channel) {
  var channelName = channel.name;
  
  if (channel.state != channel.SUBSCRIBED) {
    channel.state = channel.SUBSCRIBED;
    
    channel.emit('subscribe', channelName);
    SCEmitter.prototype.emit.call(this, 'subscribe', channelName);
  }
};

SCSocket.prototype._triggerChannelSubscribeFail = function (err, channel) {
  var channelName = channel.name;
  
  if (channel.state != channel.UNSUBSCRIBED) {
    channel.state = channel.UNSUBSCRIBED;
    
    channel.emit('subscribeFail', err, channelName);
    SCEmitter.prototype.emit.call(this, 'subscribeFail', err, channelName);
  }
};

// Cancel any pending subscribe callback
SCSocket.prototype._cancelPendingSubscribeCallback = function (channel) {
  if (channel._pendingSubscriptionCid != null) {
    this.transport.cancelPendingResponse(channel._pendingSubscriptionCid);
    delete channel._pendingSubscriptionCid;
  }
};

SCSocket.prototype._trySubscribe = function (channel) {
  var self = this;
  
  // We can only ever have one pending subscribe action at any given time on a channel
  if (this.state == this.OPEN && channel._pendingSubscriptionCid == null) {
    var options = {
      noTimeout: true
    };

    channel._pendingSubscriptionCid = this.transport.emit(
      '#subscribe', channel.name, options,
      function (err) {
        delete channel._pendingSubscriptionCid;
        if (err) {
          self._triggerChannelSubscribeFail(err, channel);
        } else {
          self._triggerChannelSubscribe(channel);
        }
      }
    );
  }
};

SCSocket.prototype.subscribe = function (channelName) {
  var channel = this._channels[channelName];
  
  if (!channel) {
    channel = new SCChannel(channelName, this);
    this._channels[channelName] = channel;
  }

  if (channel.state == channel.UNSUBSCRIBED) {
    channel.state = channel.PENDING;
    this._trySubscribe(channel);
  }
  
  return channel;
};

SCSocket.prototype._triggerChannelUnsubscribe = function (channel, newState) {
  var channelName = channel.name;
  var oldState = channel.state;
  
  if (newState) {
    channel.state = newState;
  } else {
    channel.state = channel.UNSUBSCRIBED;
  }
  this._cancelPendingSubscribeCallback(channel);
  
  if (oldState == channel.SUBSCRIBED) {
    channel.emit('unsubscribe', channelName);
    SCEmitter.prototype.emit.call(this, 'unsubscribe', channelName);
  }
};

SCSocket.prototype._tryUnsubscribe = function (channel) {
  var self = this;
  
  if (this.state == this.OPEN) {
    var options = {
      noTimeout: true
    };
    // If there is a pending subscribe action, cancel the callback
    this._cancelPendingSubscribeCallback(channel);
    
    // This operation cannot fail because the TCP protocol guarantees delivery
    // so long as the connection remains open. If the connection closes,
    // the server will automatically unsubscribe the socket and thus complete
    // the operation on the server side.
    this.transport.emit('#unsubscribe', channel.name, options);
  }
};

SCSocket.prototype.unsubscribe = function (channelName) {

  var channel = this._channels[channelName];
  
  if (channel) {
    if (channel.state != channel.UNSUBSCRIBED) {
    
      this._triggerChannelUnsubscribe(channel);
      this._tryUnsubscribe(channel);
    }
  }
};

SCSocket.prototype.channel = function (channelName) {
  var currentChannel = this._channels[channelName];
  
  if (!currentChannel) {
    currentChannel = new SCChannel(channelName, this);
    this._channels[channelName] = currentChannel;
  }
  return currentChannel;
};

SCSocket.prototype.destroyChannel = function (channelName) {
  var channel = this._channels[channelName];
  channel.unwatch();
  channel.unsubscribe();
  delete this._channels[channelName];
};

SCSocket.prototype.subscriptions = function (includePending) {
  var subs = [];
  var channel, includeChannel;
  for (var channelName in this._channels) {
    channel = this._channels[channelName];
    
    if (includePending) {
      includeChannel = channel && (channel.state == channel.SUBSCRIBED || 
        channel.state == channel.PENDING);
    } else {
      includeChannel = channel && channel.state == channel.SUBSCRIBED;
    }
    
    if (includeChannel) {
      subs.push(channelName);
    }
  }
  return subs;
};

SCSocket.prototype.isSubscribed = function (channel, includePending) {
  var channel = this._channels[channel];
  if (includePending) {
    return !!channel && (channel.state == channel.SUBSCRIBED ||
      channel.state == channel.PENDING);
  }
  return !!channel && channel.state == channel.SUBSCRIBED;
};

SCSocket.prototype.processPendingSubscriptions = function () {
  var self = this;
  
  var channels = [];
  for (var channelName in this._channels) {
    channels.push(channelName);
  }
  
  for (var i in this._channels) {
    (function (channel) {
      if (channel.state == channel.PENDING) {
        self._trySubscribe(channel);
      }
    })(this._channels[i]);
  }
};

SCSocket.prototype.watch = function (channelName, handler) {
  this._channelEmitter.on(channelName, handler);
};

SCSocket.prototype.unwatch = function (channelName, handler) {
  if (handler) {
    this._channelEmitter.removeListener(channelName, handler);
  } else {
    this._channelEmitter.removeAllListeners(channelName);
  }
};

SCSocket.prototype.watchers = function (channelName) {
  return this._channelEmitter.listeners(channelName);
};

module.exports = SCSocket;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./auth":6,"./objectcreate":7,"./response":8,"./sctransport":10,"linked-list":12,"querystring":3,"sc-channel":13,"sc-emitter":15}],10:[function(require,module,exports){
var WebSocket = require('ws');
var SCEmitter = require('sc-emitter').SCEmitter;
var Response = require('./response').Response;
var querystring = require('querystring');

var SCTransport = function (authEngine, options) {
  this.state = this.CLOSED;
  this.auth = authEngine;
  this.options = options;
  this.pingTimeout = options.ackTimeout;
  
  this._cid = 1;
  this._pingTimeoutTicker = null;
  this._callbackMap = {};
  
  this.open();
};

SCTransport.prototype = Object.create(SCEmitter.prototype);

SCTransport.CONNECTING = SCTransport.prototype.CONNECTING = 'connecting';
SCTransport.OPEN = SCTransport.prototype.OPEN = 'open';
SCTransport.CLOSED = SCTransport.prototype.CLOSED = 'closed';

SCTransport.prototype.uri = function () {
  var query = this.options.query || {};
  var schema = this.options.secure ? 'wss' : 'ws';
  var port = '';

  if (this.options.port && (('wss' == schema && this.options.port != 443)
    || ('ws' == schema && this.options.port != 80))) {
    port = ':' + this.options.port;
  }

  if (this.options.timestampRequests) {
    query[this.options.timestampParam] = (new Date()).getTime();
  }

  query = querystring.stringify(query);

  if (query.length) {
    query = '?' + query;
  }

  return schema + '://' + this.options.hostname + port + this.options.path + query;
};

SCTransport.prototype._nextCallId = function () {
  return this._cid++;
};

SCTransport.prototype.open = function () {
  var self = this;
  
  this.state = this.CONNECTING;
  var uri = this.uri();
  
  var wsSocket = new WebSocket(uri, null, this.options);
  wsSocket.binaryType = this.options.binaryType;
  this.socket = wsSocket;
  
  wsSocket.onopen = function () {
    self._onOpen();
  };
  
  wsSocket.onclose = function (event) {
    self._onClose(event.code, event.reason);
  };
  
  wsSocket.onmessage = function (message, flags) {
    self._onMessage(message.data);
  };
};

SCTransport.prototype._onOpen = function () {
  var self = this;
  
  this._resetPingTimeout();
  
  this._handshake(function (err, status) {
    if (err) {
      self._onError(err);
      self._onClose(4003);
      self.socket.close(4003);
    } else {
      self.state = self.OPEN;
      SCEmitter.prototype.emit.call(self, 'open', status);
      self._resetPingTimeout();
    }
  });
};

SCTransport.prototype._handshake = function (callback) {
  var self = this;
  this.auth.loadToken(this.options.authTokenName, function (err, token) {
    if (err) {
      callback(err);
    } else {
      // Don't wait for this.state to be 'open'.
      // The underlying WebSocket (this.socket) is already open.
      var options = {
        force: true
      };
      self.emit('#handshake', {
        authToken: token
      }, options, callback);
    }
  });
};

SCTransport.prototype._onClose = function (code, data) {
  delete this.socket.onopen;
  delete this.socket.onclose;
  delete this.socket.onmessage;
    
  if (this.state == this.OPEN) {
    this.state = this.CLOSED;
    SCEmitter.prototype.emit.call(this, 'close', code, data);
    
  } else if (this.state == this.CONNECTING) {
    this.state = this.CLOSED;
    SCEmitter.prototype.emit.call(this, 'openAbort', code, data);
  }
};

SCTransport.prototype._onMessage = function (message) {
  SCEmitter.prototype.emit.call(this, 'event', 'message', message);
  
  // If ping
  if (message == '1') {
    this._resetPingTimeout();
    if (this.socket.readyState == this.socket.OPEN) {
      this.socket.send('2');
    }
  } else {
    var obj;
    try {
      obj = this.parse(message);
    } catch (err) {
      obj = message;
    }
    var event = obj.event;
    
    if (event) {
      var response = new Response(this, obj.cid);
      SCEmitter.prototype.emit.call(this, 'event', event, obj.data, response);
    } else if (obj.rid != null) {
      var eventObject = this._callbackMap[obj.rid];
      if (eventObject) {
        clearTimeout(eventObject.timeout);
        delete this._callbackMap[obj.rid];
        eventObject.callback(obj.error, obj.data);
      }
      if (obj.error) {
        this._onError(obj.error);
      }
    } else {
      SCEmitter.prototype.emit.call(this, 'event', 'raw', obj);
    }
  }
};

SCTransport.prototype._onError = function (err) {
  SCEmitter.prototype.emit.call(this, 'error', err);
};

SCTransport.prototype._resetPingTimeout = function () {
  var self = this;
  
  var now = (new Date()).getTime();
  clearTimeout(this._pingTimeoutTicker);
  
  this._pingTimeoutTicker = setTimeout(function () {
    self._onClose(4000);
    self.socket.close(4000);
  }, this.pingTimeout);
};

SCTransport.prototype.getBytesReceived = function () {
  return this.socket.bytesReceived;
};

SCTransport.prototype.close = function (code, data) {
  code = code || 1000;
  
  if (this.state == this.OPEN) {
    var packet = {
      code: code,
      data: data
    };
    this.emit('#disconnect', packet);
    
    this._onClose(code, data);
    this.socket.close(code);
    
  } else if (this.state == this.CONNECTING) {
    this._onClose(code, data);
    this.socket.close(code);
  }
};

SCTransport.prototype.emitRaw = function (eventObject) {
  eventObject.cid = this._nextCallId();
  
  if (eventObject.callback) {
    this._callbackMap[eventObject.cid] = eventObject;
  }
  
  var simpleEventObject = {
    event: eventObject.event,
    data: eventObject.data,
    cid: eventObject.cid
  };
  
  this.sendObject(simpleEventObject);
  return eventObject.cid;
};


SCTransport.prototype._handleEventAckTimeout = function (eventObject) {
  var errorMessage = "Event response for '" + eventObject.event + "' timed out";
  var error = new Error(errorMessage);
  error.type = 'timeout';
  
  if (eventObject.cid) {
    delete this._callbackMap[eventObject.cid];
  }
  var callback = eventObject.callback;
  delete eventObject.callback;
  callback.call(eventObject, error, eventObject);
  this._onError(error);
};

// The last two optional arguments (a and b) can be options and/or callback
SCTransport.prototype.emit = function (event, data, a, b) {
  var self = this;
  
  var callback, options;
  
  if (b) {
    options = a;
    callback = b;
  } else {
    if (a instanceof Function) {
      options = {};
      callback = a;
    } else {
      options = a;
    }
  }
  
  var eventObject = {
    event: event,
    data: data,
    callback: callback
  };
  
  if (callback && !options.noTimeout) {
    eventObject.timeout = setTimeout(function () {
      self._handleEventAckTimeout(eventObject);
    }, this.options.ackTimeout);
  }
  
  var cid = null;
  if (this.state == this.OPEN || options.force) {
    cid = this.emitRaw(eventObject);
  }
  return cid;
};

SCTransport.prototype.cancelPendingResponse = function (cid) {
  delete this._callbackMap[cid];
};

SCTransport.prototype._isOwnDescendant = function (object, ancestors) {
  for (var i in ancestors) {
    if (ancestors[i] === object) {
      return true;
    }
  }
  return false;
};

SCTransport.prototype._arrayBufferToBase64 = function (arraybuffer) {
  var chars = this._base64Chars;
  var bytes = new Uint8Array(arraybuffer);
  var len = bytes.length;
  var base64 = '';

  for (var i = 0; i < len; i += 3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += chars[bytes[i + 2] & 63];
  }

  if ((len % 3) === 2) {
    base64 = base64.substring(0, base64.length - 1) + '=';
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + '==';
  }

  return base64;
};

SCTransport.prototype._convertBuffersToBase64 = function (object, ancestors) {
  if (!ancestors) {
    ancestors = [];
  }
  if (this._isOwnDescendant(object, ancestors)) {
    throw new Error('Cannot traverse circular structure');
  }
  var newAncestors = ancestors.concat([object]);
  
  if (typeof ArrayBuffer != 'undefined' && object instanceof ArrayBuffer) {
    return {
      base64: true,
      data: this._arrayBufferToBase64(object)
    };
  }
  
  if (object instanceof Array) {
    var base64Array = [];
    for (var i in object) {
      base64Array[i] = this._convertBuffersToBase64(object[i], newAncestors);
    }
    return base64Array;
  }
  if (object instanceof Object) {
    var base64Object = {};
    for (var j in object) {
      base64Object[j] = this._convertBuffersToBase64(object[j], newAncestors);
    }
    return base64Object;
  }
  
  return object;
};

SCTransport.prototype.parse = function (message) {
  return JSON.parse(message);
};

SCTransport.prototype.stringify = function (object) {
  return JSON.stringify(this._convertBuffersToBase64(object));
};

SCTransport.prototype.send = function (data) {
  if (this.socket.readyState != this.socket.OPEN) {
    this._onClose(1005);
  } else {
    this.socket.send(data);
  }
};

SCTransport.prototype.sendObject = function (object) {
  this.send(this.stringify(object));
};

module.exports.SCTransport = SCTransport;

},{"./response":8,"querystring":3,"sc-emitter":15,"ws":18}],11:[function(require,module,exports){
'use strict';

/**
 * Constants.
 */

var errorMessage;

errorMessage = 'An argument without append, prepend, ' +
    'or detach methods was given to `List';

/**
 * Creates a new List: A linked list is a bit like an Array, but
 * knows nothing about how many items are in it, and knows only about its
 * first (`head`) and last (`tail`) items. Each item (e.g. `head`, `tail`,
 * &c.) knows which item comes before or after it (its more like the
 * implementation of the DOM in JavaScript).
 * @global
 * @private
 * @constructor
 * @class Represents an instance of List.
 */

function List(/*items...*/) {
    if (arguments.length) {
        return List.from(arguments);
    }
}

var ListPrototype;

ListPrototype = List.prototype;

/**
 * Creates a new list from the arguments (each a list item) passed in.
 * @name List.of
 * @param {...ListItem} [items] - Zero or more items to attach.
 * @returns {list} - A new instance of List.
 */

List.of = function (/*items...*/) {
    return List.from.call(this, arguments);
};

/**
 * Creates a new list from the given array-like object (each a list item)
 * passed in.
 * @name List.from
 * @param {ListItem[]} [items] - The items to append.
 * @returns {list} - A new instance of List.
 */
List.from = function (items) {
    var list = new this(), length, iterator, item;

    if (items && (length = items.length)) {
        iterator = -1;

        while (++iterator < length) {
            item = items[iterator];

            if (item !== null && item !== undefined) {
                list.append(item);
            }
        }
    }

    return list;
};

/**
 * List#head
 * Default to `null`.
 */
ListPrototype.head = null;

/**
 * List#tail
 * Default to `null`.
 */
ListPrototype.tail = null;

/**
 * Returns the list's items as an array. This does *not* detach the items.
 * @name List#toArray
 * @returns {ListItem[]} - An array of (still attached) ListItems.
 */
ListPrototype.toArray = function () {
    var item = this.head,
        result = [];

    while (item) {
        result.push(item);
        item = item.next;
    }

    return result;
};

/**
 * Prepends the given item to the list: Item will be the new first item
 * (`head`).
 * @name List#prepend
 * @param {ListItem} item - The item to prepend.
 * @returns {ListItem} - An instance of ListItem (the given item).
 */
ListPrototype.prepend = function (item) {
    if (!item) {
        return false;
    }

    if (!item.append || !item.prepend || !item.detach) {
        throw new Error(errorMessage + '#prepend`.');
    }

    var self, head;

    // Cache self.
    self = this;

    // If self has a first item, defer prepend to the first items prepend
    // method, and return the result.
    head = self.head;

    if (head) {
        return head.prepend(item);
    }

    // ...otherwise, there is no `head` (or `tail`) item yet.

    // Detach the prependee.
    item.detach();

    // Set the prependees parent list to reference self.
    item.list = self;

    // Set self's first item to the prependee, and return the item.
    self.head = item;

    return item;
};

/**
 * Appends the given item to the list: Item will be the new last item (`tail`)
 * if the list had a first item, and its first item (`head`) otherwise.
 * @name List#append
 * @param {ListItem} item - The item to append.
 * @returns {ListItem} - An instance of ListItem (the given item).
 */

ListPrototype.append = function (item) {
    if (!item) {
        return false;
    }

    if (!item.append || !item.prepend || !item.detach) {
        throw new Error(errorMessage + '#append`.');
    }

    var self, head, tail;

    // Cache self.
    self = this;

    // If self has a last item, defer appending to the last items append
    // method, and return the result.
    tail = self.tail;

    if (tail) {
        return tail.append(item);
    }

    // If self has a first item, defer appending to the first items append
    // method, and return the result.
    head = self.head;

    if (head) {
        return head.append(item);
    }

    // ...otherwise, there is no `tail` or `head` item yet.

    // Detach the appendee.
    item.detach();

    // Set the appendees parent list to reference self.
    item.list = self;

    // Set self's first item to the appendee, and return the item.
    self.head = item;

    return item;
};

/**
 * Creates a new ListItem: A linked list item is a bit like DOM node:
 * It knows only about its "parent" (`list`), the item before it (`prev`),
 * and the item after it (`next`).
 * @global
 * @private
 * @constructor
 * @class Represents an instance of ListItem.
 */

function ListItem() {}

List.Item = ListItem;

var ListItemPrototype = ListItem.prototype;

ListItemPrototype.next = null;

ListItemPrototype.prev = null;

ListItemPrototype.list = null;

/**
 * Detaches the item operated on from its parent list.
 * @name ListItem#detach
 * @returns {ListItem} - The item operated on.
 */
ListItemPrototype.detach = function () {
    // Cache self, the parent list, and the previous and next items.
    var self = this,
        list = self.list,
        prev = self.prev,
        next = self.next;

    // If the item is already detached, return self.
    if (!list) {
        return self;
    }

    // If self is the last item in the parent list, link the lists last item
    // to the previous item.
    if (list.tail === self) {
        list.tail = prev;
    }

    // If self is the first item in the parent list, link the lists first item
    // to the next item.
    if (list.head === self) {
        list.head = next;
    }

    // If both the last and first items in the parent list are the same,
    // remove the link to the last item.
    if (list.tail === list.head) {
        list.tail = null;
    }

    // If a previous item exists, link its next item to selfs next item.
    if (prev) {
        prev.next = next;
    }

    // If a next item exists, link its previous item to selfs previous item.
    if (next) {
        next.prev = prev;
    }

    // Remove links from self to both the next and previous items, and to the
    // parent list.
    self.prev = self.next = self.list = null;

    // Return self.
    return self;
};

/**
 * Prepends the given item *before* the item operated on.
 * @name ListItem#prepend
 * @param {ListItem} item - The item to prepend.
 * @returns {ListItem} - The item operated on, or false when that item is not
 * attached.
 */
ListItemPrototype.prepend = function (item) {
    if (!item || !item.append || !item.prepend || !item.detach) {
        throw new Error(errorMessage + 'Item#prepend`.');
    }

    // Cache self, the parent list, and the previous item.
    var self = this,
        list = self.list,
        prev = self.prev;

    // If self is detached, return false.
    if (!list) {
        return false;
    }

    // Detach the prependee.
    item.detach();

    // If self has a previous item...
    if (prev) {
        // ...link the prependees previous item, to selfs previous item.
        item.prev = prev;

        // ...link the previous items next item, to self.
        prev.next = item;
    }

    // Set the prependees next item to self.
    item.next = self;

    // Set the prependees parent list to selfs parent list.
    item.list = list;

    // Set the previous item of self to the prependee.
    self.prev = item;

    // If self is the first item in the parent list, link the lists first item
    // to the prependee.
    if (self === list.head) {
        list.head = item;
    }

    // If the the parent list has no last item, link the lists last item to
    // self.
    if (!list.tail) {
        list.tail = self;
    }

    // Return the prependee.
    return item;
};

/**
 * Appends the given item *after* the item operated on.
 * @name ListItem#append
 * @param {ListItem} item - The item to append.
 * @returns {ListItem} - The item operated on, or false when that item is not
 * attached.
 */
ListItemPrototype.append = function (item) {
    // If item is falsey, return false.
    if (!item || !item.append || !item.prepend || !item.detach) {
        throw new Error(errorMessage + 'Item#append`.');
    }

    // Cache self, the parent list, and the next item.
    var self = this,
        list = self.list,
        next = self.next;

    // If self is detached, return false.
    if (!list) {
        return false;
    }

    // Detach the appendee.
    item.detach();

    // If self has a next item...
    if (next) {
        // ...link the appendees next item, to selfs next item.
        item.next = next;

        // ...link the next items previous item, to the appendee.
        next.prev = item;
    }

    // Set the appendees previous item to self.
    item.prev = self;

    // Set the appendees parent list to selfs parent list.
    item.list = list;

    // Set the next item of self to the appendee.
    self.next = item;

    // If the the parent list has no last item or if self is the parent lists
    // last item, link the lists last item to the appendee.
    if (self === list.tail || !list.tail) {
        list.tail = item;
    }

    // Return the appendee.
    return item;
};

/**
 * Expose `List`.
 */

module.exports = List;

},{}],12:[function(require,module,exports){
'use strict';

module.exports = require('./_source/linked-list.js');

},{"./_source/linked-list.js":11}],13:[function(require,module,exports){
var SCEmitter = require('sc-emitter').SCEmitter;

if (!Object.create) {
  Object.create = require('./objectcreate');
}

var SCChannel = function (name, client) {
  var self = this;
  
  SCEmitter.call(this);
  
  this.PENDING = 'pending';
  this.SUBSCRIBED = 'subscribed';
  this.UNSUBSCRIBED = 'unsubscribed';
  
  this.name = name;
  this.state = this.UNSUBSCRIBED;
  this.client = client;
};

SCChannel.prototype = Object.create(SCEmitter.prototype);

SCChannel.prototype.getState = function () {
  return this.state;
};

SCChannel.prototype.subscribe = function () {
  this.client.subscribe(this.name);
};

SCChannel.prototype.unsubscribe = function () {
  this.client.unsubscribe(this.name);
};

SCChannel.prototype.isSubscribed = function (includePending) {
  return this.client.isSubscribed(this.name, includePending);
};

SCChannel.prototype.publish = function (data, callback) {
  this.client.publish(this.name, data, callback);
};

SCChannel.prototype.watch = function (handler) {
  this.client.watch(this.name, handler);
};

SCChannel.prototype.unwatch = function (handler) {
  this.client.unwatch(this.name, handler);
};

SCChannel.prototype.watchers = function () {
  return this.client.watchers(this.name);
};

SCChannel.prototype.destroy = function () {
  this.client.destroyChannel(this.name);
};

module.exports.SCChannel = SCChannel;

},{"./objectcreate":14,"sc-emitter":15}],14:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],15:[function(require,module,exports){
var Emitter = require('component-emitter');

if (!Object.create) {
  Object.create = require('./objectcreate');
}

var SCEmitter = function () {
  Emitter.call(this);
};

SCEmitter.prototype = Object.create(Emitter.prototype);

SCEmitter.prototype.emit = function (event) {
  if (event == 'error' && this.domain) {
    // Emit the error on the domain if it has one.
    // See https://github.com/joyent/node/blob/ef4344311e19a4f73c031508252b21712b22fe8a/lib/events.js#L78-85
    
    var err = arguments[1];
    
    if (!err) {
      err = new Error('Uncaught, unspecified "error" event.');
    }
    err.domainEmitter = this;
    err.domain = this.domain;
    err.domainThrown = false;
    this.domain.emit('error', err);
  }
  Emitter.prototype.emit.apply(this, arguments);
};

module.exports.SCEmitter = SCEmitter;

},{"./objectcreate":17,"component-emitter":16}],16:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],17:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],18:[function(require,module,exports){

/**
 * Module dependencies.
 */

var global = (function() { return this; })();

/**
 * WebSocket constructor.
 */

var WebSocket = global.WebSocket || global.MozWebSocket;

/**
 * Module exports.
 */

module.exports = WebSocket ? ws : null;

/**
 * WebSocket constructor.
 *
 * The third `opts` options object gets ignored in web browsers, since it's
 * non-standard, and throws a TypeError if passed to the constructor.
 * See: https://github.com/einaros/ws/issues/227
 *
 * @param {String} uri
 * @param {Array} protocols (optional)
 * @param {Object) opts (optional)
 * @api public
 */

function ws(uri, protocols, opts) {
  var instance;
  if (protocols) {
    instance = new WebSocket(uri, protocols);
  } else {
    instance = new WebSocket(uri);
  }
  return instance;
}

if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],19:[function(require,module,exports){
module.exports={
  "name": "socketcluster-client",
  "description": "SocketCluster JavaScript client",
  "version": "2.2.33",
  "homepage": "http://socketcluster.io",
  "contributors": [
    {
      "name": "Jonathan Gros-Dubois",
      "email": "grosjona@yahoo.com.au"
    }
  ],
  "repository": {
    "type": "git",
    "url": "git://github.com/SocketCluster/socketcluster-client.git"
  },
  "dependencies": {
    "linked-list": "0.1.0",
    "sc-channel": "1.0.x",
    "sc-emitter": "1.0.x",
    "ws": "0.7.1"
  },
  "gitHead": "4e85d75bb523f845875d7c83b367ff2020daa0b9",
  "bugs": {
    "url": "https://github.com/SocketCluster/socketcluster-client/issues"
  },
  "_id": "socketcluster-client@2.2.33",
  "scripts": {},
  "_shasum": "3ffe089f9c53bf3f9740f8c1b4e2fb602e0ec921",
  "_from": "socketcluster-client@*",
  "_npmVersion": "2.7.4",
  "_nodeVersion": "0.12.2",
  "_npmUser": {
    "name": "topcloudsystems",
    "email": "grosjona@yahoo.com.au"
  },
  "maintainers": [
    {
      "name": "topcloudsystems",
      "email": "grosjona@yahoo.com.au"
    }
  ],
  "dist": {
    "shasum": "3ffe089f9c53bf3f9740f8c1b4e2fb602e0ec921",
    "tarball": "http://registry.npmjs.org/socketcluster-client/-/socketcluster-client-2.2.33.tgz"
  },
  "directories": {},
  "_resolved": "https://registry.npmjs.org/socketcluster-client/-/socketcluster-client-2.2.33.tgz"
}

},{}],"classnames":[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

(function () {
	'use strict';

	function classNames () {

		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if ('string' === argType || 'number' === argType) {
				classes += ' ' + arg;

			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);

			} else if ('object' === argType) {
				for (var key in arg) {
					if (arg.hasOwnProperty(key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// AMD. Register as an anonymous module.
		define(function () {
			return classNames;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else {
		window.classNames = classNames;
	}

}());

},{}],"debug":[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":4}],"events":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"object-assign":[function(require,module,exports){
'use strict';
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function ownEnumerableKeys(obj) {
	var keys = Object.getOwnPropertyNames(obj);

	if (Object.getOwnPropertySymbols) {
		keys = keys.concat(Object.getOwnPropertySymbols(obj));
	}

	return keys.filter(function (key) {
		return propIsEnumerable.call(obj, key);
	});
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = ownEnumerableKeys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],"socketcluster-client":[function(require,module,exports){
var pkg = require('./package.json');
var SCSocket = require('./lib/scsocket');
module.exports.SCSocket = SCSocket;

module.exports.SCEmitter = require('sc-emitter').SCEmitter;

module.exports.connect = function (options) {
  return new SCSocket(options);
};

module.exports.version = pkg.version;

},{"./lib/scsocket":9,"./package.json":19,"sc-emitter":15}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcXVlcnlzdHJpbmctZXMzL2RlY29kZS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9xdWVyeXN0cmluZy1lczMvZW5jb2RlLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3F1ZXJ5c3RyaW5nLWVzMy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kZWJ1Zy9kZWJ1Zy5qcyIsIm5vZGVfbW9kdWxlcy9kZWJ1Zy9ub2RlX21vZHVsZXMvbXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc29ja2V0Y2x1c3Rlci1jbGllbnQvbGliL2F1dGguanMiLCJub2RlX21vZHVsZXMvc29ja2V0Y2x1c3Rlci1jbGllbnQvbGliL29iamVjdGNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9zb2NrZXRjbHVzdGVyLWNsaWVudC9saWIvcmVzcG9uc2UuanMiLCJub2RlX21vZHVsZXMvc29ja2V0Y2x1c3Rlci1jbGllbnQvbGliL3Njc29ja2V0LmpzIiwibm9kZV9tb2R1bGVzL3NvY2tldGNsdXN0ZXItY2xpZW50L2xpYi9zY3RyYW5zcG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9zb2NrZXRjbHVzdGVyLWNsaWVudC9ub2RlX21vZHVsZXMvbGlua2VkLWxpc3QvX3NvdXJjZS9saW5rZWQtbGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9zb2NrZXRjbHVzdGVyLWNsaWVudC9ub2RlX21vZHVsZXMvbGlua2VkLWxpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc29ja2V0Y2x1c3Rlci1jbGllbnQvbm9kZV9tb2R1bGVzL3NjLWNoYW5uZWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc29ja2V0Y2x1c3Rlci1jbGllbnQvbm9kZV9tb2R1bGVzL3NjLWVtaXR0ZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvc29ja2V0Y2x1c3Rlci1jbGllbnQvbm9kZV9tb2R1bGVzL3NjLWVtaXR0ZXIvbm9kZV9tb2R1bGVzL2NvbXBvbmVudC1lbWl0dGVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3NvY2tldGNsdXN0ZXItY2xpZW50L25vZGVfbW9kdWxlcy93cy9saWIvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9zb2NrZXRjbHVzdGVyLWNsaWVudC9wYWNrYWdlLmpzb24iLCJjbGFzc25hbWVzIiwiZGVidWciLCJldmVudHMiLCJvYmplY3QtYXNzaWduIiwic29ja2V0Y2x1c3Rlci1jbGllbnQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2h0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsWUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gSWYgb2JqLmhhc093blByb3BlcnR5IGhhcyBiZWVuIG92ZXJyaWRkZW4sIHRoZW4gY2FsbGluZ1xuLy8gb2JqLmhhc093blByb3BlcnR5KHByb3ApIHdpbGwgYnJlYWsuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9pc3N1ZXMvMTcwN1xuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihxcywgc2VwLCBlcSwgb3B0aW9ucykge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgdmFyIG9iaiA9IHt9O1xuXG4gIGlmICh0eXBlb2YgcXMgIT09ICdzdHJpbmcnIHx8IHFzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgcmVnZXhwID0gL1xcKy9nO1xuICBxcyA9IHFzLnNwbGl0KHNlcCk7XG5cbiAgdmFyIG1heEtleXMgPSAxMDAwO1xuICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5tYXhLZXlzID09PSAnbnVtYmVyJykge1xuICAgIG1heEtleXMgPSBvcHRpb25zLm1heEtleXM7XG4gIH1cblxuICB2YXIgbGVuID0gcXMubGVuZ3RoO1xuICAvLyBtYXhLZXlzIDw9IDAgbWVhbnMgdGhhdCB3ZSBzaG91bGQgbm90IGxpbWl0IGtleXMgY291bnRcbiAgaWYgKG1heEtleXMgPiAwICYmIGxlbiA+IG1heEtleXMpIHtcbiAgICBsZW4gPSBtYXhLZXlzO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIHZhciB4ID0gcXNbaV0ucmVwbGFjZShyZWdleHAsICclMjAnKSxcbiAgICAgICAgaWR4ID0geC5pbmRleE9mKGVxKSxcbiAgICAgICAga3N0ciwgdnN0ciwgaywgdjtcblxuICAgIGlmIChpZHggPj0gMCkge1xuICAgICAga3N0ciA9IHguc3Vic3RyKDAsIGlkeCk7XG4gICAgICB2c3RyID0geC5zdWJzdHIoaWR4ICsgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGtzdHIgPSB4O1xuICAgICAgdnN0ciA9ICcnO1xuICAgIH1cblxuICAgIGsgPSBkZWNvZGVVUklDb21wb25lbnQoa3N0cik7XG4gICAgdiA9IGRlY29kZVVSSUNvbXBvbmVudCh2c3RyKTtcblxuICAgIGlmICghaGFzT3duUHJvcGVydHkob2JqLCBrKSkge1xuICAgICAgb2JqW2tdID0gdjtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgb2JqW2tdLnB1c2godik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrXSA9IFtvYmpba10sIHZdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvYmo7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBzdHJpbmdpZnlQcmltaXRpdmUgPSBmdW5jdGlvbih2KSB7XG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHY7XG5cbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiB2ID8gJ3RydWUnIDogJ2ZhbHNlJztcblxuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaXNGaW5pdGUodikgPyB2IDogJyc7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iaiwgc2VwLCBlcSwgbmFtZSkge1xuICBzZXAgPSBzZXAgfHwgJyYnO1xuICBlcSA9IGVxIHx8ICc9JztcbiAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgIG9iaiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBtYXAob2JqZWN0S2V5cyhvYmopLCBmdW5jdGlvbihrKSB7XG4gICAgICB2YXIga3MgPSBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKGspKSArIGVxO1xuICAgICAgaWYgKGlzQXJyYXkob2JqW2tdKSkge1xuICAgICAgICByZXR1cm4gbWFwKG9ialtrXSwgZnVuY3Rpb24odikge1xuICAgICAgICAgIHJldHVybiBrcyArIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUodikpO1xuICAgICAgICB9KS5qb2luKHNlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ga3MgKyBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG9ialtrXSkpO1xuICAgICAgfVxuICAgIH0pLmpvaW4oc2VwKTtcblxuICB9XG5cbiAgaWYgKCFuYW1lKSByZXR1cm4gJyc7XG4gIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5naWZ5UHJpbWl0aXZlKG5hbWUpKSArIGVxICtcbiAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmdpZnlQcmltaXRpdmUob2JqKSk7XG59O1xuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHhzKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeHMpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuZnVuY3Rpb24gbWFwICh4cywgZikge1xuICBpZiAoeHMubWFwKSByZXR1cm4geHMubWFwKGYpO1xuICB2YXIgcmVzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICByZXMucHVzaChmKHhzW2ldLCBpKSk7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxudmFyIG9iamVjdEtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqKSB7XG4gIHZhciByZXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSByZXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnRzLmRlY29kZSA9IGV4cG9ydHMucGFyc2UgPSByZXF1aXJlKCcuL2RlY29kZScpO1xuZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLnN0cmluZ2lmeSA9IHJlcXVpcmUoJy4vZW5jb2RlJyk7XG4iLCJcbi8qKlxuICogVGhpcyBpcyB0aGUgY29tbW9uIGxvZ2ljIGZvciBib3RoIHRoZSBOb2RlLmpzIGFuZCB3ZWIgYnJvd3NlclxuICogaW1wbGVtZW50YXRpb25zIG9mIGBkZWJ1ZygpYC5cbiAqXG4gKiBFeHBvc2UgYGRlYnVnKClgIGFzIHRoZSBtb2R1bGUuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZGVidWc7XG5leHBvcnRzLmNvZXJjZSA9IGNvZXJjZTtcbmV4cG9ydHMuZGlzYWJsZSA9IGRpc2FibGU7XG5leHBvcnRzLmVuYWJsZSA9IGVuYWJsZTtcbmV4cG9ydHMuZW5hYmxlZCA9IGVuYWJsZWQ7XG5leHBvcnRzLmh1bWFuaXplID0gcmVxdWlyZSgnbXMnKTtcblxuLyoqXG4gKiBUaGUgY3VycmVudGx5IGFjdGl2ZSBkZWJ1ZyBtb2RlIG5hbWVzLCBhbmQgbmFtZXMgdG8gc2tpcC5cbiAqL1xuXG5leHBvcnRzLm5hbWVzID0gW107XG5leHBvcnRzLnNraXBzID0gW107XG5cbi8qKlxuICogTWFwIG9mIHNwZWNpYWwgXCIlblwiIGhhbmRsaW5nIGZ1bmN0aW9ucywgZm9yIHRoZSBkZWJ1ZyBcImZvcm1hdFwiIGFyZ3VtZW50LlxuICpcbiAqIFZhbGlkIGtleSBuYW1lcyBhcmUgYSBzaW5nbGUsIGxvd2VyY2FzZWQgbGV0dGVyLCBpLmUuIFwiblwiLlxuICovXG5cbmV4cG9ydHMuZm9ybWF0dGVycyA9IHt9O1xuXG4vKipcbiAqIFByZXZpb3VzbHkgYXNzaWduZWQgY29sb3IuXG4gKi9cblxudmFyIHByZXZDb2xvciA9IDA7XG5cbi8qKlxuICogUHJldmlvdXMgbG9nIHRpbWVzdGFtcC5cbiAqL1xuXG52YXIgcHJldlRpbWU7XG5cbi8qKlxuICogU2VsZWN0IGEgY29sb3IuXG4gKlxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2VsZWN0Q29sb3IoKSB7XG4gIHJldHVybiBleHBvcnRzLmNvbG9yc1twcmV2Q29sb3IrKyAlIGV4cG9ydHMuY29sb3JzLmxlbmd0aF07XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgZGVidWdnZXIgd2l0aCB0aGUgZ2l2ZW4gYG5hbWVzcGFjZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGRlYnVnKG5hbWVzcGFjZSkge1xuXG4gIC8vIGRlZmluZSB0aGUgYGRpc2FibGVkYCB2ZXJzaW9uXG4gIGZ1bmN0aW9uIGRpc2FibGVkKCkge1xuICB9XG4gIGRpc2FibGVkLmVuYWJsZWQgPSBmYWxzZTtcblxuICAvLyBkZWZpbmUgdGhlIGBlbmFibGVkYCB2ZXJzaW9uXG4gIGZ1bmN0aW9uIGVuYWJsZWQoKSB7XG5cbiAgICB2YXIgc2VsZiA9IGVuYWJsZWQ7XG5cbiAgICAvLyBzZXQgYGRpZmZgIHRpbWVzdGFtcFxuICAgIHZhciBjdXJyID0gK25ldyBEYXRlKCk7XG4gICAgdmFyIG1zID0gY3VyciAtIChwcmV2VGltZSB8fCBjdXJyKTtcbiAgICBzZWxmLmRpZmYgPSBtcztcbiAgICBzZWxmLnByZXYgPSBwcmV2VGltZTtcbiAgICBzZWxmLmN1cnIgPSBjdXJyO1xuICAgIHByZXZUaW1lID0gY3VycjtcblxuICAgIC8vIGFkZCB0aGUgYGNvbG9yYCBpZiBub3Qgc2V0XG4gICAgaWYgKG51bGwgPT0gc2VsZi51c2VDb2xvcnMpIHNlbGYudXNlQ29sb3JzID0gZXhwb3J0cy51c2VDb2xvcnMoKTtcbiAgICBpZiAobnVsbCA9PSBzZWxmLmNvbG9yICYmIHNlbGYudXNlQ29sb3JzKSBzZWxmLmNvbG9yID0gc2VsZWN0Q29sb3IoKTtcblxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIGFyZ3NbMF0gPSBleHBvcnRzLmNvZXJjZShhcmdzWzBdKTtcblxuICAgIGlmICgnc3RyaW5nJyAhPT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgIC8vIGFueXRoaW5nIGVsc2UgbGV0J3MgaW5zcGVjdCB3aXRoICVvXG4gICAgICBhcmdzID0gWyclbyddLmNvbmNhdChhcmdzKTtcbiAgICB9XG5cbiAgICAvLyBhcHBseSBhbnkgYGZvcm1hdHRlcnNgIHRyYW5zZm9ybWF0aW9uc1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgYXJnc1swXSA9IGFyZ3NbMF0ucmVwbGFjZSgvJShbYS16JV0pL2csIGZ1bmN0aW9uKG1hdGNoLCBmb3JtYXQpIHtcbiAgICAgIC8vIGlmIHdlIGVuY291bnRlciBhbiBlc2NhcGVkICUgdGhlbiBkb24ndCBpbmNyZWFzZSB0aGUgYXJyYXkgaW5kZXhcbiAgICAgIGlmIChtYXRjaCA9PT0gJyUlJykgcmV0dXJuIG1hdGNoO1xuICAgICAgaW5kZXgrKztcbiAgICAgIHZhciBmb3JtYXR0ZXIgPSBleHBvcnRzLmZvcm1hdHRlcnNbZm9ybWF0XTtcbiAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgZm9ybWF0dGVyKSB7XG4gICAgICAgIHZhciB2YWwgPSBhcmdzW2luZGV4XTtcbiAgICAgICAgbWF0Y2ggPSBmb3JtYXR0ZXIuY2FsbChzZWxmLCB2YWwpO1xuXG4gICAgICAgIC8vIG5vdyB3ZSBuZWVkIHRvIHJlbW92ZSBgYXJnc1tpbmRleF1gIHNpbmNlIGl0J3MgaW5saW5lZCBpbiB0aGUgYGZvcm1hdGBcbiAgICAgICAgYXJncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBpbmRleC0tO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH0pO1xuXG4gICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBleHBvcnRzLmZvcm1hdEFyZ3MpIHtcbiAgICAgIGFyZ3MgPSBleHBvcnRzLmZvcm1hdEFyZ3MuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuICAgIHZhciBsb2dGbiA9IGVuYWJsZWQubG9nIHx8IGV4cG9ydHMubG9nIHx8IGNvbnNvbGUubG9nLmJpbmQoY29uc29sZSk7XG4gICAgbG9nRm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH1cbiAgZW5hYmxlZC5lbmFibGVkID0gdHJ1ZTtcblxuICB2YXIgZm4gPSBleHBvcnRzLmVuYWJsZWQobmFtZXNwYWNlKSA/IGVuYWJsZWQgOiBkaXNhYmxlZDtcblxuICBmbi5uYW1lc3BhY2UgPSBuYW1lc3BhY2U7XG5cbiAgcmV0dXJuIGZuO1xufVxuXG4vKipcbiAqIEVuYWJsZXMgYSBkZWJ1ZyBtb2RlIGJ5IG5hbWVzcGFjZXMuIFRoaXMgY2FuIGluY2x1ZGUgbW9kZXNcbiAqIHNlcGFyYXRlZCBieSBhIGNvbG9uIGFuZCB3aWxkY2FyZHMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZXNcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gZW5hYmxlKG5hbWVzcGFjZXMpIHtcbiAgZXhwb3J0cy5zYXZlKG5hbWVzcGFjZXMpO1xuXG4gIHZhciBzcGxpdCA9IChuYW1lc3BhY2VzIHx8ICcnKS5zcGxpdCgvW1xccyxdKy8pO1xuICB2YXIgbGVuID0gc3BsaXQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoIXNwbGl0W2ldKSBjb250aW51ZTsgLy8gaWdub3JlIGVtcHR5IHN0cmluZ3NcbiAgICBuYW1lc3BhY2VzID0gc3BsaXRbaV0ucmVwbGFjZSgvXFwqL2csICcuKj8nKTtcbiAgICBpZiAobmFtZXNwYWNlc1swXSA9PT0gJy0nKSB7XG4gICAgICBleHBvcnRzLnNraXBzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzLnN1YnN0cigxKSArICckJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLm5hbWVzLnB1c2gobmV3IFJlZ0V4cCgnXicgKyBuYW1lc3BhY2VzICsgJyQnKSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogRGlzYWJsZSBkZWJ1ZyBvdXRwdXQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkaXNhYmxlKCkge1xuICBleHBvcnRzLmVuYWJsZSgnJyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBtb2RlIG5hbWUgaXMgZW5hYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBlbmFibGVkKG5hbWUpIHtcbiAgdmFyIGksIGxlbjtcbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5za2lwcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLnNraXBzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZm9yIChpID0gMCwgbGVuID0gZXhwb3J0cy5uYW1lcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChleHBvcnRzLm5hbWVzW2ldLnRlc3QobmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQ29lcmNlIGB2YWxgLlxuICpcbiAqIEBwYXJhbSB7TWl4ZWR9IHZhbFxuICogQHJldHVybiB7TWl4ZWR9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjb2VyY2UodmFsKSB7XG4gIGlmICh2YWwgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuIHZhbC5zdGFjayB8fCB2YWwubWVzc2FnZTtcbiAgcmV0dXJuIHZhbDtcbn1cbiIsIi8qKlxuICogSGVscGVycy5cbiAqL1xuXG52YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgeSA9IGQgKiAzNjUuMjU7XG5cbi8qKlxuICogUGFyc2Ugb3IgZm9ybWF0IHRoZSBnaXZlbiBgdmFsYC5cbiAqXG4gKiBPcHRpb25zOlxuICpcbiAqICAtIGBsb25nYCB2ZXJib3NlIGZvcm1hdHRpbmcgW2ZhbHNlXVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gdmFsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwsIG9wdGlvbnMpe1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgaWYgKCdzdHJpbmcnID09IHR5cGVvZiB2YWwpIHJldHVybiBwYXJzZSh2YWwpO1xuICByZXR1cm4gb3B0aW9ucy5sb25nXG4gICAgPyBsb25nKHZhbClcbiAgICA6IHNob3J0KHZhbCk7XG59O1xuXG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCBhbmQgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBwYXJzZShzdHIpIHtcbiAgc3RyID0gJycgKyBzdHI7XG4gIGlmIChzdHIubGVuZ3RoID4gMTAwMDApIHJldHVybjtcbiAgdmFyIG1hdGNoID0gL14oKD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhzdHIpO1xuICBpZiAoIW1hdGNoKSByZXR1cm47XG4gIHZhciBuID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKCk7XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgJ3llYXJzJzpcbiAgICBjYXNlICd5ZWFyJzpcbiAgICBjYXNlICd5cnMnOlxuICAgIGNhc2UgJ3lyJzpcbiAgICBjYXNlICd5JzpcbiAgICAgIHJldHVybiBuICogeTtcbiAgICBjYXNlICdkYXlzJzpcbiAgICBjYXNlICdkYXknOlxuICAgIGNhc2UgJ2QnOlxuICAgICAgcmV0dXJuIG4gKiBkO1xuICAgIGNhc2UgJ2hvdXJzJzpcbiAgICBjYXNlICdob3VyJzpcbiAgICBjYXNlICdocnMnOlxuICAgIGNhc2UgJ2hyJzpcbiAgICBjYXNlICdoJzpcbiAgICAgIHJldHVybiBuICogaDtcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICBjYXNlICdtaW51dGUnOlxuICAgIGNhc2UgJ21pbnMnOlxuICAgIGNhc2UgJ21pbic6XG4gICAgY2FzZSAnbSc6XG4gICAgICByZXR1cm4gbiAqIG07XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgY2FzZSAnc2Vjb25kJzpcbiAgICBjYXNlICdzZWNzJzpcbiAgICBjYXNlICdzZWMnOlxuICAgIGNhc2UgJ3MnOlxuICAgICAgcmV0dXJuIG4gKiBzO1xuICAgIGNhc2UgJ21pbGxpc2Vjb25kcyc6XG4gICAgY2FzZSAnbWlsbGlzZWNvbmQnOlxuICAgIGNhc2UgJ21zZWNzJzpcbiAgICBjYXNlICdtc2VjJzpcbiAgICBjYXNlICdtcyc6XG4gICAgICByZXR1cm4gbjtcbiAgfVxufVxuXG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNob3J0KG1zKSB7XG4gIGlmIChtcyA+PSBkKSByZXR1cm4gTWF0aC5yb3VuZChtcyAvIGQpICsgJ2QnO1xuICBpZiAobXMgPj0gaCkgcmV0dXJuIE1hdGgucm91bmQobXMgLyBoKSArICdoJztcbiAgaWYgKG1zID49IG0pIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gIGlmIChtcyA+PSBzKSByZXR1cm4gTWF0aC5yb3VuZChtcyAvIHMpICsgJ3MnO1xuICByZXR1cm4gbXMgKyAnbXMnO1xufVxuXG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9uZyhtcykge1xuICByZXR1cm4gcGx1cmFsKG1zLCBkLCAnZGF5JylcbiAgICB8fCBwbHVyYWwobXMsIGgsICdob3VyJylcbiAgICB8fCBwbHVyYWwobXMsIG0sICdtaW51dGUnKVxuICAgIHx8IHBsdXJhbChtcywgcywgJ3NlY29uZCcpXG4gICAgfHwgbXMgKyAnIG1zJztcbn1cblxuLyoqXG4gKiBQbHVyYWxpemF0aW9uIGhlbHBlci5cbiAqL1xuXG5mdW5jdGlvbiBwbHVyYWwobXMsIG4sIG5hbWUpIHtcbiAgaWYgKG1zIDwgbikgcmV0dXJuO1xuICBpZiAobXMgPCBuICogMS41KSByZXR1cm4gTWF0aC5mbG9vcihtcyAvIG4pICsgJyAnICsgbmFtZTtcbiAgcmV0dXJuIE1hdGguY2VpbChtcyAvIG4pICsgJyAnICsgbmFtZSArICdzJztcbn1cbiIsInZhciBBdXRoRW5naW5lID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9pbnRlcm5hbFN0b3JhZ2UgPSB7fTtcbn07XG5cbkF1dGhFbmdpbmUucHJvdG90eXBlLnNhdmVUb2tlbiA9IGZ1bmN0aW9uIChuYW1lLCB0b2tlbiwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKGdsb2JhbC5sb2NhbFN0b3JhZ2UpIHtcbiAgICBnbG9iYWwubG9jYWxTdG9yYWdlLnNldEl0ZW0obmFtZSwgdG9rZW4pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuX2ludGVybmFsU3RvcmFnZVtuYW1lXSA9IHRva2VuO1xuICB9XG4gIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG59O1xuXG5BdXRoRW5naW5lLnByb3RvdHlwZS5yZW1vdmVUb2tlbiA9IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICBpZiAoZ2xvYmFsLmxvY2FsU3RvcmFnZSkge1xuICAgIGdsb2JhbC5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShuYW1lKTtcbiAgfVxuICBkZWxldGUgdGhpcy5faW50ZXJuYWxTdG9yYWdlW25hbWVdO1xuICBcbiAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbn07XG5cbkF1dGhFbmdpbmUucHJvdG90eXBlLmxvYWRUb2tlbiA9IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICB2YXIgdG9rZW47XG4gIFxuICBpZiAoZ2xvYmFsLmxvY2FsU3RvcmFnZSkge1xuICAgIHRva2VuID0gZ2xvYmFsLmxvY2FsU3RvcmFnZS5nZXRJdGVtKG5hbWUpO1xuICB9IGVsc2Uge1xuICAgIHRva2VuID0gdGhpcy5faW50ZXJuYWxTdG9yYWdlW25hbWVdIHx8IG51bGw7XG4gIH1cbiAgY2FsbGJhY2sobnVsbCwgdG9rZW4pO1xufTtcblxubW9kdWxlLmV4cG9ydHMuQXV0aEVuZ2luZSA9IEF1dGhFbmdpbmU7IiwibW9kdWxlLmV4cG9ydHMuY3JlYXRlID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRigpIHt9O1xuXG4gIHJldHVybiBmdW5jdGlvbiAobykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT2JqZWN0LmNyZWF0ZSBpbXBsZW1lbnRhdGlvbiBvbmx5IGFjY2VwdHMgb25lIHBhcmFtZXRlci4nKTtcbiAgICB9XG4gICAgRi5wcm90b3R5cGUgPSBvO1xuICAgIHJldHVybiBuZXcgRigpO1xuICB9XG59KSgpOyIsInZhciBSZXNwb25zZSA9IGZ1bmN0aW9uIChzb2NrZXQsIGlkKSB7XG4gIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICB0aGlzLmlkID0gaWQ7XG59O1xuXG5SZXNwb25zZS5wcm90b3R5cGUuX3Jlc3BvbmQgPSBmdW5jdGlvbiAocmVzcG9uc2VEYXRhKSB7XG4gIHRoaXMuc29ja2V0LnNlbmQodGhpcy5zb2NrZXQuc3RyaW5naWZ5KHJlc3BvbnNlRGF0YSkpO1xufTtcblxuUmVzcG9uc2UucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIGlmICh0aGlzLmlkKSB7XG4gICAgdmFyIHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgIHJpZDogdGhpcy5pZFxuICAgIH07XG4gICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzcG9uc2VEYXRhLmRhdGEgPSBkYXRhO1xuICAgIH1cbiAgICB0aGlzLl9yZXNwb25kKHJlc3BvbnNlRGF0YSk7XG4gIH1cbn07XG5cblJlc3BvbnNlLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIChlcnJvciwgZGF0YSkge1xuICBpZiAodGhpcy5pZCkge1xuICAgIHZhciBlcnI7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGVyciA9IHtuYW1lOiBlcnJvci5uYW1lLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlLCBzdGFjazogZXJyb3Iuc3RhY2t9OyAgICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICBlcnIgPSBlcnJvcjtcbiAgICB9XG4gICAgXG4gICAgdmFyIHJlc3BvbnNlRGF0YSA9IHtcbiAgICAgIHJpZDogdGhpcy5pZCxcbiAgICAgIGVycm9yOiBlcnJcbiAgICB9O1xuICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3BvbnNlRGF0YS5kYXRhID0gZGF0YTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5fcmVzcG9uZChyZXNwb25zZURhdGEpO1xuICB9XG59O1xuXG5SZXNwb25zZS5wcm90b3R5cGUuY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXJyb3IsIGRhdGEpIHtcbiAgaWYgKGVycm9yKSB7XG4gICAgdGhpcy5lcnJvcihlcnJvciwgZGF0YSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5lbmQoZGF0YSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLlJlc3BvbnNlID0gUmVzcG9uc2U7XG4iLCJ2YXIgU0NFbWl0dGVyID0gcmVxdWlyZSgnc2MtZW1pdHRlcicpLlNDRW1pdHRlcjtcbnZhciBTQ0NoYW5uZWwgPSByZXF1aXJlKCdzYy1jaGFubmVsJykuU0NDaGFubmVsO1xudmFyIFJlc3BvbnNlID0gcmVxdWlyZSgnLi9yZXNwb25zZScpLlJlc3BvbnNlO1xudmFyIEF1dGhFbmdpbmUgPSByZXF1aXJlKCcuL2F1dGgnKS5BdXRoRW5naW5lO1xudmFyIFNDVHJhbnNwb3J0ID0gcmVxdWlyZSgnLi9zY3RyYW5zcG9ydCcpLlNDVHJhbnNwb3J0O1xudmFyIHF1ZXJ5c3RyaW5nID0gcmVxdWlyZSgncXVlcnlzdHJpbmcnKTtcbnZhciBMaW5rZWRMaXN0ID0gcmVxdWlyZSgnbGlua2VkLWxpc3QnKTtcblxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG4gIE9iamVjdC5jcmVhdGUgPSByZXF1aXJlKCcuL29iamVjdGNyZWF0ZScpO1xufVxuXG52YXIgaXNCcm93c2VyID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJztcblxuXG52YXIgU0NTb2NrZXQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIFxuICBTQ0VtaXR0ZXIuY2FsbCh0aGlzKTtcbiAgXG4gIHZhciBvcHRzID0ge1xuICAgIHBvcnQ6IG51bGwsXG4gICAgYXV0b1JlY29ubmVjdDogdHJ1ZSxcbiAgICBhdXRvUHJvY2Vzc1N1YnNjcmlwdGlvbnM6IHRydWUsXG4gICAgYWNrVGltZW91dDogMTAwMDAsXG4gICAgaG9zdG5hbWU6IGdsb2JhbC5sb2NhdGlvbiAmJiBsb2NhdGlvbi5ob3N0bmFtZSxcbiAgICBwYXRoOiAnL3NvY2tldGNsdXN0ZXIvJyxcbiAgICBzZWN1cmU6IGdsb2JhbC5sb2NhdGlvbiAmJiBsb2NhdGlvbi5wcm90b2NvbCA9PSAnaHR0cHM6JyxcbiAgICB0aW1lc3RhbXBSZXF1ZXN0czogZmFsc2UsXG4gICAgdGltZXN0YW1wUGFyYW06ICd0JyxcbiAgICBhdXRoRW5naW5lOiBudWxsLFxuICAgIGF1dGhUb2tlbk5hbWU6ICdzb2NrZXRDbHVzdGVyLmF1dGhUb2tlbicsXG4gICAgYmluYXJ5VHlwZTogJ2FycmF5YnVmZmVyJ1xuICB9O1xuICBmb3IgKHZhciBpIGluIG9wdGlvbnMpIHtcbiAgICBvcHRzW2ldID0gb3B0aW9uc1tpXTtcbiAgfVxuICBcbiAgdGhpcy5pZCA9IG51bGw7XG4gIHRoaXMuc3RhdGUgPSB0aGlzLkNMT1NFRDtcbiAgXG4gIHRoaXMuYWNrVGltZW91dCA9IG9wdHMuYWNrVGltZW91dDtcbiAgXG4gIC8vIHBpbmdUaW1lb3V0IHdpbGwgYmUgYWNrVGltZW91dCBhdCB0aGUgc3RhcnQsIGJ1dCBpdCB3aWxsXG4gIC8vIGJlIHVwZGF0ZWQgd2l0aCB2YWx1ZXMgcHJvdmlkZWQgYnkgdGhlICdjb25uZWN0JyBldmVudFxuICB0aGlzLnBpbmdUaW1lb3V0ID0gdGhpcy5hY2tUaW1lb3V0O1xuICBcbiAgdmFyIG1heFRpbWVvdXQgPSBNYXRoLnBvdygyLCAzMSkgLSAxO1xuICBcbiAgdmFyIHZlcmlmeUR1cmF0aW9uID0gZnVuY3Rpb24gKHByb3BlcnR5TmFtZSkge1xuICAgIGlmIChzZWxmW3Byb3BlcnR5TmFtZV0gPiBtYXhUaW1lb3V0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSAnICsgcHJvcGVydHlOYW1lICtcbiAgICAgICAgJyB2YWx1ZSBwcm92aWRlZCBleGNlZWRlZCB0aGUgbWF4aW11bSBhbW91bnQgYWxsb3dlZCcpO1xuICAgIH1cbiAgfTtcbiAgXG4gIHZlcmlmeUR1cmF0aW9uKCdhY2tUaW1lb3V0Jyk7XG4gIHZlcmlmeUR1cmF0aW9uKCdwaW5nVGltZW91dCcpO1xuICBcbiAgdGhpcy5fbG9jYWxFdmVudHMgPSB7XG4gICAgJ2Nvbm5lY3QnOiAxLFxuICAgICdjb25uZWN0QWJvcnQnOiAxLFxuICAgICdkaXNjb25uZWN0JzogMSxcbiAgICAnbWVzc2FnZSc6IDEsXG4gICAgJ2Vycm9yJzogMSxcbiAgICAncmF3JzogMSxcbiAgICAnZmFpbCc6IDEsXG4gICAgJ2tpY2tPdXQnOiAxLFxuICAgICdzdWJzY3JpYmUnOiAxLFxuICAgICd1bnN1YnNjcmliZSc6IDEsXG4gICAgJ3NldEF1dGhUb2tlbic6IDEsXG4gICAgJ3JlbW92ZUF1dGhUb2tlbic6IDFcbiAgfTtcbiAgXG4gIHRoaXMuX2Nvbm5lY3RBdHRlbXB0cyA9IDA7XG4gIFxuICB0aGlzLl9lbWl0QnVmZmVyID0gbmV3IExpbmtlZExpc3QoKTtcbiAgdGhpcy5fY2hhbm5lbHMgPSB7fTtcbiAgdGhpcy5fYmFzZTY0Q2hhcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIjtcbiAgXG4gIHRoaXMub3B0aW9ucyA9IG9wdHM7XG4gIFxuICBpZiAodGhpcy5vcHRpb25zLmF1dG9SZWNvbm5lY3QpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9SZWNvbm5lY3RPcHRpb25zID09IG51bGwpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5hdXRvUmVjb25uZWN0T3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBcbiAgICB2YXIgcmVjb25uZWN0T3B0aW9ucyA9IHRoaXMub3B0aW9ucy5hdXRvUmVjb25uZWN0T3B0aW9ucztcbiAgICBpZiAocmVjb25uZWN0T3B0aW9ucy5pbml0aWFsRGVsYXkgPT0gbnVsbCkge1xuICAgICAgcmVjb25uZWN0T3B0aW9ucy5pbml0aWFsRGVsYXkgPSAxMDAwMDtcbiAgICB9XG4gICAgaWYgKHJlY29ubmVjdE9wdGlvbnMucmFuZG9tbmVzcyA9PSBudWxsKSB7XG4gICAgICByZWNvbm5lY3RPcHRpb25zLnJhbmRvbW5lc3MgPSAxMDAwMDtcbiAgICB9XG4gICAgaWYgKHJlY29ubmVjdE9wdGlvbnMubXVsdGlwbGllciA9PSBudWxsKSB7XG4gICAgICByZWNvbm5lY3RPcHRpb25zLm11bHRpcGxpZXIgPSAxLjU7XG4gICAgfVxuICAgIGlmIChyZWNvbm5lY3RPcHRpb25zLm1heERlbGF5ID09IG51bGwpIHtcbiAgICAgIHJlY29ubmVjdE9wdGlvbnMubWF4RGVsYXkgPSA2MDAwMDtcbiAgICB9XG4gIH1cbiAgXG4gIGlmICh0aGlzLm9wdGlvbnMuc3Vic2NyaXB0aW9uUmV0cnlPcHRpb25zID09IG51bGwpIHtcbiAgICB0aGlzLm9wdGlvbnMuc3Vic2NyaXB0aW9uUmV0cnlPcHRpb25zID0ge307XG4gIH1cbiAgXG4gIGlmICh0aGlzLm9wdGlvbnMuYXV0aEVuZ2luZSkge1xuICAgIHRoaXMuYXV0aCA9IHRoaXMub3B0aW9ucy5hdXRoRW5naW5lO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuYXV0aCA9IG5ldyBBdXRoRW5naW5lKCk7XG4gIH1cblxuICB0aGlzLm9wdGlvbnMucGF0aCA9IHRoaXMub3B0aW9ucy5wYXRoLnJlcGxhY2UoL1xcLyQvLCAnJykgKyAnLyc7XG4gIFxuICB0aGlzLm9wdGlvbnMucXVlcnkgPSBvcHRzLnF1ZXJ5IHx8IHt9O1xuICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5xdWVyeSA9PSAnc3RyaW5nJykge1xuICAgIHRoaXMub3B0aW9ucy5xdWVyeSA9IHF1ZXJ5c3RyaW5nLnBhcnNlKHRoaXMub3B0aW9ucy5xdWVyeSk7XG4gIH1cblxuICB0aGlzLm9wdGlvbnMucG9ydCA9IG9wdHMucG9ydCB8fCAoZ2xvYmFsLmxvY2F0aW9uICYmIGxvY2F0aW9uLnBvcnQgP1xuICAgIGxvY2F0aW9uLnBvcnQgOiAodGhpcy5vcHRpb25zLnNlY3VyZSA/IDQ0MyA6IDgwKSk7XG4gIFxuICB0aGlzLmNvbm5lY3QoKTtcbiAgXG4gIHRoaXMuX2NoYW5uZWxFbWl0dGVyID0gbmV3IFNDRW1pdHRlcigpO1xuICBcbiAgaWYgKGlzQnJvd3Nlcikge1xuICAgIHZhciB1bmxvYWRIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgc2VsZi5kaXNjb25uZWN0KCk7XG4gICAgfTtcblxuICAgIGlmIChnbG9iYWwuYXR0YWNoRXZlbnQpIHtcbiAgICAgIGdsb2JhbC5hdHRhY2hFdmVudCgnb251bmxvYWQnLCB1bmxvYWRIYW5kbGVyKTtcbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJywgdW5sb2FkSGFuZGxlciwgZmFsc2UpO1xuICAgIH1cbiAgfVxufTtcblxuU0NTb2NrZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTQ0VtaXR0ZXIucHJvdG90eXBlKTtcblxuU0NTb2NrZXQuQ09OTkVDVElORyA9IFNDU29ja2V0LnByb3RvdHlwZS5DT05ORUNUSU5HID0gU0NUcmFuc3BvcnQucHJvdG90eXBlLkNPTk5FQ1RJTkc7XG5TQ1NvY2tldC5PUEVOID0gU0NTb2NrZXQucHJvdG90eXBlLk9QRU4gPSBTQ1RyYW5zcG9ydC5wcm90b3R5cGUuT1BFTjtcblNDU29ja2V0LkNMT1NFRCA9IFNDU29ja2V0LnByb3RvdHlwZS5DTE9TRUQgPSBTQ1RyYW5zcG9ydC5wcm90b3R5cGUuQ0xPU0VEO1xuXG5TQ1NvY2tldC5pZ25vcmVTdGF0dXNlcyA9IHtcbiAgMTAwMDogJ1NvY2tldCBjbG9zZWQgbm9ybWFsbHknLFxuICAxMDAxOiAnU29ja2V0IGh1bmcgdXAnXG59O1xuXG5TQ1NvY2tldC5lcnJvclN0YXR1c2VzID0ge1xuICAxMDAxOiAnU29ja2V0IHdhcyBkaXNjb25uZWN0ZWQnLFxuICAxMDAyOiAnQSBXZWJTb2NrZXQgcHJvdG9jb2wgZXJyb3Igd2FzIGVuY291bnRlcmVkJyxcbiAgMTAwMzogJ1NlcnZlciB0ZXJtaW5hdGVkIHNvY2tldCBiZWNhdXNlIGl0IHJlY2VpdmVkIGludmFsaWQgZGF0YScsXG4gIDEwMDU6ICdTb2NrZXQgY2xvc2VkIHdpdGhvdXQgc3RhdHVzIGNvZGUnLFxuICAxMDA2OiAnU29ja2V0IGh1bmcgdXAnLFxuICAxMDA3OiAnTWVzc2FnZSBmb3JtYXQgd2FzIGluY29ycmVjdCcsXG4gIDEwMDg6ICdFbmNvdW50ZXJlZCBhIHBvbGljeSB2aW9sYXRpb24nLFxuICAxMDA5OiAnTWVzc2FnZSB3YXMgdG9vIGJpZyB0byBwcm9jZXNzJyxcbiAgMTAxMDogJ0NsaWVudCBlbmRlZCB0aGUgY29ubmVjdGlvbiBiZWNhdXNlIHRoZSBzZXJ2ZXIgZGlkIG5vdCBjb21wbHkgd2l0aCBleHRlbnNpb24gcmVxdWlyZW1lbnRzJyxcbiAgMTAxMTogJ1NlcnZlciBlbmNvdW50ZXJlZCBhbiB1bmV4cGVjdGVkIGZhdGFsIGNvbmRpdGlvbicsXG4gIDQwMDA6ICdTZXJ2ZXIgcGluZyB0aW1lZCBvdXQnLFxuICA0MDAxOiAnQ2xpZW50IHBvbmcgdGltZWQgb3V0JyxcbiAgNDAwMjogJ1NlcnZlciBmYWlsZWQgdG8gc2lnbiBhdXRoIHRva2VuJyxcbiAgNDAwMzogJ0ZhaWxlZCB0byBjb21wbGV0ZSBoYW5kc2hha2UnLFxuICA0MDA0OiAnQ2xpZW50IGZhaWxlZCB0byBzYXZlIGF1dGggdG9rZW4nXG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUuX3ByaXZhdGVFdmVudEhhbmRsZXJNYXAgPSB7XG4gICcjZmFpbCc6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgdGhpcy5fb25TQ0Vycm9yKGRhdGEpO1xuICB9LFxuICAnI3B1Ymxpc2gnOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBpc1N1YnNjcmliZWQgPSB0aGlzLmlzU3Vic2NyaWJlZChkYXRhLmNoYW5uZWwsIHRydWUpO1xuICAgIFxuICAgIGlmIChpc1N1YnNjcmliZWQpIHtcbiAgICAgIHRoaXMuX2NoYW5uZWxFbWl0dGVyLmVtaXQoZGF0YS5jaGFubmVsLCBkYXRhLmRhdGEpO1xuICAgIH1cbiAgfSxcbiAgJyNraWNrT3V0JzogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICB2YXIgY2hhbm5lbE5hbWUgPSBkYXRhLmNoYW5uZWw7XG4gICAgdmFyIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV07XG4gICAgaWYgKGNoYW5uZWwpIHtcbiAgICAgIFNDRW1pdHRlci5wcm90b3R5cGUuZW1pdC5jYWxsKHRoaXMsICdraWNrT3V0JywgZGF0YS5tZXNzYWdlLCBjaGFubmVsTmFtZSk7XG4gICAgICBjaGFubmVsLmVtaXQoJ2tpY2tPdXQnLCBkYXRhLm1lc3NhZ2UsIGNoYW5uZWxOYW1lKTtcbiAgICAgIHRoaXMuX3RyaWdnZXJDaGFubmVsVW5zdWJzY3JpYmUoY2hhbm5lbCk7XG4gICAgfVxuICB9LFxuICAnI3NldEF1dGhUb2tlbic6IGZ1bmN0aW9uIChkYXRhLCByZXNwb25zZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBcbiAgICBpZiAoZGF0YSkge1xuICAgICAgdmFyIHRva2VuT3B0aW9ucyA9IHtcbiAgICAgICAgZXhwaXJlc0luTWludXRlczogISFkYXRhLmV4cGlyZXNJbk1pbnV0ZXNcbiAgICAgIH07XG4gICAgICBcbiAgICAgIHZhciB0cmlnZ2VyU2V0QXV0aFRva2VuID0gZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgLy8gVGhpcyBpcyBhIG5vbi1mYXRhbCBlcnJvciwgd2UgZG9uJ3Qgd2FudCB0byBjbG9zZSB0aGUgY29ubmVjdGlvbiBcbiAgICAgICAgICAvLyBiZWNhdXNlIG9mIHRoaXMgYnV0IHdlIGRvIHdhbnQgdG8gbm90aWZ5IHRoZSBzZXJ2ZXIgYW5kIHRocm93IGFuIGVycm9yXG4gICAgICAgICAgLy8gb24gdGhlIGNsaWVudC5cbiAgICAgICAgICByZXNwb25zZS5lcnJvcihlcnIubWVzc2FnZSB8fCBlcnIpO1xuICAgICAgICAgIHNlbGYuX29uU0NFcnJvcihlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFNDRW1pdHRlci5wcm90b3R5cGUuZW1pdC5jYWxsKHNlbGYsICdzZXRBdXRoVG9rZW4nLCBkYXRhLnRva2VuKTtcbiAgICAgICAgICByZXNwb25zZS5lbmQoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIFxuICAgICAgdGhpcy5hdXRoLnNhdmVUb2tlbih0aGlzLm9wdGlvbnMuYXV0aFRva2VuTmFtZSwgZGF0YS50b2tlbiwgdG9rZW5PcHRpb25zLCB0cmlnZ2VyU2V0QXV0aFRva2VuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2UuZXJyb3IoJ05vIHRva2VuIGRhdGEgcHJvdmlkZWQgd2l0aCBzZXRBdXRoVG9rZW4gZXZlbnQnKTtcbiAgICB9XG4gIH0sXG4gICcjcmVtb3ZlQXV0aFRva2VuJzogZnVuY3Rpb24gKGRhdGEsIHJlc3BvbnNlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIHRoaXMuYXV0aC5yZW1vdmVUb2tlbih0aGlzLm9wdGlvbnMuYXV0aFRva2VuTmFtZSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICAvLyBOb24tZmF0YWwgZXJyb3IgLSBEbyBub3QgY2xvc2UgdGhlIGNvbm5lY3Rpb25cbiAgICAgICAgcmVzcG9uc2UuZXJyb3IoZXJyLm1lc3NhZ2UgfHwgZXJyKTtcbiAgICAgICAgc2VsZi5fb25TQ0Vycm9yKGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTQ0VtaXR0ZXIucHJvdG90eXBlLmVtaXQuY2FsbChzZWxmLCAncmVtb3ZlQXV0aFRva2VuJyk7XG4gICAgICAgIHJlc3BvbnNlLmVuZCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAnI2Rpc2Nvbm5lY3QnOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHRoaXMudHJhbnNwb3J0LmNsb3NlKGRhdGEuY29kZSwgZGF0YS5kYXRhKTtcbiAgfVxufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLmdldFN0YXRlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5zdGF0ZTtcbn07XG5cblNDU29ja2V0LnByb3RvdHlwZS5nZXRCeXRlc1JlY2VpdmVkID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy50cmFuc3BvcnQuZ2V0Qnl0ZXNSZWNlaXZlZCgpO1xufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLnJlbW92ZUF1dGhUb2tlbiA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIFxuICB0aGlzLmF1dGgucmVtb3ZlVG9rZW4odGhpcy5vcHRpb25zLmF1dGhUb2tlbk5hbWUsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhlcnIpO1xuICAgIGlmIChlcnIpIHtcbiAgICAgIC8vIE5vbi1mYXRhbCBlcnJvciAtIERvIG5vdCBjbG9zZSB0aGUgY29ubmVjdGlvblxuICAgICAgc2VsZi5fb25TQ0Vycm9yKGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIFNDRW1pdHRlci5wcm90b3R5cGUuZW1pdC5jYWxsKHNlbGYsICdyZW1vdmVBdXRoVG9rZW4nKTtcbiAgICB9XG4gIH0pO1xufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLmNvbm5lY3QgPSBTQ1NvY2tldC5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBcbiAgaWYgKHRoaXMuc3RhdGUgPT0gdGhpcy5DTE9TRUQpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5fcmVjb25uZWN0VGltZW91dCk7XG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuQ09OTkVDVElORztcbiAgICBcbiAgICBpZiAodGhpcy50cmFuc3BvcnQpIHtcbiAgICAgIHRoaXMudHJhbnNwb3J0Lm9mZigpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnRyYW5zcG9ydCA9IG5ldyBTQ1RyYW5zcG9ydCh0aGlzLmF1dGgsIHRoaXMub3B0aW9ucyk7XG5cbiAgICB0aGlzLnRyYW5zcG9ydC5vbignb3BlbicsIGZ1bmN0aW9uIChzdGF0dXMpIHtcbiAgICAgIHNlbGYuc3RhdGUgPSBzZWxmLk9QRU47XG4gICAgICBzZWxmLl9vblNDT3BlbihzdGF0dXMpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMudHJhbnNwb3J0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHNlbGYuX29uU0NFcnJvcihlcnIpO1xuICAgIH0pO1xuICAgIFxuICAgIHRoaXMudHJhbnNwb3J0Lm9uKCdjbG9zZScsIGZ1bmN0aW9uIChjb2RlLCBkYXRhKSB7XG4gICAgICBzZWxmLnN0YXRlID0gc2VsZi5DTE9TRUQ7XG4gICAgICBzZWxmLl9vblNDQ2xvc2UoY29kZSwgZGF0YSk7XG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy50cmFuc3BvcnQub24oJ29wZW5BYm9ydCcsIGZ1bmN0aW9uIChjb2RlLCBkYXRhKSB7XG4gICAgICBzZWxmLnN0YXRlID0gc2VsZi5DTE9TRUQ7XG4gICAgICBzZWxmLl9vblNDQ2xvc2UoY29kZSwgZGF0YSwgdHJ1ZSk7XG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy50cmFuc3BvcnQub24oJ2V2ZW50JywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhLCByZXMpIHtcbiAgICAgIHNlbGYuX29uU0NFdmVudChldmVudCwgZGF0YSwgcmVzKTtcbiAgICB9KTtcbiAgfVxufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbiAoY29kZSwgZGF0YSkge1xuICBjb2RlID0gY29kZSB8fCAxMDAwO1xuICBcbiAgaWYgKHRoaXMuc3RhdGUgPT0gdGhpcy5PUEVOKSB7XG4gICAgdmFyIHBhY2tldCA9IHtcbiAgICAgIGNvZGU6IGNvZGUsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfTtcbiAgICB0aGlzLnRyYW5zcG9ydC5lbWl0KCcjZGlzY29ubmVjdCcsIHBhY2tldCk7XG4gICAgdGhpcy50cmFuc3BvcnQuY2xvc2UoY29kZSk7XG4gICAgXG4gIH0gZWxzZSBpZiAodGhpcy5zdGF0ZSA9PSB0aGlzLkNPTk5FQ1RJTkcpIHtcbiAgICB0aGlzLnRyYW5zcG9ydC5jbG9zZShjb2RlKTtcbiAgfVxufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLl90cnlSZWNvbm5lY3QgPSBmdW5jdGlvbiAoaW5pdGlhbERlbGF5KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgXG4gIHZhciBleHBvbmVudCA9IHRoaXMuX2Nvbm5lY3RBdHRlbXB0cysrO1xuICB2YXIgcmVjb25uZWN0T3B0aW9ucyA9IHRoaXMub3B0aW9ucy5hdXRvUmVjb25uZWN0T3B0aW9ucztcbiAgdmFyIHRpbWVvdXQ7XG4gIFxuICBpZiAoaW5pdGlhbERlbGF5ID09IG51bGwgfHwgZXhwb25lbnQgPiAwKSB7XG4gICAgdmFyIGluaXRpYWxUaW1lb3V0ID0gTWF0aC5yb3VuZChyZWNvbm5lY3RPcHRpb25zLmluaXRpYWxEZWxheSArIChyZWNvbm5lY3RPcHRpb25zLnJhbmRvbW5lc3MgfHwgMCkgKiBNYXRoLnJhbmRvbSgpKTtcbiAgICBcbiAgICB0aW1lb3V0ID0gTWF0aC5yb3VuZChpbml0aWFsVGltZW91dCAqIE1hdGgucG93KHJlY29ubmVjdE9wdGlvbnMubXVsdGlwbGllciwgZXhwb25lbnQpKTtcbiAgfSBlbHNlIHtcbiAgICB0aW1lb3V0ID0gaW5pdGlhbERlbGF5O1xuICB9XG4gIFxuICBpZiAodGltZW91dCA+IHJlY29ubmVjdE9wdGlvbnMubWF4RGVsYXkpIHtcbiAgICB0aW1lb3V0ID0gcmVjb25uZWN0T3B0aW9ucy5tYXhEZWxheTtcbiAgfVxuICBcbiAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlY29ubmVjdFRpbWVvdXQpO1xuICBcbiAgdGhpcy5fcmVjb25uZWN0VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuY29ubmVjdCgpO1xuICB9LCB0aW1lb3V0KTtcbn07XG5cblNDU29ja2V0LnByb3RvdHlwZS5fb25TQ09wZW4gPSBmdW5jdGlvbiAoc3RhdHVzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgXG4gIGlmIChzdGF0dXMpIHtcbiAgICB0aGlzLmlkID0gc3RhdHVzLmlkO1xuICAgIHRoaXMucGluZ1RpbWVvdXQgPSBzdGF0dXMucGluZ1RpbWVvdXQ7XG4gICAgdGhpcy50cmFuc3BvcnQucGluZ1RpbWVvdXQgPSB0aGlzLnBpbmdUaW1lb3V0O1xuICB9XG4gIFxuICB0aGlzLl9jb25uZWN0QXR0ZW1wdHMgPSAwO1xuICBpZiAodGhpcy5vcHRpb25zLmF1dG9Qcm9jZXNzU3Vic2NyaXB0aW9ucykge1xuICAgIHRoaXMucHJvY2Vzc1BlbmRpbmdTdWJzY3JpcHRpb25zKCk7XG4gIH1cbiAgXG4gIC8vIElmIHRoZSB1c2VyIGludm9rZXMgdGhlIGNhbGxiYWNrIHdoaWxlIGluIGF1dG9Qcm9jZXNzU3Vic2NyaXB0aW9ucyBtb2RlLCBpdFxuICAvLyB3b24ndCBicmVhayBhbnl0aGluZyAtIFRoZSBwcm9jZXNzUGVuZGluZ1N1YnNjcmlwdGlvbnMoKSBjYWxsIHdpbGwgYmUgYSBuby1vcC5cbiAgU0NFbWl0dGVyLnByb3RvdHlwZS5lbWl0LmNhbGwodGhpcywgJ2Nvbm5lY3QnLCBzdGF0dXMsIGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLnByb2Nlc3NQZW5kaW5nU3Vic2NyaXB0aW9ucygpO1xuICB9KTtcbiAgXG4gIHRoaXMuX2ZsdXNoRW1pdEJ1ZmZlcigpO1xufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLl9vblNDRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgXG4gIC8vIFRocm93IGVycm9yIGluIGRpZmZlcmVudCBzdGFjayBmcmFtZSBzbyB0aGF0IGVycm9yIGhhbmRsaW5nXG4gIC8vIGNhbm5vdCBpbnRlcmZlcmUgd2l0aCBhIHJlY29ubmVjdCBhY3Rpb24uXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGlmIChzZWxmLmxpc3RlbmVycygnZXJyb3InKS5sZW5ndGggPCAxKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgU0NFbWl0dGVyLnByb3RvdHlwZS5lbWl0LmNhbGwoc2VsZiwgJ2Vycm9yJywgZXJyKTtcbiAgICB9XG4gIH0sIDApO1xufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLl9zdXNwZW5kU3Vic2NyaXB0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNoYW5uZWwsIG5ld1N0YXRlO1xuICBmb3IgKHZhciBjaGFubmVsTmFtZSBpbiB0aGlzLl9jaGFubmVscykge1xuICAgIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV07XG4gICAgaWYgKGNoYW5uZWwuc3RhdGUgPT0gY2hhbm5lbC5TVUJTQ1JJQkVEIHx8XG4gICAgICBjaGFubmVsLnN0YXRlID09IGNoYW5uZWwuUEVORElORykge1xuICAgICAgXG4gICAgICBuZXdTdGF0ZSA9IGNoYW5uZWwuUEVORElORztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3U3RhdGUgPSBjaGFubmVsLlVOU1VCU0NSSUJFRDtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5fdHJpZ2dlckNoYW5uZWxVbnN1YnNjcmliZShjaGFubmVsLCBuZXdTdGF0ZSk7XG4gIH1cbn07XG5cblNDU29ja2V0LnByb3RvdHlwZS5fb25TQ0Nsb3NlID0gZnVuY3Rpb24gKGNvZGUsIGRhdGEsIG9wZW5BYm9ydCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIFxuICB0aGlzLmlkID0gbnVsbDtcbiAgXG4gIGlmICh0aGlzLnRyYW5zcG9ydCkge1xuICAgIHRoaXMudHJhbnNwb3J0Lm9mZigpO1xuICB9XG4gIGNsZWFyVGltZW91dCh0aGlzLl9yZWNvbm5lY3RUaW1lb3V0KTtcblxuICB0aGlzLl9zdXNwZW5kU3Vic2NyaXB0aW9ucygpO1xuICBcbiAgaWYgKG9wZW5BYm9ydCkge1xuICAgIFNDRW1pdHRlci5wcm90b3R5cGUuZW1pdC5jYWxsKHNlbGYsICdjb25uZWN0QWJvcnQnLCBjb2RlLCBkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBTQ0VtaXR0ZXIucHJvdG90eXBlLmVtaXQuY2FsbChzZWxmLCAnZGlzY29ubmVjdCcsIGNvZGUsIGRhdGEpO1xuICB9XG4gIFxuICAvLyBUcnkgdG8gcmVjb25uZWN0XG4gIC8vIG9uIHNlcnZlciBwaW5nIHRpbWVvdXQgKDQwMDApXG4gIC8vIG9yIG9uIGNsaWVudCBwb25nIHRpbWVvdXQgKDQwMDEpXG4gIC8vIG9yIG9uIGNsb3NlIHdpdGhvdXQgc3RhdHVzICgxMDA1KVxuICAvLyBvciBvbiBoYW5kc2hha2UgZmFpbHVyZSAoNDAwMylcbiAgLy8gb3Igb24gc29ja2V0IGh1bmcgdXAgKDEwMDYpXG4gIGlmICh0aGlzLm9wdGlvbnMuYXV0b1JlY29ubmVjdCkge1xuICAgIGlmIChjb2RlID09IDQwMDAgfHwgY29kZSA9PSA0MDAxIHx8IGNvZGUgPT0gMTAwNSkge1xuICAgICAgLy8gSWYgdGhlcmUgaXMgYSBwaW5nIG9yIHBvbmcgdGltZW91dCBvciBzb2NrZXQgY2xvc2VzIHdpdGhvdXRcbiAgICAgIC8vIHN0YXR1cywgZG9uJ3Qgd2FpdCBiZWZvcmUgdHJ5aW5nIHRvIHJlY29ubmVjdCAtIFRoZXNlIGNvdWxkIGhhcHBlblxuICAgICAgLy8gaWYgdGhlIGNsaWVudCB3YWtlcyB1cCBhZnRlciBhIHBlcmlvZCBvZiBpbmFjdGl2aXR5IGFuZCBpbiB0aGlzIGNhc2Ugd2VcbiAgICAgIC8vIHdhbnQgdG8gcmUtZXN0YWJsaXNoIHRoZSBjb25uZWN0aW9uIGFzIHNvb24gYXMgcG9zc2libGUuXG4gICAgICB0aGlzLl90cnlSZWNvbm5lY3QoMCk7XG4gICAgICBcbiAgICB9IGVsc2UgaWYgKGNvZGUgPT0gMTAwNiB8fCBjb2RlID09IDQwMDMpIHtcbiAgICAgIHRoaXMuX3RyeVJlY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuICBcbiAgaWYgKCFTQ1NvY2tldC5pZ25vcmVTdGF0dXNlc1tjb2RlXSkge1xuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoU0NTb2NrZXQuZXJyb3JTdGF0dXNlc1tjb2RlXSB8fCAnU29ja2V0IGNvbm5lY3Rpb24gZmFpbGVkIGZvciB1bmtub3duIHJlYXNvbnMnKTtcbiAgICBlcnIuY29kZSA9IGNvZGU7XG4gICAgdGhpcy5fb25TQ0Vycm9yKGVycik7XG4gIH1cbn07XG5cblNDU29ja2V0LnByb3RvdHlwZS5fb25TQ0V2ZW50ID0gZnVuY3Rpb24gKGV2ZW50LCBkYXRhLCByZXMpIHtcbiAgdmFyIGhhbmRsZXIgPSB0aGlzLl9wcml2YXRlRXZlbnRIYW5kbGVyTWFwW2V2ZW50XTtcbiAgaWYgKGhhbmRsZXIpIHtcbiAgICBoYW5kbGVyLmNhbGwodGhpcywgZGF0YSwgcmVzKTtcbiAgfSBlbHNlIHtcbiAgICBTQ0VtaXR0ZXIucHJvdG90eXBlLmVtaXQuY2FsbCh0aGlzLCBldmVudCwgZGF0YSwgcmVzKTtcbiAgfVxufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnBhcnNlKG1lc3NhZ2UpO1xufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLnN0cmluZ2lmeSA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgcmV0dXJuIHRoaXMudHJhbnNwb3J0LnN0cmluZ2lmeShvYmplY3QpO1xufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLl9mbHVzaEVtaXRCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBjdXJyZW50Tm9kZSA9IHRoaXMuX2VtaXRCdWZmZXIuaGVhZDtcbiAgdmFyIG5leHROb2RlO1xuXG4gIHdoaWxlIChjdXJyZW50Tm9kZSkge1xuICAgIG5leHROb2RlID0gY3VycmVudE5vZGUubmV4dDtcbiAgICB2YXIgZXZlbnRPYmplY3QgPSBjdXJyZW50Tm9kZS5kYXRhO1xuICAgIGN1cnJlbnROb2RlLmRldGFjaCgpO1xuICAgIHRoaXMudHJhbnNwb3J0LmVtaXRSYXcoZXZlbnRPYmplY3QpO1xuICAgIGN1cnJlbnROb2RlID0gbmV4dE5vZGU7XG4gIH1cbn07XG5cblNDU29ja2V0LnByb3RvdHlwZS5faGFuZGxlRXZlbnRBY2tUaW1lb3V0ID0gZnVuY3Rpb24gKGV2ZW50T2JqZWN0LCBldmVudE5vZGUpIHtcbiAgdmFyIGVycm9yTWVzc2FnZSA9IFwiRXZlbnQgcmVzcG9uc2UgZm9yICdcIiArIGV2ZW50T2JqZWN0LmV2ZW50ICsgXCInIHRpbWVkIG91dFwiO1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgZXJyb3IudHlwZSA9ICd0aW1lb3V0JztcbiAgXG4gIHZhciBjYWxsYmFjayA9IGV2ZW50T2JqZWN0LmNhbGxiYWNrO1xuICBkZWxldGUgZXZlbnRPYmplY3QuY2FsbGJhY2s7XG4gIGlmIChldmVudE5vZGUpIHtcbiAgICBldmVudE5vZGUuZGV0YWNoKCk7XG4gIH1cbiAgY2FsbGJhY2suY2FsbChldmVudE9iamVjdCwgZXJyb3IsIGV2ZW50T2JqZWN0KTtcbiAgdGhpcy5fb25TQ0Vycm9yKGVycm9yKTtcbn07XG5cblNDU29ja2V0LnByb3RvdHlwZS5fZW1pdCA9IGZ1bmN0aW9uIChldmVudCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBcbiAgaWYgKHRoaXMuc3RhdGUgPT0gdGhpcy5DTE9TRUQpIHtcbiAgICB0aGlzLmNvbm5lY3QoKTtcbiAgfVxuICB2YXIgZXZlbnRPYmplY3QgPSB7XG4gICAgZXZlbnQ6IGV2ZW50LFxuICAgIGRhdGE6IGRhdGEsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gIH07XG4gIFxuICB2YXIgZXZlbnROb2RlID0gbmV3IExpbmtlZExpc3QuSXRlbSgpO1xuICBldmVudE5vZGUuZGF0YSA9IGV2ZW50T2JqZWN0O1xuICBcbiAgLy8gRXZlbnRzIHdoaWNoIGRvIG5vdCBoYXZlIGEgY2FsbGJhY2sgd2lsbCBiZSB0cmVhdGVkIGFzIHZvbGF0aWxlXG4gIGlmIChjYWxsYmFjaykge1xuICAgIGV2ZW50T2JqZWN0LnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHNlbGYuX2hhbmRsZUV2ZW50QWNrVGltZW91dChldmVudE9iamVjdCwgZXZlbnROb2RlKTtcbiAgICB9LCB0aGlzLmFja1RpbWVvdXQpO1xuICB9XG4gIHRoaXMuX2VtaXRCdWZmZXIuYXBwZW5kKGV2ZW50Tm9kZSk7XG4gIFxuICBpZiAodGhpcy5zdGF0ZSA9PSB0aGlzLk9QRU4pIHtcbiAgICB0aGlzLl9mbHVzaEVtaXRCdWZmZXIoKTtcbiAgfVxufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnQsIGRhdGEsIGNhbGxiYWNrKSB7XG4gIGlmICh0aGlzLl9sb2NhbEV2ZW50c1tldmVudF0gPT0gbnVsbCkge1xuICAgIHRoaXMuX2VtaXQoZXZlbnQsIGRhdGEsIGNhbGxiYWNrKTtcbiAgfSBlbHNlIHtcbiAgICBTQ0VtaXR0ZXIucHJvdG90eXBlLmVtaXQuY2FsbCh0aGlzLCBldmVudCwgZGF0YSk7XG4gIH1cbn07XG5cblNDU29ja2V0LnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24gKGNoYW5uZWxOYW1lLCBkYXRhLCBjYWxsYmFjaykge1xuICB2YXIgcHViRGF0YSA9IHtcbiAgICBjaGFubmVsOiBjaGFubmVsTmFtZSxcbiAgICBkYXRhOiBkYXRhXG4gIH07XG4gIHRoaXMuZW1pdCgnI3B1Ymxpc2gnLCBwdWJEYXRhLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soZXJyKTtcbiAgfSk7XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUuX3RyaWdnZXJDaGFubmVsU3Vic2NyaWJlID0gZnVuY3Rpb24gKGNoYW5uZWwpIHtcbiAgdmFyIGNoYW5uZWxOYW1lID0gY2hhbm5lbC5uYW1lO1xuICBcbiAgaWYgKGNoYW5uZWwuc3RhdGUgIT0gY2hhbm5lbC5TVUJTQ1JJQkVEKSB7XG4gICAgY2hhbm5lbC5zdGF0ZSA9IGNoYW5uZWwuU1VCU0NSSUJFRDtcbiAgICBcbiAgICBjaGFubmVsLmVtaXQoJ3N1YnNjcmliZScsIGNoYW5uZWxOYW1lKTtcbiAgICBTQ0VtaXR0ZXIucHJvdG90eXBlLmVtaXQuY2FsbCh0aGlzLCAnc3Vic2NyaWJlJywgY2hhbm5lbE5hbWUpO1xuICB9XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUuX3RyaWdnZXJDaGFubmVsU3Vic2NyaWJlRmFpbCA9IGZ1bmN0aW9uIChlcnIsIGNoYW5uZWwpIHtcbiAgdmFyIGNoYW5uZWxOYW1lID0gY2hhbm5lbC5uYW1lO1xuICBcbiAgaWYgKGNoYW5uZWwuc3RhdGUgIT0gY2hhbm5lbC5VTlNVQlNDUklCRUQpIHtcbiAgICBjaGFubmVsLnN0YXRlID0gY2hhbm5lbC5VTlNVQlNDUklCRUQ7XG4gICAgXG4gICAgY2hhbm5lbC5lbWl0KCdzdWJzY3JpYmVGYWlsJywgZXJyLCBjaGFubmVsTmFtZSk7XG4gICAgU0NFbWl0dGVyLnByb3RvdHlwZS5lbWl0LmNhbGwodGhpcywgJ3N1YnNjcmliZUZhaWwnLCBlcnIsIGNoYW5uZWxOYW1lKTtcbiAgfVxufTtcblxuLy8gQ2FuY2VsIGFueSBwZW5kaW5nIHN1YnNjcmliZSBjYWxsYmFja1xuU0NTb2NrZXQucHJvdG90eXBlLl9jYW5jZWxQZW5kaW5nU3Vic2NyaWJlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoY2hhbm5lbCkge1xuICBpZiAoY2hhbm5lbC5fcGVuZGluZ1N1YnNjcmlwdGlvbkNpZCAhPSBudWxsKSB7XG4gICAgdGhpcy50cmFuc3BvcnQuY2FuY2VsUGVuZGluZ1Jlc3BvbnNlKGNoYW5uZWwuX3BlbmRpbmdTdWJzY3JpcHRpb25DaWQpO1xuICAgIGRlbGV0ZSBjaGFubmVsLl9wZW5kaW5nU3Vic2NyaXB0aW9uQ2lkO1xuICB9XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUuX3RyeVN1YnNjcmliZSA9IGZ1bmN0aW9uIChjaGFubmVsKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgXG4gIC8vIFdlIGNhbiBvbmx5IGV2ZXIgaGF2ZSBvbmUgcGVuZGluZyBzdWJzY3JpYmUgYWN0aW9uIGF0IGFueSBnaXZlbiB0aW1lIG9uIGEgY2hhbm5lbFxuICBpZiAodGhpcy5zdGF0ZSA9PSB0aGlzLk9QRU4gJiYgY2hhbm5lbC5fcGVuZGluZ1N1YnNjcmlwdGlvbkNpZCA9PSBudWxsKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBub1RpbWVvdXQ6IHRydWVcbiAgICB9O1xuXG4gICAgY2hhbm5lbC5fcGVuZGluZ1N1YnNjcmlwdGlvbkNpZCA9IHRoaXMudHJhbnNwb3J0LmVtaXQoXG4gICAgICAnI3N1YnNjcmliZScsIGNoYW5uZWwubmFtZSwgb3B0aW9ucyxcbiAgICAgIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgZGVsZXRlIGNoYW5uZWwuX3BlbmRpbmdTdWJzY3JpcHRpb25DaWQ7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICBzZWxmLl90cmlnZ2VyQ2hhbm5lbFN1YnNjcmliZUZhaWwoZXJyLCBjaGFubmVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWxmLl90cmlnZ2VyQ2hhbm5lbFN1YnNjcmliZShjaGFubmVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICk7XG4gIH1cbn07XG5cblNDU29ja2V0LnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoY2hhbm5lbE5hbWUpIHtcbiAgdmFyIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV07XG4gIFxuICBpZiAoIWNoYW5uZWwpIHtcbiAgICBjaGFubmVsID0gbmV3IFNDQ2hhbm5lbChjaGFubmVsTmFtZSwgdGhpcyk7XG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gY2hhbm5lbDtcbiAgfVxuXG4gIGlmIChjaGFubmVsLnN0YXRlID09IGNoYW5uZWwuVU5TVUJTQ1JJQkVEKSB7XG4gICAgY2hhbm5lbC5zdGF0ZSA9IGNoYW5uZWwuUEVORElORztcbiAgICB0aGlzLl90cnlTdWJzY3JpYmUoY2hhbm5lbCk7XG4gIH1cbiAgXG4gIHJldHVybiBjaGFubmVsO1xufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLl90cmlnZ2VyQ2hhbm5lbFVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGNoYW5uZWwsIG5ld1N0YXRlKSB7XG4gIHZhciBjaGFubmVsTmFtZSA9IGNoYW5uZWwubmFtZTtcbiAgdmFyIG9sZFN0YXRlID0gY2hhbm5lbC5zdGF0ZTtcbiAgXG4gIGlmIChuZXdTdGF0ZSkge1xuICAgIGNoYW5uZWwuc3RhdGUgPSBuZXdTdGF0ZTtcbiAgfSBlbHNlIHtcbiAgICBjaGFubmVsLnN0YXRlID0gY2hhbm5lbC5VTlNVQlNDUklCRUQ7XG4gIH1cbiAgdGhpcy5fY2FuY2VsUGVuZGluZ1N1YnNjcmliZUNhbGxiYWNrKGNoYW5uZWwpO1xuICBcbiAgaWYgKG9sZFN0YXRlID09IGNoYW5uZWwuU1VCU0NSSUJFRCkge1xuICAgIGNoYW5uZWwuZW1pdCgndW5zdWJzY3JpYmUnLCBjaGFubmVsTmFtZSk7XG4gICAgU0NFbWl0dGVyLnByb3RvdHlwZS5lbWl0LmNhbGwodGhpcywgJ3Vuc3Vic2NyaWJlJywgY2hhbm5lbE5hbWUpO1xuICB9XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUuX3RyeVVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGNoYW5uZWwpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBcbiAgaWYgKHRoaXMuc3RhdGUgPT0gdGhpcy5PUEVOKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBub1RpbWVvdXQ6IHRydWVcbiAgICB9O1xuICAgIC8vIElmIHRoZXJlIGlzIGEgcGVuZGluZyBzdWJzY3JpYmUgYWN0aW9uLCBjYW5jZWwgdGhlIGNhbGxiYWNrXG4gICAgdGhpcy5fY2FuY2VsUGVuZGluZ1N1YnNjcmliZUNhbGxiYWNrKGNoYW5uZWwpO1xuICAgIFxuICAgIC8vIFRoaXMgb3BlcmF0aW9uIGNhbm5vdCBmYWlsIGJlY2F1c2UgdGhlIFRDUCBwcm90b2NvbCBndWFyYW50ZWVzIGRlbGl2ZXJ5XG4gICAgLy8gc28gbG9uZyBhcyB0aGUgY29ubmVjdGlvbiByZW1haW5zIG9wZW4uIElmIHRoZSBjb25uZWN0aW9uIGNsb3NlcyxcbiAgICAvLyB0aGUgc2VydmVyIHdpbGwgYXV0b21hdGljYWxseSB1bnN1YnNjcmliZSB0aGUgc29ja2V0IGFuZCB0aHVzIGNvbXBsZXRlXG4gICAgLy8gdGhlIG9wZXJhdGlvbiBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAgdGhpcy50cmFuc3BvcnQuZW1pdCgnI3Vuc3Vic2NyaWJlJywgY2hhbm5lbC5uYW1lLCBvcHRpb25zKTtcbiAgfVxufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGNoYW5uZWxOYW1lKSB7XG5cbiAgdmFyIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV07XG4gIFxuICBpZiAoY2hhbm5lbCkge1xuICAgIGlmIChjaGFubmVsLnN0YXRlICE9IGNoYW5uZWwuVU5TVUJTQ1JJQkVEKSB7XG4gICAgXG4gICAgICB0aGlzLl90cmlnZ2VyQ2hhbm5lbFVuc3Vic2NyaWJlKGNoYW5uZWwpO1xuICAgICAgdGhpcy5fdHJ5VW5zdWJzY3JpYmUoY2hhbm5lbCk7XG4gICAgfVxuICB9XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUuY2hhbm5lbCA9IGZ1bmN0aW9uIChjaGFubmVsTmFtZSkge1xuICB2YXIgY3VycmVudENoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV07XG4gIFxuICBpZiAoIWN1cnJlbnRDaGFubmVsKSB7XG4gICAgY3VycmVudENoYW5uZWwgPSBuZXcgU0NDaGFubmVsKGNoYW5uZWxOYW1lLCB0aGlzKTtcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSBjdXJyZW50Q2hhbm5lbDtcbiAgfVxuICByZXR1cm4gY3VycmVudENoYW5uZWw7XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUuZGVzdHJveUNoYW5uZWwgPSBmdW5jdGlvbiAoY2hhbm5lbE5hbWUpIHtcbiAgdmFyIGNoYW5uZWwgPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV07XG4gIGNoYW5uZWwudW53YXRjaCgpO1xuICBjaGFubmVsLnVuc3Vic2NyaWJlKCk7XG4gIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV07XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUuc3Vic2NyaXB0aW9ucyA9IGZ1bmN0aW9uIChpbmNsdWRlUGVuZGluZykge1xuICB2YXIgc3VicyA9IFtdO1xuICB2YXIgY2hhbm5lbCwgaW5jbHVkZUNoYW5uZWw7XG4gIGZvciAodmFyIGNoYW5uZWxOYW1lIGluIHRoaXMuX2NoYW5uZWxzKSB7XG4gICAgY2hhbm5lbCA9IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXTtcbiAgICBcbiAgICBpZiAoaW5jbHVkZVBlbmRpbmcpIHtcbiAgICAgIGluY2x1ZGVDaGFubmVsID0gY2hhbm5lbCAmJiAoY2hhbm5lbC5zdGF0ZSA9PSBjaGFubmVsLlNVQlNDUklCRUQgfHwgXG4gICAgICAgIGNoYW5uZWwuc3RhdGUgPT0gY2hhbm5lbC5QRU5ESU5HKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5jbHVkZUNoYW5uZWwgPSBjaGFubmVsICYmIGNoYW5uZWwuc3RhdGUgPT0gY2hhbm5lbC5TVUJTQ1JJQkVEO1xuICAgIH1cbiAgICBcbiAgICBpZiAoaW5jbHVkZUNoYW5uZWwpIHtcbiAgICAgIHN1YnMucHVzaChjaGFubmVsTmFtZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdWJzO1xufTtcblxuU0NTb2NrZXQucHJvdG90eXBlLmlzU3Vic2NyaWJlZCA9IGZ1bmN0aW9uIChjaGFubmVsLCBpbmNsdWRlUGVuZGluZykge1xuICB2YXIgY2hhbm5lbCA9IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxdO1xuICBpZiAoaW5jbHVkZVBlbmRpbmcpIHtcbiAgICByZXR1cm4gISFjaGFubmVsICYmIChjaGFubmVsLnN0YXRlID09IGNoYW5uZWwuU1VCU0NSSUJFRCB8fFxuICAgICAgY2hhbm5lbC5zdGF0ZSA9PSBjaGFubmVsLlBFTkRJTkcpO1xuICB9XG4gIHJldHVybiAhIWNoYW5uZWwgJiYgY2hhbm5lbC5zdGF0ZSA9PSBjaGFubmVsLlNVQlNDUklCRUQ7XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUucHJvY2Vzc1BlbmRpbmdTdWJzY3JpcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIFxuICB2YXIgY2hhbm5lbHMgPSBbXTtcbiAgZm9yICh2YXIgY2hhbm5lbE5hbWUgaW4gdGhpcy5fY2hhbm5lbHMpIHtcbiAgICBjaGFubmVscy5wdXNoKGNoYW5uZWxOYW1lKTtcbiAgfVxuICBcbiAgZm9yICh2YXIgaSBpbiB0aGlzLl9jaGFubmVscykge1xuICAgIChmdW5jdGlvbiAoY2hhbm5lbCkge1xuICAgICAgaWYgKGNoYW5uZWwuc3RhdGUgPT0gY2hhbm5lbC5QRU5ESU5HKSB7XG4gICAgICAgIHNlbGYuX3RyeVN1YnNjcmliZShjaGFubmVsKTtcbiAgICAgIH1cbiAgICB9KSh0aGlzLl9jaGFubmVsc1tpXSk7XG4gIH1cbn07XG5cblNDU29ja2V0LnByb3RvdHlwZS53YXRjaCA9IGZ1bmN0aW9uIChjaGFubmVsTmFtZSwgaGFuZGxlcikge1xuICB0aGlzLl9jaGFubmVsRW1pdHRlci5vbihjaGFubmVsTmFtZSwgaGFuZGxlcik7XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUudW53YXRjaCA9IGZ1bmN0aW9uIChjaGFubmVsTmFtZSwgaGFuZGxlcikge1xuICBpZiAoaGFuZGxlcikge1xuICAgIHRoaXMuX2NoYW5uZWxFbWl0dGVyLnJlbW92ZUxpc3RlbmVyKGNoYW5uZWxOYW1lLCBoYW5kbGVyKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl9jaGFubmVsRW1pdHRlci5yZW1vdmVBbGxMaXN0ZW5lcnMoY2hhbm5lbE5hbWUpO1xuICB9XG59O1xuXG5TQ1NvY2tldC5wcm90b3R5cGUud2F0Y2hlcnMgPSBmdW5jdGlvbiAoY2hhbm5lbE5hbWUpIHtcbiAgcmV0dXJuIHRoaXMuX2NoYW5uZWxFbWl0dGVyLmxpc3RlbmVycyhjaGFubmVsTmFtZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNDU29ja2V0O1xuIiwidmFyIFdlYlNvY2tldCA9IHJlcXVpcmUoJ3dzJyk7XG52YXIgU0NFbWl0dGVyID0gcmVxdWlyZSgnc2MtZW1pdHRlcicpLlNDRW1pdHRlcjtcbnZhciBSZXNwb25zZSA9IHJlcXVpcmUoJy4vcmVzcG9uc2UnKS5SZXNwb25zZTtcbnZhciBxdWVyeXN0cmluZyA9IHJlcXVpcmUoJ3F1ZXJ5c3RyaW5nJyk7XG5cbnZhciBTQ1RyYW5zcG9ydCA9IGZ1bmN0aW9uIChhdXRoRW5naW5lLCBvcHRpb25zKSB7XG4gIHRoaXMuc3RhdGUgPSB0aGlzLkNMT1NFRDtcbiAgdGhpcy5hdXRoID0gYXV0aEVuZ2luZTtcbiAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy5waW5nVGltZW91dCA9IG9wdGlvbnMuYWNrVGltZW91dDtcbiAgXG4gIHRoaXMuX2NpZCA9IDE7XG4gIHRoaXMuX3BpbmdUaW1lb3V0VGlja2VyID0gbnVsbDtcbiAgdGhpcy5fY2FsbGJhY2tNYXAgPSB7fTtcbiAgXG4gIHRoaXMub3BlbigpO1xufTtcblxuU0NUcmFuc3BvcnQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTQ0VtaXR0ZXIucHJvdG90eXBlKTtcblxuU0NUcmFuc3BvcnQuQ09OTkVDVElORyA9IFNDVHJhbnNwb3J0LnByb3RvdHlwZS5DT05ORUNUSU5HID0gJ2Nvbm5lY3RpbmcnO1xuU0NUcmFuc3BvcnQuT1BFTiA9IFNDVHJhbnNwb3J0LnByb3RvdHlwZS5PUEVOID0gJ29wZW4nO1xuU0NUcmFuc3BvcnQuQ0xPU0VEID0gU0NUcmFuc3BvcnQucHJvdG90eXBlLkNMT1NFRCA9ICdjbG9zZWQnO1xuXG5TQ1RyYW5zcG9ydC5wcm90b3R5cGUudXJpID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcXVlcnkgPSB0aGlzLm9wdGlvbnMucXVlcnkgfHwge307XG4gIHZhciBzY2hlbWEgPSB0aGlzLm9wdGlvbnMuc2VjdXJlID8gJ3dzcycgOiAnd3MnO1xuICB2YXIgcG9ydCA9ICcnO1xuXG4gIGlmICh0aGlzLm9wdGlvbnMucG9ydCAmJiAoKCd3c3MnID09IHNjaGVtYSAmJiB0aGlzLm9wdGlvbnMucG9ydCAhPSA0NDMpXG4gICAgfHwgKCd3cycgPT0gc2NoZW1hICYmIHRoaXMub3B0aW9ucy5wb3J0ICE9IDgwKSkpIHtcbiAgICBwb3J0ID0gJzonICsgdGhpcy5vcHRpb25zLnBvcnQ7XG4gIH1cblxuICBpZiAodGhpcy5vcHRpb25zLnRpbWVzdGFtcFJlcXVlc3RzKSB7XG4gICAgcXVlcnlbdGhpcy5vcHRpb25zLnRpbWVzdGFtcFBhcmFtXSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG4gIH1cblxuICBxdWVyeSA9IHF1ZXJ5c3RyaW5nLnN0cmluZ2lmeShxdWVyeSk7XG5cbiAgaWYgKHF1ZXJ5Lmxlbmd0aCkge1xuICAgIHF1ZXJ5ID0gJz8nICsgcXVlcnk7XG4gIH1cblxuICByZXR1cm4gc2NoZW1hICsgJzovLycgKyB0aGlzLm9wdGlvbnMuaG9zdG5hbWUgKyBwb3J0ICsgdGhpcy5vcHRpb25zLnBhdGggKyBxdWVyeTtcbn07XG5cblNDVHJhbnNwb3J0LnByb3RvdHlwZS5fbmV4dENhbGxJZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2NpZCsrO1xufTtcblxuU0NUcmFuc3BvcnQucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgXG4gIHRoaXMuc3RhdGUgPSB0aGlzLkNPTk5FQ1RJTkc7XG4gIHZhciB1cmkgPSB0aGlzLnVyaSgpO1xuICBcbiAgdmFyIHdzU29ja2V0ID0gbmV3IFdlYlNvY2tldCh1cmksIG51bGwsIHRoaXMub3B0aW9ucyk7XG4gIHdzU29ja2V0LmJpbmFyeVR5cGUgPSB0aGlzLm9wdGlvbnMuYmluYXJ5VHlwZTtcbiAgdGhpcy5zb2NrZXQgPSB3c1NvY2tldDtcbiAgXG4gIHdzU29ja2V0Lm9ub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9vbk9wZW4oKTtcbiAgfTtcbiAgXG4gIHdzU29ja2V0Lm9uY2xvc2UgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBzZWxmLl9vbkNsb3NlKGV2ZW50LmNvZGUsIGV2ZW50LnJlYXNvbik7XG4gIH07XG4gIFxuICB3c1NvY2tldC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAobWVzc2FnZSwgZmxhZ3MpIHtcbiAgICBzZWxmLl9vbk1lc3NhZ2UobWVzc2FnZS5kYXRhKTtcbiAgfTtcbn07XG5cblNDVHJhbnNwb3J0LnByb3RvdHlwZS5fb25PcGVuID0gZnVuY3Rpb24gKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIFxuICB0aGlzLl9yZXNldFBpbmdUaW1lb3V0KCk7XG4gIFxuICB0aGlzLl9oYW5kc2hha2UoZnVuY3Rpb24gKGVyciwgc3RhdHVzKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgc2VsZi5fb25FcnJvcihlcnIpO1xuICAgICAgc2VsZi5fb25DbG9zZSg0MDAzKTtcbiAgICAgIHNlbGYuc29ja2V0LmNsb3NlKDQwMDMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxmLnN0YXRlID0gc2VsZi5PUEVOO1xuICAgICAgU0NFbWl0dGVyLnByb3RvdHlwZS5lbWl0LmNhbGwoc2VsZiwgJ29wZW4nLCBzdGF0dXMpO1xuICAgICAgc2VsZi5fcmVzZXRQaW5nVGltZW91dCgpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5TQ1RyYW5zcG9ydC5wcm90b3R5cGUuX2hhbmRzaGFrZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuYXV0aC5sb2FkVG9rZW4odGhpcy5vcHRpb25zLmF1dGhUb2tlbk5hbWUsIGZ1bmN0aW9uIChlcnIsIHRva2VuKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRG9uJ3Qgd2FpdCBmb3IgdGhpcy5zdGF0ZSB0byBiZSAnb3BlbicuXG4gICAgICAvLyBUaGUgdW5kZXJseWluZyBXZWJTb2NrZXQgKHRoaXMuc29ja2V0KSBpcyBhbHJlYWR5IG9wZW4uXG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgZm9yY2U6IHRydWVcbiAgICAgIH07XG4gICAgICBzZWxmLmVtaXQoJyNoYW5kc2hha2UnLCB7XG4gICAgICAgIGF1dGhUb2tlbjogdG9rZW5cbiAgICAgIH0sIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0pO1xufTtcblxuU0NUcmFuc3BvcnQucHJvdG90eXBlLl9vbkNsb3NlID0gZnVuY3Rpb24gKGNvZGUsIGRhdGEpIHtcbiAgZGVsZXRlIHRoaXMuc29ja2V0Lm9ub3BlbjtcbiAgZGVsZXRlIHRoaXMuc29ja2V0Lm9uY2xvc2U7XG4gIGRlbGV0ZSB0aGlzLnNvY2tldC5vbm1lc3NhZ2U7XG4gICAgXG4gIGlmICh0aGlzLnN0YXRlID09IHRoaXMuT1BFTikge1xuICAgIHRoaXMuc3RhdGUgPSB0aGlzLkNMT1NFRDtcbiAgICBTQ0VtaXR0ZXIucHJvdG90eXBlLmVtaXQuY2FsbCh0aGlzLCAnY2xvc2UnLCBjb2RlLCBkYXRhKTtcbiAgICBcbiAgfSBlbHNlIGlmICh0aGlzLnN0YXRlID09IHRoaXMuQ09OTkVDVElORykge1xuICAgIHRoaXMuc3RhdGUgPSB0aGlzLkNMT1NFRDtcbiAgICBTQ0VtaXR0ZXIucHJvdG90eXBlLmVtaXQuY2FsbCh0aGlzLCAnb3BlbkFib3J0JywgY29kZSwgZGF0YSk7XG4gIH1cbn07XG5cblNDVHJhbnNwb3J0LnByb3RvdHlwZS5fb25NZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgU0NFbWl0dGVyLnByb3RvdHlwZS5lbWl0LmNhbGwodGhpcywgJ2V2ZW50JywgJ21lc3NhZ2UnLCBtZXNzYWdlKTtcbiAgXG4gIC8vIElmIHBpbmdcbiAgaWYgKG1lc3NhZ2UgPT0gJzEnKSB7XG4gICAgdGhpcy5fcmVzZXRQaW5nVGltZW91dCgpO1xuICAgIGlmICh0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09IHRoaXMuc29ja2V0Lk9QRU4pIHtcbiAgICAgIHRoaXMuc29ja2V0LnNlbmQoJzInKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIG9iajtcbiAgICB0cnkge1xuICAgICAgb2JqID0gdGhpcy5wYXJzZShtZXNzYWdlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIG9iaiA9IG1lc3NhZ2U7XG4gICAgfVxuICAgIHZhciBldmVudCA9IG9iai5ldmVudDtcbiAgICBcbiAgICBpZiAoZXZlbnQpIHtcbiAgICAgIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZSh0aGlzLCBvYmouY2lkKTtcbiAgICAgIFNDRW1pdHRlci5wcm90b3R5cGUuZW1pdC5jYWxsKHRoaXMsICdldmVudCcsIGV2ZW50LCBvYmouZGF0YSwgcmVzcG9uc2UpO1xuICAgIH0gZWxzZSBpZiAob2JqLnJpZCAhPSBudWxsKSB7XG4gICAgICB2YXIgZXZlbnRPYmplY3QgPSB0aGlzLl9jYWxsYmFja01hcFtvYmoucmlkXTtcbiAgICAgIGlmIChldmVudE9iamVjdCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoZXZlbnRPYmplY3QudGltZW91dCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja01hcFtvYmoucmlkXTtcbiAgICAgICAgZXZlbnRPYmplY3QuY2FsbGJhY2sob2JqLmVycm9yLCBvYmouZGF0YSk7XG4gICAgICB9XG4gICAgICBpZiAob2JqLmVycm9yKSB7XG4gICAgICAgIHRoaXMuX29uRXJyb3Iob2JqLmVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgU0NFbWl0dGVyLnByb3RvdHlwZS5lbWl0LmNhbGwodGhpcywgJ2V2ZW50JywgJ3JhdycsIG9iaik7XG4gICAgfVxuICB9XG59O1xuXG5TQ1RyYW5zcG9ydC5wcm90b3R5cGUuX29uRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gIFNDRW1pdHRlci5wcm90b3R5cGUuZW1pdC5jYWxsKHRoaXMsICdlcnJvcicsIGVycik7XG59O1xuXG5TQ1RyYW5zcG9ydC5wcm90b3R5cGUuX3Jlc2V0UGluZ1RpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgXG4gIHZhciBub3cgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICBjbGVhclRpbWVvdXQodGhpcy5fcGluZ1RpbWVvdXRUaWNrZXIpO1xuICBcbiAgdGhpcy5fcGluZ1RpbWVvdXRUaWNrZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLl9vbkNsb3NlKDQwMDApO1xuICAgIHNlbGYuc29ja2V0LmNsb3NlKDQwMDApO1xuICB9LCB0aGlzLnBpbmdUaW1lb3V0KTtcbn07XG5cblNDVHJhbnNwb3J0LnByb3RvdHlwZS5nZXRCeXRlc1JlY2VpdmVkID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5zb2NrZXQuYnl0ZXNSZWNlaXZlZDtcbn07XG5cblNDVHJhbnNwb3J0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uIChjb2RlLCBkYXRhKSB7XG4gIGNvZGUgPSBjb2RlIHx8IDEwMDA7XG4gIFxuICBpZiAodGhpcy5zdGF0ZSA9PSB0aGlzLk9QRU4pIHtcbiAgICB2YXIgcGFja2V0ID0ge1xuICAgICAgY29kZTogY29kZSxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICAgIHRoaXMuZW1pdCgnI2Rpc2Nvbm5lY3QnLCBwYWNrZXQpO1xuICAgIFxuICAgIHRoaXMuX29uQ2xvc2UoY29kZSwgZGF0YSk7XG4gICAgdGhpcy5zb2NrZXQuY2xvc2UoY29kZSk7XG4gICAgXG4gIH0gZWxzZSBpZiAodGhpcy5zdGF0ZSA9PSB0aGlzLkNPTk5FQ1RJTkcpIHtcbiAgICB0aGlzLl9vbkNsb3NlKGNvZGUsIGRhdGEpO1xuICAgIHRoaXMuc29ja2V0LmNsb3NlKGNvZGUpO1xuICB9XG59O1xuXG5TQ1RyYW5zcG9ydC5wcm90b3R5cGUuZW1pdFJhdyA9IGZ1bmN0aW9uIChldmVudE9iamVjdCkge1xuICBldmVudE9iamVjdC5jaWQgPSB0aGlzLl9uZXh0Q2FsbElkKCk7XG4gIFxuICBpZiAoZXZlbnRPYmplY3QuY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFja01hcFtldmVudE9iamVjdC5jaWRdID0gZXZlbnRPYmplY3Q7XG4gIH1cbiAgXG4gIHZhciBzaW1wbGVFdmVudE9iamVjdCA9IHtcbiAgICBldmVudDogZXZlbnRPYmplY3QuZXZlbnQsXG4gICAgZGF0YTogZXZlbnRPYmplY3QuZGF0YSxcbiAgICBjaWQ6IGV2ZW50T2JqZWN0LmNpZFxuICB9O1xuICBcbiAgdGhpcy5zZW5kT2JqZWN0KHNpbXBsZUV2ZW50T2JqZWN0KTtcbiAgcmV0dXJuIGV2ZW50T2JqZWN0LmNpZDtcbn07XG5cblxuU0NUcmFuc3BvcnQucHJvdG90eXBlLl9oYW5kbGVFdmVudEFja1RpbWVvdXQgPSBmdW5jdGlvbiAoZXZlbnRPYmplY3QpIHtcbiAgdmFyIGVycm9yTWVzc2FnZSA9IFwiRXZlbnQgcmVzcG9uc2UgZm9yICdcIiArIGV2ZW50T2JqZWN0LmV2ZW50ICsgXCInIHRpbWVkIG91dFwiO1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgZXJyb3IudHlwZSA9ICd0aW1lb3V0JztcbiAgXG4gIGlmIChldmVudE9iamVjdC5jaWQpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tNYXBbZXZlbnRPYmplY3QuY2lkXTtcbiAgfVxuICB2YXIgY2FsbGJhY2sgPSBldmVudE9iamVjdC5jYWxsYmFjaztcbiAgZGVsZXRlIGV2ZW50T2JqZWN0LmNhbGxiYWNrO1xuICBjYWxsYmFjay5jYWxsKGV2ZW50T2JqZWN0LCBlcnJvciwgZXZlbnRPYmplY3QpO1xuICB0aGlzLl9vbkVycm9yKGVycm9yKTtcbn07XG5cbi8vIFRoZSBsYXN0IHR3byBvcHRpb25hbCBhcmd1bWVudHMgKGEgYW5kIGIpIGNhbiBiZSBvcHRpb25zIGFuZC9vciBjYWxsYmFja1xuU0NUcmFuc3BvcnQucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiAoZXZlbnQsIGRhdGEsIGEsIGIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBcbiAgdmFyIGNhbGxiYWNrLCBvcHRpb25zO1xuICBcbiAgaWYgKGIpIHtcbiAgICBvcHRpb25zID0gYTtcbiAgICBjYWxsYmFjayA9IGI7XG4gIH0gZWxzZSB7XG4gICAgaWYgKGEgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgY2FsbGJhY2sgPSBhO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zID0gYTtcbiAgICB9XG4gIH1cbiAgXG4gIHZhciBldmVudE9iamVjdCA9IHtcbiAgICBldmVudDogZXZlbnQsXG4gICAgZGF0YTogZGF0YSxcbiAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgfTtcbiAgXG4gIGlmIChjYWxsYmFjayAmJiAhb3B0aW9ucy5ub1RpbWVvdXQpIHtcbiAgICBldmVudE9iamVjdC50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBzZWxmLl9oYW5kbGVFdmVudEFja1RpbWVvdXQoZXZlbnRPYmplY3QpO1xuICAgIH0sIHRoaXMub3B0aW9ucy5hY2tUaW1lb3V0KTtcbiAgfVxuICBcbiAgdmFyIGNpZCA9IG51bGw7XG4gIGlmICh0aGlzLnN0YXRlID09IHRoaXMuT1BFTiB8fCBvcHRpb25zLmZvcmNlKSB7XG4gICAgY2lkID0gdGhpcy5lbWl0UmF3KGV2ZW50T2JqZWN0KTtcbiAgfVxuICByZXR1cm4gY2lkO1xufTtcblxuU0NUcmFuc3BvcnQucHJvdG90eXBlLmNhbmNlbFBlbmRpbmdSZXNwb25zZSA9IGZ1bmN0aW9uIChjaWQpIHtcbiAgZGVsZXRlIHRoaXMuX2NhbGxiYWNrTWFwW2NpZF07XG59O1xuXG5TQ1RyYW5zcG9ydC5wcm90b3R5cGUuX2lzT3duRGVzY2VuZGFudCA9IGZ1bmN0aW9uIChvYmplY3QsIGFuY2VzdG9ycykge1xuICBmb3IgKHZhciBpIGluIGFuY2VzdG9ycykge1xuICAgIGlmIChhbmNlc3RvcnNbaV0gPT09IG9iamVjdCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblNDVHJhbnNwb3J0LnByb3RvdHlwZS5fYXJyYXlCdWZmZXJUb0Jhc2U2NCA9IGZ1bmN0aW9uIChhcnJheWJ1ZmZlcikge1xuICB2YXIgY2hhcnMgPSB0aGlzLl9iYXNlNjRDaGFycztcbiAgdmFyIGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlidWZmZXIpO1xuICB2YXIgbGVuID0gYnl0ZXMubGVuZ3RoO1xuICB2YXIgYmFzZTY0ID0gJyc7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMykge1xuICAgIGJhc2U2NCArPSBjaGFyc1tieXRlc1tpXSA+PiAyXTtcbiAgICBiYXNlNjQgKz0gY2hhcnNbKChieXRlc1tpXSAmIDMpIDw8IDQpIHwgKGJ5dGVzW2kgKyAxXSA+PiA0KV07XG4gICAgYmFzZTY0ICs9IGNoYXJzWygoYnl0ZXNbaSArIDFdICYgMTUpIDw8IDIpIHwgKGJ5dGVzW2kgKyAyXSA+PiA2KV07XG4gICAgYmFzZTY0ICs9IGNoYXJzW2J5dGVzW2kgKyAyXSAmIDYzXTtcbiAgfVxuXG4gIGlmICgobGVuICUgMykgPT09IDIpIHtcbiAgICBiYXNlNjQgPSBiYXNlNjQuc3Vic3RyaW5nKDAsIGJhc2U2NC5sZW5ndGggLSAxKSArICc9JztcbiAgfSBlbHNlIGlmIChsZW4gJSAzID09PSAxKSB7XG4gICAgYmFzZTY0ID0gYmFzZTY0LnN1YnN0cmluZygwLCBiYXNlNjQubGVuZ3RoIC0gMikgKyAnPT0nO1xuICB9XG5cbiAgcmV0dXJuIGJhc2U2NDtcbn07XG5cblNDVHJhbnNwb3J0LnByb3RvdHlwZS5fY29udmVydEJ1ZmZlcnNUb0Jhc2U2NCA9IGZ1bmN0aW9uIChvYmplY3QsIGFuY2VzdG9ycykge1xuICBpZiAoIWFuY2VzdG9ycykge1xuICAgIGFuY2VzdG9ycyA9IFtdO1xuICB9XG4gIGlmICh0aGlzLl9pc093bkRlc2NlbmRhbnQob2JqZWN0LCBhbmNlc3RvcnMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdHJhdmVyc2UgY2lyY3VsYXIgc3RydWN0dXJlJyk7XG4gIH1cbiAgdmFyIG5ld0FuY2VzdG9ycyA9IGFuY2VzdG9ycy5jb25jYXQoW29iamVjdF0pO1xuICBcbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPSAndW5kZWZpbmVkJyAmJiBvYmplY3QgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiB7XG4gICAgICBiYXNlNjQ6IHRydWUsXG4gICAgICBkYXRhOiB0aGlzLl9hcnJheUJ1ZmZlclRvQmFzZTY0KG9iamVjdClcbiAgICB9O1xuICB9XG4gIFxuICBpZiAob2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB2YXIgYmFzZTY0QXJyYXkgPSBbXTtcbiAgICBmb3IgKHZhciBpIGluIG9iamVjdCkge1xuICAgICAgYmFzZTY0QXJyYXlbaV0gPSB0aGlzLl9jb252ZXJ0QnVmZmVyc1RvQmFzZTY0KG9iamVjdFtpXSwgbmV3QW5jZXN0b3JzKTtcbiAgICB9XG4gICAgcmV0dXJuIGJhc2U2NEFycmF5O1xuICB9XG4gIGlmIChvYmplY3QgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICB2YXIgYmFzZTY0T2JqZWN0ID0ge307XG4gICAgZm9yICh2YXIgaiBpbiBvYmplY3QpIHtcbiAgICAgIGJhc2U2NE9iamVjdFtqXSA9IHRoaXMuX2NvbnZlcnRCdWZmZXJzVG9CYXNlNjQob2JqZWN0W2pdLCBuZXdBbmNlc3RvcnMpO1xuICAgIH1cbiAgICByZXR1cm4gYmFzZTY0T2JqZWN0O1xuICB9XG4gIFxuICByZXR1cm4gb2JqZWN0O1xufTtcblxuU0NUcmFuc3BvcnQucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UobWVzc2FnZSk7XG59O1xuXG5TQ1RyYW5zcG9ydC5wcm90b3R5cGUuc3RyaW5naWZ5ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5fY29udmVydEJ1ZmZlcnNUb0Jhc2U2NChvYmplY3QpKTtcbn07XG5cblNDVHJhbnNwb3J0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgaWYgKHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgIT0gdGhpcy5zb2NrZXQuT1BFTikge1xuICAgIHRoaXMuX29uQ2xvc2UoMTAwNSk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zb2NrZXQuc2VuZChkYXRhKTtcbiAgfVxufTtcblxuU0NUcmFuc3BvcnQucHJvdG90eXBlLnNlbmRPYmplY3QgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gIHRoaXMuc2VuZCh0aGlzLnN0cmluZ2lmeShvYmplY3QpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLlNDVHJhbnNwb3J0ID0gU0NUcmFuc3BvcnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ29uc3RhbnRzLlxuICovXG5cbnZhciBlcnJvck1lc3NhZ2U7XG5cbmVycm9yTWVzc2FnZSA9ICdBbiBhcmd1bWVudCB3aXRob3V0IGFwcGVuZCwgcHJlcGVuZCwgJyArXG4gICAgJ29yIGRldGFjaCBtZXRob2RzIHdhcyBnaXZlbiB0byBgTGlzdCc7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBMaXN0OiBBIGxpbmtlZCBsaXN0IGlzIGEgYml0IGxpa2UgYW4gQXJyYXksIGJ1dFxuICoga25vd3Mgbm90aGluZyBhYm91dCBob3cgbWFueSBpdGVtcyBhcmUgaW4gaXQsIGFuZCBrbm93cyBvbmx5IGFib3V0IGl0c1xuICogZmlyc3QgKGBoZWFkYCkgYW5kIGxhc3QgKGB0YWlsYCkgaXRlbXMuIEVhY2ggaXRlbSAoZS5nLiBgaGVhZGAsIGB0YWlsYCxcbiAqICZjLikga25vd3Mgd2hpY2ggaXRlbSBjb21lcyBiZWZvcmUgb3IgYWZ0ZXIgaXQgKGl0cyBtb3JlIGxpa2UgdGhlXG4gKiBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgRE9NIGluIEphdmFTY3JpcHQpLlxuICogQGdsb2JhbFxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQGNsYXNzIFJlcHJlc2VudHMgYW4gaW5zdGFuY2Ugb2YgTGlzdC5cbiAqL1xuXG5mdW5jdGlvbiBMaXN0KC8qaXRlbXMuLi4qLykge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBMaXN0LmZyb20oYXJndW1lbnRzKTtcbiAgICB9XG59XG5cbnZhciBMaXN0UHJvdG90eXBlO1xuXG5MaXN0UHJvdG90eXBlID0gTGlzdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBsaXN0IGZyb20gdGhlIGFyZ3VtZW50cyAoZWFjaCBhIGxpc3QgaXRlbSkgcGFzc2VkIGluLlxuICogQG5hbWUgTGlzdC5vZlxuICogQHBhcmFtIHsuLi5MaXN0SXRlbX0gW2l0ZW1zXSAtIFplcm8gb3IgbW9yZSBpdGVtcyB0byBhdHRhY2guXG4gKiBAcmV0dXJucyB7bGlzdH0gLSBBIG5ldyBpbnN0YW5jZSBvZiBMaXN0LlxuICovXG5cbkxpc3Qub2YgPSBmdW5jdGlvbiAoLyppdGVtcy4uLiovKSB7XG4gICAgcmV0dXJuIExpc3QuZnJvbS5jYWxsKHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbGlzdCBmcm9tIHRoZSBnaXZlbiBhcnJheS1saWtlIG9iamVjdCAoZWFjaCBhIGxpc3QgaXRlbSlcbiAqIHBhc3NlZCBpbi5cbiAqIEBuYW1lIExpc3QuZnJvbVxuICogQHBhcmFtIHtMaXN0SXRlbVtdfSBbaXRlbXNdIC0gVGhlIGl0ZW1zIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtsaXN0fSAtIEEgbmV3IGluc3RhbmNlIG9mIExpc3QuXG4gKi9cbkxpc3QuZnJvbSA9IGZ1bmN0aW9uIChpdGVtcykge1xuICAgIHZhciBsaXN0ID0gbmV3IHRoaXMoKSwgbGVuZ3RoLCBpdGVyYXRvciwgaXRlbTtcblxuICAgIGlmIChpdGVtcyAmJiAobGVuZ3RoID0gaXRlbXMubGVuZ3RoKSkge1xuICAgICAgICBpdGVyYXRvciA9IC0xO1xuXG4gICAgICAgIHdoaWxlICgrK2l0ZXJhdG9yIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBpdGVtID0gaXRlbXNbaXRlcmF0b3JdO1xuXG4gICAgICAgICAgICBpZiAoaXRlbSAhPT0gbnVsbCAmJiBpdGVtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBsaXN0LmFwcGVuZChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsaXN0O1xufTtcblxuLyoqXG4gKiBMaXN0I2hlYWRcbiAqIERlZmF1bHQgdG8gYG51bGxgLlxuICovXG5MaXN0UHJvdG90eXBlLmhlYWQgPSBudWxsO1xuXG4vKipcbiAqIExpc3QjdGFpbFxuICogRGVmYXVsdCB0byBgbnVsbGAuXG4gKi9cbkxpc3RQcm90b3R5cGUudGFpbCA9IG51bGw7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbGlzdCdzIGl0ZW1zIGFzIGFuIGFycmF5LiBUaGlzIGRvZXMgKm5vdCogZGV0YWNoIHRoZSBpdGVtcy5cbiAqIEBuYW1lIExpc3QjdG9BcnJheVxuICogQHJldHVybnMge0xpc3RJdGVtW119IC0gQW4gYXJyYXkgb2YgKHN0aWxsIGF0dGFjaGVkKSBMaXN0SXRlbXMuXG4gKi9cbkxpc3RQcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaXRlbSA9IHRoaXMuaGVhZCxcbiAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICB3aGlsZSAoaXRlbSkge1xuICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgICAgaXRlbSA9IGl0ZW0ubmV4dDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBQcmVwZW5kcyB0aGUgZ2l2ZW4gaXRlbSB0byB0aGUgbGlzdDogSXRlbSB3aWxsIGJlIHRoZSBuZXcgZmlyc3QgaXRlbVxuICogKGBoZWFkYCkuXG4gKiBAbmFtZSBMaXN0I3ByZXBlbmRcbiAqIEBwYXJhbSB7TGlzdEl0ZW19IGl0ZW0gLSBUaGUgaXRlbSB0byBwcmVwZW5kLlxuICogQHJldHVybnMge0xpc3RJdGVtfSAtIEFuIGluc3RhbmNlIG9mIExpc3RJdGVtICh0aGUgZ2l2ZW4gaXRlbSkuXG4gKi9cbkxpc3RQcm90b3R5cGUucHJlcGVuZCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgaWYgKCFpdGVtKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIWl0ZW0uYXBwZW5kIHx8ICFpdGVtLnByZXBlbmQgfHwgIWl0ZW0uZGV0YWNoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UgKyAnI3ByZXBlbmRgLicpO1xuICAgIH1cblxuICAgIHZhciBzZWxmLCBoZWFkO1xuXG4gICAgLy8gQ2FjaGUgc2VsZi5cbiAgICBzZWxmID0gdGhpcztcblxuICAgIC8vIElmIHNlbGYgaGFzIGEgZmlyc3QgaXRlbSwgZGVmZXIgcHJlcGVuZCB0byB0aGUgZmlyc3QgaXRlbXMgcHJlcGVuZFxuICAgIC8vIG1ldGhvZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0LlxuICAgIGhlYWQgPSBzZWxmLmhlYWQ7XG5cbiAgICBpZiAoaGVhZCkge1xuICAgICAgICByZXR1cm4gaGVhZC5wcmVwZW5kKGl0ZW0pO1xuICAgIH1cblxuICAgIC8vIC4uLm90aGVyd2lzZSwgdGhlcmUgaXMgbm8gYGhlYWRgIChvciBgdGFpbGApIGl0ZW0geWV0LlxuXG4gICAgLy8gRGV0YWNoIHRoZSBwcmVwZW5kZWUuXG4gICAgaXRlbS5kZXRhY2goKTtcblxuICAgIC8vIFNldCB0aGUgcHJlcGVuZGVlcyBwYXJlbnQgbGlzdCB0byByZWZlcmVuY2Ugc2VsZi5cbiAgICBpdGVtLmxpc3QgPSBzZWxmO1xuXG4gICAgLy8gU2V0IHNlbGYncyBmaXJzdCBpdGVtIHRvIHRoZSBwcmVwZW5kZWUsIGFuZCByZXR1cm4gdGhlIGl0ZW0uXG4gICAgc2VsZi5oZWFkID0gaXRlbTtcblxuICAgIHJldHVybiBpdGVtO1xufTtcblxuLyoqXG4gKiBBcHBlbmRzIHRoZSBnaXZlbiBpdGVtIHRvIHRoZSBsaXN0OiBJdGVtIHdpbGwgYmUgdGhlIG5ldyBsYXN0IGl0ZW0gKGB0YWlsYClcbiAqIGlmIHRoZSBsaXN0IGhhZCBhIGZpcnN0IGl0ZW0sIGFuZCBpdHMgZmlyc3QgaXRlbSAoYGhlYWRgKSBvdGhlcndpc2UuXG4gKiBAbmFtZSBMaXN0I2FwcGVuZFxuICogQHBhcmFtIHtMaXN0SXRlbX0gaXRlbSAtIFRoZSBpdGVtIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtMaXN0SXRlbX0gLSBBbiBpbnN0YW5jZSBvZiBMaXN0SXRlbSAodGhlIGdpdmVuIGl0ZW0pLlxuICovXG5cbkxpc3RQcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICghaXRlbS5hcHBlbmQgfHwgIWl0ZW0ucHJlcGVuZCB8fCAhaXRlbS5kZXRhY2gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSArICcjYXBwZW5kYC4nKTtcbiAgICB9XG5cbiAgICB2YXIgc2VsZiwgaGVhZCwgdGFpbDtcblxuICAgIC8vIENhY2hlIHNlbGYuXG4gICAgc2VsZiA9IHRoaXM7XG5cbiAgICAvLyBJZiBzZWxmIGhhcyBhIGxhc3QgaXRlbSwgZGVmZXIgYXBwZW5kaW5nIHRvIHRoZSBsYXN0IGl0ZW1zIGFwcGVuZFxuICAgIC8vIG1ldGhvZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0LlxuICAgIHRhaWwgPSBzZWxmLnRhaWw7XG5cbiAgICBpZiAodGFpbCkge1xuICAgICAgICByZXR1cm4gdGFpbC5hcHBlbmQoaXRlbSk7XG4gICAgfVxuXG4gICAgLy8gSWYgc2VsZiBoYXMgYSBmaXJzdCBpdGVtLCBkZWZlciBhcHBlbmRpbmcgdG8gdGhlIGZpcnN0IGl0ZW1zIGFwcGVuZFxuICAgIC8vIG1ldGhvZCwgYW5kIHJldHVybiB0aGUgcmVzdWx0LlxuICAgIGhlYWQgPSBzZWxmLmhlYWQ7XG5cbiAgICBpZiAoaGVhZCkge1xuICAgICAgICByZXR1cm4gaGVhZC5hcHBlbmQoaXRlbSk7XG4gICAgfVxuXG4gICAgLy8gLi4ub3RoZXJ3aXNlLCB0aGVyZSBpcyBubyBgdGFpbGAgb3IgYGhlYWRgIGl0ZW0geWV0LlxuXG4gICAgLy8gRGV0YWNoIHRoZSBhcHBlbmRlZS5cbiAgICBpdGVtLmRldGFjaCgpO1xuXG4gICAgLy8gU2V0IHRoZSBhcHBlbmRlZXMgcGFyZW50IGxpc3QgdG8gcmVmZXJlbmNlIHNlbGYuXG4gICAgaXRlbS5saXN0ID0gc2VsZjtcblxuICAgIC8vIFNldCBzZWxmJ3MgZmlyc3QgaXRlbSB0byB0aGUgYXBwZW5kZWUsIGFuZCByZXR1cm4gdGhlIGl0ZW0uXG4gICAgc2VsZi5oZWFkID0gaXRlbTtcblxuICAgIHJldHVybiBpdGVtO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IExpc3RJdGVtOiBBIGxpbmtlZCBsaXN0IGl0ZW0gaXMgYSBiaXQgbGlrZSBET00gbm9kZTpcbiAqIEl0IGtub3dzIG9ubHkgYWJvdXQgaXRzIFwicGFyZW50XCIgKGBsaXN0YCksIHRoZSBpdGVtIGJlZm9yZSBpdCAoYHByZXZgKSxcbiAqIGFuZCB0aGUgaXRlbSBhZnRlciBpdCAoYG5leHRgKS5cbiAqIEBnbG9iYWxcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBjbGFzcyBSZXByZXNlbnRzIGFuIGluc3RhbmNlIG9mIExpc3RJdGVtLlxuICovXG5cbmZ1bmN0aW9uIExpc3RJdGVtKCkge31cblxuTGlzdC5JdGVtID0gTGlzdEl0ZW07XG5cbnZhciBMaXN0SXRlbVByb3RvdHlwZSA9IExpc3RJdGVtLnByb3RvdHlwZTtcblxuTGlzdEl0ZW1Qcm90b3R5cGUubmV4dCA9IG51bGw7XG5cbkxpc3RJdGVtUHJvdG90eXBlLnByZXYgPSBudWxsO1xuXG5MaXN0SXRlbVByb3RvdHlwZS5saXN0ID0gbnVsbDtcblxuLyoqXG4gKiBEZXRhY2hlcyB0aGUgaXRlbSBvcGVyYXRlZCBvbiBmcm9tIGl0cyBwYXJlbnQgbGlzdC5cbiAqIEBuYW1lIExpc3RJdGVtI2RldGFjaFxuICogQHJldHVybnMge0xpc3RJdGVtfSAtIFRoZSBpdGVtIG9wZXJhdGVkIG9uLlxuICovXG5MaXN0SXRlbVByb3RvdHlwZS5kZXRhY2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQ2FjaGUgc2VsZiwgdGhlIHBhcmVudCBsaXN0LCBhbmQgdGhlIHByZXZpb3VzIGFuZCBuZXh0IGl0ZW1zLlxuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgbGlzdCA9IHNlbGYubGlzdCxcbiAgICAgICAgcHJldiA9IHNlbGYucHJldixcbiAgICAgICAgbmV4dCA9IHNlbGYubmV4dDtcblxuICAgIC8vIElmIHRoZSBpdGVtIGlzIGFscmVhZHkgZGV0YWNoZWQsIHJldHVybiBzZWxmLlxuICAgIGlmICghbGlzdCkge1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICB9XG5cbiAgICAvLyBJZiBzZWxmIGlzIHRoZSBsYXN0IGl0ZW0gaW4gdGhlIHBhcmVudCBsaXN0LCBsaW5rIHRoZSBsaXN0cyBsYXN0IGl0ZW1cbiAgICAvLyB0byB0aGUgcHJldmlvdXMgaXRlbS5cbiAgICBpZiAobGlzdC50YWlsID09PSBzZWxmKSB7XG4gICAgICAgIGxpc3QudGFpbCA9IHByZXY7XG4gICAgfVxuXG4gICAgLy8gSWYgc2VsZiBpcyB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgcGFyZW50IGxpc3QsIGxpbmsgdGhlIGxpc3RzIGZpcnN0IGl0ZW1cbiAgICAvLyB0byB0aGUgbmV4dCBpdGVtLlxuICAgIGlmIChsaXN0LmhlYWQgPT09IHNlbGYpIHtcbiAgICAgICAgbGlzdC5oZWFkID0gbmV4dDtcbiAgICB9XG5cbiAgICAvLyBJZiBib3RoIHRoZSBsYXN0IGFuZCBmaXJzdCBpdGVtcyBpbiB0aGUgcGFyZW50IGxpc3QgYXJlIHRoZSBzYW1lLFxuICAgIC8vIHJlbW92ZSB0aGUgbGluayB0byB0aGUgbGFzdCBpdGVtLlxuICAgIGlmIChsaXN0LnRhaWwgPT09IGxpc3QuaGVhZCkge1xuICAgICAgICBsaXN0LnRhaWwgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIElmIGEgcHJldmlvdXMgaXRlbSBleGlzdHMsIGxpbmsgaXRzIG5leHQgaXRlbSB0byBzZWxmcyBuZXh0IGl0ZW0uXG4gICAgaWYgKHByZXYpIHtcbiAgICAgICAgcHJldi5uZXh0ID0gbmV4dDtcbiAgICB9XG5cbiAgICAvLyBJZiBhIG5leHQgaXRlbSBleGlzdHMsIGxpbmsgaXRzIHByZXZpb3VzIGl0ZW0gdG8gc2VsZnMgcHJldmlvdXMgaXRlbS5cbiAgICBpZiAobmV4dCkge1xuICAgICAgICBuZXh0LnByZXYgPSBwcmV2O1xuICAgIH1cblxuICAgIC8vIFJlbW92ZSBsaW5rcyBmcm9tIHNlbGYgdG8gYm90aCB0aGUgbmV4dCBhbmQgcHJldmlvdXMgaXRlbXMsIGFuZCB0byB0aGVcbiAgICAvLyBwYXJlbnQgbGlzdC5cbiAgICBzZWxmLnByZXYgPSBzZWxmLm5leHQgPSBzZWxmLmxpc3QgPSBudWxsO1xuXG4gICAgLy8gUmV0dXJuIHNlbGYuXG4gICAgcmV0dXJuIHNlbGY7XG59O1xuXG4vKipcbiAqIFByZXBlbmRzIHRoZSBnaXZlbiBpdGVtICpiZWZvcmUqIHRoZSBpdGVtIG9wZXJhdGVkIG9uLlxuICogQG5hbWUgTGlzdEl0ZW0jcHJlcGVuZFxuICogQHBhcmFtIHtMaXN0SXRlbX0gaXRlbSAtIFRoZSBpdGVtIHRvIHByZXBlbmQuXG4gKiBAcmV0dXJucyB7TGlzdEl0ZW19IC0gVGhlIGl0ZW0gb3BlcmF0ZWQgb24sIG9yIGZhbHNlIHdoZW4gdGhhdCBpdGVtIGlzIG5vdFxuICogYXR0YWNoZWQuXG4gKi9cbkxpc3RJdGVtUHJvdG90eXBlLnByZXBlbmQgPSBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmICghaXRlbSB8fCAhaXRlbS5hcHBlbmQgfHwgIWl0ZW0ucHJlcGVuZCB8fCAhaXRlbS5kZXRhY2gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yTWVzc2FnZSArICdJdGVtI3ByZXBlbmRgLicpO1xuICAgIH1cblxuICAgIC8vIENhY2hlIHNlbGYsIHRoZSBwYXJlbnQgbGlzdCwgYW5kIHRoZSBwcmV2aW91cyBpdGVtLlxuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgbGlzdCA9IHNlbGYubGlzdCxcbiAgICAgICAgcHJldiA9IHNlbGYucHJldjtcblxuICAgIC8vIElmIHNlbGYgaXMgZGV0YWNoZWQsIHJldHVybiBmYWxzZS5cbiAgICBpZiAoIWxpc3QpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIERldGFjaCB0aGUgcHJlcGVuZGVlLlxuICAgIGl0ZW0uZGV0YWNoKCk7XG5cbiAgICAvLyBJZiBzZWxmIGhhcyBhIHByZXZpb3VzIGl0ZW0uLi5cbiAgICBpZiAocHJldikge1xuICAgICAgICAvLyAuLi5saW5rIHRoZSBwcmVwZW5kZWVzIHByZXZpb3VzIGl0ZW0sIHRvIHNlbGZzIHByZXZpb3VzIGl0ZW0uXG4gICAgICAgIGl0ZW0ucHJldiA9IHByZXY7XG5cbiAgICAgICAgLy8gLi4ubGluayB0aGUgcHJldmlvdXMgaXRlbXMgbmV4dCBpdGVtLCB0byBzZWxmLlxuICAgICAgICBwcmV2Lm5leHQgPSBpdGVtO1xuICAgIH1cblxuICAgIC8vIFNldCB0aGUgcHJlcGVuZGVlcyBuZXh0IGl0ZW0gdG8gc2VsZi5cbiAgICBpdGVtLm5leHQgPSBzZWxmO1xuXG4gICAgLy8gU2V0IHRoZSBwcmVwZW5kZWVzIHBhcmVudCBsaXN0IHRvIHNlbGZzIHBhcmVudCBsaXN0LlxuICAgIGl0ZW0ubGlzdCA9IGxpc3Q7XG5cbiAgICAvLyBTZXQgdGhlIHByZXZpb3VzIGl0ZW0gb2Ygc2VsZiB0byB0aGUgcHJlcGVuZGVlLlxuICAgIHNlbGYucHJldiA9IGl0ZW07XG5cbiAgICAvLyBJZiBzZWxmIGlzIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBwYXJlbnQgbGlzdCwgbGluayB0aGUgbGlzdHMgZmlyc3QgaXRlbVxuICAgIC8vIHRvIHRoZSBwcmVwZW5kZWUuXG4gICAgaWYgKHNlbGYgPT09IGxpc3QuaGVhZCkge1xuICAgICAgICBsaXN0LmhlYWQgPSBpdGVtO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0aGUgcGFyZW50IGxpc3QgaGFzIG5vIGxhc3QgaXRlbSwgbGluayB0aGUgbGlzdHMgbGFzdCBpdGVtIHRvXG4gICAgLy8gc2VsZi5cbiAgICBpZiAoIWxpc3QudGFpbCkge1xuICAgICAgICBsaXN0LnRhaWwgPSBzZWxmO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgcHJlcGVuZGVlLlxuICAgIHJldHVybiBpdGVtO1xufTtcblxuLyoqXG4gKiBBcHBlbmRzIHRoZSBnaXZlbiBpdGVtICphZnRlciogdGhlIGl0ZW0gb3BlcmF0ZWQgb24uXG4gKiBAbmFtZSBMaXN0SXRlbSNhcHBlbmRcbiAqIEBwYXJhbSB7TGlzdEl0ZW19IGl0ZW0gLSBUaGUgaXRlbSB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7TGlzdEl0ZW19IC0gVGhlIGl0ZW0gb3BlcmF0ZWQgb24sIG9yIGZhbHNlIHdoZW4gdGhhdCBpdGVtIGlzIG5vdFxuICogYXR0YWNoZWQuXG4gKi9cbkxpc3RJdGVtUHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgLy8gSWYgaXRlbSBpcyBmYWxzZXksIHJldHVybiBmYWxzZS5cbiAgICBpZiAoIWl0ZW0gfHwgIWl0ZW0uYXBwZW5kIHx8ICFpdGVtLnByZXBlbmQgfHwgIWl0ZW0uZGV0YWNoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1lc3NhZ2UgKyAnSXRlbSNhcHBlbmRgLicpO1xuICAgIH1cblxuICAgIC8vIENhY2hlIHNlbGYsIHRoZSBwYXJlbnQgbGlzdCwgYW5kIHRoZSBuZXh0IGl0ZW0uXG4gICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBsaXN0ID0gc2VsZi5saXN0LFxuICAgICAgICBuZXh0ID0gc2VsZi5uZXh0O1xuXG4gICAgLy8gSWYgc2VsZiBpcyBkZXRhY2hlZCwgcmV0dXJuIGZhbHNlLlxuICAgIGlmICghbGlzdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gRGV0YWNoIHRoZSBhcHBlbmRlZS5cbiAgICBpdGVtLmRldGFjaCgpO1xuXG4gICAgLy8gSWYgc2VsZiBoYXMgYSBuZXh0IGl0ZW0uLi5cbiAgICBpZiAobmV4dCkge1xuICAgICAgICAvLyAuLi5saW5rIHRoZSBhcHBlbmRlZXMgbmV4dCBpdGVtLCB0byBzZWxmcyBuZXh0IGl0ZW0uXG4gICAgICAgIGl0ZW0ubmV4dCA9IG5leHQ7XG5cbiAgICAgICAgLy8gLi4ubGluayB0aGUgbmV4dCBpdGVtcyBwcmV2aW91cyBpdGVtLCB0byB0aGUgYXBwZW5kZWUuXG4gICAgICAgIG5leHQucHJldiA9IGl0ZW07XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBhcHBlbmRlZXMgcHJldmlvdXMgaXRlbSB0byBzZWxmLlxuICAgIGl0ZW0ucHJldiA9IHNlbGY7XG5cbiAgICAvLyBTZXQgdGhlIGFwcGVuZGVlcyBwYXJlbnQgbGlzdCB0byBzZWxmcyBwYXJlbnQgbGlzdC5cbiAgICBpdGVtLmxpc3QgPSBsaXN0O1xuXG4gICAgLy8gU2V0IHRoZSBuZXh0IGl0ZW0gb2Ygc2VsZiB0byB0aGUgYXBwZW5kZWUuXG4gICAgc2VsZi5uZXh0ID0gaXRlbTtcblxuICAgIC8vIElmIHRoZSB0aGUgcGFyZW50IGxpc3QgaGFzIG5vIGxhc3QgaXRlbSBvciBpZiBzZWxmIGlzIHRoZSBwYXJlbnQgbGlzdHNcbiAgICAvLyBsYXN0IGl0ZW0sIGxpbmsgdGhlIGxpc3RzIGxhc3QgaXRlbSB0byB0aGUgYXBwZW5kZWUuXG4gICAgaWYgKHNlbGYgPT09IGxpc3QudGFpbCB8fCAhbGlzdC50YWlsKSB7XG4gICAgICAgIGxpc3QudGFpbCA9IGl0ZW07XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBhcHBlbmRlZS5cbiAgICByZXR1cm4gaXRlbTtcbn07XG5cbi8qKlxuICogRXhwb3NlIGBMaXN0YC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3Q7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fc291cmNlL2xpbmtlZC1saXN0LmpzJyk7XG4iLCJ2YXIgU0NFbWl0dGVyID0gcmVxdWlyZSgnc2MtZW1pdHRlcicpLlNDRW1pdHRlcjtcclxuXHJcbmlmICghT2JqZWN0LmNyZWF0ZSkge1xyXG4gIE9iamVjdC5jcmVhdGUgPSByZXF1aXJlKCcuL29iamVjdGNyZWF0ZScpO1xyXG59XHJcblxyXG52YXIgU0NDaGFubmVsID0gZnVuY3Rpb24gKG5hbWUsIGNsaWVudCkge1xyXG4gIHZhciBzZWxmID0gdGhpcztcclxuICBcclxuICBTQ0VtaXR0ZXIuY2FsbCh0aGlzKTtcclxuICBcclxuICB0aGlzLlBFTkRJTkcgPSAncGVuZGluZyc7XHJcbiAgdGhpcy5TVUJTQ1JJQkVEID0gJ3N1YnNjcmliZWQnO1xyXG4gIHRoaXMuVU5TVUJTQ1JJQkVEID0gJ3Vuc3Vic2NyaWJlZCc7XHJcbiAgXHJcbiAgdGhpcy5uYW1lID0gbmFtZTtcclxuICB0aGlzLnN0YXRlID0gdGhpcy5VTlNVQlNDUklCRUQ7XHJcbiAgdGhpcy5jbGllbnQgPSBjbGllbnQ7XHJcbn07XHJcblxyXG5TQ0NoYW5uZWwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTQ0VtaXR0ZXIucHJvdG90eXBlKTtcclxuXHJcblNDQ2hhbm5lbC5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIHRoaXMuc3RhdGU7XHJcbn07XHJcblxyXG5TQ0NoYW5uZWwucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmNsaWVudC5zdWJzY3JpYmUodGhpcy5uYW1lKTtcclxufTtcclxuXHJcblNDQ2hhbm5lbC5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5jbGllbnQudW5zdWJzY3JpYmUodGhpcy5uYW1lKTtcclxufTtcclxuXHJcblNDQ2hhbm5lbC5wcm90b3R5cGUuaXNTdWJzY3JpYmVkID0gZnVuY3Rpb24gKGluY2x1ZGVQZW5kaW5nKSB7XHJcbiAgcmV0dXJuIHRoaXMuY2xpZW50LmlzU3Vic2NyaWJlZCh0aGlzLm5hbWUsIGluY2x1ZGVQZW5kaW5nKTtcclxufTtcclxuXHJcblNDQ2hhbm5lbC5wcm90b3R5cGUucHVibGlzaCA9IGZ1bmN0aW9uIChkYXRhLCBjYWxsYmFjaykge1xyXG4gIHRoaXMuY2xpZW50LnB1Ymxpc2godGhpcy5uYW1lLCBkYXRhLCBjYWxsYmFjayk7XHJcbn07XHJcblxyXG5TQ0NoYW5uZWwucHJvdG90eXBlLndhdGNoID0gZnVuY3Rpb24gKGhhbmRsZXIpIHtcclxuICB0aGlzLmNsaWVudC53YXRjaCh0aGlzLm5hbWUsIGhhbmRsZXIpO1xyXG59O1xyXG5cclxuU0NDaGFubmVsLnByb3RvdHlwZS51bndhdGNoID0gZnVuY3Rpb24gKGhhbmRsZXIpIHtcclxuICB0aGlzLmNsaWVudC51bndhdGNoKHRoaXMubmFtZSwgaGFuZGxlcik7XHJcbn07XHJcblxyXG5TQ0NoYW5uZWwucHJvdG90eXBlLndhdGNoZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiB0aGlzLmNsaWVudC53YXRjaGVycyh0aGlzLm5hbWUpO1xyXG59O1xyXG5cclxuU0NDaGFubmVsLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuY2xpZW50LmRlc3Ryb3lDaGFubmVsKHRoaXMubmFtZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5TQ0NoYW5uZWwgPSBTQ0NoYW5uZWw7XHJcbiIsInZhciBFbWl0dGVyID0gcmVxdWlyZSgnY29tcG9uZW50LWVtaXR0ZXInKTtcclxuXHJcbmlmICghT2JqZWN0LmNyZWF0ZSkge1xyXG4gIE9iamVjdC5jcmVhdGUgPSByZXF1aXJlKCcuL29iamVjdGNyZWF0ZScpO1xyXG59XHJcblxyXG52YXIgU0NFbWl0dGVyID0gZnVuY3Rpb24gKCkge1xyXG4gIEVtaXR0ZXIuY2FsbCh0aGlzKTtcclxufTtcclxuXHJcblNDRW1pdHRlci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVtaXR0ZXIucHJvdG90eXBlKTtcclxuXHJcblNDRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIGlmIChldmVudCA9PSAnZXJyb3InICYmIHRoaXMuZG9tYWluKSB7XHJcbiAgICAvLyBFbWl0IHRoZSBlcnJvciBvbiB0aGUgZG9tYWluIGlmIGl0IGhhcyBvbmUuXHJcbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2Jsb2IvZWY0MzQ0MzExZTE5YTRmNzNjMDMxNTA4MjUyYjIxNzEyYjIyZmU4YS9saWIvZXZlbnRzLmpzI0w3OC04NVxyXG4gICAgXHJcbiAgICB2YXIgZXJyID0gYXJndW1lbnRzWzFdO1xyXG4gICAgXHJcbiAgICBpZiAoIWVycikge1xyXG4gICAgICBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XHJcbiAgICB9XHJcbiAgICBlcnIuZG9tYWluRW1pdHRlciA9IHRoaXM7XHJcbiAgICBlcnIuZG9tYWluID0gdGhpcy5kb21haW47XHJcbiAgICBlcnIuZG9tYWluVGhyb3duID0gZmFsc2U7XHJcbiAgICB0aGlzLmRvbWFpbi5lbWl0KCdlcnJvcicsIGVycik7XHJcbiAgfVxyXG4gIEVtaXR0ZXIucHJvdG90eXBlLmVtaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLlNDRW1pdHRlciA9IFNDRW1pdHRlcjtcclxuIiwiXG4vKipcbiAqIEV4cG9zZSBgRW1pdHRlcmAuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBFbWl0dGVyO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYEVtaXR0ZXJgLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gRW1pdHRlcihvYmopIHtcbiAgaWYgKG9iaikgcmV0dXJuIG1peGluKG9iaik7XG59O1xuXG4vKipcbiAqIE1peGluIHRoZSBlbWl0dGVyIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbWl4aW4ob2JqKSB7XG4gIGZvciAodmFyIGtleSBpbiBFbWl0dGVyLnByb3RvdHlwZSkge1xuICAgIG9ialtrZXldID0gRW1pdHRlci5wcm90b3R5cGVba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xufVxuXG4vKipcbiAqIExpc3RlbiBvbiB0aGUgZ2l2ZW4gYGV2ZW50YCB3aXRoIGBmbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub24gPVxuRW1pdHRlci5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgKHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gPSB0aGlzLl9jYWxsYmFja3NbJyQnICsgZXZlbnRdIHx8IFtdKVxuICAgIC5wdXNoKGZuKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFkZHMgYW4gYGV2ZW50YCBsaXN0ZW5lciB0aGF0IHdpbGwgYmUgaW52b2tlZCBhIHNpbmdsZVxuICogdGltZSB0aGVuIGF1dG9tYXRpY2FsbHkgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgZnVuY3Rpb24gb24oKSB7XG4gICAgdGhpcy5vZmYoZXZlbnQsIG9uKTtcbiAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgb24uZm4gPSBmbjtcbiAgdGhpcy5vbihldmVudCwgb24pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgYGV2ZW50YCBvciBhbGxcbiAqIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9mZiA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuRW1pdHRlci5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50LCBmbil7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICAvLyBhbGxcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gc3BlY2lmaWMgZXZlbnRcbiAgdmFyIGNhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF07XG4gIGlmICghY2FsbGJhY2tzKSByZXR1cm4gdGhpcztcblxuICAvLyByZW1vdmUgYWxsIGhhbmRsZXJzXG4gIGlmICgxID09IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICBkZWxldGUgdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIHJlbW92ZSBzcGVjaWZpYyBoYW5kbGVyXG4gIHZhciBjYjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICBjYiA9IGNhbGxiYWNrc1tpXTtcbiAgICBpZiAoY2IgPT09IGZuIHx8IGNiLmZuID09PSBmbikge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRW1pdCBgZXZlbnRgIHdpdGggdGhlIGdpdmVuIGFyZ3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge01peGVkfSAuLi5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKVxuICAgICwgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzWyckJyArIGV2ZW50XTtcblxuICBpZiAoY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gY2FsbGJhY2tzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGNhbGxiYWNrc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFycmF5IG9mIGNhbGxiYWNrcyBmb3IgYGV2ZW50YC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbihldmVudCl7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcbiAgcmV0dXJuIHRoaXMuX2NhbGxiYWNrc1snJCcgKyBldmVudF0gfHwgW107XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgZW1pdHRlciBoYXMgYGV2ZW50YCBoYW5kbGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmhhc0xpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcmV0dXJuICEhIHRoaXMubGlzdGVuZXJzKGV2ZW50KS5sZW5ndGg7XG59O1xuIiwiXG4vKipcbiAqIE1vZHVsZSBkZXBlbmRlbmNpZXMuXG4gKi9cblxudmFyIGdsb2JhbCA9IChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pKCk7XG5cbi8qKlxuICogV2ViU29ja2V0IGNvbnN0cnVjdG9yLlxuICovXG5cbnZhciBXZWJTb2NrZXQgPSBnbG9iYWwuV2ViU29ja2V0IHx8IGdsb2JhbC5Nb3pXZWJTb2NrZXQ7XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBXZWJTb2NrZXQgPyB3cyA6IG51bGw7XG5cbi8qKlxuICogV2ViU29ja2V0IGNvbnN0cnVjdG9yLlxuICpcbiAqIFRoZSB0aGlyZCBgb3B0c2Agb3B0aW9ucyBvYmplY3QgZ2V0cyBpZ25vcmVkIGluIHdlYiBicm93c2Vycywgc2luY2UgaXQnc1xuICogbm9uLXN0YW5kYXJkLCBhbmQgdGhyb3dzIGEgVHlwZUVycm9yIGlmIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IuXG4gKiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9laW5hcm9zL3dzL2lzc3Vlcy8yMjdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJpXG4gKiBAcGFyYW0ge0FycmF5fSBwcm90b2NvbHMgKG9wdGlvbmFsKVxuICogQHBhcmFtIHtPYmplY3QpIG9wdHMgKG9wdGlvbmFsKVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiB3cyh1cmksIHByb3RvY29scywgb3B0cykge1xuICB2YXIgaW5zdGFuY2U7XG4gIGlmIChwcm90b2NvbHMpIHtcbiAgICBpbnN0YW5jZSA9IG5ldyBXZWJTb2NrZXQodXJpLCBwcm90b2NvbHMpO1xuICB9IGVsc2Uge1xuICAgIGluc3RhbmNlID0gbmV3IFdlYlNvY2tldCh1cmkpO1xuICB9XG4gIHJldHVybiBpbnN0YW5jZTtcbn1cblxuaWYgKFdlYlNvY2tldCkgd3MucHJvdG90eXBlID0gV2ViU29ja2V0LnByb3RvdHlwZTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJuYW1lXCI6IFwic29ja2V0Y2x1c3Rlci1jbGllbnRcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlNvY2tldENsdXN0ZXIgSmF2YVNjcmlwdCBjbGllbnRcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMi4yLjMzXCIsXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwOi8vc29ja2V0Y2x1c3Rlci5pb1wiLFxuICBcImNvbnRyaWJ1dG9yc1wiOiBbXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiSm9uYXRoYW4gR3Jvcy1EdWJvaXNcIixcbiAgICAgIFwiZW1haWxcIjogXCJncm9zam9uYUB5YWhvby5jb20uYXVcIlxuICAgIH1cbiAgXSxcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdDovL2dpdGh1Yi5jb20vU29ja2V0Q2x1c3Rlci9zb2NrZXRjbHVzdGVyLWNsaWVudC5naXRcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJsaW5rZWQtbGlzdFwiOiBcIjAuMS4wXCIsXG4gICAgXCJzYy1jaGFubmVsXCI6IFwiMS4wLnhcIixcbiAgICBcInNjLWVtaXR0ZXJcIjogXCIxLjAueFwiLFxuICAgIFwid3NcIjogXCIwLjcuMVwiXG4gIH0sXG4gIFwiZ2l0SGVhZFwiOiBcIjRlODVkNzViYjUyM2Y4NDU4NzVkN2M4M2IzNjdmZjIwMjBkYWEwYjlcIixcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9Tb2NrZXRDbHVzdGVyL3NvY2tldGNsdXN0ZXItY2xpZW50L2lzc3Vlc1wiXG4gIH0sXG4gIFwiX2lkXCI6IFwic29ja2V0Y2x1c3Rlci1jbGllbnRAMi4yLjMzXCIsXG4gIFwic2NyaXB0c1wiOiB7fSxcbiAgXCJfc2hhc3VtXCI6IFwiM2ZmZTA4OWY5YzUzYmYzZjk3NDBmOGMxYjRlMmZiNjAyZTBlYzkyMVwiLFxuICBcIl9mcm9tXCI6IFwic29ja2V0Y2x1c3Rlci1jbGllbnRAKlwiLFxuICBcIl9ucG1WZXJzaW9uXCI6IFwiMi43LjRcIixcbiAgXCJfbm9kZVZlcnNpb25cIjogXCIwLjEyLjJcIixcbiAgXCJfbnBtVXNlclwiOiB7XG4gICAgXCJuYW1lXCI6IFwidG9wY2xvdWRzeXN0ZW1zXCIsXG4gICAgXCJlbWFpbFwiOiBcImdyb3Nqb25hQHlhaG9vLmNvbS5hdVwiXG4gIH0sXG4gIFwibWFpbnRhaW5lcnNcIjogW1xuICAgIHtcbiAgICAgIFwibmFtZVwiOiBcInRvcGNsb3Vkc3lzdGVtc1wiLFxuICAgICAgXCJlbWFpbFwiOiBcImdyb3Nqb25hQHlhaG9vLmNvbS5hdVwiXG4gICAgfVxuICBdLFxuICBcImRpc3RcIjoge1xuICAgIFwic2hhc3VtXCI6IFwiM2ZmZTA4OWY5YzUzYmYzZjk3NDBmOGMxYjRlMmZiNjAyZTBlYzkyMVwiLFxuICAgIFwidGFyYmFsbFwiOiBcImh0dHA6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvc29ja2V0Y2x1c3Rlci1jbGllbnQvLS9zb2NrZXRjbHVzdGVyLWNsaWVudC0yLjIuMzMudGd6XCJcbiAgfSxcbiAgXCJkaXJlY3Rvcmllc1wiOiB7fSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9zb2NrZXRjbHVzdGVyLWNsaWVudC8tL3NvY2tldGNsdXN0ZXItY2xpZW50LTIuMi4zMy50Z3pcIlxufVxuIiwiLyohXG4gIENvcHlyaWdodCAoYykgMjAxNSBKZWQgV2F0c29uLlxuICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UgKE1JVCksIHNlZVxuICBodHRwOi8vamVkd2F0c29uLmdpdGh1Yi5pby9jbGFzc25hbWVzXG4qL1xuXG4oZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cblx0XHR2YXIgY2xhc3NlcyA9ICcnO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG5cdFx0XHRpZiAoIWFyZykgY29udGludWU7XG5cblx0XHRcdHZhciBhcmdUeXBlID0gdHlwZW9mIGFyZztcblxuXHRcdFx0aWYgKCdzdHJpbmcnID09PSBhcmdUeXBlIHx8ICdudW1iZXInID09PSBhcmdUeXBlKSB7XG5cdFx0XHRcdGNsYXNzZXMgKz0gJyAnICsgYXJnO1xuXG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblxuXHRcdFx0fSBlbHNlIGlmICgnb2JqZWN0JyA9PT0gYXJnVHlwZSkge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGFyZy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzICs9ICcgJyArIGtleTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gY2xhc3Nlcy5zdWJzdHIoMSk7XG5cdH1cblxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cblx0XHRkZWZpbmUoZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG5cbn0oKSk7XG4iLCJcbi8qKlxuICogVGhpcyBpcyB0aGUgd2ViIGJyb3dzZXIgaW1wbGVtZW50YXRpb24gb2YgYGRlYnVnKClgLlxuICpcbiAqIEV4cG9zZSBgZGVidWcoKWAgYXMgdGhlIG1vZHVsZS5cbiAqL1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG5leHBvcnRzLmxvZyA9IGxvZztcbmV4cG9ydHMuZm9ybWF0QXJncyA9IGZvcm1hdEFyZ3M7XG5leHBvcnRzLnNhdmUgPSBzYXZlO1xuZXhwb3J0cy5sb2FkID0gbG9hZDtcbmV4cG9ydHMudXNlQ29sb3JzID0gdXNlQ29sb3JzO1xuZXhwb3J0cy5zdG9yYWdlID0gJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGNocm9tZVxuICAgICAgICAgICAgICAgJiYgJ3VuZGVmaW5lZCcgIT0gdHlwZW9mIGNocm9tZS5zdG9yYWdlXG4gICAgICAgICAgICAgICAgICA/IGNocm9tZS5zdG9yYWdlLmxvY2FsXG4gICAgICAgICAgICAgICAgICA6IGxvY2Fsc3RvcmFnZSgpO1xuXG4vKipcbiAqIENvbG9ycy5cbiAqL1xuXG5leHBvcnRzLmNvbG9ycyA9IFtcbiAgJ2xpZ2h0c2VhZ3JlZW4nLFxuICAnZm9yZXN0Z3JlZW4nLFxuICAnZ29sZGVucm9kJyxcbiAgJ2RvZGdlcmJsdWUnLFxuICAnZGFya29yY2hpZCcsXG4gICdjcmltc29uJ1xuXTtcblxuLyoqXG4gKiBDdXJyZW50bHkgb25seSBXZWJLaXQtYmFzZWQgV2ViIEluc3BlY3RvcnMsIEZpcmVmb3ggPj0gdjMxLFxuICogYW5kIHRoZSBGaXJlYnVnIGV4dGVuc2lvbiAoYW55IEZpcmVmb3ggdmVyc2lvbikgYXJlIGtub3duXG4gKiB0byBzdXBwb3J0IFwiJWNcIiBDU1MgY3VzdG9taXphdGlvbnMuXG4gKlxuICogVE9ETzogYWRkIGEgYGxvY2FsU3RvcmFnZWAgdmFyaWFibGUgdG8gZXhwbGljaXRseSBlbmFibGUvZGlzYWJsZSBjb2xvcnNcbiAqL1xuXG5mdW5jdGlvbiB1c2VDb2xvcnMoKSB7XG4gIC8vIGlzIHdlYmtpdD8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTY0NTk2MDYvMzc2NzczXG4gIHJldHVybiAoJ1dlYmtpdEFwcGVhcmFuY2UnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZSkgfHxcbiAgICAvLyBpcyBmaXJlYnVnPyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTgxMjAvMzc2NzczXG4gICAgKHdpbmRvdy5jb25zb2xlICYmIChjb25zb2xlLmZpcmVidWcgfHwgKGNvbnNvbGUuZXhjZXB0aW9uICYmIGNvbnNvbGUudGFibGUpKSkgfHxcbiAgICAvLyBpcyBmaXJlZm94ID49IHYzMT9cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1Rvb2xzL1dlYl9Db25zb2xlI1N0eWxpbmdfbWVzc2FnZXNcbiAgICAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLm1hdGNoKC9maXJlZm94XFwvKFxcZCspLykgJiYgcGFyc2VJbnQoUmVnRXhwLiQxLCAxMCkgPj0gMzEpO1xufVxuXG4vKipcbiAqIE1hcCAlaiB0byBgSlNPTi5zdHJpbmdpZnkoKWAsIHNpbmNlIG5vIFdlYiBJbnNwZWN0b3JzIGRvIHRoYXQgYnkgZGVmYXVsdC5cbiAqL1xuXG5leHBvcnRzLmZvcm1hdHRlcnMuaiA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xufTtcblxuXG4vKipcbiAqIENvbG9yaXplIGxvZyBhcmd1bWVudHMgaWYgZW5hYmxlZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIGZvcm1hdEFyZ3MoKSB7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgdXNlQ29sb3JzID0gdGhpcy51c2VDb2xvcnM7XG5cbiAgYXJnc1swXSA9ICh1c2VDb2xvcnMgPyAnJWMnIDogJycpXG4gICAgKyB0aGlzLm5hbWVzcGFjZVxuICAgICsgKHVzZUNvbG9ycyA/ICcgJWMnIDogJyAnKVxuICAgICsgYXJnc1swXVxuICAgICsgKHVzZUNvbG9ycyA/ICclYyAnIDogJyAnKVxuICAgICsgJysnICsgZXhwb3J0cy5odW1hbml6ZSh0aGlzLmRpZmYpO1xuXG4gIGlmICghdXNlQ29sb3JzKSByZXR1cm4gYXJncztcblxuICB2YXIgYyA9ICdjb2xvcjogJyArIHRoaXMuY29sb3I7XG4gIGFyZ3MgPSBbYXJnc1swXSwgYywgJ2NvbG9yOiBpbmhlcml0J10uY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIDEpKTtcblxuICAvLyB0aGUgZmluYWwgXCIlY1wiIGlzIHNvbWV3aGF0IHRyaWNreSwgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBvdGhlclxuICAvLyBhcmd1bWVudHMgcGFzc2VkIGVpdGhlciBiZWZvcmUgb3IgYWZ0ZXIgdGhlICVjLCBzbyB3ZSBuZWVkIHRvXG4gIC8vIGZpZ3VyZSBvdXQgdGhlIGNvcnJlY3QgaW5kZXggdG8gaW5zZXJ0IHRoZSBDU1MgaW50b1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGFzdEMgPSAwO1xuICBhcmdzWzBdLnJlcGxhY2UoLyVbYS16JV0vZywgZnVuY3Rpb24obWF0Y2gpIHtcbiAgICBpZiAoJyUlJyA9PT0gbWF0Y2gpIHJldHVybjtcbiAgICBpbmRleCsrO1xuICAgIGlmICgnJWMnID09PSBtYXRjaCkge1xuICAgICAgLy8gd2Ugb25seSBhcmUgaW50ZXJlc3RlZCBpbiB0aGUgKmxhc3QqICVjXG4gICAgICAvLyAodGhlIHVzZXIgbWF5IGhhdmUgcHJvdmlkZWQgdGhlaXIgb3duKVxuICAgICAgbGFzdEMgPSBpbmRleDtcbiAgICB9XG4gIH0pO1xuXG4gIGFyZ3Muc3BsaWNlKGxhc3RDLCAwLCBjKTtcbiAgcmV0dXJuIGFyZ3M7XG59XG5cbi8qKlxuICogSW52b2tlcyBgY29uc29sZS5sb2coKWAgd2hlbiBhdmFpbGFibGUuXG4gKiBOby1vcCB3aGVuIGBjb25zb2xlLmxvZ2AgaXMgbm90IGEgXCJmdW5jdGlvblwiLlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gbG9nKCkge1xuICAvLyB0aGlzIGhhY2tlcnkgaXMgcmVxdWlyZWQgZm9yIElFOC85LCB3aGVyZVxuICAvLyB0aGUgYGNvbnNvbGUubG9nYCBmdW5jdGlvbiBkb2Vzbid0IGhhdmUgJ2FwcGx5J1xuICByZXR1cm4gJ29iamVjdCcgPT09IHR5cGVvZiBjb25zb2xlXG4gICAgJiYgY29uc29sZS5sb2dcbiAgICAmJiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbChjb25zb2xlLmxvZywgY29uc29sZSwgYXJndW1lbnRzKTtcbn1cblxuLyoqXG4gKiBTYXZlIGBuYW1lc3BhY2VzYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gc2F2ZShuYW1lc3BhY2VzKSB7XG4gIHRyeSB7XG4gICAgaWYgKG51bGwgPT0gbmFtZXNwYWNlcykge1xuICAgICAgZXhwb3J0cy5zdG9yYWdlLnJlbW92ZUl0ZW0oJ2RlYnVnJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cG9ydHMuc3RvcmFnZS5kZWJ1ZyA9IG5hbWVzcGFjZXM7XG4gICAgfVxuICB9IGNhdGNoKGUpIHt9XG59XG5cbi8qKlxuICogTG9hZCBgbmFtZXNwYWNlc2AuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfSByZXR1cm5zIHRoZSBwcmV2aW91c2x5IHBlcnNpc3RlZCBkZWJ1ZyBtb2Rlc1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgdmFyIHI7XG4gIHRyeSB7XG4gICAgciA9IGV4cG9ydHMuc3RvcmFnZS5kZWJ1ZztcbiAgfSBjYXRjaChlKSB7fVxuICByZXR1cm4gcjtcbn1cblxuLyoqXG4gKiBFbmFibGUgbmFtZXNwYWNlcyBsaXN0ZWQgaW4gYGxvY2FsU3RvcmFnZS5kZWJ1Z2AgaW5pdGlhbGx5LlxuICovXG5cbmV4cG9ydHMuZW5hYmxlKGxvYWQoKSk7XG5cbi8qKlxuICogTG9jYWxzdG9yYWdlIGF0dGVtcHRzIHRvIHJldHVybiB0aGUgbG9jYWxzdG9yYWdlLlxuICpcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2Ugc2FmYXJpIHRocm93c1xuICogd2hlbiBhIHVzZXIgZGlzYWJsZXMgY29va2llcy9sb2NhbHN0b3JhZ2VcbiAqIGFuZCB5b3UgYXR0ZW1wdCB0byBhY2Nlc3MgaXQuXG4gKlxuICogQHJldHVybiB7TG9jYWxTdG9yYWdlfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gbG9jYWxzdG9yYWdlKCl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2U7XG4gIH0gY2F0Y2ggKGUpIHt9XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5mdW5jdGlvbiBvd25FbnVtZXJhYmxlS2V5cyhvYmopIHtcblx0dmFyIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmopO1xuXG5cdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0a2V5cyA9IGtleXMuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqKSk7XG5cdH1cblxuXHRyZXR1cm4ga2V5cy5maWx0ZXIoZnVuY3Rpb24gKGtleSkge1xuXHRcdHJldHVybiBwcm9wSXNFbnVtZXJhYmxlLmNhbGwob2JqLCBrZXkpO1xuXHR9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIGtleXM7XG5cdHZhciB0byA9IFRvT2JqZWN0KHRhcmdldCk7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gYXJndW1lbnRzW3NdO1xuXHRcdGtleXMgPSBvd25FbnVtZXJhYmxlS2V5cyhPYmplY3QoZnJvbSkpO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR0b1trZXlzW2ldXSA9IGZyb21ba2V5c1tpXV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsInZhciBwa2cgPSByZXF1aXJlKCcuL3BhY2thZ2UuanNvbicpO1xudmFyIFNDU29ja2V0ID0gcmVxdWlyZSgnLi9saWIvc2Nzb2NrZXQnKTtcbm1vZHVsZS5leHBvcnRzLlNDU29ja2V0ID0gU0NTb2NrZXQ7XG5cbm1vZHVsZS5leHBvcnRzLlNDRW1pdHRlciA9IHJlcXVpcmUoJ3NjLWVtaXR0ZXInKS5TQ0VtaXR0ZXI7XG5cbm1vZHVsZS5leHBvcnRzLmNvbm5lY3QgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICByZXR1cm4gbmV3IFNDU29ja2V0KG9wdGlvbnMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMudmVyc2lvbiA9IHBrZy52ZXJzaW9uO1xuIl19
