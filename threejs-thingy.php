<?php
    /* 
        Plugin Name: threejs-thingy
        Plugin URI: https://adamtrickett.com
        Author: Adam Trickett
        Author URI: https://adamtrickett.com
        Version: 0.1.0
    */

    add_action('wp_enqueue_scripts', 'threejs_thingy_scripts');
    function threejs_thingy_scripts() {
        wp_enqueue_script('threejs-thingy', plugin_dir_url(__FILE__) . 'dist/threejs-thingy.js', array(), filemtime(plugin_dir_path( __FILE__ ). 'dist/threejs-thingy.js'), true);
        wp_scripts()->add_data('threejs-thingy', 'type', 'module');

        wp_add_inline_script('threejs-thingy', 'const wp_vars = { plugin_url : "' . plugin_dir_url(__FILE__) . '", plugin_path :"' . plugin_dir_path(__FILE__) . '"}', 'before');
        wp_enqueue_style('threejs-thingy', plugin_dir_url(__FILE__) . 'dist/threejs-thingy.css', array(), filemtime(plugin_dir_path( __FILE__ ). 'dist/threejs-thingy.css'));
    };

    add_shortcode('threejs-thingy', 'threejs_thingy_shortcode');
	function threejs_thingy_shortcode($atts) {
        extract(shortcode_atts(array(
            'debug' => 'false'
        ), $atts));

        ob_start();

		?>

            <div class="drawer ariom-drawer h-full">
                <?php if($debug): ?>
                    <input type="checkbox" id="drawer-toggle" class="drawer-toggle" />
                <?php endif; ?>
                <div class="drawer-content h-full max-h-full">
                    <div id="threejs-thingy">
                        <canvas id="thingy-canvas"></canvas>
                        <div class="thingy-stats"></div>
                        <div class="thingy-labels">
                            <template id="thingy-label-template">
                                <div class="label">
                                    <span class="x">x</span>
                                    <span class="y">y</span>
                                    <span class="z">z</span>
                                </div>
                            </template>
                        </div>
                    </div>
                    <label for="drawer-toggle" class="drawer-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="black" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/></svg>
                    </label>
                </div>
                <div class="drawer-side">
                    <label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
                    <ul id="threejs-thingy-controls" class="w-60 md:w-80 min-h-full p-4 bg-base-100">
                        <li class="flex flex-row gap-2"><input id="thingy-overlays" class="checkbox checkbox-md" type="checkbox" /> Show debug overlays</li>
                    </ul>
                </div>
            </div>
        <?php

        return ob_get_clean();

	}

    add_shortcode('threejs-thingy-controls', 'threejs_thingy_controls_shortcode');
    function threejs_thingy_controls_shortcode() {
        return <<<HTML
            
        HTML;
    }   