function formatMonth(time) {
  const years = Math.floor(time / 12);
  const months = time % 12;
  let result = [];

  if (years > 0) {
    const yearText = years === 1 ? 'рік' : years < 5 ? 'роки' : 'років';
    result.push(`${years} ${yearText}`);
  }
  if (months > 0) {
    const monthText =
      months === 1 ? 'місяць' : months < 5 ? 'місяці' : 'місяців';
    result.push(`${months} ${monthText}`);
  }
  return result.join(' і ');
}

function formatPopulation(population) {
  if (population >= 1_000_000_000) {
    return `${+(population / 1_000_000_000).toFixed(2)} млрд.`;
  } else if (population >= 1_000_000) {
    return `${+(population / 1_000_000).toFixed(2)} млн.`;
  } else {
    return `${+(population / 1000).toFixed(2)} тис.`;
  }
}
