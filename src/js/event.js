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
                                var htmlContent = DynamoToolBox.render.renderHtmlTags('{{htmlItemDescEvent}}', data);;

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