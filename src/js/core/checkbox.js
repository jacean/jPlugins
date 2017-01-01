;
(function () {

    var defaultOptions = {

    }
    var JCheckBox = function (_dom, _options) {
        this.$main = _dom;
        this.id = this.$main.attr("id");
        this.css = "jCheckBox";
        this.options = $.extend(defaultOptions, _options);

        this.init();
    }

    JCheckBox.prototype = {
        init: function () {
            var input = this.$main;
            var id = this.id;
            input.attr('jTag', 'checkbox');
            var html = '<div id="jCR_' + id + '"">';
            html += '<div id="jCRH_' + id + '"></div></div>';
            var $html = $(html);
            $html.insertBefore(input);
            $('#jCRH_' + id).append(input);
            $('#jCRH_' + id).hide();
            $html.click(this.toggle.bind(this));
            this.refresh();
        },
        updateUI: function () {
            var id = this.id;
            var css = this.css;

            if (this.$main.attr('disabled')) {
                $('#jCR_' + id).removeClass(css + '_On');
                $('#jCR_' + id).removeClass(css + '_Off');

                if (eval($('#' + id).attr('checked'))) {
                    $('#jCR_' + id).addClass(css + '_NoOn');
                } else {
                    $('#jCR_' + id).addClass(css + '_No');
                }
            } else {
                $('#jCR_' + id).removeClass(css + '_No');
                if (eval($('#' + id).attr('checked'))) {
                    $('#jCR_' + id).addClass(css + '_On');
                    $('#jCR_' + id).removeClass(css + '_Off');
                } else {
                    $('#jCR_' + id).removeClass(css + '_On');
                    $('#jCR_' + id).addClass(css + '_Off');
                }
            }
        },
        select: function () {
            if (!this.enable()) return;
            this.clear();
            this.$main.attr("checked", true);
            this.updateUI();
        },
        unselect: function () {
            if (!this.enable()) return;
            this.clear();
            this.$main.attr("checked", false);
            this.updateUI();

        },
        toggle: function () {
            if (!this.enable()) return;
            if (this.$main.attr("checked")) {
                this.unselect();
            } else {
                this.select();
            }
        },
        clear: function () {
            var id = this.id;
            var css = this.css;
            $('#jCR_' + id).removeClass(css + '_On');
            $('#jCR_' + id).removeClass(css + '_Off');
            $('#jCR_' + id).removeClass(css + '_No');
            $('#jCR_' + id).removeClass(css + '_NoOn');
        },
        enable: function () {
            return !this.$main.attr("disabled") ;
        },
        refresh: function () {
            this.updateUI();
        },
        refreshAll: function () {
            var $jc = $("[jTag='checkbox']");
            $jc.each(function () {
                $(this).data("jCheckBox").refresh();
            });
        }
    }
    JRadioBox = function (_dom, _options) {
        this.$main = _dom;
        this.id = this.$main.attr("id");
        this.css = "jRadio";
        this.name = this.$main.attr("name");
        this.options = $.extend(defaultOptions, _options);

        this.init();
    }
    //同时只能选中一个
    JRadioBox.prototype = {
        init: function () {
            var input = this.$main;
            var id = this.id;
            var name = this.name;
            input.attr('jTag', 'radiobox');
            var html = '<div id="jCR_' + id + '"">';
            html += '<div id="jCRH_' + id + '"></div></div>';
            var $html = $(html);
            $html.insertBefore(input);
            $('#jCRH_' + id).append(input);
            $('#jCRH_' + id).hide();
            $html.click(this.select.bind(this));
            this.refresh();
        },
        updateUI: function () {
            var id = this.id;
            var css = this.css;
            if (this.$main.attr('disabled')) {
                this.clear();

                if (eval($('#' + id).attr('checked'))) {
                    $('#jCR_' + id).addClass(css + '_NoOn');
                } else {
                    $('#jCR_' + id).addClass(css + '_No');
                }
            } else {
                this.clear();
                if (eval($('#' + id).attr('checked'))) {
                    $('#jCR_' + id).addClass(css + '_On');
                    $('#jCR_' + id).removeClass(css + '_Off');
                } else {
                    $('#jCR_' + id).removeClass(css + '_On');
                    $('#jCR_' + id).addClass(css + '_Off');
                }
            }
        },
        select: function () {
            if (!this.enable()) return;
            this.clear();
            this.$main.attr("checked", true);
            this.refreshAll();


        },
        unselect: function () {
            if (!this.enable()) return;
            this.clear();
            this.$main.attr("checked", false);
            this.updateUI();
            this.refreshAll();

        },
        toggle: function () {
            if (!this.enable()) return;
            if (this.$main.attr("checked")) {
                this.unselect();
            } else {
                this.select();
            }
        },
        clear: function () {
            var id = this.id;
            var css = this.css;
            $('#jCR_' + id).removeClass(css + '_On');
            $('#jCR_' + id).removeClass(css + '_Off');
            $('#jCR_' + id).removeClass(css + '_No');
            $('#jCR_' + id).removeClass(css + '_NoOn');
        },
        enable: function () {
            return !this.$main.attr("disabled");
        },
        refresh: function () {
            this.updateUI();
        },
        refreshAll: function () {
            var $jc = $("[jTag='radiobox']");
            $jc.each(function () {
                $(this).data("jRadioBox").refresh();

            });
        }
    }

    jUI = {
        checkbox: function (selector, options) {
            $(selector).each(function () {
                $(this).data('jCheckBox', new JCheckBox($(this), options));
            });
            return $(selector);
        },
        radiobox: function (selector, options) {
            $(selector).each(function () {
                $(this).data('jRadioBox', new JRadioBox($(this), options));
            });
            return $(selector);
        }
    }
    $.extend(window.jUI, jUI);
})();