/**
 * Stateless immutable tility functions for use throughout the project.
 *
 * @author Sean Teare <steare573@gmail.com>
 * @since 2018-06-13
 */

/**
 * Generate list of children numbers fitting criteria included in data object.
 *
 * @param {Object} data - Contains factory min, max, and numVals data required for children list
 * @return {Array} - Array of integers complying with min, max, and numVals.
 */
export const generateRandomChildren = (data) => {
  const resArray = [];
  while (resArray.length < data.numVals) {
    resArray.push(Math.floor(Math.random() * ((Math.floor(data.max) - Math.ceil(data.min)) + 1))
      + Math.ceil(data.min));
  }
  return resArray;
};

export default {
  generateRandomChildren,
};
