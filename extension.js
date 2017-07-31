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
        var count = 0;
        var mapedHostsInteval = setInterval(function() {
            count++;
            if (window.mappedHosts) {
                var content = window.mappedHosts.get(window.location.host) || window.location.host;
                _createTitleElement("whereAmI", "info green", content);
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
                }
            };
            _createInputElement("descTable", "Desc table", "Table Name", execute);
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
                }
            };
            _createDoubleInputElement("printItem", "Print Item", "Item Descriptor", "Value", execute);
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
            _createInputElement("queryItem", "Query Item", "Item Descriptor", execute);
        }
    }

    function _seePropertieDescritor() {
        var execute = function() {
            var target = event.target;
            var input = target.parentNode.getElementsByTagName('input')[0];
            if (input && input.value) {
                var message = location.pathname;
                if (!location.pathname.endsWith('/')) {
                    message += "/";
                }
                message += "?action=seetmpl&itemdesc=" + input.value + "#showProperties";
            }
        }
        _createInputElement("setPropertyDescriptor", "See property description", "Item Descriptor", execute);
    }

    function _addSeeItem() {
        var fieldText = document.getElementsByTagName('textarea')[0];
        if (fieldText) {
            var execute = function() {
                var target = event.target;
                var input = target.parentNode.getElementsByTagName('input');
                if (input[0] && input[0].value) {
                    var message = location.pathname;
                    if (!location.pathname.endsWith('/')) {
                        message += "/";
                    }
                    message += "?action=seeitems&itemdesc=" + input[0].value;
                    if (input[1] && input[1].value) {
                        message += "&itemid=" + input[1].value;
                    }
                    message += "#seeItems";
                    window.location = message;
                }
            };
            _createDoubleInputElement("seeItem", "See Item", "Item Descriptor", "Value", execute);
        }
    }

    function _addInvokeMethodItem() {
        var execute = function() {
            var target = event.target;
            var input = target.parentNode.getElementsByTagName('input');
            if (input[0] && input[0].value) {
                var message = location.pathname;
                if (!location.pathname.endsWith('/')) {
                    message += "/";
                }
                message += "?shouldInvokeMethod=" + input[0].value;
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
        var message = location.pathname;
        if (!location.pathname.endsWith('/')) {
            message += "/";
        }
        message += "?propertyName=serviceConfiguration";
        _createLinkElement("viewServiceConfiguration", "View Service Configuration", message);
    }

    function _addViewDefinitionFiles() {
        var message = location.pathname;
        if (!location.pathname.endsWith('/')) {
            message += "/";
        }
        message += "?propertyName=definitionFiles";
        _createLinkElement("viewDefinitionFiles", "View Definition Configuration", message);
    }

    function _addViewComponent() {
        var message = location.pathname;
        if (!location.pathname.endsWith('/')) {
            message += "/";
        }
        _createLinkElement("viewComponent", "View Component", message);
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
        _createInputElement("searchMethod", "Search Component", "Query", execute);
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

    function _createInputElement(id, label, placholder, execute) {
        var elem = '<div>' +
            '<label>' + label + ':&nbsp;</label>' +
            '<input type="text" placeholder="' + placholder + '"></input>' +
            '<button id="' + id + '">OK</button>' +
            '</div>';
        _createElement("LI", null, "execute", elem, "contentToolsBox");

        document.getElementById(id).addEventListener("click", execute);
        var input = document.getElementById(id).parentNode.getElementsByTagName('input')[0];
        if (input) {
            input.addEventListener("keypress", function(e) {
                var keyCode = e.keyCode;
                if (keyCode == 13) {
                    document.getElementById(id).click();
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

    function _createDoubleInputElement(id, label, placholder1, placholder2, execute) {
        var elem = '<div>' +
            '<label>' + label + ':&nbsp;</label>' +
            '<input type="text" placeholder="' + placholder1 + '"></input>' +
            '<input type="text" placeholder="' + placholder2 + '"></input>' +
            '<button id="' + id + '">OK</button>' +
            '</div>';
        _createElement("LI", null, "execute", elem, "contentToolsBox");
        document.getElementById(id).addEventListener("click", execute);
        var inputs = document.getElementById(id).parentNode.getElementsByTagName('input');
        if (inputs) {
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].addEventListener("keypress", function(e) {
                    var keyCode = e.keyCode;
                    if (keyCode == 13) {
                        document.getElementById(id).click();
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

        var code = document.getElementsByTagName('pre');
        if (code) {
            for (var i = 0; i < code.length; i++) {
                code[i].classList.add('language-xml');
            }
        }
        if (init) {
            PR.prettyPrint();
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
            }
        }
    }

    function _regularizeString(value) {
        return value.replace('<![CDATA[', '').replace(']]>', '');
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
})();