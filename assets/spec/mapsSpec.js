describe("user selection", function() {
  describe("country selection", function() {
    it("Map should be centered on Canada when user selects Canada", function() {
      setMapCenterZoomRestrictions('ca');
      expect(MapCountryCenter).toBe(countries['ca'].center);
    });
    it("Autocomplete object should be restricted to Brazil results when user select Brazil", function() {
      setMapCenterZoomRestrictions('br');
      expect(countryRestrict["country"]).toBe('br');
    })
  });
  describe("search results", function() {
    it("results should be appended", function() {
      spyOn(window, "createTable");
      addResult();
      expect(window.createTable).toHaveBeenCalled();
    })
  })
});
describe("filter results", function() {
  it("when user selects'Something nice'only results with min rating  3 are displayed on map ", function() {
    $("#radio-ok").prop("checked", true);
    var testFilteredResults = [];
    function respectsMinTreshold(rating){
      return rating>3;
    };
    markers.forEach(function(marker, i) {
      testFilteredResults[i] = marker.placeResult.rating;
    });
    expect(testFilteredResults.every(respectsMinTreshold)).toBe(true);
    $("#radio-all").prop("checked", true);
  });
});
