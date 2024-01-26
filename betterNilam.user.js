// ==UserScript==
// @name         betterNilam
// @namespace    https://nilamjohor.edu.my/
// @version      RELEASE
// @description  Upgrade your Nilam experience.
// @author       du-cc
// @match        https://nilamjohor.edu.my/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.my
// ==/UserScript==

(function() {
    'use strict';
  document.head.appendChild(Object.assign(document.createElement('script'), { type: 'text/javascript', src: 'https://cdn.jsdelivr.net/gh/du-cc/BetterNilam@main/source.js' }));
})();
