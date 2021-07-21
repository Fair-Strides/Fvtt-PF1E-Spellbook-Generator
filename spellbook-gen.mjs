import { module, getLink, actorName } from './module/common.mjs';
import { SpellBookGenUI } from './module/dialog.mjs';

/** Logic */
export async function showSpellBookGenUI(_, actor) {
	const activeWindow = Object.values(ui.windows).find(k => k.constructor.name === 'SpellBookGenUI' && k.object === actor);
	activeWindow?.bringToTop() ?? SpellBookGenUI.open(actor);
}

function injectSpellBookButton(sheet, buttons) {
	if (!sheet.isEditable) return;

	buttons.unshift({
		class: 'spell-gen-button',
		icon: 'fab fa-leanpub',
		label: game.i18n.localize('FSWorkshop.SpellBookGenerator.Title'),
		onclick: async (ev) => showSpellBookGenUI(ev, sheet.actor),
	});
}

Hooks.once('ready', () => {
	game.modules.get(module).api = { showSpellBookGenUI }

	Hooks.on('getActorSheetPFHeaderButtons', injectSpellBookButton);
});
