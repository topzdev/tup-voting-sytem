const minPositionWinners = 2;

const position = [
  {
    name: "name 1",
    vote: 5,
    position: null,
  },

  {
    name: "name 2",
    vote: 6,
    position: null,
  },

  {
    name: "name 3",
    vote: 5,
    position: null,
  },

  {
    name: "name 4",
    vote: 5,
    position: null,
  },
  {
    name: "name 5",
    vote: 3,
    position: null,
  },
  {
    name: "name 6",
    vote: 6,
    position: null,
  },
];

function sortArray(position) {
  let temp = position;
  return temp.sort((a, b) => b.vote - a.vote);
}

function getThePossibleWinner(position) {
  let temp = position;
  return temp.slice(0, minPositionWinners);
}

function getLastValueOfWinner(winners) {
  let temp = winners;
  return temp[winners.length - 1];
}

function getTie(last, winner, rest) {
  return rest
    .filter((item) => !winner.find((sub) => sub.name === item.name))
    .filter((item) => last.vote === item.vote);
}

const sortedArray = sortArray(position);
const possibleWinner = getThePossibleWinner(sortedArray);
const lastValue = getLastValueOfWinner(possibleWinner);
const ties = getTie(lastValue, possibleWinner, sortedArray);
console.log("sortedArray\n", sortedArray);
console.log("\n\npossible winner\n", possibleWinner);
console.log("\n\nlast\n", lastValue);
console.log("\n\ntie\n", ties);
