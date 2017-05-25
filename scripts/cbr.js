// Declare status flags
var flagBusy = false;
var flagChart = false;
var flagFinancialCounters = false;


var chartData = [
	{value: 85300000, color:"#434099"},
	{value: 53000000, color: "#4b9d2a"},
	{value: 24300000, color: "#0099a8"},
	{value: 58100000, color: "#ec7922"},
	{value: 6700000, color: "#fcb813"}
];

// Declare jQuery objects for use in scrolling and other functions
var jovNavLinks;
var jovMapAreas;
var jovMapPanels;
var jovNavigationSections;
var jovNavigationSubSections;
var jovNavigationWrapper;
var jovImages;
var jovSlidingIconsLeft;
var jovSlidingIconsRight;
var jovChartContainer;
var jovFinancialsChart;

$(document).ready(function() {
	
	// Populate jQuery object for later use
	jovNavLinks = $("nav").find("a");
	jovMapAreas = $("#county-image-map").find("area");
	jovMapPanels = $("#overview").find("div.map-info-panel");
	jovNavigationSections = $("#main").find("section");
	jovNavigationWrapper = $("#nav-wrapper");
	jovImages = $("img, iframe, #nav-wrapper").not("img.no-fade");
	jovSlidingIconsLeft = $("#icons").find("div.flush-left");
	jovSlidingIconsRight = $("#icons").find("div.flush-right");
	jovChartContainer = $("#chart-container");
	jovFinancialsChart = $("#financials-chart");
	

	InitNavLinks();
	InitInteractiveMap();
	InitSpreadsheetAccordion();
	InitDonorsAccordion();
	InitLeadershipSlidingBoxes();
	
	$(window).scroll(function() {
		HighlightNavigationSection();
		LockNavigationPosition(); 
		FadeImagesOnScroll();
		SlideIconsIntoView();
		
		if (!flagChart) { AnimateChart(); }
		if (!flagFinancialCounters) { AnimateFinancialCounters(); }
	});
	
	// Display donation notification area any time the page blur event fires
	$(window).blur(function() {
		showNotificationArea();
	});
	// And hide it when user clicks the close icon
	$("#notification-area img").click(function() {
		hideNotificationArea();
	});
	
	// Fade in any images that might be showing before scrolling (mostly for FF)
	FadeImagesOnScroll();
	
	

	$('.popup').click(function(event) {
		var width  = 575,
			height = 400,
			left   = ($(window).width()  - width)  / 2,
			top    = ($(window).height() - height) / 2,
			url    = this.href,
			opts   = 'status=1' +
					 ',width='  + width  +
					 ',height=' + height +
					 ',top='    + top    +
					 ',left='   + left;
		if($(this).hasClass('facebook')) {
			window.open(url, 'facebook', opts);
		}
		if($(this).hasClass('twitter')) {
			window.open(url, 'twitter', opts);
		}
		if($(this).hasClass('linkedin')) {
			window.open(url, 'linkedin', opts);
		}
		return false;
	});
	

// Chart Legal Ease
$('.chart-legal-btn').click(function(){
	$('.chart-legal-details').slideToggle(function() {
			$('.chart-legal-btn span').html() == "READ MORE" ? $('.chart-legal-btn span').html("READ LESS") : $('.chart-legal-btn span').html("READ MORE");
	});
	
});

});		// End document.ready()







// Set up nav links to scroll to appropriate data-anchors
function InitNavLinks() {
	$(jovNavLinks).on('click', function() {
		
		// Temporarily stop the nav from expanding while we scroll....
		$(window).unbind("scroll", HighlightNavigationSection());
		
		var scrollAnchor = $(this).attr('data-scroll');
		var scrollPoint = $('[data-anchor="' + scrollAnchor + '"]').offset().top - 20;

		$('body,html').animate({ scrollTop: scrollPoint }, 1000, "linear", function() {
					// Once the page finishes scrolling, re-bind everything to the scroll event
					$(window).scroll(function() {
						HighlightNavigationSection();
						LockNavigationPosition(); 
						FadeImagesOnScroll();
						SlideIconsIntoView();
						
						if (!flagChart) { AnimateChart(); }
						if (!flagFinancialCounters) { AnimateFinancialCounters(); }
					});
					HighlightNavigationSection();
		});

	})
}
	
	
	
// Set up map highlighting and popup panels
function InitInteractiveMap() {
	// Make interactive map interactive
	$.fn.maphilight.defaults = {
		fill: true,
		fillColor: '0096AC',
		fillOpacity: 0.2,				// If any defaults are changed here, all must be specified here
		stroke: true,
		strokeColor: '0096AC',
		strokeOpacity: 1,
		strokeWidth: 0,
		fade: true,
		alwaysOn: false,
		neverOn: false,
		groupBy: false,
		wrapClass: true,
		shadow: false,
		shadowX: 0,
		shadowY: 0,
		shadowRadius: 6,
		shadowColor: '000000',
		shadowOpacity: 0.8,
		shadowPosition: 'outside',
		shadowFrom: false
	}
	
	$("#county-map").maphilight();
	
	
	// Set up image map areas to display map panel info on click
	$(jovMapAreas).click(function(e) {
		var panel = "#" + $(this).attr("id") + "-info-panel";
		
		$(jovMapPanels).hide();
		
		var xPosition = e.clientX - 45;
		var yPosition = e.clientY + 15;
		
		var mapOriginX = $("#county-map").offset().left;
		var mapOriginY = $("#county-map").offset().top - $(window).scrollTop(); 
		
		xPosition = xPosition - mapOriginX;
		yPosition = yPosition - mapOriginY;
		
		$(panel).css({"left":xPosition,"top":yPosition,"position":"absolute"}).show();
	});
	

	// Close all map info panels on click
	$(jovMapPanels).click(function() {
		$(jovMapPanels).hide();
	});
}



function InitSpreadsheetAccordion() {
	$('.icon-spreadsheet').click(function() {
		if ($(this).hasClass('spreadsheet-expand')) {
			$(this).removeClass('spreadsheet-expand');
			$(this).addClass('spreadsheet-collapse');
			$(this).closest('.financials-row').next('.financial-details').slideDown();
		}
		else {
			$(this).removeClass('spreadsheet-collapse');
			$(this).addClass('spreadsheet-expand');
			$(this).closest('.financials-row').next('.financial-details').slideUp();	
		}
	});
}






function InitDonorsAccordion() {
	var $donorsAccordion = $("#donors-accordion");
	
	// Add a span to each header to display expand/contract arrows
	$donorsAccordion.children("h3").append("<span class='accordion-closed'></span>");
	
	$donorsAccordion.children("div.accordion:gt(0)").hide();
	
	$donorsAccordion.children("h3").click(function() {
		$donorsAccordion.children(".accordion").slideUp();
		$donorsAccordion.find(".accordion-open").removeClass("accordion-open").addClass("accordion-closed");
		
		if ($(this).next(".accordion").css("display") == "none")
		{
			$(this).children(".accordion-closed").removeClass("accordion-closed").addClass("accordion-open");
			$(this).next(".accordion").slideDown();
		}
	});

}
	
	
	
	
	
// Slide in notification area
function showNotificationArea(duration) {
	duration = (typeof duration === "undefined") ? 2000 : duration;
	
	$("#notification-area").delay(1000).animate({top:0}, 1000).addClass("notification-area-visible");
	if ($(jovNavigationWrapper).hasClass("fixed-nav"))
	{																		// Slide nav and content down with the notification area to 
		$("#nav-wrapper").delay(1000).animate({ top: '95px' }, 1000);		// prevent it from overlapping content
	}
}


// Hide notification area
function hideNotificationArea() {
	var notificationHeight = $("#notification-area").css( "height" );
	$("#notification-area").animate({top:"-"+notificationHeight}, 1000).removeClass("notification-area-visible");
	if ($(jovNavigationWrapper).hasClass("fixed-nav"))
	{	
		$(jovNavigationWrapper).animate({top: '20px'}, 1000);
	}
}

	

	
// Animate a counter from 0 to <input>
function AnimateCounter(spanID, endPoint) {
	// Generate a random number for a delay
	var rando = Math.floor(Math.random() * 300);
	
	$({currentCount: 0}).delay(rando).animate({currentCount: endPoint}, {
		duration: 4000,
		step: function() {
			$("#" + spanID).text("$" + parseFloat(Math.ceil(this.currentCount)).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString().slice(0,-2));
		},
		complete: function() {
			$("#" + spanID).text("$" + parseFloat(Math.ceil(endPoint)).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString().slice(0,-2));
		}
	});
}	




// Animate Leadership info with random color
function InitLeadershipSlidingBoxes() {
	var colors =["#4f1f91", "#0097ac", "#289728", "#f17c0e", "#dc241f", "#2c77c4"];
	$('#leadership .leadership-overlay').each(function() {
		var rando = Math.floor(Math.random()*colors.length);
		$(this).css("background", colors[rando]);
	});	
	
	$('#leadership .leadership-container').mouseenter(function(){
		var container = $(this);
		var timeout = setTimeout(function() {
			container.addClass('delay');
			container.find('.leadership-overlay').animate({top:"0"}, 300, 'linear');
		}, 200);
		container.mouseleave(function() {
			clearTimeout(timeout);
			container.removeClass('delay');
			setTimeout(function () {
				container.find('.leadership-overlay').animate({top:"190px"}, 300, 'linear');
			}, 250);
		});
	});
}



// Highlight/Expand current navigation section when scrolling
function HighlightNavigationSection() {
	if (window["flagBusy"] == false)
	{
			var navHighlightThreshold = $(window).scrollTop() + 100;		// Number of pixels hidden from view above the scrollable area + offset
			var currentSection = "";
			var currentSectionIndex = -1;
			var lastCurrentSectionIndex = -1;
			
			var currentSubSection = "";
			var currentSubSectionIndex = -1;
			var lastCurrentSubSectionIndex = -1;
			
			$(jovNavigationSections).each(function(i) {						// jovNavigationSections is a set of all <section> tags
				if ($(this).offset().top <= navHighlightThreshold) {
					currentSection = $(this).attr("data-anchor");
					currentSectionIndex = i;
				}
			});
			
			// Only remove/add classes if the current section has changed
			if (currentSectionIndex != lastCurrentSectionIndex)
			{	
					$("li.activeSection").removeClass("activeSection");
					$("nav a[data-scroll=" + currentSection + "]").parent().addClass("activeSection");
						
					$("nav > ul > li").filter(function(i) {
						return i != currentSectionIndex;
					}).children("ul").slideUp();
					
					$(".activeSection").children("ul").slideDown();
					
					lastCurrentSectionIndex = currentSectionIndex;
			}
			
			// Now get all the subsections in the active section and loop through to see which is active
			jovNavigationSubSections = $(jovNavigationSections).eq(currentSectionIndex).find(".subsection");
			$(jovNavigationSubSections).each(function(i) {
				if ($(this).offset().top <= navHighlightThreshold) {
					currentSubSection = $(this).attr("data-anchor");
					currentSubSectionIndex = i;
				}
			});
			
			// Only remove/add classes if the current section has changed
			if (currentSubSectionIndex != lastCurrentSubSectionIndex)
			{
				$("li.activeSubSection").removeClass("activeSubSection");
				$("nav a[data-scroll=" + currentSubSection + "]").parent().addClass("activeSubSection");
				
				lastCurrentSubSectionIndex = currentSubSectionIndex;
			}
	}
}



// Lock navigation at top of browser after scrolling
function LockNavigationPosition() {
	var windscroll = $(window).scrollTop() + 20;
		if (windscroll >= 520)
		{
			if (!$(jovNavigationWrapper).hasClass("fixed-nav"))
			{
				$(jovNavigationWrapper).css({"position":"fixed", "top":"20px"}).addClass("fixed-nav");
				
				// but if on the rare occasion that we're at the top of the page and the donation box is already showing, make it top:95px
				if ($("#notification-area").hasClass("notification-area-visible"))
				{
					$(jovNavigationWrapper).css({"top":"95px"});
				}
			}
		}
		else 
		{
			$(jovNavigationWrapper).css({"position":"static"}).removeClass("fixed-nav");
		}
}



// Fade in images as scroll point passes top of image
function FadeImagesOnScroll() {
	var browserBottomEdgePlusModifier = $(window).scrollTop() + ($(window).height() * .8);
	
	$(jovImages).each(function() {
		var imgTopPosition = $(this).offset().top;
		
		if( browserBottomEdgePlusModifier > imgTopPosition ){
			
			$(this).animate({"opacity":"1"},2000).addClass("no-fade");
			jovImages = $(jovImages).not($(this));		
		}
	});
}



// Slide icons into view from left and right
function SlideIconsIntoView() {
		var browserBottomEdge = $(window).scrollTop() + ($(window).height() * .8);
		
		$(jovSlidingIconsLeft).each(function() {
			var imgTopPosition = $(this).offset().top;
			
			if( browserBottomEdge > imgTopPosition ){
				$(this).animate({marginLeft: 0}, 1000, function() {
				});								
			}
		});
		$(jovSlidingIconsRight).each(function() {
			var imgTopPosition = $(this).offset().top + 40;
			
			if( browserBottomEdge > imgTopPosition ){
				$(this).animate({marginRight: 0}, 1000);								
			}
		});
}



// Animate pie chart
function AnimateChart() {
	$(jovChartContainer).each(function() {
		var chartTopPosition = $(this).offset().top + 200;
		var browserBottomEdge = $(window).scrollTop() + $(window).height();
		
		if( browserBottomEdge > chartTopPosition ){
			var ctx = document.getElementById("chart").getContext("2d");
			window.financialChart = new Chart(ctx).Doughnut(chartData, {
				showTooltips: false,
				percentageInnerCutout: 65,
				animationSteps: 82,
				segmentStrokeWidth: 0,
				animationEasing: "linear"
			});
			// fade in text
			var fadeSpeed = 400;
			$('.chart-care').delay(150).animate({'opacity':'1'},fadeSpeed);
			$('.chart-other').delay(400).animate({'opacity':'1'},fadeSpeed);
			$('.chart-medicaid').delay(800).animate({'opacity':'1'},fadeSpeed);
			$('.chart-medicare').delay(1000).animate({'opacity':'1'},fadeSpeed);
			$('.chart-community').delay(1200).animate({'opacity':'1'},fadeSpeed);
			$('.chart-inner').delay(1600).animate({'opacity':'1'},fadeSpeed*2);
			
			flagChart = true;
		};
	});
}



// Animate counters on financials spreadsheet
function AnimateFinancialCounters() {
	$("#financials-chart").each(function() {
		var financialBottomPosition = $(this).offset().top + $(this).outerHeight();
		var browserBottomEdge = $(window).scrollTop() + $(window).height();
		
		if( browserBottomEdge > financialBottomPosition ){
			AnimateCounter("assets-fy13", 2142414);
			AnimateCounter("assets-fy14", 2343232);
			AnimateCounter("liabilities-fy13", 2142414);
			AnimateCounter("liabilities-fy14", 2343232);
			AnimateCounter("combined-fy13", 119787);
			AnimateCounter("combined-fy14", 90454);
			
			flagFinancialCounters = true;
		}
		
		
	});
}

// Send email
$(document).ready(function () {
	$('#submit').click(function () {
		//debugger;
		//disable the button so we don't get multiple clicks
		$("#submit").attr('value', 'Submitting...'); 
		$("#submit").attr('disabled', true);
		
		
	});
	//debugger;
		$('form').validate({
			rules: {
				email: {
					required: true,
					email: true
				}
			},
			messages: {
				email: "please enter a valid email address",
			},
			highlight: function(element) {
				$('#email').addClass('input-error');
				$('#submit').addClass('submit-error');
				$('#submit').attr("Value", "Invalid Email");
			},
			unhighlight: function(element) {
				$('#email').removeClass('input-error');
				$('#submit').removeClass('submit-error');
				$('#submit').attr("Value", "Submit");
			},
			submitHandler: function(form) {
				SendEmail();
			}
		});
		
	});
function IsEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
function SendEmail() {
	$.ajax({
		type: "POST",
		url: "Default.aspx?email=" + $("#email").val(),
		contentType: "application/json; charset=utf-8",
		dataType: 'html',
		success: function successHandler(data, textStatus, jqXHR) {
			//alert("Email Sent");
			$("#email").val("");
			$("#submit").prop('value', 'Email Sent'); 
			$("#submit").prop('disabled', true); 

			if ($('#email').hasClass('input-error')) 
				$('#email').removeClass('input-error');
            if ($('#submit').hasClass('submit-error')) 
				$('#submit').removeClass('submit-error');
				
		},
		async: false,
		error: function (request, status, error) {
			//alert(request.responseText);
			//Error occurred, re-enable the button
			$('#email').addClass('input-error');
			$('#submit').addClass('submit-error');
			$("#submit").prop('value', 'Error - Please try again'); 
			$("#submit").prop('disabled', false);
		}
	});
}

function StutterLoadContent() {

}

