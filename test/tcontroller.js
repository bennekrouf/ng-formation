describe("test de controller", function(){


	beforeEach(module("formationApp"));

	beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, URL){
		var $httpBackend, ctrl, scope, url;
		url = URL;
		scope = $rootScope.$new();
		ctrl = $controller('formation', {'$scope':scope});

$httpBackend.expectGET(url).respond('[{ "ISBN-10" : "193398869X" , "rating" : 3 , "price" : 22.31 }]');

	}));

	it("mini test", function(){


	});

});