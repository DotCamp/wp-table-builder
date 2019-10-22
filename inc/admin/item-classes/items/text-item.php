<?php
namespace WP_Table_Builder\Inc\Admin\Item_Classes\Items;

use WP_Table_Builder\Inc\Admin\Item_Classes\Base\Item_Base_Object as Item_Base_Object;
use WP_Table_Builder\Inc\Admin\Item_Classes\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Text_Item extends Item_Base_Object {
    
    /**
	 * Get item name.
	 *
	 * Retrieve text editor item name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string item name.
	 */
	public function get_name() {
		return 'text';
	}
    
    /**
	 * Get item data.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string item data.
	 */
	public function get_item_data() {
		return esc_attr( 'text', 'wp-table-builder' );
	}

	/**
	 * Get item title.
	 *
	 * Retrieve text editor item title.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Item title.
	 */
	public function get_title() {
		return esc_html_e( 'Text', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Retrieve url text editor item icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Item icon.
	 */
	public function get_directory_icon() {
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/text.php'; ;
	}
    
    /**
	 * Register the item controls.
	 *
	 * Adds different fields to allow the user to change and customize the item settings.
	 *
	 * @since 1.1.2
	 *
	 * @access protected
	 */
	protected function _register_controls() {
		$this->add_control(
			'section_header',
			[
				'label' => __( 'Text Options', 'wp_table_builder' ),
				'type' => Controls_Manager::SECTION_HEADER,
			]
		);

		$this->add_control(
			'color',
			[
				'label' => __( 'Font Color', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.wrapper}}}' => 'color',
                ]
			]
		);
        
		$this->add_control(
			'size',
			[
				'label' => __( 'Font Size', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.wrapper}}}' => 'fontSize',
                ],
                'min' => 10, 
                'max' => 50,
                'defaultValue' => 15,
                'dimension' => 'px'
			]
		);
	}
    
    /**
	 * Render text editor item output in the editor.
	 *
	 * Written as a wp js template and used to generate the live preview.
	 *
	 * @since 1.1.2
	 * @access protected
	 */
	protected function _content_template() {
		?>
        <div><p>Text</p></div>
		<?php
	}
    
    /**
	 * Render item script output in the editor.
	 *
	 * Used to generate the live preview, using a wp js template
	 *
	 * @since 1.1.2
	 * @access protected
	 */
    protected function _item_script() {
        ?>
        ( function() {
            let item = document.getElementsByClassName( '{{{data.elemClass}}}' );
            if( item.length > 0 ) {
                item = item[0];
                tinyMCE.init({
                    target: item.childNodes[0],
                    inline: true,
                    plugins: "link, paste",
                    dialog_type: "modal",
                    theme: 'modern',
                    menubar: false,
                    force_br_newlines : false,
                    force_p_newlines : false,
                    forced_root_block : '',
                    fixed_toolbar_container: '#wpcd_fixed_toolbar',
                    paste_as_text: true,
                    toolbar: 'bold italic strikethrough link unlink | alignleft aligncenter alignright alignjustify',
                    setup : function( ed ) {
                        ed.on( 'change', function(e) {
                            let row = WPTB_Helper.findAncestor( item, 'wptb-row' );
                            if( row.classList.contains( 'wptb-table-head' ) ) {
                                let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );
                                WPTB_Helper.dataTitleColumnSet( table );
                            }


                        });

                        ed.on( 'keydown', function(e) {
                            let wptbActionsField = new WPTB_ActionsField();

                            wptbActionsField.addActionField( 1, item );

                            wptbActionsField.setParameters( item );
                        });
                        ed.on( 'keyup', function(e) {
                            let wptbActionsField = new WPTB_ActionsField();

                            wptbActionsField.addActionField( 1, item );

                            wptbActionsField.setParameters( item );

                            e.target.onblur = function() {
                                let wptbTableStateSaveManager = new WPTB_TableStateSaveManager();
                                wptbTableStateSaveManager.tableStateSet();
                            }
                        });

                    },
                    init_instance_callback: function (editor) {
                        window.currentEditor = editor;
                        editor.on('focus', function (e) {
                            var totalWidth = document.getElementsByClassName('wptb-builder-panel')[0].offsetWidth;
                            if (window.currentEditor &&
                                document.getElementById('wptb_builder').scrollTop >= 55 &&
                                window.currentEditor.bodyElement.style.display != 'none') {
                                document.getElementById('wpcd_fixed_toolbar').style.position = 'fixed';
                                document.getElementById('wpcd_fixed_toolbar').style.right = (totalWidth / 2 - document.getElementById('wpcd_fixed_toolbar').offsetWidth / 2) + 'px';
                                document.getElementById('wpcd_fixed_toolbar').style.top = '100px';
                            } else {
                                document.getElementById('wpcd_fixed_toolbar').style.position = 'static';
                                delete document.getElementById('wpcd_fixed_toolbar').style.right;
                                delete document.getElementById('wpcd_fixed_toolbar').style.top;
                            }
                        });
                    }
                });
                
                var observer = new MutationObserver( function( mutations ) {
                    let row = WPTB_Helper.findAncestor( item, 'wptb-row' );
                    if( row.classList.contains( 'wptb-table-head' ) ) {
                        let table = WPTB_Helper.findAncestor( row, 'wptb-preview-table' );
                        WPTB_Helper.dataTitleColumnSet( table );
                    }
                });
                var config = { attributes: true, attributeFilter: ['style'] };
                observer.observe( item, config );
            }
        } )();
        <?php
    }
}
