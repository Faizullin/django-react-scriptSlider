import React from "react";

const InputBlock = (props: {
        name:string,
        value: string,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
        label?: string,
        defaultValue?: string
        error?: string
    }) => {
    let defaultValue = props.defaultValue
    if(defaultValue === undefined || defaultValue === null) {
        defaultValue = ''
    }
    return (
        <div>
            <label htmlFor={`input-${props.name}`}>{ props.label || props.name.toLocaleUpperCase() }</label>
            <input type="text" 
                id={`input-${props.name}`} name={props.name} value={props.value} onChange={props.onChange} />
            {
                props.error && (
                    <div>
                        <p className="text-sm text-red-600">{ props.error }</p>
                    </div>
                )
            }
        </div>
    )
}
export default InputBlock;