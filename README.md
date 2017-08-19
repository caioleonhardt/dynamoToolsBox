# dynamoToolsBox
    
    Dynamo Tools Box born with a idea of turn more easy a navigation and use of Dynamo ATG

RECOMMENDED USE

    Copy the content of tampermonkey.js and paste in a new Tampermonkey (or similar) script. 
    Edit var mappedHosts and add your server addresses and nicknames

TAMPERMONKEY TEMPLATE

    // ==UserScript==
    // @name         ATG Dynamo Tools Box
    // @description  JavaScript Extension for ATG Dynamo
    // @version      1.0
    // @match        */dyn/admin/*
    // @require      https://rawgit.com/mdsbarbieri/dynamoToolsBox/master/dist/extension.min.js
    // ==/UserScript==

    unsafeWindow.mappedHosts = new Map([
        ['host', { name: 'PRD', production: true }]
    ]);

    unsafeWindow.favorites = [
        '/atg/userprofiling/ProfileAdapterRepository/'
    ];

    unsafeWindow.datasources = [
        {
            "value": "/atg/dynamo/service/jdbc/SwitchingDataSourceA",
            "text": "CATALOG_A",
        }
    ];