import { spellFlags, getLink, setLink, delLink, spellCosts, spellSells, spellPages } from './common.mjs';

const template = 'modules/fair-strides-pf1e-spellbook-generator/template/dialog.hbs';  // Main Interface
const template2 = 'modules/fair-strides-pf1e-spellbook-generator/template/dialogCreate.hbs'; // Book Creation Checklist

Hooks.once('init', () => loadTemplates([template, template2]));

const spellBookPack = 'pf-content\.pf-items';
const spellBookIdCompact = 'g7Q6TmbUndATmjl8';
const spellBookIdNormal = 'gfa1NtiKRA70XJPj';
const spellBookIdTravel = 'LsbmGQ3QMmdnErEK';
const formulaBookIdNormal = 'UGKUUw1904OBj7IW';
const formulaBookIdTravel = 'LgZ1GA2oQ5coYtMU';

export class SpellBookGenUI extends FormApplication {
	linked = undefined;
	linkedId = undefined;
	linkName = undefined;
	linkData = undefined;
	linkedClass = '';
	linkLevel = 0;
	spellBook = undefined;
	statsHidden = true;

	constructor(object, options) {
		super(object, options);

		this.options.title = this.object ? game.i18n.localize('FSWorkshop.SpellBookGenerator.TitleBar').format(this.object?.name) : game.i18n.localize('FSWorkshop.SpellBookGenerator.Title');
		this.options.classes.push(`spellbook-gen-id-${this.object?.id}`);
		this.linkedId = undefined;
		this.linked = undefined;
		this.linkName = undefined;
		this.linkedClass = '';
		this.linkLevel = 0;
		this.spellBook = {
			spells: {},
			spellsTotal: 0,
			pagesTotal: 0,
			booksTotal: 0,
			price: 0,
			value: 0,
			spells0: 0,
			spells1: 0,
			spells2: 0,
			spells3: 0,
			spells4: 0,
			spells5: 0,
			spells6: 0,
			spells7: 0,
			spells8: 0,
			spells9: 0
		};
		this.statsHidden = true;
		
		this.linkData = { id: undefined, name: spellFlags.defaultLink };
		if(object !== null) {
			this._linkActor(object.id);
		}
	}

	static open(actor) {
		new SpellBookGenUI(actor).render(true);
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['fsworkshop', 'fsworkshop-spellbook-gen'],
			template: template,
			renderUpdateKeys: ['linkedId', 'linked', 'linkedImg', 'spells'],
			width: 480,
			height: 650,
			resizable: true,
			dragDrop: [{ dropSelector: null }],
			closeOnSubmit: true
		});
	}

	async getData(options = {}) {
		let data = super.getData(options);

		data.isGM = game.user.isGM;

		if(this.object !== null && this.linkData?.spellsTotal !== 0) {
			this.linkData = getLink(this.object);
		}
				
		data.actor = this.actor;
		data.linkedId = this.linkedId = this.linkData?.id;
		data.linked = this.linked = game.actors.get(this.linkedId);
		data.linkName = this.linkName = this.linkData?.name;
		data.linkedImg = this.linkedImg = this.linked?.img ?? this.linked?.token?.img ?? CONST.DEFAULT_TOKEN;
		data.linkedClass = this.linkedClass;
		data.linkLevel = this.linkLevel;
		data.linkSpellLevel = 'level' + this.linkLevel;
		data.linkData = this.linkData;

		//data.validActorChoices = game.user.isGM ? [] : [null, ...game.actors.filter(o => o.owner)];
		let actorChoices = { '': '' };
		if (!data.isGM) {
			game.actors
				.filter(o => o.owner && o.id !== this.object.id)
				.forEach(o => actorChoices[o.id] = `${o.name} [${o.id}]`);
		}
		data.validActorChoices = actorChoices;

		let classChoices = { '': '' };
        let classChoices2 = Object.entries(this.linked?.classes ?? {});
        for(let [key, cls] of classChoices2)
        {
        	classChoices[key] = cls.name;
        }
		data.validClassChoices = classChoices;

		let spellLevelChoices = {
			'level0': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel0'),
			'level1': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel1'),
			'level2': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel2'),
			'level3': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel3'),
			'level4': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel4'),
			'level5': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel5'),
			'level6': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel6'),
			'level7': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel7'),
			'level8': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel8'),
			'level9': game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel9'),
		};
		data.spellLevelChoices = spellLevelChoices;

		data.spells = this.spellBook.spells;
		data.spellBook = this.spellBook;

		data.statsHidden = this.statsHidden;
		return data;
	}

	/**
	 * @param {String} actorId
	 */
	async _linkActor(actorId) {
//		if (this.object.id === actorId) return; // Don't allow linking to self.

		let linkedActor = game.actors.get(actorId);
		if (linkedActor) {
			if (!this.linkData) this.linkData = { id: undefined, name: spellFlags.defaultLink };//, spellsTotal: 0, pagesTotal: 0, booksTotal: 0, price: 0, value: 0, spells0: 0, spells1: 0, spells2: 0, spells3: 0, spells4: 0, spells5: 0, spells6: 0, spells7: 0, spells8: 0, spells9: 0 };

			this.linkData.id = actorId;
			this.object = linkedActor;

			await setLink(this.object, this.linkData);
			this.linked = linkedActor;
			this.linkedId = actorId;
			this.linkedClass = undefined;

			this.options.title = game.i18n.localize('FSWorkshop.SpellBookGenerator.TitleBar').format(this.object.name);			
		} else {
			console.error('SPELLBOOK GENERATOR | Linked actor', actorId, 'not found!');
		}

		return this.render(false);
	}

	async _linkName(linkName) {
		const rollData = this.object.getRollData();
		if (linkName in rollData) return; // disallow conflcits

		this.linkData.name = linkName;
		this.linkName = linkName;

		await setLink(this.object, this.linkData);
	}

	async onUnlink(_event) {
		if (this.linkedId !== null) {
			await delLink(this.object);
			this.object = null;
			this.linked = undefined;
			this.linkedId = null;
			this.linkName = undefined;
			this.linkedClass = '';
			this.linkLevel = 0;
			this.linkData.id = null;
			this.options.title = game.i18n.localize('FSWorkshop.SpellBookGenerator.Title');
			
			return this.render(true);
		}
	}

	async _onDrop(event) {
		let data;
		try {
			data = JSON.parse(event.dataTransfer.getData('text/plain'));
		} catch (err) {
			console.error(err);
			return false;
		}

		let dataArray = data.uuid.split(".");
		
		if (data.type === 'Actor') {
			this._linkActor(dataArray[1]);
		}
		else {
			if(data.type === 'Item')
			{
				const pack = game.packs.get(dataArray[1] + "." + dataArray[2]);
				const index = await pack.getDocument(dataArray[3]);
				let spell = await game.items.fromCompendium(index);

				if(spell.type !== 'spell')
				    return false;

				let spellName = spell.name.replace(/\s/g, '');
				
				if("spell" + spellName in this.spellBook.spells) { return; } // Spell has already been added!
				
				let spellText = '@UUID[Compendium.' + dataArray[1] + '.' + dataArray[2] + '.' + dataArray[3] + ']{' + spell.name + '}\n';
				let spellLevel = -1;
				
				if(this.linkedClass !== '' && this.linkedClass !== undefined) {
					this.linkedClass = this.linkedClass.toLowerCase();
					let spellClasses = Object.entries(spell.data.learnedAt.class);
					for(let [cls, level] of spellClasses) {
						let boolTest = level[0].includes(this.linkedClass);
						if(boolTest) {
							spellLevel = level[1];
							this.linkedClass = this.linkedClass[0].toUpperCase() + this.linkedClass.substring(1);
							break;
						}
						else {
							spellLevel = -1;
						}
					}
				}
				
				if(spellLevel === -1) {
					let spellClasses = Object.entries(spell.system.learnedAt.class);
					let classNumber = 0;
				    spellLevel = 0;
					for(let [cls, level] of spellClasses) {
						classNumber++;
						spellLevel += level[1];
					}

					spellLevel = Math.max(0, Math.floor(spellLevel / classNumber));
				}

				this.spellBook.pagesTotal += spellPages[spellLevel];
				
				this.spellBook.spellsTotal += 1;
				this.spellBook.booksTotal = Math.ceil(this.spellBook.pagesTotal / 100);
				this.spellBook.price += spellCosts[spellLevel];
				this.spellBook.value += spellSells[spellLevel];

				if(spellLevel === 0) { this.spellBook.spells0 += 1; }
				if(spellLevel === 1) { this.spellBook.spells1 += 1; }
				if(spellLevel === 2) { this.spellBook.spells2 += 1; }
				if(spellLevel === 3) { this.spellBook.spells3 += 1; }
				if(spellLevel === 4) { this.spellBook.spells4 += 1; }
				if(spellLevel === 5) { this.spellBook.spells5 += 1; }
				if(spellLevel === 6) { this.spellBook.spells6 += 1; }
				if(spellLevel === 7) { this.spellBook.spells7 += 1; }
				if(spellLevel === 8) { this.spellBook.spells8 += 1; }
				if(spellLevel === 9) { this.spellBook.spells9 += 1; }
				
				this.spellBook.spells["spell" + spellName] = {
					name: spell.name,
					text: spellText,
					level0: false,
					level1: false,
					level2: false,
					level3: false,
					level4: false,
					level5: false,
					level6: false,
					level7: false,
					level8: false,
					level9: false,
					checked: false
				};
				
				this.spellBook.spells["spell" + spellName]["level" + spellLevel] = true;
								
				if(this.linkLevel !== spellLevel)
				{
					document.getElementById('level' + parseInt(this.linkLevel) + '-list').style.display = 'none';
					document.getElementById('spellLevelSelect').selectedIndex = spellLevel;
					document.getElementById('spellLevelSelect').value = 'level' + spellLevel; //game.i18n.format('FSWorkshop.SpellBookGenerator.spellLevel' + spellLevel);
					document.querySelector('#spellLevelSelect [value="level' + spellLevel + '"]').selected  = true;
					document.getElementById('level' + parseInt(spellLevel) + '-list').style.display = 'block';
					this.linkLevel = spellLevel;
				}

				this.render(true);
			}
		}
	}

	openLinked(_event) {
		let sheet = this.linked?.sheet;
		if (sheet) {
			if (sheet.rendered) {
				sheet.maximize();
				sheet.bringToTop();
			}
			else sheet.render(true);
		}
	}

	onSelectChange(event) {
		let newId = event.target.value;
		if (newId?.length > 0)
			this._linkActor(newId);
		else
			this.onUnlink(event);
	}
	
	onSpellLevelChange(event) {
		console.log('PF1E SPELLBOOK GENERATOR | Event ');
		console.log(event);
		let newLevel = event.target.value;
		newLevel = parseInt(newLevel.slice(-1));
		this.linkLevel = newLevel;
		for(let i = 0; i < 10; i++) {
			if(i === newLevel) {
				document.getElementById('level' + parseInt(newLevel) + '-list').style.display = 'block';
			}
			else {
				document.getElementById('level' + parseInt(i) + '-list').style.display = 'none';
			}
		}
	}
	
	onClassChange(event) {
		this.linkedClass = event.target.value;
	}

	onStatsBook(event) {
		//SpellBookGenStatsUI.open(this);
		const result = document.getElementById('spellStats').classList.toggle('fsHidden');
		this.statsHidden = result;
		
		if(result) {
			this.options.width = 480;
		}
		else {
			this.options.width = 800;
		}
		
		this.render(true, {width: this.options.width});
	}
	
	onCreateBook(event) {
		let spellLists = [];

		let spellTextString = '';
		for(let i = 0; i < 10; i++) {
			for(let spell in this.spellBook.spells) {
				if(this.spellBook.spells[spell]["level" + i]) { spellTextString += this.spellBook.spells[spell].text; }
			}
			
			spellLists.push(spellTextString);
			spellTextString = '';
		}
		
		SpellBookGenCreateUI.open(this, this.spellBook, spellLists);
	}

	async _updateObject(event, formData) {
		super._updateObject(event, formData);
//		formData["_id"] = this.object._id;
//		this.form.update(formData);
	}
	
	onCancelBook(event) {
		this.close();
	}
	
	async _onSubmit(event, updateData, preventClose, preventRender) {
//		if(event.submitter.name !== 'spellBookCancel')
//		{
			event.preventDefault();
//		}
//		super._onSubmit(event, updateData, preventClose, preventRender);
	}
	
	async browseSpells() {
		pf1.applications.compendiums["spells"].render(true, { focus: true });
	}
	
	async toggleSpell(event) {
		let spellName = event.target.name.replace(/\s/g, '');

		this.spellBook.spells["spell" + spellName].checked = event.target.checked;
	}
	
	async checkSpells() {
		Object.values(this.spellBook.spells).filter(item => item["level" + this.linkLevel]).forEach( spell => {
			spell.checked = true;
		});
/*		for(let spell in this.spellBook.spells) {
			if(this.spellBook.spells[spell]["level" + this.linkLevel]) {
				this.spellBook.spells[spell].checked = true;
			}
		}
*/
		this.render();
	}
	
	async uncheckSpells() {
		Object.values(this.spellBook.spells).filter(item => item["level" + this.linkLevel]).forEach( spell => {
			spell.checked = false;
		});
		this.render();
	}
	
	async addLevelSpells() {
		Object.values(this.spellBook.spells).filter(item => item.checked).forEach( spell => {
			let spellLevel = this.linkLevel;
				for(let i = 0; i < 10; i++) {
					if(spell["level" + i] === true) { spellLevel = i; }
					spell["level" + i] = false;
				}
				
				if(spellLevel === 9) { spell["level" + spellLevel] = true; return; }
				
				spell["level" + (spellLevel + 1)] = true;
				
				this.spellBook.pagesTotal += (spellPages[spellLevel + 1] - spellPages[spellLevel]);
				this.spellBook.price += (spellCosts[spellLevel + 1] - spellCosts[spellLevel]);
				this.spellBook.value += (spellSells[spellLevel + 1] - spellSells[spellLevel]);
				this.spellBook["spells" + spellLevel] -= 1;
				this.spellBook["spells" + (spellLevel + 1)] += 1;
		});

		this.render();
	}
	
	async subLevelSpells() {
		Object.values(this.spellBook.spells).filter(item => item.checked).forEach( spell => {
			let spellLevel = this.linkLevel;
				for(let i = 0; i < 10; i++) {
					if(spell["level" + i] === true) { spellLevel = i; }
					spell["level" + i] = false;
				}
				
				if(spellLevel === 0) { spell["level" + spellLevel] = true; return; }
				
				spell["level" + (spellLevel - 1)] = true;
				
				this.spellBook.pagesTotal += (spellPages[spellLevel - 1] - spellPages[spellLevel]);
				this.spellBook.price += (spellCosts[spellLevel - 1] - spellCosts[spellLevel]);
				this.spellBook.value += (spellSells[spellLevel - 1] - spellSells[spellLevel]);
				this.spellBook["spells" + spellLevel] -= 1;
				this.spellBook["spells" + (spellLevel - 1)] += 1;
		});

		this.render(true);
	}
	
	async removeSpells() {
		let arrSpells = Object.values(this.spellBook.spells).filter(spell => spell.checked).forEach(spell => {			
			let spellLevel = parseInt(Object.keys(spell).filter(o => o.includes('level') && spell[o] === true)[0].substring(5), 10);
			let spellKey = Object.keys(this.spellBook.spells).find(key => this.spellBook.spells[key] === spell);
			
			this.spellBook.pagesTotal -= spellPages[spellLevel];
			this.spellBook.spellsTotal -= 1;
			this.spellBook.price -= spellCosts[spellLevel];
			this.spellBook.value -= spellSells[spellLevel];
			this.spellBook["spells" + spellLevel] -= 1;
				
			delete this.spellBook.spells[spellKey];
		});
		
		this.render();
	}
		
	activateListeners(html) {
		super.activateListeners(html);

		html.find('.owner-unlink').on('click', this.onUnlink.bind(this));
		html.find('.owner-link-img').on('click', this.openLinked.bind(this));
		html.find('select[name=bookOwner]').on('change', this.onSelectChange.bind(this));
		html.find('select[name=ownerClass]').on('change', this.onClassChange.bind(this));
		html.find('select[name=spellLevelSelect]').on('change', this.onSpellLevelChange.bind(this));
		html.find('button[name=spellBookCancel]').on('click', this.onCancelBook.bind(this));
		html.find('button[name=spellBookCreate]').on('click', this.onCreateBook.bind(this));
		html.find('button[name=spellBookStats]').on('click', this.onStatsBook.bind(this));
		html.find('button[name=spellBookBrowser]').on('click', this.browseSpells.bind(this));
		
		html.find('button[name=spellBookCheckAll]').on('click', this.checkSpells.bind(this));
		html.find('button[name=spellBookUncheckAll]').on('click', this.uncheckSpells.bind(this));
		
		html.find('button[name=spellBookAddLevel]').on('click', this.addLevelSpells.bind(this));
		html.find('button[name=spellBookSubLevel]').on('click', this.subLevelSpells.bind(this));
		html.find('button[name=spellBookRemoveSpell]').on('click', this.removeSpells.bind(this));
		
		$('.spell').on('click', this.toggleSpell.bind(this));
		
		for(let i = 0; i < 10; i++) {
			document.getElementById('level' + parseInt(i) + '-list').style.display = 'none';
		}
		document.getElementById('level' + this.linkLevel + '-list').style.display = 'block';
	}
}

export class SpellBookGenCreateUI extends FormApplication {
	spellBook = undefined;
	spellBookData = undefined;
	spellLists = undefined;
	spellBookType = 0;
	spellBookPages = 0;
	spellBookTotal = 1;
	spellBookWeight = 1;
	spellBookId = undefined;
	spellBookName = undefined;
	
	constructor(objectBook, objectData, spellLists, options) {
		super(objectBook, options);
		this.options.title = game.i18n.localize('FSWorkshop.SpellBookGenerator.TitleBarCreate');
		this.spellBook = objectBook;
		this.spellBookData = objectData;
		this.spellLists = spellLists;
		this.spellBookTotal = 1;
		this.spellBookType = 0;
	}
	
	static open(spellGenUI, spells, spellLists) {
		new SpellBookGenCreateUI(spellGenUI, spells, spellLists).render(true);
	}
	
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['fsworkshop', 'fsworkshop-spellbook-gen-create'],
			template: template2,
			renderUpdateKeys: ['spellBook', 'spellBookType', 'spellBookTotal'],
			width: 480,
			dragDrop: [{ dropSelector: null }],
			closeOnSubmit: true
		});
	}
	
	async getData(options = {}) {
		let data = super.getData(options);
		
		data.spellBook = this.spellBook;
		data.spellBookTotal = this.spellBookTotal;
		data.spellBookChoices = {'0': 'Compact Spellbook', '1': 'Normal Spellbook', '2': 'Travelling Spellbook', '3': 'Formula Book', '4': 'Travelling Formula Book'};
		data.spellBookType = this.spellBookType;
		data.spellBookData = this.spellBookData;
		return data;
	}
	
	async onCreateBook(event) {
		this.spellBookId = undefined;
		
		switch(this.spellBookType) {
			case 0:
				this.spellBookId = spellBookIdCompact;
				this.spellBookPages = 70;
				this.spellBookWeight = 1;
				this.spellBookName = ' Compact Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			case 1:
				this.spellBookId = spellBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			case 2:
				this.spellBookId = spellBookIdTravel;
				this.spellBookPages = 50;
				this.spellBookWeight = 1;
				this.spellBookName = ' Traveling Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			case 3:
			    this.spellBookId = formulaBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Formula Book';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			case 4:
			this.spellBookId = formulaBookIdTravel;
				this.spellBookPages = 50;
				this.spellBookWeight = 1;
				this.spellBookName = ' Traveling Fomula Book';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			default:
				this.spellBookId = spellBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
		}
		
		const pack = game.packs.get(spellBookPack);
		const index = await pack.getDocument(this.spellBookId);
		let spellBookItem = await game.items.fromCompendium(index);
		
		if(this.spellBookTotal > 1) {
			this.spellBookName += 's';
			spellBookItem.data.price *= this.spellBookTotal;
		}
		
		spellBookItem.data.description.value += '<hr><p><b><u>Pages used:</u></b> ' + parseInt(this.spellBookData.pagesTotal) + '</p><p><b><u>Books carried:</u></b> ' + parseInt(this.spellBookTotal) + '<hr>';

		spellBookItem.data.price += parseInt(this.spellBookData.price);
		spellBookItem.data.weight = this.spellBookWeight * this.spellBookTotal;
		
		console.log('spellbook.linked', this.spellBook.linked);
		if(this.spellBook.linked == null) {
			spellBookItem.data.identifiedName = this.spellBookName;
			spellBookItem.name = this.spellBookName;
		}
		else {
			spellBookItem.data.identifiedName = this.spellBook.linked.name + "'s" + this.spellBookName;
			spellBookItem.name = this.spellBook.linked.data.name + "'s" + this.spellBookName;
		}

		for(let i = 0; i < 10; i++) {
			if(this.spellLists[i] !== '') {
				switch(i) {
					case 0: spellBookItem.data.description.value += '<h2>Cantrips</h2>'; break;
					case 1: spellBookItem.data.description.value += '<h2>1st Level</h2>'; break;
					case 2: spellBookItem.data.description.value += '<h2>2nd Level</h2>'; break;
					case 3: spellBookItem.data.description.value += '<h2>3rd Level</h2>'; break;
					case 4: spellBookItem.data.description.value += '<h2>4th Level</h2>'; break;
					case 5: spellBookItem.data.description.value += '<h2>5th Level</h2>'; break;
					case 6: spellBookItem.data.description.value += '<h2>6th Level</h2>'; break;
					case 7: spellBookItem.data.description.value += '<h2>7th Level</h2>'; break;
					case 8: spellBookItem.data.description.value += '<h2>8th Level</h2>'; break;
					case 9: spellBookItem.data.description.value += '<h2>9th Level</h2>'; break;
				}
				
				spellBookItem.data.description.value += TextEditor.enrichHTML(this.spellLists[i]) + '<br /><br />';
			}
		}
		
		if(this.spellBook.linked == null) {
			Item.create(spellBookItem);
		}
		else {
			this.spellBook.linked.createEmbeddedDocuments("Item", [spellBookItem]);
		}
		this.spellBook.close();
		this.close();
	}
	
	onCancelBook(event) {
		this.close();
	}
	
	onSelectBook(event) {
		console.log(event);
		this.spellBookType = parseInt(event.target.value);

		switch(this.spellBookType) {
			case 0:
				this.spellBookId = spellBookIdCompact;
				this.spellBookPages = 70;
				this.spellBookWeight = 1;
				this.spellBookName = ' Compact Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			case 1:
				this.spellBookId = spellBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			case 2:
				this.spellBookId = spellBookIdTravel;
				this.spellBookPages = 50;
				this.spellBookWeight = 1;
				this.spellBookName = ' Traveling Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			case 3:
			    this.spellBookId = formulaBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Formula Book';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			case 4:
			this.spellBookId = formulaBookIdTravel;
				this.spellBookPages = 50;
				this.spellBookWeight = 1;
				this.spellBookName = ' Traveling Fomula Book';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
				break;
			default:
				this.spellBookId = spellBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);
		}
		
		this.spellBookTotal = Math.ceil(this.spellBookData.pagesTotal / this.spellBookPages);

	    this.render(true);
	}
	
	async _onSubmit(event, updateData, preventClose, preventRender) {
		event.preventDefault();
	}

	activateListeners(html) {
		super.activateListeners(html);
		
		html.find('select[name=spellBookSelect]').on('change', this.onSelectBook.bind(this));
		html.find('button[name=spellCreateCancel]').on('click', this.onCancelBook.bind(this));
		html.find('button[name=spellCreateCreate]').on('click', this.onCreateBook.bind(this));
	}
}