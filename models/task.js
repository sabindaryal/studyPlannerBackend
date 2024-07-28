module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        task_Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isDone: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        fromDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        toDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    });

    Task.associate = (models) => {
        Task.belongsTo(models.UserSignup, { foreignKey: 'user_id', as: 'user' });
    };

    return Task;
};
