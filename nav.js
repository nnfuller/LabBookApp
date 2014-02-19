function slideView(target) {

	var $toSlide= $(target),
		$fromSlide= $('.active');

    $fromSlide.animate({"left":"-100%"},500,'swing')
    $toSlide.animate({"left":"0%"},500,'swing',function() {   

    	$fromSlide.removeClass("active");  
    	$toSlide.addClass("active");

    });

}

function slideBack(target) {

	var $toSlide= $(target),
		$fromSlide= $('.active');

    $fromSlide.animate({"left":"100%"},500,'swing')
    $toSlide.animate({"left":"0%"},500,'swing',function() {   

    	$fromSlide.removeClass("active");  
    	$toSlide.addClass("active");

    });

}

$(document).ready(function(){

	$("#signinlink").on('click', function(event) {

		event.preventDefault();
	    slideView("#signinpage");

	});

	$("#setuplink").on('click', function(event) {

		event.preventDefault();
	    slideView("#setuppage");

	});

	$("#datalink").on('click', function(event) {

		event.preventDefault();
	    slideView("#datapage");

	});

	$(".backbutton").on('click', function(event) {

		event.preventDefault();
	    slideBack("#welcomepage");

	});

});