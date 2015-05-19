<?php
get_header();
?>

<div class="container">
    <?php
    while(have_posts()): the_post();
    ?>

    <h2><?php the_title(); ?></h2>
    <?php the_content(); ?>

    <hr>

    <?php
    // Comments
    if(comments_open() || get_comments_number() != '0') {
        comments_template();
    }
    ?>

    <?php
    endwhile;
    ?>
</div>

<?php
get_footer();
?>
