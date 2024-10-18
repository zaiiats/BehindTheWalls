class CreateEnvironment {
  #data;

  constructor(data) {
    this.#data = data;
    this.#initEnvironment();
  }

  #initEnvironment() {
    this.#createEnv();
  }

  #createEnv() {
    this.env = {};
    this.#setDifficulty();
    this.#setCatastrophe();
    this.#setPopulation();
    this.#createCountries();
    this.#setCharacteristics();
    this.#printEnv();
  }

  #setDifficulty(){
    let timeToSurvive, difficultyType;
    [timeToSurvive,difficultyType] = this.#createRandomInIntervals(this.#data.difficulty);
    let formattedTimeToSurvive = this.#formatTime(timeToSurvive);
    let catastropheType = this.#createRandomInIntervals(this.#data[`${difficultyType}`])

    this.env.difficultyType = difficultyType;
    this.env.timeToSurvive = timeToSurvive;
    this.env.formattedTimeToSurvive = formattedTimeToSurvive;
    this.env.catastropheType = catastropheType;
  }

  #setCatastrophe(){
    let catastrophe = this.#createRandomInIntervals(this.env.catastropheType.catastrophe);
    let infrastructure = this.#createRandomInIntervals(this.env.catastropheType.infrastructure);
    let vegetation = this.#createRandomInIntervals(this.env.catastropheType.vegetation);
    
    this.env.catastrophe = catastrophe;
    this.env.infrastructure = infrastructure;
    this.env.vegetation = vegetation;
  }

  #setPopulation(){
    let population = this.#createRandomInIntervals(this.#data.population);
    let formattedPopulation = this.#formatPopulation(population)

    let diedPopulation = 
    (population *this.#createRandomInIntervals(this.env.catastropheType.population)) / 100;
    let formattedDiedPopulation = this.#formatPopulation(diedPopulation);

    this.env.population = population;
    this.env.formattedPopulation = formattedPopulation;
    this.env.diedPopulation = diedPopulation;
    this.env.formattedDiedPopulation = formattedDiedPopulation;
  }

  #printEnv(){
    let text = `
      ${this.env.catastrophe} happened!\n
      Originated in ${this.env.activeCountry.name}, ${this.env.activeCity.name}, 
      and spread across the whole world. 
      You need to get in the bunker\n
      We need to survive for ${this.env.formattedTimeToSurvive}, 
      From ${this.env.formattedPopulation}, ${this.env.formattedDiedPopulation} people died, 
      ${this.env.infrastructure}% of world infrastructure was destroyed, 
      ${this.env.vegetation}% of world vegetation was destroyed`
    this.env.text = text;
  }

  #formatTime(time){
    const years = Math.floor(time / 12);
    const remainingMonths = time % 12;
    let result = [];
    if (years > 0) result.push(`${years} year${years > 1 ? "s" : ""}`);
    if (remainingMonths > 0)
      result.push(`${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`);
    return result.join(" and ");
  }

  #formatPopulation(population){
    let formattedPopulation;
    population > 1000000000
      ? (formattedPopulation = `${(population / 1000000000).toFixed(2)} b.`)
      : (formattedPopulation = `${(population / 1000000).toFixed(2)} m.`);
    return formattedPopulation;
  }

  #createCountries(){
    let countries = [];
    this.existingNames = {
      countries: new Set(),
      cities: new Set(),
    };
    const numOfCountries = Math.round(this.#createRandomInIntervals(this.#data.country.quantity));

    for (let i = 0; i < numOfCountries; i++) {
      const countryName = this.#generateUniqueName(this.#data.country.name,'countries');

      const countryPopulationIndex = this.#createRandomInIntervals(this.#data.country.population);
      const numOfCities = Math.round(this.#createRandomInIntervals(this.#data.city.quantity));
      const cities = Array.from({ length: numOfCities }, () => {
        const cityName = this.#generateUniqueName(this.#data.city.name,"cities");
        const cityPopulationIndex = this.#createRandomInIntervals(this.#data.city.population);
        return { name: cityName, populationIndex: cityPopulationIndex };
      });

      const country = {
        name: countryName,
        populationIndex: countryPopulationIndex,
        cities: cities
      };
      countries.push(country);
    }

    const activeCountry = countries[Math.floor(Math.random()*countries.length)]
    const activeCity = activeCountry.cities[Math.floor(Math.random()*activeCountry.cities.length)]

    this.env.activeCity = activeCity;
    this.env.activeCountry = activeCountry;
    this.env.countries = countries;
  }

  #generateUniqueName(nameParts, type) {
    let uniqueName;
    do {
      uniqueName = nameParts
        .map(part => this.#randomFunction(part))
        .join('');
    } while (this.existingNames[type].has(uniqueName));

    this.existingNames[type].add(uniqueName);
    return uniqueName;
  }

  #setCharacteristics(){
    
    let populationIndexCountry = this.env.countries.reduce((acc,country) => acc += parseFloat(country.populationIndex),0);
    this.env.countries.forEach(country => {
      country.population = (this.env.population / populationIndexCountry) * country.populationIndex
      
      let populationIndexCity = country.cities.reduce((acc,city) => acc += parseFloat(city.populationIndex),0);
      country.cities.forEach(city => {
        city.population = (country.population / populationIndexCity) * city.populationIndex        
      })
    })

  }

  #randomFunction(data, max, min = 0) {
    const range = data ? data.length : max;
    const randomNumber = Math.trunc(Math.random() * (range - min) + min);
    return data ? data[randomNumber] : randomNumber;
  }

  #createRandomInIntervals(args) {
    let totalProb = args.reduce((sum, arg) => sum + arg.prob, 0);
    let randomProb = Math.random() * totalProb;
    let result;
    
    for (let arg of args) {
      if (arg.start) {
        if (randomProb < arg.prob) {
          result = Number(Math.trunc(Math.random() * (arg.end - arg.start) + arg.start));          
          return [result, arg.value];
        }
        if (!arg.prob) {
          result = Number(Math.random() * (arg.end - arg.start) + arg.start).toFixed(2);
          return result;
        }
        randomProb -= arg.prob;
      } else {
        if (randomProb < arg.prob) {
          if (Array.isArray(arg.value)) return this.#randomFunction(arg.value);
          if (typeof arg.value === 'object') return arg.value;
          else return this.#randomFunction(arg.value);
        }
        randomProb -= arg.prob;
      }
    }
  }
}

export default CreateEnvironment;
