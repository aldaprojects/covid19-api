

class Country {
    constructor( { country_name, total_cases, total_recovered, total_deaths } ) {
        this.country_name = country_name;
        this.total_cases = total_cases;
        this.total_recovered = total_recovered;
        this.total_deaths = total_deaths;
    }
}

module.exports = Country;