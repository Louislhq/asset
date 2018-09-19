/* 目录结构 */
  
	asset
	   
		-- dev 开发目录
		   
			-- js
			
				-- app 基础脚本
				
				-- core 公用开发脚本
				
				-- lib 应用型脚本
					
					-- 第三方插件
					
					-- *.js 私有模块
					
				-- config.js 配置文件
				
				
				
			-- less
				
				-- lib 基本样式
					-- base.less 基础样式
					-- mixins.less 通用函数		
					-- color.less 全局颜色表		
					
				-- core 组件样式
					-- ui-*.less 一般组件
					-- svg-svgcssTemplatesicon.less 生成svg的css模板
					-- svgcssTemplates.less gulp生成的sprite样式
				
				-- app 不可通用样式
					-- mod.less 模块样式入口
					-- mod 模块目录
					-- page.less 页面样式入口
					-- page 页面目录
					-- layout.less 页面布局样式
					
				-- style.less 总入口
				
			-- img
				
				-- default 默认合并图片
				
				-- svg 合并图片，只允许svg格式
				
		   
		-- dest 发布目录
	   
			-- js
		   
			-- css
		   
			-- img

				
		-- doc 文档目录
		
		-- gulpfile.js
		
		-- package.json
		
		-- run.bat
		
		-- install.bat
		
		-- sprite.bat
	
	

/* 代码规范 */	

/*
js部分：
1、“l-”前缀：JS控件，如“.l-grid、.l-tree”。
2、“j-”前缀：页面上的js交互标示，如“.j-submit”。

css部分：
1、“lt-”前缀：通用布局，如“.lt-right”。
2、“.mod-/#mod-”前缀：通用模块，如“.mod-search，.mod-search-more”
	1)、一个模块一个less文件
	2)、继承模块写在对应的模块下面
	3)、模块与模块在页面上禁止嵌套
3、“.svg-”前缀：图标样式，如“.svg-edit”、“.svg-error”。
4、“.fn-”前缀：常用功能样式，目前就提供“.fn-left”、“.fn-right”、“.fn-clear”、“.fn-hide”四种样式，只在less内调用，页面内禁用。
5、“.page-”前缀：页面级样式，如“.page-index”。
6、“.ui-”前缀：
	1)、表单样式，分为“.ui-input”、“.ui-radio”、“.ui-checkbox”、“.ui-textarea”、“.ui-select”、“.ui-label、.ui-label-radio、.ui-label-checkbox”。
	2)、按钮样式，基本型是定大小宽度等，扩展型是搭配一个基本型使用
		(1)、基本型ui-btn-small、ui-btn，ui-btn-big，ui-btn-largeBig
		(2)、扩展型ui-btn-cancel、ui-btn-disable、ui-btn-gray、ui-btn-blue

*/
	
