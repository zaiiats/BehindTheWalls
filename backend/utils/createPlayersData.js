const { data } = require('../databaseObject')

function createRandomInIntervals(args) {
  if (!Array.isArray(args) || args.length === 0) {
    throw new Error("Invalid arguments: 'args' should be a non-empty array.");
  }

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
        if (Array.isArray(arg.value)) return randomFunction(arg.value);
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

///////////////////////////////////////////////////////////////
const createEnvironment = () => {
  const playerData = data.playerData


  let generatedPlayData = {
  }
  return generatedPlayData
}

module.exports = { createEnvironment };