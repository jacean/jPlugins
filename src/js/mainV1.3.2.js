var requireV1 = require.config({
    baseUrl: "../../src/js",
    shim: {
        'jquery': {
            exports: "$"
        },
        'checkbox':{
            deps:['jquery']
        }
    },
    context: "context-v1",
    paths: {
        "jquery": "lib/jquery-1.3.2",
        "piechart": "core/piechart",
        "checkbox":"core/checkbox"
    }
});
var requireV3 = require.config({
    baseUrl: "../../src/js",
    context: "context-v3",
    paths: {
        "jquery": "lib/jquery-3.1.1",
        "piechart": "core/piechart"
    }
});


