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


        var datasources = [{
                "value": "/atg/dynamo/service/jdbc/JTDataSource",
                "text": "CORE",
            },
            {
                "value": "/atg/dynamo/service/jdbc/SwitchingDataSource",
                "text": "SWITCH",
            },
            {
                "value": "/atg/dynamo/service/jdbc/SwitchingDataSourceA",
                "text": "CATALOG_A",
            },
            {
                "value": "/atg/dynamo/service/jdbc/SwitchingDataSourceB",
                "text": "CATALOG_B",
            }
        ];

        _init();

        return {
            config: config,
            storage: storage,
            datasources: datasources
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
            var content = DynamoToolBox.render.renderHtmlTags('<div id="dynamoTools" class="dynamoToolsBox"><h3>{{DynamoToolBox.config.appName}}<span class="navigation remove" id="removeToolBox">X</span><span class="navigation toogle" id="toogleToolBox">-</span></h3><div><ul id="contentToolsBox"></ul></div></div>');
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

            var styles = '.dynamoToolsBox{position:fixed;top:0;right:-1px;width:500px;background-color:#545454;border:3px solid #545454;overflow:hidden;zoom:' + zoom + '}.dynamoToolsBox h3{color:#fff;text-align:center;margin:10px}.dynamoToolsBox .navigation{position:absolute;top:0;background-color:#696969;cursor:pointer;width:41px;height:41px;text-align:center;vertical-align:middle;line-height:41px}.dynamoToolsBox .remove{right:0}.dynamoToolsBox .toogle{right:42px}.dynamoToolsBox ul{list-style:none;margin:0;padding:0}.dynamoToolsBox li{border-bottom:2px solid #dcdcdc;background-color:#fdfdfd;display:inline-block;width:100%;padding:10px}.dynamoToolsBox .hide{display:none}.dynamoToolsBox .info label{float:left;font-weight:700}.dynamoToolsBox .info div{float:left}.dynamoToolsBox .green{background-color:#abffa5}.dynamoToolsBox .red{background-color:red}.dynamoToolsBox .info h3{color:#2d2d2d;font-size:20px;margin:0}.dynamoToolsBox .execute label{float:left;font-weight:700}.dynamoToolsBox .execute div{float:left}pre.prettyprint{padding:0!important;border:0!important}.dynamoToolsBox .copyright p{padding:0;font-size:11px;margin:0;text-align:right;padding-right:20px}.atv{cursor:pointer}.dynamoToolsBox .autocomplete{background-color:#eaeaea;width:95%;border:1px solid #c1c1c1;border-top:0;overflow:hidden;display:none}.dynamoToolsBox .autocomplete.visible{display:block}.dynamoToolsBox .autocomplete span{width:100%;display:inline-block;padding:3px}.dynamoToolsBox .autocomplete span.active{background-color:#fff;color:#009}.itemDescActions{display:none;position:absolute;background:#fff;border:1px solid #898989;width:106px;left:79px;text-transform:capitalize;cursor:pointer}.itemDescActions div{padding:3px;color:#000}.itemDescActions div:hover{background-color:#f3f3f3}.itenDescAutoComplete:hover .itemDescActions{display:block}.dynamoToolsBox .favorites{background-color:#ececec;padding-top:0}.dynamoToolsBox .favorites a{width:100%;display:inline-block;padding:5px 0}';

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
(function(window, unsafeWindow, DynamoToolBox) {
    'use strict';

    var autocomplete = (function() {
        'use strict';

        var itensDescriptors = DynamoToolBox.global.itensDescriptors;

        function initAutoComplete() {
            DynamoToolBox.global.loadItemDescriptors();
            _addSelectAutoCompleteEvent();
            var box = document.getElementById('dynamoTools');
            var inputs = box.getElementsByTagName('input');
            document.body.addEventListener('click', _hideAutoComplete);
            if (inputs) {
                for (var i = 0; i < inputs.length; i++) {
                    var elem = inputs[i];
                    if ("true" == elem.getAttribute('autocomplete')) {
                        elem.addEventListener("keyup", _autoCompleteEvent);
                        elem.addEventListener("focus", _autoCompleteEvent);
                    }

                }
            }
        }

        var _hasAutocompleteInView = false;

        function _autoCompleteEvent() {
            var target = event.target;
            var value = target.value;
            if (value.length == 0) {
                return;
            }

            var parentNode = target.parentNode;
            var targetId = target.getAttribute('id');
            var id = "auto" + targetId;
            var elementExists = true;
            var elem = document.getElementById(id);
            if (!elem) {
                elementExists = false;
                elem = document.createElement('DIV');
                if (id) {
                    elem.setAttribute('id', id);
                }
                elem.setAttribute('targetId', targetId);
                elem.setAttribute('class', 'autocomplete js-autocomplete visible');
            }

            var content = '';
            for (var i in itensDescriptors) {
                if (itensDescriptors[i].startsWith(value)) {
                    content += '<span>' + itensDescriptors[i] + '</span>';
                }
            }
            elem.innerHTML = content;
            _hasAutocompleteInView = true;
            if (!elementExists) {
                parentNode.appendChild(elem);
                return;
            }
            elem.classList.add('visible');
        }

        function _addSelectAutoCompleteEvent() {
            document.body.addEventListener("keyup", function(e) {
                if (_hasAutocompleteInView) {
                    _navigateAtAutoComplete(e);
                }
            });
        }

        var _currentActiveList = 0;
        var _spanLength = 0;
        var _forceHide = false;

        function _navigateAtAutoComplete(e) {
            var isArrowKey = false;
            var isEnter = false;
            if (e.keyCode == '38') {
                if (_currentActiveList > 0) {
                    _currentActiveList--;
                }
                isArrowKey = true;
            }
            if (e.keyCode == '40') {
                if (_currentActiveList < _spanLength - 1) {
                    _currentActiveList++;
                }
                isArrowKey = true;
            }
            if (e.keyCode == '13') {
                isEnter = true;
            }
            if (e.keyCode == '9') {
                _forceHide = true;
                _hideAutoComplete();
            }
            if (isArrowKey || isEnter) {
                var elements = document.getElementsByClassName('js-autocomplete');
                if (elements) {
                    for (var i = 0; i < elements.length; i++) {
                        var elem = elements[i];
                        if (elem.classList.contains('visible')) {
                            var itens = elem.getElementsByTagName('span');
                            _spanLength = itens.length;
                            if (itens) {
                                if (isEnter) {
                                    var targetId = elem.getAttribute('targetId');
                                    var input = document.getElementById(targetId);
                                    if (input) {
                                        var active = itens[_currentActiveList];
                                        if (active) {
                                            input.value = active.innerText;
                                            _forceHide = true;
                                            _hideAutoComplete();
                                        }
                                    }
                                    return;
                                }
                                for (var j = 0; j < itens.length; j++) {
                                    var current = itens[j];
                                    current.classList.remove('active');
                                    if (j == _currentActiveList) {
                                        current.classList.add('active');
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function _hideAutoComplete() {
            var elements = document.getElementsByClassName('js-autocomplete');
            if (elements) {
                for (var i = 0; i < elements.length; i++) {
                    var elem = elements[i];
                    if (elem) {
                        var target = event.target;
                        if (!_forceHide && target && target.getAttribute('id') == elem.getAttribute('targetId')) {
                            break;
                        }
                        _forceHide = false;
                        elem.classList.remove('visible');
                        _hasAutocompleteInView = false;
                        _currentActiveList = 0;
                        _spanLength = 0;
                    }
                }
            }
        }

        return {
            initAutoComplete: initAutoComplete
        }
    })();

    DynamoToolBox.autocomplete = autocomplete;

})(window, unsafeWindow, DynamoToolBox);
(function(window, unsafeWindow, DynamoToolBox) {
    'use strict';

    var event = (function() {
        'use strict';

        function addEventListeners() {
            var removeToolBox = document.getElementById('removeToolBox');
            if (removeToolBox) {
                removeToolBox.addEventListener("click", DynamoToolBox.global.remove);
            }

            var toogleToolBox = document.getElementById('toogleToolBox');
            if (toogleToolBox) {
                toogleToolBox.addEventListener("click", DynamoToolBox.global.toggleView);
            }

            document.body.addEventListener('keypress', (function(e) {
                DynamoToolBox.event.invokeKeyEvent(e);
            }));
        }

        function invokeKeyEvent(event) {
            if (event && event.ctrlKey) {
                if (event.shiftKey) {
                    if (event.keyCode == 6) {
                        var elem = document.getElementById('searchMethod');
                        if (elem) {
                            var parent = elem.parentElement;
                            if (parent) {
                                var input = parent.getElementsByTagName('input')[0].focus();
                                if (input) {
                                    input.focus();
                                }
                            }

                        }
                    }
                }
                if (event.keyCode == 10 && !DynamoToolBox.global.isJDBCPage()) {
                    var textArea = document.getElementsByTagName('textarea')[0];
                    if (textArea) {
                        var parentNode = textArea.parentElement.parentElement;
                        if (parentNode.nodeName == 'FORM') {
                            parentNode.submit();
                        }
                    }
                }
            }
        }

        function addItemDescriptorEvent() {
            var itemDescAutoCompleteInteval = setInterval(function() {
                var atvList = document.getElementsByClassName('atn');
                if (atvList[0]) {
                    clearInterval(itemDescAutoCompleteInteval);
                    for (var i = 0; i < atvList.length; i++) {
                        var elem = atvList[i];
                        if ("item-descriptor" == elem.innerText) {
                            var itemDesc = elem.nextElementSibling.nextElementSibling.innerHTML.replace(/\"/g, '');
                            var tagId = elem.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling;
                            if ("id" == tagId.innerText) {
                                var id = tagId.nextElementSibling.nextElementSibling.innerText;
                                var replacedId = id.replace(/\"/g, '');
                                elem.classList.add('itenDescAutoComplete');

                                var data = {
                                    replacedId: replacedId,
                                    itemDesc: itemDesc
                                }
                                var htmlContent = DynamoToolBox.render.renderHtmlTags('<div class="itemDescActions" data-id="{{data.replacedId}}" data-itemdesc="{{data.itemDesc}}"><div id="remove_{{data.replacedId}}">remove</div><div id="update_{{data.replacedId}}">update</div><div id="print_{{data.replacedId}}">print</div></div>', data);;

                                elem.innerHTML += htmlContent;
                                document.getElementById('remove_' + replacedId).addEventListener("click", DynamoToolBox.event.removeItemDescEvent);
                                document.getElementById('update_' + replacedId).addEventListener("click", DynamoToolBox.event.updateItemDescEvent);
                                document.getElementById('print_' + replacedId).addEventListener("click", DynamoToolBox.event.printItemDescEvent);
                            }
                        }
                    }
                }
            }, 300);
        }

        function removeItemDescEvent(event) {
            var target = event.target;
            var parent = target.parentElement;
            var dataId = parent.getAttribute('data-id');
            var dataItemDesc = parent.getAttribute('data-itemdesc');
            var removeItemText = '<remove-item item-descriptor="' + dataItemDesc + '" id="' + dataId + '"/>';
            var fieldText = document.getElementsByTagName('textarea')[0];
            if (fieldText) {
                var message = '\n';
                message += removeItemText;
                fieldText.value += message;
                fieldText.focus();
            }
        }

        function updateItemDescEvent(event) {
            var target = event.target;
            var parent = target.parentElement;
            var dataId = parent.getAttribute('data-id');
            var dataItemDesc = parent.getAttribute('data-itemdesc');
            var updateItemText = '<update-item item-descriptor="' + dataItemDesc + '" id="' + dataId + '">';
            updateItemText += '\n\t<set-property name=""><![CDATA[]]></set-property>';
            updateItemText += '\n</update-item>';

            var fieldText = document.getElementsByTagName('textarea')[0];
            if (fieldText) {
                var message = '\n';
                message += updateItemText;
                fieldText.value += message;
                fieldText.focus();
            }
        }

        function printItemDescEvent(event) {
            var target = event.target;
            var parent = target.parentElement;
            var dataId = parent.getAttribute('data-id');
            var dataItemDesc = parent.getAttribute('data-itemdesc');
            var printItemText = '<print-item item-descriptor="' + dataItemDesc + '" id="' + dataId + '"/>';
            var fieldText = document.getElementsByTagName('textarea')[0];
            if (fieldText) {
                var message = '\n';
                message += printItemText;
                fieldText.value += message;
                fieldText.focus();
            }
        }

        function addPropertyEvent() {
            var atvList = document.getElementsByClassName('atv');
            if (atvList && !DynamoToolBox.global.isDefinitionFilesPage()) {
                for (var i = 0; i < atvList.length; i++) {
                    var elem = atvList[i];
                    var prevElementText = elem.previousElementSibling.previousElementSibling.innerHTML;
                    if ("id" != prevElementText && "item-descriptor" != prevElementText) {
                        elem.addEventListener("click", DynamoToolBox.event.populatePropertyQuery);
                    }
                }
            }
        }

        function populatePropertyQuery(event) {
            var elem = event.target;
            var value = elem.nextElementSibling.nextElementSibling;
            if (value) {
                var fieldText = document.getElementsByTagName('textarea')[0];
                if (fieldText) {
                    var message = fieldText.value;
                    message += '\n';
                    var regularizedString = DynamoToolBox.global.regularizeString(value.innerText);
                    if (regularizedString.indexOf(',') > 0) {
                        var splittedString = regularizedString.split(',');
                        for (var i = 0; i < splittedString.length; i++) {
                            message += '<print-item item-descriptor=' + elem.innerText + ' id="' + splittedString[i] + '"/>';
                            message += '\n';
                        }

                    } else {
                        message += '<print-item item-descriptor=' + elem.innerText + ' id="' + regularizedString + '"/>';
                    }
                    fieldText.value = message;
                    fieldText.focus();
                }
            }
        }

        return {
            addEventListeners: addEventListeners,
            invokeKeyEvent: invokeKeyEvent,
            addItemDescriptorEvent: addItemDescriptorEvent,
            removeItemDescEvent: removeItemDescEvent,
            updateItemDescEvent: updateItemDescEvent,
            printItemDescEvent: printItemDescEvent,
            addPropertyEvent: addPropertyEvent,
            populatePropertyQuery: populatePropertyQuery,
        }
    })();

    DynamoToolBox.event = event;

})(window, unsafeWindow, DynamoToolBox);
(function(window, unsafeWindow, DynamoToolBox) {
    'use strict';

    function _addEnvironmentInfo() {
        var isProduction = false;
        _createTitleElement("whereAmI", "info green", '');
        var count = 0;
        var mapedHostsInteval = setInterval(function() {
            count++;
            if (unsafeWindow.mappedHosts && unsafeWindow.mappedHosts.size > 0) {
                var content = window.location.host;
                if (unsafeWindow.mappedHosts) {
                    if (unsafeWindow.mappedHosts.get(window.location.host)) {
                        content = unsafeWindow.mappedHosts.get(window.location.host).name;
                        isProduction = unsafeWindow.mappedHosts.get(window.location.host).production;
                    }
                }
                if (document.getElementById('whereAmI')) {
                    document.getElementById('whereAmI').innerHTML = '<h3>' + content + '</h3>';
                    if (isProduction) {
                        document.getElementById('whereAmI').classList.remove('green');
                        document.getElementById('whereAmI').classList.add('red');
                    }
                }
                clearInterval(mapedHostsInteval);
            }
            if (count > 10) {
                clearInterval(mapedHostsInteval);
            }
        }, 300);

    }

    function _addCopyrightBox() {
        var content = DynamoToolBox.config.copyright;
        _createTextElement("copyright", "info copyright", content);
    }

    function _addDescTable() {
        var fieldText = document.getElementsByTagName('textarea')[0];
        if (fieldText) {
            var execute = function() {
                var target = event.target;
                var input = target.parentNode.getElementsByTagName('input')[0];
                if (input && input.value) {
                    var message = "SELECT table_name, column_name, data_type FROM ALL_TAB_COLUMNS WHERE TABLE_NAME like '" + input.value.toUpperCase() + "'";
                    fieldText.value = message;
                    fieldText.focus();
                }
            };
            _createInputElement("descTable", "Desc table", "Table Name", execute, false);
        }
    }

    function _addPrintItem() {
        var fieldText = document.getElementsByTagName('textarea')[0];
        if (fieldText) {
            var execute = function() {
                var target = event.target;
                var input = target.parentNode.getElementsByTagName('input');
                if (input[0] && input[0].value && input[1] && input[1].value) {
                    var message = fieldText.value;
                    message += '\n';
                    message += '<print-item item-descriptor="' + input[0].value + '" id="' + input[1].value + '"/>';
                    fieldText.value = message;
                    fieldText.focus();
                }
            };
            _createDoubleInputElement("printItem", "Print Item", "Item Descriptor", "Value", execute, true);
        }
    }

    function _addQueryItem() {
        var fieldText = document.getElementsByTagName('textarea')[0];
        if (fieldText) {
            var execute = function() {
                var target = event.target;
                var input = target.parentNode.getElementsByTagName('input')[0];
                if (input && input.value) {
                    var message = fieldText.value;
                    message += '\n';
                    message += '<query-items item-descriptor="' + input.value + '"> = ""</query-items>';
                    fieldText.value = message;
                }
                setTimeout(function() {
                    DynamoToolBox.global.setCaretPosition(fieldText, message.lastIndexOf('> =') + 1);
                }, 10);
            };
            _createInputElement("queryItem", "Query Item", "Item Descriptor", execute, true);
        }
    }

    function _addSeePropertieDescritor() {
        var execute = function() {
            var target = event.target;
            var input = target.parentNode.getElementsByTagName('input')[0];
            if (input && input.value) {
                var message = DynamoToolBox.global.resolvedPathName() + "?action=seetmpl&itemdesc=" + input.value + "#showProperties";
                window.location = message;
            }
        };
        _createInputElement("setPropertyDescriptor", "See property description", "Item Descriptor", execute, true);
    }

    function _addSeeItem() {
        var fieldText = document.getElementsByTagName('textarea')[0];
        if (fieldText) {
            var execute = function() {
                var target = event.target;
                var input = target.parentNode.getElementsByTagName('input');
                if (input[0] && input[0].value) {
                    var message = DynamoToolBox.global.resolvedPathName() + "?action=seeitems&itemdesc=" + input[0].value;
                    if (input[1] && input[1].value) {
                        message += "&itemid=" + input[1].value;
                    }
                    message += "#seeItems";
                    window.location = message;
                }
            };
            _createDoubleInputElement("seeItem", "See Item", "Item Descriptor", "Value", execute, true, true);
        }
    }

    function _addInvokeMethodItem() {
        var execute = function(event) {
            var target = event.target;
            if (target && target.value) {
                location = target.value;
            }
        };
        _createSelectOneElement("invokeMethod", "Invoke Method", DynamoToolBox.global.loadMethods(), execute);
    }

    function _addViewConfiguration() {
        var data = {
            id: "viewServiceConfiguration",
            label: "View Service Configuration",
            url: DynamoToolBox.global.resolvedPathName() + "?propertyName=serviceConfiguration"
        }
        var message = DynamoToolBox.render.renderHtmlTags('<div><label>{{data.label}}:&nbsp;</label><a id="{{data.id}}" href="{{data.url}}">GOTO</a></div>', data);

        DynamoToolBox.global.createElement("LI", null, "execute", message, "contentToolsBox");
    }

    function _addViewDefinitionFiles() {
        var data = {
            id: "viewDefinitionFiles",
            label: "View Service Definition",
            url: DynamoToolBox.global.resolvedPathName() + "?propertyName=definitionFiles"
        }
        var message = DynamoToolBox.render.renderHtmlTags('<div><label>{{data.label}}:&nbsp;</label><a id="{{data.id}}" href="{{data.url}}">GOTO</a></div>', data);

        DynamoToolBox.global.createElement("LI", null, "execute", message, "contentToolsBox");
    }

    function _addViewComponent() {
        var data = {
            id: "viewComponent",
            label: "View  Component",
            url: DynamoToolBox.global.resolvedPathName()
        }
        var message = DynamoToolBox.render.renderHtmlTags('<div><label>{{data.label}}:&nbsp;</label><a id="{{data.id}}" href="{{data.url}}">GOTO</a></div>', data);

        DynamoToolBox.global.createElement("LI", null, "execute", message, "contentToolsBox");
    }

    function _addExecuteQuery() {
        var data = {
            id: "executeQuery",
            label: "Execute  Query",
            url: "/dyn/admin/atg/dynamo/admin/en/jdbcbrowser/executeQuery.jhtml"
        }
        var message = DynamoToolBox.render.renderHtmlTags('<div><label>{{data.label}}:&nbsp;</label><a id="{{data.id}}" href="{{data.url}}">GOTO</a></div>', data);
        DynamoToolBox.global.createElement("LI", null, "execute", message, "contentToolsBox");
    }

    function _addSearch() {
        var execute = function() {
            var target = event.target;
            var input = target.parentNode.getElementsByTagName('input')[0];
            if (input && input.value) {
                var message = "/dyn/admin/atg/dynamo/admin/en/cmpn-search.jhtml?query=" + input.value;
                window.location = message;
            }

        };
        _createInputElement("searchMethod", "Search Component", "Query", execute, false);
    }

    function _addPrettifyTags() {
        var prettifyInteval = setInterval(function() {
            if (DynamoToolBox.global.executePrettify()) {
                DynamoToolBox.event.addItemDescriptorEvent();
                setTimeout(function() {
                    DynamoToolBox.event.addPropertyEvent();
                }, 500);
                clearInterval(prettifyInteval);
            }
        }, 300);
    }

    function _addFavoriteUrls() {
        var id = 'favoriteLinks';
        DynamoToolBox.global.createElement("LI", id, "favorites", '', "contentToolsBox");
        var count = 0;
        var favoritesInteval = setInterval(function() {
            count++;
            if (unsafeWindow.favorites) {
                clearInterval(favoritesInteval);
                var message = '';
                for (var i = 0; i < unsafeWindow.favorites.length; i++) {
                    var link = unsafeWindow.favorites[i];
                    message += '<a href="/dyn/admin/nucleus' + link + '">' + link + '</a>';
                }
                document.getElementById(id).innerHTML = message;
            }
            if (count > 10) {
                clearInterval(favoritesInteval);
            }
        }, 300);
    }


    function _addSwitchDataSource() {
        var execute = function(event) {
            var input = event.target;
            if (input && input.value) {
                var url = "/dyn/admin/nucleus/atg/dynamo/admin/jdbcbrowser/ConnectionPoolPointer/";
                var params = {
                    "propertyName": "connectionPool",
                    "newValue": input.value,
                    "change": "Change Value"
                }
                DynamoToolBox.request.invoke(url, params, null);
            }
        };

        var datasources = DynamoToolBox.datasources;

        var count = 0;
        var switchDataSourceInteval = setInterval(function() {
            count++;
            if (unsafeWindow.datasources) {
                clearInterval(switchDataSourceInteval);
                if (unsafeWindow.datasources && unsafeWindow.datasources.length > 0) {
                    for (var i = 0; i < unsafeWindow.datasources.length; i++) {
                        var current = unsafeWindow.datasources[i];
                        var html = '<option value="' + current.value + '">' + current.text + '</option>';
                        document.getElementById('switchDataSource').innerHTML += html;
                    }
                }
            }
            if (count > 10) {
                clearInterval(switchDataSourceInteval);
            }
        }, 300);

        _createSelectOneElement("switchDataSource", "Switch Data Source", datasources, execute);
    }

    function _createTitleElement(id, classList, content) {
        var elem = '<h3>' + content + '</h3>';
        DynamoToolBox.global.createElement("LI", id, classList, elem, "contentToolsBox");
    }

    function _createTextElement(id, classList, content) {
        var elem = '<p>' + content + '</p>';
        DynamoToolBox.global.createElement("LI", id, classList, elem, "contentToolsBox");
    }

    function _createInputElement(id, label, placeholder, execute, autcomplete) {
        var data = {
            id: id,
            label: label,
            placeholder: placeholder,
            autcomplete: autcomplete,
            inputId: 'input' + id + new Date().getTime()
        }
        var elem = DynamoToolBox.render.renderHtmlTags('<div><label>{{data.label}}&nbsp;</label><input type="text" placeholder="{{data.placeholder}}" autocomplete="{{data.autcomplete}}" id="{{data.inputId}}"><button id="{{data.id}}">OK</button></div>', data);

        DynamoToolBox.global.createElement("LI", null, "execute", elem, "contentToolsBox");

        document.getElementById(id).addEventListener("click", execute);
        var input = document.getElementById(id).parentNode.getElementsByTagName('input')[0];
        if (input) {
            input.addEventListener("keydown", function(e) {
                var keyCode = e.keyCode;
                if (keyCode == 13) {
                    setTimeout(function() {
                        document.getElementById(id).click();
                    }, 300);
                }
            });
        }
    }

    function _createSelectOneElement(id, label, list, execute) {
        if (list.length < 1) {
            return;
        }

        var elem = '<div>' +
            '<label>' + label + ':&nbsp;</label>' +
            '<select id="' + id + '">' +
            '<option value="">Selecione</option>';
        if (list) {
            for (var i = 0; i < list.length; i++) {
                elem += '<option value="' + list[i].value + '">' + list[i].text + '</option>';
            }
        }
        elem += '</select></div>';
        DynamoToolBox.global.createElement("LI", null, "execute", elem, "contentToolsBox");

        document.getElementById(id).addEventListener("change", execute);
    }

    function _createDoubleInputElement(id, label, placeholder1, placeholder2, execute, autocomplete, removeKeyEvent) {
        var data = {
            id: id,
            label: label,
            placeholder1: placeholder1,
            placeholder2: placeholder2,
            autocomplete: autocomplete,
            inputId1: 'input1' + id + new Date().getTime(),
            inputId2: 'input2' + id + new Date().getTime()
        }
        var elem = DynamoToolBox.render.renderHtmlTags('<div><label>{{data.label}}&nbsp;</label><input type="text" placeholder="{{data.placeholder1}}" autocomplete="{{data.autocomplete}}" id="{{data.inputId1}}"><input type="text" placeholder="{{data.placeholder2}}" id="{{data.inputId2}}"><button id="{{data.id}}">OK</button></div>', data);

        DynamoToolBox.global.createElement("LI", null, "execute", elem, "contentToolsBox");
        document.getElementById(id).addEventListener("click", execute);

        var inputs = document.getElementById(id).parentNode.getElementsByTagName('input');
        if (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                if (!removeKeyEvent) {
                    inputs[i].addEventListener("keydown", function(e) {
                        var keyCode = e.keyCode;
                        if (keyCode == 13) {
                            setTimeout(function() {
                                document.getElementById(id).click();
                            }, 100);
                        }
                    });
                }
            }
        }
    }

    function _initJDBCPage() {
        if (DynamoToolBox.global.isJDBCPage()) {
            DynamoToolBox.inject.injectPretify();
            _addDescTable();
            _addSwitchDataSource();
        }
    }

    function _initNucluesPage() {
        if (DynamoToolBox.global.isNucleusPage()) {
            _addViewComponent();
            _addViewConfiguration();
            _addInvokeMethodItem();
        }
        if (DynamoToolBox.global.isRepositoryPage()) {
            DynamoToolBox.inject.injectPretify();
            _addViewDefinitionFiles();
            _addPrintItem();
            _addQueryItem();
            _addSeeItem();
            _addSeePropertieDescritor();
            _addPrettifyTags();
            DynamoToolBox.autocomplete.initAutoComplete();
        }
    }

    function _init() {
        DynamoToolBox.global.remove();
        DynamoToolBox.global.addComponentBox();
        DynamoToolBox.global.validateHide();
        _addEnvironmentInfo();
        _addSearch();
        _addExecuteQuery();
        _initJDBCPage();
        _initNucluesPage();
        DynamoToolBox.event.addEventListeners();
        _addFavoriteUrls();
        _addCopyrightBox();
        DynamoToolBox.global.validateLinks();

        if (window.console && console.info) {
            console.info(CONSTANTS.welcomeMessage);
        }
    }

    _init();
})(window, unsafeWindow, DynamoToolBox);