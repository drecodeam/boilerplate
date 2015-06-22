<?php
/*
|----------------------------------------------------------
| Global configuration
|----------------------------------------------------------
*/
$content_width          = 1000;
$theme_support          = array(
    'post-thumbnails'   => array()
);
$plugin_dependencies    = [

];


/*
|----------------------------------------------------------
| Theme wrapper
|----------------------------------------------------------
*/
function template_path() {
    return ThemeWrapper::$main_template;
}

function template_base() {
    return ThemeWrapper::$base;
}

class ThemeWrapper {

    static $main_template;
    static $base;

    static function wrap($template) {
        self::$main_template = $template;
        self::$base = substr( basename( self::$main_template ), 0, -4 );

		if ( 'index' == self::$base )
			self::$base = false;

		$templates = array( 'base.php' );

		if ( self::$base )
			array_unshift( $templates, sprintf( 'base-%s.php', self::$base ) );

		return locate_template( $templates );
    }

}

add_filter('template_include', ['ThemeWrapper', 'wrap'], 99);


/*
|----------------------------------------------------------
| Includes
|----------------------------------------------------------
*/
require_once 'libs/BootstrapMenuWalker.php';
require_once 'libs/vendor/TGMPluginActivation.php';


/*
|----------------------------------------------------------
| Scripts und stylesheets
|----------------------------------------------------------
*/
function asset_path($dir = '', $ts = true) {
    $path = '/';
    if(locate_template('.tmp')) {
        $path .= '.tmp/';
    }
    $path .= 'assets/';
    $path .= $dir;

    $path .= ($ts ? '/': '');

    return $path;
}

function image_path() {
    return get_template_directory_uri() . asset_path('images', false);
}

function enqueue_scripts() {
    $vendor_css = get_template_directory_uri() . asset_path('vendor') . 'vendor.css';
    $vendor_js  = get_template_directory_uri() . asset_path('vendor') . 'vendor.js';

    if(locate_template(asset_path() . 'vendor/vendor.css'))
        wp_enqueue_style('vendor', $vendor_css);
    wp_enqueue_script('vendor', $vendor_js);

    wp_enqueue_style('additional', get_template_directory_uri() . asset_path() . 'stylesheets/additional.css');
    wp_enqueue_script('main', get_template_directory_uri() . asset_path() . 'javascripts/main.js');

    //locate_template($vendor_css) ? wp_enqueue_style('vendor', $vendor_css) : null;
    //locate_template($vendor_js) ? wp_enqueue_script('vendor', $vendor_js) : null;

    wp_enqueue_style('styles', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'enqueue_scripts');


/*
|----------------------------------------------------------
| Plugin Dependencies (powered by TGM Plugin Activation)
|----------------------------------------------------------
*/
function register_plugin_dependencies() {
    global $plugin_dependencies;

    tgmpa($plugin_dependencies);
}
add_action('tgmpa_register', 'register_plugin_dependencies');


/*
|----------------------------------------------------------
| Theme setup
|----------------------------------------------------------
*/
// Bootstrap nav walker
add_action('after_setup_theme', 'bootstrap_setup');
function theme_setup() {
    // Content width
    global $content_width;
    if( ! isset($content_width)) {
        $content_width = 1000;
    }

    // Theme support
    global $theme_support;
    foreach($theme_support as $feature => $args) {
        if(count($args) === 0) {
            add_theme_support($feature);
        } else {
            add_theme_support($feature, $args);
        }
    }
}
add_action('after_setup_theme', 'theme_setup');

// Clean up wp_head
// See https://scotch.io/quick-tips/removing-wordpress-header-junk
remove_action('wp_head', 'rsd_link'); // remove really simple discovery link
remove_action('wp_head', 'wp_generator'); // remove wordpress version

remove_action('wp_head', 'feed_links', 2); // remove rss feed links (make sure you add them in yourself if youre using feedblitz or an rss service)
remove_action('wp_head', 'feed_links_extra', 3); // removes all extra rss feed links

remove_action('wp_head', 'index_rel_link'); // remove link to index page
remove_action('wp_head', 'wlwmanifest_link'); // remove wlwmanifest.xml (needed to support windows live writer)

remove_action('wp_head', 'start_post_rel_link', 10, 0); // remove random post link
remove_action('wp_head', 'parent_post_rel_link', 10, 0); // remove parent post link
remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0); // remove the next and previous post links
remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );

remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0 );
