(function () {
	'use strict';

	// Performance optimization: Throttle scroll events using requestAnimationFrame
	function throttleScroll(callback) {
		var ticking = false;
		return function() {
			if (!ticking) {
				window.requestAnimationFrame(function() {
					callback();
					ticking = false;
				});
				ticking = true;
			}
		};
	}

	// Custom Cursor - Smooth follow with slight delay
	var cursorDot = document.querySelector('.custom-cursor-dot');
	
	if (cursorDot) {
		var mouseX = 0;
		var mouseY = 0;
		var cursorX = 0;
		var cursorY = 0;
		
		// Track mouse position
		document.addEventListener('mousemove', function (e) {
			mouseX = e.clientX;
			mouseY = e.clientY;
		});
		
		// Smooth cursor animation with slight delay
		function animateCursor() {
			// Smooth follow with slight easing (0.2 = slight delay)
			cursorX += (mouseX - cursorX) * 0.2;
			cursorY += (mouseY - cursorY) * 0.2;
			
			cursorDot.style.transform = 'translate(' + (cursorX - 12) + 'px, ' + (cursorY - 12) + 'px)';
			
			requestAnimationFrame(animateCursor);
		}
		
		animateCursor();
		
		// Show cursor when mouse enters
		document.addEventListener('mouseenter', function () {
			cursorDot.style.opacity = '1';
		});
		
		// Hide cursor when mouse leaves
		document.addEventListener('mouseleave', function () {
			cursorDot.style.opacity = '0';
		});
		
		// Scale cursor on hover
		var hoverElements = document.querySelectorAll('a, button, .site-nav__link, .hero__arrow');
		hoverElements.forEach(function (el) {
			el.addEventListener('mouseenter', function () {
				cursorDot.style.transform = cursorDot.style.transform + ' scale(1.5)';
			});
			el.addEventListener('mouseleave', function () {
				cursorDot.style.transform = cursorDot.style.transform.replace(' scale(1.5)', '');
			});
		});
	}

	var rail = document.getElementById('rail');
	var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
	var nav = document.querySelector('.site-nav');
	var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav__link'));
	var heroArrow = document.querySelector('.hero__arrow');

	if (!rail || panels.length === 0 || links.length === 0) return;

	function getLinkForId(id) {
		return links.find(function (a) { return a.getAttribute('data-target') === id; }) || null;
	}

	// Click → scrollIntoView
	links.forEach(function (a) {
		a.addEventListener('click', function (e) {
			e.preventDefault();
			var targetId = a.getAttribute('data-target');
			var target = document.getElementById(targetId);
			if (!target) return;
			
			// If clicking on "projects" link, scroll to the top of projects panel first
			if (targetId === 'projects') {
				// Scroll horizontally to projects panel
				target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
				// Then scroll to top of the projects intro section
				setTimeout(function() {
					var projectsIntro = document.querySelector('.projects-intro');
					if (projectsIntro) {
						projectsIntro.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				}, 500);
			} else {
			target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
			}
		});
	});

	// Project label click in scrolled navbar - also navigate to projects overview
	var projectLabel = document.querySelector('.site-nav__project-label');
	if (projectLabel) {
		projectLabel.addEventListener('click', function(e) {
			e.preventDefault();
			var projectsPanel = document.getElementById('projects');
			if (projectsPanel) {
				// Scroll horizontally to projects panel
				projectsPanel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
				// Then scroll to top of the projects intro section
				setTimeout(function() {
					var projectsIntro = document.querySelector('.projects-intro');
					if (projectsIntro) {
						projectsIntro.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				}, 500);
			}
		});
	}

	// Hero arrow → next page
	if (heroArrow) {
		heroArrow.addEventListener('click', function (e) {
			e.preventDefault();
			var projectsPanel = document.getElementById('projects');
			if (projectsPanel) {
				projectsPanel.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
			}
		});
	}

	// Observe active panel within the horizontal scroller
	var activeId = 'start';
	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
				var id = entry.target.id;
				if (!id || id === activeId) return;
				activeId = id;

				// Update aria-current on links
				links.forEach(function (a) {
					var match = a.getAttribute('data-target') === id;
					if (match) {
						a.setAttribute('aria-current', 'page');
					} else {
						a.removeAttribute('aria-current');
					}
				});

				// Move programmatic focus to the active panel without causing scroll jumps
				requestAnimationFrame(function () {
					entry.target.focus({ preventScroll: true });
				});
			}
		});
	}, { root: rail, threshold: [0.6] });

	panels.forEach(function (panel) { io.observe(panel); });

	// Ensure initial state is correct on load
	window.addEventListener('load', function () {
		var hash = window.location.hash.replace('#', '') || 'start';
		var target = document.getElementById(hash);
		if (target) {
			getLinkForId(hash)?.setAttribute('aria-current', 'page');
			target.focus({ preventScroll: true });
		}
	});

	// Keyboard support: Home/End to jump to first/last panel when nav focused
	nav.addEventListener('keydown', function (e) {
		if (e.key === 'Home') {
			e.preventDefault();
			document.getElementById('start')?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
		}
		if (e.key === 'End') {
			e.preventDefault();
			document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
		}
	});

	// Project thumbnail buttons - scroll to specific project on desktop, navigate to separate page on mobile
	var projectButtons = document.querySelectorAll('.project-thumbnail-btn');
	projectButtons.forEach(function (btn) {
		btn.addEventListener('click', function () {
			var isMobile = window.innerWidth <= 480;
			var targetId = this.getAttribute('data-scroll-to');
			
			if (isMobile) {
				// On mobile, navigate to separate project page
				var projectSlug = this.getAttribute('data-project-slug');
				if (projectSlug) {
					window.location.href = 'project-' + projectSlug + '.html';
				}
			} else {
				// On desktop, scroll to project section as before
				var targetElement = document.getElementById(targetId);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		});
	});

	// Also make thumbnails clickable - on mobile go to separate page, on desktop scroll
	var thumbnails = document.querySelectorAll('.project-thumbnail');
	thumbnails.forEach(function (thumb) {
		thumb.addEventListener('click', function () {
			var isMobile = window.innerWidth <= 480;
			var projectNum = this.getAttribute('data-project');
			
			if (isMobile) {
				// Find the corresponding button to get the project slug
				var wrapper = this.closest('.project-thumbnail-wrapper');
				var button = wrapper.querySelector('.project-thumbnail-btn');
				var projectSlug = button.getAttribute('data-project-slug');
				if (projectSlug) {
					window.location.href = 'project-' + projectSlug + '.html';
				}
			} else {
				// On desktop, scroll to project section as before
				var targetElement = document.getElementById('project-' + projectNum);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		});
	});

	// Make project thumbnail info (title + arrow) clickable
	var projectInfos = document.querySelectorAll('.project-thumbnail-info');
	projectInfos.forEach(function (info) {
		info.addEventListener('click', function () {
			var isMobile = window.innerWidth <= 480;
			
			if (isMobile) {
				var projectSlug = this.getAttribute('data-project-slug');
				if (projectSlug) {
					window.location.href = 'project-' + projectSlug + '.html';
				}
			} else {
				// On desktop, scroll to the project section
				var wrapper = this.closest('.project-thumbnail-wrapper');
				var thumbnail = wrapper.querySelector('.project-thumbnail');
				var projectNum = thumbnail.getAttribute('data-project');
				var targetElement = document.getElementById('project-' + projectNum);
				if (targetElement) {
					targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		});
	});

	// About button - scroll to details
	var aboutBtn = document.querySelector('.about-btn');
	if (aboutBtn) {
		aboutBtn.addEventListener('click', function() {
			var targetId = this.getAttribute('data-scroll-to');
			var targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	}

	// About info (mobile) - scroll to details
	var aboutInfo = document.querySelector('.about-info');
	if (aboutInfo) {
		aboutInfo.addEventListener('click', function() {
			var targetId = this.getAttribute('data-scroll-to');
			var targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	}

	// About image - scroll to details
	var aboutImage = document.querySelector('.about-image');
	if (aboutImage) {
		aboutImage.addEventListener('click', function() {
			var targetId = this.getAttribute('data-scroll-to');
			var targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	}

	// Interests info (mobile) - scroll to gallery
	var interestsInfo = document.querySelector('.interests-info');
	if (interestsInfo) {
		interestsInfo.addEventListener('click', function() {
			var targetId = this.getAttribute('data-scroll-to');
			var targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	}

	// Contact info (mobile) - scroll to details
	var contactInfo = document.querySelector('.contact-info');
	if (contactInfo) {
		contactInfo.addEventListener('click', function() {
			var targetId = this.getAttribute('data-scroll-to');
			var targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	}

	// About CTA button - navigate to contact
	var aboutCta = document.querySelector('.about-details__cta');
	if (aboutCta) {
		aboutCta.addEventListener('click', function() {
			window.location.href = '#contact';
			setTimeout(function() {
				window.location.reload();
			}, 100);
		});
	}

	// Next Project button functionality / Let's talk button
	var nextProjectBtn = document.querySelector('.site-nav__next-project');
	if (nextProjectBtn) {
		nextProjectBtn.addEventListener('click', function() {
			// Check if we're in About or Interests section (button shows "Let's talk")
			if (navbar && (navbar.classList.contains('in-about') || navbar.classList.contains('in-interests'))) {
				// Navigate to Contact page by reloading to contact section
				window.location.href = '#contact';
				setTimeout(function() {
					window.location.reload();
				}, 100);
			} else {
				// We're in Projects section, go to next project
				var projectSections = Array.from(document.querySelectorAll('.project-section'));
				var currentIndex = -1;
				
				// Find current visible project
				projectSections.forEach(function(section, index) {
					var rect = section.getBoundingClientRect();
					if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
						currentIndex = index;
					}
				});
				
				// Scroll to next project
				if (currentIndex >= 0 && currentIndex < projectSections.length - 1) {
					var nextSection = projectSections[currentIndex + 1];
					nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		});
	}

	// Previous Project button functionality
	var prevProjectBtn = document.querySelector('.site-nav__prev-project');
	if (prevProjectBtn) {
		prevProjectBtn.addEventListener('click', function() {
			// Check if we're in About section (button shows "Previous" but should scroll to top)
			if (navbar && navbar.classList.contains('in-about')) {
				// Scroll to about intro section (back to top)
				var aboutIntro = document.querySelector('.about-intro');
				if (aboutIntro) {
					aboutIntro.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
				return;
			}
			
			// Check if we're in Interests section
			if (navbar && navbar.classList.contains('in-interests')) {
				// Scroll to interests content section (back to top)
				var interestsContent = document.querySelector('.interests-content');
				if (interestsContent) {
					interestsContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
				return;
			}
			
			// Check if we're in Contact section
			if (navbar && navbar.classList.contains('in-contact')) {
				// Scroll to contact content section (back to top)
				var contactContent = document.querySelector('.contact-content');
				if (contactContent) {
					contactContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
				return;
			}
			
			// We're in Projects section, go to previous project
			var projectSections = Array.from(document.querySelectorAll('.project-section'));
			var currentIndex = -1;
			
			// Find current visible project
			projectSections.forEach(function(section, index) {
				var rect = section.getBoundingClientRect();
				if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
					currentIndex = index;
				}
			});
			
			// Scroll to previous project or back to overview
			if (currentIndex > 0) {
				var prevSection = projectSections[currentIndex - 1];
				prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			} else if (currentIndex === 0) {
				// Go back to projects overview
				var projectsIntro = document.querySelector('.projects-intro');
				if (projectsIntro) {
					projectsIntro.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		});
	}

	// Navbar background on vertical scroll within project sections
	var navbar = document.querySelector('.site-nav--bottom');
	var projectsPanel = document.querySelector('.panel--projects');
	var projectSections = document.querySelectorAll('.project-section');
	var projectTitleSpan = document.querySelector('.site-nav__project-title');
	var prevProjectBtn = document.querySelector('.site-nav__prev-project');
	var prevProjectText = prevProjectBtn ? prevProjectBtn.querySelector('span:first-child') : null;
	var currentProjectSection = null;
	
	if (navbar && projectsPanel && projectSections.length > 0) {
		// Monitor which project section is currently visible
		var projectObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
					currentProjectSection = entry.target;
					
					// Update navbar title
					var projectTitle = entry.target.getAttribute('data-project-title');
					if (projectTitle && projectTitleSpan) {
						projectTitleSpan.textContent = projectTitle;
					}
					
					// Update Previous button text based on position
					if (prevProjectText) {
						var projectSectionsArray = Array.from(projectSections);
						var currentIndex = projectSectionsArray.indexOf(entry.target);
						
						if (currentIndex === 0) {
							// First project - show "Back"
							prevProjectText.textContent = 'Back';
						} else {
							// Other projects - show "Previous"
							prevProjectText.textContent = 'Previous';
						}
					}
				}
			});
		}, { 
			root: projectsPanel, 
			threshold: [0.5] 
		});
		
		// Observe all project sections
		projectSections.forEach(function(section) {
			projectObserver.observe(section);
		});
		
		// Listen to scroll on the main projects panel (optimized with throttling)
		var projectsIntro = document.querySelector('.projects-intro');
		projectsPanel.addEventListener('scroll', throttleScroll(function() {
			// Don't show scrolled navbar on mobile (only on desktop)
			var isMobile = window.innerWidth <= 480;
			if (isMobile) {
				return;
			}
			
			// Check if we're in a project section (not in overview)
			if (!projectsIntro) return;
			var introRect = projectsIntro.getBoundingClientRect();
			var isInOverview = introRect.bottom > 100; // Overview is still significantly visible
			
			if (!isInOverview && currentProjectSection) {
				// We're in a project, show scrolled navbar
				navbar.classList.add('scrolled');
				navbar.classList.add('in-project');
			} else {
				// We're in overview, hide scrolled navbar
				navbar.classList.remove('scrolled');
				navbar.classList.remove('in-project');
			}
		}));
		
		// Also listen to scroll events on individual project sections for inner scrolling (optimized)
		projectSections.forEach(function(section) {
			section.addEventListener('scroll', throttleScroll(function() {
				// Don't show scrolled navbar on mobile (only on desktop)
				var isMobile = window.innerWidth <= 480;
				if (isMobile) {
					return;
				}
				
				// Only activate if this is the current visible section
				if (section === currentProjectSection && section.scrollTop > 0) {
					navbar.classList.add('scrolled');
					navbar.classList.add('in-project');
				} else if (section.scrollTop === 0) {
					navbar.classList.remove('scrolled');
					navbar.classList.remove('in-project');
				}
			}));
		});
	}

	// Navbar background on vertical scroll within about section
	var aboutPanel = document.querySelector('.panel--about');
	var aboutSection = document.querySelector('.about-section');
	
	if (navbar && aboutPanel && aboutSection) {
		var aboutIntro = document.querySelector('.about-intro');
		// Listen to scroll on the main about panel (optimized)
		aboutPanel.addEventListener('scroll', throttleScroll(function() {
			// Don't show scrolled navbar on mobile (only on desktop)
			var isMobile = window.innerWidth <= 480;
			if (isMobile) {
				return;
			}
			
			// Check if we're in the details section (not in overview)
			if (!aboutIntro) return;
			var introRect = aboutIntro.getBoundingClientRect();
			var isInOverview = introRect.bottom > 100; // Overview is still significantly visible
			
			if (!isInOverview) {
				// We're in details, show scrolled navbar with "About"
				navbar.classList.add('scrolled');
				navbar.classList.add('in-project');
				navbar.classList.add('in-about');
				if (projectTitleSpan) {
					projectTitleSpan.textContent = 'About';
				}
				// Set button text to "Back"
				if (prevProjectText) {
					prevProjectText.textContent = 'Back';
				}
			} else {
				// We're in overview, hide scrolled navbar
				navbar.classList.remove('scrolled');
				navbar.classList.remove('in-project');
				navbar.classList.remove('in-about');
			}
		}));
		
		// Also listen to scroll events on the about section for inner scrolling (optimized)
		aboutSection.addEventListener('scroll', throttleScroll(function() {
			// Don't show scrolled navbar on mobile (only on desktop)
			var isMobile = window.innerWidth <= 480;
			if (isMobile) {
				return;
			}
			
			if (aboutSection.scrollTop > 0) {
				navbar.classList.add('scrolled');
				navbar.classList.add('in-project');
				navbar.classList.add('in-about');
				if (projectTitleSpan) {
					projectTitleSpan.textContent = 'About';
				}
				// Set button text to "Back"
				if (prevProjectText) {
					prevProjectText.textContent = 'Back';
				}
			}
		}));
	}

})(); 

// Performance optimization: Throttle scroll events using requestAnimationFrame (global)
function throttleScroll(callback) {
	var ticking = false;
	return function() {
		if (!ticking) {
			window.requestAnimationFrame(function() {
				callback();
				ticking = false;
			});
			ticking = true;
		}
	};
}

// Project Slider functionality
function nextSlide(button) {
	var slider = button.closest('.project__slider');
	var imagesContainer = slider.querySelector('.project__slider-images');
	var slides = Array.from(slider.querySelectorAll('.project__slide'));
	
	if (slides.length === 0) return;
	
	// Prevent multiple clicks during animation
	if (button.disabled) return;
	button.disabled = true;
	
	var firstSlide = slides[0];
	var slideWidth = firstSlide.offsetWidth;
	var gap = 24; // Gap between slides
	
	// Get the height of the first slide's image/video to center the arrow
	var firstImage = firstSlide.querySelector('.project__slide-image, .project__slide-video');
	if (firstImage) {
		var imageHeight = firstImage.offsetHeight;
		var nav = slider.querySelector('.project__slider-nav');
		nav.style.top = (imageHeight / 2) + 'px';
		nav.style.transform = 'translateY(-50%)';
	}
	
	// Animate the whole container to the left
	imagesContainer.style.transform = 'translateX(-' + (slideWidth + gap) + 'px)';
	
	// Wait for animation to complete, then move first slide to end
	setTimeout(function() {
		imagesContainer.style.transition = 'none';
		imagesContainer.style.transform = 'translateX(0)';
		imagesContainer.appendChild(firstSlide);
		
		// Re-enable transition after DOM update
		setTimeout(function() {
			imagesContainer.style.transition = 'transform 0.5s ease';
			button.disabled = false;
			
			// Update opacity for all slides - first-child CSS rule will handle the active one
			// Force browser to recalculate the first-child
			imagesContainer.offsetHeight;
			
			// Handle video playback - pause all videos first
			slides.forEach(function(slide) {
				var video = slide.querySelector('video');
				if (video) {
					video.pause();
					video.currentTime = 0;
				}
			});
			
		// Play video in the new first slide (100% opacity)
		var newFirstSlide = imagesContainer.querySelector('.project__slide:first-child');
		if (newFirstSlide) {
			var video = newFirstSlide.querySelector('video');
			if (video) {
				video.play();
			}
			
			// On mobile, expand the new first slide's description by default
			var isMobile = window.innerWidth <= 480;
			if (isMobile) {
				// First, remove expanded class from all slides
				slides.forEach(function(slide) {
					var title = slide.querySelector('.project__slide-title');
					var desc = slide.querySelector('.project__slide-description');
					if (title) title.classList.remove('expanded');
					if (desc) desc.classList.remove('expanded');
				});
				
				// Then add expanded class to the new first slide
				var titleElement = newFirstSlide.querySelector('.project__slide-title');
				var description = newFirstSlide.querySelector('.project__slide-description');
				if (titleElement && description) {
					titleElement.classList.add('expanded');
					description.classList.add('expanded');
				}
			}
		}
	}, 50);
}, 500);
}

// Initialize arrow position on page load
window.addEventListener('load', function() {
	var sliders = document.querySelectorAll('.project__slider');
	sliders.forEach(function(slider) {
		var firstSlide = slider.querySelector('.project__slide');
		if (firstSlide) {
			var firstImage = firstSlide.querySelector('.project__slide-image, .project__slide-video');
			if (firstImage) {
				var imageHeight = firstImage.offsetHeight;
				var nav = slider.querySelector('.project__slider-nav');
				if (nav) {
					nav.style.top = (imageHeight / 2) + 'px';
					nav.style.transform = 'translateY(-50%)';
				}
			}
			
			// Pause all videos in this slider
			var allSlides = slider.querySelectorAll('.project__slide');
			allSlides.forEach(function(slide) {
				var video = slide.querySelector('video');
				if (video) {
					video.pause();
					video.currentTime = 0;
				}
			});
			
		// Only play the video in the first slide
		var firstVideo = firstSlide.querySelector('video');
		if (firstVideo) {
			firstVideo.play();
		}
		
		// On mobile, expand the first slide's description by default
		var isMobile = window.innerWidth <= 480;
		if (isMobile) {
			var titleElement = firstSlide.querySelector('.project__slide-title');
			var description = firstSlide.querySelector('.project__slide-description');
			if (titleElement && description) {
				titleElement.classList.add('expanded');
				description.classList.add('expanded');
			}
		}
	}
	});
});

// Interests page random highlighting
function initInterestsHighlighting() {
	var interestsImages = document.querySelectorAll('.interests-image');
	if (interestsImages.length === 0) return;
	
	var currentHighlighted = 0;
	
	function highlightRandomImage() {
		// Remove previous highlight
		interestsImages[currentHighlighted].classList.remove('highlighted');
		
		// Select new random image
		currentHighlighted = Math.floor(Math.random() * interestsImages.length);
		interestsImages[currentHighlighted].classList.add('highlighted');
	}
	
	// Initial highlight
	highlightRandomImage();
	
	// Change highlight every 2 seconds
	setInterval(highlightRandomImage, 2000);
}

// Initialize interests highlighting when page loads
document.addEventListener('DOMContentLoaded', initInterestsHighlighting);

// Add click handler for project title in scrolled navbar
document.addEventListener('DOMContentLoaded', function() {
	var projectTitleSpan = document.querySelector('.site-nav__project-title');
	if (projectTitleSpan) {
		projectTitleSpan.addEventListener('click', function() {
			var navbar = document.querySelector('.site-nav--bottom');
			if (navbar.classList.contains('in-about')) {
				// Scroll to about intro section
				var aboutIntro = document.querySelector('.about-intro');
				if (aboutIntro) {
					aboutIntro.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			} else if (navbar.classList.contains('in-interests')) {
				// Scroll to interests content section
				var interestsContent = document.querySelector('.interests-content');
				if (interestsContent) {
					interestsContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			} else if (navbar.classList.contains('in-contact')) {
				// Scroll to contact content section
				var contactContent = document.querySelector('.contact-content');
				if (contactContent) {
					contactContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			}
		});
	}
});

// Interests gallery scroll functionality
document.addEventListener('DOMContentLoaded', function() {
	// Add click handlers to interests images
	var interestsImages = document.querySelectorAll('.interests-image[data-scroll-to]');
	interestsImages.forEach(function(image) {
		image.addEventListener('click', function() {
			var targetId = this.getAttribute('data-scroll-to');
			var targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth' });
			}
		});
	});
	
	// Add scroll handler to interests panel for navbar behavior
	var interestsPanel = document.querySelector('.panel--interests');
	var interestsGallery = document.querySelector('.interests-gallery');
	var navbar = document.querySelector('.site-nav--bottom');
	
	if (interestsPanel && interestsGallery && navbar) {
		var prevProjectText = document.querySelector('.site-nav__prev-project span:first-child');
		var interestsContent = document.querySelector('.interests-content');
		
		interestsPanel.addEventListener('scroll', throttleScroll(function() {
			// Don't show scrolled navbar on mobile (only on desktop)
			var isMobile = window.innerWidth <= 480;
			if (isMobile) {
				return;
			}
			
			if (!interestsContent) return;
			var contentRect = interestsContent.getBoundingClientRect();
			var isInOverview = contentRect.bottom > 100;
			
			if (!isInOverview) {
				navbar.classList.add('scrolled');
				navbar.classList.add('in-project'); // Reusing for general scrolled state
				navbar.classList.add('in-interests');
				var projectTitleSpan = document.querySelector('.site-nav__project-title');
				if (projectTitleSpan) {
					projectTitleSpan.textContent = 'Interests';
				}
				// Set button text to "Back"
				if (prevProjectText) {
					prevProjectText.textContent = 'Back';
				}
			} else {
				navbar.classList.remove('scrolled');
				navbar.classList.remove('in-project');
				navbar.classList.remove('in-interests');
			}
		}));
		
		interestsGallery.addEventListener('scroll', throttleScroll(function() {
			// Don't show scrolled navbar on mobile (only on desktop)
			var isMobile = window.innerWidth <= 480;
			if (isMobile) {
				return;
			}
			
			if (interestsGallery.scrollTop > 0) {
				navbar.classList.add('scrolled');
				navbar.classList.add('in-project');
				navbar.classList.add('in-interests');
				var projectTitleSpan = document.querySelector('.site-nav__project-title');
				if (projectTitleSpan) {
					projectTitleSpan.textContent = 'Interests';
				}
				// Set button text to "Back"
				if (prevProjectText) {
					prevProjectText.textContent = 'Back';
				}
			} else {
				navbar.classList.remove('scrolled');
				navbar.classList.remove('in-project');
				navbar.classList.remove('in-interests');
			}
		}));
	}
});

// Contact page scroll functionality
document.addEventListener('DOMContentLoaded', function() {
	// Add click handler to contact button
	var contactBtn = document.querySelector('.contact-btn[data-scroll-to]');
	if (contactBtn) {
		contactBtn.addEventListener('click', function() {
			var targetId = this.getAttribute('data-scroll-to');
			var targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth' });
			}
		});
	}
	
	// Add click handler to imprint link
	var imprintLink = document.querySelector('.contact-imprint-link[data-scroll-to]');
	if (imprintLink) {
		imprintLink.addEventListener('click', function(e) {
			e.preventDefault();
			var targetId = this.getAttribute('data-scroll-to');
			var targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth' });
			}
		});
	}
	
	// Add scroll handler to contact panel for navbar behavior
	var contactPanel = document.querySelector('.panel--contact');
	var contactDetails = document.querySelector('.contact-details');
	var imprintSection = document.querySelector('.imprint-section');
	var navbar = document.querySelector('.site-nav--bottom');
	
	if (contactPanel && contactDetails && navbar) {
		var prevProjectText = document.querySelector('.site-nav__prev-project span:first-child');
		var contactContent = document.querySelector('.contact-content');
		
		contactPanel.addEventListener('scroll', throttleScroll(function() {
			// Don't show scrolled navbar on mobile (only on desktop)
			var isMobile = window.innerWidth <= 480;
			if (isMobile) {
				return;
			}
			
			if (!contactContent) return;
			var contentRect = contactContent.getBoundingClientRect();
			var isInOverview = contentRect.bottom > 100;
			
			// Check if imprint section is visible
			if (imprintSection) {
				var imprintRect = imprintSection.getBoundingClientRect();
				var isInImprint = imprintRect.top < window.innerHeight / 2 && imprintRect.bottom > window.innerHeight / 2;
				
				if (isInImprint) {
					navbar.classList.add('scrolled');
					navbar.classList.add('in-project');
					navbar.classList.add('in-contact');
					var projectTitleSpan = document.querySelector('.site-nav__project-title');
					if (projectTitleSpan) {
						projectTitleSpan.textContent = 'Imprint';
					}
					// Set button text to "Back"
					if (prevProjectText) {
						prevProjectText.textContent = 'Back';
					}
					return;
				}
			}
			
			if (!isInOverview) {
				navbar.classList.add('scrolled');
				navbar.classList.add('in-project'); // Reusing for general scrolled state
				navbar.classList.add('in-contact');
				var projectTitleSpan = document.querySelector('.site-nav__project-title');
				if (projectTitleSpan) {
					projectTitleSpan.textContent = 'Contact';
				}
				// Set button text to "Back"
				if (prevProjectText) {
					prevProjectText.textContent = 'Back';
				}
			} else {
				navbar.classList.remove('scrolled');
				navbar.classList.remove('in-project');
				navbar.classList.remove('in-contact');
			}
		}));
		
		contactDetails.addEventListener('scroll', throttleScroll(function() {
			// Don't show scrolled navbar on mobile (only on desktop)
			var isMobile = window.innerWidth <= 480;
			if (isMobile) {
				return;
			}
			
			if (contactDetails.scrollTop > 0) {
				navbar.classList.add('scrolled');
				navbar.classList.add('in-project');
				navbar.classList.add('in-contact');
				var projectTitleSpan = document.querySelector('.site-nav__project-title');
				if (projectTitleSpan) {
					projectTitleSpan.textContent = 'Contact';
				}
				// Set button text to "Back"
				if (prevProjectText) {
					prevProjectText.textContent = 'Back';
				}
			} else {
				navbar.classList.remove('scrolled');
				navbar.classList.remove('in-project');
				navbar.classList.remove('in-contact');
			}
		}));
	}

	// Toggle slide descriptions
	document.addEventListener('click', function(e) {
		// Check if clicking on slide title or title toggle
		if (e.target.classList.contains('project__slide-title') || 
		    e.target.closest('.project__slide-title') ||
		    e.target.classList.contains('project__slide-title-toggle')) {
			
			var titleElement;
			if (e.target.classList.contains('project__slide-title')) {
				titleElement = e.target;
			} else if (e.target.classList.contains('project__slide-title-toggle')) {
				titleElement = e.target.parentElement;
			} else {
				titleElement = e.target.closest('.project__slide-title');
			}
			
			var description = titleElement.nextElementSibling;
			
			if (description && description.classList.contains('project__slide-description')) {
				titleElement.classList.toggle('expanded');
				description.classList.toggle('expanded');
				e.stopPropagation(); // Prevent slide click handler from firing
			}
		}
		// Check if clicking on active slide (but not on title or description)
		else if (e.target.classList.contains('project__slide') || e.target.closest('.project__slide')) {
			var slideElement = e.target.classList.contains('project__slide') ? e.target : e.target.closest('.project__slide');
			var slider = slideElement.closest('.project__slider');
			var firstSlide = slider ? slider.querySelector('.project__slide:first-child') : null;
			
			// Only toggle if this is the active (first) slide and on desktop
			var isMobile = window.innerWidth <= 480;
			if (slideElement === firstSlide && !isMobile) {
				var titleElement = slideElement.querySelector('.project__slide-title');
				var description = slideElement.querySelector('.project__slide-description');
				
				if (titleElement && description) {
					titleElement.classList.toggle('expanded');
					description.classList.toggle('expanded');
				}
			}
		}
	});

	// Mobile menu toggle
	var mobileMenuToggle = document.querySelector('.site-nav__mobile-menu-toggle');
	var mobileMenuList = document.querySelector('.site-nav__list');
	var navbar = document.querySelector('.site-nav--bottom');
	
	if (mobileMenuToggle && mobileMenuList && navbar) {
		mobileMenuToggle.addEventListener('click', function() {
			var isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
			
			mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
			mobileMenuList.classList.toggle('menu-open');
			navbar.classList.toggle('menu-open');
			
			// Change icon
			var icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
			if (icon) {
				icon.textContent = isExpanded ? 'menu' : 'close';
			}
		});

		// Close menu when clicking on a link
		var menuLinks = mobileMenuList.querySelectorAll('.site-nav__link');
		menuLinks.forEach(function(link) {
			link.addEventListener('click', function() {
				mobileMenuToggle.setAttribute('aria-expanded', 'false');
				mobileMenuList.classList.remove('menu-open');
				navbar.classList.remove('menu-open');
				var icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
				if (icon) {
					icon.textContent = 'menu';
				}
			});
		});

		// Close menu when clicking outside
		document.addEventListener('click', function(e) {
			if (!mobileMenuToggle.contains(e.target) && !mobileMenuList.contains(e.target) && !navbar.querySelector('.site-nav__header').contains(e.target)) {
				mobileMenuToggle.setAttribute('aria-expanded', 'false');
				mobileMenuList.classList.remove('menu-open');
				navbar.classList.remove('menu-open');
				var icon = mobileMenuToggle.querySelector('.material-symbols-outlined');
				if (icon) {
					icon.textContent = 'menu';
				}
			}
		});
	}

	// Make slides clickable to navigate forward
	var slides = document.querySelectorAll('.project__slide');
	slides.forEach(function(slide) {
		slide.addEventListener('click', function() {
			// Only trigger if this is not the first (active) slide
			var slider = this.closest('.project__slider');
			var firstSlide = slider.querySelector('.project__slide:first-child');
			
			if (this !== firstSlide) {
				// Find the arrow button and trigger next slide
				var arrowButton = slider.querySelector('.project__slider-arrow');
				if (arrowButton) {
					nextSlide(arrowButton);
				}
			}
		});
		
		// Add cursor pointer style for non-first slides
		slide.style.cursor = 'pointer';
	});
}); 