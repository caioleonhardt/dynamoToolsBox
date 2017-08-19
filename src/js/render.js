(function(window, unsafeWindow, DynamoToolBox) {
    'use strict';

    var render = (function() {
        'use strict';

        function renderHtmlTags(html, data) {
            var regex = /\{\{([a-zA-Z1-9\.]*)\}\}/g;
            var str = html;
            var replacedString = str;
            var match;

            while ((match = regex.exec(str)) !== null) {
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                if (match[0]) {
                    var replaceText = match[0];
                    try {
                        var replaceValue = eval(match[1]);
                        if (!replaceValue) {
                            replaceValue = "";
                        }
                        replacedString = replacedString.replace(replaceText, replaceValue);
                    } catch (e) {
                        replacedString = replacedString.replace(replaceText, '');
                    }
                }
            }
            return replacedString;
        }

        return {
            renderHtmlTags: renderHtmlTags
        }
    })();

    DynamoToolBox.render = render;

})(window, unsafeWindow, DynamoToolBox);