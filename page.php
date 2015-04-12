<?php
get_header();

while (have_posts()) : the_post();
?>

<div class="row">
    <div class="large-12">
        <h2><?php the_title(); ?></h2>
        <?php the_content(); ?>
    </div>
</div>

<?php
endwhile; // /have_posts()

get_footer();
?>
