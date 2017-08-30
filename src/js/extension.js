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
            _createInputElement("descTable", "Desc table:", "Table Name", execute, false);
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
            _createDoubleInputElement("printItem", "Print Item:", "Item Descriptor", "Value", execute, true);
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
            _createInputElement("queryItem", "Query Item:", "Item Descriptor", execute, true);
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
        _createInputElement("setPropertyDescriptor", "See property description:", "Item Descriptor", execute, true);
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
            _createDoubleInputElement("seeItem", "See Item:", "Item Descriptor", "Value", execute, true, true);
        }
    }

    function _addInvokeMethodItem() {
        var execute = function(event) {
            var target = event.target;
            if (target && target.value) {
                location = target.value;
            }
        };
        _createSelectOneElement("invokeMethod", "Invoke Method:", DynamoToolBox.global.loadMethods(), execute);
    }

    function _addViewConfiguration() {
        var data = {
            id: "viewServiceConfiguration",
            label: "View Service Configuration",
            url: DynamoToolBox.global.resolvedPathName() + "?propertyName=serviceConfiguration"
        }
        var message = DynamoToolBox.render.renderHtmlTags('{{htmlLink}}', data);

        DynamoToolBox.global.createElement("LI", null, "execute", message, "contentToolsBox");
    }

    function _addViewDefinitionFiles() {
        var data = {
            id: "viewDefinitionFiles",
            label: "View Service Definition",
            url: DynamoToolBox.global.resolvedPathName() + "?propertyName=definitionFiles"
        }
        var message = DynamoToolBox.render.renderHtmlTags('{{htmlLink}}', data);

        DynamoToolBox.global.createElement("LI", null, "execute", message, "contentToolsBox");
    }

    function _addViewComponent() {
        var data = {
            id: "viewComponent",
            label: "View  Component",
            url: DynamoToolBox.global.resolvedPathName()
        }
        var message = DynamoToolBox.render.renderHtmlTags('{{htmlLink}}', data);

        DynamoToolBox.global.createElement("LI", null, "execute", message, "contentToolsBox");
    }

    function _addExecuteQuery() {
        var data = {
            id: "executeQuery",
            label: "Execute  Query",
            url: "/dyn/admin/atg/dynamo/admin/en/jdbcbrowser/executeQuery.jhtml"
        }
        var message = DynamoToolBox.render.renderHtmlTags('{{htmlLink}}', data);
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
        var elem = DynamoToolBox.render.renderHtmlTags('{{htmlInput}}', data);

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
        var elem = DynamoToolBox.render.renderHtmlTags('{{htmlDoubleInput}}', data);

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