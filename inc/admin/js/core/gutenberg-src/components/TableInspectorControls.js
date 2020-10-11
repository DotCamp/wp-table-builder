import React, { Fragment } from 'react';
import { InspectorControls } from '@wordpress/block-editor';
import { Panel, PanelBody, PanelRow } from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import TableBlockInfoItem from './TableBlockInfoItem';

export default function TableBlockInspector({ header, table }) {
	return (
		<InspectorControls>
			<Panel>
				<PanelBody title={header} initialOpen={true}>
					{table ? (
						<Fragment>
							<TableBlockInfoItem label={__('ID', 'wp-table-builder')} value={table.id} />
							<TableBlockInfoItem label={__('title', 'wp-table-builder')} value={table.title} />
							<TableBlockInfoItem
								label={__('shortcode', 'wp-table-builder')}
								value={`[wptb id=${table.id}]`}
							/>
							<TableBlockInfoItem
								label={_x('tags', 'modified date', 'wp-table-builder')}
								value={
									table.wptb_table_tags.length > 0
										? table.wptb_table_tags.map((t) => t.name).join(',')
										: __('No Tags', 'wp-table-builder')
								}
							/>
							<TableBlockInfoItem
								label={_x('Modified at', 'modified date', 'wp-table-builder')}
								value={new Intl.DateTimeFormat('default').format(new Date(table.modified))}
							/>
						</Fragment>
					) : (
						<PanelRow>
							<i>{__('no table selected', 'wp-table-builder')}</i>
						</PanelRow>
					)}
				</PanelBody>
			</Panel>
		</InspectorControls>
	);
}
