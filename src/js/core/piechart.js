!function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(root.jQuery);
    }
} (this, function ($) {
    'use strict';

    var defaultOptions = {
        width: 300,
        height: 300,
        dataArray: [],
        // legend: false,               //是否需要legend图例，需要的话宽度应适当增加，或是给定比例
        // separate: false,             //各个扇形块之间是否分离，分离圆心半径多少
        tooltip: true
    }


    var PieChart = function (_dom, _options) {
        this.$pie = _dom;
        this.$pie.addClass('pie-container');
        this.options = $.extend(defaultOptions, _options);
        this.init();
    }
    PieChart.prototype = {
        init: function () {
            this.width = this.options.width;
            this.height = this.options.height;
            var canvas = $("<canvas>您的浏览器不支持canvas，建议使用最新版的Chrome</canvas>");
            this.$pie.width(this.width).height(this.height);
            this.$pie.append(canvas);
            this.canvas = canvas[0];
            this.canvas.left = 0;
            this.canvas.top = 0;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            // this.canvas.style.border = "dashed 1px";
            this.ctx = this.canvas.getContext("2d");
            this.center = {
                x: this.width / 2,
                y: this.height / 2
            }
            this.radius = Math.max(this.width, this.height) / 2 - this.width / 30;
            this.basenum = this.width / 100;
            this.render();
            this.setOverEvent();
        },
        /**
         * angle:角度最大值是Math.PI*2,可以通过Math.PI*2*[0,1]来确定角度,[0,1]作为百分比参数
         * 
         */
        render: function () {
            this.renderPie();
        },
        clearArea: function (x, y, radius, startAngle, endAngle) {
            var ctx = this.ctx;
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, startAngle, endAngle, false);
            ctx.fill();
            ctx.clip();
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.closePath();
            ctx.restore();
        },
        drawSector: function (i) {
            var dataArray = this.options.dataArray;
            var startAngle = dataArray[i].startAngle;
            var endAngle = dataArray[i].endAngle;
            var style = dataArray[i].style;
            var ctx = this.ctx;
            ctx.beginPath();
            ctx.fillStyle = style;
            ctx.moveTo(this.center.x, this.center.y);
            ctx.arc(this.center.x, this.center.y, this.radius, startAngle, endAngle, false);//顺时针画
            ctx.fill();
            ctx.closePath();
        },
        clearSector: function (i) {
            var dataArray = this.options.dataArray;
            var startAngle = dataArray[i].startAngle;
            var endAngle = dataArray[i].endAngle;
            this.clearArea(this.center.x, this.center.y, this.radius + this.basenum, startAngle, endAngle);

        },
        drawOverSector: function (i) {
            var dataArray = this.options.dataArray;
            var startAngle = dataArray[i].startAngle;
            var endAngle = dataArray[i].endAngle;

            var style = dataArray[i].style;
            var ctx = this.ctx;
            var angle = 1.0 * (startAngle + endAngle) / 2;
            var inner = 10;
            var newPoint = {
                x: this.center.x + inner * Math.cos(angle),
                y: this.center.y + inner * Math.sin(angle)
            }
            ctx.save();
            for (var i = 0; i < this.width / 100; i += 0.1) {
                ctx.shadowColor = '#ae9696';
                ctx.shadowOffsetX = i;
                ctx.shadowOffsetY = i;
                ctx.shadowBlur = i;
                ctx.beginPath();
                ctx.fillStyle = style;
                ctx.moveTo(newPoint.x, newPoint.y);
                ctx.arc(newPoint.x, newPoint.y, this.radius, startAngle, endAngle, false);//顺时针画
                ctx.fill();
                ctx.closePath();
            }
            ctx.restore();
        },
        clearOverSector: function (i) {
            var dataArray = this.options.dataArray;
            var startAngle = dataArray[i].startAngle;
            var endAngle = dataArray[i].endAngle;
            var num = dataArray.length;
            var angle = 1.0 * (startAngle + endAngle) / 2;
            var inner = 10;
            var newPoint = {
                x: this.center.x + inner * Math.cos(angle),
                y: this.center.y + inner * Math.sin(angle)
            }
            //这里是经验数值，确保清理浮动扇形干净
            this.clearArea(newPoint.x, newPoint.y, this.radius + this.basenum * 3, startAngle - 0.08, endAngle + 0.08);

            this.drawSector(i > 0 ? i - 1 : num - 1);
            this.drawSector(i + 1 == num ? 0 : i + 1);
        },
        /**
         * 应当可自定义起始角度
         */
        renderPie: function () {
            var ctx = this.ctx;
            var dataArray = this.options.dataArray;
            var angle, startAngle, endAngle, start, end;
            start = { x: 0, y: 0 };
            end = { x: 0, y: 0 };
            endAngle = 0;
            for (var i = 0; i < dataArray.length; i++) {
                start = end;
                startAngle = endAngle;
                angle = Math.PI * 2 * dataArray[i].percent / 100;
                endAngle += angle;
                this.options.dataArray[i].startAngle = startAngle;
                this.options.dataArray[i].endAngle = endAngle;
                this.drawSector(i);
            };

        },
        tooltip: {
            enable: true,
            dom: null
        },
        renderToolTip: function () {
            var self = this;
            this.tooltip.dom = $("<div class='pie-tooltip'>" +
                "<span id='pie-title' class='pie-title'></span>" +
                "<br><span id='pie-percent' class='pie-percent'></span>" +
                "<br><span id='pie-tip' class='pie-tip'></span>" +
                "</div>");
            this.tooltip.dom.width(this.options.width / 3);
            this.tooltip.dom.height(this.options.height / 4);
            this.tooltip.dom.appendTo(this.$pie);
            this.tooltip.dom.hide();
            //设置tooltip的内容显示
            this.tooltip.setValue = function (o) {
                self.tooltip.dom.find('#pie-title').html(o.title);
                self.tooltip.dom.find('#pie-tip').html(o.tip);
                self.tooltip.dom.find('#pie-percent').html(o.percent);
            }
        },
        showToolTip: function (p) {
            var mx = p.x,
                my = p.y;
            var dx = mx - this.center.x,
                dy = this.center.y - my;
            var dis = Math.sqrt(dx * dx + dy * dy);
            var dataArray = this.options.dataArray;
            if (dis > this.radius) {
                this.tooltip.dom.hide();
                return;
            }
            //计算鼠标所在角度来确定鼠标在哪个扇形区域
            var angle = Math.atan2(dy, dx);
            if (angle < 0) {
                angle = angle + Math.PI * 2;
            }
            angle = Math.PI * 2 - angle;//匹配画扇形所用的顺时针角度
            this.tooltip.dom.css({ left: mx, top: my });

            if (this.status == null) {
                this.tooltip.dom.hide();
            } else {
                this.tooltip.dom.show();
                this.tooltip.setValue(dataArray[this.status]);
            }

        },
        showOver: function (p) {
            var mx = p.x,
                my = p.y;
            var dx = mx - this.center.x,
                dy = this.center.y - my;
            var dis = Math.sqrt(dx * dx + dy * dy);
            var dataArray = this.options.dataArray;
            if (dis > this.radius) {
                if (this.status != null) {
                    var oi = this.status;
                    this.clearOverSector(oi);
                    this.drawSector(oi);
                    this.status = null;
                }
                return;
            }
            //计算鼠标所在角度来确定鼠标在哪个扇形区域
            var angle = Math.atan2(dy, dx);
            if (angle < 0) {
                angle = angle + Math.PI * 2;
            }
            angle = Math.PI * 2 - angle;//匹配画扇形所用的顺时针角度
            for (var i = 0; i < dataArray.length; i++) {
                if (angle > dataArray[i].startAngle && angle < dataArray[i].endAngle) {
                    if (this.status == null) {
                        this.status = i;
                        this.clearSector(i);
                        this.drawOverSector(i);
                    }
                    if (this.status != i && this.status != null) {
                        //先把旧的恢复
                        var oi = this.status;
                        this.clearOverSector(oi);
                        this.drawSector(oi);
                        this.status = i;
                        this.clearSector(i);
                        this.drawOverSector(i);
                    }
                    if (this.status == i) {
                    }
                }
            }
        },
        setOverEvent: function () {

            var self = this;
            this.renderToolTip();
            //把事件绑定在容器上，以使鼠标在tooltip上时仍然可以流畅滑动
            this.$pie[0].addEventListener("mousemove", function (event) {
                event.stopPropagation();

                var x = event.pageX;
                var y = event.pageY;
                var pie = event.currentTarget;//target是子元素
                var bbox = pie.getBoundingClientRect();//相对于浏览器视窗的rect
                pie = $(pie);
                var loc = {
                    x: x - bbox.left * (pie.width() / bbox.width),
                    y: y - bbox.top * (pie.height() / bbox.height)
                };
                self.showOver(loc);
                if (self.options.tooltip) {
                    self.showToolTip(loc);
                }


            }, true);//采用事件捕获的方法

        },
        renderLegend: function () {

        }
    }


    $.fn.piechart = function (options) {
        this.each(function () {
            $(this).data('piechart', new PieChart($(this), options));
            // this.dataset.fixtable=JSON.stringify(new FixTable($(this),options)).replace(/'/g, "\\'");
        });
        return this;
    }



});