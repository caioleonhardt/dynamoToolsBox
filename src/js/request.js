(function(window, unsafeWindow, DynamoToolBox) {
    'use strict';

    var request = (function() {
        'use strict';

        function invoke(url, params, callback) {
            var http = new XMLHttpRequest();
            var url = url;
            url += params

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