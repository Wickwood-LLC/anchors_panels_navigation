<?php

$plugin = array(
  'single' => TRUE,
  'title' => t('Automatic Anchor Menu'),
  'description' => t('Automatically generates a menu of panels with anchor IDs on the page.'),
  'render callback' => 'anchors_panels_navigation_auto_render',
  'all contexts' => TRUE,
  'icon' => 'icon_contrib_menu.png',
  'category' => array(t('Menus')),
);

/**
 * Render the pane for "Automatic Anchor Menu".
 *
 * @param $subtype
 * @param $conf
 * @param $args
 * @param $contexts
 * @return \stdClass
 */
function anchors_panels_navigation_auto_render($subtype, $conf, $args, $contexts) {

  // Loop through panelizer panels if present, generating menu items.
  $menu_tree = array();
  if (
    !empty($contexts['panelizer'])
    && !empty($contexts['panelizer']->data->panelizer['page_manager']->display->content)
  ) {
    $panes = $contexts['panelizer']->data->panelizer['page_manager']->display->content;
    $count = 0;
    // Use absolute paths and "external" links so that menu handlers behave.
    $request_path = request_path();
    $request_path_absolute = $GLOBALS['base_url'] . (!empty($request_path) ? '/' . $request_path : '');
    foreach ($panes as $pid => $pane) {
      // Ignore the current pane, find ones configured to be anchored.
      if (
        $pane->type != 'anchors_panels_navigation_auto'
        && isset($pane->configuration['anchors_panels_navigation_anchor'])
        && !empty($pane->configuration['anchors_panels_navigation_anchor'])
        && $pane->shown == TRUE
      ) {
        $anchor_title = $pane->configuration['anchors_panels_navigation_anchor'];
        $anchor_name = _anchors_panels_navigation_anchor_name($anchor_title);
        $menu_tree[$count . ' ' . $anchor_title . ' ' . $pid] = array(
          'link' => array(
            'access' => TRUE,
            'expanded' => '1',
            'external' => '1',
            'depth' => '1',
            'has_children' => '0',
            'hidden' => '0',
            'href' => $request_path_absolute . '#' . $anchor_name,
            'in_active_trail' => FALSE,
            'link_path' => '',
            'link_title' => $anchor_title,
            'load_functions' => '',
            'menu_name' => 'anchors-panels-navigation-auto',
            'mlid' => "auto-$count",
            'module' => 'menu',
            'title' => $anchor_title,
            'title_arguments' => '',
            'title_callback' => 't',
            'theme_callback' => '',
            'updated' => '0',
            'weight' => "$count",
          ),
          'below' => array(),
        );
        $count++;
      }
    }
  }

  if (count($menu_tree)) {
    // Render the menu output.
    $block = new stdClass();
    $block->title = '';
    $menu_tree_output = menu_tree_output($menu_tree);
    $block->content = drupal_render($menu_tree_output);
    return $block;
  }
}
