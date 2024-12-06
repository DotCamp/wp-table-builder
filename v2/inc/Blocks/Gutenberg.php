<?php

namespace WPTableBuilder\Blocks;

class Gutenberg
{

	public static function render($block, $content)
	{
		if (!isset($block['id']) || !$block['id']) {
			return do_shortcode($content);
		}
		return do_shortcode('[wptb id="' . $block['id'] . '"]');
	}
	public static function init()
	{
		$json = WPTB_PLUGIN_DIR . '/build/block.json';
		register_block_type_from_metadata(
			$json,
			[
				'attributes' => json_decode(file_get_contents($json), true)['attributes'],
				'render_callback' => [self::class, 'render'],
			]
		);
	}
}