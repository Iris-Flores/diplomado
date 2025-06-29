import {DataTypes} from 'sequelize'

import { sequelize } from '../database/database.js'
import { Status } from '../constants/index.js'
import { Task } from './task.js'
import { encriptar } from '../common/bcrypt.js';
import logger from '../logs/logger.js';

export const User = sequelize.define('users',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'username already exists',
        },
        validate: {
            notNull:{
                msg: 'username is required',
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull:{
                msg: 'password is required',
            }
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: Status.ACTIVE,
        validate: {
            isIn: {
               args: [['ACTIVE', 'INACTIVE']],
               msg: `status must be ${Status.ACTIVE} or ${Status.INACTIVE}`,
            },
        },
    },

});

User.hasMany(Task);
Task.belongsTo(User);

User.beforeCreate(async (user) => {
    try{
        user.password = await encriptar(user.password);

    }catch(error){
        /*logger.error(error.message);
        throw new Error ('error al encriptar antes de crear');*/
        next(error);
    }
});

User.beforeUpdate(async (user) => {
    try{
        user.password = await encriptar(user.password);

    }catch(error){
        /*logger.error(error.message);
        throw new Error ('Error al encriptar antes de actualizar');*/
        next(error);
    }
});