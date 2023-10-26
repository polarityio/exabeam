'use strict';

const { polarityRequest } = require('./src/polarity-request');
const { setLogger, getLogger } = require('./src/logger');
const { PolarityResult } = require('./src/create-result-object');
const { map, get, size } = require('lodash/fp');
const { parseErrorToReadableJSON } = require('./src/errors');
const { DateTime } = require('luxon');
const NodeCache = require('node-cache');

const tokenCache = new NodeCache();

const EXPIRE_THRESHOLD = 120;

function startup(logger) {
  setLogger(logger);
}

async function doLookup(entities, options, cb) {
  const Logger = getLogger();
  Logger.trace({ options }, 'options from Exabeam');
  try {
    polarityRequest.setOptions(options);

    const token = await getToken();

    polarityRequest.setHeaders('Content-Type', 'application/json');
    polarityRequest.setHeaders('Accept', 'application/json');
    polarityRequest.setHeaders('Authorization', `Bearer ${token}`);

    const searchFields = polarityRequest.options.searchFields.map((field) => field.value);

    const selectedFields = options.getRawLogs
      ? ['rawLogs', ...searchFields]
      : [...searchFields];

    const lookupResults = await Promise.all(
      map(async (entity) => {
        const response = await polarityRequest.send({
          method: 'POST',
          url: `${polarityRequest.options.url}/search/v2/events`,
          body: {
            limit: 10,
            distinct: false,
            startTime: getLookBackDays(options),
            endTime: DateTime.local().toISO(),
            filter: `"${entity.value}"`,
            fields: selectedFields
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

function getLookBackDays(options) {
  const currentDate = DateTime.local();
  return currentDate.minus({ days: get('lookBackDays', options) }).toISO();
}

async function getToken() {
  const Logger = getLogger();

  if (tokenCache.has(polarityRequest.options.clientId)) {
    Logger.trace('Using cached token');
    const token = tokenCache.get(polarityRequest.options.clientId);
    Logger.trace({ token }, 'Token from cache');
    return token.access_token;
  }

  const response = await polarityRequest.send({
    method: 'POST',
    url: `${polarityRequest.options.url}/auth/v1/token`,
    body: {
      grant_type: 'client_credentials',
      client_id: `${polarityRequest.options.clientId}`,
      client_secret: `${polarityRequest.options.clientSecret}`
    }
  });

  const data = response[0];

  tokenCache.set(
    polarityRequest.options.clientId,
    data.result.body,
    data.result.body.expires_in - EXPIRE_THRESHOLD
  );

  const token = get('0.result.body.access_token', response);
  return token;
}

function validateOptions(userOptions, cb) {
  const requiredFields = [
    { key: 'url', message: 'You must provide a valid URL' },
    { key: 'clientId', message: 'You must provide a valid ScoutPrime API Key' },
    { key: 'clientSecret', message: 'You must provide a valid ScoutPrime API Key' }
  ];

  let errors = requiredFields.reduce((acc, { key, message }) => {
    if (
      typeof userOptions[key].value !== 'string' ||
      userOptions[key].value.length === 0
    ) {
      acc.push({ key, message });
    }
    return acc;
  }, []);

  if (userOptions.lookBackDays && userOptions.lookBackDays.value < 1) {
    errors.push({ key: 'lookBackDays', message: 'value must be greater than 0' });
  }

  if (userOptions.searchFields && userOptions.searchFields.value.length < 1) {
    errors.push({
      key: 'searchFields',
      message: 'You must select at least 1 field to search.'
    });
  }

  return cb(null, errors);
}

module.exports = {
  doLookup,
  validateOptions,
  startup
};
