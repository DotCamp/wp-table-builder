import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import TableBlock from './components/TableBlock';
import blockStyle from './style/block-style.sass';

const blockData = { ...wptbBlockData };

wptbBlockData = undefined;

registerBlockType(blockData.blockName, {
	title: __('WP Table Builder', 'wp-table-builder'),
	description: __('WP Table Builder editor block', 'wp-table-builder'),
	category: 'widgets',
	icon: 'megaphone',
	attributes: {
		id: {
			type: 'Number',
			default: '-1',
		},
		expanded: {
			type: 'Boolean',
			default: 'true',
		},
	},
	edit: withSelect((select) => {
		return {
			tables: select('core').getEntityRecords('postType', 'post', { per_page: -1 }),
		};
	})(({ tables, attributes, setAttributes }) => {
		// TODO [erdembircan] remove for production
		console.log(tables);
		return <TableBlock setAttributes={setAttributes} expanded={attributes.expanded} id={attributes.id} />;
	}),
});
