import { User } from '../models/user.js'
import { Status } from '../constants/index.js';
import { encriptar } from '../common/bcrypt.js';
import { Task } from '../models/task.js';
import { Op } from 'sequelize';

/*function getUsers(req,res){
    res.json({
        message: 'welcome to the users API from controller',

    });
}*/

async function getUsers(req, res, next) {
    try{
        const users = await User.findAll({
            attributes: ['id', 'username', 'password', 'status'],
            order: [['id', 'DESC']],
            where: {
                status: Status.ACTIVE,
            },
        });
        res.json(users);

    } catch (error){
        /*logger.error(error.message);
        res.status(500).json({ message: error.message});*/
        next(error);
    }
}

async function createUser(req, res, next) {

    //
    console.log('entro al controlador')
    //console.log(req.body)

    const { username, password } = req.body;
    try{
        const user = await User.create({
            username,
            password,
        });
        res.json(user);
    }catch(error){
       /*logger.error(error.message);
        res.status(500).json({ message: error.message });*/
        next(error);
    }
}

async function getUser(req, res, next) {
    const {id} = req.params;
    try{
         const user = await User.findOne({
            attributes: ['username', 'status'],
            where: {
                id,
            },
         });
         if(!user) res.status(400).json({message: "User not found"});
         res.json(user);
    }catch(error){
        next(error);
    }
}

async function updateUser(req, res, next) {
    const { id } = req.params;
    const { username, password } = req.body;
    try{
        if(!username && !password){
            return res
            .status(400).json({message: 'username or password is required'});
        }

        const passwordEncriptado = await encriptar(password);

        const user = await User.update({
            username,
            password: passwordEncriptado,
        },{
            where:{
                id,
            },
        })
        res.json(user);
    }catch(error){
        next(error);
    }
}

async function deleteUser(req, res, next) {
    const { id } = req.params;
    try{
        await User.destroy({
            where: {
                id,
            },
        });
        res.status(204).json({ message: 'User deleted'});
    }catch (error){
        next(error);
    }
}

async function activateInactive(req, res, next) {
    const { id } = req.params;
    const { status } = req.body;
    try{
        if(!status) res.status(400).json({message: 'Status is required'});

        const user = await User.findByPk(id);

        if(!user) res.status(404).json({message: 'User not found'});

        if(user.status === status)
            res.status(409).json({ message: 'Same status'});
        user.status = status;
        await user.save();
        res.json(user);
    }catch (error){
        next(error);
    } 
}

async function getTasks(req, res, next) {
    const { id } = req.params;
    try{
        const user  = await User.findOne({
            attributes: ['username'],
            include: [
                {
                    model: Task,
                    attributes: ['name', 'done'],
                    where: {
                        done : false
                    }
                }
            ],
            where : {
                id
            }
        });
        res.json(user);
    }catch (error){
        next(error);
    }
}


/// tarea
function paginationParams (query){
    const page = Math.max(parseInt(query.page, 10) || 1,1);
    const limit = Math.max(parseInt(query.limit,10) || 5,1);
    const search = (query.search || '').trim();
    const orderBy = ['id', 'username', 'status'].includes(query.orderBy)
                    ? query.orderBy : 'id';
    const orderDir = ['ASC', 'DESC'].includes(query.orderDir?.toUpperCase())
                    ? query.orderDir.toUpperCase(): 'DESC';
    const offset   = (page - 1) * limit;

    return {page, limit, search, orderBy, orderDir, offset};

}

function builwhereC(search){
    if(!search) return {};
    return {
        username: { [Op.iLike]: `%${search}` }
    };
}

function calculatePages(totalCount, limit){
    return Math.ceil(totalCount / limit) || 1;
}

async function listUserPagination(req, res, next) {
    try {
        const {page, limit, search, orderBy, orderDir, offset } =
        paginationParams(req.body);
        const where = builwhereC(search);

        const result = await User.findAndCountAll({
            where,
            order: [[orderBy, orderDir]],
            limit,
            offset,
            attributes: ['id', 'username', 'status']
        });

        const total = result.count;
        const data = result.rows;
        const pages = calculatePages(total, limit);

        return res.json({ total, page, pages, data });
    }catch(error){
        next(error);
    }
}


export default {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    activateInactive,
    getTasks,
    listUserPagination,
};
