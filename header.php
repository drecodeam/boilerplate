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
        <div class="contain-to-grid">
            <nav class="top-bar" data-topbar role="navigation">
                <ul class="title-area">
                    <li class="name">
                        <h1>
                            <a href="<?php echo get_bloginfo('url');  ?>">
                                Boilerplate
                            </a>
                        </h1>
                    </li>
                    <li class="toggle-topbar menu-icon"><a href="#"><span>menu</span></a></li>
                </ul>

                <section class="top-bar-section right">
                    <?php
                    wp_nav_menu(array(
                        'menu'              => 'primary',
                        'items_wrap'        => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                        'depth'             => 1,
                        'container'         => false
                    ));
                    ?>
                </section>
            </nav>
        </div>
