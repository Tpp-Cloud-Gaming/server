import {DataTypes} from 'sequelize'
import { sequelize } from '../database/database.js'

export const Game = sequelize.define('games', {
    name: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    category: {
        type:DataTypes.STRING
    },
    description:{
        type: DataTypes.STRING
    }
}, {timestamps: false}
);