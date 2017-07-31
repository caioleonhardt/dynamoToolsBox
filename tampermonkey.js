// ==UserScript==
// @name         ATG Dynamo Tools Box
// @description  JavaScript Extension for ATG Dynamo
// @version      0.1
// @match        */dyn/admin/*
// ==/UserScript==
window.mappedHosts = new Map([
    ['host', 'nickname']
]);
(function() {
    var element = document.createElement("script");
    element.src = "//raw.githubusercontent.com/mdsbarbieri/dynamoToolsBox/master/extension.js"
    element.defer = true;
    document.getElementsByTagName('head')[0].appendChild(element);
});
