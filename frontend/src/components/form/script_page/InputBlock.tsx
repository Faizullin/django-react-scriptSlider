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
        <div className="mb-6">
            <label htmlFor={`input-${props.name}`} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{ props.label }</label>
            <input type="text" id={`input-${props.name}`} name={props.name} value={props.value} onChange={props.onChange} //defaultValue={defaultValue}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            { props.error && (
                    <div className="mt-4">
                        <p className="text-sm text-red-600">{ props.error }</p>
                    </div>
                )
            }
        </div>
    )
}
export default InputBlock;