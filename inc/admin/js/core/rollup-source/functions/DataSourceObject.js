/**
 * Data source card object.
 *
 * @param {string} id unique id
 * @param {string} title title
 * @param {string} info information for source
 * @param {string} icon icon
 * @param {boolean} isPro is data source related to pro version
 * @class
 */
function DataSourceObject(id, title, info, icon, isPro = false) {
	this.id = id;
	this.title = title;
	this.info = info;
	this.icon = icon;
	this.pro = isPro;
}

export default DataSourceObject;
