var zh_CN = ["日", "一", "二", "三", "四", "五", "六", "日"];

$(function () {
    initTable();
    initDayPicker(zh_CN);
    initTimePicker();
});


/**
 * 负责弹窗
 * @param index
 * @param field
 * @param value
 * @param row
 * @param td
 */
function dialogAndSet(index, field, value, row, td) {

    var selector = $("#weekOrMonth"),
        weekDiv = $(".day-week input[type = 'checkbox'] + label"),
        monthDiv = $(".day-month input[type = 'checkbox'] + label");

    if (field === 'stargazers_count') {
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
        var d = dialog({
            title: '选择日期（可多选）',
            content: $("#bandWidthDialogBox"),
            okValue: '确定',
            ok: function () {
                this.title('设置中…');

                // 从页面box获取三个表的选择小串，（可能要加输入验证）
                var typeStr = $("#weekOrMonth").val() + "",
                    timeStr = chkBoxToStr(".time") + "",
                    dayStr = "" + typeStr === "W" ? chkBoxToStr(".week") : chkBoxToStr(".month"),
                    str = mergeSubStr(typeStr, dayStr, timeStr)
                ;

                table.bootstrapTable('updateCell', {index: index, field: field, value: str});
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
 * 拆分字符串为三个小串
 * @param str
 * @returns {*}
 */
function getSubStr(str) {
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
 * 拼接字符串
 * @param type
 * @param day
 * @param time
 * @returns {string}
 */
function mergeSubStr(type, day, time) {
    return type + "::" + day + "=" + time;
}

/**
 * 从表格获取选中的box并转为字符串返回
 * @param type
 */
function chkBoxToStr(type) {
    var checked = $(".pick-from" + type + " input[type = 'checkbox']:checked"), /* 获取选中的box*/
        str = "",
        arr = [];

    checked.each(function () {
        arr.push($(this).val());
    });
    arr.uniqueSort();// 去重和排序
    $.each(arr, function (index, val) {
        str += val + ",";
    }); // 字符串拼接
    if (str.charAt(str.length - 1) === ",") {
        str = str.substring(0, str.length - 1);
    } // 截取字符串最后的逗号
    return str;
}

/**
 * 将字符串设置为表格相应的选项
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
        en = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        template_week = '<div><input class="tgl tgl-flip" type="checkbox" id="wkbox_{index}" value="{index}"><label class="tgl-btn"  data-tg-off="{day}" data-tg-on="{day}" for="wkbox_{index}"></label></div>',
        template_month = '<div><input class="tgl tgl-flip" type="checkbox" id="mthbox_{index}" value="{index}"><label class="tgl-btn" data-tg-off="{index}" data-tg-on="{index}" for="mthbox_{index}"></label></div>',
        weekTr = $('<tr>').appendTo($('<table>').appendTo($('<div class="pick-from week">').appendTo(parent))),
        monthTable = $('<table>').appendTo($('<div class="pick-from month">').appendTo(parent)),
        i, j, lang = langArray === undefined ? en : langArray;

    // parent.hide();

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
        interval = 30, // 间隔半小时
        timeStampBase = 1000 * 60 * interval,
        newDate = new Date(),
        template_time = '<div><input class="tgl tgl-flip" type="checkbox" id="timbox_{index}" value="{index}">' +
            '<label class="tgl-btn" data-tg-off="{index}" data-tg-on="{index}" for="timbox_{index}"></label></div>';

    // parent.hide();

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
    this.sort(function (a, b) {
        return a - b;
    }); //先排序
    var res = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== res[res.length - 1]) {
            res.push(this[i]);
        }
    }
    return res;
};

/**
 * 日期转换
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


//****************************************************************************
var data = [
    {
        "name": "bootstrap-table",
        "stargazers_count": "",
        "forks_count": "122",
        "description": "An extended Bootstrap table with radio, checkbox, sort, pagination, and other added features. (supports twitter bootstrap v2 and v3)"
    },
    {
        "name": "multiple-select",
        // "stargazers_count": "288",
        "forks_count": "150",
        "description": "A jQuery plugin to select multiple elements with checkboxes :)"
    },
    {
        "name": "bootstrap-show-password",
        "stargazers_count": "1",
        "forks_count": "11",
        "description": "Show/hide password plugin for twitter bootstrap."
    },
    {
        "name": "blog",
        "stargazers_count": "2",
        "forks_count": "4",
        "description": "my blog"
    },
    {
        "name": "scutech-redmine",
        "stargazers_count": "W::2=05:00,10:00,18:30",
        "forks_count": "3",
        "description": "Redmine notification tools for chrome extension."
    }
];
var table = $('#table');

function initTable() {
    table.bootstrapTable({
        data: data,
        idField: 'name',
        columns: [{
            field: 'num',
            title: '#',
            class: 'hide-num',
            formatter: function (value, row, index) {
                return index + 1;
            } // 在表格前面添加一列隐藏的行号，用来当做修改内容时index
        }, {
            field: 'name',
            title: 'Name'
        }, {
            field: 'stargazers_count',
            title: 'Stars'
        }, {
            field: 'forks_count',
            title: 'Forks'
        }, {
            field: 'description',
            title: 'Description'
        }],
        onClickCell: function (field, value, row, td) {

            var index = $(td.parent()[0]).children("td.hide-num")[0].innerHTML - 1; // 获取index
            dialogAndSet(index, field, value, row, td)
        }
    });
}

function l(str) {
    console.log(str);
}

var bw_arr = [];

// 对象数组：字符串转数组并保存
function bwStrToArr(str) {
    bw_arr = [];
    var rules = str.split(","), day = [], rule;
    rules.forEach(function (ruleStr) {
        rule = ruleStr.split("*");
        day = [];
        for(var i = 0; i < rule[0].length; i++) {
            day[i] = rule[0].charAt(i);
        }
        bw_arr.push({
            "day": day,
            "time": rule[1],
            "limit_num": rule[2].substring(0, rule[2].length - 1),
            "limit_unit": rule[2].substring(rule[2].length - 1)
        });
    });
    console.log(bw_arr);
}

// 对象数组：保存的数组转字符串
function bwArrToStr() {
    var str, ruleStr = "";
    var rules = [];
    bw_arr.forEach(function (ruleObj) {
        ruleStr = ruleObj.day.join("")
            + "*" + ruleObj.time
            + "*" + ruleObj.limit_num + ruleObj.limit_unit;
        rules.push(ruleStr);
    });
    str = rules.join(',');
    console.log(str);

    return str;
}

$("#test-btn1").on('click', function () {
    console.log("enter 1");
    bwStrToArr("12345*08:00-18:00*2m,15*00:00-24:00*10m");
});

$("#test-btn2").on('click', function () {
    bwArrToStr();
});
$("#test-btn3").on('click', function () {

    $(".day-month input[type = 'checkbox'] + label").fadeOut();
});
$("#test-btn4").on('click', function () {

    $(".day-month input[type = 'checkbox'] + label").fadeIn();
});

function check() {
    // document.getElementById("check1").checked=true
    $("#check1")[0].checked = true;
}

function uncheck() {
    // document.getElementById("check1").checked=false
    $("#check1")[0].checked = false;
}

var i = 0;

function input666(obj) {
    var newDate1 = new Date(),
        inputObj = $("#input"),
        timestamp = parseInt(inputObj.val()) + 32,
        text = "W::4=06:00,14:00 || W::5=00:00 ||||",
        arr = [1, 21, 31, 2, 11, 2, 3],
        arr1 = inputObj.val().split(",")
    ;
    i += 1;
    text = text.search(/[\d$]/);
    l(text);
    // $(obj).val(i + "次：" + newDate1.format('hh:mm') + ",input=（" + timestamp + ")");
}

