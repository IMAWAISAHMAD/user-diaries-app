import {Request,Response} from 'miragejs'
import {Diary} from '../../../interfaces/diary.interface'
import {User} from '../../../interfaces/user.interface'
import {Entry} from '../../../interfaces/entry.interface'
import {handleErrors} from '../server'
import dayjs from 'dayjs'

//Create Diary Function//
export const createDiary = (schema:any,req:Request):{user:User,diary:Diary}|Response =>{
    try
    {
        const{title,type,userId} = JSON.parse(req.requestBody) as Partial<Diary>;
        const exUser = schema.users.findBy({id:userId});
        if(!exUser){
            return handleErrors(null,'No such user exists');
        }
        const now = dayjs().format();
        const diary = exUser.createDiary({
            title,
            type,
            createdAt:now,
            updatedAt:now,
        })
        return{
            user:{
                ...exUser.attrs,
            },
            diary:diary.attrs
        };
    }
    catch(error)
    {
        return handleErrors(error,'Failed to create Diary.');
    }

};

//Update Diary Function//
export const updateDiary = (schema:any,req:Request):Diary|Response => {
    try
    {
        const diary = schema.diaries.find(req.params.id);
        const data = JSON.parse(req.requestBody) as Partial<Diary>;
        const now = dayjs().format();
        diary.update({
            ...data,
            updatedAt:now,
        });
        return diary.attrs as Diary;
    }
    catch(error)
    {
        return handleErrors(error,'Failed to update Diary.')
    }
};

//Get Diaries Function//
export const getDiaries = (schema:any,req:Request):Diary[]|Response => {
    try
    {
        const user = schema.users.find(req.params.id);
        return user.diary as Diary[];
    }
    catch(error)
    {
        return handleErrors(error,'No user diaries found.')
    }

}

//Create Entry Function//
export const createEntry = (schema:any,req:Request):{diary:Diary,entry:Entry}|Response => {
    try
    {
        const diary = schema.diaries.find(req.params.id);
        const {title,content} = JSON.parse(req.requestBody) as Partial<Entry>;
        const now = dayjs().format();
        const entry = diary.createEntry({
            title,
            content,
            createdAt:now,
            updatedAt:now,
        });
        diary.update({
            ...diary.attrs,
            updatedAt:now,
        });
        return{
            diary:diary.attrs,
            entry:entry.attrs,
        }
    }
    catch(error)
    {
        return handleErrors(error,'Failed to create entry.')
    }
}

//Update Entry Function//
export const updateEntry = (schema:any,req:Request):Entry|Response => {
    try
    {
        const entry = schema.entries.find(req.params.id);
        const data = JSON.parse(req.requestBody) as Partial<Entry>;
        const now = dayjs().format();
        entry.update({
            ...data,
            updatedAt:now,
        });
        return entry.attrs as Entry;
    }
    catch(error)
    {
        return handleErrors(error,'Failed to update Entry.');
    }
};

export const getEntries = (schema:any,req:Request):{entries:Entry[]}|Response => {
    try
    {
        const diary = schema.diaries.find(req.params.id);
        return diary.entry;

    }
    catch(error)
    {
     return  handleErrors(error,'Failed to get entries')   
    }
}