<?php

namespace WP_Table_Builder\Inc\Admin\Controls;

// if called directly, abort process
if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Class Control_Tag_Control
 *
 * Add/remove table tags from control.
 *
 * Accepted options
 *  label => label for control element
 *  selectors => selector array to get/set certain values to html elements
 *  tags => available table tags array
 *  postTags => tags added to requested post
 *  security => and array containing nonce,action and ajaxUrl for creating new terms
 *
 * @package WP_Table_Builder\Inc\Admin\Controls
 */
class Control_Tag_Control extends Base_Control {

	/**
	 * Get control type.
	 *
	 * Return the control type.
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function get_type() {
		return 'tag_control';
	}

	/**
	 * Control content template.
	 *
	 * Used to generate the control HTML in the editor using wp js template
	 *
	 * @since 1.1.2
	 * @access public
	 */
	public function content_template() {
		$translated_strings = [
			'availableTags'  => esc_html__( 'available tags', 'wp-table-builder' ),
			'currentTags'    => esc_html__( 'current tags', 'wp-table-builder' ),
			'noCurrentTag'   => esc_html__( 'no tag active', 'wp-table-builder' ),
			'noAvailableTag' => esc_html__( 'no tag available', 'wp-table-builder' ),
			'empty'          => esc_html__( 'empty', 'wp-table-builder' ),
			'searchTags'     => esc_html__( 'search available tags', 'wp-table-builder' ),
			'createNewTag'   => esc_html__( 'create new tag', 'wp-table-builder' ),
			'tagName'        => esc_html__( 'name', 'wp-table-builder' ),
			'tagSlug'        => esc_html__( 'slug', 'wp-table-builder' ),
			'tagDesc'        => esc_html__( 'description', 'wp-table-builder' )
		];

		$strings = json_encode( $translated_strings );
		?>
      <#
      const uniqueItemClass = data.elementControlTargetUnicClass;
      WPTB_ControlsManager.setControlData( uniqueItemClass, data );
      const elemContainer  = data.elemContainer;
      data.strings = JSON.parse('<?php echo $strings ?>');
      if(!WPTB_ControlsManager.getControlData('ControlTag', true)){
      WPTB_ControlsManager.setControlData('ControlTag', data.postTags);
      }
      #>
      <div id="{{{uniqueItemClass}}}">
        <tag-control keep-alive :label="label" elem-container="{{{elemContainer}}}"
                     unique-id="{{{uniqueItemClass}}}" :strings="strings" :available-tags="tags"
                     :security="security"></tag-control>
      </div>
      <wptb-template-script>
        WPTB_ControlsManager.callControlScript('ControlTag', '{{{uniqueItemClass}}}');
      </wptb-template-script>
		<?php
	}
}