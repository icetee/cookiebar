function _(el) {
    if (!(this instanceof _)) {
        return new _(el);
    }

    var first = el.charAt(0);

    if (first === "#") {
        this.el = document.getElementById(el.substr(1));
    } else if (first === ".") {
        this.el = document.getElementsByClassName(el.substr(1));
    } else {
        this.el = document.getElementsByTagName(el);
    }
}

_.prototype.fade = function fade(type, ms) {
    var isIn = type === 'in',
        opacity = isIn ? 0 : 1,
        interval = 50,
        duration = ms,
        gap = interval / duration,
        self = this;

    if (isIn) {
        self.el.style.display = 'inline';
        self.el.style.opacity = opacity;
    }

    function func() {
        opacity = isIn ? opacity + gap : opacity - gap;
        self.el.style.opacity = opacity;

        if (opacity <= 0) self.el.style.display = 'none';
        if (opacity <= 0 || opacity >= 1) window.clearInterval(fading);
    }

    var fading = window.setInterval(func, interval);
};

/**
 * Vanilla JavaScript support IE8+.
 *
 * @thanks @zackbloom and @adamfschwartz
 * @link http://youmightnotneedjquery.com
 */

var extend = function(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i])
            continue;

        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key))
                out[key] = arguments[i][key];
        }
    }

    return out;
};

var ready = function(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState != 'loading') {
                fn();
            }
        });
    }

    return;
};

var addEventListener = function(el, eventName, handler) {
    if (el.addEventListener) {
        el.addEventListener(eventName, handler);
    } else {
        el.attachEvent('on' + eventName, function() {
            handler.call(el);
        });
    }
};
