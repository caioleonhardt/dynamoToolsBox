# dynamoToolsBox
    
    Dynamo Tools Box born with a idea of turn more easy a navigation and use of Dynamo ATG

RECOMMENDED USE

    Copy the content of tampermonkey.js and paste in a new Tampermonkey (or similar) script. 
    Edit var mappedHosts and add your server addresses and nicknames

FEATURES

    1 - KeyEvents

        - CTRL + SHIFT + F = Focus on search elements
        - CTRL + ENTER = Trigger submit textArea event

    2 - Autocomple item-descriptors on DynamoToolBox inputs
    3 - Makes it easier to perform actions like remove, update, and print through
        the blur event in the "item-descriptor" tag in the print-item xml
    4 - Prettify XML
    5 - Switch Datasources
    6 - Add favorites URLs
    7 - Define current environment

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