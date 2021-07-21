export const module = 'fair-strides-pf1e-spellbook-generator',
	actorKey = 'spellBookGen',
	oldLinkKey = 'actorId',
	keymaster = 'fsworkshop',
	defaultLink = '_linkedCaster';

/**
 * Foundry 0.7.x compatibility mode.
 */
 export var foundry07Compatibility = false;
 Hooks.once('init', () => {
	 foundry07Compatibility = game.data.version.split('.', 3)[1] === '7';
	 if (foundry07Compatibility) console.log("ITEM HINTS | Compatibility Mode | Foundry 0.7.x");
 });

/** @returns {String} */
export const actorName = (a) => game.user.isGM ? `${a.name} [${a.id}]` : `${a.id}`;

/** @returns {undefined|String} */
export function getOldLink(actor) {
	return getProperty(actor.data.flags, `${keymaster}.${oldLinkKey}`)
}

/** @returns {undefined|String} */
export const getLink = (actor) => actor.getFlag(module, actorKey);
export const setLink = async (actor, linkData) => actor?.setFlag(module, actorKey, linkData);
export const delLink = async (actor) => actor.unsetFlag(module, actorKey);

export function delOldLink(actor) {
	const okey = `flags.${keymaster}.-=${oldLinkKey}`;
	return actor.update({ [okey]: null, });
}

export const spellCosts = {'0': 5, '1': 10, '2': 40, '3': 90, '4': 160, '5': 250, '6': 360, '7': 490, '8': 640, '9': 810};
export const spellSells = {'0': 2.5, '1': 5, '2': 20, '3': 45, '4': 80, '5': 125, '6': 180, '7': 245, '8': 320, '9': 405};
export const spellPages = {'0': 1, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9};