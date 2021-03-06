function load(src, fn) {
	var can = document.createElement('canvas'),
		ctx = can.getContext('2d');

	var img = new Image();
	img.onload = function(){
		can.width = img.width;
		can.height = img.height;
		ctx.drawImage(img, 0, 0, img.width, img.height);

		fn && fn.call(this, can);
	}

	img.src = src;
}

$(function() {
	var srcs = ['8x8-0.png','8x8-1.png'], dfds = [];

	srcs.forEach(function(src) {
		var $dfd = new $.Deferred();

		load(src, function(ctx) {
			$dfd.resolve(ctx);
		});

		dfds.push($dfd);
	});

	$.when.apply($, dfds).then(function(layer0, layer1) {
		var width = 128,
			height = 128,
			opts = {
				loop: 0,
				loopDelay: 50,
				frameDelay: 25,
			//	cropBox: [2,2,5,5],
			};

		var gif = new GIFter(width, height, opts);

		// .addFrame() calls should go into your rendering loop
		gif.addFrame(layer0);
		// multi-layer frame
		gif.addFrame([layer0, layer1]);

		// encode
		var img = gif.render();

		// let's see it!
		document.body.appendChild(img);
	});
});