"use strict";

;(function ($, window, document, undefined) {
    var nowrow = "";
    var nowcolumn = "";
    var gridWidth = "";
    var gridHeight = "";
    var rowWidth = [];
    var ColumnHeight = [];
    var WHequals = false;
    var hasEcharts = [];
    var allDivPositionByRow = [];
    var selectedChartInfo = "";
    var chartCoordinate = []; //页面已添加组件及详细信息列表名单
    var setting = {
        "urlHead": "http://localhost:8080/", //请求地址开头
        "row": 24, //页面行数划分
        "PageId": "", //页面Id
        "column": 24, //页面列数划分
        "permission": 0, //用户权限(0为用户，1为管理员)
        "custom": { "sys_id": 8208, "startTime": 1543852800, "endTime": 1543939200 }, //用户自定义传输数据（用于传递给后台）
        "refreshTime": 1000 * 60,
        "pageId": "",
        "parentContent": ""
        //插件默认颜色
    };var colorDefault = {
        backgroundColor: "#1890ff", //整体背景颜色
        backgroundImage: "", //整体背景图片（可选）
        modalHeadColor: "#003c78", //弹出模态框头部颜色
        modalContentColor: "red", //弹出模态框内容颜色
        modalFootColor: "red", //弹出模态框底部颜色
        tableThColor: "#red", //弹出模态框内表格表头颜色
        textColor: "#333", //整体字体颜色
        successColor: "green", //成功颜色（状态色）
        failColor: "red", //失败/警告颜色（状态色）
        toolBorder: "1px solid #333", //工具栏边框
        ComBorder: "rgba(93, 186, 240, 0.938) solid 1px", //添加组件边框
        lineBorder: "rgb(238, 238, 238)", //点击布局时分割线边框（颜色）
        hideBorder: "rgb(255, 255, 255)", //隐藏分割线时分割线边框（颜色）
        chartToolColor: "rgba(245, 249, 252, 0.979)", //添加组件时移至组件头部出现的工具栏颜色
        toolIconColor: "#333", //工具栏图表颜色
        iconBorder: "1px solid #333", //工具栏图表边框
        ToolClickColor: "rgba(68, 150, 228, 0.637)", //选择布局时点击8*8,16*16时区域背景色
        ToolDefaultColor: "rgb(255, 255, 255)" //未选择布局时8*8,16*16背景色

        // <div><input type=\"checkbox\" value=\"same\" id=\"same\">宽高相等</div>
        // <div id=\"pagination\" class=\"dg-pagination\"></div>
        //需要添加的模态框和提示框代码
    };var TOOL = "<div class=\"dg-mytools\"><div id=\"openmodal\" title=\"添加组件至界面\" class=\"dg-danger-hide\"><span class=\"glyphicon glyphicon-plus dg-tool-icon\"></span></div><div id=\"hideline\" title=\"隐藏/显示分割线\"><span class=\"glyphicon glyphicon-remove dg-tool-icon\"></span></div><div id=\"savecharts\" title=\"保存图表信息\"><span class=\"glyphicon glyphicon-saved dg-tool-icon\"></span></div><div id=\"addcharts\" title=\"新增组件\"><span class=\"glyphicon glyphicon-wrench dg-tool-icon\"></span></div><div id=\"Editcharts\" title=\"管理组件\"><span class=\"glyphicon glyphicon-book dg-tool-icon\"></span></div><div id=\"EditUserCharts\" title=\"管理用户已添加组件\"><span class=\"glyphicon glyphicon-th dg-tool-icon\"></span></div><div id=\"newAdd\" title=\"新设置\"><span class=\"glyphicon glyphicon-wrench dg-tool-icon\"></span></div><div id=\"changeSkin\" title=\"换肤\"><span class=\"glyphicon glyphicon-flash dg-tool-icon\"></span></div></div>";
    var LAYOUT = "<div id=\"dg-choseMine\"><span class=\"dg-RowLine\">布局选择:</span><button class=\"dg-chosePiece\">4x4</button><button class=\"dg-choseMDPiece\">8X8</button><button class=\"dg-choseLGPiece\">16x16</button><div class=\"dg-choseMineStyle\"><label class=\"hideMine\">行数：</label><select id=\"chartRow\" class=\"hideMine\"></select><label>列数：</label><select id=\"chartColumn\"></select></div><div class=\"dg-mydecision\"><button id=\"customize\" class=\"dg-btn\">自定义</button></div><a style=\"text-decoration:none\" id=\"dg-backTo\" class=\"dg-choseMineStyle\">返回</a></div>";
    var HIDE = "<div id=\"dg-hideOption\"><span class=\"glyphicon glyphicon-list dg-tool-icon\"></span></div>";
    var MODAL1 = "<div class=\"modal fade dg-mineset\" id=\"myModal\" tabindex=\"-1\" role=\"dialog\"  aria-hidden=\"true\"><div class=\"dg-modal-dialog modal-dialog\"><div class=\"dg-modal-content\"><div class=\"dg-modal-header\"><span class=\"dg-modal-title\">自定义监控组件</span></div><div class=\"dg-modal-body\"><form class=\"dg-select-out\"><div class=\"dg-modal-group\"><label class=\"dg-mylabel\">组件名称：</label><select class=\"dg-model-select\" id=\"mylist\"></select></div><div class=\"dg-modal-group\"><label class=\"dg-mylabel\">宽度所占列数：</label><select class=\"dg-model-select\" id=\"echartColumn\"></select></div><div class=\"dg-modal-group\"><label class=\"dg-mylabel\">高度所占行数：</label><select class=\"dg-model-select\" id=\"echartRow\"></select></div><div class=\"dg-modal-group\"><label class=\"dg-mylabel\">存在边框：</label><select class=\"dg-model-select\" id=\"borderExists\"><option value=\"true\">是</option><option value=\"false\">否</option></select></div></form></div><div class=\"dg-modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" class=\"btn btn-primary\" id=\"getcomponent\">确定</button></div></div></div></div>";
    var MODAL2 = "<div class=\"modal fade dg-mineset\" id=\"editMyModal\" tabindex=\"-1\" role=\"dialog\"  aria-hidden=\"true\"><div class=\"dg-modal-dialog modal-dialog\"><div class=\"dg-modal-content\"><div class=\"dg-modal-header\"><span class=\"dg-modal-title\">编辑组件</span></div><div class=\"dg-modal-body\"><form class=\"dg-select-out\"><div class=\"dg-modal-group\"><label class=\"dg-mylabel\">宽度所占列数：</label><select class=\"dg-model-select\" id=\"editColumn\"></select></div><div class=\"dg-modal-group\"><label class=\"dg-mylabel\">高度所占行数：</label><select class=\"dg-model-select\" id=\"editRow\"></select></div><div class=\"dg-modal-group\"><label class=\"dg-mylabel\">存在边框：</label><select class=\"dg-model-select\" id=\"editBorder\"><option value=\"true\">是</option><option value=\"false\">否</option></select></div></form></div><div class=\"dg-modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" class=\"btn btn-primary\" id=\"editComponent\">确定</button></div></div></div></div>";
    var MODAL3 = "<div class=\"modal fade dg-mineset\" id=\"myAlert\" tabindex=\"-1\" role=\"dialog\"  aria-hidden=\"true\"><div class=\"dg-modal-dialog modal-dialog modal-sm\"><div class=\"dg-modal-content\"><div class=\"dg-modal-body dg-alert\"></div><div class=\"dg-confirm-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\" id=\"removeDefault\">关闭</button><button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\" id=\"eveSure\">确定</button></div></div></div></div>";
    var MODAL5 = "<div class=\"modal fade dg-mineAddset\" id=\"EditCom\" style=\"width:695px\" tabindex=\"-1\" role=\"dialog\"  aria-hidden=\"true\"><div class=\"dg-modal-dialog modal-dialog\" style=\"width:695px !important\"><div class=\"dg-modal-content\"><div class=\"dg-modal-header\" style=\"background-color:" + colorDefault.modalHeadColor + "\"><span class=\"dg-modal-title\" id=\"myModalEdit\">管理监控组件</span><button type=\"button\" class=\"dg-close\" data-dismiss=\"modal\" aria-hidden=\"true\" style=\"background-color:" + colorDefault.modalHeadColor + "\">&times;</button></div><div class=\"dg-modal-content\"><table class=\"table\" style=\"margin-bottom:0\"><thead> <tr class=\"tableTh\"><th style=\"width:40%\">组件名称</th><th style=\"width:15%\">状态</th><th style=\"width:45%;text-align:center\">操作</th></tr></thead><tbody id=\"deleteCom\"></tbody></table></div></div></div></div>";
    var MODAL6 = "<div class=\"modal fade dg-mineAddset\" id=\"EditUserCom\" tabindex=\"-1\" role=\"dialog\"  aria-hidden=\"true\"><div class=\"dg-modal-dialog modal-dialog\"><div class=\"dg-modal-content\"><div class=\"dg-modal-header\"><span class=\"dg-modal-title\" id=\"myModalUser\">管理用户已添加组件</span><button type=\"button\" class=\"dg-close\" data-dismiss=\"modal\" aria-hidden=\"true\" style=\"background-color:" + colorDefault.modalHeadColor + "\">&times;</button></div><div class=\"dg-modal-content\"><table class=\"table\" style=\"margin-bottom:0\"><thead> <tr class=\"tableTh\"><th style=\"width:40%\">组件名称</th><th style=\"width:30%\">坐标</th><th style=\"width:30%\">操作</th></tr></thead><tbody id=\"deleteUserCom\"></tbody></table></div></div></div></div>";
    var MODAL7 = "<div class=\"modal fade dg-mineAddset\" id=\"ChartModal\" style=\"overflow-y: hidden;\" tabindex=\"-1\" role=\"dialog\"  aria-hidden=\"true\"><div class=\"dg-modal-dialog modal-dialog\"><div class=\"dg-modal-content\"><div class=\"dg-modal-header\"><span class=\"dg-modal-title\" id=\"myModalChart\">添加监控组件</span></div><div class=\"dg-modal-body\"><form class=\"dg-select-out\"><div class=\"input-group\"><span class=\"dg-input-left-style\">组件ID：</span><input type=\"text\" id=\"chartId\" class=\"dg-inputS\" placeholder=\"请输入组件ID\"><span class=\"dg-impState\">*</span></div><br><div class=\"input-group\"><span class=\"dg-input-left-style\">组件名称：</span><input type=\"text\" id=\"chartName\" class=\"dg-inputS\" placeholder=\"请输入组件名称\"><span class=\"dg-impState\">*</span></div><br><div class=\"input-group\"><span class=\"dg-input-left-style\">组件标题：</span><input type=\"text\" id=\"chartTitle\" class=\"dg-inputS\" placeholder=\"请输入组件标题\"></div><br><div class=\"input-group\"><span class=\"dg-input-left-style\">最小宽度：</span><input type=\"text\" id=\"minWidth\" class=\"dg-inputS\" placeholder=\"请输入最小宽度\"></div><br><div class=\"input-group\"><span class=\"dg-input-left-style\">最小高度：</span><input type=\"text\" id=\"minHeight\" class=\"dg-inputS\" placeholder=\"请输入最小高度\"></div><br><div class=\"input-group\"><span class=\"dg-input-left-style\">跳转链接名：</span><input type=\"text\" id=\"urlName\" class=\"dg-inputS\" placeholder=\"请输入链接名\"></div><br><div class=\"input-group\"><span class=\"dg-input-left-style\">跳转链接地址：</span><input type=\"text\" id=\"Adress\" class=\"dg-inputS\" placeholder=\"请输入跳转地址\"></div><br><div class=\"input-group\"><span class=\"dg-input-left-style\">添加组件类型：</span><select class=\"dg-model-select dg-inputS\" id=\"newType\"><option value=\"\">请选择组件类型</option><option value=\"iframe\">iframe框架</option><option value=\"echarts\">echarts图表</option></select><span class=\"dg-impState\">*</span></div><br><div class=\"input-group\"><span class=\"dg-input-left-style\">是否为实时组件：</span><select class=\"dg-model-select dg-inputS\" id=\"realTime\"><option value=\"1\">是</option><option value=\"0\">否</option></select><span class=\"dg-impState\">*</span></div><br><div class=\"input-group\"><span class=\"dg-input-left-style changAddress\">数据请求地址：</span><input type=\"text\" id=\"chartUrl\" class=\"dg-inputS\" placeholder=\"请输入相对请求地址\"><span class=\"dg-impState\">*</span></div><br><div class=\"dg-modal-group\" id=\"Mycode\"><label class=\"dg-chartLabel\" style=\"display:none\">组件前端代码：</label><textarea id=\"chartCode\" rows=\"5\" cols=\"65\" style=\"display:none\"></textarea></div></form></div><div class=\"dg-modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">关闭</button><button type=\"button\" class=\"btn btn-primary\" id=\"addmychart\">确定</button></div></div></div></div>";
    jQuery.support.cors = true;
    //根据情况显示隐藏布局设置
    function hideByState() {
        if (chartCoordinate.length !== 0) {
            $(".dg-chosePiece").attr("disabled", "disabled");
            $(".dg-chosePiece").css("background-color", "rgb(221, 221, 221)");
            $(".dg-choseMDPiece").attr("disabled", "disabled");
            $(".dg-choseMDPiece").css("background-color", "rgb(221, 221, 221)");
            $(".dg-choseLGPiece").attr("disabled", "disabled");
            $(".dg-choseLGPiece").css("background-color", "rgb(221, 221, 221)");
            $("#customize").attr("disabled", "disabled");
            $("#customize").css("background-color", "rgb(221, 221, 221)");
        } else {
            $(".dg-chosePiece").removeAttr("disabled");
            $(".dg-chosePiece").css("background-color", "rgb(255, 255, 255)");
            $(".dg-choseMDPiece").removeAttr("disabled");
            $(".dg-choseMDPiece").css("background-color", "rgb(255, 255, 255)");
            $(".dg-choseLGPiece").removeAttr("disabled");
            $(".dg-choseLGPiece").css("background-color", "rgb(255, 255, 255)");
            $("#customize").removeAttr("disabled");
            $("#customize").css("background-color", "rgb(51, 122, 183)");
        }
    }
    //添加echarts图表及拖拽事件
    function appendEchart(id, name, url, selectBorder, widthColumn, heightRow, title, url_info, realTime) {
        url_info = undefined ? "" : url_info;
        var option = {};
        var param = setting.custom;
        var width = widthColumn * gridWidth;
        var height = heightRow * gridHeight;
        $.ajax({
            url: url,
            type: "post",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(param),
            async: false,
            success: function success(res) {
                for (var i in res) {
                    option[i] = eval("(" + res[i] + ")");
                }
                $("#dg-mainCom").append("<div id=\"" + id + "\" style=\"z-index:2\"></div>");
                $("#" + id).css('position', 'relative');
                $("#" + id).css('display', 'inline-block');
                $("#" + id).css("cursor", "move");
                $("#" + id).css('width', width + "px");
                $("#" + id).css('height', height + "px");
                var mychart = echarts.init(document.getElementById(id));
                mychart.setOption(option);
                eachTool(id, width, title, url, url_info, realTime);
                if (selectBorder == "true") {
                    $("#" + id).css("border", colorDefault.ComBorder);
                };
                var errorcode = 0;
                for (var _i = 0; _i < chartCoordinate.length; _i++) {
                    var item = chartCoordinate[_i];
                    if (item.id == id) {
                        item.style.border = selectBorder;
                        errorcode = 1;
                    }
                }
                if (errorcode == 0) {
                    var leftColumn = $("#" + id)[0].offsetLeft / gridWidth;
                    var topRow = $("#" + id)[0].offsetTop / gridHeight;
                    chartCoordinate.push({ "id": id, "type": "echarts", "realTime": realTime, "url_info": url_info, "url": url, "title": title, "component_name": name, "style": { "leftColumn": leftColumn, "topRow": topRow, "widthColumn": widthColumn, "heightRow": heightRow, "border": selectBorder } });
                }
                drag(id);
                hasEcharts.push({ "id": id, "echart": mychart });
            }
        });
        if (realTime == "1") {
            var echartId = "echart" + id;
            window[echartId] = setInterval(function () {
                $.ajax({
                    url: url,
                    type: "post",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(setting.custom),
                    async: false,
                    success: function success(res) {
                        var option1 = {};
                        for (var i in res) {
                            option1[i] = eval("(" + res[i] + ")");
                        }
                        var mychart = echarts.init(document.getElementById(id));
                        mychart.setOption(option1, true);
                    }
                });
            }, eval(setting.refreshTime));
        }
    }
    //添加iframe框架及拖拽事件
    function appendIframe(id, name, url, selectBorder, widthColumn, heightRow, title, url_info, realTime) {
        var width = widthColumn * gridWidth;
        var height = heightRow * gridHeight;
        $("#dg-mainCom").append("<div id=" + id + " style=\"width:" + width + "px;height:" + height + "px;display:inline-block;position: relative\"><iframe  src=" + url + " style=\"width:" + width + "px;height:" + height + "px;display:inline-block;position:relative;overflow:hidden;\" scrolling=\"no\" frameborder=\"0\"></iframe></div>");
        $("#" + id).css("cursor", "move");
        eachTool(id, width, title, url, url_info, realTime);
        if (selectBorder == "true") {
            $("#" + id).css("border", colorDefault.ComBorder);
        }
        drag(id);
        var leftColumn = 0;
        var topRow = 0;
        chartCoordinate.push({ "id": id, "type": "iframe", "realTime": realTime, "url_info": url_info, "url": url, "title": title, "component_name": name, "style": { "leftColumn": leftColumn, "topRow": topRow, "widthColumn": widthColumn, "heightRow": heightRow, "border": selectBorder } });
        if (realTime == "1") {
            setInterval(function () {
                $("#" + id).remove();
                $("#dg-mainCom").append("<div id=" + id + " style=\"width:" + (width + 1) + "px;height:" + (height + 2) + "px;display:inline-block;position: relative\"><iframe  src=" + url + " style=\"width:" + width + "px;height:" + height + "px;display:inline-block;position:relative;overflow:hidden;\" scrolling=\"no\" frameborder=\"0\"></iframe></div>");
                $("#" + id).css("cursor", "move");
                eachTool(id, width, title, url, url_info, realTime);
                if (selectBorder == "true") {
                    $("#" + id).css("border", colorDefault.ComBorder);
                }
                drag(id);
            }, eval(setting.refreshTime));
        }
    }
    //每个div的工具栏功能
    function eachTool(id, width, title, url, url_info, realTime) {
        title == undefined ? "" : title;
        if (url_info !== "" && url_info !== undefined) {
            var urlInfo = JSON.parse(url_info);
            $("#" + id).append("<a href=\"" + urlInfo.url + "\" style=\"position:absolute;top:40px;right:10px\">" + urlInfo.name + "</a>");
        }
        $("#" + id).append("<div id=\"tool" + id + "\" style=\"width:" + (width - 1) + "px;background-color:" + colorDefault.chartToolColor + "\" class=\"dg-delete dg-mytool\"><span style=\"user-select:none;-ms-user-select:none;\" onselectstart=\"return false;\">" + title + "</span><div style=\"position:absolute;top:5px;right:0\"><div class=\"toolg\" title=\"\u91CD\u65B0\u8BBE\u7F6E\u8BE5\u6A21\u5757\" id=\"resert" + id + "\"></div><div class=\"toolr\" id=\"delete" + id + "\" title=\"\u5173\u95ED\u8BE5\u6A21\u5757\"></div></div></div>");
        // $("#"+id)[0].addEventListener("mouseout",function(){
        //     $("#tool"+id).css("display","none")
        // })
        // $("#"+id)[0].addEventListener("mouseover",function(){
        //     $("#tool"+id).css("display","inherit")
        // })
        //删除图形
        $("#delete" + id).on("click", function (e) {
            $("#" + id).remove();
            var echartId = "echart" + id;
            clearInterval(window[echartId]);
            for (var i = 0; i < chartCoordinate.length; i++) {
                var item = chartCoordinate[i];
                if (item.id == id) {
                    var index = chartCoordinate.indexOf(item);
                    chartCoordinate.splice(index, 1);
                }
            }
            hideByState();
        });
        $("#resert" + id).on("click", function (e) {
            $("#editRow")[0].innerHTML = "";
            $("#editColumn")[0].innerHTML = "";
            for (var i = 1; i <= nowrow; i++) {
                $("#editRow").append("<option>" + i + "</option>");
            }
            for (var _i2 = 1; _i2 <= nowcolumn; _i2++) {
                $("#editColumn").append("<option>" + _i2 + "</option>");
            }

            var _loop = function _loop(_i3) {
                var item = chartCoordinate[_i3];
                if (item.id == id) {
                    var startLeft = item.style.leftColumn * gridWidth;
                    var startTop = item.style.topRow * gridHeight;
                    var type = item.type;
                    var _width = item.style.widthColumn;
                    var height = item.style.heightRow;
                    $("#editRow").val(height);
                    $("#editColumn").val(_width);
                    $("#editMyModal").modal("show");
                    $("#editComponent").on("click", function () {
                        var editSelectBorder = $("#editBorder")[0].value;
                        var editWidthColumn = $("#editColumn").val();
                        var editHeightRow = $("#editRow").val();
                        var editWidth = gridWidth * editWidthColumn;
                        var editHeight = gridHeight * editHeightRow;
                        item.style.widthColumn = $("#editColumn").val();
                        item.style.heightRow = $("#editRow").val();
                        item.style.border = editSelectBorder;
                        if (editSelectBorder == "true") {
                            $("#" + id).css("border", colorDefault.ComBorder);
                        } else {
                            $("#" + id).css("border", "");
                        }
                        if (type == "echarts") {
                            $("#" + id).css("width", editWidth + "px");
                            $("#" + id).css("height", editHeight + "px");
                            $("#tool" + id).css("width", editWidth + "px");
                            var option = {};
                            $.ajax({
                                url: url,
                                type: "post",
                                contentType: "application/json;charset=UTF-8",
                                data: JSON.stringify(setting.custom),
                                async: false,
                                success: function success(res) {
                                    for (var _i4 in res) {
                                        option[_i4] = eval("(" + res[_i4] + ")");
                                    }
                                    var mychart = echarts.init(document.getElementById(id));
                                    mychart.resize();
                                    mychart.setOption(option, true);
                                }
                            });
                        }
                        if (type == "iframe") {
                            appendIframe(id, name, url, editSelectBorder, editWidth, editHeight, title, realTime);
                            $("#" + id).css("position", "absolute");
                            $("#" + id).css("top", startTop);
                            $("#" + id).css("left", startLeft);
                        }
                        $("#editMyModal").modal("hide");
                    });
                }
            };

            for (var _i3 = 0; _i3 < chartCoordinate.length; _i3++) {
                _loop(_i3);
            }
            return false;
        });
    }
    //添加拖拽监听事件
    function drag(id) {
        var widthColumn = void 0;
        var heightRow = void 0;
        var childId = "tool" + id;
        var isDown = false;
        var dragContent = {
            width: "",
            height: ""
        };
        var dragTarget = {
            width: "",
            height: ""
        };
        var param = {
            x: "",
            y: "",
            nowx: "",
            nowy: "",
            scrollTop: ""
        };
        var dragStart = function dragStart(event) {
            if (event.target.className == "toolg" || event.target.className == "toolr") {
                return false;
            }
            event.stopPropagation();
            for (var i = 0; i < chartCoordinate.length; i++) {
                var _item = chartCoordinate[i];
                if (_item.id == id) {
                    widthColumn = parseInt(_item.style.widthColumn);
                    heightRow = parseInt(_item.style.heightRow);
                    break;
                }
            }
            $("#" + id).css("z-index", "10");
            dragContent.width = $("#dg-mainCom")[0].clientWidth;
            dragContent.height = $("#dg-mainCom")[0].clientHeight;
            dragTarget.width = $("#" + id)[0].clientWidth;
            dragTarget.height = $("#" + id)[0].clientHeight;
            param.nowx = $("#" + id).position().left;
            param.nowy = $("#" + id).position().top;
            param.x = event.clientX;
            param.y = event.clientY;
            param.scrollTop = $(setting.parentContent).scrollTop();
            isDown = true;
        };
        var dragIng = function dragIng(event) {
            if (isDown) {
                var scrollTop = $(setting.parentContent).scrollTop();
                var canvasX = param.nowx + event.clientX - param.x;
                var canvasY = param.nowy + event.clientY - param.y + scrollTop - param.scrollTop;
                $("#" + id).css("position", "absolute");
                $("#" + id).css("left", canvasX + "px");
                $("#" + id).css("top", canvasY + "px");
                if (canvasX < 0) {
                    $("#" + id).css({ left: 0 });
                }
                if (canvasY < 0) {
                    $("#" + id).css({ top: 0 });
                }
                if (canvasX > dragContent.width - dragTarget.width) {
                    $("#" + id).css({ left: dragContent.width - dragTarget.width });
                }
                if (canvasY > dragContent.height - dragTarget.height) {
                    $("#" + id).css({ top: dragContent.height - dragTarget.height });
                }
            }
        };
        var dragEnd = function dragEnd(event) {
            if (isDown == true) {
                var correctPosition = function correctPosition() {
                    if (ChartIn.leftIn && ChartIn.rightIn == false && ChartIn.bottomLeftIn == false && ChartIn.bottomRightIn == false) {
                        // console.log("左上角重叠");
                        for (var _i7 = 0; _i7 < chartConflict.length; _i7++) {
                            var _item3 = chartConflict[_i7];
                            var conflictRightColumn = parseInt(_item3.style.leftColumn) + parseInt(_item3.style.widthColumn);
                            var deviation = conflictRightColumn - leftColumn;
                            leftColumn = conflictRightColumn;
                            rightColumn = rightColumn + deviation;
                        }
                    } else if (ChartIn.rightIn && ChartIn.leftIn == false && ChartIn.bottomLeftIn == false && ChartIn.bottomRightIn == false) {
                        // console.log("右上角重叠");
                        for (var _i8 = 0; _i8 < chartConflict.length; _i8++) {
                            var _item4 = chartConflict[_i8];
                            var _deviation = rightColumn - _item4.style.leftColumn;
                            rightColumn = _item4.style.leftColumn;
                            leftColumn = leftColumn - _deviation;
                        }
                    } else if (ChartIn.bottomLeftIn && ChartIn.leftIn == false && ChartIn.rightIn == false && ChartIn.bottomRightIn == false) {
                        // console.log("左下角重叠");
                        for (var _i9 = 0; _i9 < chartConflict.length; _i9++) {
                            var _item5 = chartConflict[_i9];
                            var _conflictRightColumn = parseInt(_item5.style.leftColumn) + parseInt(_item5.style.widthColumn);
                            var _deviation2 = leftColumn - _conflictRightColumn;
                            leftColumn = _conflictRightColumn;
                            rightColumn = rightColumn + _deviation2;
                        }
                    } else if (ChartIn.bottomRightIn && ChartIn.leftIn == false && ChartIn.bottomLeftIn == false && ChartIn.rightIn == false) {
                        // console.log("右下角重叠");
                        for (var _i10 = 0; _i10 < chartConflict.length; _i10++) {
                            var _item6 = chartConflict[_i10];
                            var _deviation3 = rightColumn - _item6.style.leftColumn;
                            rightColumn = _item6.style.leftColumn;
                            leftColumn = leftColumn - _deviation3;
                        }
                    } else if (ChartIn.leftLine && ChartIn.rightLine == false && ChartIn.topLine == false && ChartIn.bottomLine == false) {
                        // console.log("左边界");
                        for (var _i11 = 0; _i11 < chartConflict.length; _i11++) {
                            var _item7 = chartConflict[_i11];
                            var _conflictRightColumn2 = parseInt(_item7.style.leftColumn) + parseInt(_item7.style.widthColumn);
                            var _deviation4 = _conflictRightColumn2 - leftColumn;
                            leftColumn = _conflictRightColumn2;
                            rightColumn = rightColumn + _deviation4;
                        }
                    } else if (ChartIn.rightLine && ChartIn.leftLine == false && ChartIn.topLine == false && ChartIn.bottomLine == false) {
                        // console.log("右边界");
                        for (var _i12 = 0; _i12 < chartConflict.length; _i12++) {
                            var _item8 = chartConflict[_i12];
                            var _deviation5 = rightColumn - _item8.style.leftColumn;
                            rightColumn = _item8.style.leftColumn;
                            leftColumn = leftColumn - _deviation5;
                        }
                    } else if (ChartIn.topLine && ChartIn.rightLine == false && ChartIn.leftLine == false && ChartIn.bottomLine == false) {
                        // console.log("上边界");
                        for (var _i13 = 0; _i13 < chartConflict.length; _i13++) {
                            var _item9 = chartConflict[_i13];
                            var conflictBottomRow = parseInt(_item9.style.topRow) + parseInt(_item9.style.heightRow);
                            var _deviation6 = conflictBottomRow - topRow;
                            topRow = conflictBottomRow;
                            bottomRow = bottomRow + _deviation6;
                        }
                    } else if (ChartIn.bottomLine && ChartIn.rightLine == false && ChartIn.leftLine == false && ChartIn.topLine == false) {
                        // console.log("下边界");
                        for (var _i14 = 0; _i14 < chartConflict.length; _i14++) {
                            var _item10 = chartConflict[_i14];
                            var _deviation7 = bottomRow - _item10.style.topRow;
                            bottomRow = _item10.style.topRow;
                            topRow = topRow - _deviation7;
                        }
                    } else if (ChartIn.leftLine && ChartIn.rightLine && ChartIn.topLine && ChartIn.bottomLine) {
                        // console.log("全部重叠")
                        for (var _i15 = 0; _i15 < chartConflict.length; _i15++) {
                            var _item11 = chartConflict[_i15];
                            var conflictRightRow = parseInt(_item11.style.leftColumn) + parseInt(_item11.style.widthColumn);
                            leftColumn = conflictRightRow;
                            rightColumn = rightColumn + parseInt(_item11.style.widthColumn);
                        }
                    } else if (ChartIn.leftIn == false && ChartIn.rightIn == false && ChartIn.bottomLeftIn == false && ChartIn.bottomRightIn == false && ChartIn.leftLine == false && ChartIn.rightIn == false && ChartIn.topLine == false && ChartIn.bottomLine == false) {
                        console.log("未重叠");
                    } else {
                        console.log("未知情况");
                    }
                };
                //最终坐标确定


                //删除重复冲突组件信息
                var deleteRepeat = function deleteRepeat(id, style) {
                    if (chartConflict.length == 0) {
                        chartConflict.push({ id: id, style: style });
                    }
                    if (chartConflict.length !== 0) {
                        var errorcode = 0;
                        for (var _i16 = 0; _i16 < chartConflict.length; _i16++) {
                            var _item12 = chartConflict[_i16];
                            if (_item12.id == id) {
                                errorcode = 1;
                                var index = chartConflict.indexOf(_item12);
                                chartConflict.splice(index, 1);
                                chartConflict.push({ id: id, style: style });
                            }
                        }
                        if (errorcode = 0) {
                            chartConflict.push({ id: id, style: style });
                        }
                    }
                };
                //存储该div的上右下左坐标


                $("#" + id).css("z-index", "2");
                isDown = false;
                //拖拽结束自动定位
                var changeWidth = [];
                var changHeight = [];
                for (var j = 0; j < rowWidth.length; j++) {
                    var i = rowWidth[j] * gridWidth;
                    if (Math.abs($("#" + id)[0].offsetLeft - i) <= gridWidth / 2) {
                        changeWidth.push(rowWidth[j]);
                    }
                }
                for (var _i5 = 0; _i5 < ColumnHeight.length; _i5++) {
                    var _j = ColumnHeight[_i5] * gridHeight;
                    if (Math.abs($("#" + id)[0].offsetTop - _j) <= gridHeight / 2) {
                        changHeight.push(ColumnHeight[_i5]);
                    }
                }
                var leftColumn = changeWidth[changeWidth.length - 1];
                var topRow = changHeight[changHeight.length - 1];
                var rightColumn = leftColumn + widthColumn;
                var bottomRow = topRow + heightRow;
                var chartConflict = [];
                var ChartIn = {
                    leftIn: false,
                    rightIn: false,
                    bottomLeftIn: false,
                    bottomRightIn: false,
                    allOut: false,
                    otherLeftIn: false,
                    otherRightIn: false,
                    otherBottomLeftIn: false,
                    otherBottomRightIn: false,
                    otherAllOut: false
                    //判断该div是否在另外的div中，如果是，则进行坐标修改
                    //判断两个div区域是否有重叠，重叠区域位置
                };for (var _i6 = 0; _i6 < chartCoordinate.length; _i6++) {
                    var _item2 = chartCoordinate[_i6];
                    ChartIn = {
                        leftIn: false,
                        rightIn: false,
                        bottomLeftIn: false,
                        bottomRightIn: false,
                        leftLine: false,
                        rightLine: false,
                        topLine: false,
                        bottomLine: false
                    };
                    if (_item2.id !== id) {
                        var comLastLeft = parseInt(leftColumn);
                        var comLastRight = parseInt(rightColumn);
                        var comLastTop = parseInt(topRow);
                        var comLastBottom = parseInt(bottomRow);
                        var comItemLeft = parseInt(_item2.style.leftColumn);
                        var comItemRight = comItemLeft + parseInt(_item2.style.widthColumn);
                        var comItemTop = parseInt(_item2.style.topRow);
                        var comItemBottom = comItemTop + parseInt(_item2.style.heightRow);
                        if (comLastLeft >= comItemLeft && comLastLeft < comItemRight && comLastTop >= comItemTop && comLastTop < comItemBottom && comLastRight > comItemRight && comLastBottom > comItemBottom) {
                            ChartIn.leftIn = true;
                            deleteRepeat(_item2.id, _item2.style);
                        }
                        if (comLastRight > comItemLeft && comLastRight <= comItemRight && comLastTop >= comItemTop && comLastTop < comItemBottom && comLastLeft < comItemLeft && comLastBottom > comItemBottom) {
                            ChartIn.rightIn = true;
                            deleteRepeat(_item2.id, _item2.style);
                        }
                        if (comLastLeft >= comItemLeft && comLastLeft < comItemRight && comLastBottom > comItemTop && comLastBottom <= comItemBottom && comLastRight > comItemRight && comLastTop < comItemTop) {
                            ChartIn.bottomLeftIn = true;
                            deleteRepeat(_item2.id, _item2.style);
                        }
                        if (comLastRight > comItemLeft && comLastRight <= comItemRight && comLastBottom > comItemTop && comLastBottom <= comItemBottom && comLastLeft < comItemLeft && comLastTop < comItemTop) {
                            ChartIn.bottomRightIn = true;
                            deleteRepeat(_item2.id, _item2.style);
                        }
                        if (comLastLeft >= comItemLeft && comLastLeft < comItemRight && (comLastTop >= comItemTop && comLastBottom <= comItemBottom || comLastTop <= comItemTop && comLastBottom >= comItemBottom)) {
                            ChartIn.leftLine = true;
                            deleteRepeat(_item2.id, _item2.style);
                        }
                        if (comLastRight > comItemLeft && comLastRight <= comItemRight && comLastTop >= comItemTop && comLastBottom <= comItemBottom && comLastTop <= comItemTop && comLastBottom >= comItemBottom) {
                            ChartIn.rightLine = true;
                            deleteRepeat(_item2.id, _item2.style);
                        }
                        if (comLastTop >= comItemTop && comLastTop < comItemBottom && (comLastLeft >= comItemLeft && comLastRight <= comItemRight || comLastLeft <= comItemLeft && comLastRight >= comItemRight)) {
                            ChartIn.topLine = true;
                            deleteRepeat(_item2.id, _item2.style);
                        }
                        if (comLastBottom > comItemTop && comLastBottom <= comItemBottom && (comLastLeft >= comItemLeft && comLastRight <= comItemRight || comLastLeft <= comItemLeft && comLastRight >= comItemRight)) {
                            ChartIn.bottomLine = true;
                            deleteRepeat(_item2.id, _item2.style);
                        }
                        correctPosition();
                    }
                }
                if (leftColumn < 0 || topRow < 0 || leftColumn > nowcolumn || rightColumn > nowcolumn || topRow > nowrow || bottomRow > nowrow) {
                    var beforeX = Math.ceil(param.nowx / gridWidth);
                    var beforeY = Math.ceil(param.nowy / gridHeight);
                    leftColumn = beforeX;
                    topRow = beforeY;
                    $("#" + id).css("left", beforeX * gridWidth + "px");
                    $("#" + id).css("top", beforeY * gridHeight + "px");
                    $.alert({
                        title: "提示",
                        content: "组件超出边界！",
                        confirmButtonClass: 'btn-info',
                        confirm: function confirm() {}
                    });
                } else {
                    $("#" + id).css("left", leftColumn * gridWidth + "px");
                    $("#" + id).css("top", topRow * gridHeight + "px");
                }for (var _i17 = 0; _i17 < chartCoordinate.length; _i17++) {
                    var _item13 = chartCoordinate[_i17];
                    if (_item13.id == id) {
                        _item13.style.leftColumn = leftColumn;
                        _item13.style.topRow = topRow;
                    }
                }
            }
        };
        $("#" + childId).mousedown(dragStart);
        $(document).mousemove(dragIng);
        $("#" + childId).mouseup(dragEnd);
    }
    $.fn.setOptions = function (options) {
        $.extend(setting, options);
    };
    $.fn.addNewEvent = function () {
        return hasEcharts;
    };
    $.fn.changeStyle = function (options, state) {
        $.extend(colorDefault, options);
        if (state) {
            if (colorDefault.backgroundImage !== "") {
                $("#dg-mainCom").css("background-color", colorDefault.backgroundImage);
            }
            $("#dg-mainCom").css("background-color", colorDefault.backgroundColor);
            $("#dg-mainCom").css("color", colorDefault.textColor);
            $(".dg-mytool").css("background-color", colorDefault.chartToolColor);
            $("#dg-hideOption,#openmodal,#hideline,#savecharts,#addcharts,#Editcharts,#EditUserCharts").css("color", colorDefault.toolIconColor);
            $(".dg-tool-icon").css("border", colorDefault.iconBorder);
            $(".dg-modal-header").css("background-color", colorDefault.modalHeadColor);
            $(".dg-modal-body,.dg-modal-content").css("background-color", colorDefault.modalContentColor);
            $(".dg-modal-footer,.dg-confirm-footer").css("background-color", colorDefault.modalFootColor);
            $(".tableTh").css("background-color", colorDefault.tableThColor);
        }
    };
    $.fn.clickByState = function (options) {
        $.extend(setting.custom, options);

        var _loop2 = function _loop2(i) {
            var item = chartCoordinate[i];
            var id = item.id;
            var url = item.url;
            var option = {};
            $.ajax({
                url: setting.urlHead + url,
                type: "post",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(setting.custom),
                async: false,
                success: function success(res) {
                    for (var _i18 in res) {
                        option[_i18] = eval("(" + res[_i18] + ")");
                    }
                    var mychart = echarts.init(document.getElementById(id));
                    mychart.setOption(option, true);
                }
            });
        };

        for (var i = 0; i < chartCoordinate.length; i++) {
            _loop2(i);
        }
    };
    //重新更新图表信息
    $.fn.updateByOther = function () {
        var _loop3 = function _loop3(i) {
            var item = chartCoordinate[i];
            if (item.type == "echarts") {
                var _option = {};
                $.ajax({
                    url: item.url,
                    type: "post",
                    contentType: "application/json;charset=UTF-8",
                    data: JSON.stringify(setting.custom),
                    async: false,
                    success: function success(res) {
                        for (var _i19 in res) {
                            _option[_i19] = eval("(" + res[_i19] + ")");
                        }
                        var mychart = echarts.init(document.getElementById(item.id));
                        mychart.setOption(_option, true);
                    }
                });
            }
        };

        for (var i = 0; i < chartCoordinate.length; i++) {
            _loop3(i);
        }
    };
    $.fn.clearAllINterval = function () {
        for (var i = 0; i < chartCoordinate.length; i++) {
            var _id = chartCoordinate[i].id;
            clearInterval(window["echart" + _id]);
        };
        chartCoordinate = [];
    };
    $.fn.chartStart = function (options) {
        $.extend(setting, options);
        $("#dg-mainCom").append(TOOL);
        $("#dg-mainCom").append(LAYOUT);
        $("#dg-mainCom").append(HIDE);
        $("#dg-mainCom").append(MODAL1);
        $("#dg-mainCom").append(MODAL2);
        $("#dg-mainCom").append(MODAL3);
        $("#dg-mainCom").append(MODAL5);
        $("#dg-mainCom").append(MODAL6);
        $("#dg-mainCom").append(MODAL7);
        //渲染行列下拉框
        for (var i = 1; i <= setting.row; i++) {
            $("#chartRow").append("<option value=" + i + ">" + i + "</option>");
        }
        for (var _i20 = 1; _i20 <= setting.column; _i20++) {
            $("#chartColumn").append("<option value=" + _i20 + ">" + _i20 + "</option>");
        }
        if (setting.permission == "0") {
            $("#addcharts").css("display", "none");
            $("#Editcharts").css("display", "none");
            $("#newAdd").css("display", "none");
            $("#changeSkin").css("display", "none");
        } else {
            $("#addcharts").css("display", "inherit");
            $("#Editcharts").css("display", "inherit");
            $("#newAdd").css("display", "inherit");
            $("#changeSkin").css("display", "inherit");
        }
        //渲染用户保存图表信息
        (function () {
            var param = {
                "id": setting.userid
            };
            $.ajax({
                url: setting.urlHead + "demo/getUserChart",
                type: "post",
                data: param,
                async: false,
                contentType: "application/json",
                success: function success(res) {
                    if (res.length !== 0) {
                        var _item14 = res[0];
                        nowrow = _item14.screenXLine;
                        nowcolumn = _item14.screenYLine;
                        var lineWidth = $("#dg-mainCom")[0].clientWidth;
                        var lineHeight = $("#dg-mainCom")[0].clientHeight;
                        gridWidth = lineWidth / nowrow;
                        gridHeight = lineHeight / nowcolumn;
                        $("#chartRow").find("option[value=" + nowrow + "]").attr("selected", "true");
                        $("#chartColumn").find("option[value=" + nowcolumn + "]").attr("selected", "true");
                        for (var _i21 = 0; _i21 <= nowrow; _i21++) {
                            ColumnHeight.push(_i21);
                            $("#dg-mainCom").append("<div class=\"deleteXLine\" style=\"width: " + lineWidth + "px;height:1px;z-index:1;background-color:" + colorDefault.lineBorder + ";top:" + gridHeight * _i21 + "px;position:absolute\"></div>");
                        }
                        for (var _i22 = 0; _i22 <= nowrow; _i22++) {
                            rowWidth.push(_i22);
                            $("#dg-mainCom").append("<div class=\"deleteYLine\" style=\"width:1px;height:" + lineHeight + "px;z-index:1;background-color:" + colorDefault.lineBorder + ";left:" + gridWidth * _i22 + "px;position:absolute\"></div>");
                        }
                        // 将划分后的布局根据行存入数组
                        for (var _i23 = 0; _i23 < nowrow; _i23++) {
                            allDivPositionByRow[_i23] = [];
                            for (var j = 0; j < nowcolumn; j++) {
                                var currenntPosition = nowrow * _i23 + j;
                                allDivPositionByRow[_i23].push(currenntPosition);
                            }
                        }
                    }

                    var _loop4 = function _loop4(_i24) {
                        var item = res[_i24];
                        var name = item.component_name;
                        var realTime = item.realTime;
                        var selectBorder = JSON.parse(item.chartInfo).border;
                        var widthColumn = JSON.parse(item.chartInfo).widthColumn;
                        var heightRow = JSON.parse(item.chartInfo).heightRow;
                        var leftColumn = JSON.parse(item.chartInfo).leftColumn;
                        var topRow = JSON.parse(item.chartInfo).topRow;
                        var lastLeft = parseInt(JSON.parse(item.chartInfo).leftColumn * gridWidth);
                        var lastTop = parseInt(JSON.parse(item.chartInfo).topRow * gridHeight);
                        var title = item.title;
                        var param = {
                            "id": item.chart_id
                        };
                        $.ajax({
                            url: setting.urlHead + "demo/getInfo",
                            type: "post",
                            dataType: "json",
                            async: false,
                            data: JSON.stringify(param),
                            contentType: "application/json",
                            success: function success(res) {
                                var url_info = res[0].url_info;
                                var id = res[0].id;
                                var url = res[0].chart_url;
                                if (res[0].type == "iframe") {
                                    chartCoordinate.push({ "id": id, "type": "iframe", "realTime": realTime, "url_info": url_info, "url": url, "title": title, "component_name": name, "style": { "leftColumn": leftColumn, "topRow": topRow, "widthColumn": widthColumn, "heightRow": heightRow, "border": selectBorder } });
                                    appendIframe(id, name, url, selectBorder, widthColumn, heightRow, title, url_info, realTime);
                                    $("#" + id).css('position', 'absolute');
                                    $("#" + id).css('left', lastLeft + "px");
                                    $("#" + id).css('top', lastTop + "px");
                                }
                                if (res[0].type == "echarts") {
                                    chartCoordinate.push({ "id": id, "type": "echarts", "realTime": realTime, "url_info": url_info, "url": url, "title": title, "component_name": name, "style": { "leftColumn": leftColumn, "topRow": topRow, "widthColumn": widthColumn, "heightRow": heightRow, "border": selectBorder } });
                                    appendEchart(id, name, setting.urlHead + url, selectBorder, widthColumn, heightRow, title, url_info, realTime);
                                    $("#" + id).css('position', 'absolute');
                                    $("#" + id).css('left', lastLeft + "px");
                                    $("#" + id).css('top', lastTop + "px");
                                }
                            }
                        });
                    };

                    for (var _i24 = 0; _i24 < res.length; _i24++) {
                        _loop4(_i24);
                    }
                }
            });
        })();
        hideByState();
        $("#deleteHasInfo").on("click", function () {
            var id = selectedChartInfo;
            if (id !== "") {
                $("#" + id).remove();
                $("#position" + id).remove();
                var echartId = "echart" + id;
                clearInterval(window[echartId]);
                for (var _i25 = 0; _i25 < chartCoordinate.length; _i25++) {
                    var _item15 = chartCoordinate[_i25];
                    if (_item15.id == id) {
                        var index = chartCoordinate.indexOf(_item15);
                        chartCoordinate.splice(index, 1);
                    }
                }
            } else {
                $.alert({
                    title: "提示",
                    content: "请选择组件后操作！",
                    confirmButtonClass: 'btn-info',
                    confirm: function confirm() {}
                });
            }
        });
        $("#selectInfo").on("click", function () {
            for (var _i26 = 0; _i26 < chartCoordinate.length; _i26++) {
                var _item16 = chartCoordinate[_i26];
                var _id2 = selectedChartInfo;
                if (_item16.id == _id2) {
                    $("#chartId").val(_item16.id);
                    $("#chartName").val(_item16.component_name);
                    $("#urlName").val(_item16.url_info.name);
                    $("#Adress").val(_item16.url_info.url);
                    $("#chartTitle").val(_item16.title);
                    if (_item16.style.border == "true") {
                        $("#realTime").val("1");
                    } else {
                        $("#realTime").val("0");
                    };
                    $("#chartUrl").val(_item16.url);
                }
            }
            $("#ChartModal").modal("show");
        });
        $("#newAdd").on("click", function () {
            $("#comPostion")[0].innerHTML = "";
            var minHeight = 225 / nowrow;
            var minWidth = 460 / nowcolumn;
            for (var _i27 = 0; _i27 < nowrow; _i27++) {
                $("#comPostion").append("<div class=\"deleteXLine\" style=\"width: 460px;height:1px;z-index:1;background-color:" + colorDefault.lineBorder + ";top:" + minHeight * _i27 + "px;position:absolute\"></div>");
            }
            for (var _i28 = 0; _i28 < nowcolumn; _i28++) {
                $("#comPostion").append("<div class=\"deleteYLine\" style=\"height:225px;width:1px;z-index:1;background-color:" + colorDefault.lineBorder + ";left:" + minWidth * _i28 + "px;position:absolute\"></div>");
            };

            var _loop5 = function _loop5(_i29) {
                var item = chartCoordinate[_i29];
                var id = item.id;
                var left = Math.ceil(item.style.lastLeft / gridWidth);
                var top = Math.ceil(item.style.lastTop / gridHeight);
                var width = item.style.widthColumn;
                var height = item.style.heightRow;
                $("#comPostion").append("<div id=\"position" + id + "\" title=\"" + item.component_name + "\" class=\"someCom\" tabindex = \"0\" style=\"position:absolute;z-index:2;background-color:rgb(47,79,79);width:" + width * minWidth + "px;height:" + height * minHeight + "px;left:" + left * minWidth + "px;top:" + top * minHeight + "px\"></div>");
                $("#position" + id).focus(function () {
                    $("#position" + id).css("background-color", "rgb(135,206,250)");
                    selectedChartInfo = id;
                });
                $("#position" + id).blur(function () {
                    $("#position" + id).css("background-color", "rgb(47,79,79)");
                });
            };

            for (var _i29 = 0; _i29 < chartCoordinate.length; _i29++) {
                _loop5(_i29);
            }
            $("#NewAdd").modal("show");
        });
        //换肤
        $("#changeSkin").on("click", function () {
            if (colorDefault.backgroundImage !== "") {
                $("#dg-mainCom").css("background-color", colorDefault.backgroundImage);
            }
            $("#dg-mainCom").css("background-color", colorDefault.backgroundColor);
            $("#dg-mainCom").css("color", colorDefault.textColor);
            $(".dg-mytool").css("background-color", colorDefault.chartToolColor);
            $("#dg-hideOption,#openmodal,#hideline,#savecharts,#addcharts,#Editcharts,#EditUserCharts").css("color", colorDefault.toolIconColor);
            $(".dg-tool-icon").css("border", colorDefault.iconBorder);
            $(".dg-modal-header").css("background-color", colorDefault.modalHeadColor);
            $(".dg-modal-body,.dg-modal-content").css("background-color", colorDefault.modalContentColor);
            $(".dg-modal-footer,.dg-confirm-footer").css("background-color", colorDefault.modalFootColor);
            $(".tableTh").css("background-color", colorDefault.tableThColor);
        });
        $("#mylist").on("change", function () {
            if ($("#mylist")[0].value !== "请选择组件名称") {
                var _name = $("#mylist")[0].value;
                var param = {
                    "component_name": _name
                };
                $.ajax({
                    url: setting.urlHead + "demo/getInfo",
                    type: "post",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    success: function success(res) {
                        if (res[0].min_width !== undefined && res[0].min_height !== undefined && res[0].min_width !== "" && res[0].min_height !== "") {
                            var xI = Math.ceil(res[0].min_width / gridWidth);
                            var yI = Math.ceil(res[0].min_height / gridHeight);
                            $("#echartRow")[0].innerHTML = "";
                            $("#echartColumn")[0].innerHTML = "";
                            for (var _i30 = yI; _i30 <= nowrow; _i30++) {
                                $("#echartRow").append("<option>" + _i30 + "</option>");
                            }
                            for (var _i31 = xI; _i31 <= nowcolumn; _i31++) {
                                $("#echartColumn").append("<option>" + _i31 + "</option>");
                            }
                        } else {
                            $("#echartRow")[0].innerHTML = "";
                            $("#echartColumn")[0].innerHTML = "";
                            for (var _i32 = 1; _i32 <= nowrow; _i32++) {
                                $("#echartRow").append("<option>" + _i32 + "</option>");
                            }
                            for (var _i33 = 1; _i33 <= nowcolumn; _i33++) {
                                $("#echartColumn").append("<option>" + _i33 + "</option>");
                            }
                        }
                    }
                });
            }
        });
        //监听选择框改变事件
        // $("#newType")[0].addEventListener("change",function(){
        //     if($("#newType").val()=="iframe"){
        //         $("#Mycode").css("display","none");
        //         $(".changAddress")[0].innerHTML="页面相对路径"
        //     }
        //     else if($("#newType").val()=="echarts"){
        //         $("#Mycode").css("display","none");
        //         $(".changAddress")[0].innerHTML="数据请求地址"
        //     }
        //     else{
        //         $("#Mycode").css("display","inherit");
        //         $(".changAddress")[0].innerHTML="数据请求地址"
        //     }
        // })
        //增加监控组件模态框初始化
        $("#openmodal").on("click", function () {
            $("#mylist")[0].innerHTML = "";
            $("#mylist").append("<option> 请选择组件名称 </option>");
            $.ajax({
                url: setting.urlHead + "demo/getListInfo",
                type: "post",
                contentType: "application/json",
                success: function success(res) {
                    for (var j = 0; j < res.length; j++) {
                        var _i34 = res[j];
                        if (_i34.del == "0") {
                            $("#mylist").append("<option>" + _i34.component_name + "</option>");
                        }
                    }
                }
            });
        });
        //依据行列选择情况打开添加监控组件模态框
        $("#openmodal").on("click", function () {
            if (nowrow == "" || nowcolumn == "") {
                $.alert({
                    title: "提示",
                    content: "请选择布局！",
                    confirmButtonClass: 'btn-info',
                    confirm: function confirm() {}
                });
            } else {
                $("#echartRow")[0].innerHTML = "";
                $("#echartColumn")[0].innerHTML = "";
                for (var _i35 = 1; _i35 <= nowrow; _i35++) {
                    $("#echartRow").append("<option>" + _i35 + "</option>");
                }
                for (var _i36 = 1; _i36 <= nowcolumn; _i36++) {
                    $("#echartColumn").append("<option>" + _i36 + "</option>");
                }
                $("#myModal").modal("show");
            }
        });
        //显示增加组件模态框
        $("#addcharts").on("click", function () {
            $("#chartId")[0].value = "";
            $("#chartName")[0].value = "";
            $("#minWidth")[0].value = "";
            $("#minHeight")[0].value = "";
            $("#chartUrl")[0].value = "";
            $("#chartCode")[0].value = "";
            $("#chartTitle")[0].value = "";
            $("#ChartModal").modal("show");
        });
        // 添加布局划线监听事件
        $("#chartRow")[0].addEventListener("change", function () {
            $("#dg-mainCom").children(".deleteXLine").remove();
            var currentVal = $("#chartRow").val();
            var lineWidth = $("#dg-mainCom")[0].clientWidth;
            gridHeight = $("#dg-mainCom")[0].clientHeight / currentVal;
            nowrow = currentVal;
            for (var _i37 = 0; _i37 <= currentVal; _i37++) {
                ColumnHeight.push(gridHeight * _i37);
                $("#dg-mainCom").append("<div class=\"deleteXLine\" style=\"width: " + lineWidth + "px;height:1px;z-index:1;background-color:" + colorDefault.lineBorder + ";top:" + gridHeight * _i37 + "px;position:absolute\"></div>");
            }
        });
        $("#chartColumn")[0].addEventListener("change", function () {
            var currentVal = $("#chartColumn").val();
            var lineHeight = $("#dg-mainCom")[0].clientHeight;
            var lineWidth = $("#dg-mainCom")[0].clientWidth;
            // if(WHequals==true){
            //     $("#dg-mainCom").children(".deleteYLine").remove();
            //     $("#dg-mainCom").children(".deleteXLine").remove();
            //     gridWidth = gridHeight = $("#dg-mainCom")[0].clientWidth/currentVal;
            //     nowcolumn = nowrow = currentVal;
            //     for(let i = 0;i<=currentVal;i++){
            //         ColumnHeight.push(gridHeight*i);
            //         rowWidth.push(gridWidth*i);
            //         $("#dg-mainCom").append("<div class=\"deleteYLine\" style=\"height:" + lineHeight + "px;z-index:1;border:1px solid #eee;left:" + (gridWidth * i + "px") + ";position:absolute\"></div>")
            //         $("#dg-mainCom").append("<div class=\"deleteXLine\" style=\"width:" + lineWidth + "px;z-index:1;border:1px solid #eee;top:" + (gridWidth * i + "px") + ";position:absolute\"></div>")
            //     }
            // }
            // else{
            $("#dg-mainCom").children(".deleteYLine").remove();
            gridWidth = $("#dg-mainCom")[0].clientWidth / currentVal;
            nowcolumn = currentVal;
            for (var _i38 = 0; _i38 <= currentVal; _i38++) {
                rowWidth.push(_i38);
                $("#dg-mainCom").append("<div class=\"deleteYLine\" style=\"height:" + lineHeight + "px;width:1px;z-index:1;background-color:" + colorDefault.lineBorder + ";left:" + gridWidth * _i38 + "px;position:absolute\"></div>");
            }
            // }
        });
        //工具栏显示隐藏
        $("#dg-hideOption").on("click", function () {
            if ($(".dg-mytools").css("display") == "none") {
                $(".dg-mytools").fadeIn();
                $(".dg-mytools").fadeIn("slow");
                $(".dg-mytools").fadeIn(5000);
                $("#dg-choseMine").fadeIn();
                $("#dg-choseMine").fadeIn("slow");
                $("#dg-choseMine").fadeIn(5000);
            } else {
                $(".dg-mytools").fadeOut();
                $(".dg-mytools").fadeOut("slow");
                $(".dg-mytools").fadeOut(5000);
                $("#dg-choseMine").fadeOut();
                $("#dg-choseMine").fadeOut("slow");
                $("#dg-choseMine").fadeOut(5000);
            }
        });
        //样式自定义
        // $("#same").on("click",function(){
        //     if($("#same")[0].checked==true){
        //         WHequals = true;
        //         $(".hideMine").css("display","none");
        //         $("#dg-mainCom").css("overflow","visible")
        //     }
        //     else{
        //         WHequals = false;
        //         $(".hideMine").css("display","inherit");
        //         $("#dg-mainCom").css("overflow","hidden")
        //     }
        // })
        $("#customize").on("click", function () {
            if (nowrow !== "" || nowcolumn !== "") {
                $("#chartRow").find("option[value=" + nowrow + "]").attr("selected", "true");
                $("#chartColumn").find("option[value=" + nowcolumn + "]").attr("selected", "true");
            }
            var state = $("#customize").css("display");
            if (state == "inline-block") {
                $(".dg-choseMineStyle").css("display", "inline-block");
                $("#customize").css("display", "none");
                $("#dg-backTo").css("display", "inline-block");
                $(".dg-chosePiece").css("display", "none");
                $(".dg-choseLGPiece").css("display", "none");
                $(".dg-choseMDPiece").css("display", "none");
                $(".dg-chosePiece").css("background", "#fff");
                $(".dg-choseMDPiece").css("background", "#fff");
                $(".dg-choseLGPiece").css("background", "#fff");
            }
        });
        $("#dg-backTo").on("click", function () {
            var state = $("#dg-backTo").css("display");
            if (state == "inline-block") {
                $(".dg-choseMineStyle").css("display", "none");
                $("#customize").css("display", "inline-block");
                $(".dg-chosePiece").css("display", "inline-block");
                $(".dg-choseLGPiece").css("display", "inline-block");
                $(".dg-choseMDPiece").css("display", "inline-block");
            }
        });
        $(".dg-chosePiece").on("click", function () {
            AddStyle(4);
            nowcolumn = 4;
            nowrow = 4;
            $("#chartRow").find("option[value=4]").attr("selected", "true");
            $("#chartColumn").find("option[value=4]").attr("selected", "true");
            $(".dg-chosePiece").css("background", colorDefault.ToolClickColor);
            $(".dg-choseMDPiece").css("background", colorDefault.ToolDefaultColor);
            $(".dg-choseLGPiece").css("background", colorDefault.ToolDefaultColor);
        });
        $(".dg-choseMDPiece").on("click", function () {
            AddStyle(8);
            nowcolumn = 8;
            nowrow = 8;
            $("#chartRow").find("option[value=8]").attr("selected", "true");
            $("#chartColumn").find("option[value=8]").attr("selected", "true");
            $(".dg-choseMDPiece").css("background", colorDefault.ToolClickColor);
            $(".dg-chosePiece").css("background", colorDefault.ToolDefaultColor);
            $(".dg-choseLGPiece").css("background", colorDefault.ToolDefaultColor);
        });
        $(".dg-choseLGPiece").on("click", function () {
            AddStyle(16);
            nowcolumn = 16;
            nowrow = 16;
            $("#chartRow").find("option[value=16]").attr("selected", "true");
            $("#chartColumn").find("option[value=16]").attr("selected", "true");
            $(".dg-choseLGPiece").css("background", colorDefault.ToolClickColor);
            $(".dg-choseMDPiece").css("background", colorDefault.ToolDefaultColor);
            $(".dg-chosePiece").css("background", colorDefault.ToolDefaultColor);
        });
        $("#Editcharts").on("click", function () {
            $("#EditCom").modal("show");
            $.ajax({
                url: setting.urlHead + "demo/getInfo",
                type: "post",
                contentType: "application/json",
                success: function success(res) {
                    $("#deleteCom")[0].innerHTML = "";

                    var _loop6 = function _loop6(_i39) {
                        var item = res[_i39];
                        if (item.del == "1") {
                            $("#deleteCom").append("<tr class=\"tableTd\"><td>  " + item.component_name + " </td><td style=\"color:" + colorDefault.failColor + "\"> \u5220\u9664 </td><td style=\"text-align:center\"><a class= \"restoreC" + item.id + " dg-man\">\u6062\u590D</a><a class=\"deleteC" + item.id + "  dg-man\">\u5220\u9664</a></td></tr>");
                        } else {
                            $("#deleteCom").append("<tr class=\"tableTd\"><td>  " + item.component_name + " </td><td style=\"color:" + colorDefault.successColor + "\"> \u6B63\u5E38 </td><td style=\"text-align:center\"><a class= \"restoreC" + item.id + " dg-man\">\u6062\u590D</a><a class=\"deleteC" + item.id + "  dg-man\">\u5220\u9664</a></td></tr>");
                        }
                        $(".deleteC" + item.id).on("click", function () {
                            var param = {
                                "id": item.id
                            };
                            $.ajax({
                                url: setting.urlHead + "demo/updateChartState",
                                type: "post",
                                contentType: "application/json",
                                data: JSON.stringify(param),
                                success: function success() {
                                    mmxx();
                                }
                            });
                        });
                        $(".restoreC" + item.id).on("click", function () {
                            var param = {
                                "id": item.id
                            };
                            $.ajax({
                                url: setting.urlHead + "demo/updateDChartState",
                                type: "post",
                                contentType: "application/json",
                                data: JSON.stringify(param),
                                success: function success() {
                                    mmxx();
                                }
                            });
                        });
                    };

                    for (var _i39 = 0; _i39 < res.length; _i39++) {
                        _loop6(_i39);
                    }
                }
            });
        });
        function mmxx() {
            $.ajax({
                url: setting.urlHead + "demo/getInfo",
                type: "post",
                contentType: "application/json",
                success: function success(res) {
                    $("#deleteCom")[0].innerHTML = "";

                    var _loop7 = function _loop7(_i40) {
                        var item = res[_i40];
                        if (item.del == "1") {
                            $("#deleteCom").append("<tr class=\"tableTd\"><td>  " + item.component_name + " </td><td style=\"color:" + colorDefault.failColor + "\"> \u5220\u9664 </td><td><a class= \"restoreC" + item.id + " dg-man\">\u6062\u590D</a><a class=\"deleteC" + item.id + "  dg-man\">\u5220\u9664</a></td></tr>");
                        } else {
                            $("#deleteCom").append("<tr class=\"tableTd\"><td>  " + item.component_name + " </td><td style=\"color:" + colorDefault.successColor + "\"> \u6B63\u5E38 </td><td><a class= \"restoreC" + item.id + " dg-man\">\u6062\u590D</a><a class=\"deleteC" + item.id + "  dg-man\">\u5220\u9664</a></td></tr>");
                        }
                        $(".deleteC" + item.id).on("click", function () {
                            var param = {
                                "id": item.id
                            };
                            $.ajax({
                                url: setting.urlHead + "demo/updateChartState",
                                type: "post",
                                contentType: "application/json",
                                data: JSON.stringify(param),
                                success: function success() {
                                    mmxx();
                                }
                            });
                        });
                        $(".restoreC" + item.id).on("click", function () {
                            var param = {
                                "id": item.id
                            };
                            $.ajax({
                                url: setting.urlHead + "demo/updateDChartState",
                                type: "post",
                                contentType: "application/json",
                                data: JSON.stringify(param),
                                success: function success() {
                                    mmxx();
                                }
                            });
                        });
                    };

                    for (var _i40 = 0; _i40 < res.length; _i40++) {
                        _loop7(_i40);
                    }
                }
            });
        }
        function AddStyle(val) {
            $("#dg-mainCom").children(".deleteXLine").remove();
            $("#dg-mainCom").children(".deleteYLine").remove();
            var currentVal = val;
            var lineWidth = $("#dg-mainCom")[0].clientWidth;
            var lineHeight = $("#dg-mainCom")[0].clientHeight;
            if (WHequals == true) {
                gridHeight = gridWidth = $("#dg-mainCom")[0].clientWidth / currentVal;
            } else {
                gridHeight = $("#dg-mainCom")[0].clientHeight / currentVal;
                gridWidth = $("#dg-mainCom")[0].clientWidth / currentVal;
            }
            for (var _i41 = 0; _i41 <= currentVal; _i41++) {
                ColumnHeight.push(_i41);
                $("#dg-mainCom").append("<div class=\"deleteXLine\" style=\"width:" + lineWidth + "px;height:1px;background-color:" + colorDefault.lineBorder + ";z-index:1;top:" + gridHeight * _i41 + "px;position:absolute\"></div>");
            }
            for (var _i42 = 0; _i42 <= currentVal; _i42++) {
                rowWidth.push(_i42);
                $("#dg-mainCom").append("<div class=\"deleteYLine\" style=\"height:" + lineHeight + "px;width:1px;background-color:" + colorDefault.lineBorder + ";z-index:1;left:" + gridWidth * _i42 + "px;position:absolute\"></div>");
            }
        }
        //管理用户已添加组件
        $("#EditUserCharts").on("click", function () {
            $("#EditUserCom").modal("show");
            $("#deleteUserCom")[0].innerHTML = "";

            var _loop8 = function _loop8(_i43) {
                var item = chartCoordinate[_i43];
                var chartLeft = parseInt(item.style.leftColumn);
                var chartTop = parseInt(item.style.topRow);
                $("#deleteUserCom").append("<tr class=\"tableTd\"><td>" + item.component_name + "</td><td>(" + chartLeft + "," + chartTop + ")</td><td><a class=\"closeU" + item.id + "\" style=\"text-decoration:none;cursor:pointer\">\u5173\u95ED</a></td></tr>");
                $(".closeU" + item.id).on("click", function () {
                    $("#" + item.id).remove();
                    var echartId = "echart" + item.id;
                    clearInterval(window[echartId]);
                    var index = chartCoordinate.indexOf(item);
                    chartCoordinate.splice(index, 1);
                    hideByState();
                    ggzz();
                });
            };

            for (var _i43 = 0; _i43 < chartCoordinate.length; _i43++) {
                _loop8(_i43);
            }
            function ggzz() {
                $("#deleteUserCom")[0].innerHTML = "";

                var _loop9 = function _loop9(_i44) {
                    var item = chartCoordinate[_i44];
                    var chartLeft = parseInt(item.style.leftColumn);
                    var chartTop = parseInt(item.style.topRow);
                    $("#deleteUserCom").append("<tr class=\"tableTd\"><td>" + item.component_name + "</td><td>(" + chartLeft + "," + chartTop + ")</td><td><a class=\"closeU" + item.id + "\">\u5173\u95ED</a></td></tr>");
                    $(".closeU" + item.id).on("click", function () {
                        $("#" + item.id).remove();
                        var echartId = "echart" + item.id;
                        clearInterval(window[echartId]);
                        var index = chartCoordinate.indexOf(item);
                        chartCoordinate.splice(index, 1);
                        hideByState();
                        ggzz();
                    });
                };

                for (var _i44 = 0; _i44 < chartCoordinate.length; _i44++) {
                    _loop9(_i44);
                }
            }
        });
        //隐藏分割线
        $("#hideline").on("click", function () {
            if ($("#dg-mainCom").children(".deleteYLine")[0].style.backgroundColor == colorDefault.lineBorder) {
                var decolor = $("#dg-mainCom").css("background-color");
                $("#dg-mainCom").children(".deleteYLine").css("background-color", decolor);
                $("#dg-mainCom").children(".deleteXLine").css("background-color", decolor);
            } else {
                $("#dg-mainCom").children(".deleteYLine").css("background-color", colorDefault.lineBorder);
                $("#dg-mainCom").children(".deleteXLine").css("background-color", colorDefault.lineBorder);
            }
        });
        //添加组件信息至数据库
        $("#addmychart").on("click", function () {
            if ($("#chartId").val() == "" || $("#newType").val() == "" || $("#chartName").val() == "" || $("#chartUrl").val() == "") {
                $.alert({
                    title: "提示",
                    content: "请填写必填项!",
                    confirmButtonClass: 'btn-info',
                    confirm: function confirm() {}
                });
            } else {
                var param = {
                    "id": $("#chartId").val(),
                    "type": $("#newType").val(),
                    "component_name": $("#chartName").val(),
                    "chart_page_code": $("#chartCode").val(),
                    "chart_url": $("#chartUrl").val(),
                    "min_width": $("#minWidth").val(),
                    "min_height": $("#minHeight").val(),
                    "realTime": $("#realTime").val(),
                    "url_info": JSON.stringify({ "name": $("#urlName").val(), "url": $("#Adress").val() })
                };
                $.ajax({
                    url: setting.urlHead + "demo/addMyChart",
                    type: "post",
                    data: JSON.stringify(param),
                    contentType: "application/json",
                    success: function success(res) {
                        if (res == 1) {
                            $.alert({
                                title: "提示",
                                content: "添加成功!",
                                confirmButtonClass: 'btn-info',
                                confirm: function confirm() {}
                            });
                            $("#ChartModal").modal("hide");
                        }
                        if (res == 0) {
                            $.alert({
                                title: "提示",
                                content: "添加失败!",
                                confirmButtonClass: 'btn-info',
                                confirm: function confirm() {}
                            });
                        }
                    }
                });
            }
        });
        $("#getcomponent").on("click", function () {
            var name = $("#mylist").val();
            var selectBorder = $("#borderExists")[0].value;
            if (name == "请选择组件名称") {
                $.alert({
                    title: "提示",
                    content: "请选择组件名称!",
                    confirmButtonClass: 'btn-info',
                    confirm: function confirm() {}
                });
            } else {
                var param = {
                    "component_name": name
                };
                $.ajax({
                    url: setting.urlHead + "demo/getInfo",
                    type: "post",
                    dataType: "json",
                    data: JSON.stringify(param),
                    contentType: "application/json",
                    async: false,
                    success: function success(res) {
                        var title = res[0].title;
                        var id = res[0].id;
                        var url = res[0].chart_url;
                        var type = res[0].type;
                        var realTime = res[0].realTime;
                        var url_info = res[0].url_info;
                        //防止重复增加echarts图形
                        if (chartCoordinate.length !== 0) {
                            var errorCode = 0;
                            for (var _i45 = 0; _i45 < chartCoordinate.length; _i45++) {
                                var _item17 = chartCoordinate[_i45];
                                if (_item17.id == id) {
                                    errorCode = 1;
                                }
                            }
                            if (errorCode == 0) {
                                if (type == "iframe") {
                                    var width = gridWidth * $("#echartColumn").val();
                                    var height = gridHeight * $("#echartRow").val();
                                    appendIframe(id, name, url, selectBorder, width, height, title, url_info, realTime);
                                }
                                if (type == "echarts") {
                                    var _heightRow = parseInt($("#echartRow").val());
                                    var _widthColumn = parseInt($("#echartColumn").val());
                                    appendEchart(id, name, setting.urlHead + url, selectBorder, _widthColumn, _heightRow, title, url_info, realTime);
                                }
                            }
                            if (errorCode == 1) {
                                $.alert({
                                    title: "提示",
                                    content: "您已添加相同图表!",
                                    confirmButtonClass: 'btn-info',
                                    confirm: function confirm() {}
                                });
                            }
                        }
                        if (chartCoordinate.length == 0) {
                            if (type == "iframe") {
                                var _width2 = gridWidth * $("#echartColumn").val();
                                var _height = gridHeight * $("#echartRow").val();
                                appendIframe(id, name, url, selectBorder, _width2, _height, url_info, realTime);
                            }
                            if (type == "echarts") {
                                var _heightRow2 = parseInt($("#echartRow").val());
                                var _widthColumn2 = parseInt($("#echartColumn").val());
                                appendEchart(id, name, setting.urlHead + url, selectBorder, _widthColumn2, _heightRow2, title, url_info, realTime);
                            }
                        }
                    }
                });
                $("#myModal").modal("hide");
            }
            hideByState();
        });
        //保存用户展示图表信息
        $("#savecharts").on("click", function () {
            $.confirm({
                title: "提示",
                content: "确定保存当前页面组件信息?",
                confirmButtonClass: 'btn-info',
                cancelButtonClass: "btn-default",
                confirm: function confirm() {
                    if (chartCoordinate.length == 0) {
                        var sendParam = [];
                        $.ajax({
                            url: setting.urlHead + "demo/saveUserChart",
                            type: "post",
                            data: JSON.stringify(sendParam),
                            contentType: "application/json",
                            success: function success() {
                                $.alert({
                                    title: "提示",
                                    content: "成功!",
                                    confirmButtonClass: 'btn-info',
                                    confirm: function confirm() {}
                                });
                                $("#addConfirm").modal("hide");
                            },
                            error: function error() {
                                $.alert({
                                    title: "提示",
                                    content: "失败!",
                                    confirmButtonClass: 'btn-info',
                                    confirm: function confirm() {}
                                });
                            }
                        });
                    } else {
                        var _sendParam = [];
                        for (var _i46 = 0; _i46 < chartCoordinate.length; _i46++) {
                            var _item18 = chartCoordinate[_i46];
                            var param = "";
                            var cStyle = { "leftColumn": _item18.style.leftColumn, "topRow": _item18.style.topRow, "widthColumn": _item18.style.widthColumn, "heightRow": _item18.style.heightRow, "border": _item18.style.border };
                            param = {
                                "chartId": _item18.id,
                                "component_name": _item18.component_name,
                                "chartStyle": JSON.stringify(cStyle),
                                "screenXLine": nowrow,
                                "screenYLine": nowcolumn,
                                "title": _item18.title,
                                "realTime": _item18.realTime
                                // "url_info":item.url_info,
                                // "pageId":setting.pageId
                                // "equal":WHequals
                            };
                            _sendParam.push(param);
                        }
                        $.ajax({
                            url: setting.urlHead + "demo/saveUserChart",
                            type: "post",
                            data: JSON.stringify(_sendParam),
                            contentType: "application/json",
                            success: function success() {
                                $.alert({
                                    title: "提示",
                                    content: "成功!",
                                    confirmButtonClass: 'btn-info',
                                    confirm: function confirm() {}
                                });
                            },
                            error: function error() {
                                $.alert({
                                    title: "提示",
                                    content: "失败!",
                                    confirmButtonClass: 'btn-info',
                                    confirm: function confirm() {}
                                });
                            }
                        });
                        $("#addConfirm").modal("hide");
                    }
                }
            });
        });
    };
})(jQuery, window, document);
