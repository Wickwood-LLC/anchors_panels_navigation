(function($){
$(document).ready(function() {
  if(Drupal.settings.anchors_panels_navigation.fix_panel_height) {
    var window_height = $(window).height();
    Drupal.settings.anchors_panels_navigation.hashes.forEach(function(entry) {
      $('#' + entry).css('min-height', window_height);
    });
  }	
  var hash = window.location.hash.substr(1);	
  if($.inArray(hash, Drupal.settings.anchors_panels_navigation.hashes) !== -1){
    anchors_panels_navigation_classes_fix(hash);	  
  }

$(window).bind('scroll', function(e){
    $('div.panel-pane').each(function(){
        if ($(this).offset().top < window.pageYOffset + 1 //begins before top
        && $(this).offset().top + $(this).height() > window.pageYOffset + 1 //but ends in visible area
        ){
			var hash = $(this).attr('id');
            window.location.hash = hash;
			anchors_panels_navigation_classes_fix(hash);
			//$(window).unbind('scroll');
        }
    });
});

	$("a").click(function(event){
		//check if it has a hash (i.e. if it's an anchor link)
		if(this.hash){
			var hash = this.hash.substr(1);	
			//console.log($.inArray(hash, Drupal.settings.anchors_panels_navigation.hashes));
			if($.inArray(hash, Drupal.settings.anchors_panels_navigation.hashes) !== -1){
				event.preventDefault();
				var destination = $("#" + hash).offset().top;
				$("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, 500, function() {
				//	window.location.hash = "#" + hash;
				//	anchors_panels_navigation_classes_fix(hash);
					return false;
				});
			}
			return true;	
		}
		return true;
	});
});

function anchors_panels_navigation_classes_fix(hash){
  $('a').removeClass(Drupal.settings.anchors_panels_navigation.classes_remove);
  $('a[href$="#' + hash + '"]').addClass(Drupal.settings.anchors_panels_navigation.classes_set);
}
})(jQuery);