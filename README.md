# cybanner
jquery幻灯片插件
pc和移动端通用，自适应屏幕大小，移动端使用translate动画，pc端使用修改left，top来实现动画。

使用示例：

$('.doctor').cybanner({'dec':'left','speed':'400','interval':'4000'},function(o){});

自定义控制键：
$('.left').on('click',function(){$('.doctor').trigger('cy.moveleft');})
$('.right').on('click',function(){$('.doctor').trigger('cy.moveright');})

