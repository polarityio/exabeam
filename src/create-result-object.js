/**
 * Return a Result Object or a Result Miss Object based on the REST API response.
 * @param null || {entity, result}
 * if I pass nothing in, I want it to return a result object with no data
 * if i pass in a single object, I want it to return a result object with data
 * either pass in a single object or an array of objects, being
 * @returns {{data: null, entity}|{data: {summary: [string], details}, entity}}
 *
 */
const { getLogger } = require('./logger');
const { size } = require('lodash/fp');

class PolarityResult {
  createEmptyBlock(entity) {
    return {
      entity: entity,
      data: {
        summary: ['Select a Category'],
        details: []
      }
    };
  }

  createResultsObject(apiResponse) {
    return {
      entity: apiResponse.entity,
      data: {
        summary: createSummaryTags(apiResponse.data),
        details: apiResponse.data
      }
    };
  }

  createNoResultsObject(entity) {
    return {
      entity,
      data: null
    };
  }
}

const createSummaryTags = (result) => {
  const Logger = getLogger();
  const summaryTags = [];

  Logger.trace({ result }, 'result from createSummaryTags');

  if (size(result.rows) === 10) {
    summaryTags.push(`Logs: ${size(result.rows)}+`);
  } else {
    summaryTags.push(`Logs: ${size(result.rows)}`);
  }

  return summaryTags;
};

module.exports = { PolarityResult };
