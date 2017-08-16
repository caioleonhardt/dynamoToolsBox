(function(window) {

    var DynamoToolBox = (function() {
        'use strict';

        var config = {
            appName: "Dynamo Tool Box",
            copyright: "Created by Matheus Barbieri - Contributions by Caio Leonhardt - version 0.2.0"
        };

        return {
            config: config
        }
    })();

    Object.defineProperty(window, 'CONSTANTS', {
        value: (function() {
            var url = {};
            Object.defineProperty(url, 'appName', { value: DynamoToolBox.config.appName, writable: false })
            Object.defineProperty(url, 'welcomeMessage', { value: '-- Initialized Dynamo Tool Box --', writable: false })
            return url;
        })(),
        writable: false
    });

    window.DynamoToolBox = DynamoToolBox;

})(window);