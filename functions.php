<?php
/*
|----------------------------------------------------------
| Global configuration
|----------------------------------------------------------
*/
$content_width          = 1000;
$theme_support          = array(
    'post-thumbnails' => array()
);
$plugin_dependencies    = array(

);


/*
|----------------------------------------------------------
| Includes
|----------------------------------------------------------
*/
require_once 'libs/FoundationMenuWalker.php';
require_once 'libs/vendor/TGMPluginActivation.php';


/*
|----------------------------------------------------------
| Scripts und stylesheets
|----------------------------------------------------------
*/
function enqueue_scripts() {
    $path = get_template_directory_uri() . '/dist';

    if( ! locate_template('dist/release.css')) {
        // Include vendor styles
        wp_enqueue_style('vendor', $path . '/vendor.css');

        // Include theme style
        wp_enqueue_style('additional', $path . '/additional.css');
        wp_enqueue_style('styles', get_template_directory_uri() . '/style.css');
    } else {
        wp_enqueue_style('release', $path . '/release.css');
    }

    if( ! locate_template('dist/release.js')) {
        // Include vendor js
        wp_enqueue_script('vendor', $path . '/vendor.js');

        // Include theme js
        wp_enqueue_script('main', $path . '/main.js');
    } else {
        wp_enqueue_script('release', $path . '/release.js');
    }
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
