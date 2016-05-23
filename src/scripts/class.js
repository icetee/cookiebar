var Cookiebar = function(opt) {
    this.opt = extend({
        id: "cookiebar",
        cls: "cookiebar",
        cookie: "cookiebar",
        content: {},
        fade: {},
        debug: 0
    }, opt || {});

    this.content = extend({
        description: "Az oldal sütiket használ a működéshez. Szolgáltatásaink igénybevételével Ön beleegyezik a sütik használatába!",
        link: "További információk",
        href: "http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm",
        button: "Elfogadom",
        more: "Az EU-s jogszabályok értelmében fel kell hívnunk a figyelmét, hogy oldalaink sütiket (cookie) használnak. Ezek miniatűr, ártalmatlan fájlok, melyeket az ön gépére helyezünk el, hogy a szolgáltatásaink használatát egyszerűbbé tegyük az ön számára. A sütiket természetesen letilthatja a böngészőjében, azonban ha az Elfogadom feliratú gombra kattint, akkor elfogadja azok használatát."
    }, this.opt.content || {});

    this.fade = extend({
        type: "in",
        ms: "500"
    }, this.opt.fade || {});

    this.id = this.opt.id;
    this.cls = this.opt.cls;
    this.cookie = this.opt.cookie;
    this.debug = this.opt.debug;
    this.fade = this.opt.fade;
    this.status = false;

    //Initialize
    this.init();
};

Cookiebar.prototype.init = function() {
    var self = this;
    if (self.debug) {
        self.setCookie('debug_cookibar', "test", 365, function() {
            self.checkCookie();
        });
    } else {
        self.checkCookie();
    }
};

Cookiebar.prototype.exitsCookie = function() {
    return document.cookie.length > 0;
};

Cookiebar.prototype.getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
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

    var cvalue = escape(value) + ((exdays === null) ? "" : "; expires=" + ex.toUTCString() + "; path=/;");

    document.cookie = cname + "=" + cvalue;

    if (typeof cb === "function") {
        cb();
    }
};

Cookiebar.prototype.draw = function() {
    var self = this,
        bar = document.createElement('div'),
        html = '<div class="' + this.cls + '-wrapper">' +
        '<div class="' + this.cls + '-desciption">' +
        this.content.description +
        '</div>' +
        '<div class="' + this.cls + '-link">' +
        '<a href="' + this.content.href + '">' + this.content.link + '</a>' +
        '</div>' +
        '<div class="' + this.cls + '-button">' +
        '<button type="button" name="' + this.cls + '-button" class="' + this.cls + '-btn">' +
        this.content.button +
        '</button>' +
        '</div>' +
        '<div class="' + this.cls + '-more" style="display: none;">' +
        this.content.more +
        '</div>' +
        '</div>';

    bar.id = self.id;
    bar.className = self.cls;
    bar.innerHTML = html;

    var btn = bar.querySelector('.' + self.cls + '-btn');

    addEventListener(btn, 'click', function(e) {
        if (typeof e.preventDefault !== "undefined") {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }

        self.setCookie(self.cookie, true, 365, function() {
            self.setStatus(self.cookie);
        });

        document.getElementById(self.id).style.display = 'none';
    });

    document.body.insertBefore(bar, document.body.firstChild);
};

Cookiebar.prototype.checkCookie = function() {
    var self = this,
        cookie = self.getCookie(self.cookie);

    if ((self.exitsCookie() && (cookie === "null" || cookie === "")) && cookie !== "true") {
        self.draw();
        _("#" + self.id).fade(this.fade.type, this.fade.ms);
        self.setCookie(self.cookie, null, 365);
    }

    self.setStatus(cookie);
};

Cookiebar.prototype.setStatus = function(status) {
    if (status === "true") {
        this.status = true;
    }
};

Cookiebar.prototype.getStatus = function() {
    return this.status;
};
