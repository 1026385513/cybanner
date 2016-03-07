(function($){
	$.fn.cybanner=function(options,control){
		var opts=$.extend({},$.fn.cybanner.defaults,options);
		return this.each(function(){
			var $this,hand;
			$this=$(this);
			$this.items=$this.children();
			$this.moved=false;
			$this.dec=opts.dec;
			$this.speed=parseInt(opts.speed);
			$this.i=0;
			hand=0;
			$this.on('touchstart',function(e){touchstart(e,$this);});
			$this.on('touchmove',function(e){e.preventDefault();touchmove(e,$this);});
			$this.on('touchend',function(e){touchend(e,$this);});
			$this.on('cy.move',function(e,num){
				var c=0;
				var dec=$this.dec;
				$this.trigger('cy.pause');
				if (num-$this.i>0)
				{
					if ($this.dec=="right"){$this.dec="left";}
					if ($this.dec=="bottom"){$this.dec="top";}
					move($this,num);
				}
				else if(num-$this.i<0){
					if ($this.dec=="left"){$this.dec="right";}
					if ($this.dec=="top"){$this.dec="bottom";}
					move($this,num);
				}
				$this.trigger('cy.start');
			});
			$this.on('cy.moveleft',function(){
				$this.trigger('cy.move',$this.i-1);
			});
			$this.on('cy.moveright',function(){
				$this.trigger('cy.move',$this.i+1);
			})
			$this.on('cy.pause',function(){
					clearInterval(hand);
					hand=0;
			});
			$this.on('cy.start',function(){
				if (!hand)
				{
					hand=setInterval(function(){
						if ($this.dec=="left"||$this.dec=="top")
						{
							move($this,$this.i+1);
						}
						else
						{
							move($this,$this.i-1);
						}
				
					},opts.interval);
				}
			});
			$this.on('resize',function(){
				scale($this);
			});
			init($this);
			$this.trigger('cy.start');
		});
	};
	$.fn.cybanner.dufaults={dec:'left',speed:400,interval:3000};
	function init($banner)
	{	
		if (document.createElement('canvas').getContext != undefined){
			$banner.h5=true;
		}
		$banner.map={"top":-1,"right":1,"bottom":1,"left":-1};
		scale($banner);
		wrap($banner);
	}
	function scale($banner)
	{
		var width,height;
		width=$banner.width();
		$banner.items.each(function(x){
			var item=$(this);
			if (this.nodeType&&this.nodeType==1){
				if (this.complete){
					item.css({'width':'100%','height':'auto'});
					if (item.height()>height){
						height=item.height();
						$banner.css({'height':height});
					}
				}else{
					item.on('load',function(){
						item.css({'width':'100%','height':'auto'});
						if (item.height()>height){
							height=item.height();
							$banner.css({'height':height});
						}
					});
				}
			}else{
				item.css('width',width);
				height=item.height()>height?item.height():height;
			}
		});
		if ($banner.dec=="left"||$banner.dec=="right"){
			$banner.step=width;
		}else{
			$banner.step=height;
		}
	}
	function wrap($banner)
	{
		var width,height,i,ctrlstr;
		i=0;
		if ($banner.h5){
			$banner.items.each(function(){
				$(this).wrap('<div style="position:static;display:table-cell;padding:0px;margin:0px;" index="'+i+'"></div>');
				i++;
			});
			$banner.itemsWrap=$banner.children();
			$banner.itemsWrap.css('width',$banner.width());
			width=$banner.width();
			height=$banner.itemsWrap.eq(0).height();
			$banner.css({'position':'absolute','width':width*$banner.itemsWrap.length,'height':height*$banner.itemsWrap.length});
			$banner.wrap('<div class="cybanner-wrap" style="position:relative;width:'+width+'px;height:'+height+'px;overflow:hidden;"></div>');
		}else{
			$banner.items.each(function(){
				$(this).wrap('<div style="position:absolute;left:0px;top;0px;display:block;" index="'+i+'"></div>');
				i++;
			});
			$banner.itemsWrap=$banner.children();
			$banner.itemsWrap.css('width',$banner.width());
			width=$banner.width();
			height=$banner.itemsWrap.eq(0).height();
			$banner.css({'position':'absolute','width':width,'height':height});
			$banner.wrap('<div class="cybanner-wrap" style="position:relative;width:'+width+'px;height:'+height+'px;overflow:hidden;"></div>');
			$banner.itemsWrap.hide();
			$banner.itemsWrap.eq(0).css('display','block');
		}
		if ($banner.style==undefined){
			$('head').append(
			'<style>\
				.cybanner{}\
				.cybanner-wrap ul{position:absolute;width:20%;height:4px;margin-left:40%;left:0px;bottom:0px;padding:0px}\
				.cybanner-wrap ul li{width:'+98/$banner.itemsWrap.length+'%;background:#999999;float:left;height:100%;list-style:none;padding:0px ;margin-right:1px;}\
				.cybanner-wrap ul li.on{background:#333333;}\
			</style>');
			
		}
		if ($banner.ctrl==undefined){
			ctrlstr="";
			for(var x=0;x<$banner.itemsWrap.length;x++){
				ctrlstr+="<li></li>";
			}
			ctrlstr='<ul>'+ctrlstr+'</ul>';
			$banner.ctrl=$banner.parent().append(ctrlstr).find('li');
			$banner.ctrl.eq(0).addClass('on');
			$banner.ctrl.on('click',function(){
				var self=this;
				move($banner,$banner.ctrl.index(self));
			});
		}
		
	};
	function touchstart(e,o){
		
		o.i=parseInt($(e.target).parents('div[index]').attr('index'));
		
		try{
			var touch = e.originalEvent.targetTouches[0]; 
	        var x = Number(touch.pageX);
	        var y = Number(touch.pageY);
	        o.t0=[x,y];
		}
		catch(v){
			  alert('touchSatrtFunc：' + v.message);
		}
		
	};
	function touchmove(e,o){
		var touch = e.originalEvent.targetTouches[0]; 
        var x = Number(touch.pageX);
        var y = Number(touch.pageY);
        o.t1=[x,y];
        var x0=o.t0[0];
        var y0=o.t0[1];
        var d=x-x0;
        var h=y-y0;
        if (o.dec=="right"||o.dec=="left")
        {
        	if (d>0)
        	{
        		o.dec="right";
        	}else{
        		o.dec="left";
        	}
        	
        }else{
        	if (h>0)
        	{
        		o.dec="bottom";
        	}else{
        		o.dec="top";
        	}
        }
        o.moved=true;
	};
	function touchend(e,o){
		if (o.moved)
		{
			if (o.dec=="left"||o.dec=="top")
			{
				move(o,o.i+1);
			}
			else
			{
				move(o,o.i-1);
			}
		}
	};
	function move($banner,index){
		var x,y,nextItem,currentItem,opts,dec,css3;
		opts={};
		dec="";
		dec=$banner.dec=="right"?"left":$banner.dec;
		dec=dec=="bottom"?"top":dec;
		css3={};
		currentItem=$banner.itemsWrap.eq($banner.i);
		$banner.trigger('cy.pause');
		if ($banner.map[$banner.dec]>0){
			$banner.i=index;
			if ($banner.i<0){
				$banner.i=$banner.itemsWrap.length-1;
			}
		}else{
			$banner.i=index;
			if ($banner.i>=$banner.itemsWrap.length){
				$banner.i=0;
			}
		}
		if ($banner.h5){
			opts['left']=$banner.dec=="left"||$banner.dec=="right"?-$banner.step*$banner.i:0;
			opts['top']=$banner.dec=="top"||$banner.dec=="bottom"?-$banner.step*$banner.i:0;
			if (opts['left']>0){
				opts['left']=-$banner.step*($banner.itemsWrap.length-1);
			}
			if (opts['top']>0){
				opts['top']=-$banner.step*($banner.itemsWrap.length-1);
			}
			css3['transform']='translate('+opts['left']+'px,'+opts['top']+'px)';
			css3['transition-duration']=$banner.speed/1000+"s";
			//-webkit-,-moz-,-o-.....
			$banner.css(css3);
		}else{
			opts[dec]=-$banner.map[$banner.dec]*$banner.step;
			x=parseInt($banner.css('left'));
			y=parseInt($banner.css('top'));
			nextItem=$banner.itemsWrap.eq($banner.i);
			nextItem.css($.extend({},opts,{'display':'block'}));
			opts[dec]=-opts[dec];
			$banner.animate(opts,$banner.speed,function(){
				var clear={};
				clear[dec]='0px';
				currentItem.css('display','none');
				nextItem.css(clear);
				$banner.css(clear);
			});
		}
		$banner.trigger('cy.start');
		ctrlView($banner.ctrl,$banner.i);
	};
	function ctrlView($ctrl,index){
		$ctrl.removeClass('on');
		$ctrl.eq(index).addClass('on');
	}

})(jQuery);


