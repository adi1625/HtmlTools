

function selectOrInput() {
    if( $("input[name = input-mode]:checked").val() === "select") {
        $("#include-select").show();
        $("#include-textarea").hide();
    } else {
        $("#include-select").hide();
        $("#include-textarea").show();
    }
}

// 清空或移除，父div下select和textarea的内容；
function deletePicked(btn) {
    if( $(btn).hasClass("del-btn")){
        $(btn).parent().siblings("select").find("option:checked").remove();
    }
    if( $(btn).hasClass("del-all-btn")){
        $(btn).parent().siblings("textarea").val("");
        $(btn).parent().siblings("select").empty();
    }
}

function initPicked() {
    
}