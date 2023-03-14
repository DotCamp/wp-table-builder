<?php

namespace WP_Table_Builder\Inc\Admin;
use WP_Table_Builder\Inc\Admin\Managers\Settings_Manager;
use WP_Table_Builder\Inc\Common\Helpers;
use WP_Table_Builder as NS;
use function current_user_can;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Imports tables from other table plugins and from CSV files.
 *
 * @link       http://wptablebuilder.com/
 * @since      1.1.6
 *
 * @author    Imtiaz Rayhan
 */

class Import {

    /**
     * Shortcode data.
     *
     * @since 1.1.6
     *
     * @var string
     */
    protected $shortcode_data;

    /**
     * Instance to instantiate object.
     *
     * @since 1.1.6
     *
     * @var $instance
     */
    protected static $instance;

    /**
     * Singleton pattern, making only one instance of the class.
     *
     * @since 1.1.6
     */
    public static function instance() {
        if ( ! isset( self::$instance ) ) {
            $className      = __CLASS__;
            self::$instance = new $className;
        }

        return self::$instance;
    }

    /**
     * Primary class constructor.
     *
     * @since 1.1.6
     */
    public function __construct() {
        add_action( 'wp_ajax_import_tables', array( $this, 'import_tables' ) );
        add_action( 'wp_ajax_shortcodes_replace', array( $this, 'shortcodes_replace' ) );
        add_action( 'wp_ajax_zip_unpacker', array( $this, 'zip_unpacker' ) );

        if ( ! $this->is_import_iframe_page() ) {
            return;
        }

        $this->hooks();
    }

    /**
     * function for shortcodes replace
     */
    public function shortcodes_replace() {
        $params = json_decode( file_get_contents( 'php://input' ) );

        if( current_user_can(Settings_Manager::ALLOWED_ROLE_META_CAP) && property_exists( $params, 'security_code' ) && wp_verify_nonce( $params->security_code, 'wptb-import-security-nonce' ) &&
            property_exists( $params, 'replacing_shortcodes' ) ) {

            $this->permission_check();

            if( $params->replacing_shortcodes && is_object( $params->replacing_shortcodes )) {
                if( property_exists( $params->replacing_shortcodes,'search' ) ) {
                    $shortcode_search = $params->replacing_shortcodes->search;
                } else {
                    $shortcode_search = '';
                }


                $shortcode_search_name = explode( ' ', $shortcode_search );
                if( $shortcode_search_name && is_array( $shortcode_search_name ) ) {
                    $shortcode_search_name = $shortcode_search_name[0];
                    $shortcode_search_name = str_replace( '[', '', $shortcode_search_name );
                } else {
                    $shortcode_search_name = '';
                }

                if( $shortcode_search_name ) {
                    $post_query = new \WP_Query( [
                        'posts_per_page' => -1,
                        's'              => '[' . $shortcode_search_name,
                    ] );

                    if ( ! $post_query->found_posts ) {
                        wp_send_json_error( __( 'No pages found with necessary shortcodes ' . $shortcode_search_name, 'wp_table_builder' ) );
                    }

                    $count = 0;
                    $posts = $post_query->get_posts();

                    $message = '';

                    foreach ( $posts as $post ) {
                        preg_match_all( '/\[(\[?)(' . $shortcode_search_name . '|)(?![\w-])([^\]\/]*(?:\/(?!\])[^\]\/]*)*?)(?:(\/)\]|\](?:([^\[]*+(?:\[(?!\/\2\])[^\[]*+)*+)\[\/\2\])?)(\]?)/s', $post->post_content, $matches, PREG_SET_ORDER );

                        if ( empty( $matches ) ) {
                            continue;
                        }

                        foreach ( $matches as $shortcode ) {
                            $atts = shortcode_parse_atts( $shortcode[0] );

                            if( $atts ) {
                                $shortcode_search = $params->replacing_shortcodes->search;

                                $atts2 = shortcode_parse_atts( $shortcode_search );

                                if( isset( $atts['id'] ) && isset( $atts2['id'] ) && $atts['id'] === $atts2['id'] ) {
                                    $shortcode_replace = $params->replacing_shortcodes->replace;
                                    $post_content = str_replace( $shortcode[0], $shortcode_replace, $post->post_content );

                                    wp_update_post( [
                                        'ID'           => $post->ID,
                                        'post_content' => $post_content,
                                    ] );

                                    $count++;
                                }
                            }
                        }
                    }

                    wp_die( json_encode( ["success", $count] ) );
                }
            }
        }
    }

    public function import_tables() {
        $params = json_decode( file_get_contents( 'php://input' ) );

        if( current_user_can( Settings_Manager::ALLOWED_ROLE_META_CAP) && wp_verify_nonce( $params->security_code, 'wptb-import-security-nonce' ) ) {
            $plugin_name = $params->import_plugin_name;

            if( $plugin_name === 'table-press' ) {
                $this->import_from_table_press();
            }
        } else {
            wp_die( json_encode( 'Import Problem' ) );
        }
    }

    public function zip_unpacker() {
        if ( current_user_can(Settings_Manager::ALLOWED_ROLE_META_CAP) && isset( $_POST ) && isset( $_POST['security_code'] ) &&
             wp_verify_nonce( $_POST['security_code'], 'wptb-import-security-nonce' ) ) {
            if( class_exists( 'ZipArchive', false ) && apply_filters( 'unzip_file_use_ziparchive', true ) ) {

                $zip_file = new \ZipArchive();

                $uploaddir = NS\WP_TABLE_BUILDER_DIR . '/uploads'; // . - текущая папка где находится submit.php

                // creating a folder if it doesn't exist
                if( ! is_dir( $uploaddir ) ) mkdir( $uploaddir, 0777 );

                $files = $_FILES; // getting files

                /**
                 * move files from the temporary directory to the specified
                 * and also unzip the archive and put the contents in an array
                 */
                $data = array();
                foreach( $files as $file ){
                    $file_name = $file['name'];
                    if( move_uploaded_file( $file['tmp_name'], "$uploaddir/$file_name" ) ){
                        if ( true === $zip_file->open( "$uploaddir/$file_name" ) ) {
                            for ( $file_idx = 0; $file_idx < $zip_file->numFiles; $file_idx++ ) {
                                $file_name = $zip_file->getNameIndex( $file_idx );
                                // Skip directories.
                                if ( '/' === substr( $file_name, -1 ) ) {
                                    continue;
                                }
                                // Skip the __MACOSX directory.
                                if ( '__MACOSX/' === substr( $file_name, 0, 9 ) ) {
                                    continue;
                                }
                                $data_one = $zip_file->getFromIndex( $file_idx );
                                if ( false === $data_one ) {
                                    continue;
                                }
                                $extension = '';
                                if( class_exists( 'SplFileInfo', false ) ) {
                                    $info = new \SplFileInfo( $file_name );
                                    $extension = $info->getExtension();
                                }

                                $data[$file_idx] = [$extension, $data_one];
                            };
                            $zip_file->close();
                        } else {
                            @unlink( $uploaddir. '/' . $file['name'] );
                        }
                    }
                    @unlink( $uploaddir. '/' . $file['name'] );
                }

                rmdir( $uploaddir );

                $data = $data && is_array( $data ) && count( $data ) > 0 ? ['success', $data] : ['unsuccess', 'failed to process file'];

                die( json_encode( $data ) );
            } else {
                die( json_encode( ['unsuccess', 'PHP Zip Archive Parser is unavailable'] ) );
            }
        } else {
            die( json_encode( ['unsuccess', 'Security problem'] ) );
        }
    }


    /**
     * Check permission if able to process
     *
     * @since 1.1.6
     *
     * @return void
     */
    public function permission_check() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( __( 'Missing permission for you.', 'wp-table-builder' ) );
        }
    }

    /**
     * Adds functions to event handlers and filtering functionsc
     * for displaying necessary content.
     *
     * @since 1.1.6
     */
    public function import_from_table_press() {

        if( ! class_exists( 'TablePress' ) ) {
            wp_die( json_encode( ["unsuccess", "TablePress is not installed"] ) );
        }

        $table_press_option = get_option( 'tablepress_tables' );

        if( $table_press_option === false ) {
            wp_die( json_encode( ["unsuccess", "There are no tables created in TablePress"] ) );
        } else {
            $table_press_option = json_decode( $table_press_option, true );

            if( ! is_array( $table_press_option ) ||
                ! array_key_exists( 'table_post', $table_press_option ) ||
                ! is_array( $table_press_option['table_post'] )) {

                wp_die( json_encode( ["unsuccess", "Import Problems"] ) );

            }

            $table_post = $table_press_option['table_post'];

            if( count( $table_post ) == 0 ) {
                wp_die( json_encode( ["unsuccess", "There are no tables created in TablePress"] ) );
            }

            $data = array();
            foreach ( $table_post as $table_id => $post_id ) {
                $table_id = ( string ) $table_id;

                $post_id = ( string ) $post_id;
                $post = get_post( $post_id );
                $table_content = '';
                if( $post && is_object( $post ) && property_exists( $post, 'post_content' ) ) {
                    $table_content = $post->post_content;
                    $table_content = json_decode( $table_content );
                    if( ! $table_content ) $table_content = '';

                    if( $table_content && is_array( $table_content ) ) {
                        $pattern = get_shortcode_regex();
                        for( $i = 0; $i < count( $table_content ); $i++ ) {
                            $row_content = $table_content[$i];
                            if( $row_content && is_array( $row_content ) ) {
                                for ( $j = 0; $j < count( $row_content ); $j++ ) {
                                    $td_content = $row_content[$j];

                                    if ( $td_content && preg_match_all( '/'. $pattern .'/s', $td_content, $matches ) ) {

                                        for( $k = 0; $k < count( $matches[0] ); $k++ ) {
                                            $td_content = str_replace( $matches[0][$k] ,
                                                '<wptb_shortcode_container_element>' . $matches[0][$k] . '</wptb_shortcode_container_element>' ,
                                                $td_content );
                                        }

                                        $table_content[$i][$j] = $td_content;
                                    }
                                }
                            }
                        }
                    }
                }

                $data[] = ['[table id=' . $table_id . ' /]', $table_content];
            }


            wp_die( json_encode( ["success", $data] ) );
        }
    }

    /**
     * Check if the current page request meets the requirements for the table preview page.
     *
     * @since 1.0.1
     *
     * @return bool
     */
    public function is_import_iframe_page() {

        // if this is a preview page, then continue
        if ( ( ! isset( $_GET['post_type'] ) || empty( $_GET['post_type'] ) ) ||
            ( ! isset( $_GET['shortcode'] ) || empty( $_GET['shortcode'] ) ) ) {
            return false;
        } elseif ( sanitize_text_field( $_GET['post_type'] ) !== 'wptb-tables-import' ) {
            return false;
        }

        // if the user is authorized and if user rights are valid
        if ( ! is_user_logged_in() || ! Helpers::wptb_current_user_can() ) {
            return false;
        }

        // Check nonce
        if ( ! isset( $_GET['_wpnonce'] ) || empty( $_GET['_wpnonce'] ) ) {
            return false;
        }
        $nonce = sanitize_text_field( $_GET['_wpnonce'] );
        if ( ! $nonce || ! wp_verify_nonce( $nonce, 'wptb-import-security-nonce' ) ) {
            return false;
        }

        return true;

    }

    /**
     * Adds functions to event handlers and filtering functions
     * for displaying necessary content.
     *
     * @since 1.1.6
     */
    public function hooks() {

        add_action( 'pre_get_posts', array( $this, 'pre_get_posts' ) );

        //add_filter( 'the_title', array( $this, 'the_title' ), 100 );

        add_filter( 'the_content', array( $this, 'the_content' ), 999 );

        add_filter( 'get_the_excerpt', array( $this, 'the_content' ), 999 );

        add_filter( 'template_include', array( $this, 'template_include' ) );

        add_filter( 'post_thumbnail_html', '__return_empty_string' );

    }

    /**
     * Modify query, limit for one post.
     *
     * @since 1.0.1
     *
     * @param $query The WP_Query instance.
     */
    public function pre_get_posts( $query ) {

        if ( $_GET['post_type'] && $query->is_main_query() ) {
            $query->set( 'posts_per_page', 1 );
        }
    }

    /**
     * Change page title for table preview
     *
     * @since 1.0.1
     *
     * @param string $title Page title.
     *
     * @return string
     */
    public function the_title( $title ) {

        if( ( is_singular( 'post' ) || is_singular( 'page' ) ) && in_the_loop() ) {
            $title = sprintf(
                esc_html__( '%s Preview', 'wp-table-builder' ),
                ! empty( $this->table_data->post_title ) ? sanitize_text_field( $this->table_data->post_title ) : esc_html__( 'Table', 'wp-table-builder' )
            );
        }

        return $title;

    }

    /**
     * Change page content for table preview.
     *
     * @since 1.1.6
     *
     * @return string
     */
    public function the_content() {

        return do_shortcode( sanitize_text_field( $_GET['shortcode'] ) );

    }

    /**
     * Forced inclusion of page templates.
     *
     * @since 1.1.6
     *
     * @return array
     */
    public function template_include() {

        return locate_template( array( 'single.php', 'singular.php', 'index.php' ) );

    }
}