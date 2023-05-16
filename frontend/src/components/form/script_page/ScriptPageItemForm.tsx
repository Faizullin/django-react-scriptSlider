import React, { useRef, useState } from 'react'
import InputBlock from './InputBlock'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import useDebouncedInput from '../../../hooks/useDebouncedInput';
import { IScriptPageCreateFormProps, setCurrentScriptPageFormData, setUpdated } from '../../../redux/store/reducers/scriptFormSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';

interface ScriptPageItemForm {
    errors: any
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet',
  'link', 'image',
];

const ScriptPageItemForm = (props: ScriptPageItemForm) => {
    const dispatch = useAppDispatch()
    const { currentPageIndex, currentScriptPageFormData, updated } = useAppSelector(state => state.scriptForm)
    const formFieldsRef = useRef<any>({});
    const [value, setValue] = React.useState<IScriptPageCreateFormProps>({
        index: 0,
        id: null,
        title: '',
        content: ''
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setValue({
          ...value,
          [event.target.name]: event.target.value,
        })
    }
    const handleContentChange = (content: string) => {
        setValue({  
            ...value,
            content,
        })
    }

    React.useEffect(() => {
        // console.log('currentScriptPageFormData',currentScriptPageFormData,updated)
        if(updated) {
            setValue({...currentScriptPageFormData})
            
        }
    }, [updated])

    React.useEffect(() => {
        if(updated) {
            dispatch(setUpdated(false))
        }
        // console.log('chaneg',value,currentScriptPageFormData,updated,currentScriptPageFormData.index === value.index)
        const timer = setTimeout(() => {
            if(currentScriptPageFormData.index !== value.index) {
                setValue(currentScriptPageFormData)
            } else {
                dispatch(setCurrentScriptPageFormData({...value}))
            }
        }, 1000)
        return () => {
          clearTimeout(timer);
        }
    }, [value])

    return (
        <div>
            <h1 className='mb-4'>Script Page #{ currentPageIndex } {value.title}</h1>
            <InputBlock value={value.title} name='title' onChange={ handleChange }/>
            <div>
              <ReactQuill
                value={value.content} onChange={handleContentChange} 
                modules={modules}
                formats={formats}
              />
            </div>
        </div>
    )
}

export default ScriptPageItemForm