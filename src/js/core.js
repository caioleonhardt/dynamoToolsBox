(function(window) {

    var DynamoToolBox = (function() {
        'use strict';

        var config = {
            appName: "Dynamo Tool Box",
            copyright: "Created by Matheus Barbieri - Contributions by Caio Leonhardt - version 0.2.1"
        };

        var storage = {
            _data: {},
            setItem: function(id, val) { return this._data[id] = String(val); },
            getItem: function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
            removeItem: function(id) { return delete this._data[id]; },
            clear: function() { return this._data = {}; }
        };

        if (localStorage) {
            storage = localStorage;
        }

        function _init() {

        }

        _init();

        return {
            config: config,
            storage: storage
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