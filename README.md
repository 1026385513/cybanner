# cybanner
jquery幻灯片插件
pc和移动端通用，4个方位自由切换。可根据触摸或点击及时切换滚动方向。

使用示例：

$('.doctor').cybanner({'dec':'left','speed':'400','interval':'4000'},function(o){});

自定义控制键：
$('left').on('click',function(){$('.doctor').trigger('cy.moveleft');})
$('right').on('click',function(){$('.doctor').trigger('cy.moveright');})

