describe("DefaultTest", function () { 

    var testVar = 0;

    // Test setup 
    beforeEach(function() {
        testVar = 1;
    });

    // actual test
    it("Test Variable should be 1", function() {
        expect(testVar).toBe(1);
    });


})
describe("SecTest", function () { 

	var expectBookNames = function(expectedNames, key) {
  element.all(by.repeater(key + ' in pages[info.totalPages].books').column(key + '.name')).then(function(arr) {
    arr.forEach(function(wd, i) {
      expect(wd.getText()).toMatch(expectedNames[i]);
    });
  });
};
it('should search across all fields when filtering with a string', function() {
  var searchText = element(by.model('searchText'));
  searchText.clear();
  searchText.sendKeys('m');
  expectFriendNames(['Mary', 'Mike', 'Adam'], 'friend');

  searchText.clear();
  searchText.sendKeys('76');
  expectFriendNames(['John', 'Julie'], 'friend');
});

it('should search in specific fields when filtering with a predicate object', function() {
  var searchAny = element(by.model('search.$'));
  searchAny.clear();
  searchAny.sendKeys('i');
  expectFriendNames(['Mary', 'Mike', 'Julie', 'Juliette'], 'friendObj');
});
})