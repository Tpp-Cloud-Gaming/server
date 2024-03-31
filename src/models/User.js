import {DataTypes} from 'sequelize'
import { sequelize } from '../database/database.js'

export const User = 
    sequelize.define('users', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        email: {
            type:DataTypes.STRING
        },
        credits:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, 
    {timestamps: false
});
