<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Tabbed;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base as Element_Base;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;
use function trailingslashit;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Button_Element extends Element_Base {

	/**
	 * Get element name.
	 *
	 * Retrieve button editor element name.
	 *
	 * @return string element name.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_name() {
		return 'button';
	}

	/**
	 * Get element title.
	 *
	 * Retrieve button editor element.
	 *
	 * @return string Element title.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_title() {
		return esc_html_e( 'Button', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Return directory button editor icon
	 *
	 * @return string Directory Element icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_directory_icon() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/button.svg' );
	}

	/**
	 * Get url icon.
	 *
	 * Return url button icon
	 *
	 * @return string Url Element icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_url_icon() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/button.svg' );
	}

	/**
	 * Include file with js script for element button
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	public function element_script() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/button-element.js' );
	}

	/**
	 * Register the element controls.
	 *
	 * Adds different fields to allow the user to change and customize the element settings.
	 *
	 * @since 1.1.2
	 *
	 * @access protected
	 */
	protected function _register_controls() {
		$text_domain = NS\PLUGIN_TEXT_DOMAIN;

		$general_controls = [
			'buttonSizeCheckbox'      =>
				[
					'label'                       => __( 'Button Size', 'wp_table_builder' ),
					'type'                        => Controls_Manager::CHANGE_ATTRIBUTE,
					'selectors'                   => [
						'{{{data.container}}} .wptb-button-wrapper' => 'class: size',
					],
					'numberSelectedButtonDefault' => '1',
					'buttonDataNames'             => [ 's', 'm', 'l', 'xl' ],
					'buttonViews'                 => [ 'S', 'M', 'L', 'XL' ]
				],
			'buttonColor'             =>
				[
					'label'                => __( 'Button Color', 'wp_table_builder' ),
					'type'                 => Controls_Manager::COLOR,
					'startupValueSelector' => [
						'{{{data.container}}} .wptb-button-wrapper a > div' => 'wptbElementBgColor',
					],
					'selectors'            => [
						'{{{data.container}}} .wptb-button-wrapper a > div' => 'background-color',
					],
					'dataSets'             => [
						'{{{data.container}}} .wptb-button-wrapper a > div' => 'wptbElementBgColor',
					]
				],
			'buttonTextSize'          =>
				[
					'label'        => __( 'Button Text Size', 'wp_table_builder' ),
					'type'         => Controls_Manager::SIZE,
					'selectors'    => [
						'{{{data.container}}} .wptb-button-wrapper p' => 'fontSize',
					],
					'min'          => 10,
					'max'          => 50,
					'defaultValue' => 15,
					'dimension'    => 'px'
				],
			'textColor'               =>
				[
					'label'                => __( 'Button Text Color', 'wp_table_builder' ),
					'type'                 => Controls_Manager::COLOR,
					'startupValueSelector' => [
						'{{{data.container}}} .wptb-button-wrapper a > div' => 'wptbElementColor',
					],
					'dataSets'             => [
						'{{{data.container}}} .wptb-button-wrapper a > div' => 'wptbElementColor',
					],
					'selectors'            => [
						'{{{data.container}}} .wptb-button-wrapper a > div' => 'color',
					]
				],
			'buttonLink'              =>
				[
					'label'    => __( 'Button Link', 'wp_table_builder' ),
					'type'     => Controls_Manager::URL,
					'selector' => '{{{data.container}}} .wptb-button-wrapper a'
				],
			'buttonAlignmentCheckbox' =>
				[
					'label'     => __( 'Button Alignment', 'wp_table_builder' ),
					'type'      => Controls_Manager::ALIGNMENT,
					'selected'  => 1,
					'selectors' => [
						'{{{data.container}}} .wptb-button-wrapper' => 'justify-content',
					]
				],
			'button-id'               =>
				[
					'label'       => __( 'Button Id', 'wp_table_builder' ),
					'type'        => Controls_Manager::TEXT,
					'placeholder' => __( 'Insert Button ID Here', 'wp_table_builder' ),
					'selectors'   => [
						'{{{data.container}}} .wptb-button-wrapper a' => 'id',
					]
				],
		];

		$hover_controls = [
			'hoverBgColor'     =>
				[
					'label'      => __( 'Color', $text_domain ),
					'type'       => Controls_Manager::COLOR,
					'useDataset' => true,
					'selectors'  => [
						'{{{data.container}}} .wptb-button-wrapper a div' => 'wptbElementHoverBgColor',
					]
				],
			'hoverTextColor'   =>
				[
					'label'      => __( 'Text Color', $text_domain ),
					'type'       => Controls_Manager::COLOR,
					'useDataset' => true,
					'selectors'  => [
						'{{{data.container}}} .wptb-button-wrapper a div' => 'wptbElementHoverTextColor',
					]
				],
			'hoverButtonScale' => [
				'label'        => __( 'Scale', $text_domain ),
				'type'         => Controls_Manager::RANGE,
				'selectors'    => [
					[
						'query' => '{{{data.container}}} .wptb-button-wrapper a div',
						'type'  => Controls_Manager::DATASET,
						'key'   => 'wptbElementHoverScale'
					]
				],
				'min'          => 1,
				'max'          => 3,
				'step'         => 0.1,
				'defaultValue' => 1,
				'postFix'      => esc_html__( ' times', 'wp-table-builder' )
			]
		];

		$icon_controls = [
			'buttonIcon'   => [
				'label'     => __( 'Button Icon', $text_domain ),
				'type'      => Controls_Manager::ICON_SELECT,
				'icons'     => $this->read_icons(),
				'perPage'   => 20,
				'selectors' => [
					[
						'query' => '{{{data.container}}} .wptb-button-icon',
						'type'  => Controls_Manager::DATASET,
						'key'   => 'wptbButtonIconSrc'
					]
				]
			],
			/**
			 * changed with new named toggle
			 * @deprecated
			 */
//			'iconPosition'     => [
//				'label'     => __( 'Icon Position', $text_domain ),
//				'type'      => Controls_Manager::SELECT,
//				'options'   => [
//					[ esc_html__( 'Left', $text_domain ), 'left', '' ],
//					[ esc_html__( 'Right', $text_domain ), 'right', 'wptb-plugin-button-order-right' ],
//				],
//				'selectors' => [
//					'{{{data.container}}} .wptb-button-wrapper a .wptb-button' => 'class'
//				]
//			],
			'iconPosition' => [
				'label'        => esc_html__( 'Icon Position', 'wp-table-builder' ),
				'type'         => Controls_Manager::NAMED_TOGGLE,
				'items'        => [
					'left'  => esc_html__( 'left', 'wp-table-builder' ),
					'right' => esc_html__( 'right', 'wp-table-builder' ),
				],
				'selectors'    => [
					[
						'query'  => '{{{data.container}}} .wptb-button-wrapper a .wptb-button',
						'type'   => Controls_Manager::CLASSTYPE,
						'format' => 'wptb-plugin-button-order-{$}'
					]
				],
				'defaultValue' => 'left'
			],
			'iconSize'     =>
				[
					'label'        => __( 'Icon Size', 'wp_table_builder' ),
					'type'         => Controls_Manager::SIZE,
					'selectors'    => [
						'{{{data.container}}} .wptb-button-icon' => [ 'width', 'height' ],
					],
					'min'          => 15,
					'max'          => 100,
					'defaultValue' => 25,
					'dimension'    => 'px'
				],
		];

		$button_controls = [
			esc_html__( 'general', $text_domain ) => $general_controls,
			esc_html__( 'hover', $text_domain )   => $hover_controls,
			esc_html__( 'icon', $text_domain )    => $icon_controls,
		];

		Control_Section_Group_Tabbed::add_section( 'buttonElementOptions', __( 'button options', 'wp-table-builder' ), $button_controls, [
			$this,
			'add_control'
		] );
	}

	/**
	 * Render text editor element output in the editor.
	 *
	 * Written as a wp js template and used to generate the live preview.
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _content_template() {
		?>
      <div class="wptb-button-wrapper wptb-size-m">
        <a>
          <div class="wptb-button"
               style="position: relative;">
            <p>Button Text</p>
            <div class="wptb-button-icon" data-wptb-button-icon-src="">
            </div>
          </div>
        </a>
      </div>
		<?php
	}
}
