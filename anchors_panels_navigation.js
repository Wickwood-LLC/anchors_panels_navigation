/**
 * @file
 * JS file of Anchors Panels Navigation module.
 */
(function ($) {
  $(document).ready(function () {
    var old_hash = window.location.hash.substr(1),
      top_offset = Drupal.settings.anchors_panels_navigation.top_offset,
      menu_offset = 0,
      previous_object_height = $(window).height(),
      page_url = window.location.href.split("#")[0],
      decoded_page_url = decodeURIComponent(page_url),
      $all_hash_links = $('a[href^="#"],a[href^="' + page_url + '#"],a[href^="' + page_url + '/#"],a[href^="' + decoded_page_url + '#"],a[href^="' + decoded_page_url + '/#"]');

    // Method to correct link classes based on current hash.
    function anchors_panels_navigation_classes_fix(hash) {
      var active_hash_found = false;
      $all_hash_links.each(function(){
        var link_hash = this.hash.substr(1);
        if (link_hash) {
          var $parent = $(this).parent();
          if (link_hash == hash) {
            // Activate this anchor.
            $(this).addClass(Drupal.settings.anchors_panels_navigation.classes_set);
            if ($parent.length && $parent.is('li')) {
              $parent.addClass(Drupal.settings.anchors_panels_navigation.classes_set);
            }
            active_hash_found = true;
          } else {
            // Deactivate this anchor.
            $(this).removeClass(Drupal.settings.anchors_panels_navigation.classes_remove);
            if ($parent.length && $parent.is('li')) {
              $parent.removeClass(Drupal.settings.anchors_panels_navigation.classes_remove);
            }
          }
        }
      });
      return active_hash_found;
    }

    // Apply panel height fix if configured.
    if (Drupal.settings.anchors_panels_navigation.fix_panel_height) {
      var window_height = $(window).height();
      Drupal.settings.anchors_panels_navigation.hashes.forEach(function (entry) {
        $('#' + entry + '.panel-pane').css('min-height', window_height);
      });
    }

    // Immediately scroll to a hash on page load and correct classes.
    var hash = window.location.hash.substr(1);
    if (hash) {
      var $panel_pane = $('#' + hash + '.panel-pane');
      if ($panel_pane.length) {

        if ($("#admin-menu").length) {
          menu_offset = $("#admin-menu").height();
        }
        if ($(".main-menu").length) {
          menu_offset += $(".main-menu").height();
        }

        var destination = $panel_pane.offset().top - top_offset - menu_offset - 18;
        $("html:not(:animated),body:not(:animated)").stop().animate({scrollTop: destination}, 500, function () {
          return false;
        });
      }
      if ($.inArray(hash, Drupal.settings.anchors_panels_navigation.hashes) !== -1) {
        anchors_panels_navigation_classes_fix(hash);
      }
    }

    // Add/remove classes based on the current hash.
    if ($all_hash_links.length) {

      // Set an event to make the hash and classes reflect the scrolled position.
      $('body').on('appear', '.panel-pane', function (e, $affected) {

        // By default use the ID of the panel-pane as our hash.
        var hash = $(this).attr('id');
        if (!hash || hash == 'undefined') {
          // Find a nested anchor tag, if present.
          hash = $(this).find('a[name]').first().attr('name');
        }
        if (!hash || hash == 'undefined') {
          // Find a parent anchor tag (prepended to panel).
          var $previous = $(this).prev();
          if ($previous && $previous.is('a[name]')) {
            hash = $previous.attr('name');
          }
        }
        if (hash && hash != 'undefined' && $.inArray(hash, Drupal.settings.anchors_panels_navigation.hashes) !== -1) {
          var offset = $(this).offset().top - $(window).scrollTop();

          if (old_hash != hash && offset > top_offset - 1 && offset < previous_object_height) {

            if (anchors_panels_navigation_classes_fix(hash)) {
              old_hash = hash;
              previous_object_height = $(this).height();
              var stateObj = {foo: "hash"};
              history.pushState(stateObj, "hash", "#" + hash);
            }
          }
        }
      });
      $('.panel-pane').appear({force_process: true});

      // Scroll to a relevant anchor when links are clicked.
      // Maintain compatibility with scroll_to_destination_anchors module.
      if (typeof Drupal.behaviors.scrolltoanchors != 'object') {
        // Smooth scroll to destination anchors
        $all_hash_links.click(function (event) {
          var hash = this.hash.substr(1);
          if ($.inArray(hash, Drupal.settings.anchors_panels_navigation.hashes) !== -1) {
            var $panel_pane = $('#' + hash + '.panel-pane');
            if ($panel_pane.length) {
              event.preventDefault();

              if ($("#admin-menu").length) {
                menu_offset = $("#admin-menu").height();
              }
              if ($(".main-menu").length) {
                menu_offset += $(".main-menu").height();
              }

              var destination = $panel_pane.offset().top - top_offset - menu_offset - 18;
              $("html:not(:animated),body:not(:animated)").stop().animate({scrollTop: destination}, 500, function () {
                return false;
              });
            }
          }
          return true;
        });
      }
    }
  });
})(jQuery);