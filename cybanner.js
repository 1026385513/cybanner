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
			$this.on('touchstart',function(e){$this.trigger('cy.pause');touchstart(e,$this);});
			$this.on('touchmove',function(e){e.preventDefault();touchmove(e,$this);});
			$this.on('touchend',function(e){touchend(e,$this);$this.trigger('cy.start');});
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
		scale($banner);
		wrap($banner);
		
		if (document.createElement('canvas').getContext != undefined){
			//use html5 animate
		}
	}
	function scale($banner)
	{
		var width,height;
		width=$banner.width();console.log(width)
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
		var i=0;
		var width,height;
		$banner.items.each(function(){
			$(this).wrap('<div style="position:absolute;left:0px;top;0px;display:block;" index="'+i+'"></div>');
			i++;
		});
		$banner.itemsWrap=$banner.children();
		$banner.itemsWrap.css('width',$banner.width());
		width=$banner.width();
		height=$banner.itemsWrap.eq(0).height();
		$banner.css({'position':'absolute','width':width,'height':height});
		$banner.wrap('<div style="position:relative;width:'+width+'px;height:'+height+'px;overflow:hidden;"></div>');
		$banner.map={"top":-1,"right":1,"bottom":1,"left":-1};
		$banner.itemsWrap.hide();
		$banner.itemsWrap.eq(0).css('display','block');
	}
	function now(o)
	{
		return o.itemsWrap.eq(o.i);
	}
	function next(o,c)
	{
		var e=null;
		var i=o.i;
		var l=o.itemsWrap.length;
		
		if (o.dec=="left"||o.dec=="right")
		{
			o.step=o.itemsWrap.eq(0).width();
		}
		else
		{
			o.step=o.itemsWrap.eq(0).height();
		}
		if (c>=l)
		{
			c=c-l;
		}
		else if (c<0)
		{
			c=l-1;
		}
		
		e=o.itemsWrap.eq(c);
		if (o.dec=="left"||o.dec=="top")
		{
			e.css(o.dec,o.step+'px');
		}
		else if(o.dec=="right")
		{
			e.css("left",-o.step+'px');
		}
		else if(o.dec=="bottom")
		{
			e.css("top",-o.step+'px');
		}
		e.css('display','block');
		return e;
	}
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
        if (Math.abs(d)>=Math.abs(h))
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
	function move(o,c){
		var x=parseInt(o.css('left'));
		var y=parseInt(o.css('top'));
		var n=next(o,c);
		var t=now(o);
		var opts={};
		var dec="";
		dec=o.dec=="right"?"left":o.dec;
		dec=dec=="bottom"?"top":dec;
		opts[dec]=o.map[o.dec]*o.step;
		o.animate(opts,o.speed,function(){
				var clear={};
				clear[dec]='0px';
				t.css('display','none');
				n.css(clear);
				o.css(clear);
			});
		o.i=parseInt(n.attr('index'));
	};

})(jQuery);


