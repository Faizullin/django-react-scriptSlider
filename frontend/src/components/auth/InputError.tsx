import React from "react";

interface IInputErrorProps extends React.HTMLAttributes<HTMLDivElement> {
    message: string
}

export default function InputError(props: IInputErrorProps) {
    return props.message ? <p className={'text-sm text-red-600 ' + props.className}>{ props.message }</p> : null;
}