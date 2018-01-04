define(function(require) {

    'use strict';

    var cncnERP = require('../app/cncnERP');

    var isShow = false;

    $('.nav_dl .link')
        .on('click', function() {
            var oSelf = $(this),
                thatDt = oSelf.parent('dt');
            thatDt.siblings('dd').slideToggle();
            oSelf.parents('dl').addClass('cur').siblings().children('dd').slideUp();
            oSelf.parents('dl').siblings().removeClass('cur');
        });


    $(".subLink").each(function() {
        var self = $(this),
            parent = null;

        if (!self.hasClass('cur')) return;

        parent = self.parent('dd')
        parent.show();
        parent.parent().addClass('cur');

        if (self.attr('href') === location.pathname && parent.find('.cur').length > 1) {
            parent.find('.cur').removeClass('cur');
            self.addClass('cur')
        }

    });

    $('.lt-right')
        .off('click', '.ertong')
        .on('click', '.ertong', function(e) {
            $('.alertBox .tip').hide();
            $(this).find('.tip').show();
            isShow = true;
            e.stopPropagation();
        });

    $(window)
        .on('click', function() {
            if (isShow) {
                $('.alertBox .tip').hide();
                isShow = false;
            }
        });


    $(document).on('click', '.integer_number,.float_number', function() {
        $(this).data('default_value', $(this).val());
    });
    $(document).on('keyup', '.integer_number', function() {
        if ($(this).val() != '' && !/^[\d]+$/.test($(this).val())) {
            $(this).val($(this).data('default_value'));
            return false;
        }
    });
    $(document).on('keyup', '.float_number', function() {
        if ($(this).val() != '' && isNaN($(this).val())) {
            $(this).val($(this).data('default_value'));
            return false;
        }
    });

    if (window.gridOperating) {
        console.log('gridOperating 已在全局定义');
    }
    window.gridOperating = function(grid, rdata) {
        var html = '',
            data = (grid.getCurrentAllData()).operating,
            replaceFn = function(data, rdata) {
                var reg = null,
                    str = data.url,
                    keys = [],
                    key = null;

                str.replace(/{{(\w{0,})}}/g, function($1, $2) {
                    keys.push($2);
                });

                for (var i = 0, len = keys.length; i < len; i++) {
                    key = keys[i];
                    reg = new RegExp('{{' + key + '}}', 'g');
                    str = str.replace(reg, rdata[key]);
                }

                return str;
            };

        for (var i = 0, len = data.length; i < len; i++) {
            html += '<a href="' + replaceFn(data[i], rdata) + '" class="' + data[i].cls + '">' + data[i].title + '</a>';
        }

        return html;
    }


    $('.nav dl dd').each(function() {
        if ($(this).find('a').size() < 1) {
            $(this).parents('dl').remove();
        }
    });

    window.submit_form = function(obj) {
        var $form = obj.closest('form');
        var $url = $form.attr('action');
        if ($url != '') {
            var action = obj.data('action');
            if (action == 1) {
                //return false;
            }
            obj.data('action', 1);
            if (arguments.length > 1) {
                var _func = arguments[1];
                var params = arguments[2];
                if (params) {
                    var hide_input = "";
                    for (var i in params) {
                        hide_input += "<input type='hidden' class='append_hidden_input' name='" + i + "' value='" + params[i] + "'/>";
                    }
                    $form.append(hide_input);
                }
            }
            $.post($url, $form.serialize(), function(response) {
                obj.data('action', 0);
                $('.append_hidden_input').remove();
                if (response.res == 0) {
                    cncnERP.ui.dialog.alert({
                        title: '操作提示',
                        text: response.msg,
                        width: 500
                    });
                } else {
                    var data = response.data;
                    if (typeof _func == 'function') {
                        _func.apply(window, [data, response]);
                    } else {
                        cncnERP.ui.dialog.alert({
                            title: '操作提示',
                            text: response.msg,
                            width: 500
                        });
                    }
                }
            }, 'json');
        }
    }

    $('.searchSubmit').click(function() {
        $(this).closest('form').submit();
    });


    $(document).on('change', '.choose_province', function() {
        var id = $(this).val();
        if (id) {
            $(".choose_city option").not(':first').remove();
            $(".choose_region option").not(':first').remove();
            var choose = $('.choose_city').data('choose');
            $.get('/common/get_citys', { province_id: id }, function(response) {
                var options = '';
                if (response.res == 1) {
                    for (var i in response.data) {
                        var selected = '';
                        if (choose == response.data[i]['zone_id']) {
                            selected = 'selected="selected"';
                        }
                        options += "<option value='" + response.data[i]['zone_id'] + "' " + selected + ">" + response.data[i]['zone_name'] + "</option>";
                    }
                    $(".choose_city").append(options);
                    if (choose > 0 && $(".choose_region").size() > 0) {
                        $('.choose_city').trigger('change');
                    }
                }
            }, 'json');
        }
    });

    $(document).on('change', '.choose_city', function() {
        var id = $(this).val();
        if (id) {
            $(".choose_region option").not(':first').remove();
            var choose = $('.choose_region').data('choose');
            $.get('/common/get_regions', { city_id: id }, function(response) {
                var options = '';
                if (response.res == 1) {
                    for (var i in response.data) {
                        var selected = '';
                        if (choose == response.data[i]['zone_id']) {
                            selected = 'selected="selected"';
                        }
                        options += "<option value='" + response.data[i]['zone_id'] + "' " + selected + ">" + response.data[i]['zone_name'] + "</option>";
                    }
                    $(".choose_region").append(options);
                }
            }, 'json');
        }
    });

    $('.checkAll').click(function() {
        var target = $(this).data('target');
        var checked = $(this).is(":checked");
        $("[name='" + target + "']").each(function() {
            if ($(this).data('valid') == 1) {
                $(this).prop('checked', checked);
            }
        });
        $('.checkAll').prop('checked', $(this).is(":checked"));
    });




    $(document).on('click', '.go_back', function() {
        window.history.go(-1);
    });
});

$(document).on('click', '.date_picker', function() {
    WdatePicker();
});

/*
 * setStartDate 设置时间组bar
 */

function setStartDate() {
    var val = "";
    $('.dateBar').find(".datepicket1").focus(function(){
        WdatePicker();
        val = $(this).val();
        id = $(this).attr('id');
    });
    $('.dateBar').find(".datepicket2").focus(function(){

        WdatePicker({
            minDate: val,
            startDate: val
        });
    });
}
setStartDate();
var isShow = false;
$('.j-dropDownBtn').on('click',function(e){
    var self    = $(this),
        next    = self.parents('.j-dropDown').find('.j-dropDownList');
    if( !isShow ){
        next.show();
        isShow = true;
    }else{
        next.hide();
        isShow = false;
    }
    e.stopPropagation();
})

$('.j-dropDownList')
        .on('click', 'li', function(){
            var self    = $(this),
                parents = self.parents('.j-dropDownList');
            parents.hide();
        });

$(window).on('click', function(){
            if( isShow ){
                $('.j-dropDownList').hide();
                isShow = false;
            }
        })
