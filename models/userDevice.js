module.exports = (sequelize, DataTypes) => {
  const UserDevice = sequelize.define('UserDevice', {
    user_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      validate: {
        notNull: { msg: 'User ID is required' },
        isInt: { msg: 'User ID must be an integer' },
        min: { args: [1], msg: 'User ID must be greater than or equal to 1' },
      },
    },
    user_token: {
      type: DataTypes.STRING,
      defaultValue: 'thisisidevidetokennnn',
    },
    device_token: {
      type: DataTypes.STRING,
      defaultValue: 'thisisidevidetokennnn',
    },
  });

  UserDevice.associate = (models) => {
    UserDevice.belongsTo(models.UserSignup, { foreignKey: 'user_Id', as: 'user' });
  };

  return UserDevice;
};
