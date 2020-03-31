const axios  = require('axios');
const seed   = require('../../_utils/save-seed.js');


// Once a googel sheet is "published to the web" we can access its JSON
// via a URL of this form. We just need to pass in the ID of the sheet
// which we can find in the URL of the document.
const sheetID = "1S5ZxTSvdLeCXqKHKit7qiCP-oX048FxPTLG4CWvhmxc";
const googleSheetUrl = `https://spreadsheets.google.com/feeds/list/${sheetID}/od6/public/values?alt=json`;

module.exports = () => {
  return new Promise((resolve, reject) => {

    console.log(`Requesting data from ${googleSheetUrl}`);

    axios.get(googleSheetUrl)
      .then(response => {

        // massage the data from the Google Sheets API into
        // a shape that will more convenient for us in our SSG.
        var data = {
          "content": []
        };
        response.data.feed.entry.forEach(item => {
          data.content.push({
            "name": item.gsx$name.$t,
            "tags": item.gsx$tags.$t.toLowerCase(),
            "notes": item.gsx$notes.$t,
            "contact": item.gsx$contact.$t,
            "locality": item.gsx$locality.$t
          })

          // sort results by name
          data.content.sort(function (x, y) {
            let a = x.name.toUpperCase(),
              b = y.name.toUpperCase();
            return a == b ? 0 : a > b ? 1 : -1;
          });

        });

        // stash the data locally for developing without
        // needing to hit the API each time.
        seed(JSON.stringify(data), `${__dirname}/../dev/sheet.json`);

        // resolve the promise and return the data
        resolve(data);

      })

      // uh-oh. Handle any errrors we might encounter
      .catch(error => {
        console.log('Error :', error);
        reject(error);
      });
  })
}
