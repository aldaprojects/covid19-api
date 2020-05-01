const fs = require('fs');

class CountryService {

    getAllCountriesName() {
        const countries = JSON.parse(fs.readFileSync('./data/countries.json').toString());
        return Object.keys(countries);
    }

    getHistoryCountry( country_name ) {
        const countries = JSON.parse(fs.readFileSync('./data/historycountries.json').toString());
        return countries[country_name] ? countries[country_name].history : [];
    }

    getGlobalReports( limit = 10 ) {
        const reports = JSON.parse(fs.readFileSync('./data/globalreports.json').toString());
        reports.splice(0, reports.length - limit < 0 ? 0 : reports.length - limit );
        return reports;
    }

    getLastReport( country_name ) {
        const countries = JSON.parse(fs.readFileSync('./data/historycountries.json').toString());
        return countries[country_name] ? countries[country_name].history[countries[country_name].history.length - 1] : [];
    }

    getAllCountries() {
        const countries = JSON.parse(fs.readFileSync('./data/countries.json').toString());
        return countries;
    }
}

module.exports = CountryService;