import { useState, ChangeEvent } from "react"

export const useFormulary = <T extends Object>(objIn: T ) =>{
    const[obj, setObj] = useState(objIn);
    const doubleBond = ({target}: ChangeEvent<any>)=>{
        const {name, value} = target;
        setObj({
            ...obj,
            [name]:value
        })
    }
    return{
        obj,
        doubleBond,
        ...obj
    }
}