

describe('tests', function(){

	var list = [];
	var taille = 0;
	beforeEach(function(){
		browser.get('http://localhost:5000/');


	});

	it('test de saisie', function(){

		element.all(by.repeater('article in articles')).then(function(arr){
			taille = arr.length;

			var elem = element(by.model('nArticle'));
			elem.sendKeys("TOTO");
			element(by.buttonText('Add')).click();

			expect(element.all(by.repeater('article in articles')).count())
			.toEqual(taille+1);
		});

	});
});