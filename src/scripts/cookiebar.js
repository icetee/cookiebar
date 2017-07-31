var Cookiebar = (function(doc) {

    function _(el) {
        if (!(this instanceof _)) {
            return new _(el);
        }

        var first = el.charAt(0);

        if (first === "#") {
            this.el = doc.getElementById(el.substr(1));
        } else if (first === ".") {
            this.el = doc.getElementsByClassName(el.substr(1));
        } else {
            this.el = doc.getElementsByTagName(el);
        }
    }

    _.prototype.fade = function fade(type, ms, dis) {
        var isIn = type === 'in',
            opacity = isIn ? 0 : 1,
            interval = 50,
            duration = ms,
            gap = interval / duration,
            display = dis ? dis : 'inline',
            self = this;

        if (isIn) {
            self.el.style.display = display;
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

    var Vanilla = function() {};

    Vanilla.prototype.extend = function(target) {
        for (var i = 1; i < arguments.length; ++i) {
            var from = arguments[i];
            if (typeof from !== 'object') continue;
            for (var j in from) {
                if (from.hasOwnProperty(j)) {
                    target[j] = typeof from[j] === 'object' ?
                        this.extend({}, target[j], from[j]) : from[j];
                }
            }
        }
        return target;
    };

    Vanilla.prototype.trigger = function(el, eventName) {
        var event = doc.createEvent('Event');
        event.initEvent(eventName, true, true);
        el.dispatchEvent(event);
    };

    /**
     * Vanilla JavaScript support IE8+.
     *
     * @link https://plainjs.com
     */

    Vanilla.prototype.addEvent = function(el, type, handler) {
        if (el.attachEvent) el.attachEvent('on' + type, handler);
        else el.addEventListener(type, handler);
    };

    Vanilla.prototype.removeEvent = function(el, type, handler) {
        if (el.detachEvent) el.detachEvent('on' + type, handler);
        else el.removeEventListener(type, handler);
    };

    Vanilla.prototype.parseTemplate = function(str, data) {
        return str.replace(/\$\{(\w+)\}/gi, function(match, parensMatch) {
            if (data[parensMatch] !== undefined) {
                return data[parensMatch];
            }

            return match;
        });
    };

    var v = new Vanilla();

    var Cookiebar = function(opt) {
        this.opt = v.extend({
            id: "cookiebar",
            cls: "cookiebar",
            cookie: "cookiebar",
            content: {
                description: "Az oldal sütiket használ a működéshez. Szolgáltatásaink igénybevételével Ön beleegyezik a sütik használatába!",
                link: "További információk",
                href: "http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm",
                button: "Elfogadom",
                more: "Az EU-s jogszabályok értelmében fel kell hívnunk a figyelmét, hogy oldalaink sütiket (cookie) használnak. Ezek miniatűr, ártalmatlan fájlok, melyeket az ön gépére helyezünk el, hogy a szolgáltatásaink használatát egyszerűbbé tegyük az ön számára. A sütiket természetesen letilthatja a böngészőjében, azonban ha az Elfogadom feliratú gombra kattint, akkor elfogadja azok használatát."
            },
            fade: {
                type: "in",
                ms: "500",
                display: "inline"
            },
            debug: 0,
            exits: true
        }, opt || {});
        this.data = this.opt;
        this.bodyMargBotBackup = doc.body.style.marginBottom || "";
        this.visible = false;

        //Initialize
        this.init();
    };

    Cookiebar.prototype.init = function() {
        var self = this;
        if (self.data.debug) {
            self.setCookie('debug_cookibar', "test", 365, function() {
                self.delCookie(self.data.id);
                self.checkCookie();
            });
        } else {
            self.checkCookie();
        }
    };

    Cookiebar.prototype.exitsCookie = function() {
        return this.getCookie(this.data.cookie) === "true";
    };

    Cookiebar.prototype.getCookie = function(cname) {
        var name = cname + "=";
        var ca = doc.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    Cookiebar.prototype.setCookie = function(cname, value, exdays, cb) {
        var ex = new Date();
        ex.setDate(ex.getDate() + exdays);

        var cvalue = escape(value) + (
            exdays === null ? "" : "; expires=" + ex.toUTCString() + "; path=/;"
        );

        doc.cookie = cname + "=" + cvalue;

        if (typeof cb === "function") {
            cb();
        }
    };

    Cookiebar.prototype.delCookie = function(cname) {
        doc.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    };

    Cookiebar.prototype.html = function() {
        var self = this,
            html = '<div class="${cls}-wrapper">' +
            '<div class="${cls}-desciption">${des}</div>' +
            '<div class="${cls}-link">' +
            '<a href="${href}">${link}</a>' +
            '</div>' +
            '<div class="${cls}-button">' +
            '<button type="button" name="${cls}-button" class="${cls}-btn">${btn}</button>' +
            '</div>' +
            '<div class="${cls}-more" style="display: none;">${more}</div>' +
            '</div>';

        return v.parseTemplate(html, {
            cls: self.data.cls,
            href: self.data.content.href,
            link: self.data.content.link,
            more: self.data.content.more,
            btn: self.data.content.button,
            des: self.data.content.description
        });
    };

    Cookiebar.prototype.draw = function() {
        var self = this,
            bar = doc.createElement('div');

        bar.id = self.data.id;
        bar.className = self.data.cls;
        bar.innerHTML = self.html();

        doc.body.insertBefore(bar, doc.body.firstChild);

        var btn = bar.getElementsByClassName(self.data.cls + '-btn')[0];

        v.addEvent(btn, 'click', function(e) {
            if (typeof e.preventDefault !== "undefined") {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            this.visible = false;
            v.removeEvent(window, 'resize');
            self.setCookie(self.data.cookie, true, 365);
            bar.style.display = 'none';

            if (doc.body.style.marginBottom !== self.bodyMargBotBackup) {
                doc.body.style.marginBottom = self.bodyMargBotBackup;
            }
        });

        v.addEvent(window, 'resize', function() {
            var height = bar.offsetHeight;
            if (self.visible) {
                doc.body.style.marginBottom = height + "px";
            }
        });

        v.trigger(window, 'resize');
    };

    Cookiebar.prototype.checkCookie = function() {
        if (!this.exitsCookie()) {
            this.draw();
            _("#" + this.data.id).fade(this.data.fade.type, this.data.fade.ms);
            this.setCookie(this.data.cookie, null, 365);
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    
    return Cookiebar;
    
})(document);
