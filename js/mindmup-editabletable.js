/*global $, window*/
$.fn.editableTableWidget = function (options) {
    'use strict';
    return $(this).each(function () {
        var tableDateTime = $("#table-day-picker"),
            tableDateTimeMirror = $("#table-datetime-mirror"),

            buildDefaultOptions = function () {
                var opts = $.extend({}, $.fn.editableTableWidget.defaultOptions);
                opts.editor = opts.editor.clone();
                return opts;
            },
            activeOptions = $.extend(buildDefaultOptions(), options),
            ARROW_LEFT = 37, ARROW_UP = 38, ARROW_RIGHT = 39, ARROW_DOWN = 40, ENTER = 13, ESC = 27, TAB = 9,
            element = $(this),
            // editor = activeOptions.editor.css('position', 'absolute').hide().appendTo(element.parent()), // 在父对象（table）最后儿子（table）追加一个 input 并设置参数并 隐藏
            editor = tableDateTime.css('position', 'absolute').hide(),
            active,
            showEditor = function (select) {
                active = element.find('td:focus');
                if (active.length) {
                    editor.val(active.text())
                        .removeClass('error')
                        .show()
                        .offset(active.offset())
                        .css(active.css(activeOptions.cloneProperties))  // 按照 cloneProperties 列表获取焦点的这些 style，并设置给 编辑器
                        .css('padding', '1px')
                        // .css('padding-top', active.height()*2)
                        .width(active.width())  // 。。
                        .height(active.height())  //。。
                        .focus();       // 并设置编辑器为焦点
                    if (select) {    // 如果单元格被选中择编辑器也设置为选中？？？？？干啥的。。
                        editor.select();
                        // console.log(editor);
                    }
                }
            },
            setActiveText = function () {
                var text = tableDateTimeMirror.val(),
                    evt = $.Event('change'),
                    originalContent;
                if (active.text() === text || editor.hasClass('error')) {
                    return true; // 如果完事了单元格内和编辑器的文字相等，则返回true
                }
                originalContent = active.html(); // 如果不相等，获取原始的html
                active.text(text).trigger(evt, text); // 设置一个触发器 设置单元格的文字
                if (evt.result === false) {
                    active.html(originalContent); // 如果没变，那保持原样
                }
            },
            movement = function (element, keycode) { // 快捷键
                if (keycode === ARROW_RIGHT) {
                    return element.next('td');
                } else if (keycode === ARROW_LEFT) {
                    return element.prev('td');
                } else if (keycode === ARROW_UP) {
                    return element.parent().prev().children().eq(element.index());
                } else if (keycode === ARROW_DOWN) {
                    return element.parent().next().children().eq(element.index());
                }
                return [];
            };
        editor.blur(function () {  // 编辑器失去焦点的动作
            console.log("============ 监听到了blur ============ "+ this.id);
                    setActiveText();      // 执行设置文字的方法
                    editor.hide();      // 隐藏编辑器
                })
            .keydown(function (e) {
            if (e.which === ENTER) {
                setActiveText();
                editor.hide();
                active.focus();
                e.preventDefault();
                e.stopPropagation();
            } else if (e.which === ESC) {
                editor.val(active.text());
                e.preventDefault();
                e.stopPropagation();
                editor.hide();
                active.focus();
            } else if (e.which === TAB) {
                active.focus();
            } else if (this.selectionEnd - this.selectionStart === this.value.length) {
                var possibleMove = movement(active, e.which);
                if (possibleMove.length > 0) {
                    possibleMove.focus();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        }) // 给 编辑器设置 快捷键
            .on('input paste', function () {    // 让 编辑器 监听 输入和粘贴事件
                var evt = $.Event('validate');  // 创建事件对象 验证
                active.trigger(evt, editor.val());
                if (evt.result === false) { // 内容验证没通过就加上 error 类
                    editor.addClass('error');
                } else {
                    editor.removeClass('error'); // 否则移除 error 类
                }
            });
        element.on('click keypress dblclick', showEditor)  // 当前元素  是 table 吧
            .css('cursor', 'pointer')           // 应该是设置 快捷键 的
            .keydown(function (e) {
                var prevent = true,
                    possibleMove = movement($(e.target), e.which);
                if (possibleMove.length > 0) {
                    possibleMove.focus();
                } else if (e.which === ENTER) {
                    showEditor(false);
                } else if (e.which === 17 || e.which === 91 || e.which === 93) {
                    showEditor(true);
                    prevent = false;
                } else {
                    prevent = false;
                }
                if (prevent) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

        element.find('td').prop('tabindex', 1); // 设置用tab键操作时的跳动顺序

        $(window).on('resize', function () { // 窗口改变大小时，如果编辑器是可见的，则重新调整位置；
            if (editor.is(':visible')) {
                editor.offset(active.offset())
                    .width(active.width())
                    .height(active.height());
            }
        });
    });

};
$.fn.editableTableWidget.defaultOptions = {
    cloneProperties: [ 'text-align', 'font', 'font-size', 'font-family', 'font-weight',
        'border', 'border-top', 'border-bottom', 'border-left', 'border-right'],
    editor: $('<input>')
};
