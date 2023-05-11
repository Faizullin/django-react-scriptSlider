import React from "react";
import FileUpload from "../FileUpload";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchScriptCreate, fetchScriptEdit } from "../../../redux/store/reducers/scriptSlice";
import { IScript } from "../../../models/IScript";

interface IScriptCreateOrEditFileTypeFormProps {
	isEdit: boolean,
	payload?: IScript | null
	onSuccess: (data?:any) => void
}

export default function ScriptCreateOrEditFileTypeForm(props: IScriptCreateOrEditFileTypeFormProps) {
	const dispatch = useAppDispatch()
	const [fileData, setFileData] = React.useState<File | null>(null)

	const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
		event.preventDefault()
		if(fileData == null){
			return
		}
		if(props.isEdit && props.payload) {
			dispatch(fetchScriptEdit({file: fileData, data: props.payload},)).then(response => {
				if(response.type = fetchScriptCreate.fulfilled.toString()) {
					props.onSuccess(response.payload)
				}
			})
		} else {
			dispatch(fetchScriptCreate(fileData,)).then(response => {
				if(response.type = fetchScriptCreate.fulfilled.toString()) {
					props.onSuccess(response.payload)
				}
			})
		}
	}
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setFileData(event.target.files[0]);
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			{ props.isEdit && (
				<div>Replace file with new one for edit</div>
			) }
			<FileUpload onChange={handleChange} value={fileData}/>
			<button type="submit">Save</button>
		</form>
	) 
}