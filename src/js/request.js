(function(window, unsafeWindow, DynamoToolBox) {
    'use strict';

    var request = (function() {
        'use strict';

        function invoke(url, params, callback) {
            var http = new XMLHttpRequest();
            var url = url;

            if (params) {
                var stringParam = '?';
                var keySet = Object.keys(params);
                for (var i = 0; i < keySet.length; i++) {
                    if (i > 0) {
                        stringParam += "&";
                    }
                    var currentKey = keySet[i];
                    var auxStr = currentKey + '=' + params[currentKey];
                    stringParam += auxStr;
                }
                url += stringParam
            }

            http.open("POST", url, true);

            http.setRequestHeader("Content-type", "application/json; charset=utf-8");
            http.setRequestHeader("Connection", "close");

            http.onreadystatechange = function() {
                if (http.readyState == 4 && http.status == 200) {
                    if (callback) {
                        callback(http);
                    }
                }
            }
            http.send();
        }

        return {
            invoke: invoke
        }
    })();

    DynamoToolBox.request = request;

})(window, unsafeWindow, DynamoToolBox);