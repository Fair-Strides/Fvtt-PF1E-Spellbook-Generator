import { getLink, getOldLink, setLink, delLink, defaultLink, spellCosts, spellSells, spellPages } from './common.mjs';

const template = 'modules/fair-strides-pf1e-spellbook-generator/template/dialog.hbs';  // Main Interface
const template2 = 'modules/fair-strides-pf1e-spellbook-generator/template/dialogStats.hbs'; // Book Stats
const template3 = 'modules/fair-strides-pf1e-spellbook-generator/template/dialogCreate.hbs'; // Book Creation Checklist

Hooks.once('init', () => loadTemplates([template, template2, template3]));

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
	linkClass = '';
	linkLevel = 0;

	constructor(object, options) {
		super(object, options);

		this.options.title = this.object ? game.i18n.localize('FSWorkshop.SpellBookGenerator.TitleBar').format(this.object?.name) : game.i18n.localize('FSWorkshop.SpellBookGenerator.Title');
		this.options.classes.push(`spellbook-gen-id-${this.object?.id}`);
		this.linkedId = undefined;
		this.linked = undefined;
		this.linkName = undefined;
		this.linkClass = '';
		this.linkLevel = 0;
		this.linkData = { id: undefined, name: defaultLink, spellsTotal: 0, pagesTotal: 0, booksTotal: 0, price: 0, value: 0, spells0: 0, spells1: 0, spells2: 0, spells3: 0, spells4: 0, spells5: 0, spells6: 0, spells7: 0, spells8: 0, spells9: 0 };
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
			renderUpdateKeys: ['linkedId', 'linked', 'linkedImg'],
			width: 480,
			dragDrop: [{ dropSelector: null }],
			closeOnSubmit: true
		});
	}

	async getData(options = {}) {
		let data = super.getData(options);

		data.isGM = game.user.isGM;

        if(this.object === null && this.linkData?.spellsTotal === 0) {
        	console.log('here1');
        	this.linkData = { id: undefined, name: defaultLink, spellsTotal: 0, pagesTotal: 0, booksTotal: 0, price: 0, value: 0, spells0: 0, spells1: 0, spells2: 0, spells3: 0, spells4: 0, spells5: 0, spells6: 0, spells7: 0, spells8: 0, spells9: 0 };
        }
        else if(this.object === null && this.linkData?.spellsTotal !== 0)
        {
        	console.log('here2');
        	// Nothing, keep current values
        }
        else {
        	console.log('here3');
        	this.linkData = getLink(this.object);
        }

//		this.linkData = this.object !== null ? getLink(this.object) : new Object;
		this.linkData.pagesTotal = 0;
		this.linkData.spellsTotal = 0;
		this.linkData.booksTotal = 0;
		this.linkData.price = 0;
		this.linkData.value = 0;
		this.linkData.spells0 = 0;
		this.linkData.spells1 = 0;
		this.linkData.spells2 = 0;
		this.linkData.spells3 = 0;
		this.linkData.spells4 = 0;
		this.linkData.spells5 = 0;
		this.linkData.spells6 = 0;
		this.linkData.spells7 = 0;
		this.linkData.spells8 = 0;
		this.linkData.spells9 = 0;
		
		this.linkedId = this.linkData?.id;
		this.linked = game.actors.get(this.linkedId);
		this.linkName = this.linkData?.name;
		this.linkedImg = this.linked?.img ?? this.linked?.token?.img ?? CONST.DEFAULT_TOKEN;

		//data.validActorChoices = game.user.isGM ? [] : [null, ...game.actors.filter(o => o.owner)];
		let actorChoices = { '': '' };
		if (!data.isGM) {
			game.actors
				.filter(o => o.owner && o.id !== this.object.id)
				.forEach(o => actorChoices[o.id] = `${o.name} [${o.id}]`);
		}
		data.validActorChoices = actorChoices;
		data.linked = this.linked;
		data.linkedImg = this.linkedImg;
		data.linkedId = this.linkedId;

		let classChoices = { '': '' };
        let classChoices2 = Object.entries(this.linked?.data.data.classes ?? {});
        for(let [key, cls] of classChoices2)
        {
        	classChoices[key] = cls.name;
        }
		data.validClassChoices = classChoices;

		this.linkClass = '';
		this.linkLevel = 0;
		data.linkClass = this.linkClass;
		data.linkLevel = this.linkLevel;
		
		return data;
	}

	/**
	 * @param {String} actorId
	 */
	async _linkActor(actorId) {
//		if (this.object.id === actorId) return; // Don't allow linking to self.

		let linkedActor = game.actors.get(actorId);
		if (linkedActor) {
			if (!this.linkData) this.linkData = { id: undefined, name: defaultLink, spellsTotal: 0, pagesTotal: 0, booksTotal: 0, price: 0, value: 0, spells0: 0, spells1: 0, spells2: 0, spells3: 0, spells4: 0, spells5: 0, spells6: 0, spells7: 0, spells8: 0, spells9: 0 };

			this.linkData.id = actorId;
			this.object = linkedActor;
//			console.log('here2', this.object);

			await setLink(this.object, this.linkData);
			this.linked = linkedActor;
			this.linkedId = actorId;
			this.linkClass = undefined;
			
//			let classChoices = { '': '' };
//			data.linked.data.data.classes.forEach(o => classChoices[o.name] = `${o.name}`);
//			data.validClassChoices = classChoices;
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
			this.linkedId = undefined;
			this.linkName = undefined;
			this.linkClass = '';
			this.linkLevel = 0;

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
		console.log('PF1E Spell Book Generator | Data Type: ' + data.type);
		console.log(data);
		if (data.type === 'Actor') {
			this._linkActor(data.id);
		}
		else {
			if(data.type === 'Item')
			{
				const pack = game.packs.get(data.pack);
				const index = await pack.getDocument(data.id);
				let spell = await game.items.fromCompendium(index);

				if(spell.type !== 'spell')
				    return false;

				let spellText = '@Compendium[' + data.pack + '.' + data.id + ']{' + spell.name + '}\n';
				let spellLevel = this.linkLevel;
				
				if(this.linkClass !== '' && this.linkClass !== undefined) {
					this.linkClass = this.linkClass.toLowerCase();
					let spellClasses = Object.entries(spell.data.learnedAt.class);
					for(let [cls, level] of spellClasses) {
						let boolTest = level[0].includes(this.linkClass);
						if(boolTest) {
							spellLevel = level[1];
							this.linkClass = this.linkClass[0].toUpperCase() + this.linkClass.substring(1);
							break;
						}
						else {
							spellLevel = -1;
						}
					}
				}
				
				if(spellLevel === -1 || this.linkClass === '') {
					let spellClasses = Object.entries(spell.data.learnedAt.class);
					let classNumber = 0;
				    spellLevel = 0;
					for(let [cls, level] of spellClasses) {
						classNumber++;
						spellLevel += level[1];
					}
//					console.log('spell level before ', spellLevel);
					spellLevel = Math.max(0, Math.floor(spellLevel / classNumber));
//					console.log('spell level after ', spellLevel);
				}

				this.linkData.pagesTotal += spellPages[spellLevel];
				
				this.linkData.spellsTotal += 1;
				this.linkData.booksTotal = Math.ceil(this.linkData.pagesTotal / 100);
				this.linkData.price += spellCosts[spellLevel];
				this.linkData.value += spellSells[spellLevel];
				
				if(spellLevel === 0) { this.linkData.spells0 += 1; }
				if(spellLevel === 1) { this.linkData.spells1 += 1; }
				if(spellLevel === 2) { this.linkData.spells2 += 1; }
				if(spellLevel === 3) { this.linkData.spells3 += 1; }
				if(spellLevel === 4) { this.linkData.spells4 += 1; }
				if(spellLevel === 5) { this.linkData.spells5 += 1; }
				if(spellLevel === 6) { this.linkData.spells6 += 1; }
				if(spellLevel === 7) { this.linkData.spells7 += 1; }
				if(spellLevel === 8) { this.linkData.spells8 += 1; }
				if(spellLevel === 9) { this.linkData.spells9 += 1; }

				console.log(this.linkData);
				if(this.linkLevel !== spellLevel)
				{
					document.getElementById('level' + parseInt(this.linkLevel) + '-list').style.display = 'none';
					document.getElementById('spellLevelSelect').selectedIndex = spellLevel;
					document.getElementById('spellList' + parseInt(spellLevel)).append(spellText);
					document.getElementById('level' + parseInt(spellLevel) + '-list').style.display = 'block';
					this.linkLevel = spellLevel;
				}
				else
				{
					document.getElementById('spellList' + parseInt(this.linkLevel)).append(spellText);
				}
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
		this.linkClass = event.target.value;
	}

	onStatsBook(event) {
		SpellBookGenStatsUI.open(this);
	}
	
	onCreateBook(event) {
		let spellLists = [];
		console.log("spellLists:");
		console.log(spellLists);
		
		for(let i = 0; i < 10; i++) {
			let textValue = document.getElementById('spellList' + parseInt(i)).value;
			console.log("Adding spell list " + parseInt(i) + ": " + textValue);
			spellLists.push(textValue);
			console.log(spellLists);
		}
		
		SpellBookGenCreateUI.open(this, spellLists);
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
		
		for(let i = 1; i < 10; i++) {
			document.getElementById('level' + parseInt(i) + '-list').style.display = 'none';
		}
	}
}

export class SpellBookGenStatsUI extends FormApplication {
	spellBook = undefined;
	
	constructor(objectBook, options) {
		console.log('objectBook');
		super(objectBook, options);
		this.options.title = game.i18n.localize('FSWorkshop.SpellBookGenerator.TitleBarStats');
		this.spellBook = objectBook;
//		console.log(this.spellBook);
        console.log(this);
	}
	
	static open(spellGenUI) {
		new SpellBookGenStatsUI(spellGenUI).render(true);
	}
	
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['fsworkshop', 'fsworkshop-spellbook-gen-stats'],
			template: template2,
			renderUpdateKeys: ['spellBook'],
			width: 480,
			dragDrop: [{ dropSelector: null }],
			closeOnSubmit: true
		});
	}
	
	async getData(options = {}) {
		let data = super.getData(options);
		
//		this.spellBook = data.objectBook ?? undefined;
		data.spellBook = this.spellBook;
		return data;
	}
	
	activateListeners(html) {
		super.activateListeners(html);
	}
}

export class SpellBookGenCreateUI extends FormApplication {
	spellBook = undefined;
	spellLists = undefined;
	spellBookType = 0;
	spellBookPages = 0;
	spellBookTotal = 1;
	spellBookWeight = 1;
	spellBookId = undefined;
	spellBookName = undefined;
	
	constructor(objectBook, spells, options) {
		console.log('spellList');
		console.log(spells);
		super(objectBook, options);
		this.options.title = game.i18n.localize('FSWorkshop.SpellBookGenerator.TitleBarCreate');
		this.spellBook = objectBook;
		this.spellLists = spells;
		this.spellBookTotal = 1;
		this.spellBookType = 0;
		
		console.log(this.spellBook);
        console.log(this);
	}
	
	static open(spellGenUI, spells) {
		new SpellBookGenCreateUI(spellGenUI, spells).render(true);
	}
	
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['fsworkshop', 'fsworkshop-spellbook-gen-create'],
			template: template3,
			renderUpdateKeys: ['spellBook', 'spellBookType', 'spellBookTotal'],
			width: 480,
			dragDrop: [{ dropSelector: null }],
			closeOnSubmit: true
		});
	}
	
	async getData(options = {}) {
		let data = super.getData(options);
		
//		this.spellBook = data.objectBook ?? undefined;
		data.spellBook = this.spellBook;
		data.spellBookTotal = this.spellBookTotal;
		data.spellBookChoices = {'0': 'Compact Spellbook', '1': 'Normal Spellbook', '2': 'Travelling Spellbook', '3': 'Formula Book', '4': 'Travelling Formula Book'};
		data.spellBookType = this.spellBookType;
		return data;
	}
	
	async onCreateBook(event) {
		this.spellBookId = undefined;
		console.log("spellbook and this", this.spellBook, this);
		
		switch(this.spellBookType) {
			case 0:
				this.spellBookId = spellBookIdCompact;
				this.spellBookPages = 70;
				this.spellBookWeight = 1;
				this.spellBookName = ' Compact Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			case 1:
				this.spellBookId = spellBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			case 2:
				this.spellBookId = spellBookIdTravel;
				this.spellBookPages = 50;
				this.spellBookWeight = 1;
				this.spellBookName = ' Traveling Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			case 3:
			    this.spellBookId = formulaBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Formula Book';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			case 4:
			this.spellBookId = formulaBookIdTravel;
				this.spellBookPages = 50;
				this.spellBookWeight = 1;
				this.spellBookName = ' Traveling Fomula Book';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			default:
				this.spellBookId = spellBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
		}
		
		const pack = game.packs.get(spellBookPack);
		const index = await pack.getDocument(this.spellBookId);
		let spellBookItem = await game.items.fromCompendium(index);
		
		if(this.spellBookTotal > 1) {
			this.spellBookName += 's';
			spellBookItem.data.price *= this.spellBookTotal;
		}
		
		spellBookItem.data.description.value += '<hr><p><b><u>Pages used:</u></b> ' + parseInt(this.spellBook.linkData.pagesTotal) + '</p><p><b><u>Books carried:</u></b> ' + parseInt(this.spellBookTotal) + '<hr>';

console.log("spellbook price before: ", spellBookItem.data.price);
		spellBookItem.data.price += parseInt(this.spellBook.linkData.price);
console.log("spellbook price after: ", spellBookItem.data.price);

		spellBookItem.data.weight = this.spellBookWeight * this.spellBookTotal;
		
		console.log('spellbook.linked', this.spellBook.linked);
		if(this.spellBook.linked == null) {
			spellBookItem.data.identifiedName = this.spellBookName;
			spellBookItem.name = this.spellBookName;
		}
		else {
			spellBookItem.data.identifiedName = this.spellBook.linked.data.name + "'s" + this.spellBookName;
			spellBookItem.name = this.spellBook.linked.data.name + "'s" + this.spellBookName;
		}

		for(let i = 0; i < 10; i++) {
			console.log("Spell List " + parseInt(i) + ': ', this.spellLists[i]);
			
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
		console.log("spellbook", spellBookItem);
	}
	
	onCancelBook(event) {
		this.close();
//		super._onSubmit(event);
	}
	
	onSelectBook(event) {
		console.log(event);
//		this.spellBookType = event.target.options.selectedIndex;
		this.spellBookType = event.target.value;
		//console.log('My window', this);

		switch(this.spellBookType) {
			case 0:
				this.spellBookId = spellBookIdCompact;
				this.spellBookPages = 70;
				this.spellBookWeight = 1;
				this.spellBookName = ' Compact Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			case 1:
				this.spellBookId = spellBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			case 2:
				this.spellBookId = spellBookIdTravel;
				this.spellBookPages = 50;
				this.spellBookWeight = 1;
				this.spellBookName = ' Traveling Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			case 3:
			    this.spellBookId = formulaBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Formula Book';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			case 4:
			this.spellBookId = formulaBookIdTravel;
				this.spellBookPages = 50;
				this.spellBookWeight = 1;
				this.spellBookName = ' Traveling Fomula Book';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
				break;
			default:
				this.spellBookId = spellBookIdNormal;
				this.spellBookPages = 100;
				this.spellBookWeight = 3;
				this.spellBookName = ' Spellbook';
				this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
		}
		
		console.log("Spellbooks before: ", this.spellBookTotal, ', ', this.spellBook.linkData.pagesTotal, ', ', this.spellBookPages, ', ', Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages));
		this.spellBookTotal = Math.ceil(this.spellBook.linkData.pagesTotal / this.spellBookPages);
		console.log("Spellbooks after: ", this.spellBookTotal);

//        let elementChoice = document.getElementById('spellBookSelect');
//        console.log("Element, selection, value", elementChoice, elementChoice.selectedIndex, elementChoice.value);
//
//        document.getElementById('spellBookSelect').options[this.spellBookType].selected = 'selected';
//        document.getElementById('spellBookSelect').selectedIndex = this.spellBookType.toString();
//		document.getElementById('spellBookSelect').value = this.spellBookType.toString();
	    this.render(true);
	}
	
	async _onSubmit(event, updateData, preventClose, preventRender) {
//		console.log('Event submit');
//		console.log(event);
		event.preventDefault();
//		if(event.submitter.name === 'spellCreateCancel')
//		{
//			console.log('Cancel clicked');
//			super._onSubmit(event);//, updateData, preventClose, preventRender);
//			event.preventDefault();
//		}
	}

	activateListeners(html) {
		super.activateListeners(html);
		
		html.find('select[name=spellBookSelect]').on('change', this.onSelectBook.bind(this));
		html.find('button[name=spellCreateCancel]').on('click', this.onCancelBook.bind(this));
		html.find('button[name=spellCreateCreate]').on('click', this.onCreateBook.bind(this));
	}
}