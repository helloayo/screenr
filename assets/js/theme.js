/**
 * skip-link-focus-fix.js
 *
 * Helps with accessibility for keyboard only users.
 *
 * Learn more: https://git.io/vWdr2
 */
( function() {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && document.getElementById && window.addEventListener ) {
		window.addEventListener( 'hashchange', function() {
			var id = location.hash.substring( 1 ),
				element;

			if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
				return;
			}

			element = document.getElementById( id );

			if ( element ) {
				if ( ! ( /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) ) {
					element.tabIndex = -1;
				}

				element.focus();
			}
		}, false );
	}
})();

/**
 * navigation.js
 *
 * Handles toggling the navigation menu for small screens and enables tab
 * support for dropdown menus.
 */
( function() {
	var container, button, menu, links, subMenus;

	container = document.getElementById( 'site-navigation' );
	if ( ! container ) {
		return;
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
		menu.className += ' nav-menu';
	}

	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
			container.className = container.className.replace( ' toggled', '' );
			button.setAttribute( 'aria-expanded', 'false' );
			menu.setAttribute( 'aria-expanded', 'false' );
		} else {
			container.className += ' toggled';
			button.setAttribute( 'aria-expanded', 'true' );
			menu.setAttribute( 'aria-expanded', 'true' );
		}
	};

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );
	subMenus = menu.getElementsByTagName( 'ul' );

	// Set menu items with submenus to aria-haspopup="true".
	for ( var i = 0, len = subMenus.length; i < len; i++ ) {
		subMenus[i].parentNode.setAttribute( 'aria-haspopup', 'true' );
	}

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}


} )();







jQuery( document ).ready( function( $ ){

	//-------------------

	var video_support = function(){
		return !!document.createElement('video').canPlayType;
	};
	var is_video_support = video_support();

	$( '.swiper-full-screen').each( function(){
		var s = $( this );
		s.width( $( window).width());
		s.height( $( window).height());
	} );

	$( window).resize( function(){
		$( '.swiper-full-screen').each( function(){
			var s = $( this );
			s.width( $( window).width());
			s.height( $( window).height());
		} );
	} );

	var swiper = new Swiper('.swiper-container', {
		// Disable preloading of all images
		preloadImages: false,
		loop: true,
		// Enable lazy loading
		lazyLoading: true,
		autoplay: 1000,
		pagination: '.swiper-pagination',
		paginationClickable: true,
		onInit: function( swiper ){
			var index = swiper.activeIndex;
			swiper.slides.each( function( index, slide ){
				console.log( slide );
				if ( $( 'video', slide).length > 0 ) {
					var v = $('video', slide ).eq(0);
					v.on('timeupdate', function () {
						var currentPos = v[0].currentTime; //Get currenttime
						var maxduration = v[0].duration; //Get video duration

						if (currentPos >= maxduration) {
							v[0].pause();
							swiper.startAutoplay();
						}
						var percentage = 100 * currentPos / maxduration; //in %
						$('.swiper-timebar').text('Playing: ' + percentage + '%' + ' at ' + currentPos + '(s)');
					});
				}
			} );

			var slide =  swiper.slides[ swiper.activeIndex ];
			if ( $( 'video',slide ).length > 0 ) {
				var v = $('video', slide ).eq(0);
				//if ( slider.vars.slideshow ) {
				swiper.stopAutoplay();
				v[0].play();
			}

		},
		onSlideChangeStart: function( swiper ){
			var index = swiper.activeIndex;
			var slide =  swiper.slides[ swiper.activeIndex ];
			if ( $( 'video',slide ).length > 0 ) {
				var v = $('video', slide ).eq(0);
				//if ( slider.vars.slideshow ) {
				swiper.stopAutoplay();
				v[0].play();
			}
		}
	});




} );