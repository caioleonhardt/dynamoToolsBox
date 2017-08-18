(function(window, unsafeWindow, DynamoToolBox) {
    'use strict';

    var inject = (function() {
        'use strict';

        function injectPretify() {
            var element = document.createElement("script");
            element.src = "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js";
            element.defer = true;
            document.getElementsByTagName('head')[0].appendChild(element);
        }

        function _generateCss() {
            var css = document.createElement('style');
            css.type = 'text/css';

            var zoom = '1';
            if (window.innerWidth < 2000) {
                zoom = '0.8';
            }
            if (window.innerWidth <= 1440) {
                zoom = '0.7';
            }

            var styles = '{{css}}';

            if (css.styleSheet) {
                css.styleSheet.cssText = styles;
            } else {
                css.appendChild(document.createTextNode(styles));
            }
            document.getElementsByTagName("head")[0].appendChild(css);
        }

        function _init() {
            _generateCss();
        }

        _init();

        return {
            injectPretify: injectPretify
        }
    })();

    DynamoToolBox.inject = inject;

})(window, unsafeWindow, DynamoToolBox);