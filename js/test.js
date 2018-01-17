
var $policyTable = $('#policy_sched_table'),
    $appendPolicyTr = $('#appendPolicyTr'),
    $removePolicy = $('#removePolicy'),
    policyClickiField = "sched_item", // 表格点击监听的域
    selectionsPolicy = [],
    zh_CN = ["日", "一", "二", "三", "四", "五", "六", "日"],
    zh_CN_Policy = [{
        symbol: "W::",
        word: "每周 "
    }, {
        symbol: "D::",
        word: "每月："
    }, {
        symbol: "=",
        word: " 的："
    }, {
        symbol: ",",
        word: "、"
    }],
    langArray = zh_CN,
    langPolicyJson = zh_CN_Policy;

/////////////// 表格处理开始 ////////

function initPolicyTable() {
    $policyTable.bootstrapTable({
        columns: [
            {
                field: 'state',
                checkbox: true,
                align: 'center',
                valign: 'middle'
            },
            {
                field: 'num',
                title: '#',
                class: 'hide-num',
                formatter: function (value, row, index) {
                    return index + 1;
                } // 在表格前面添加一列隐藏的行号，用来当做修改内容时index
            },
            {
                field: 'sched_item',
                title: '定期条目',
                align: 'center'
            },
            {
                field: 'del',
                title: '',
                events: policyOperateEvents,
                align: 'center',
                formatter: policyDelFormatter
            }
        ],
        onClickCell: function (field, value, row, td) {
            // 点击弹窗
            var index = $(td.parent()[0]).children("td.hide-num")[0].innerHTML - 1; // 获取index
            dialogAndSet(index, field, value, row, td)
        }
    });

    // 检查表？
    $policyTable.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
        $removePolicy.prop('disabled', !$policyTable.bootstrapTable('getSelections').length);

        // save your data, here just save the current page
        selectionsPolicy = getPolicySelections();
        // push or splice the selections if you want to save all data selections
    });

    // tab栏上的删除键
    $removePolicy.click(function () {
        var policies = getPolicySelections();
        $policyTable.bootstrapTable('remove', {
            field: 'sched_item',
            values: policies
        });
        $removePolicy.prop('disabled', true);
    });

    // 重新调整大小
    $(window).resize(function () {
        $policyTable.bootstrapTable('resetView', {
            // height: getHeight() > 320 ? 320 : getHeight()
        });
    });
}

/**
 * 每行删除键的图标
 *
 * @param value
 * @param row
 * @param index
 * @returns {string}
 */
function policyDelFormatter(value, row, index) {
    return [
        '<a class="policyDel" href="javascript:void(0)" title="policyDel">',
        '<i class="glyphicon glyphicon-remove"></i>',
        '</a>'
    ].join('');
}

/**
 * 每行删除键的监听
 *
 * @type {{[click .policyDel]: Window.policyOperateEvents.click .policyDel}}
 */
window.policyOperateEvents = {
    'click .policyDel': function (e, value, row, index) {
        $policyTable.bootstrapTable('removeByUniqueId', row.sched_item);
    }
};

/**
 * 添加键的监听
 */
$appendPolicyTr.click(function () {

    var i,
        data = getPolicyData();

    for (i = 0; i < data.length; i++) {
        if (!data[i].sched_item) {
            $('#policyMsg').addClass('alert-warning').html('先配置定期条目').show();
            return;
        } else {
            $('#policyMsg').removeClass('alert-warning').html('').hide();
        }
    }

    $policyTable.bootstrapTable('append', nullData({
        sched_item: "点击添加"
    }));
    $policyTable.bootstrapTable('scrollTo', 'bottom');
});

/**
 * 获取表中被选择的条目
 *
 * @returns {Array|*}
 */
function getPolicySelections() {
    return $.map($policyTable.bootstrapTable('getSelections'), function (row) {
        return row.sched_item;
    });
}

/**
 * 获取表中全部数据，返回行数组
 */
function getPolicyData() {
    return $policyTable.bootstrapTable('getData');
}

/**
 * 从字符串拆出策略定义并显示；策略选项变动、初始化页面时调用；
 *
 * @param obj
 */
function getPolicyStr(obj) {
    var poliTypeVal = obj.value,
        policyStrGroup = $("#policyStrGroup"),
        policyIntervalGroup = $("#policyIntervalGroup"),
        policySchedGroup = $("#policySchedGroup"),
        poliStr = $("#policyStr").val(),
        tempText;


    switch (poliTypeVal) {
        case "0": // 手动
            policyStrGroup.hide();
            policyIntervalGroup.hide();
            policySchedGroup.hide();
            break;
        case "1": // 定期
            policyStrGroup.hide();
            policyIntervalGroup.hide();

            if (poliTypeVal === "1" && poliStr !== "" && poliStr !== undefined && ( poliStr.substr(0, 1) === "W" || poliStr.substr(0, 1) === "D")) {
                $policyTable.bootstrapTable('removeAll');
                var charArr = [];
                charArr = poliStr.split(" || ");
                // 遍历追加 charArr 元素到表格
                charArr.forEach(function (item, index) {
                    $policyTable.bootstrapTable('append', nullData({
                        sched_item: symbolToWord(item,0) // policyStr 符号转为中文追加到表格中
                    }));
                });
            }
            policySchedGroup.show();
            break;
        case "2": // 间隔
            policyStrGroup.hide();
            policySchedGroup.hide();

            if (poliTypeVal === "2" && poliStr !== "" && poliStr !== undefined && poliStr.substr(0, 1) === "I") {
                tempText = poliStr.substr(23);
                $("#gap_step").val(tempText);
                tempText = poliStr.substr(3, 19);
                $("#gap_start_val").val(tempText);
            } else {
                $("#gap_start_val").val(new Date().format("yyyy-MM-dd hh:mm:ss"));
            }
            $('.form_datetime').datetimepicker({
                language: 'zh-CN',
                weekStart: 1,
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                forceParse: 0,
                initialDate: tempText,
                showMeridian: 1
            }); // 初始化时间选择器；
            policyIntervalGroup.show();
            break;
        default:
    }
}

/**
 * 合并策略定义到字符串；提交表单到后台时调用；
 */
function setPolicyStr() {
    var gapStep = $("#gap_step"),
        policyType = $("#policyType").val(),
        gap_start = $("#gap_start"),
        policyData = getPolicyData(),
        poliStr = "";
    if (policyType = "1" && policyData.length > 0) {
        poliStr = "";
        policyData.forEach(function (item, i) {
            // 此处将每行word转为symbol
            poliStr += symbolToWord(item.sched_item,1) + " || ";
        });
        if (poliStr.substring(poliStr.length - 4, poliStr.length) === " || ") {
            poliStr = poliStr.substring(0, poliStr.length - 4);
        } // 截取字符串最后的 ||
    } else if (policyType = "2" && gap_start.val() !== "" && gapStep.val() !== "" && gapStep.val() > "0") {
        poliStr = "I::" + gap_start.val() + "=" + gapStep.val();
    }
    $("#policyStr").val(poliStr);
}

/////////////// 表格处理结束 //////// 弹窗开始

/**
 * 负责策略定义弹窗，单元格点击监听器中调用
 *
 * @param index
 * @param field
 * @param value
 * @param row
 * @param td
 */
function dialogAndSet(index, field, value, row, td) {

    var selector = $("#weekOrMonth"),
        weekDiv = $(".day-week input[type = 'checkbox'] + label"),
        monthDiv = $(".day-month input[type = 'checkbox'] + label"),
        titleAlert = "";

    if (field === policyClickiField) {
        weekDiv.show();
        monthDiv.hide();
        selector.val("W");
        strToChkBox();// 没参数就全不选（没有传入要选择的参数，就是不选）

        // 如果已有内容，就先设置内容到box
        if (value !== "" && value !== undefined) {
            // value字符串的拆分，得到小串 type week/month time，大串小串的语言翻译可以加在getSubStr中；
            var map = getSubStr(value)
            ;
            // 如果一串是w d 则隐藏相应的表
            if (map.type === "W") {
                selector.val(map.type);
                weekDiv.show();
                monthDiv.hide();
                strToChkBox(map.day, ".week");// 设小串到box
            } else if (map.type === "D") {
                selector.val(map.type);
                weekDiv.hide();
                monthDiv.show();
                strToChkBox(map.day, ".month");// 设小串到box
            }
            strToChkBox(map.time, ".time");// 设小串到box

        }

        // 弹窗和验证
        var d = dialog({
            title: '选择日期（可多选）',
            content: $("#bandWidthDialogBox"),
            okValue: '确定',
            ok: function () {
                this.title('设置中…');

                // 从页面box获取三个表的选择小串
                var typeStr = $("#weekOrMonth").val() + "",
                    timeStr = chkBoxToStr(".time") + "",
                    dayStr = "" + typeStr === "W" ? chkBoxToStr(".week") : chkBoxToStr(".month"),
                    str = "";
                // 输入验证
                if (typeStr !== "" && dayStr !== "" && timeStr !== "") {
                    str = mergeSubStr(typeStr, dayStr, timeStr); // 翻译
                } else {
                    titleAlert = "";
                    if (typeStr === "") titleAlert += "请选择类型；";
                    if (dayStr === "") titleAlert += "请选择日期；";
                    if (timeStr === "") titleAlert += "请选择时间；";
                    this.title(titleAlert);
                    return false;
                }

                $policyTable.bootstrapTable('updateCell', {index: index, field: field, value: str});
                d.close().remove();
            },
            cancelValue: '取消',
            cancel: function () {
                d.close().remove();
            }
        });
        d.showModal();
    }
}

/**
 * 转换策略定义符号为中文，或相反
 *
 * @param text
 * @param forward
 * @returns {*}
 */
function symbolToWord(text, forward) {
    if(text !== "" && text !== undefined){
        if(forward === 0){ // 正向
            langPolicyJson.forEach(function (t) {
                while (text.indexOf(t.symbol) !== -1) {
                    text = text.replace(t.symbol, t.word);
                }
            });
        }else if(forward === 1){ // 反向
            langPolicyJson.forEach(function (t) {
                while (text.indexOf(t.word) !== -1) {
                    text = text.replace(t.word, t.symbol);
                }
            });
        }
        return text;
    }
}

/**
 * 拆分单元格内容为type week/month time串
 *
 * @param str
 * @returns {*}
 */
function getSubStr(str) {
    str = symbolToWord(str,1); // 中文转为符号
    var p1 = str.indexOf("::"),
        p2 = str.indexOf("=")
    ;
    if (p1 !== -1 && p2 !== -1) {
        return {
            "type": str.substring(0, p1) + "",
            "day": str.substring(p1 + 2, p2) + "",
            "time": str.substring(p2 + 1, str.length) + ""
        };
    }
    return -1;
}

/**
 * 拼接type week/month time串 给单元格显示
 *
 * @param type
 * @param day
 * @param time
 * @returns {string}
 */
function mergeSubStr(type, day, time) {
    return symbolToWord(type + "::" + day + "=" + time, 0);
}

/**
 * 从日期时间表格获取选中的box并转为字符串返回
 *
 * @param type
 */
function chkBoxToStr(type) {
    var checked = $(".pick-from" + type + " input[type = 'checkbox']:checked"), /* 获取选中的box*/
        str = "",
        arr = [];

    checked.each(function () {
        arr.push($(this).val());
    });
    $.each(arr.uniqueSort(), function (index, val) { // 去重和排序
        str += val + ",";
    }); // 字符串拼接
    if (str.charAt(str.length - 1) === ",") {
        str = str.substring(0, str.length - 1);
    } // 截取字符串最后的逗号
    return str;
}

/**
 * 将字符串设置为日期时间表格相应的选项
 *
 * @param type
 * @param str
 */
function strToChkBox(str, type) {
    if (type === undefined)
        type = "";
    var selectText = ".pick-from" + type,
        boxes1 = $(selectText).find("input[type = 'checkbox']"),
        list = [];
    boxes1.prop("checked", false); // 初始全不选
    if (str !== "" && str !== undefined) {
        list = str.split(",").uniqueSort();// 字符串分割
        list.forEach(function (item) {// 遍历
            $($(selectText).find("input[type = 'checkbox'][value = '" + item + "']")).prop("checked", true);
            // 获取dom 设置 checked
        })
    }
}

/**
 * 初始化日历网格
 * @param langArray
 */
function initDayPicker(langArray) {
    // l(langArray);
    var parent = $("#table-day-picker"),
        grandPa = $("#bandWidthDialogBox"),
        en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        template_week = '<div><input class="tgl tgl-flip" type="checkbox" id="wkbox_{index}" value="{index}"><label class="tgl-btn"  data-tg-off="{day}" data-tg-on="{day}" for="wkbox_{index}"></label></div>',
        template_month = '<div><input class="tgl tgl-flip" type="checkbox" id="mthbox_{index}" value="{index}"><label class="tgl-btn" data-tg-off="{index}" data-tg-on="{index}" for="mthbox_{index}"></label></div>',
        weekTr = $('<tr>').appendTo($('<table>').appendTo($('<div class="pick-from week">').appendTo(parent))),
        monthTable = $('<table>').appendTo($('<div class="pick-from month">').appendTo(parent)),
        i, j, lang = langArray === undefined ? en : langArray;

    // parent.hide();
    grandPa.hide();

    // 填充星期
    for (i = 0; i < 7; i++) {
        var e_weekTd = $('<td class="day-week">').appendTo(weekTr), // jq对象是引用传递的；
            temp1 = template_week;  // 字符串居然不是引用传递？！
        while (temp1.indexOf("{index}") !== -1) {
            temp1 = temp1.replace("{index}", i + "")
        }
        while (temp1.indexOf("{day}") !== -1) {
            temp1 = temp1.replace("{day}", lang[i])
        }
        e_weekTd.html(temp1);
    }

    // 填充月
    for (j = 0; j < 31; j++) {
        if (j % 7 === 0) {
            var monthTr = $('<tr>').appendTo(monthTable);
        }
        var e_monthTd = $('<td class="day-month">').appendTo(monthTr),
            temp2 = template_month;
        while (temp2.indexOf("{index}") !== -1) {
            temp2 = temp2.replace("{index}", j + 1 + "")
        }
        e_monthTd.html(temp2);
    }
}

/**
 * 初始化时间网格
 */
function initTimePicker() {
    var parent = $("#table-time-picker"),
        grandPa = $("#bandWidthDialogBox"),
        interval = 30, // 间隔半小时
        timeStampBase = 1000 * 60 * interval,
        newDate = new Date(),
        template_time = '<div><input class="tgl tgl-flip" type="checkbox" id="timbox_{index}" value="{index}">' +
            '<label class="tgl-btn" data-tg-off="{index}" data-tg-on="{index}" for="timbox_{index}"></label></div>';

    // parent.hide();
    grandPa.hide();

    // 填充半天
    for (var i = 0; i < 1440 / interval; i++) {
        if (i % (1440 / interval / 2) === 0) {
            var halfDayTable = $('<table>').appendTo($('<div class="pick-from time">').appendTo(parent));
        } // 每半天一个table
        if (i % (1440 / interval / 6) === 0) {
            var timeTr = $('<tr>').appendTo(halfDayTable);
        } // 每1/6天一个tr
        var halfDayTd = $('<td class="time-td">').appendTo(timeTr),
            temp = template_time;
        while (temp.indexOf("{index}") !== -1) {
            newDate.setTime(timeStampBase * (i + 32)); // 设定时间
            temp = temp.replace("{index}", newDate.format('hh:mm')) // 替换
        }
        halfDayTd.html(temp);
    }
}

/**
 * 传入select对象改变picker状态
 * @param obj
 */
function displayPicked(obj) {
    var val = obj.value,
        weekTab = $(".day-week input[type = 'checkbox'] + label"),
        monthTab = $(".day-month input[type = 'checkbox'] + label");

    switch (val) {
        case "W": // 手动
            weekTab.show();
            monthTab.hide();
            break;
        case "D": // 定期
            weekTab.hide();
            monthTab.show();
            break;
        default:
            weekTab.hide();
            monthTab.hide();
            break;
    }
}

/**
 * 排序去重
 * @returns {[null]}
 */
Array.prototype.uniqueSort = function () {
    this.sort(new Function("a","b","return a-b;")); //先排序
    var res = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== res[res.length - 1]) {
            res.push(this[i]);
        }
    }
    return res;
};

/**
 * 日期格式转换
 * @param format
 * @returns {*}
 */
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

///////////////////// 弹窗结束 /////////



///////////// 公用方法开始 ////////////////

function nullData(obj) {
    var rows = [];
    rows.push(obj);
    return rows;
} // 这个忽略

$(function () {
    initPolicyTable();

    initDayPicker(langArray);
    initTimePicker();

    getPolicyStr($("#policyType")[0]); // 初始化同步策略
});


function create_syncrules() {

    setPolicyStr();
}

////////////////////////////////////////// 测试开始

function test() {
    create_syncrules();
}