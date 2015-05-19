<?php
get_header();

while (have_posts()) : the_post();
?>

<div class="container">
    <h2><?php the_title(); ?></h2>
    <?php the_content(); ?>
</div>

<?php
endwhile; // /have_posts()

get_footer();
?>
