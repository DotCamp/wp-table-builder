/**
 * Column binding options for different table element types.
 *
 * @type {Object}
 */
export const typeOptionList = {
	text: 'text',
	button: ['text', 'link'],
	star_rating: ['rating'],
	image: ['link'],
	circle_rating: ['percentage'],
	text_icon_element: ['text'],
	icon: ['valueColumn'],
};

/**
 * Default mappings for element value binds.
 *
 * @type {Object}
 */
export const defaultMappings = {
	default: ['text'],
	button: ['link'],
	star_rating: ['rating'],
	image: ['link'],
	circle_rating: ['percentage'],
	icon: [''],
};
