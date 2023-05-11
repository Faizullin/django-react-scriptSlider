import React from 'react';
import ScriptCreateOrEditFormTypeForm from '../../components/form/script/CreateOrEditFormTypeForm';
import ScriptCreateOrEditFileTypeForm from '../../components/form/script/CreateOrEditFileTypeForm';
import { IScript } from '../../models/IScript';

type FormType = 'file' | 'form';

interface IScriptCreateProps {
	isEdit: boolean,
	payload?: IScript | null
	onSuccess: (data?:any) => void
}

const formTypeOptions: Array<{label: string, value: FormType}> = [
	{
		value: 'file',
		label: 'File'
	},
	{
		value: 'form',
		label: 'Form',
	}
]

export default function ScriptCreateOrEditForm (props: IScriptCreateProps) {
  const [formType, setFormType] = React.useState<FormType>('form')
  
  return (
    <div>
    	{
    		formType === 'form' 
				? <ScriptCreateOrEditFormTypeForm 
					isEdit={props.isEdit} payload={props.payload} onSuccess={props.onSuccess}/>
				 : <ScriptCreateOrEditFileTypeForm 
				 	isEdit={props.isEdit} payload={props.payload} onSuccess={props.onSuccess} />
    	}
    	<select defaultValue={formType} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
    		setFormType(event.target.value as FormType)
    	}}>
    		{ formTypeOptions.map((formTypeOption,index) => (
    			<option key={index} value={formTypeOption.value}>{ formTypeOption.label }</option>
    		)) }
    	</select>
    </div>
  );
}
