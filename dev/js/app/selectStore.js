(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.SelectStore = factory(root.jQuery);
    }
}(this, function($) {

    'use strict';

    var SelectStore = function(options) {
        //
        var g = this,
            selectedObj = options.selectedData,
            temp_list_html = '',
            baseHtml = '<div class="l-selectArea-selected"></div>'+
                '<span class="l-selectStore-open ui-btn">请选择</span>'+
                '<div class="l-selectStore-main ui-form">'+
                    '<div class="l-selectStore-bar">'+
                        '<label class="j-select">'+
                            '<select class="ui-select name="provinces_zone_id_ky" id="J_provinces_ky">'+
                                '<option value="">请选择</option>'+
                            '</select>'+
                        '</label>'+
                        '<input type="hidden" name="provinces_name_ky" id="provinces_name_ky" value="">'+
                        '<label class="j-select">'+
                            '<select class="ui-select" name="city_id_ky" id="J_city_ky">'+
                                '<option value="">请选择</option>'+
                            '</select>'+
                        '</label>'+
                        '<input type="hidden" name="city_name_ky" id="city_name_ky" value="">'+
                        '<label>'+
                            '<input type="text" class="l-selectStore-SearchInput ui-input"  placeholder="请输入门店" value="">'+
                        '</label>'+
                        '<span class="l-selectStore-search ui-btn">搜索</span>'+
                    '</div>'+
                    '<div class="l-selectStore-selectAll">'+
                        '<span class="select-all ui-btn">全部</span>'+
                        '<span class="no-select-all ui-btn">取消</span>'+
                    '</div>'+
                    '<div class="l-selectStore-list" id="j-store-list"></div>'+
                    '<div class="l-selectStore-Bottom">'+
                        '<span class="l-selectStore-confirm ui-btn">确认</span>'+
                    '</div>'+
                '</div>',
            c = {
                init: function(){

                    // 插入基础HTML结构
                    g.wrap.append(baseHtml);

                    // 处理已经选择的数据
                    g.eachSelect(selectedObj);
                    $(".l-selectArea-selected").append(g.selectedHtml);
                    g.selectedHtml = "";

                    // 【请选择】按钮
                    $(".l-selectStore").find('.l-selectStore-open').off("click").on("click",function(){
                        $(this).hide();
                        $(".l-selectStore").find('.l-selectStore-main').show();
                    });

                    // 获取省份数据
                    $.ajax({
                        type: 'POST',
                        url: '/common/get_zone_child_item' ,
                        data: {
                            parent_id:156
                        } ,
                        dataType: 'json',
                        success: function(data){
                            if(data.length > 0){
                                // console.log(data);
                                var pro_temp_html = '';
                                $.each(data,function(key,value){
                                    pro_temp_html += '<option value="'+value.zone_id+'">'+value.zone_name+'</option>';
                                });
                                $("#J_provinces_ky").append(pro_temp_html);
                            }
                        }
                    });

                    // 获取城市数据
                    $("#J_provinces_ky").off("change").on("change",function(){

                        if($(this).val() != ''){
                            $("#provinces_name_ky").val($(this).find("option:selected").text());
                        }else{
                            $("#provinces_name_ky").val('');
                        }
                        var provinces_id = $(this).val();
                        
                        $("#J_city_ky").empty();
                        $("#J_city_ky").append('<option value="">请选择</option>');

                        $.ajax({
                            type: 'POST',
                            url: '/common/get_zone_child_item' ,
                            data: {parent_id:provinces_id} ,
                            dataType: 'json',
                            success: function(data){
                                if(data.length > 0){
                                    var temp_html = '';
                                    $.each(data,function(key,value){
                                        temp_html += '<option value="'+value.zone_id+'">'+value.zone_name+'</option>';
                                    });
                                    $("#J_city_ky").append(temp_html);
                                }
                            }
                        });

                    });

                    $("#J_city_ky").off('click').on('click',function(){
                        if($(this).val() != ''){
                            $("#city_name_ky").val($(this).find("option:selected").text());
                        }else
                            $("#city_name_ky").val('');
                    })

                    // 搜素门店数据
                    $('.l-selectStore').find('.l-selectStore-search').click(function(){

                        var data = {
                            province_id: $("#J_provinces_ky").val(),
                            city_id: $("#J_city_ky").val()
                        },
                        storeData = [],
                        lastStoreData = [],
                        searchCon = $('.l-selectStore-SearchInput').val();

                        $("#j-store-list").html("");
                        // 隐藏全选和取消按钮隐藏
                        $('.l-selectStore-selectAll').hide();

                        $.ajax({
                            type: 'POST',
                            url: '/common/get_department_items' ,
                            data: data ,
                            dataType: 'json',
                            success: function(data){
                                if(data.length > 0){
                                    // console.log(data);
                                    $.each(data,function(k1,v1){
                                        // console.log(k1,v1['children']);
                                        if(v1['children']){
                                            $.each(v1['children'],function(k2,v2){
                                                if (v2['children']) {
                                                    // console.log(v2['children'])

                                                    // 显示全选和取消按钮
                                                    $('.l-selectStore-selectAll').show();

                                                    $.each(v2['children'],function(k3,v3){
                                                        // console.log(v3.name);
                                                        storeData.push({
                                                            id: v3.id,
                                                            name: v3.name
                                                        });
                                                    });
                                                }
                                            });  
                                        }
                                    });

                                    if(searchCon == ''){
                                        lastStoreData = storeData;
                                    }else{
                                        $.each(storeData,function(key,value){
                                            if(value.name.indexOf(searchCon) != -1){
                                                lastStoreData.push({
                                                    id: value.id,
                                                    name: value.name
                                                })
                                            }
                                        })
                                    }

                                }
                                // console.log(storeData);
                                // console.log(lastStoreData);
                                
                                // 遍历数据

                                $.each(lastStoreData,function(key,value){
                                    if($("span[data-id='"+ value.id +"']").length>0){
                                        temp_list_html += 
                                            '<label class="l-selectStore-listItem">'+
                                                '<input type="checkbox" class="ui-checkbox" id="' + value.id  +'" value="' + value.name + '" checked>'+
                                                '<i class="ui-label ui-checkbox-label">'+ value.name + '</i>'+
                                            '</label>';
                                    }else{
                                        temp_list_html += 
                                            '<label class="l-selectStore-listItem">'+
                                                '<input type="checkbox" class="ui-checkbox" id="' + value.id  +'" value="' + value.name + '">'+
                                                '<i class="ui-label ui-checkbox-label">'+ value.name + '</i>'+
                                            '</label>';
                                    };

                                });
                                $("#j-store-list").append(temp_list_html);
                                temp_list_html = "";

                                // 监听checkbox变化
                                $('.l-selectStore-listItem').off('change','input[type="checkbox"]')
                                .on('change','input[type="checkbox"]',function(){
                                    // console.log($(this).is(':checked'));
                                    if($(this).is(':checked')){
                                        // 对比数据
                                        if($(".l-selectArea-selectedItem[data-id=" + $(this).attr('id') + "]").length < 1){
                                            g.selectedHtml += '<span class="l-selectArea-selectedItem" data-id="' + $(this).attr('id') + '">' + $(this).val() + '<span>x</span></span>';
                                            $(".l-selectArea-selected").append(g.selectedHtml);
                                            g.selectedHtml = "";

                                            g._hasSelectStore.push({
                                                id: $(this).attr('id'),
                                                name: $(this).val()
                                            });

                                        }
                                    }else{
                                        $("span[data-id='"+ $(this).attr('id') +"']").remove();

                                        g._hasSelectStore.splice(g._hasSelectStore.indexOf($(this).val()),1);
                                    }
                                });
                            }
                        });

                    });

                    // 全部按钮操作
                    $('.l-selectStore-selectAll').off('click','.select-all').on('click','.select-all',function(){
                        $(".l-selectStore-listItem").find("input").prop("checked",true).change();
                    });
                    // 取消按钮操作
                    $('.l-selectStore-selectAll').off('click','.no-select-all').on('click','.no-select-all',function(){
                        $(".l-selectStore-listItem").find("input").removeAttr('checked').change();
                    });

                    // 删除门店
                    $(".l-selectArea-selected").off('click','.l-selectArea-selectedItem')
                    .on('click','.l-selectArea-selectedItem',function(){
                        $(this).remove();
                        $(".l-selectStore-listItem").find('input[id='+ $(this).attr('data-id') +']').removeAttr('checked');

                        g._hasSelectStore.splice(g._hasSelectStore.indexOf($(this).text().replace('x','')),1);

                    });

                    // 确认按钮操作
                    $('.l-selectStore-confirm').click(function(){
                        $('.l-selectStore-main').hide();
                        $('.l-selectStore-open').show();
                    });

                    return c;

                }
            };

        g._hasSelectStore = options.selectedData ? options.selectedData : [];
        g.wrap = options.wrap;
        g.selectedHtml = '';

        c.init();

    };

    SelectStore.prototype = {

        constructor: SelectStore,

        hasSelectStore: function(){                                      // 输出选择门店数据
            var _this  = this,
                result = [];
            $.each(_this._hasSelectStore,function(key,value){
                result.push(value.id);
            });
            return result.join(',');
        },
        eachSelect: function(obj){                                       // 遍历已选的数据
            var _this = this;
            $.each(obj,function(key,value){
                _this.selectedHtml += '<span class="l-selectArea-selectedItem" data-id="' + value.id + '">' 
                                            + value.name 
                                            + '<span>x</span>'
                                     +'</span>';
            });
        }

    };

    return function(o) {
        return o ? new SelectStore(o) : {};
    };

}));