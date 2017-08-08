/**
 * cookiebar - It is a pure JS code, that warns the visitors in the notification bar, the page saves cookies. This is Compliant with the new EU cookie law.
 * Date 2017-08-08T12:26:15Z
 *
 * @author Tamás András Horváth <htomy92@gmail.com> (http://icetee.hu)
 * @version v0.9.7
 * @link https://github.com/icetee/cookiebar#readme
 * @license MIT
 */

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
        return (el[window.attachEvent ? 'attachEvent' : 'addEventListener'](
            (window.attachEvent ? 'on' : '')+type, handler, true
        ));
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
        var self = this;
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

        this.bar = null;
        this.data = this.opt;
        this.bodyMargBotBackup = doc.body.style.marginBottom || "";
        this.accepted = false;
        this.events = {
            btnClick: function(e) {
                if (e && e.preventDefault) e.preventDefault();
                else if (typeof e === 'object') e.returnValue = false;
                self.accept();
            },
            winResize: function() {
                if (self.accepted) { return; }
                doc.body.style.marginBottom = self.bar.offsetHeight + "px";
            }
        };
        //Initialize
        this.init();
    };

    Cookiebar.prototype.init = function() {
        var self = this;

        if (self.data.debug) {
            self.setCookie('debug_cookibar', "test", 365, function() {
                self.withdraw();
            });
        } else {
            self.checkCookie();
        }
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
            cb.call(this);
        }
    };

    Cookiebar.prototype.delCookie = function(cname) {
        doc.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    };

    Cookiebar.prototype.html = function() {
        var html = '<div class="${cls}-wrapper">' +
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
            cls: this.data.cls,
            href: this.data.content.href,
            link: this.data.content.link,
            more: this.data.content.more,
            btn: this.data.content.button,
            des: this.data.content.description
        });
    };

    Cookiebar.prototype.withdraw = function() {
        this.delCookie(this.data.id);
        this.accepted = false;
        this.checkCookie();
    };

    Cookiebar.prototype.accept = function() {
        this.accepted = true;
        this.setCookie(this.data.cookie, true, 365);

        v.removeEvent(window, 'resize', this.events.winResize);

        if (this.bar) {
            this.bar.style.display = 'none';
        }
        if (doc.body.style.marginBottom !== this.bodyMargBotBackup) {
            doc.body.style.marginBottom = this.bodyMargBotBackup;
        }
    };

    Cookiebar.prototype.draw = function() {
        var self = this, btn;

        if (self.accepted) { return; }

        if (!self.bar) {
            self.bar = doc.createElement('div');
            self.bar.id = self.data.id;
            self.bar.className = self.data.cls;
            self.bar.innerHTML = self.html();
            doc.body.insertBefore(self.bar, doc.body.firstChild);
            btn = self.bar.getElementsByClassName(self.data.cls + '-btn')[0];
            v.addEvent(btn, 'click', self.events.btnClick);
        }

        v.addEvent(window, 'resize', self.events.winResize);
        v.trigger(window, 'resize');

        _("#" + self.data.id).fade(self.data.fade.type, self.data.fade.ms);

        self.setCookie(self.data.cookie, null, 365);
    };

    Cookiebar.prototype.checkCookie = function() {
        this.accepted = this.getCookie(this.data.cookie) === "true";
        if (!this.accepted) { this.draw(); }
    };

    Cookiebar.prototype.getStatus = function() {
        return this.accepted;
    };

    return Cookiebar;
})(document);
