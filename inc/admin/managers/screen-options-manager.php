<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

// if called directly, abort process
use WP_Screen;
use function add_action;
use function add_screen_option;
use function apply_filters;
use function get_current_screen;
use function get_current_user_id;
use function get_user_meta;
use function sanitize_text_field;
use function submit_button;
use function wp_create_nonce;
use function wp_verify_nonce;

if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Class Screen_Options_Manager
 *
 * Manager for adding screen options to table listing menu.
 *
 *  actions:
 *    wp-table-builder/action/render_screen_settings: render screen settings to screen options section.
 *
 *  filters:
 *    wp-table-builder/filter/screen_options: filter screen options that will be saved to screen object.
 *
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Screen_Options_Manager {

	/**
	 * Options array.
	 * @var array[]
	 */
	public $options;

	/**
	 * Screen option id.
	 * @var string
	 */
	public $options_id = 'wptb_screen_options';

	/**
	 * User meta setting id.
	 * @var string
	 */
	public $user_meta_id = 'wptb_screen_options_user_meta';


	/**
	 * Screen_Options_Manager constructor.
	 */
	public function __construct() {
		$this->options = [
			'table_per_page' => [
				'label'    => esc_html__( 'Pagination', 'wp-table-builder' ),
				'settings' => [
					'pagination' => [
						'title' => esc_html__( 'Number of items per page', 'wp-table-builder' ),
						'value' => 20
					]
				]
			]
		];

		add_action( 'wptb_admin_menu', [ $this, 'register_screen_options' ] );
		add_filter( 'screen_settings', [ $this, 'screen_settings' ], 10, 2 );
		add_filter( 'tables_per_page', [ $this, 'tables_per_page' ], 99, 1 );
		add_filter( 'set_screen_option_' . $this->user_meta_id, [ $this, 'save_screen_options' ], 11, 3 );

		// for WordPress version < 5.4.2
		add_filter( 'set-screen-option', [ $this, 'save_screen_options' ], 11, 3 );
	}

	/**
	 * Filter out per page value with the one from either user meta, if not present, from screen option.
	 *
	 * @param int $per_page per page value sent from filter
	 *
	 * @return string per page option value
	 */
	public function tables_per_page( $per_page ) {
		return $this->get_saved_screen_option( 'pagination', 'table_per_page' );
	}

	/**
	 * Process and save screen option matching with plugins user meta id.
	 *
	 * @param boolean $keep handle option save
	 * @param string $option user meta option id
	 * @param string $value option value
	 *
	 * @return array|mixed screen option values to be saved to user meta
	 */
	public function save_screen_options( $keep, $option, $value ) {
		$nonce_id = $this->user_meta_id . '_nonce';

		if ( isset( $_POST[ $nonce_id ] ) && wp_verify_nonce( sanitize_text_field( $_POST[ $nonce_id ] ), $this->user_meta_id ) ) {
			if ( $option === $this->user_meta_id ) {
				$value = isset( $_POST[ $this->options_id ] ) && is_array( $_POST[ $this->options_id ] ) ? $_POST[ $this->options_id ] : [];
			}
		}

		return $value;
	}

	/**
	 * Render screen options to page.
	 *
	 * @param string $screen_settings screen settings to be rendered
	 * @param WP_Screen $wp_screen WP_Screen instance
	 *
	 * @return string screen options to be rendered
	 */
	public function screen_settings( $screen_settings, $wp_screen ) {
		global $tables_overview;

		if ( $wp_screen->base === $tables_overview ) {
			ob_start();

			$this->render_before();

			$this->render_screen_settings();

			do_action( 'wp-table-builder/action/render_screen_settings', $this );

			$this->render_after();

			return ob_get_clean();
		}

		return $screen_settings;
	}

	/**
	 * Handle necessary steps before rendering options.
	 */
	protected function render_before() {
		$nonce = wp_create_nonce( $this->user_meta_id );
		?>
      <input type="hidden" name="<?php echo esc_attr( $this->user_meta_id . '_' . 'nonce' ); ?>"
             value="<?php echo esc_attr( $nonce ); ?>">
		<?php
	}

	/**
	 * Render after main options are finished, but before sending them to DOM.
	 */
	protected function render_after() {
		submit_button( esc_html__( 'Apply', 'wp-table-builder' ), 'primary' );
	}

	/**
	 * Render normal version screen settings to screen options element.
	 */
	protected function render_screen_settings() {
		foreach ( $this->options as $option_id => $option_values ):
			?>
          <fieldset class="metabox-prefs">
            <legend><?php echo $option_values['label']; ?></legend>
            <input type="hidden" name="wp_screen_options[option]"
                   value="<?php echo esc_attr( $this->user_meta_id ); ?>">
            <input type="hidden" name="wp_screen_options[value]" value="yes">
			  <?php $this->prepare_options( $option_id, $option_values['settings'] ); ?>
          </fieldset>
		<?php
		endforeach;
	}

	/**
	 * Prepare options to be rendered.
	 *
	 * @param string $option_id parent id of the setting
	 * @param array $settings settings array
	 */
	protected function prepare_options( $option_id, $settings ) {
		foreach ( $settings as $setting_id => $setting_values ) {
			$this->render_option( $option_id, $setting_id, $setting_values['title'] );
		}
	}

	/**
	 * Render individual screen option.
	 *
	 * @param string $parent_id parent id of the setting
	 * @param string $setting_id setting id
	 * @param string $title option title
	 */
	protected function render_option( $parent_id, $setting_id, $title ) {
		$id = implode( '_', [ $this->options_id, $parent_id, $setting_id ] );

		$value = $this->get_saved_screen_option( $setting_id, $parent_id );
		?>
      <label for="<?php echo esc_attr( $id ); ?>"><?php echo $title; ?></label>
      <input type="number" class="screen-per-page" min="1" max="999" maxlength="3" id="<?php echo esc_attr( $id ); ?>"
             name="<?php echo esc_attr( $this->options_id ) ?>[<?php echo esc_attr( $parent_id ); ?>][<?php echo esc_textarea( $setting_id ) ?>]"
             value="<?php echo esc_attr( $value ); ?>">
		<?php
	}

	/**
	 * Register screen options for table overview menu.
	 */
	public function register_screen_options() {
		global $tables_overview;
		$context = $this;

		$filtered_options = apply_filters( 'wp-table-builder/filter/screen_options', $this->options );

		add_action( "load-$tables_overview", function () use ( $context, $tables_overview, $filtered_options ) {
			$current_screen = get_current_screen();

			if ( is_object( $current_screen ) && $current_screen->id === $tables_overview ) {
				foreach ( $filtered_options as $option_id => $option_values ) {
					foreach ( $option_values['settings'] as $setting_id => $setting_values ) {
						add_screen_option( $context->options_id . '_' . $option_id . '_' . $setting_id, [
							'option' => $setting_values['title'],
							'value'  => $setting_values['value'],
						] );
					}
				}
			}
		} );
	}

	/**
	 * Get saved screen option.
	 *
	 * First user meta will be checked for any matching option id, if not found, registered default screen option value will be used.
	 *
	 * @param string $key option name
	 * @param string $parent_id parent id of the option
	 *
	 * @return mixed|string|null screen option value
	 */
	public function get_saved_screen_option( $key, $parent_id ) {
		$user_meta = get_user_meta( get_current_user_id(), $this->user_meta_id );

		if ( $user_meta && is_array( $user_meta ) && isset( $user_meta[0][ $parent_id ] ) ) {
			return isset( $user_meta[0][ $parent_id ][ $key ] ) ? $user_meta[0][ $parent_id ][ $key ] : null;
		}

		global $tables_overview;
		$current_screen = get_current_screen();

		if ( is_object( $current_screen ) && $current_screen->id === $tables_overview ) {
			return $current_screen->get_option( implode( '_', [ $this->options_id, $parent_id, $key ] ), 'value' );
		}

		return null;
	}

	/**
	 * Get all related options with the supplied parent id.
	 *
	 * @param string $parent_id parent id
	 *
	 * @return mixed|null screen options related to parent id.
	 */
	public function get_all_options( $parent_id ) {
		$user_meta = get_user_meta( get_current_user_id(), $this->user_meta_id );

		// search user meta for option
		if ( $user_meta && is_array( $user_meta ) && isset( $user_meta[0][ $parent_id ] ) ) {
			return $user_meta[0][ $parent_id ];
		}

		global $tables_overview;
		$current_screen = get_current_screen();

		// search screen object for option
		if ( is_object( $current_screen ) && $current_screen->id === $tables_overview ) {
			$screen_options = $current_screen->get_options();

			// prepare prefix of screen option
			$needle = implode( '_', [ $this->options_id, $parent_id ] );

			return array_reduce( array_keys( $screen_options ), function ( $carry, $key ) use ( $needle, $screen_options ) {
				$matched = [];;
				if ( filter_var( preg_match( "/^{$needle}_(.+)$/", $key, $matched ), FILTER_VALIDATE_BOOLEAN ) ) {
					$carry[ $matched[1] ] = $screen_options[ $key ]['value'];
				}

				return $carry;
			}, [] );
		}

		return null;
	}
}