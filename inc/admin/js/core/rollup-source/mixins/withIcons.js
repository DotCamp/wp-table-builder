/**
 * Mixin for WPTB_IconManager icon fetch operation.
 *
 * @param {Array | string} iconList icon list
 * @return {Function} mixin object
 */
export default function (iconList) {
	if (!Array.isArray(iconList)) {
		// eslint-disable-next-line no-param-reassign
		iconList = [iconList];
	}

	const dataObject = iconList.reduce(
		(carry, item) => {
			// eslint-disable-next-line no-param-reassign
			carry.icons[item] = '';

			return carry;
		},
		{ icons: {} }
	);

	return {
		data() {
			return dataObject;
		},
		mounted() {
			this.$nextTick(() => {
				// eslint-disable-next-line array-callback-return
				Object.keys(this.icons).map((name) => {
					if (Object.prototype.hasOwnProperty.call(this.icons, name)) {
						WPTB_IconManager.getIcon(name, 'wptb-svg-inherit-color', true).then((icon) => {
							this.icons[name] = icon;
						});
					}
				});
			});
		},
	};
}
