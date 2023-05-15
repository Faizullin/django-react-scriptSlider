import React from "react";
import FileUpload from "../FileUpload";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchScriptCreate, fetchScriptEdit } from "../../../redux/store/reducers/scriptSlice";
import { IScript } from "../../../models/IScript";
import { setStatus } from "../../../redux/store/reducers/scriptModalSlice";
import { clearData } from "../../../redux/store/reducers/scriptFormSlice";

interface IScriptCreateOrEditFileTypeFormProps {
	isEdit: boolean,
	payload?: IScript | null
	onSuccess: (data?:any) => void
}

export default function ScriptCreateOrEditFileTypeForm(props: IScriptCreateOrEditFileTypeFormProps) {
	const dispatch = useAppDispatch()
	const { status} = useAppSelector(state => state.scriptModal)
	const [fileData, setFileData] = React.useState<File | null>(null)

	const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
		event?.preventDefault()
		if(fileData == null){
			return
		}
		if(props.isEdit && props.payload) {
			dispatch(fetchScriptEdit({file: fileData, data: props.payload},)).then(response => {
				if(response.type = fetchScriptCreate.fulfilled.toString()) {
					dispatch(clearData())
					props.onSuccess(response.payload)
				}
			})
		} else {
			dispatch(fetchScriptCreate(fileData,)).then(response => {
				if(response.type = fetchScriptCreate.fulfilled.toString()) {
					dispatch(clearData())
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

	React.useEffect(() => {
		if(status === 'submit' ) {
		  dispatch(setStatus(''))
		  handleSubmit()
		} else if (status === 'clear') {
		  dispatch(setStatus(''))
		  dispatch(clearData())
		}
	  }, [status, dispatch])

	return (
		<form onSubmit={handleSubmit} className="mt-5">
			{ props.isEdit && (
				<div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Replace file with new one for edit</div>
			) }
			<FileUpload onChange={handleChange} value={fileData}/>
		</form>
	) 
}