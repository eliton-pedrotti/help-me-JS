import Sequelize from 'sequelize';
import dbConfig from '../config/database';

import User from '../app/models/User';
import Help from '../app/models/Help';
import File from '../app/models/File';
import HelpImage from '../app/models/HelpImage';

const connection = new Sequelize(dbConfig);
 
const models = [User, Help, File, HelpImage];

User.init(connection);
Help.init(connection);
File.init(connection);
HelpImage.init(connection);

models.map(model => model.associate && model.associate(connection.models));



export default connection;
