import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import React from 'react';
import TableBlockApp from './containers/TableBlockApp';
// eslint-disable-next-line no-unused-vars
import blockStyle from './style/block-style.sass';

const blockData = { ...wptbBlockData };

wptbBlockData = undefined;

registerBlockType(blockData.blockName, {
	title: __('WP Table Builder', 'wp-table-builder'),
	description: __('WP Table Builder editor block', 'wp-table-builder'),
	category: 'widgets',
	icon: 'editor-table',
	attributes: {
		id: {
			type: 'number',
			default: '-1',
		},
	},
	transforms: {
		from: [
			{
				type: 'shortcode',
				tag: 'wptb',
				attributes: {
					id: {
						type: 'number',
						shortcode: ({ named }) => {
							return Number.parseInt(named.id, 10);
						},
					},
				},
				priority: 1,
			},
		],
	},
	edit: ({ attributes, setAttributes }) => {
		return <TableBlockApp attributes={attributes} setAttributes={setAttributes} blockData={blockData} />;
	},
	save: ({ attributes }) => {
		return attributes.id >= 0 ? `[wptb id=${attributes.id}]` : '';
	},
});
