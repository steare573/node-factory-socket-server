/**
 * Logger module for abstracting logger andcreating easy usesingleton w/o additional config each use
 *
 * @author Sean Teare <steare573@gmail.com>
 * @since 2018-06-13
 */
import bunyan from 'bunyan';
import config from '../config';

const defaults = config.logger;

export const createLogger = opts => bunyan.createLogger({ ...defaults, ...opts });

export default bunyan.createLogger(defaults);
