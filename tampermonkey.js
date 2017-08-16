// ==UserScript==
// @name         ATG Dynamo Tools Box
// @description  JavaScript Extension for ATG Dynamo
// @version      0.1.3
// @match        */dyn/admin/*
// @require      http://rawgit.com/mdsbarbieri/dynamoToolsBox/master/extension.js
// ==/UserScript==
unsafeWindow.mappedHosts = new Map([
    ['host or ip', { name: 'nickname', production: false }]
]);

unsafeWindow.favorites = [
    '/atg/userprofiling/ProfileAdapterRepository/',
    '/atg/commerce/order/OrderRepository/'
];