module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true, // Description can be optional
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Title is required',
          },
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Category;
  };
  