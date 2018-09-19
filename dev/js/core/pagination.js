(function(root, factory){
	if (typeof define === 'function' && define.amd) {
		define(['jquery'],factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.pagination = factory(root.jQuery);
	}
}(this, function($){
	'use strict';

	var pagination = function(options){
		this.cur        = options.cur || 1; //选中的页数;
		this.allTotal   = options.allTotal || ''; //总条数;
		this.total      = options.total || ''; //总页数;
		this.len        = options.len >= 6 ? options.len : 6; //显示的页数长度;
		this.midNum     = options.midNum >= 5 ? options.midNum : 5; //中间显示的页数(尽量不做设置);
		this.prevText   = options.prevText || '&lt;'; //显示上一页;
		this.nextText   = options.nextText || '&gt;'; //显示下一页;
		this.target     = options.target || ''; //显示的目标ID;
		this.callback   = options.callback || function(){}; //回调函数;

		if (!this.target || !this.total) {
			console.log('请填写target或者total值');
			return
		}
		if (typeof this.target === 'string') {
			this.target = document.getElementById(this.target);
		}
		
		this.init();
		this.click(this.callback);
	}

	pagination.prototype.init = function(){
		let tmp      = '',
			first    = '<span>共'+ this.allTotal +'条</span>',
			text     = '<a href="javascript:;" data-index="{{num}}">{{num}}</a>',
			prev     = '<a href="javascript:;" data-index="{{num}}">'+ this.prevText +'</a>',
			next     = '<a href="javascript:;" data-index="{{num}}">'+ this.nextText +'</a>',
			cur      = '<a href="javascript:;" class="cur" data-index="{{num}}">{{num}}</a>',
			ellipsis = '<span>…</span>',
			last     = `<span>到第</span>
						<input type="text" name="pages" id="page" class="ui-input">
                        <span>页</span>
                        <span class="ui-btn" id="j-page-btn">确定</span>`,
            haddle   = function(src, num){
			            	return src.replace(/{{num}}/g, num);
			            },
			showNum  = 3;

		/* 显示长度 */
		if (this.midNum >= 3) {
			showNum = Math.round(this.midNum/2);
		}

		/* 总条数 */
		if (this.allTotal > 0 ) {
			tmp += first;
		}

		/* 上一页 */
		if (this.cur >= 2) {
			tmp += haddle(prev, this.cur-1);
		}

		/* 前置省略号 */
		if (this.cur >= 5 && this.total >= this.len + 1) {
			tmp += haddle(text, 1);
			tmp += ellipsis;
		}
		/* 连接 */
		if (this.total <= this.len + 1) {
			for(var i = 1; i <= this.total; i++) {
				tmp += haddle(i === this.cur ? cur : text, i);
			}
		} else {
			for (let i = 1,isCur = false, num = 0; i <= this.len; i++) {
				if (this.cur < 5) {
					if (i === this.cur) {
						isCur = true;
					}
					num = i;
				} else if (this.total - this.cur  > this.midNum - showNum + 2) {
					// 显示中间部分;
					if (i == showNum) {
						isCur = true;
					}else if (i > this.midNum) {
						break;
					}
					num = this.cur - showNum + i;
				} else if (this.total - this.cur <= this.midNum - showNum + 2) {
					// 显示后面部分;
					if( this.len - (this.total - this.cur) === i ){
						isCur = true;
					}
					num  = this.total - this.len + i;
				}
				tmp += haddle(isCur ? cur : text, num);
				isCur = false;
			}
			
		}
		/* 后置省略号 */
		// && this.total > this.len + 1
		if( this.total - this.cur > this.midNum - showNum + 2  ){
			tmp += ellipsis;
			tmp += haddle(text, this.total)
		}

		/* 下一页 */
		if (this.total - this.cur >= 1) {
			tmp += haddle(next, this.cur + 1)
		}

		tmp += last;

		this.target.innerHTML = tmp;
	};

	pagination.prototype.click = function(fn){
		var that = this,
			oA   = this.target.getElementsByTagName('a'),
			btn  = document.getElementById('j-page-btn'),
			page = document.getElementById('page');
		for (let i = 0; i < oA.length; i++) {
			oA[i].onclick = function(){
				that.cur = Number(this.getAttribute('data-index'));
				that.init();
				that.click(fn);
				fn.apply(this, [that.cur,that.total]);
			}
		};
		btn.onclick = function(){
			let pageValue = page.value;
			if (pageValue && pageValue > 0 && pageValue <= that.total) {
				that.cur = Number(pageValue);
				that.init();
				that.click(fn);
				fn.apply(this, [that.cur,that.total]);
			}
		}
	}
	return function(o){
		return o ? new pagination(o) : {};
	}
}));