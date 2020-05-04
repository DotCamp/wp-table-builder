<?php

namespace WP_Table_Builder\Inc\Common\Traits;

/**
 * Trait Ajax_Response
 *
 * PHP trait for ajax responses
 *
 * @package WP_Table_Builder\Inc\Common\Traits
 */
trait Ajax_Response {
	/**
	 * response data
	 *
	 * @var array
	 */
	private $response_data = [];

	/**
	 * Set message for ajax response
	 *
	 * @param string $message message to be sent
	 */
	public function set_message( $message ) {
		$this->response_data['message'] = $message;
	}

	/**
	 * Set error message for ajax response
	 *
	 * @param string $error error message to be sent
	 */
	public function set_error( $error ) {
		$this->response_data['error'] = $error;

	}

	/**
	 * Send response data as a json format
	 *
	 * @param bool $die close connection after sending data
	 */
	public function send_json( $die = true ) {
		echo json_encode( $this->response_data );

		if ( $die ) {
			die();
		}
	}

	public function append_response_data( $data, $key ) {
		if ( ! isset( $this->response_data['data'] ) ) {
			$this->response_data['data'] = [];
		}

		$this->response_data['data'] = [ $key => $data ];

	}
}
