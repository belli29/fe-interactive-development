describe("user selection", function() {
  describe("country selection", function() {
    it("Map should be centered on Canada when user selects Canada", function() {
      setMapCenterAndZoom('ca');
      expect(MapCountryCenter).toBe(countries['ca'].center);
      });
    })
  })
