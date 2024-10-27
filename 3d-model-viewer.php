<?php

/**
 * Plugin Name: 3D Model Viewer
 * Plugin URI: https://wordpress.org/plugins/3d-model-viewer/
 * Description: The first live 3D plugin for wordpress
 * Version: 1.9
 * Author: Joerg Viola
 * Author URI: http://www.joergviola.de
 */


class WP_3D {
    // Conditional script adding: http://scribu.net/wordpress/optimal-script-loading.html
    static $add_script = false;

	// Constructor
	public function __construct() {
		add_shortcode( '3D', array('WP_3D', 'shortcode_3d') );
		add_filter('mime_types',array('WP_3D', 'add_custom_mime_types'));
		add_action('init', array(__CLASS__, 'register_scripts'));
		add_action('wp_footer', array(__CLASS__, 'print_scripts'));
        add_filter( 'ajax_query_attachments_args', array(__CLASS__,'show_model_attachments'), 10, 1 );


	}

	// Activate the plugin
	public static function activate() {
	}

	// Deactivate the plugin
	public static function deactivate() {
	}

	// Add link to the settings page
	function admin_menu_hook() {
		// Do nothing so far ;)
	}

	function show_model_attachments( $query = array() ) {
	    //unset($query['post_mime_type']);
	    $query['post_mime_type'] = array('image', 'text', 'model');
	    return $query;
	}
	function add_custom_mime_types($mimes){
		return array_merge($mimes,array (
			'dae' => 'model/vnd.collada+xml',
			'objmtl' => 'text/plain',
			'obj' => 'text/plain',
		    'mtl' => 'text/plain',
		));
	}

	public function register_scripts() {
		wp_register_script('threejs', plugins_url('js/three.min.js', __FILE__), array(),'1.1', false);
		wp_register_script('collada-loader', plugins_url('js/loaders/ColladaLoader.js', __FILE__), array(),'1.1', false);
		wp_register_script('obj-loader', plugins_url('js/loaders/OBJLoader.js', __FILE__), array(),'1.1', false);
		wp_register_script('mtl-loader', plugins_url('js/loaders/MTLLoader.js', __FILE__), array(),'1.1', false);
		//wp_register_script('objmtl-loader', plugins_url('js/loaders/OBJMTLLoader.js', __FILE__), array(),'1.1', false);
		wp_register_script('orbital', plugins_url('js/controls/OrbitControls.js', __FILE__), array(),'1.1', false);
		wp_register_script('wp3d', plugins_url('js/3d-model-viewer.js', __FILE__), array(),'1.1', false);
	}

	public function print_scripts() {
		if ( ! self::$add_script )
			return;

		wp_print_scripts('my-script');
	    wp_print_scripts('threejs');
	    wp_print_scripts('collada-loader');
	    wp_print_scripts('obj-loader');
	    wp_print_scripts('mtl-loader');
	    wp_print_scripts('objmtl-loader');
	    wp_print_scripts('orbital');
	    wp_print_scripts('wp3d');
	}


	// The 3D shortcode
	public function shortcode_3d($atts, $content = null) {
	    global $wpdb, $post;
	    self::$add_script = true;

		$result = $wpdb->get_col($wpdb->prepare("SELECT guid FROM $wpdb->posts WHERE guid LIKE '%%%s' and post_parent=%d;", $atts['model'], $post->ID ));
		if (count($result)==null) {
		    $result = $wpdb->get_col($wpdb->prepare("SELECT guid FROM $wpdb->posts WHERE guid LIKE '%%%s';", $atts['model'] ));
		}
		if (count($result)==null) {
		    $model = $atts['model'];
		} else {
		    $model = $result[0];
		}

    	$directional = explode(':', self::get($atts['directional'], '1,1,1:ffffff'));

		$options = array(
    		'width' => self::get($atts['width'], '500'),
    		'height' => self::get($atts['height'], '300'),
    		'background' => hexdec(self::get($atts['background'], 'ffffff')),
    		'opacity' => self::get($atts['opacity'], 1),
    		'modelPosition' => self::createVector($atts['modelposition'], '0,0,0'),
    		'modelScale' => self::createVector($atts['modelscale'], '1,1,1'),
    		'ambient' => hexdec(self::get($atts['ambient'], '404040')),
    		'directionalPosition' => self::createVector($directional[0]),
    		'directionalColor' => hexdec($directional[1]),
    		'cssClass' => self::get($atts['class']),
    		'cssStyle' => self::get($atts['style']),
    		'id' => self::get($atts['id'], 'stage'),
    		'fps' => self::get($atts['fps'], 30),
		    'camera' => self::createVector($atts['camera'], '50,50,30'),
    		'fov' => self::get($atts['fov'], 75),
		    'material' => self::get($atts['material']),
	    );
		ob_start();
		require('output.php');
		return ob_get_clean();
	}

	private static function get(&$var, $default=null) {
	    return isset($var) ? $var : $default;
	}

	private static function createVector(&$string, $default="0,0,0") {
	    $string = self::get($string, $default);
	    $array = explode(',', $string);
	    $result = array();
	    foreach ($array as $coord)
	        $result[] = (int) $coord;
	    return $result;
	}
}

register_activation_hook(__FILE__, array('WP_3D', 'activate'));
register_deactivation_hook(__FILE__, array('WP_3D', 'deactivate'));
$wp3d = new WP_3D();
