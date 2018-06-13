/**
 * Module for registering socket events and their handlers.
 *
 * @author Sean Teare <steare573@gmail.com>
 * @since 2018-06-13
 */
import models from '../db';
import { generateRandomChildren } from '../lib/util';
import log from '../lib/logger';

/**
 * Register handlers for all socket events that are being subscribed to.
 *
 * @param {Socket} socket - SocketIo socket instance for the user sending the message
 * @param {function} broadcast - Function for emitting message to all connected users.
 */
export const registerEventHandlers = (socket, broadcast) => {
  /**
   * Broadcast the full tree data to all connected users
   *
   * @return void
   */
  const broadcastTreeData = async () => {
    try {
      log.info('Broadcasting tree data update');
      const treeData = await models.factory.findAll();
      broadcast('treeData', { factories: treeData || [] });
    } catch (err) {
      log.error('Error broadcasting tree data update');
    }
  };

  // On an init event, retrieve all tree data and send it back to the user
  socket.on('init', async () => {
    try {
      log.info(`Processing event init for socket ${socket.id}`);
      const treeData = await models.factory.findAll();
      socket.emit('treeData', { factories: treeData || [] });
    } catch (err) {
      log.error('Error retrieving initial tree data', err);
      socket.emit('error', { message: 'Unable to retrieve initial tree data', error: err });
    }
  });

  // On regenerate children event, regenerate child tree without editing any other factory data.
  socket.on('REGENERATE_FACTORY_CHILDREN', async (data) => {
    try {
      log.info(`Processing event REGENERATE_FACTORY_CHILDREN for socket ${socket.id}`);
      const factory = await models.factory.findById(data.id);
      factory.children = generateRandomChildren(factory);
      await factory.save();

      broadcastTreeData();
    } catch (err) {
      log.error(`Error regenerating children for factory(${data.id})`, err);
      socket.emit(
        'error',
        {
          message: `Error regenerating children for factory(${data.id})`,
          error: err,
        },
      );
    }
  });

  // add a new factory to the tree (and db)
  socket.on('ADD_FACTORY', async (data) => {
    try {
      log.info(`Processing event ADD_FACTORY for socket ${socket.id}`);
      await models.factory.create({ ...data, children: generateRandomChildren(data) });

      broadcastTreeData();
    } catch (err) {
      log.error(`Error attempting to add factory ${data.name}`, err);
      socket.emit('error', { message: `Error attempting to add factory ${data.name}`, error: err });
    }
  });

  // delete a factory from the tree
  socket.on('DELETE_FACTORY', async (data) => {
    try {
      log.info(`Processing event DELETE_FACTORY for socket ${socket.id}`);
      await models.factory.destroy({
        where: {
          id: data.id,
        },
      });

      broadcastTreeData();
    } catch (err) {
      log.error(`Error attempting to delete factory ${data.id}`, err);
      socket.emit(
        'error',
        {
          message: `Error attempting to delete factory ${data.id}`,
          error: err,
        },
      );
    }
  });

  // edit a factory that already exists.  Note that if any of the values change that would affect
  // the child list of numbers, that list is regenerated with the new list of parameters.
  socket.on('EDIT_FACTORY', async (data) => {
    try {
      log.info(`Processing event EDIT_FACTORY for socket ${socket.id}`);
      const factory = await models.factory.findById(data.id);

      if (
        factory.max !== data.max ||
        factory.min !== data.min ||
        factory.numVals !== data.numVals
      ) {
        factory.children = generateRandomChildren(data);
      }

      factory.max = data.max;
      factory.min = data.min;
      factory.name = data.name;
      factory.numVals = data.numVals;

      await factory.save();

      broadcastTreeData();
    } catch (err) {
      log.error(`Error editing factory(${data.id})`, err);
      socket.emit(
        'error',
        {
          message: `Error editing factory(${data.id})`,
          error: err,
        },
      );
    }
  });
};

export default {
  registerEventHandlers,
};
