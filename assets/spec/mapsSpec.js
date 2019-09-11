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
  })
  describe("search results", function(){
    it("results should be appended", function() {
    spyOn("window", "createTable");
    addResult(result, i);
    expect(window.createTable(markerIcon,result,tr)).ToHaveBeenCalled();
  })
  })
})
