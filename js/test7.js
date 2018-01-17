var $policyTable,
    policyStr,
    policyTableData = {
        fillPolicyTable: function (poliStr) {
            $policyTable.bootstrapTable('removeAll');
            var charArr = poliStr.split(" || ");
            // 遍历追加 charArr 元素到表格
            charArr.forEach(function (item, index) {
                $policyTable.bootstrapTable('append', nullData({
                    sched_item: symbolToWord(item, 0) // policyStr 符号转为中文追加到表格中
                }));
            });
        }
    },

    groupVisibility = {

        policyTypeVal: $("#policyType"),
        policyStrGroup: $("#policyStrGroup"),
        policyIntervalGroup: $("#policyIntervalGroup"),
        policySchedGroup: $("#policySchedGroup"),

        hideAllGroup: function () {
            this.policyStrGroup.hide();
            this.policyIntervalGroup.hide();
            this.policySchedGroup.hide();
        },

        showIntervalGroup: function () {
            var gapStartVal = $("#gap_start_val"),
                gapStart = $("#gap_start"),
                gapStep = $("#gap_step"),
                tempText;
            this.policyStrGroup.hide();
            this.policySchedGroup.hide();
            // 修改就先把当前设定值设置到页面
            if (this.policyTypeVal === "2" && !policyStr.isEmptyVal() && policyStr.isIntervalVal()) {
                tempText = poliStr.substr(23);
                gapStep.val(tempText);
                tempText = poliStr.substr(3, 19);
                gapStartVal.val(tempText);
                gapStart.val(tempText);
            } else {
                // 新建就把当前日期设置到页面
                var date = new Date().format("yyyy-MM-dd hh:mm:ss");
                gapStartVal.val(date);
                gapStart.val(date);
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
        },

        showSchedGroup: function () {
            this.policyStrGroup.hide();
            this.policyIntervalGroup.hide();

            if (this.policyTypeVal === "1" && !policyStr.isEmptyVal() && policyStr.isSchedVal())
                policyTableData.fillPolicyTable(policyStr.val());

            this.policySchedGroup.show();
        }
    };


// 操纵 policyStr 元素内容
$.fn.extend({
    isEmptyVal: function () {
        return (this.val() === "" || this.val() === undefined);
    },

    isSchedVal: function () {
        return ( this.val().substr(0, 1) === "W" || this.val().substr(0, 1) === "D");
    },

    isIntervalVal: function () {
        return this.val().substr(0, 1) === "I";
    },

    addPolicyItem: function (itemStr) {
        var poliStr = this.val();
        if (poliStr.indexOf(itemStr) !== -1) return; // 防止重复添加
        if (poliStr !== "") this.val(poliStr + " || "); // 如已有值则加分隔符
        this.val(poliStr + itemStr); // 接上新值
    },

    removePolicyByValue: function (itemStr) {
        this.val(
            this.val()
                .split(" || ")
                .removeByValue(itemStr)
                .toStrBySplit()
        );
    },

    removePolicyByValues: function (tgt) {
        var arr = this.val().split(" || ");
        tgt.forEach(function (itemStr) {
            arr.removeByValue(itemStr)
        });
        this.val(arr.toStrBySplit());
    },

    removePolicyByIndex: function (i) {
        this.val(
            this.val()
                .split(" || ")
                .splice(i, 1)
                .toStrBySplit()
        );
    },

    updatePolicyByValue: function (oldStr, newStr) {
        this.val(
            this.val()
                .replace(oldStr, newStr)
        );
    },

    updatePolicyByIndex: function (i, newStr) {
        var temp = this.val().split(" || ");
        this.val(
            this.val().replace(temp[i], newStr)
                .toStrBySplit()
        );
    },

    createPolicyInter: function (type, day, time) {
        var item = type + "::" + day + "=" + time;
        this.val(item);
        return symbolToWord(item, 0);
    },

    createPolicySched: function (gapStart, gapStep) {
        this.val("I::" + gapStart + "=" + gapStep);
    }
});

$.extend(Array.prototype, {

    toStrBySplit: function () {
        var resultStr = "";
        this.forEach(function (item, i) {  // 拼接字符串
            resultStr += item + " || ";
        });
        return resultStr.substring(0, resultStr.length - 4); // 删除结尾||
    },

    removeByValue: function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === val) {
                this.splice(i, 1);
                break;
            }
        }
        return this;
    },

    uniqueSort: function () {
        var res = [];
        if (this.length > 0) {
            this.sort(new Function("a", "b", "return a-b;")); //先排序
            res = [this[0]];
            for (var i = 1; i < this.length; i++) {
                if (this[i] !== res[res.length - 1]) {
                    res.push(this[i]);
                }
            }
        }
        return res;
    } // 排序去重
});


////////////////////////////////// test /////////////////////////////
function input666(obj) {
    var newDate1 = new Date(),
        inputObj = $("#input"),
        timestamp = parseInt(inputObj.val()) + 32,
        text = "W::4=06:00,14:00 || W::5=00:00 || D::3,2,5=00:02",
        text2 = "W::5=00:00",
        arr = [1, 21, 31, 2, 11, 2, 3],
        arr1 = inputObj.val().split(",")
    ;
    inputObj.deletePolicyItem(text2);
    // $(obj).val(i + "次：" + newDate1.format('hh:mm') + ",input=（" + timestamp + ")");
}

Array.prototype.uniqueSort = function () {
    var res = [];
    if (this.length > 0) {
        this.sort(new Function("a", "b", "return a-b;")); //先排序
        res = [this[0]];
        for (var i = 1; i < this.length; i++) {
            if (this[i] !== res[res.length - 1]) {
                res.push(this[i]);
            }
        }
    }
    return res;
};