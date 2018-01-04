(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.SelectArea = factory(root.jQuery);
    }
}(this, function($) {

    'use strict';

    var SelectArea = function(options) {

        var g = this,
            t = {
                lastData: [], //最后一级的数据
                selectedData: [] //勾选的数据
            },
            domFragment = {
                selected: '<span class="l-selectArea-selectedItem" data-id="{{id}}">{{name}}<span>x</span></span>',
                option: '<option value="{{id}}" data-index="{{index}}">{{name}}</option>',
                radio: '<label><input type="radio" class="ui-radio" id="{{id}}" value="{{name}}" {{checked}} /><i class="ui-label ui-radio-label">{{name}}</i></label>',
                checkbox: '<label><input type="checkbox" class="ui-checkbox" id="{{id}}" value="{{name}}" {{checked}} /><i class="ui-label ui-checkbox-label">{{name}}</i></label>',
                search: '<div class="l-selectArea-search ui-form"><label><input type="text" class="ui-input" /></label><span class="ui-btn">搜索</span></div>',
                nullText: '<div class="l-selectArea-nullText">暂无数据</div>'

            },
            c = {
                fnClose: function() {
                    var wrap = g.wrap,
                        selectAreaMain = wrap.find('.l-selectAreaMain'),
                        closeBtn = wrap.find('.l-selectArea-close'),
                        openBtn = wrap.find('.l-selectArea-open')
                    closeBtn
                        .on('click', function() {
                            selectAreaMain.hide();
                            openBtn.show();
                        });
                    openBtn
                        .on('click', function() {
                            selectAreaMain.show();
                            openBtn.hide();
                        });
                },
                fnRemove: function() {
                    var wrap = g.wrap,
                        target = g.target,
                        checkbox = wrap.find('input[type="checkbox"]'),
                        selectedWrap = wrap.find('.l-selectArea-selected');

                    wrap.off('click', '.l-selectArea-selectedItem')
                        .on('click', '.l-selectArea-selectedItem', function() {
                            var self = $(this),
                                id = self.attr('data-id'),
                                checkboxItem = checkbox.filter(function() {
                                    return this.id === id;
                                });

                            checkboxItem.prop('checked', false)
                            self.remove();
                            c.removeSelectedData(id);
                            c.removeFlagSelectedData(id);
                            target.val(c.getSelectIDs(t.selectedData));
                        });
                },
                fnClick: function() {
                    var wrap = g.wrap,
                        target = g.target,
                        selectedWrap = wrap.find('.l-selectArea-selected');

                    wrap
                        .off('change', 'input[type="checkbox"]')
                        .on('change', 'input[type="checkbox"]', function() {
                            var self = $(this),
                                isChecked = self[0].checked,
                                val = self.val(),
                                id = this.id,
                                isSelected = false,
                                len = t.selectedData.length,
                                idArr = [];

                            if (isChecked) {
                                for (var i = 0; i < len; i++) {
                                    if (id !== t.selectedData[i].id) {
                                        isSelected = true;
                                    }
                                }
                                if (!len || isSelected) {
                                    t.selectedData.push({ name: val, id: id });
                                }

                                console.log(id, t.selectedData[i].id, len)
                            } else {
                                c.removeSelectedData(id);
                                c.removeFlagSelectedData(id);
                            }
                            target.val(c.getSelectIDs(t.selectedData));
                            selectedWrap.html(c._each(domFragment.selected, t.selectedData))
                        });
                },
                fnSearch: function() {
                    var data = g.data,
                        wrap = g.wrap,
                        target = g.target,
                        searchWrap = wrap.find('.l-selectArea-search'),
                        sceneryWrap = wrap.find('.l-selectArea-scenery');

                    wrap.off('click', '.ui-btn')
                        .on('click', '.ui-btn', function() {

                            var data = t.lastData,
                                dataLen = data ? data.length : 0,
                                y = 0,
                                isSelected = false,
                                tmpData = [],
                                input = searchWrap.find('input'),
                                inputVal = input.val(),
                                reg = new RegExp((inputVal ? inputVal : '').toLowerCase()),
                                name = null,
                                html = '',
                                index = wrap.find('.l-selectArea-city option:selected').attr('data-index'),
                                currentCity = [];

                            for (; y < dataLen; y++) {

                                name = reg.test((data[y].name ? data[y].name + '' : '').toLowerCase());
                                isSelected = false;

                                if (name) {
                                    tmpData.push(data[y]);
                                }
                            }
                            if (tmpData.length) {
                                tmpData = c.flagSelectedData(tmpData);

                                if (g.type === 2) {
                                    currentCity = [{
                                        name: g.data[index].name,
                                        id: g.data[index].id
                                    }];
                                    currentCity = c.flagSelectedData(currentCity);

                                    html = '<div class="l-selectArea-sceneryHeader ui-form">' + c._each(domFragment.checkbox, currentCity) + '</div>';
                                }

                                html += '<div class="l-selectArea-sceneryMain ui-form">' + c._each(domFragment.checkbox, tmpData) + '</div>';

                            } else {
                                html = c._tpl(domFragment.nullText);
                            }
                            sceneryWrap.html(html);
                        });
                },
                fnSelect: function() {
                    var data = g.data,
                        wrap = g.wrap,
                        target = g.target,
                        citySelect = wrap.find('.l-selectArea-city'),
                        countySelect = wrap.find('.l-selectArea-county'),
                        sceneryWrap = wrap.find('.l-selectArea-scenery');

                    wrap.off('change', '.l-selectArea-city')
                        .on('change', '.l-selectArea-city', function() {
                            var self = $(this),
                                selected = self.find("option:selected"),
                                index = selected.attr('data-index'),
                                countyData = data[index].children,
                                currentCity = '',
                                html = ''

                            t.lastData = c.flagSelectedData(countyData);

                            if (g.type === 1) {
                                countySelect
                                    .attr('data-index', index)
                                    .html(c._each(domFragment.option, t.lastData))
                                    .trigger('change');
                            } else if (g.type === 2) {
                                currentCity = [{
                                    name: data[index].name,
                                    id: data[index].id
                                }];
                                currentCity = c.flagSelectedData(currentCity);
                                html = '<div class="l-selectArea-sceneryHeader ui-form">' + c._each(domFragment.checkbox, currentCity) + '</div>' +
                                    '<div class="l-selectArea-sceneryMain ui-form">' + c._each(domFragment.checkbox, t.lastData) + '</div>';
                                sceneryWrap.html(html);
                            } else {
                                html = '<div class="l-selectArea-sceneryMain ui-form">' + c._each(domFragment.checkbox, t.lastData) + '</div>';
                                sceneryWrap.html(html);
                            }

                        });

                    if (g.type === 1) {
                        wrap.off('change', '.l-selectArea-county')
                            .on('change', '.l-selectArea-county', function() {
                                var self = $(this),
                                    cityIndex = self.attr('data-index'),
                                    selected = self.find("option:selected"),
                                    index = selected.attr('data-index'),
                                    sceneryData = data[cityIndex].children[index].children;

                                if (sceneryData) {
                                    t.lastData = c.flagSelectedData(sceneryData);
                                    sceneryWrap.html('<div class="l-selectArea-sceneryMain ui-form">' + c._each(domFragment.checkbox, t.lastData) + '</div>');
                                } else {
                                    sceneryWrap.html(c._tpl(domFragment.nullText));
                                }
                            });
                    }
                },
                /* 获取选中数据的id串 */
                getSelectIDs: function(data) {
                    var idArr = [];
                    for (var i = 0, len = data.length; i < len; i++) {
                        idArr.push(data[i].id);
                    }
                    return idArr.join(',');
                },
                /* 删除选中数据 */
                removeSelectedData: function(id) {
                    for (var i = 0, len = t.selectedData.length; i < len; i++) {
                        if (t.selectedData[i] && id === t.selectedData[i].id) {
                            t.selectedData.splice(i, 1);
                        }
                    }
                },
                /* 移出数据标记已选 */
                removeFlagSelectedData: function(id) {
                    var selectedData = t.selectedData,
                        lastData = t.lastData,
                        sLen = selectedData.length

                    for (var i = 0, len = lastData.length; i < len; i++) {
                        if (sLen) {
                            for (var j = 0; j < sLen; j++) {
                                if (lastData[i].id === id) {
                                    delete lastData[i].checked;
                                }
                            }
                        } else {
                            delete lastData[i].checked;
                        }
                    }
                },
                /* 数据标记已选 */
                flagSelectedData: function(data) {
                    var selectedData = t.selectedData,
                        dataLen = data ? data.length : 0;
                    for (var j = 0, sLen = selectedData.length; j < sLen; j++) {
                        for (var i = 0; i < dataLen; i++) {
                            if (data[i].id === selectedData[j].id) {
                                data[i].checked = 'checked';
                            }
                        }
                    }
                    return data;
                },
                /* 简单模板替换 */
                _tpl: function(tpl, data) {
                    return tpl.replace(/{{(.*?)}}/g, function($1, $2) {
                        return data[$2] === undefined ? '' : data[$2];
                    });
                },
                /* 简单的遍历 */
                _each: function(tpl, data) {
                    var html = '';
                    for (var i = 0, len = data ? data.length : 0; i < len; i++) {
                        data[i].index = i;
                        html += c._tpl(tpl, data[i]);
                    }
                    return html;
                },
                init: function() {
                    var data = g.data,
                        wrap = g.wrap,
                        target = g.target,
                        cityHtml = '',
                        currentCity = '',
                        countyHtml = '',
                        sceneryHtml = '',
                        selectedHtml = '',
                        html = '',
                        htmlOtherSence = '';

                    t.lastData = data[0].children;

                    /* 第一级 */
                    cityHtml = c._each(domFragment.option, data);
                    cityHtml = '<select class="l-selectArea-city ui-select">' + cityHtml + '</select>';

                    /* 第二级 */
                    if (g.type === 1) {
                        countyHtml = c._each(domFragment.option, data[0].children);
                        countyHtml = '<select class="l-selectArea-county ui-select ui-select-mid" data-index="0">' + countyHtml + '</select>';
                        t.lastData = data[0].children[0].children;
                    } else if (g.type === 2) {
                        currentCity = [{
                            name: data[0].name,
                            id: data[0].id
                        }];
                        currentCity = c.flagSelectedData(currentCity);
                        currentCity = '<div class="l-selectArea-sceneryHeader ui-form">' + c._each(domFragment.checkbox, currentCity) + '</div>';
                    }

                    /* 最后一级 */
                    sceneryHtml = c._each(domFragment.checkbox, c.flagSelectedData(t.lastData));
                    sceneryHtml = '<div class="l-selectArea-scenery">' +
                        currentCity +
                        '<div class="l-selectArea-sceneryMain ui-form">' + sceneryHtml + '</div>' +
                        '</div>';

                    /* 已选 */
                    selectedHtml = '<div class="l-selectArea-selected">' + (t.selectedData && c._each(domFragment.selected, t.selectedData)) + '</div>';
                    htmlOtherSence += '<div class="l-selectArea-selectedWrap">' +
                        selectedHtml +
                        '<span class="l-selectArea-open ui-btn">请选择</span>' +
                        '</div>' +
                        '<div class="l-selectAreaMain">' +
                        '<div class="l-selectAreaWrap">' +
                        '<div class="l-selectAreaHeader">' +
                        '<div class="ui-form">' + cityHtml + countyHtml + '</div>' +
                        domFragment.search +
                        '</div>' +
                        sceneryHtml +
                        '</div>' + '<div class="l-selectAreaCenter">' + 
                                        '<span class="ui-label">其他景点：</span>' + 
                                        '<label><input type="text" class="ui-input otherSence" value=""></label>' + 
                                    '</div>' +
                        '<div class="l-selectAreaBottom"><span class="l-selectArea-close ui-btn">确定</span></div>' +
                        '</div>';

                    html += '<div class="l-selectArea-selectedWrap">' +
                        selectedHtml +
                        '<span class="l-selectArea-open ui-btn">请选择</span>' +
                        '</div>' +
                        '<div class="l-selectAreaMain">' +
                        '<div class="l-selectAreaWrap">' +
                        '<div class="l-selectAreaHeader">' +
                        '<div class="ui-form">' + cityHtml + countyHtml + '</div>' +
                        domFragment.search +
                        '</div>' +
                        sceneryHtml +
                        '</div>' + 
                        '<div class="l-selectAreaBottom"><span class="l-selectArea-close ui-btn">确定</span></div>' +
                        '</div>';

                    if(!g.isOtherSence){
                        wrap.html(html);            // 没有OtherSence   
                    }else{
                        wrap.html(htmlOtherSence);  //   有OtherSence
                        $(".otherSence").val(g.otherSence);
                    }

                    c.fnClick();
                    c.fnSelect();
                    c.fnSearch();
                    c.fnRemove();
                    c.fnClose();
                    target.val(c.getSelectIDs(t.selectedData));

                    return c;
                }
            }

        g.data = options.data ? options.data : [];
        g.target = $(options.target);
        g.wrap = $(options.wrap);
        g.type = options.type !== undefined ? options.type : 1;
        t.selectedData = options.selectedData ? options.selectedData : [];
        g.otherSence = options.otherSence ? options.otherSence : ""; 
        g.isOtherSence = options.hasOwnProperty("otherSence") ? true : false;

        g.run = c.init;
    };

    SelectArea.prototype = {

        constructor: SelectArea,

        getData: function(options) {
            var g = this,
                url = options.url,
                type = options.type ? options.type : 'POST';

            $.ajax({
                type: type,
                url: url,
                cache: false,
                dataType: "json",
                beforeSend: function() {

                },
                success: function(data) {
                    g.data = data;
                    g.run();
                },
                error: function(data) {
                    console.log(data);
                }
            });
        },

        reload: function() {

        }
    };

    return function(o) {
        return o ? new SelectArea(o) : {};
    };
}));