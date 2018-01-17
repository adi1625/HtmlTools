

var $table = $('#table'),
    $appendTr = $('#appendTr'),
    $remove = $('#remove'),
    selections = [];

function initTable() {
    $table.bootstrapTable({
        columns:[
            [
                {
                    field: 'state',
                    checkbox: true,
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'src',
                    title: '哪天',
                    class: 'hahaha',
                    align: 'center'
                },
                {
                    field: 'dest',
                    title: '时间',
                    align: 'center'
                },
                {
                    field: 'del',
                    title: '',
                    events: operateEvents,
                    align: 'center',
                    formatter: delFormatter
                }
            ]
        ],
        onPostBody: function () {
            $('#table').editableTableWidget();
        }
    });

    // 检查表？
    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
        $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);

        // save your data, here just save the current page
        selections = getSrcSelections();
        // push or splice the selections if you want to save all data selections
    });

    // tab栏上的删除键
    $remove.click(function () {
        var paths = getSrcSelections();
        $table.bootstrapTable('remove', {
            field: 'src',
            values: paths
        });
        $remove.prop('disabled', true);
    });

    // 重新调整大小
    $(window).resize(function () {
        $table.bootstrapTable('resetView', {
            // height: getHeight() > 320 ? 320 : getHeight()
        });
    });
}

// 每行删除键的图标
function delFormatter(value, row, index) {
    return [
        '<a class="del" href="javascript:void(0)" title="del">',
        '<i class="glyphicon glyphicon-remove"></i>',
        '</a>'
    ].join('');
}

// 每行删除键的监听
window.operateEvents = {
    'click .del': function (e, value, row, index) {
        $table.bootstrapTable('removeByUniqueId', row.src);
    }
};

// 添加键的监听
$appendTr.click(function () {

    var i,
        data = getData();

    for (i = 0; i < data.length; i++){
        if(!data[i].src || !data[i].dest){
            $('#pathMsg').addClass('alert-warning').html('rule_config_path_first').show();
            return;
        }else {
            $('#pathMsg').removeClass('alert-warning').html('').hide();
        }
    }

    $table.bootstrapTable('append', nullData({
        src: "",
        dest: ""
    }));
    $table.bootstrapTable('scrollTo', 'bottom');
});


function getSrcSelections() {
    return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.src
    });
}

function getData() {
    return $table.bootstrapTable('getData');
}

function nullData(obj) {
    var rows = [];

    rows.push(obj);
    return rows;
}

$(function () {
    initTable();
});


function create_syncrules() {


}

