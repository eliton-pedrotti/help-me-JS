import Sequelize, { Model } from 'sequelize';

class File extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL,
                get(){
                    return `http://localhost:3000/files${this.path}`
                }
            }
        },
            {
                sequelize
            }
        );

        return this;
    }

    // static associate(models) {
    //     this.belongsTo(models.HelpImage, { foreignKey: 'file_id' });
    // }
}

export default File;