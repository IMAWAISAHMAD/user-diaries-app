import {Request,Response} from 'miragejs'
import {handleErrors} from '../server'
import {User} from '../../../interfaces/user.interface'
import {randomBytes} from 'crypto'

const generateToken = () => randomBytes(8).toString('hex');


export interface AuthInterface{
    token:string,
    user:User
}

const login = ( schema:any,req:Request):AuthInterface|Response=>{
   const {username,password} = JSON.parse(req.requestBody);
   const user = schema.users.findBy({username});
   if(!user){
       return handleErrors(null,'No user with that username exits!');
   }
   if(password!==user.password){
       return handleErrors(null,'Password is incorrect');
   }

   const token = generateToken();

   return{
       user:user.attr as User,
       token
   }
}

const signup = (schema:any,req:Request):AuthInterface|Response=>{
    const data = JSON.parse(req.requestBody);
    const exUser = schema.users.findBy({username:data.username});
    if(exUser){
        return handleErrors(null,'User with same name already Exists')
    }
    const user = schema.users.create(data);
    const token = generateToken();
    return{
        user:user.attr as User,
        token
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {login,signup};