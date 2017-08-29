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

        function _autoCompleteEvent(event) {
            if (!event) {
                return;
            }
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
                            if (itens) {
                                _spanLength = itens.length;
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
                        var target = elem.target;
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