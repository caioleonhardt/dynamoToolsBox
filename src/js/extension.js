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
                    _setCaretPosition(fieldText, message.lastIndexOf('> =') + 1);
                }, 10);
            };
            _createInputElement("queryItem", "Query Item", "Item Descriptor", execute, true);
        }
    }

    function _seePropertieDescritor() {
        var execute = function() {
            var target = event.target;
            var input = target.parentNode.getElementsByTagName('input')[0];
            if (input && input.value) {
                var message = _resolvedPathName() + "?action=seetmpl&itemdesc=" + input.value + "#showProperties";
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
                    var message = _resolvedPathName() + "?action=seeitems&itemdesc=" + input[0].value;
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

        _createSelectOneElement("invokeMethod", "Invoke Method", _loadMethods(), execute);
    }

    function _loadMethods() {
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

    function _addViewConfiguration() {
        var message = _resolvedPathName() + "?propertyName=serviceConfiguration";
        _createLinkElement("viewServiceConfiguration", "View Service Configuration", message);
    }

    function _addViewDefinitionFiles() {
        var message = _resolvedPathName() + "?propertyName=definitionFiles";
        _createLinkElement("viewDefinitionFiles", "View Definition Configuration", message);
    }

    function _addViewComponent() {
        _createLinkElement("viewComponent", "View Component", _resolvedPathName());
    }

    function _addExecuteQuery() {
        var message = "/dyn/admin/atg/dynamo/admin/en/jdbcbrowser/executeQuery.jhtml";
        _createLinkElement("executeQuery", "Execute Query", message);
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

    function _setCaretPosition(elem, caretPos) {
        if (elem !== null) {
            if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            } else {
                elem.focus();
            }
        }
    }

    function _createTitleElement(id, classList, content) {
        var elem = '<h3>' + content + '</h3>';
        _createElement("LI", id, classList, elem, "contentToolsBox");
    }

    function _createTextElement(id, classList, content) {
        var elem = '<p>' + content + '</p>';
        _createElement("LI", id, classList, elem, "contentToolsBox");
    }

    function _createListElement(id, classList, label, content) {
        var elem = '<div>' +
            '<label>' + label + ':&nbsp;</label>' +
            '<div>' + content + '</div>' +
            '</div>';
        _createElement("LI", id, classList, elem, "contentToolsBox");
    }

    function _createInputElement(id, label, placholder, execute, autcomplete) {
        var id1 = 'input' + id + new Date().getTime();
        var elem = '<div>' +
            '<label>' + label + ':&nbsp;</label>' +
            '<input type="text" placeholder="' + placholder + '" autocomplete="' + autcomplete + '" id="' + id1 + '"></input>' +
            '<button id="' + id + '">OK</button>' +
            '</div>';
        _createElement("LI", null, "execute", elem, "contentToolsBox");

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

    function _createLinkElement(id, label, url) {
        var elem = '<div>' +
            '<label>' + label + ':&nbsp;</label>' +
            '<a id="' + id + '" href="' + url + '">GOTO</button>' +
            '</div>';
        _createElement("LI", null, "execute", elem, "contentToolsBox");
    }

    function _createButtonElement(id, label, execute) {
        var elem = '<div>' +
            '<label>' + label + ':&nbsp;</label>' +
            '<button id="' + id + '">OK</button>' +
            '</div>';
        _createElement("LI", null, "execute", elem, "contentToolsBox");

        document.getElementById(id).addEventListener("click", execute);
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
        _createElement("LI", null, "execute", elem, "contentToolsBox");

        document.getElementById(id).addEventListener("change", execute);
    }

    function _createDoubleInputElement(id, label, placholder1, placholder2, execute, autocomplete, removeKeyEvent) {
        var id1 = 'input1' + id + new Date().getTime();
        var id2 = 'input2' + id + new Date().getTime();

        var elem = '<div>' +
            '<label>' + label + ':&nbsp;</label>' +
            '<input type="text" placeholder="' + placholder1 + '" autocomplete="' + autocomplete + '" data-gotosecond="true" id="' + id1 + '"></input>' +
            '<input type="text" placeholder="' + placholder2 + '" id="' + id2 + '"></input>' +
            '<button id="' + id + '">OK</button>' +
            '</div>';
        _createElement("LI", null, "execute", elem, "contentToolsBox");
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

    function _createElement(type, id, classList, content, parentId) {
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

    function _addEventListeners() {
        var removeToolBox = document.getElementById('removeToolBox');
        if (removeToolBox) {
            removeToolBox.addEventListener("click", DynamoToolBox.global.remove);
        }

        var toogleToolBox = document.getElementById('toogleToolBox');
        if (toogleToolBox) {
            toogleToolBox.addEventListener("click", DynamoToolBox.global.toggleView);
        }

        document.body.addEventListener('keypress', (function(e) {
            _invokeKeyEvent(e);
        }));
    }

    function _invokeKeyEvent(event) {
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

    function _executePrettify() {
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


    function _addPrettifyTags() {
        var prettifyInteval = setInterval(function() {
            if (_executePrettify()) {
                _addItemDescriptorEvent();
                setTimeout(function() {
                    _addPropertyEvent();
                }, 500);
                clearInterval(prettifyInteval);
            }
        }, 300);
    }

    var itensDescriptors = [];

    function _initAutoComplete() {
        _loadItemDescriptors();
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

    function _loadItemDescriptors() {
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

    function _addPropertyEvent() {
        var atvList = document.getElementsByClassName('atv');
        if (atvList && !/.*definitionFiles.*/.test(location.search)) {
            for (var i = 0; i < atvList.length; i++) {
                var elem = atvList[i];
                var prevElementText = elem.previousElementSibling.previousElementSibling.innerHTML;
                if ("id" != prevElementText && "item-descriptor" != prevElementText) {
                    elem.addEventListener("click", _populatePropertyQuery);
                }
            }
        }
    }

    function _addItemDescriptorEvent() {
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
                            var htmlContent = '<div class="itemDescActions" data-id="' + replacedId + '" data-itemdesc="' + itemDesc + '">';
                            htmlContent += '<div id="remove_' + replacedId + '">remove</div>';
                            htmlContent += '<div id="update_' + replacedId + '">update</div>';
                            htmlContent += '<div id="print_' + replacedId + '">print</div>';
                            htmlContent += '</div>';

                            elem.innerHTML += htmlContent;
                            document.getElementById('remove_' + replacedId).addEventListener("click", _removeItemDescEvent);
                            document.getElementById('update_' + replacedId).addEventListener("click", __updateItemDescEvent);
                            document.getElementById('print_' + replacedId).addEventListener("click", __printItemDescEvent);
                        }
                    }
                }
            }
        }, 300);
    }

    function _removeItemDescEvent() {
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

    function __updateItemDescEvent() {
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

    function __printItemDescEvent() {
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

    function _populatePropertyQuery() {
        var elem = event.target;
        var value = elem.nextElementSibling.nextElementSibling;
        if (value) {
            var fieldText = document.getElementsByTagName('textarea')[0];
            if (fieldText) {
                var message = fieldText.value;
                message += '\n';
                var regularizedString = _regularizeString(value.innerText);
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

    function _regularizeString(value) {
        return value.replace('<![CDATA[', '').replace(']]>', '');
    }

    function _resolvedPathName() {
        return location.pathname.endsWith('/') ? location.pathname : location.pathname + "/";
    }

    function _validateLinks() {
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

    function _addFavoriteUrls() {
        var id = 'favoriteLinks';
        _createElement("LI", id, "favorites", '', "contentToolsBox");
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
        var method = [{
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

        _createSelectOneElement("switchDataSource", "Switch Data Source", method, execute);
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
            _seePropertieDescritor();
            _addPrettifyTags();
            _initAutoComplete();
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
        _addEventListeners();
        _addFavoriteUrls();
        _addCopyrightBox();
        _validateLinks();

        if (window.console && console.info) {
            console.info(CONSTANTS.welcomeMessage);
        }
    }

    _init();
})(window, unsafeWindow, DynamoToolBox);