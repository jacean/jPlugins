var requireV1=require.config({
    shim: {
        'jquery': {
            exports: "$"
        }
    },  
    context:"context-v1",
    paths: {
        "jquery": "lib/jquery-1.3.2",
        "piechart": "core/piechart"
    }
});
var requireV3=require.config({
    context:"context-v3",
    paths: {
        "jquery": "lib/jquery-3.1.1",
        "piechart": "core/piechart"
    }
});
requireV1(['jquery', 'piechart'], function ($, piechart) {
    if (document.readyState == "complete") {//当页面加载状态 
        $("#piechart").piechart({
            width: 300,
            height: 300,
            dataArray: dataArray,
            tooltip: true
        });
    } else {
        $(document).ready(function () {
            $("#piechart").piechart({
                width: 300,
                height: 300,
                dataArray: dataArray,
                tooltip: true
            });
        });
    }

});

