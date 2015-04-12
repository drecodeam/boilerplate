<?php
get_header();
?>

<div class="row">
    <div class="large-12">
        <?php
        while(have_posts()): the_post();
        ?>

        <h2><a href="<?php the_permalink(); ?>" name="<?php the_ID(); ?>" rel="bookmark"><?php the_title(); ?></a></h2>
        <?php the_content(); ?>

        <?php
        endwhile;
        ?>
    </div>
</div>

<?php
get_footer();
?>
