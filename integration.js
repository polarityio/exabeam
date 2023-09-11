'use strict';

const { polarityRequest } = require('./src/polarity-request');
const { setLogger, getLogger } = require('./src/logger');
const { PolarityResult } = require('./src/create-result-object');
const { map, get, size } = require('lodash/fp');
const { parseErrorToReadableJSON } = require('./src/errors');
const NodeCache = require('node-cache');

const tokenCache = new NodeCache();

// Number of seconds before the API Key should expire to expire it
const EXPIRE_THRESHOLD = 120;

function startup(logger) {
  setLogger(logger);
}

// Questions for PR:
// fix startTime and endTime
// Summary tags
// confirm filnames and hostnames are searchable
// VALIDATE OPTIONS

async function doLookup(entities, options, cb) {
  const Logger = getLogger();

  try {
    polarityRequest.setOptions(options);

    const token = await getToken();

    polarityRequest.setHeaders('Content-Type', 'application/json');
    polarityRequest.setHeaders('Accept', 'application/json');
    polarityRequest.setHeaders('Authorization', `Bearer ${token}`);

    const searchFields = polarityRequest.options.searchFields.map((field) => field.value);

    function searchQuery(list) {
      if (!Array.isArray(list)) {
        return '';
      }
      const formattedList = list.map((value) => `"${value}"`).join(', ');

      return `(${formattedList})`;
    }

    const lookupResults = await Promise.all(
      map(async (entity) => {
        const response = await polarityRequest.send({
          method: 'POST',
          url: `${polarityRequest.options.url}/search/v2/events`,
          body: {
            limit: 10,
            distinct: false,
            startTime: '2023-03-18T20:10:10Z',
            endTime: '2023-04-18T21:23:59Z',
            filter: searchQuery(searchFields),
            fields: ['rawLogs', ...searchFields]
          }
        });

        const polarityResult = new PolarityResult();

        if (size(get('0.result.body.rows', response))) {
          const data = get('0.result.body', response);
          const result = { entity, data };
          return polarityResult.createResultsObject(result);
        }

        return polarityResult.createNoResultsObject(entity);
      }, entities)
    );

    Logger.trace({ lookupResults }, 'lookupResults from Exabeam');
    return cb(null, lookupResults);
  } catch (err) {
    Logger.error({ err }, 'Error in doLookup');
    const error = parseErrorToReadableJSON(err);
    return cb(error);
  }
}

async function getToken() {
  const Logger = getLogger();

  if (tokenCache.has(polarityRequest.options.clienId)) {
    Logger.debug('Using cached token');
    return tokenCache.get(polarityRequest.options.clienId);
  }

  const response = await polarityRequest.send({
    method: 'POST',
    url: `${polarityRequest.options.url}/auth/v1/token`,
    body: {
      grant_type: 'client_credentials',
      client_id: `${polarityRequest.options.clienId}`,
      client_secret: `${polarityRequest.options.clientSecret}`
    }
  });

  const data = response[0];

  tokenCache.set(
    polarityRequest.options.clienId,
    data.result.body,
    data.result.body.expires_in - EXPIRE_THRESHOLD
  );

  const token = get('0.result.body.access_token', response);
  return token;
}

module.exports = {
  doLookup,
  startup
};
