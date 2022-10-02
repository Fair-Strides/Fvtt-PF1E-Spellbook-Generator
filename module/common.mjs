export const spellFlags = {
	module: 'fair-strides-pf1e-spellbook-generator',
	actorKey: 'spellBookGen',
	keymaster: 'fsworkshop',
	defaultLink: '_linkedCaster'
};

/** @returns {String} */
export const actorName = (a) => game.user.isGM ? `${a.name} [${a.id}]` : `${a.id}`;


/** @returns {undefined|String} */
export function getLink(actor) {
	const flag = actor.getFlag(spellFlags.module, spellFlags.actorKey);
	if(flag) return duplicate(flag);
}

export const setLink = async (actor, linkData) => actor?.setFlag(spellFlags.module, spellFlags.actorKey, linkData);
export const delLink = async (actor) => actor?.unsetFlag(spellFlags.module, spellFlags.actorKey);

export const spellCosts = {'0': 5, '1': 10, '2': 40, '3': 90, '4': 160, '5': 250, '6': 360, '7': 490, '8': 640, '9': 810};
export const spellSells = {'0': 2.5, '1': 5, '2': 20, '3': 45, '4': 80, '5': 125, '6': 180, '7': 245, '8': 320, '9': 405};
export const spellPages = {'0': 1, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9};