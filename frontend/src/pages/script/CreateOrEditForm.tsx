import React from 'react';
import ScriptCreateOrEditFormTypeForm from '../../components/form/script/CreateOrEditFormTypeForm';
import ScriptCreateOrEditFileTypeForm from '../../components/form/script/CreateOrEditFileTypeForm';
import { IScript } from '../../models/IScript';
import { useAppSelector } from '../../hooks/redux';

type FormType = 'file' | 'form';

interface IScriptCreateProps {
	isEdit: boolean,
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

const getClassNames = (active: boolean) => {
	return active ? 'inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active' : 'inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'
}

export default function ScriptCreateOrEditForm (props: IScriptCreateProps) {
	const [formType, setFormType] = React.useState<FormType>('form')
	const handleFormTypeChange = (value: string) => {
		setFormType(value as FormType)
	}
	
	return (
		<div>
			<div className="sm:hidden">
				<label htmlFor="tabs" className="sr-only">Select your country</label>
				<select defaultValue={formTypeOptions[0].value} onChange={(e) => handleFormTypeChange(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
					{ formTypeOptions.map((formTypeOption) => (
						<option key={formTypeOption.value} value={formTypeOption.value}>{ formTypeOption.label }</option>
					)) }
				</select>
			</div>
			<ul className="hidden sm:flex">
				{ formTypeOptions.map((formTypeOption) => (
					<li key={formTypeOption.value} className="mr-2" >
						<button onClick={(e) => handleFormTypeChange(formTypeOption.value)}
							className={getClassNames(formTypeOption.value === formType)}>{ formTypeOption.label }</button>
					</li>
				)) }
			</ul>
			{
				formType === 'form' 
					? <ScriptCreateOrEditFormTypeForm 
						isEdit={props.isEdit} onSuccess={props.onSuccess}/>
					: <ScriptCreateOrEditFileTypeForm 
						isEdit={props.isEdit} onSuccess={props.onSuccess}/>
			}
		</div>
	);
}
