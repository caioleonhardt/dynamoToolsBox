(function(window, unsafeWindow, DynamoToolBox) {
    'use strict';

    var global = (function() {
        'use strict';

        function remove() {
            var elem = document.getElementById('dynamoTools');
            if (elem) {
                document.body.removeChild(elem);
            }
        }

        function addComponentBox() {
            var content = DynamoToolBox.render.renderHtmlTags('{{htmlBox}}');
            document.body.innerHTML += content;
        }

        function toggleView() {
            var elem = document.getElementById('contentToolsBox');
            var target = event.target;
            if (elem && target) {
                if (elem.classList.contains('hide')) {
                    DynamoToolBox.storage.setItem('minimizedToolBox', false);
                    elem.classList.remove('hide');
                    target.innerText = '-';
                    return;
                }
                DynamoToolBox.storage.setItem('minimizedToolBox', true);
                target.innerText = '+';
                elem.classList.add('hide');
            }
        }

        function isJDBCPage() {
            var regex = /jdbcbrowser\/executeQuery.jhtml/;
            return regex.test(location.pathname)
        }

        function isNucleusPage() {
            var regex = /\/nucleus\//;
            return regex.test(location.pathname);
        }

        function isRepositoryPage() {
            var regex = /\/nucleus\/.*Repository|.*Catalog/;
            return regex.test(location.pathname);
        }

        function validateHide() {
            if ("true" == DynamoToolBox.storage.getItem('minimizedToolBox')) {
                document.getElementById('contentToolsBox').classList.add('hide');
            }
        }


        return {
            remove: remove,
            toggleView: toggleView,
            isJDBCPage: isJDBCPage,
            isNucleusPage: isNucleusPage,
            isRepositoryPage: isRepositoryPage,
            validateHide: validateHide,
            addComponentBox: addComponentBox
        }
    })();

    DynamoToolBox.global = global;

})(window, unsafeWindow, DynamoToolBox);