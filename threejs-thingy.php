<?php
    /* 
        Plugin Name: threejs-thingy
        Plugin URI: https://adamtrickett.com
        Author: Adam Trickett
        Author URI: https://adamtrickett.com
        Version: 0.1.0
    */

	function threejs_thingy_shortcode() {
		//enqueure the threejs-thiungy.js file
		wp_enqueue_script('threejs-thingy', plugin_dir_url(__FILE__) . 'dist/threejs-thingy.js', array(), filemtime(plugin_dir_path( __FILE__ ). 'dist/threejs-thingy.js'), true);
		wp_scripts()->add_data('threejs-thingy', 'type', 'module');
		$vars = array(
			'plugin_url' => plugin_dir_url(__FILE__),
			'plugin_path' => plugin_dir_path(__FILE__),
		);
     	wp_localize_script('threejs-thingy', 'wp_vars', $vars);
		$threejs_thingy = '<div id="threejs-thingy" style="height:404px;"></div>';
		return $threejs_thingy;
	}
	add_shortcode('threejs-thingy', 'threejs_thingy_shortcode');


