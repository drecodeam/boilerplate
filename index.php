<?php
get_header();
?>

<div class="container">
    <?php
    while(have_posts()): the_post();
    ?>

    <h2><a href="<?php the_permalink(); ?>" name="<?php the_ID(); ?>" rel="bookmark"><?php the_title(); ?></a></h2>
    <?php the_content(); ?>

    <hr>

    <?php
    endwhile;
    ?>
</div>

<?php
get_footer();
?>
