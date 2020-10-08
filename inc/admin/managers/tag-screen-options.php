<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

// if called directly, abort
use function add_action;
use function add_filter;

if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Tag_Screen_Options
 *
 * Class for managing tag related screen options.
 *
 * @package WP_Table_Builder\Inc\Admin\Managers
 */
class Tag_Screen_Options {

	/**
	 * Inner options.
	 * @var array
	 */
	protected $options;

	/**
	 * Options name.
	 * @var string
	 */
	protected $options_name;

	/**
	 * Options label.
	 * @var string
	 */
	protected $label;

	/**
	 * Settings array for screen option section.
	 * @var array
	 */
	protected $settings;

	/**
	 * Sent options.
	 * @var array
	 */
	protected $raw_options;

	/**
	 * Tag_Screen_Options constructor.
	 *
	 * @param array $options options array
	 */
	public function __construct( $options ) {
		$this->options_name = array_keys( $options )[0];
		$this->options      = $options[ $this->options_name ];
		$this->label        = $this->options['label'];
		$this->settings     = $this->options['settings'];
		$this->raw_options  = $options;

		add_filter( 'wp-table-builder/filter/screen_options', [ $this, 'screen_options' ] );

		add_action( 'wp-table-builder/action/render_screen_settings', [ $this, 'render_screen_options' ] );
	}

	/**
	 * Render table tags options to DOM.
	 *
	 * @param Screen_Options_Manager $screen_options_manager screen options manager instance
	 */
	public function render_screen_options( $screen_options_manager ) {
		?>
      <fieldset class="metabox-prefs">
        <legend><?php echo $this->label; ?></legend>
		  <?php $this->prepare_options( $screen_options_manager ); ?>
      </fieldset>
		<?php
	}

	/**
	 * Bulk prepare options.
	 *
	 * @param Screen_Options_Manager $screen_options_manager screen options manager instance
	 */
	protected function prepare_options( $screen_options_manager ) {
		if ( count( $this->settings ) === 0 ) {
			$this->no_terms_render();
		} else {
			foreach ( $this->settings as $option => $values ) {
				$this->render_option( $option, $values['title'], $screen_options_manager );
			}
		}

	}

	/**
	 * Render when no terms are found.
	 */
	protected function no_terms_render() {
	  printf('<i>%s</i>', esc_html__('no terms found', 'wp-table-builder'));
	}

	/**
	 * Render option to DOM.
	 *
	 * @param string $option options slug
	 * @param string $title options title
	 * @param Screen_Options_Manager $screen_options_manager screen options manager instance
	 */
	protected function render_option( $option, $title, $screen_options_manager ) {
		$id      = $this->options_name . '_' . $option;
		$checked = $screen_options_manager->get_saved_screen_option( $option, $this->options_name );

		$checked = $checked !== null && $checked === 'on';

		$sprint_base = '<label for="%s"><input type="checkbox" id="%s" name="%s[%s][%s]" ' . checked( $checked, true, false ) . '>%s</label>';

		printf( $sprint_base, esc_attr( $id ), esc_attr( $id ), esc_attr( $screen_options_manager->options_id ), esc_textarea( $this->options_name ), esc_textarea( $option ), $title );
	}

	/**
	 * Merge our options with filter options to save them to screen as defaults.
	 *
	 * @param array $options screen options array
	 *
	 * @return array merged options
	 */
	public function screen_options( $options ) {
		return array_merge( $options, $this->raw_options );
	}
}