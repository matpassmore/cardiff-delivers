/**
 * Vanilla JS table filter
 *
 * Source: https://blog.pagesd.info/2019/10/01/search-filter-table-javascript/
 * Source: https://dev.to/michelc/search-and-filter-a-table-with-javascript-28mi
 */

var TableFilter = (function () {
  var search;

  function dquery(selector) {
    // Returns an array of elements corresponding to the selector
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function onInputEvent(e) {
    // Retrieves the text to search
    var input = e.target;
    search = input.value.toLocaleLowerCase();

    // Get the lines where to search
    // (the data-table attribute of the input is used to identify the table to be filtered)
    var selector = input.getAttribute("data-table") + " tbody tr";
    var rows = dquery(selector);

    // Searches for the requested text on all rows of the table
    [].forEach.call(rows, filter);

    // Updating the line counter (if there is one defined)
    // (the data-count attribute of the input is used to identify the element where to display the counter)
    var writer = input.getAttribute("data-count");
    if (writer) {
      // If there is a data-count attribute, we count visible rows
      var count = rows.reduce(function (t, x) { return t + (x.style.display === "none" ? 0 : 1); }, 0);
      // Then we display the counter
      dquery(writer)[0].textContent = count;
    }
  }

  function filter(row) {
    // Caching the tr line in lowercase
    if (row.lowerTextContent === undefined)
      row.lowerTextContent = row.textContent.toLocaleLowerCase();

    // Hide the line if it does not contain the search text
    row.style.display = row.lowerTextContent.indexOf(search) === -1 ? "none" : "table-row";
  }

  return {
    init: function () {
      // get the list of input fields with a data-table attribute
      var inputs = dquery("input[data-table]");

      [].forEach.call(inputs, function (input) {
        // Triggers the search as soon as you enter a search filter
        input.oninput = onInputEvent;
        // If we already have a value (following navigation back), we relaunch the search
        if (input.value !== "") input.oninput({ target: input });
      });
    }
  };

})();

TableFilter.init();
