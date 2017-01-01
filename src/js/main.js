require.config({

    paths: {
        "jquery": "lib/jquery-3.1.1",
        "piechart": "core/piechart"
    }
});
require(['jquery', 'piechart'], function ($, piechart) {
    $(document).ready(function () {
        $("#piechart").piechart({
            width: 300,
            height: 300,
            dataArray: dataArray,
            tooltip: true
        });
    });
});