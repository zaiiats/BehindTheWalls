const { data } = require('../databaseObject');

function createRandomInIntervals(args) {
  if (!Array.isArray(args) || args.length === 0) {
    throw new Error("Invalid arguments: 'args' should be a non-empty array.");
  }

  let totalProb = args.reduce((sum, arg) => sum + arg.prob, 0);
  let randomProb = Math.random() * totalProb;
  let result;

  for (let arg of args) {
    if (arg.start !== undefined && arg.end !== undefined) {
      if (randomProb < arg.prob) {
        result = Number(
          Math.trunc(Math.random() * (arg.end - arg.start)) + arg.start
        );
        return [result, arg.value];
      }
      if (!arg.prob) {
        result = Number(
          Math.random() * (arg.end - arg.start) + arg.start
        ).toFixed(2);
        return result;
      }
      randomProb -= arg.prob;
    } else {
      if (randomProb < arg.prob) {
        if (typeof arg.value === 'object') return arg.value;
        else return randomFunction(arg.value);
      }
      randomProb -= arg.prob;
    }
  }
}

function randomFunction(data, max, min = 0) {
  const range = data ? data.length : max;
  const randomNumber = Math.trunc(Math.random() * (range - min) + min);
  return data ? data[randomNumber] : randomNumber;
}

function generateName(args) {
  let name = '';

  for (let arg of args) {
    let tempName = arg[Math.trunc(Math.random() * arg.length)];
    name += tempName;
  }
  return name;
}

function createComplexData(arg){
  const arrayLength = Math.trunc(createRandomInIntervals(arg.range))
  let array = [];
  for (let i = 0; i < arrayLength; i++) {
    let room = randomFunction(arg.list);
    array.push(room);
  }
  return array
}

///////////////////////////////////////////////////////////////
const createEnvironment = () => {
  const envData = data.envData;
  let timeToSurvive, difficultyType;
  [timeToSurvive, difficultyType] = createRandomInIntervals(envData.difficulty);
  let catastropheData = createRandomInIntervals(envData[difficultyType]);
  let catastrophe = randomFunction(catastropheData.catastrophe);
  let population = createRandomInIntervals(catastropheData.population);
  let vegetation = createRandomInIntervals(catastropheData.vegetation);
  let infrastructure = createRandomInIntervals(catastropheData.infrastructure);

  let remainingFood = createRandomInIntervals(envData.reservs.food)[0];
  let remainingWater = createRandomInIntervals(envData.reservs.water)[0];
  let remainingGasoline = createRandomInIntervals(envData.reservs.gasoline)[0];
  let countryName = generateName(envData.country.name);
  
  let rooms = createComplexData(envData.rooms);
  let medicines = createComplexData(envData.medicines)
  let electricity = createComplexData(envData.electricity)

  let generatedEnvData = {
    timeToSurvive,
    difficultyType,
    catastrophe,
    population,
    vegetation,
    infrastructure,
    remainingFood,
    remainingWater,
    remainingGasoline,
    countryName,
    rooms,
    medicines,
    electricity,
  };
  return generatedEnvData;
};

module.exports = { createEnvironment };
