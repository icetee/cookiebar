var Cookiebar = function(opt) {
    this.opt = extend({
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
            ms: "500"
        },
        debug: 0
    }, opt || {});

    this.id = this.opt.id;
    this.cls = this.opt.cls;
    this.cookie = this.opt.cookie;
    this.content = this.opt.content;
    this.debug = this.opt.debug;
    this.fade = this.opt.fade;

    //Initialize
    this.init();
};

Cookiebar.prototype.init = function() {
    if (this.debug) {
        this.setCookie('debug_cookibar', true, 365);
    }

    //Check Cookies
    this.checkCookie();
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

Cookiebar.prototype.setCookie = function(cname, value, exdays) {
    var ex = new Date();
    ex.setDate(ex.getDate() + exdays);

    var cvalue = escape(value) + ((exdays === null) ? "" : "; expires=" + ex.toUTCString() + "; path=/");

    document.cookie = cname + "=" + cvalue;
};

Cookiebar.prototype.draw = function() {
    var self = this,
        bar = document.createElement('div'),
        html = '' +
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

        self.setCookie(self.cookie, true, 365);

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
};
