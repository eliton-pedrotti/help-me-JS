import Sequelize, { Model } from 'sequelize';

class HelpImage extends Model {
    static init(sequelize) {
        super.init({
            help_id: Sequelize.STRING,
            file_id: Sequelize.STRING,
        },
            {
                sequelize,

            }
        );
        return this;
    }
    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'file_id', });
        this.belongsTo(models.Help, { foreignKey: 'help_id', });
    }
}

export default HelpImage;