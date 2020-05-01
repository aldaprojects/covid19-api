

class Report {
    constructor({ 
        country_name, 
        newCases, 
        newRecovered, 
        newDeaths, 
        total_cases, 
        total_recovered, 
        total_deaths,
        date
    }) { 
        this.country_name = country_name;
        this.newCases = newCases;
        this.newRecovered = newRecovered;
        this.newDeaths = newDeaths;
        this.total_cases = total_cases;
        this.total_deaths = total_deaths;
        this.total_recovered = total_recovered;
        this.date = date;
    }
}

module.exports = Report;