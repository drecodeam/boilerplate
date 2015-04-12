<?php
class FoundationMenuWalker {

    public function start_lvl(&$output, $depth = 0, $args = array())
    {
        $output .= "\n<ul class=\"sub-menu dropdown\">\n";
    }

    public function display_element($element, &$children_elements, $max_depth, $depth = 0, $args, &$output)
    {
        $element->has_children = !empty($children_elements[$element->ID]);
        $element->classes[] = ($element->has_children) ? 'has-dropdown' : '';

        parent::display_element($element, $children_elements, $max_depth, $depth, $args, $output);
    }

    public function start_el(&$output, $item, $depth = 0, $args = array(), $id = 0)
    {
        $indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $classes[] = 'menu-item-' . $item->ID;

        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args, $depth));
        $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';

        $id = apply_filters('nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth);
        $id = $id ? ' id="' . esc_attr($id) . '"' : '';

        $output .= $indent . '<li' . $id . $class_names . '>';

        $atts = array();
        $atts['target'] = !empty($item->target) ? $item->target : '';
        $atts['rel'] = !empty($item->xfn) ? $item->xfn : '';
        $atts['href'] = !empty($item->url) ? $item->url : '';

        $atts = apply_filters('nav_menu_link_attributes', $atts, $item, $args, $depth);

        $attributes = '';
        foreach ($atts as $attr => $value) {
            if (!empty($value)) {
                $value = ( 'href' === $attr ) ? esc_url($value) : esc_attr($value);
                $attributes .= ' ' . $attr . '="' . $value . '"';
            }
        }

        $item_output = $args->before;
        $item_output .= '<a' . $attributes . '>';

        if($depth > 0 && ! $item->has_children) {
            if( ! empty($item->attr_title)) {
                $item_output .= '<i class="fa fa-lg '. $item->attr_title .'"></i>';
            }
        }

        $item_output .= $args->link_before . apply_filters('the_title', $item->title, $item->ID) . $args->link_after;

        $item_output .= '</a>';
        $item_output .= $args->after;

        $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args );
    }

    public static function fallback($args)
    {
        if (current_user_can('manage_options')) {
            extract($args);
            $fb_output = null;
            if ($container) {
                $fb_output = '<' . $container;
                if ($container_id)
                $fb_output .= ' id="' . $container_id . '"';
                if ($container_class)
                $fb_output .= ' class="' . $container_class . '"';
                $fb_output .= '>';
            }
            $fb_output .= '<ul';
            if ($menu_id)
            $fb_output .= ' id="' . $menu_id . '"';
            if ($menu_class)
            $fb_output .= ' class="' . $menu_class . '"';
            $fb_output .= '>';
            $fb_output .= '<li><a href="' . admin_url('nav-menus.php') . '">Add a menu</a></li>';
            $fb_output .= '</ul>';
            if ($container)
            $fb_output .= '</' . $container . '>';
            echo $fb_output;
        }
    }

}
