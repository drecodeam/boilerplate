<?php
get_header();
?>

<div class="row">
    <div class="large-12">
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

        <hr>

        <?php
        endwhile;
        ?>
    </div>
</div>

<?php
get_footer();
?>
