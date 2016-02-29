(function($){
	$.fn.cybanner=function(options,control){
		var opts=$.extend({},$.fn.cybanner.defaults,options);
		return this.each(function(){
			var $this;
			$this=$(this);
			$this.cy={};
			$this.cy.items=$this.children();
			$this.cy.moved=false;
			$this.cy.dec=opts.dec;
			$this.cy.speed=parseInt(opts.speed);
			$this.cy.i=0;
			$this.children().css('width',$this.width());
			$this.css('height',$this.innerHeight());
			$this.wrap('<div style="position:relative;width:'+$this.width()+'px;height:'+$this.height()+'px;overflow:hidden;"></div>');
			$this.cy.map={"top":["top",1],"right":["left",-1],"bottom":["top",-1],"left":["left",1]};
			var hand=0;
			for(var i=0;i<$this.cy.items.length;i++)
			{
				$this.cy.items.eq(i).wrap('<div style="position:absolute;left:0px;top;0px;display:none;" index="'+i+'"></div>');
			}
			$this.cy.items=$this.children();
			init($this,opts);
			$this.on('touchstart',function(e){$this.trigger('cy.pause');touchstart(e,$this);});
			$this.on('touchmove',function(e){e.preventDefault();touchmove(e,$this);});
			$this.on('touchend',function(e){touchend(e,$this);$this.trigger('cy.start');});
			$this.on('cy.move',function(e,num){
				var c=0;
				var dec=$this.cy.dec;
				$this.trigger('cy.pause');
				if (num-$this.cy.i>0)
				{
					if ($this.cy.dec=="right"){$this.cy.dec="left";}
					if ($this.cy.dec=="bottom"){$this.cy.dec="top";}
					move($this,num);
				}
				else if(num-$this.cy.i<0){
					if ($this.cy.dec=="left"){$this.cy.dec="right";}
					if ($this.cy.dec=="top"){$this.cy.dec="bottom";}
					move($this,num);
				}
				$this.trigger('cy.start');
			});
			$this.on('cy.moveleft',function(){
				$this.trigger('cy.move',$this.cy.i-1);
			});
			$this.on('cy.moveright',function(){
				$this.trigger('cy.move',$this.cy.i+1);
			})
			$this.on('cy.pause',function(){
					clearInterval(hand);
					hand=0;
			});
			$this.on('cy.start',function(){
				if (!hand)
				{
					hand=setInterval(function(){
						if ($this.cy.dec=="left"||$this.cy.dec=="top")
						{
							move($this,$this.cy.i+1);
						}
						else
						{
							move($this,$this.cy.i-1);
						}
				
					},opts.interval);
				}
			});
			$this.trigger('cy.start');
		});
	};
	$.fn.cybanner.dufaults={dec:'left',speed:400,interval:3000};
	function init(o,opt)
	{
		if (opt.dec=="left"||opt.dec=="right")
		{
			o.cy.step=o.cy.items.eq(0).width();
		}
		else
		{
			o.cy.step=o.cy.items.eq(0).height();
		}
		o.cy.items.eq(0).css('display','block');
	}
	function now(o)
	{
		return o.cy.items.eq(o.cy.i);
	}
	function next(o,c)
	{
		var e=null;
		var i=o.cy.i;
		var l=o.cy.items.length;
		
		if (o.cy.dec=="left"||o.cy.dec=="right")
		{
			o.cy.step=o.cy.items.eq(0).width();
		}
		else
		{
			o.cy.step=o.cy.items.eq(0).height();
		}
		if (c>=l)
		{
			c=c-l;
		}
		else if (c<0)
		{
			c=l-1;
		}
		
		e=o.cy.items.eq(c);
		if (o.cy.dec=="left"||o.cy.dec=="top")
		{
			e.css(o.cy.dec,o.cy.step+'px');
		}
		else if(o.cy.dec=="right")
		{
			e.css("left",-o.cy.step+'px');
		}
		else if(o.cy.dec=="bottom")
		{
			e.css("top",-o.cy.step+'px');
		}
		e.css('display','block');
		return e;
	}
	function touchstart(e,o){
		
		o.cy.i=parseInt($(e.target).parents('div[index]').attr('index'));
		
		try{
			var touch = e.originalEvent.targetTouches[0]; 
	        var x = Number(touch.pageX);
	        var y = Number(touch.pageY);
	        o.cy.t0=[x,y];
		}
		catch(v){
			  alert('touchSatrtFunc：' + v.message);
		}
		
	};
	function touchmove(e,o){
		var touch = e.originalEvent.targetTouches[0]; 
        var x = Number(touch.pageX);
        var y = Number(touch.pageY);
        o.cy.t1=[x,y];
        var x0=o.cy.t0[0];
        var y0=o.cy.t0[1];
        var d=x-x0;
        var h=y-y0;
        if (Math.abs(d)>=Math.abs(h))
        {
        	if (d>0)
        	{
        		o.cy.dec="right";
        	}else{
        		o.cy.dec="left";
        	}
        	
        }else{
        	if (h>0)
        	{
        		o.cy.dec="bottom";
        	}else{
        		o.cy.dec="top";
        	}
        }
        o.cy.moved=true;
	};
	function touchend(e,o){
		if (o.cy.moved)
		{
			
			if (o.cy.dec=="left"||o.cy.dec=="top")
			{
				move(o,o.cy.i+1);
			}
			else
			{
				move(o,o.cy.i-1);
			}
			
		}
		
	};
	function move(o,c){
		var x=parseInt(o.css('left'));
		var y=parseInt(o.css('top'));
		//console.log(o.cy.i+'----'+c);
		var n=next(o,c);
		var t=now(o);
		//o.animate({o.cy.map[o.cy.dec][0]:o.cy.map[o.cy.dec][1]*o.cy.step},o.cy.speed,function)
		
		if (o.cy.dec=="left")
		{
			o.animate({'left':-o.cy.step},o.cy.speed,function(){
				t.css('display','none');
				n.css('left','0px');
				o.css('left','0px');
			});
		}
		if (o.cy.dec=="right")
		{
			o.animate({'left':o.cy.step},o.cy.speed,function(){
				t.css('display','none');
				n.css('left','0px');
				o.css('left','0px');
			});
		}
		if (o.cy.dec=="top")
		{
			o.animate({'top':-o.cy.step},o.cy.speed,function(){
				t.css('display','none');
				n.css('top','0px');
				o.css('top','0px');
			});
		}
		if (o.cy.dec=="bottom")
		{
			o.animate({'top':o.cy.step},o.cy.speed,function(){
				t.css('display','none');
				n.css('top','0px');
				o.css('top','0px');
			});
		}
		
		o.cy.i=parseInt(n.attr('index'));
		//console.log("moved---"+o.cy.i);
		
	};

})(jQuery);


