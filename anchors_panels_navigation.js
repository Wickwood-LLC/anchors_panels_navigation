var anchors_panels_navigation_scroll_flag = true;
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
  $(window).scroll(function(){
  if(anchors_panels_navigation_scroll_flag) {
    var scrollY = (window.scrollY) ? window.scrollY : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop; // thanks to Alexandr Zykov
	//console.log(scrollY);
	var height = 0;
    Drupal.settings.anchors_panels_navigation.hashes.forEach(function(entry) {
      var aTop = $('#' + entry).offset().top;
	  if(scrollY >= aTop && height <= aTop){
	    height = aTop;
		hash = entry; 
	}
  });
  window.location.hash = "#" + hash;
  anchors_panels_navigation_classes_fix(hash);
  }
  });
  $("a").click(function(){
		anchors_panels_navigation_scroll_flag = false;
		//check if it has a hash (i.e. if it's an anchor link)
		if(this.hash){
			var hash = this.hash.substr(1);	
			//console.log($.inArray(hash, Drupal.settings.anchors_panels_navigation.hashes));
			if($.inArray(hash, Drupal.settings.anchors_panels_navigation.hashes) !== -1){
				var destination = $("#" + hash).offset().top;
				$("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, 500, function() {
					window.location.hash = "#" + hash;
					anchors_panels_navigation_classes_fix(hash);
					setTimeout('anchors_panels_navigation_scroll_flag = true', 2000);
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