	// jQuery Selections
	var $html = $('html'),
		$container = $('#container'),
		$toggle = $('#toggle'),
		$about = $('#about'),
		$scene = $('#scene');

	// Hide browser menu.
	(function() {
		setTimeout(function(){window.scrollTo(0,0);},0);
	})();

	// Setup FastClick.
	FastClick.attach(document.body);

	// Add touch functionality.
	if (Hammer.HAS_TOUCHEVENTS) {
		$container.hammer({drag_lock_to_axis: true});
		_.tap($html, 'a,button,[data-tap]');
	}

	// Add touch or mouse class to html element.
	$html.addClass(Hammer.HAS_TOUCHEVENTS ? 'touch' : 'mouse');

	// Resize handler.
	(resize = function() {
		$scene[0].style.width = window.innerWidth + 'px';
		$scene[0].style.height = window.innerHeight + 'px';
	})();

	// Attach window listeners.
	window.onresize = _.debounce(resize, 200);
	window.onscroll = _.debounce(resize, 200);

	function showDetails() {
		$about.removeClass('hide');
		$toggle.removeClass('i');
	}

	function hideDetails() {
		$about.addClass('hide');
		$toggle.addClass('i');
	}

	// Listen for toggle click event.
	$toggle.on('click', function(event) {
		$toggle.hasClass('i') ? showDetails() : hideDetails();
	});

	// Pretty simple huh?
	$scene.parallax();

