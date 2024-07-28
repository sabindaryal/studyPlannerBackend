const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const UserSignup = sequelize.define('UserSignup', {
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
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Display Name is required' },
        len: { args: [1, 255], msg: 'Display Name must be between 1 and 255 characters' },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true, // Allowing null to validate email or mobile_No condition
      validate: {
        isEmail: { msg: 'Invalid email format' },
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'student',
    },
   
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notNull: { msg: 'Password is required' },
        len: { args: [4, 255], msg: 'Password must be between 4 and 255 characters' },
      },
    },
  }, {
    validate: {
      emailOrMobileRequired() {
        if (!this.email && !this.mobile_No) {
          throw new Error('Provide either email or mobile number');
        }
      },
    },
  });

  UserSignup.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    console.log('Hashed Password during Signup:', hashedPassword);
  });

  UserSignup.associate = (models) => {
    UserSignup.hasMany(models.UserDeviceInfo, { foreignKey: 'userId' });
   
  };

  return UserSignup;
};
