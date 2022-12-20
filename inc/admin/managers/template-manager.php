<?php

namespace WP_Table_Builder\Inc\Admin\Managers;

use WP_Table_Builder\Inc\Common\Traits\Init_Once;
use WP_Table_Builder\Inc\Common\Traits\Singleton_Trait;
use WP_Table_Builder\Inc\Core\Init;
use WP_Table_Builder as NS;
use function add_filter;
use function trailingslashit;

/**
 * Template manager.
 */
class Template_Manager
{
	use Init_Once;
	use Singleton_Trait;

	/**
	 * Function to be called during initialization process.
	 */
	public static function init_process($options)
	{
		$instance = static::get_instance($options);
		add_filter('wp-table-builder/filter/generate_data', [$instance, 'prepare_template_frontend_data'], 10, 1);

		Frontend_Data_Manager::add_builder_translations($instance->template_translations());
	}

	/**
	 * Add frontend translation strings.
	 * @return array translations
	 */
	private function template_translations()
	{
		return [
			'table' => esc_htmL__('table', 'wp-table-builder'),
			'template' => esc_htmL__('template', 'wp-table-builder'),
			'templates' => esc_htmL__('templates', 'wp-table-builder'),
			'saveAs' => esc_htmL__('save', 'wp-table-builder'),
			'saveTable' => esc_htmL__('save', 'wp-table-builder'),
			'saveTemplate' => esc_htmL__('save template', 'wp-table-builder'),
		];
	}

	/**
	 * Add template related frontend data to generate menu.
	 *
	 * @param array $generate_data generate menu data.
	 *
	 * @return array generate menu data
	 */
	public function prepare_template_frontend_data($generate_data)
	{
		// only load up template files if user is on free plan
		if (!Addon_Manager::check_pro_status()) {
			$template_file_path = $this->get_class_options()['template_file_path'];
			$templates = $this->read_template_file($template_file_path);

			$generate_data['prebuiltTables'] = $templates;

			$generate_data['icons'] = [
				'favIcon' => Init::instance()->get_icon_manager()->get_icon('star'),
				'deleteIcon' => Init::instance()->get_icon_manager()->get_icon('trash-alt'),
				'checkIcon' => Init::instance()->get_icon_manager()->get_icon('check-circle'),
				'crossIcon' => Init::instance()->get_icon_manager()->get_icon('times-circle'),
			];

			$generate_data['dummyProCss'] = trailingslashit(NS\WP_TABLE_BUILDER_URL) . 'inc/admin/css/dummy-pro.css';
		} else {
			$generate_data['dummyProCss'] = null;
		}

		return $generate_data;
	}

	private function read_template_file($path)
	{
		$ini_val = ini_get('auto_detect_line_endings');

		// set line ending ini setting
		if (!$ini_val) {
			ini_set('auto_detect_line_endings', true);
		}

		$csv = [];

		// open target file for read
		$f_handler = fopen($path, 'r');
		if ($f_handler) {
			$header = fgetcsv($f_handler, 8000);

			while (($data = fgetcsv($f_handler)) !== false) {
				$new_row = [];

				foreach ($header as $index => $column_name) {
					$new_row[$column_name] = $data[$index];
				}

				$csv[] = $new_row;
			}
		}

		// close file pointer
		fclose($f_handler);

		$return_array = [];

		// prepare data
		foreach ($csv as $template) {
			$title = $template['name'];
			$id = $template['id'];
			$content = $template['content'];

			$return_array[$id] = ['title' => $title, 'content' => $content];
		}

		// revert ini setting
		if (!$ini_val) {
			ini_set('auto_detect_line_endings', false);
		}

		return $return_array;
	}
}