<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

// if called directly, abort
use WP_Table_Builder_Pro\Inc\Admin\Managers\Freemius_Manager;
use function add_action;
use function add_filter;
use function esc_html__;
use function wp_sprintf;

if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Upsells_Manager.
 *
 * Manager to handle upsells for pro version if not activated
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Upsells_Manager {

	/**
	 * Upsells messages
	 * @var array
	 */
	protected static $upsell_messages = [];

	/**
	 * Initialize manager.
	 */
	public static function init() {
		if ( ! static::check_pro_status() ) {
			static::$upsell_messages = [
				'after_elements'  => esc_html__( 'For More Advanced Elements', 'wp-table-builder' ),
				'generate_menu'   => esc_html__( 'For Prebuilt Tables and Using Your Own Tables as Prebuilt Tables', 'wp-table-builder' ),
				'cell_management' => esc_html__( 'For More Advanced Options in Cell Management Mode', 'wp-table-builder' ),
				'generic_end'     => wp_sprintf( '<br><div>%s %s %s</div>', esc_html_x( 'Get the', 'start of the "Get the Pro Add-On" sentence', 'wp-table-builder' ), '<span class="wptb-upsells-pro-label">PRO</span>', esc_html__( 'Add-On.', 'wp-table-builder' ) )
			];
			add_action( 'wp-table-builder/action/after_elements', [ __CLASS__, 'after_elements_upsell' ], 1 );
			add_action( 'wp-table-builder/action/after_cell_notselected_left_panel', [
				__CLASS__,
				'cell_management_upsell'
			], 1 );
			add_action( 'wp-table-builder/action/cell_option', [
				__CLASS__,
				'cell_management_upsell'
			], 1 );
			add_filter( 'wp-table-builder/filter/generate_data', [ __CLASS__, 'generate_data_filter' ], 1, 1 );
		}
	}

	/**
	 * Upsell for cell management menu.
	 */
	public static function cell_management_upsell() {
		static::prepare_upsell_element( static::$upsell_messages['cell_management'] );
	}

	/**
	 * Add upsells to generate menu.
	 *
	 * @param array $generate_data generate data
	 *
	 * @return array modified generate data
	 */
	public static function generate_data_filter( $generate_data ) {
		ob_start();
		static::prepare_upsell_element( static::$upsell_messages['generate_menu'] );
		$upsell_element = ob_get_contents();
		ob_end_clean();

		$generate_data['upsell'] = $upsell_element;

		return $generate_data;
	}

	/**
	 * Prepare upsell element for display.
	 *
	 * @param string $message message
	 */
	protected static function prepare_upsell_element( $message ) {
		?>
      <a class="wptb-upsells-anchor" href="<?php echo esc_url( admin_url( 'admin.php?page=wptb-overview-addons' ) ); ?>"
         target="_blank">
        <div class="wptb-upsells-wrapper">
          <div class="wptb-upsells-message-holder wptb-plugin-box-shadow-md"><?php echo join( ' ', [
				  "<div>$message</div>",
				  static::$upsell_messages['generic_end']
			  ] ); ?></div>
        </div>
      </a>
		<?php
	}

	/**
	 * Check status of pro version.
	 * This check will return true only if a valid license is activated for pro version.
	 * @return bool pro enabled or not
	 */
	public static function check_pro_status() {
		return class_exists( '\WP_Table_Builder_Pro\Inc\Admin\Managers\Freemius_Manager' ) && filter_var( Freemius_Manager::is_premium_activated(), FILTER_VALIDATE_BOOLEAN );
	}

	/**
	 * Upsell notification after elements at left panel.
	 */
	public static function after_elements_upsell() {
		static::prepare_upsell_element( static::$upsell_messages['after_elements'] );
	}
}