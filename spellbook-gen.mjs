import { spellFlags, getLink, actorName } from './module/common.mjs';
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

// Do anything after initialization but before ready
Hooks.once("setup", function() {
    game.settings.register(spellFlags.module, "spellbook", {
		name: "Spellbook Data",
        hint: "The world's saved spellbook progress that is not tied to an Actor.",
        default: null,
        scope: "world",
        type: Object,
        config: false
	});

	game.settings.register(spellFlags.module, "flushBook", {
		name: "Clear Spellbook Data",
        hint: "Deletes the world's saved spellbook progress",
        default: false,
        scope: "world",
        type: Boolean,
        config: true,
        onChange: _ => function() { game.settings.set(spellFlags.module, "spellbook", null); }
	})
});

Hooks.once('ready', () => {
	game.modules.get(spellFlags.module).api = { showSpellBookGenUI }

	Hooks.on('getActorSheetPFHeaderButtons', injectSpellBookButton);
});
