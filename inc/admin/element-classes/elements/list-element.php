<?php

namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Controls\Control_Section_Group_Tabbed;
use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base as Element_Base;
use WP_Table_Builder\Inc\Admin\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class List_Element extends Element_Base {

	/**
	 * Get element name.
	 *
	 * Retrieve list editor element name.
	 *
	 * @return string element name.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_name() {
		return 'list';
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
		return esc_html_e( 'List', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Retrieve directory list-item editor element icon.
	 *
	 * @return string Directory Element icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_directory_icon() {
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/list.svg';
	}

	/**
	 * Get url icon.
	 *
	 * Return url list-item icon
	 *
	 * @return string Url Element icon.
	 * @since 1.1.2
	 * @access public
	 *
	 */
	public function get_url_icon() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_URL . 'inc/admin/views/builder/icons/list.svg' );
	}

	/**
	 * Include file with js script for element list
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	public function element_script() {
		return wp_normalize_path( NS\WP_TABLE_BUILDER_DIR . 'inc/admin/element-classes/element-scripts/list-element.js' );
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
		$general_controls = [
			'select1' =>
				[
					'label'           => __( 'List Type', 'wp-table-builder' ),
					'type'            => Controls_Manager::SELECT,
					'options'         => [
						[ 'Ordered', 'numbered', '' ],
						[
							'Unordered',
							'unordered',
							[
								'wptb-list-style-type-disc',
								'wptb-list-style-type-circle',
								'wptb-list-style-type-square',
								'wptb-list-style-type-none'
							]
						]
					],
					'selectors'       => [
						'{{{data.container}}} ul li p' => 'class'
					],
					'selectedDefault' => 0,
				],
			'select2' =>
				[
					'label'                 => __( 'List Icon', 'wp-table-builder' ),
					'type'                  => Controls_Manager::SELECT,
					'options'               => [
						[ 'Circle', 'circle', 'wptb-list-style-type-circle' ],
						[ 'Square', 'square', 'wptb-list-style-type-square' ],
						[ 'Disc', 'disc', 'wptb-list-style-type-disc' ],
						[ 'None', 'none', 'wptb-list-style-type-none' ]
					],
					'selectors'             => [
						'{{{data.container}}} ul li p' => 'class'
					],
					'selectedDefault'       => 2,
					'appearDependOnControl' => [ 'select1', [ 'unordered' ], [ 'numbered' ] ]
				]
		];

		$font_controls = [
			'listColor' =>
				[
					'label'     => __( 'List Font Color', 'wp-table-builder' ),
					'type'      => Controls_Manager::COLOR_PALETTE,
					'selectors' => [
						[
							'query' => '{{{data.container}}} ul li p',
							'type'  => Controls_Manager::STYLE,
							'key'   => 'color',
						],
					],
				],
			'size' =>
			[
				'label'        => __( 'Font Size', 'wp-table-builder' ),
				'type'         => Controls_Manager::RANGE,
				'selectors'    => [
					[
						'query'  => '{{{data.container}}} ul li p',
						'type'   => Controls_Manager::STYLE,
						'key'    => 'fontSize',
						'format' => '{$}px',
					],
				],
				'min'          => 10,
				'max'          => 50,
				'defaultValue' => 15,
				'postFix'      => 'px'
			]

		];

		$layout_controls = [
			'spacing'       =>
				[
					'label'        => __( 'Item Spacing', 'wp-table-builder' ),
					'type'         => Controls_Manager::RANGE,
					'selectors'    => [
						[
							'query'  => '{{{data.container}}} ul li',
							'type'   => Controls_Manager::STYLE,
							'key'    => 'marginBottom',
							'format' => '{$}px',
						]
					],
					'min'          => 0,
					'max'          => 30,
					'defaultValue' => 0,
					'postFix'      => 'px'
				],
			'listAlignment' =>
				[
					'label'        => __( 'List Alignment', 'wp-table-builder' ),
					'type'         => Controls_Manager::ALIGNMENT2,
					'selected'     => 0,
					'selectors'    => [
						[
							'query' => '{{{data.container}}} ul li p',
							'type'  => Controls_Manager::STYLE,
							'key'   => 'textAlign',
						]
					],
					'defaultValue' => 'left'
				]
		];


		$list_element_controls = [
			esc_html__( 'general', 'wp-table-builder' ) => $general_controls,
			esc_html__( 'font', 'wp-table-builder' )    => $font_controls,
			esc_html__( 'layout', 'wp-table-builder' )  => $layout_controls,
		];

		Control_Section_Group_Tabbed::add_section( 'listElementOptions', __( 'List Options', 'wp-table-builder' ), $list_element_controls, [
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
        <ul>
            <li class="wptb-in-element">
                <div class="wptb-list-item-content"
                     style="position: relative;" spellcheck="false" contenteditable="true">
                    <p data-list-style-type-index="1."><?php esc_html_e( 'List Item 1', 'wp-table-builder' ); ?></p>
                </div>
            </li>
            <li class="wptb-in-element">
                <div class="wptb-list-item-content"
                     style="position: relative;" spellcheck="false" contenteditable="true">
                    <p data-list-style-type-index="2."><?php esc_html_e( 'List Item 2', 'wp-table-builder' ); ?></p>
                </div>
            </li>
            <li class="wptb-in-element">
                <div class="wptb-list-item-content"
                     style="position: relative;" spellcheck="false" contenteditable="true">
                    <p data-list-style-type-index="3."><?php esc_html_e( 'List Item 3', 'wp-table-builder' ); ?></p>
                </div>
            </li>
        </ul>
		<?php
	}
}
