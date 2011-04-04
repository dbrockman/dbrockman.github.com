(function () {
	var win = window,
		doc = win.document,
		canvas, context, prevMouseX, prevMouseY, isStroking;

	/////////////////////////////////////////////////////////

	function stroke(mouseX, mouseY) {
		var dx = mouseX - prevMouseX,
			dy = mouseY - prevMouseY,
			steps = Math.random() * 10 | 0,
			step_delta = (Math.sqrt(dx * dx + dy * dy) * 2) / steps,
//			cx = Math.floor(mouseX / 100) * 100 + 50,
//			cy = Math.floor(mouseY / 100) * 100 + 50,
			cx = mouseX,
			cy = mouseY,
			i = 0, hue, hsla;

		for (; i < steps; i++) {
			context.beginPath();
			// Hue from X and Y and mix in the mouse speed a bit.
			hue = ((mouseX ^ step_delta) ^ (mouseY ^ step_delta)) % 360;
			hsla = 'hsla(' + hue + ',99%,50%,0.1);';
			context.strokeStyle = hsla;
			context.arc(cx, cy, (steps * 3 / i) * step_delta, 0, Math.PI * 2, true);
//			context.stroke();
			context.fillStyle = hsla;
			context.fill();
		}
		prevMouseX = mouseX;
		prevMouseY = mouseY;
	}

	/////////////////////////////////////////////////////////

	function addEvent(type, fn, el) {
		if (el && el.addEventListener) {
			el.addEventListener(type, fn, false);
		}
	}

	function removeEvent(type, fn, el) {
		if (el && el.removeEventListener) {
			// this can throw an exception in FF
			try {
				el.removeEventListener(type, fn, false);
			} catch (ex) {}
		}
	}

	/////////////////////////////////////////////////////////

	function onTouchMove(e) {
		if (e.touches.length === 1) {
			e.preventDefault();
			stroke(e.touches[0].pageX, e.touches[0].pageY);
		}
	}

	function onTouchEnd(e) {
		if (e.touches.length === 0) {
			e.preventDefault();
			removeEvent('touchmove', onTouchMove, win);
			removeEvent('touchend', onTouchEnd, win);
		}
	}

	/////////////////////////////////////////////////////////

	function ready() {
		if ((/in/).test(doc.readyState)) {
			// doc not ready yet
			return setTimeout(ready, 9);
		} else {
			canvas = doc.createElement('canvas');
			canvas.width = win.innerWidth;
			canvas.height = win.innerHeight;
			doc.body.appendChild(canvas);

			if (canvas.getContext) {
				context = canvas.getContext('2d');
				context.lineWidth = 1;
				context.globalCompositeOperation = 'lighter';

				addEvent('mouseout', function () {
					isStroking = false;
				}, doc);

				addEvent('mousedown', function () {
					context.globalCompositeOperation = 'darker';
				}, doc);
				addEvent('mouseup', function () {
					context.globalCompositeOperation = 'lighter';
				}, doc);

				addEvent('mousemove', function (e) {
					if (isStroking) {
						stroke(e.clientX, e.clientY);
					} else {
						prevMouseX = e.clientX;
						prevMouseY = e.clientY;
						isStroking = true;
					}
				}, doc);

				addEvent('touchstart', function (e) {
					if (e.touches.length === 1) {
						e.preventDefault();
						prevMouseX = e.touches[0].pageX;
						prevMouseY = e.touches[0].pageY;
						addEvent('touchmove', onTouchMove, win);
						addEvent('touchend', onTouchEnd, win);
					}
				}, doc);
			}
		}
	}
	ready();
}());



