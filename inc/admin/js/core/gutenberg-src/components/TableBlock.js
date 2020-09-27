import React from 'react';

class TableBlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: this.props.expanded,
		};

		this.toggleBlock = this.toggleBlock.bind(this);
		this.slideMain = this.slideMain.bind(this);

		this.mainRef = React.createRef();
	}

	componentDidMount() {
		this.slideMain();
	}

	toggleBlock(e) {
		e.preventDefault();
		this.setState((state) => {
			return { expanded: !state.expanded };
		});
	}

	slideMain() {
		const direction = this.state.expanded ? 'slideDown' : 'slideUp';
		jQuery(this.mainRef.current)[direction]();
	}

	componentDidUpdate() {
		if (this.state.expanded !== undefined) {
			this.slideMain();
			this.props.setAttributes({ expanded: this.state.expanded });
		}
	}

	render() {
		return (
			<div className={'wptb-block-wrapper'}>
				<div className={'wptb-block-header'}>
					<div className={'wptb-plugin-brand'}>WP Table Builder</div>
					<div className={'wptb-header-toolbox'}>
						<div
							className={'wptb-block-toggle dashicons wptb-block-tool'}
							aria-expanded={this.state.expanded}
							onClick={this.toggleBlock}
						/>
					</div>
				</div>
				<div ref={this.mainRef}>
					<div className={'wptb-block-main'}>main</div>
					<div className={'wptb-block-footer'}>footer</div>
				</div>
			</div>
		);
	}
}

export default TableBlock;
