/**
 * Created by chrisng on 3/13/17.
 */

function findLps(string) {
  const result = [];
  result.push(0);
  let j = 0;
  for (let i = 1; i < string.length; i++) {
    if (string[i] === string[j]) {
      result.push(j + 1);
      j++;
    } else {
      let same = false;
      while (!same && j > 0) {
        j = result[j - 1];
        if (string[i] === string[j]) {
          same = true;
        }
      }
      string[i] === string[j] ? result.push(result[j] + 1) : result.push(0);
    }
  }
  return result;
}

function foundSubstring(string, target) {
  // using Knuth-Morris-Pratt (KMP) substring search
  const lps = findLps(target);
  let i = 0; // counter for outer for loop going through string
  let j = i; // counter for inner for loop testing string against target word
  let k = 0; // counter for loop testing target against string

  for (i; i < string.length; i++) {
    if (string[i] === target[k]) {
      j = i;
      let mismatchFound = false;
      while (!mismatchFound) {
        if (string[j] === target[k]) {
          j++;
          k++;
        } else {
          k = lps[k - 1];
          mismatchFound = true;
        }
        if (k >= target.length) {
          return true;
        }
      }
    }
  }
  return false;
}

// TODO: find a more efficient way to do this?
function findBrands(title, availableBrands) {
  title = title.toLowerCase();
  const brands = availableBrands.filter((brand) => {
    return foundSubstring(title, brand.toLowerCase());
  });
  return brands.length ? brands : null;
}

module.exports = { findBrands };
