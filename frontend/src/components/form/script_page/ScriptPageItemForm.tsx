import React from 'react'
import { IScriptPage } from '../../../models/IScriptPage'
import InputBlock from './InputBlock'
import { IScriptPageCreateState } from '../script/CreateOrEditFormTypeForm'

interface ScriptPageItemForm {
    value: IScriptPageCreateState,
    defaultValue?: IScriptPage,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    errors: any
}

const ScriptPageItemForm = (props: ScriptPageItemForm) => {
    const [value, setValue] = React.useState({} as IScriptPageCreateState)  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(event)
    }
    
    React.useEffect(() => {
        console.log("change child to",props.value)
        setValue(props.value)
    }, [props.value])
    return (
        <div>
            <h1>Script Page #{props.value.index} {value.title}</h1>
            <InputBlock defaultValue={value.title} value={value.title} name='title' onChange={handleChange}/>
            <InputBlock defaultValue={value.content} value={value.content} name='content' onChange={handleChange}/>
        </div>
    )
}

export default ScriptPageItemForm