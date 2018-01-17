

var data = [
        {
            "name": "bootstrap-table",
            "stargazers_count": "526",
            "forks_count": "122",
            "description": "An extended Bootstrap table with radio, checkbox, sort, pagination, and other added features. (supports twitter bootstrap v2 and v3)"
        },
        {
            "name": "multiple-select",
            "stargazers_count": "288",
            "forks_count": "150",
            "description": "A jQuery plugin to select multiple elements with checkboxes :)"
        },
        {
            "name": "bootstrap-show-password",
            "stargazers_count": "32",
            "forks_count": "11",
            "description": "Show/hide password plugin for twitter bootstrap."
        },
        {
            "name": "blog",
            "stargazers_count": "13",
            "forks_count": "4",
            "description": "my blog"
        },
        {
            "name": "scutech-redmine",
            "stargazers_count": "6",
            "forks_count": "3",
            "description": "Redmine notification tools for chrome extension."
        }
    ] ;
var table = $('#table');
var picker = $('#table-day-picker');

$(function () {
    table.bootstrapTable({
        data: data,
        idField: 'name',
        pagination: true,
        search: true,
        columns: [{
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
        onPostBody: function () {
            $('#table').editableTableWidget();
        }
    });

    // picker.dayMutiPicker();

});












// $("#test-input").focus(function () {
//     console.log("============ focus ============ "+ this.id);
// });
// $("#test-input").blur(function () {
//     console.log("============ blur ============ "+ this.id);
// });
//
//
// table.focus(function () {
//     console.log("============ focus ============ "+ this.id);
// });
//
// $("#table-datetime").focus(function () {
//     console.log("============ focus ============ "+ this.id);
// });
// $("#table-datetime").blur(function () {
//     console.log("============ blur ============ "+ this.id);
// });
//
//
// $("#gap_start_val").focus(function () {
//     console.log("============ focus ============ "+ this.id);
// });
// $("#gap_start_val").blur(function () {
//     console.log("============ blur ============ "+ this.id);
// });
//
//
// $("#table-datetime-text").focus(function () {
//     console.log("============ focus ============ "+ this.id);
// });
// $("#table-datetime-text").blur(function () {
//     console.log("============ blur ============ "+ this.id);
// });
// $("#test-btn").on('click',function () {
//     $("#test-input").val("123");
//     // $("#test-input")[0].value = "456";
//     console.log("$(\"#test-input\")[0].value" + $("#test-input")[0].value);
//     // $("#test-input").value = "789";
// });
// var evt = $.Event('validate');  // 创建事件对象 验证
// active.trigger(evt, editor.val());
// if (evt.result === false) { // 内容验证没通过就加上 error 类
//     editor.addClass('error');
// } else {
//     editor.removeClass('error'); // 否则移除 error 类
// }

