/**
 * Configuration module for overriding default configs with env vars and abstracting process.env
 *
 * @author Sean Teare <steare573@gmail.com>
 * @since 2018-06-13
 */
import deepmerge from 'deepmerge';
import defaults from './config.json';

// populate the conf with default values based on the config profile or node environment
const configEnv = process.env.CONFIG_PROFILE || process.env.NODE_ENV;
const conf = !configEnv ? defaults['*'] : deepmerge(defaults['*'], defaults[configEnv]);

// populate db config based on desired db dialect
const dbDialect = process.env.DB_DIALECT || conf.defaultValues.dbDialect;
conf.db = conf[dbDialect];
conf.db.dialect = conf.db.dialect || dbDialect;

// override defaults with environment variables
conf.db.host = process.env.DB_HOST || conf.db.host;
conf.db.port = process.env.DB_PORT || conf.db.port;
conf.db.username = process.env.DB_USER || conf.db.username;
conf.db.password = process.env.DB_PASSWORD || conf.db.password;
conf.logger.level = process.env.LOG_LEVEL || conf.logger.level;
conf.process = {};
conf.process.env = process.env;

// freeze so no one can alter this config accidentally
export default Object.freeze(conf);
