

describe('tests', function(){

	var list = [];
	var taille = 0;
	beforeEach(function(){
		browser.get('http://localhost:5000/');

		list = element.all(by.repeater('article in articles'));
		taille = list.count();

	});

	it('test de saisie', function(){
		var elem = element(by.model('nArticle'));
		elem.sendKeys("TOTO");
		element(by.buttonText('Add')).click();

		expect(element.all(by.repeater('article in articles')).count())
			.toEqual(taille+1);
	});
});