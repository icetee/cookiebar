# Cookiebar

# About

Because of the changes in the ([EU Cookie Law](http://ec.europa.eu/ipg/basics/legal/cookies/index_en.htm)), the website operators must inform the visitors about the site's use of cookies.

This simple script is free of dependencies, does not require use of framework. The minimalized version is less than 5 Kb. The Cookie bar gives the opportunity for the guest to know about active cookie usage.

If you use jQuery, it might be worth trying: [jquery.cookiebar](https://github.com/delboy1978uk/jquery.cookiebar).

# Getting started

## Install

- Using npm: `$ npm install cookiebar`
- Using bower: `$ bower install cookiebar`

or download latest release from [github](https://github.com/icetee/cookie-bar/releases).

## Usage

Include header (all pages)

```html
<link rel="stylesheet" href="dist/cookiebar.min.css" media="screen" charset="utf-8">
```

and include footer, before close `</body>` tag (all pages)

```html
<script type="text/javascript" src="dist/cookiebar.min.js"></script>
```

and add this code your script file ...

```javascript
ready(function() {
    var cookiebar = new Cookiebar({
        id: "cookiebar",
        cls: "cookiebar",
        cookie: "cookiebar"
    });
});
```

# Features

- [x] Vanilla javascript (no dependencies)
- [x] Only appears when you use cookies

# Build

Request [Node.js](https://nodejs.org/en) and [gulp-cli](http://gulpjs.com). Install devDependencies from package.json

```bash
npm install
```

# Contribute

You can contribute with **Cookiebar** installing it and submitting issues and pull requests.

NOTE: Please no pull dist folder.

# License

MIT © [Tamás András Horváth](https://github.com/icetee)
