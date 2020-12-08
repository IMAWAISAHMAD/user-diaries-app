import {Server,Model,Factory,hasMany,belongsTo,Response} from 'miragejs'
import user from './routes/user'
import * as diary from './routes/diary'

export const handleErrors = (error:any,message="An Error Occured") =>{
    
    console.error("Error: ", error);
    return new Response(400,undefined,{
        data:{
            message,
            isError:true
        }
    })
}

export const setupServer = (env?:string):Server => {
    return new Server({
        environment:env??'development',
        models:{
            diary:Model.extend({
                entries:hasMany(),
                user:belongsTo()
            }),
            user:Model.extend({
                diary:hasMany(),

            }),
            entry:Model.extend({
                diary:belongsTo(),  
            })
        },

        factories:{
            user:Factory.extend({
                username:'test',
                email:'test@email.com',
                password:'password'
            })
        },

        seeds:(server):any=>{
            server.create('user')
        },

        routes():void{
            this.urlPrefix = 'https://diaries.app';

            this.get('/diaries/entries/:id', diary.getEntries);
            this.get('/diaries/:id', diary.getDiaries);

            this.post('/auth/login', user.login);
            this.post('/auth/signup', user.signup);

            this.post('/diaries/', diary.createDiary);
            this.post('/diaries/entry/:id', diary.createEntry);

            this.put('/diaries/entry/:id', diary.updateEntry);
            this.put('/diaries/:id', diary.updateDiary);
        }
    })

}