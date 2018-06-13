/**
 * Database model for factory table storing factories, paramters, and children
 *
 * @author Sean Teare <steare573@gmail.com>
 * @since 2018-06-13
 */
export default (sequelize, DataTypes) =>
  sequelize.define('factory', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    max: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    min: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    numVals: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      name: 'num_vals',
    },
    children: {
      type: DataTypes.JSON(),
      allowNull: true,
    },
  }, {
    tableName: 'factory',
    timestamps: true,
    underscored: true,
  });
