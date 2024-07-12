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
	function threejs_thingy_shortcode() {
		return <<<HTML
            <div id="threejs-thingy">
                <canvas id="thingy-canvas" class="max-h-[500px]"></canvas>
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
        HTML;
	}

    add_shortcode('threejs-thingy-controls', 'threejs_thingy_controls_shortcode');
    function threejs_thingy_controls_shortcode() {
        return <<<HTML
            <ul id="threejs-thingy-controls" class="w-60 md:w-80 min-h-full p-4 bg-base-100">
                <li class="flex flex-row gap-2"><input id="thingy-overlays" class="checkbox checkbox-md" type="checkbox" /> Show debug overlays</li>
            </ul>
        HTML;
    }   