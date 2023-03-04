<?php

use WP_Table_Builder as NS;
use WP_Table_Builder\Inc\Admin\Database_Updater;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

?>
<div class="wptb-menu-page-wrapper">WPTB Database Updater</div>
<div>
	<ul>
		<?php
			$tables = (new Database_Updater())->get_tables();
			$DOMDocs = [];

			foreach ($tables as $table) {
				$DOMDocs[] = new DOMDocument(get_post_meta($table->ID, '_wptb_content_', true ));
			}

			foreach ($DOMDocs as $doc):
		?>
			<li>
				<?php echo esc_html(print_r($doc, true)); ?>
			</li>
		<?php endforeach; ?>
	</ul>
</div>
