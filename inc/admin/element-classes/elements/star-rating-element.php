<?php
namespace WP_Table_Builder\Inc\Admin\Element_Classes\Elements;

use WP_Table_Builder\Inc\Admin\Element_Classes\Base\Element_Base_Object as Element_Base_Object;
use WP_Table_Builder\Inc\Admin\Element_Classes\Managers\Controls_Manager as Controls_Manager;
use WP_Table_Builder as NS;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

class Star_Rating_Element extends Element_Base_Object {
    
    /**
	 * Get element name.
	 *
	 * Retrieve button editor element name.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element name.
	 */
	public function get_name() {
		return 'star_rating';
	}
    
    /**
	 * Get element data.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string element data.
	 */
	public function get_element_data() {
		return esc_attr( 'star_rating', 'wp-table-builder' );
	}

	/**
	 * Get element button.
	 *
	 * Retrieve button editor element.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Element title.
	 */
	public function get_title() {
		return esc_html_e( 'Star Rating', 'wp-table-builder' );
	}

	/**
	 * Get directory icon.
	 *
	 * Retrieve url text editor element icon.
	 *
	 * @since 1.1.2
	 * @access public
	 *
	 * @return string Url Element icon.
	 */
	public function get_directory_icon() {
		return NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/half-filled-rating-star.php'; ;
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
		$this->add_control(
			'section_header',
			[
				'label' => __( 'Star Rating Options', 'wp_table_builder' ),
				'type' => Controls_Manager::SECTION_HEADER,
			]
		);
        
		$this->add_control(
			'starRatingSize',
			[
				'label' => __( 'Star Size', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}} .wptb-rating-star' => ['width', 'height'],
                ],
                'min' => 10, 
                'max' => 50,
                'defaultValue' => 20,
                'dimension' => 'px'
			]
		);

		$this->add_control(
			'starColor',
			[
				'label' => __( 'Star Color', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}} .wptb-rating-star span' => 'fill',
                ]
			]
		);
        

		$this->add_control(
			'starCount',
			[
				'label' => __( 'Star Count', 'wp_table_builder' ),
				'type' => Controls_Manager::ENTRY_FIELD,
                'inputType' => 'number',
                'min' => 1, 
                'max' => 10,
                'defaultValue' => 5,
			]
		);
        
        
		$this->add_control(
			'ratingAlignmentCheckbox',
			[
				'label' => __( 'Rating Alignment', 'wp_table_builder' ),
				'type' => Controls_Manager::ELEMENT_ALIGNMENT,
                'selected' => 1,
                'selectors' => [
                    '{{{data.container}}}' => 'text-align',
                ]
			]
		);
        
        $this->add_control(
			'numberRatingShowHide',
			[
				'label' => __( 'Show Number Rating', 'wp_table_builder' ),
				'type' => Controls_Manager::SHOW_HIDE,
                'selectors' => [
                    '{{{data.container}}} .wptb-success-box' => 'display',
                    '.wptb-numeral-star-rating-option' => 'display'
                ]
			]
		);
        
		$this->add_control(
			'numberRatingSize',
			[
				'label' => __( 'Number Rating Size', 'wp_table_builder' ),
				'type' => Controls_Manager::SIZE,
                'selectors' => [
                    '{{{data.container}}} .wptb-text-message' => ['fontSize'],
                ],
                'min' => 10, 
                'max' => 50,
                'defaultValue' => 25,
                'dimension' => 'px',
                'customClassForContainer' => 'wptb-numeral-star-rating-option',
                'containerAdditionalStyles' => 'display:none;'
			]
		);
        
        $this->add_control(
			'numberRatingColor',
			[
				'label' => __( 'Font Color', 'wp_table_builder' ),
				'type' => Controls_Manager::COLOR,
                'selectors' => [
                    '{{{data.container}}} .wptb-text-message' => 'color',
                ],
                'customClassForContainer' => 'wptb-numeral-star-rating-option',
                'containerAdditionalStyles' => 'display:none;'
			]
		);
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
        <div class="wptb-rating-stars-box">
            <?php

            $countStarts = 5;
            
            ob_start();
            require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/filled-rating-star-small.php';
            $filled_rating_star_html = ob_get_clean();
            
            
            ob_start();
            require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/not-filled-rating-star-small.php';
            $not_filled_rating_star_html = ob_get_clean();
            
            
            ob_start();
            require NS\WP_TABLE_BUILDER_DIR . 'inc/admin/views/builder/icons/half-filled-rating-star-small.php';
            $half_filled_rating_star_html = ob_get_clean();
            
            $rating_star_list = '<ul class="wptb-rating-stars-list">';
            
            $rating_star = '';
            for( $i = 0; $i < $countStarts; $i++ ) {
                $rating_star .= '<li class="wptb-rating-star" style="width:20px;" data-value="' . ( $i + 1 ) . '">';
                $rating_star_zero_set = '';
                if( $i == 0 ) {
                    $rating_star_zero_set = '<span class="wptb-rating-star-zero-set"></span>';
                }

                $rating_star .= '<span class="wptb-rating-star-left-signal-part">' . $ratingStarZeroSet . '</span>'
                            . '<span class="wptb-filled-rating-star">' . $filled_rating_star_html . '</span>'
                            . '<span class="wptb-not-filled-rating-star">' . $not_filled_rating_star_html . '</span>'
                            . '<span class="wptb-half-filled-rating-star">' . $half_filled_rating_star_html . '</span>'
                            . '<span  class="wptb-rating-star-right-signal-part"></span>';
                $rating_star .= '</li>';
            }
            $rating_star_list .= $rating_star . '</ul>';
            
            echo $rating_star_list;

            ?>
            </ul>
            <div class="wptb-success-box" style="display: none;">
                <div class="wptb-text-message" style="font-size: 25px;"></div>
            </div>
        </div>
		<?php
	}
    
    /**
	 * Render element script output in the editor.
	 *
	 * Used to generate the live preview, using a wp js template
	 *
	 * @since 1.1.2
	 * @access protected
	 */
    protected function _element_script() {
        ?>
        ( function() {
            let element = document.getElementsByClassName( '{{{data.elemClass}}}' );
            if( element.length > 0 ) {
                element = element[0];
                
                element.addEventListener( 'wptb-entry-field:input:{{{data.elemClass}}}', function() {
                    let elementInput = document.querySelector( 'input[data-element="{{{data.elemClass}}}"]' );
                    if( elementInput ) {
                        let inputValue = elementInput.value;
                        
                        let starRatings = element.querySelectorAll( 'li' );

                        let starRatingsCount = starRatings.length;
                        

                        if( inputValue > starRatingsCount ) {
                            let elementInputMax = elementInput.getAttribute( 'max' );
                            elementInputMax = parseInt( elementInputMax, 10 );
                            if( ! elementInputMax ) {
                                elementInputMax = 10;
                            }
                            if( inputValue > elementInputMax ) {
                                inputValue = elementInputMax;
                            }
                            let difference = inputValue - starRatingsCount;
                            let starRatingsLast = starRatings[starRatings.length - 1];

                            let parent = starRatingsLast.parentNode;
                            for( let i = 0; i < difference; i++ ){
                                let newStarRating = starRatingsLast.cloneNode( true );
                                newStarRating.removeAttribute( 'class' );
                                newStarRating.setAttribute( 'class', 'wptb-rating-star' );
                                newStarRating.dataset.value = parseInt(starRatingsLast.dataset.value) + i + 1;
                                WPTB_Helper.starRatingEventHandlersAdd( newStarRating );
                                parent.appendChild( newStarRating );
                            }
                        } else if( inputValue < starRatingsCount ) {
                            if( inputValue <= 0 ) inputValue = 1;
                            let difference = parseInt( starRatingsCount ) - parseInt( inputValue );

                            if( inputValue == 0 ) {
                                difference--;
                                starRatings[0].removeAttribute( 'class' );
                                starRatings[0].setAttribute( 'class', 'wptb-rating-star' );
                                starRatings[0].style.display = 'none';
                            }

                            let starRatingLength = starRatings.length;
                            for( i = 0; i < difference; i++ ) {
                                starRatings[0].parentNode.removeChild( starRatings[starRatingLength - i - 1] );
                            }
                        } else if( inputValue == starRatingsCount && starRatingsCount == 1 ) {
                            starRatings[0].style.display = 'inline-block';
                        }

                        WPTB_Helper.starRatingTextMessageChenge( element );
                    }
                }, false );
                
                let ratingStars = element.getElementsByClassName( 'wptb-rating-star' );
                for ( let i = 0; i < ratingStars.length; i++ ) {
                    let ratingStar = ratingStars[i];


                    WPTB_Helper.starRatingEventHandlersAdd( ratingStar );

                    let ritingStarZeroSet = ratingStar.querySelector( '.wptb-rating-star-zero-set' );
                    if( ritingStarZeroSet ) {
                        ritingStarZeroSet.onclick = function( event ) {
                            let ulStarList = WPTB_Helper.findAncestor( event.target, 'wptb-rating-stars-list' );
                            if( ulStarList ) {
                                let children = ulStarList.children;
                                for( let i = 0; i < children.length; i++ ) {
                                    children[i].classList.remove( 'wptb-rating-star-selected-full' );
                                    children[i].classList.remove( 'wptb-rating-star-selected-half' );
                                }
                            }
                        }
                    }
                }
            }
        } )();
        <?php
    }
}
