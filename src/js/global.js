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

        function isDefinitionFilesPage() {
            var regex = /.*definitionFiles.*/;
            return regex.test(location.search)
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

        function resolvedPathName() {
            return location.pathname.endsWith('/') ? location.pathname : location.pathname + "/";
        }

        function createElement(type, id, classList, content, parentId) {
            var parentNode = document.body;
            if (parentId) {
                parentNode = document.getElementById(parentId);
            }

            var elem = document.createElement(type);
            if (id) {
                elem.setAttribute('id', id);
            }
            elem.setAttribute('class', classList);
            elem.innerHTML = content;
            parentNode.appendChild(elem);
        }

        function setCaretPosition(elem, caretPos) {
            if (elem !== null) {
                if (elem.selectionStart) {
                    elem.focus();
                    elem.setSelectionRange(caretPos, caretPos);
                } else {
                    elem.focus();
                }
            }
        }

        function executePrettify() {
            var init = false;
            var pres = document.getElementsByTagName('pre');
            if (pres) {
                for (var i = 0; i < pres.length; i++) {
                    pres[i].classList.add('prettyprint');
                }
                init = true;
            }

            var code = document.getElementsByTagName('code');
            if (code) {
                for (var j = 0; j < code.length; j++) {
                    code[j].classList.add('language-xml');
                }
            }
            if (init && typeof PR != 'undefined') {
                PR.prettyPrint();
            }
            return init;
        }

        function validateLinks() {
            if (/cmpn-search.jhtml/.test(location.pathname)) {
                var linkList = document.getElementsByTagName('a');
                if (linkList) {
                    for (var i = 0; i < linkList.length; i++) {
                        var elem = linkList[i];
                        if (/\/\//.test(elem.getAttribute('href'))) {
                            elem.setAttribute('href', elem.getAttribute('href').replace('//', '/'));
                        }
                    }
                }
            }
        }

        function regularizeString(value) {
            return value.replace('<![CDATA[', '').replace(']]>', '');
        }

        function loadMethods() {
            var titleElements = document.getElementsByTagName('h1');
            var methodsArr = [];
            if (titleElements) {
                for (var i = 0; i < titleElements.length; i++) {
                    if (titleElements[i].innerText == 'Methods') {
                        var methodsTable = titleElements[i].nextElementSibling;
                        if (methodsTable) {
                            var lines = methodsTable.getElementsByTagName('tr');
                            if (lines) {
                                for (var j = 0; j < lines.length; j++) {
                                    var td = lines[j].getElementsByTagName('td')[0];
                                    if (td && td.getElementsByTagName('a')) {
                                        var link = td.getElementsByTagName('a')[0];
                                        var method = {
                                            "value": link.getAttribute('href'),
                                            "text": link.innerText,
                                        };
                                        methodsArr.push(method);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return methodsArr;
        }

        var itensDescriptors = [];

        function loadItemDescriptors() {
            var ancor = document.getElementsByName('listItemDescriptors')[0];
            if (ancor) {
                var table = ancor.nextElementSibling;
                var ths = table.getElementsByTagName('th');
                if (ths) {
                    for (var i = 0; i < ths.length; i++) {
                        if (i > 3) {
                            itensDescriptors.push(ths[i].innerHTML);
                        }
                    }
                }
            }
        }

        return {
            remove: remove,
            toggleView: toggleView,
            isJDBCPage: isJDBCPage,
            isNucleusPage: isNucleusPage,
            isRepositoryPage: isRepositoryPage,
            validateHide: validateHide,
            addComponentBox: addComponentBox,
            resolvedPathName: resolvedPathName,
            createElement: createElement,
            setCaretPosition: setCaretPosition,
            executePrettify: executePrettify,
            validateLinks: validateLinks,
            regularizeString: regularizeString,
            isDefinitionFilesPage: isDefinitionFilesPage,
            loadMethods: loadMethods,
            loadItemDescriptors: loadItemDescriptors,
            itensDescriptors: itensDescriptors
        }
    })();

    DynamoToolBox.global = global;

})(window, unsafeWindow, DynamoToolBox);