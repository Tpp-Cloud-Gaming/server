import {DataTypes} from 'sequelize'
import { sequelize } from '../database/database.js'
import { User } from './User.js';
import { Game } from './Game.js';

export const UserGame = sequelize.define('usergames', {
}, {timestamps: true});

UserGame.belongsTo(User,{foreignkey:"name",primarykey:"true"});
UserGame.belongsTo(Game,{foreignkey:"name",primarykey:"true"});