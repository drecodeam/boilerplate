<!DOCTYPE html>
<html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title><?php wp_title(); ?></title>
        <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

        <?php
        if(is_singular() && get_option('thread_comments')) {
            wp_enqueue_script('comment-reply');
        }

        wp_head();
        ?>
    </head>

    <body <?php body_class(); ?>>
        <nav class="navbar navbar-default" role="navigation">
            <div class="container">
                <div class="navbar-header">
                    <!-- Nav button for small resolutions -->
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#main-menu">
                        <span class="sr-only"><?php _e('Toggle navigation', 'boilerplate'); ?></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>

                    <a class="navbar-brand" href="<?php echo get_home_url(); ?>"><?php bloginfo('name'); ?></a>
                </div>
                <div class="collapse navbar-collapse" id="main-menu">
                    <?php
                    // Navigation
                    $gitsta_nav_args = array(
                        'theme_location' => 'top-bar',
                        'menu'           => 'primary',
                        'container'      => false,
                        'menu_class'     => 'nav navbar-nav',
                        'walker'         => new wp_bootstrap_navwalker(),
                        'fallback_cb'    => 'wp_bootstrap_navwalker::fallback',
                    );
                    wp_nav_menu($gitsta_nav_args);

                    // see searchform.php
                    get_search_form();
                    ?>
                </div>
            </div>
        </nav>
