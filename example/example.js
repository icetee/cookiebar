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

/**
 * If loaded DOM elements
 **/
ready(function() {
  var cookiebar = new Cookiebar({
    debug: 1,
    content: {
      description: "Honlapunk ún. sütiket (cookie) használ, hogy biztosítani tudja a személyre szabott, felhasználóbarát böngészést. Az így gyűjtött adatok névtelenek, azokból nem készülnek felhasználói profilok, illetve nem kerülnek további felhasználásra. Az OK-ra kattintva Ön hozzájárul a sütik használatához.",
      link: "@icetee/cookiebar",
      href: "https://github.com/icetee/cookiebar",
      button: "OK"
    },
    onAccept: function () {
      console.log("Cookie accepted");
    }
  });
});
