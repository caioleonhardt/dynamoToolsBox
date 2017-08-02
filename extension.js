var DynamoTools = (function() {
    'use strict';

    var config = {
        appName: "Dynamo Tools Box",
        copyright: "Created by Matheus Barbieri - version 0.1.3"
    };

    function _injectPretify() {
        var element = document.createElement("script");
        element.src = "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js"
        element.defer = true;
        document.getElementsByTagName('head')[0].appendChild(element);
    }

    function _remove() {
        var elem = document.getElementById('dynamoTools');
        if (elem) {
            document.body.removeChild(elem);
        }
    }

    function _toggleView() {
        var elem = document.getElementById('contentToolsBox');
        var target = event.target;
        if (elem && target) {
            if (elem.classList.contains('hide')) {
                elem.classList.remove('hide');
                target.innerText = '-';
                return;
            }
            target.innerText = '+';
            elem.classList.add('hide');
        }
    }

    function _addComponentBox() {
        var content = '<h3>' + config.appName +
            '<span class="navigation remove" id="removeToolBox">X</span>' +
            '<span class="navigation toogle" id="toogleToolBox">-</span>' +
            '</h3><div><ul id="contentToolsBox"></ul></div>';

        _createElement("DIV", "dynamoTools", "dynamoToolsBox", content, null);
    }

    function _addEnvironmentInfo() {
        if (window.mappedHosts) {
            var content = window.mappedHosts.get(window.location.host) || window.location.host;
        } else {
            var content = window.location.host;
        }

        _createTitleElement("whereAmI", "info green", content);
        var count = 0;
        var mapedHostsInteval = setInterval(function() {
            count++;
            if (window.mappedHosts && window.mappedHosts.size > 0) {
                var content = window.mappedHosts.get(window.location.host) || window.location.host;
                if (document.getElementById('whereAmI')) {
                    document.getElementById('whereAmI').innerHTML = '<h3>' + content + '</h3>';
                }
                clearInterval(mapedHostsInteval);
            }
            if (count > 10) {
                clearInterval(mapedHostsInteval);
            }
        }, 300);

    }

    function _addCopyrightBox() {
        var content = config.copyright;
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
        }
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
            _createDoubleInputElement("seeItem", "See Item", "Item Descriptor", "Value", execute, true);
        }
    }

    function _addInvokeMethodItem() {
        var execute = function() {
            var target = event.target;
            var input = target.parentNode.getElementsByTagName('input');
            if (input[0] && input[0].value) {
                var message = _resolvedPathName() + "?shouldInvokeMethod=" + input[0].value;
                window.location = message;
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
                                    }
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
                    }, 100);
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
            for (var i in list) {
                elem += '<option value="' + list[i].value + '">' + list[i].text + '</option>';
            }
        }
        elem += '</select></div>';
        _createElement("LI", null, "execute", elem, "contentToolsBox");

        document.getElementById(id).addEventListener("change", function(event) {
            var target = event.target;
            if (target && target.value) {
                location = target.value;
            }
        });
    }

    function _createDoubleInputElement(id, label, placholder1, placholder2, execute, autocomplete) {
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
            removeToolBox.addEventListener("click", _remove);
        }

        var toogleToolBox = document.getElementById('toogleToolBox');
        if (toogleToolBox) {
            toogleToolBox.addEventListener("click", _toggleView);
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
            for (var i = 0; i < code.length; i++) {
                code[i].classList.add('language-xml');
            }
        }
        if (init && window.PR) {
            window.PR.prettyPrint();
        }
        return init;
    }


    function _addPrettifyTags() {
        var prettifyInteval = setInterval(function() {
            if (_executePrettify()) {
                clearInterval(prettifyInteval);
                _addPropertyEvent();
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
        var ancor = document.getElementsByName('listItemDescriptors')[0]
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
            var elem = document.createElement('DIV');
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
        let isArrowKey = false;
        let isEnter = false;
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
        if (atvList) {
            for (var i = 0; i < atvList.length; i++) {
                atvList[i].addEventListener("click", _populatePropertyQuery);
            }
        }
    }

    function _populatePropertyQuery() {
        var elem = event.target;
        var value = elem.nextElementSibling.nextElementSibling
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
        return location.pathname.endsWith('/') ? location.pathname : location.pathname + "/"
    }

    function _generateCss() {
        var css = document.createElement('style');
        css.type = 'text/css';
        var styles = '.dynamoToolsBox {position: fixed;top: 0px;right: -1px;width: 500px;background-color: #545454;border: 3px solid #545454;overflow: hidden;}';
        styles += '.dynamoToolsBox h3 {color: #fff;text-align: center; margin: 10px;}';
        styles += '.dynamoToolsBox .navigation {position: absolute;top: 0;background-color: #696969;cursor: pointer;width: 41px;height: 41px;text-align: center;vertical-align: middle;line-height: 41px;}';
        styles += '.dynamoToolsBox .remove {right: 0;}';
        styles += '.dynamoToolsBox .toogle {right: 42px;}';
        styles += '.dynamoToolsBox ul {list-style: none;margin: 0;padding: 0;}';
        styles += '.dynamoToolsBox li {border-bottom: 2px solid #dcdcdc;background-color: #fdfdfd;display: inline-block;width: 100%;padding: 10px;}';
        styles += '.dynamoToolsBox .hide {display: none;}';
        styles += '.dynamoToolsBox .info label {float:left;font-weight: bold;}';
        styles += '.dynamoToolsBox .info div {float:left}';
        styles += '.dynamoToolsBox .green {background-color:#abffa5}';
        styles += '.dynamoToolsBox .info h3 {color: #2d2d2d;font-size: 20px;margin: 0px;}';
        styles += '.dynamoToolsBox .execute label {float:left;font-weight: bold;}';
        styles += '.dynamoToolsBox .execute div {float:left}';
        styles += 'pre.prettyprint {padding: 0px !important; border: 0px !important;}';
        styles += '.dynamoToolsBox .copyright p {padding: 0px;font-size: 11px;margin: 0px;text-align: right;padding-right: 20px;}';
        styles += '.atv {cursor: pointer;}';
        styles += '.dynamoToolsBox .autocomplete {background-color: #eaeaea;width: 95%;border: 1px solid #c1c1c1;border-top: 0px;overflow: hidden;display: none;}';
        styles += '.dynamoToolsBox .autocomplete.visible{display: block;}';
        styles += '.dynamoToolsBox .autocomplete span{width: 100%;display: inline-block;padding: 3px;}';
        styles += '.dynamoToolsBox .autocomplete span.active{background-color: #ffffff;color: #009;}';



        if (css.styleSheet) {
            css.styleSheet.cssText = styles;
        } else {
            css.appendChild(document.createTextNode(styles));
        }
        document.getElementsByTagName("head")[0].appendChild(css);
    }

    function _initJDBCPage() {
        var regex = /jdbcbrowser\/executeQuery.jhtml/;
        if (regex.test(location.pathname)) {
            _addDescTable();
            _injectPretify();
        }
    }

    function _initNucluesPage() {
        var regex = /\/nucleus\//;
        if (regex.test(location.pathname)) {
            _addViewComponent();
            _addViewConfiguration();
            _addInvokeMethodItem();
        }
        var regexRepository = /\/nucleus\/.*Repository/;
        if (regexRepository.test(location.pathname)) {
            _addViewDefinitionFiles();
            _addPrintItem();
            _addQueryItem();
            _addSeeItem();
            _seePropertieDescritor();
            _injectPretify();
            _addPrettifyTags();
            _initAutoComplete();
        }
    }

    function _init() {
        _remove();
        _addComponentBox();
        _generateCss();
        _addEnvironmentInfo();
        _addSearch();
        _addExecuteQuery();
        _initJDBCPage();
        _initNucluesPage();
        _addEventListeners();
        _addCopyrightBox();
    }


    _init();
})(window);