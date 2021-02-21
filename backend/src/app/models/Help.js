import Sequelize, { Model } from 'sequelize';

class Help extends Model {
    static init(sequelize) {
        super.init({
            title: Sequelize.STRING,
            description: Sequelize.TEXT,
            value: Sequelize.INTEGER,
        },
            {
                sequelize,

            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id' });
    }

}

export default Help;