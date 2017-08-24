// ==UserScript==
// @name         ATG Dynamo Tools Box
// @description  JavaScript Extension for ATG Dynamo
// @version      1.0
// @match        */dyn/admin/*
// @require      https://rawgit.com/mdsbarbieri/dynamoToolsBox/master/dist/extension.min.js
// ==/UserScript==

//DEFINE ENVIRONMENTS
unsafeWindow.mappedHosts = new Map([
    ['host', { name: 'PRD', production: true }]
]);

//ADD FAVORITES URLS
unsafeWindow.favorites = [
    '/atg/userprofiling/ProfileAdapterRepository/'
];

//ADD CUSTOM DATASOURCES
unsafeWindow.datasources = [{
    "value": "/atg/dynamo/service/jdbc/SwitchingDataSourceA",
    "text": "CATALOG_A",
}];