import React from "react";

interface IFileUploadProps {
	value: File | null,
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileUpload(props: IFileUploadProps) {
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		props.onChange(event)
	};

	return (
	<div>
		<input type="file" onChange={handleFileChange} />
		{ props.value && (

			<div>{ props.value.name } - { props.value.type }</div>
			)
		   }
	</div>
	);
}