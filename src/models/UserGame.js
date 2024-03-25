import {DataTypes} from 'sequelize'
import { sequelize } from '../database/database.js'
import { User } from './User.js';
import { Game } from './Game.js';

export const UserGame = sequelize.define('usergames', {
}, {timestamps: false});


User.belongsToMany(Game, {through: UserGame})
Game.belongsToMany(User, {through: UserGame})
