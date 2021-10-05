//require knex
const knex = require("../config/knex-config");
//require winston
const winston = require("winston");
// Get logger from external configuration source
const winstonConfig = require("../config/winston-config");

let defaultLogger = winstonConfig.defaultLogger;
const MODULE = "common-model";

// Add another logger with the category specific to this module
winston.loggers.add(MODULE, winstonConfig.createLoggerConfig(MODULE));
// Module-specific logger
const moduleLogger = winston.loggers.get(MODULE);

//export function
module.exports = {
  /**
   * @param {string} selection: a string containing columns to select
   * @param {string} tableName: a string containing table name to insert data
   * @param {object} where -> an object containing
   * where conditions in key: value pairs
   * example {firstName: 'foo', lastName: 'bar'} resolving to
   * where firstName = foo and lastName = bar
   * @param {object} whereNot -> an object containing
   * where not conditions in key: value pairs
   * example {firstName: 'foo', lastName: 'bar'} resolving to
   * where firstName = foo and lastName = bar
   * @returns {array} -> returns either zero if not found or data from query
   *
   * @author @aakash
   */
  select: async (selection, tableName, where) => {
    defaultLogger.info("Inmodels/user");
    moduleLogger.info("select()");
    moduleLogger.debug(
      `select(${selection}, ${tableName} ,${JSON.stringify(where)})`
    );
    return await knex.select(selection).from(tableName).where(where);
  },

  /**
   * @param {string} tableName: a string containing table name to insert data
   * @param {object} data -> an object containing
   * data to insert in key: value pairs
   * example {firstName: 'foo', lastName: 'bar'} resolving to
   * where firstName = foo and lastName = bar
   * @returns {number} -> returns an integer denoting  id of inserted row
   *
   * @author @aakash
   */
  insert: async (tableName, data) => {
    defaultLogger.info("Inmodels/user");
    moduleLogger.info("insert()");
    moduleLogger.debug(
      `insert(${JSON.stringify(tableName)}, ${JSON.stringify(data)})`
    );
    return await knex(tableName)
      .insert(data)
      .then((result) => result[0]);
  },

  /**
   * @param {string} selection: a string containing columns to select
   * @param {string} tableName: a string containing table name to insert data
   * @param {object} where -> an object containing
   * where conditions in key: value pairs
   * example {firstName: 'foo', lastName: 'bar'} resolving to
   * where firstName = foo and lastName = bar
   * @param @optional  {object} whereNot -> an object containing
   * where not conditions in key: value pairs
   * example {firstName: 'foo', lastName: 'bar'} resolving to
   * where firstName = foo and lastName = bar
   * @returns {array} -> returns either zero if not found or data from query
   *
   * @author @aakash
   */
  selectAll: async (selection, tableName, where, whereNot = {}) => {
    defaultLogger.info("Inmodels/user");
    moduleLogger.info("selectAll()");
    moduleLogger.debug(
      `selectAll(${selection}, ${tableName}, ${JSON.stringify(
        where
      )}, ${JSON.stringify(whereNot)})`
    );
    return await knex
      .select(selection.split(","))
      .from(tableName)
      .where(where)
      .whereNot(whereNot);
  },
  /**
   * @param {string} tableName: a string containing table name to insert data
   * @param {object} data -> an object containing
   * data to set in key: value pairs
   * example {firstName: 'foo', lastName: 'bar'} resolving to
   * where firstName = foo and lastName = bar
   * @param {object} where -> an object containing
   * where conditions in key: value pairs
   * example {firstName: 'foo', lastName: 'bar'} resolving to
   * where firstName = foo and lastName = bar
   * @param {object} whereNot -> an object containing
   * where not conditions in key: value pairs
   * example {firstName: 'foo', lastName: 'bar'} resolving to
   * where firstName = foo and lastName = bar
   * @returns {array} -> returns either zero if not found or data from query
   *
   * @author @aakash
   */
  update: async (tableName, data, where, whereNot = {}) => {
    defaultLogger.info("Inmodels/user");
    moduleLogger.info("update()");
    moduleLogger.debug(
      `update(${JSON.stringify(tableName)}, ${JSON.stringify(
        data
      )} , ${JSON.stringify(where)}, ${JSON.stringify(whereNot)})`
    );
    return await knex(tableName).where(where).whereNot(whereNot).update(data);
  },
  insertData: (tableName, data) => {
    try {
      moduleLogger.debug(`insertData()`);
      return knex(tableName)
        .insert(data)
        .then((log) => {
          return log[0]; // returns the insert id
        });
    } catch (error) {
      defaultLogger.info(`Error in ${MODULE}.insertData()`);
      moduleLogger.error(error);
      moduleLogger.error(error.stack);
      throw error;
    }
  },
  selectData: (selection = [""], fromTable = "", where = {}) => {
    try {
      return knex(fromTable)
        .where(where)
        .select(selection)
        .join("person", "posts.person_id", "person.person_id");
    } catch (error) {
      defaultLogger.info(`Error in ${MODULE}.selectAll()`);
      moduleLogger.error(error);
      throw error;
    }
  },
  selectPost: (selection = [""], fromTable = "", where = {}) => {
    try {
      return knex(fromTable)
        .where(where)
        .select(selection)
        .join("posts", "shared.post_id", "posts.id");
    } catch (error) {
      defaultLogger.info(`Error in ${MODULE}.selectAll()`);
      moduleLogger.error(error);
      throw error;
    }
  },
};
