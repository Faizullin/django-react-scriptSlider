import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { IScript } from '../../../models/IScript';
import { IScriptPage } from '../../../models/IScriptPage';
import { fetchScriptPageSave } from '../../../redux/store/reducers/scriptPageSlice';
import { fetchScriptCreate } from '../../../redux/store/reducers/scriptSlice';
import InputBlock from '../script_page/InputBlock';
import ScriptPageItemForm from '../script_page/ScriptPageItemForm';
import Loader from '../../loader/Loader';

interface IScriptCreateOrEditFormTypeFormProps {
  isEdit: boolean,
	payload?: IScript | null
	onSuccess: (data?:any) => void
}

interface IScriptCreateOrEditFormTypeFormState {
  title: string,
}

export interface IScriptPageCreateState {
  title: string,
  content: string,
  index: Page,
  id: string | null
}

type Page = number

export default function ScriptCreateOrEditFormTypeForm (props: IScriptCreateOrEditFormTypeFormProps) {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = React.useState<Page>(0)
  const [scriptPagesData, setScriptPagesData] = React.useState<IScriptPageCreateState[]>([])
  const [scriptData, setScriptData] = React.useState<IScriptCreateOrEditFormTypeFormState>({
      title: '',
  })
  const [saveOnScriptPageChange, setSaveOnScriptPageChange] = React.useState<boolean>(false)
  const [currentScriptPageFormData, setCurrentScriptPageFormData] = React.useState<IScriptPageCreateState>({
    title: '',
    content: '',
    index: 0,
    id: null
  })
  // const {loading, success, error,} = useAppSelector(state => state.scriptPage)
  const {loading, success, error,errors} = useAppSelector(state => state.script)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScriptData(data => ({
      ...data,
      [event.target.name]: event.target.value,
    } ))
  }

  const handleScriptPageItemChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
      event.preventDefault()
      setCurrentScriptPageFormData(formData => ({
        ...formData,
        [event.target.name]: event.target.value,
      }))
  }

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(saveOnScriptPageChange, scriptData, scriptPagesData)
    if(saveOnScriptPageChange) {
      dispatch(fetchScriptCreate({
        title: scriptData.title
      } as IScript))
    } else {
      dispatch(fetchScriptCreate({
        title: scriptData.title,
        pages: [...scriptPagesData],
      } as IScript)).then(response => {
          if(response.type === fetchScriptCreate.fulfilled.toString() && success) {
            props.onSuccess()
          }
      })
    }
    
  }
  const loadNewScriptPage = async () => {
    console.log("load new sciprPage")
  }
  const addEmptyScriptPageData = () => {
    let tmpScriptPages = [...scriptPagesData]
    tmpScriptPages.push({
      title: '',
      content: '',
    } as IScriptPageCreateState)
    setScriptPagesData(tmpScriptPages)
  }
  const handleAddScriptPage = () => {
    const pages_length = scriptPagesData.length
    const newScriptPageFormData = {
      index: pages_length + 1,
      title: '',
      content: '',
    } as IScriptPageCreateState
    console.log(pages_length,newScriptPageFormData)
    if (pages_length === 0) {
      let tmpScriptPagesData = [...scriptPagesData]
      tmpScriptPagesData.push(newScriptPageFormData)
      setScriptPagesData(tmpScriptPagesData)
      setCurrentScriptPageFormData(newScriptPageFormData)
      setCurrentPage(newScriptPageFormData.index)
      return
    }
    if (saveOnScriptPageChange) {
      dispatch(fetchScriptPageSave({
        id: currentScriptPageFormData.id,
        title: currentScriptPageFormData.title,
        content: currentScriptPageFormData.content,
        index: currentScriptPageFormData.index,
      } as IScriptPage)).then(response => {
        let tmpScriptPagesData = [...scriptPagesData]
        tmpScriptPagesData.push(newScriptPageFormData)
        setScriptPagesData(tmpScriptPagesData)
        setCurrentScriptPageFormData(newScriptPageFormData)
      })
    } else {
      let tmpScriptPagesData = [...scriptPagesData]
      for(let i = 0; i < pages_length; i++) {
        if(tmpScriptPagesData[i].index === currentScriptPageFormData.index) {
          tmpScriptPagesData[i] = {
            ...tmpScriptPagesData[i],
            ...currentScriptPageFormData,
          }
          setScriptPagesData(tmpScriptPagesData)
          break;
        }
      }
      tmpScriptPagesData.push(newScriptPageFormData)
      setScriptPagesData(tmpScriptPagesData)
      setCurrentScriptPageFormData(newScriptPageFormData)
    }
  }

  React.useEffect(() => {
    console.log(scriptPagesData)
  }, [scriptPagesData])
  
  // const handleTextEditorBeforeSubmit = (editorState: EditorState, editor: LexicalEditor) => {
  //   editorState.read(() => {
  //     const contentInHtml = $generateHtmlFromNodes(editor, null);
  //     console.log(contentInHtml)
  //   });
  // }
  React.useEffect(() => {
    // console.log("chnage to",currentPage,scriptPagesData[currentPage - 1])
    if(currentPage <= scriptPagesData.length && currentPage > 0) {
      if(saveOnScriptPageChange) {
        // dispatch(fetchScriptPageSave({
        //   id: currentScriptPageFormData.id,
        //   title: currentScriptPageFormData.title,
        //   content: currentScriptPageFormData.content,
        //   index: currentScriptPageFormData.index,
        // } as IScriptPage)).then(response => {
        //   let tmpScriptPagesData = [...scriptPagesData]
        //   tmpScriptPagesData.push({
        //     id: response.payload
        //   })
        //   setScriptPagesData(tmpScriptPagesData)
        //   setCurrentScriptPageFormData(newScriptPageFormData)
        // })
      } else {
        let tmpScriptPagesData = [...scriptPagesData]
        for(let i = 0; i < scriptPagesData.length; i++) {
          if(tmpScriptPagesData[i].index === currentScriptPageFormData.index) {
            tmpScriptPagesData[i] = {
              ...tmpScriptPagesData[i],
              ...currentScriptPageFormData,
            }
            setScriptPagesData(tmpScriptPagesData)
            break;
          }
        }
        setScriptPagesData(tmpScriptPagesData)
        setCurrentScriptPageFormData({...scriptPagesData[currentPage - 1]})
      }
    }
  }, [currentPage])
  
  

  const nextPage = () => {
    if(currentPage < scriptPagesData.length) {
      setCurrentPage(page => page + 1)
    }
  }
  const prevPage = () => {
    if(currentPage > 1) {
      setCurrentPage(page => page - 1)
    }
  }

  

  return (
    <form action="" onSubmit={handleSubmit}>
      
        <InputBlock name='title' value={scriptData.title} onChange={handleChange} error={errors.title}/>
        <div>
          { loading ? (
            <div>
              <Loader />
            </div>
          ) : (
            <div>
              {
                success ? (
                  <div>
                    { scriptPagesData.length > 0 && 
                    <ScriptPageItemForm value={currentScriptPageFormData} onChange={handleScriptPageItemChange} errors={errors} /> }
                  </div>
                ) : (
                  <div>
                    Error = {error}
                  </div>
                )
              }
            </div>
          ) }
        </div>
        <button type='button' onClick={handleAddScriptPage}>Add page</button>
        <button type='submit'>Save</button>
        <div>
          <label htmlFor='input-saveOnScriptPageChange'>Save on change</label>
          <input type='checkbox' 
            id='input-saveOnScriptPageChange' checked={saveOnScriptPageChange} onChange={e => setSaveOnScriptPageChange(saveOnScriptPageChange => !saveOnScriptPageChange)}/>
        </div>
{/*        {
          pages.length > 1 && (
            <div>
              <button type='button' onClick={prevPage}>Previous</button>
              { page }
              <button type='button' onClick={nextPage}>Next</button>
            </div>
          )
        }*/}
        <div>
          { scriptPagesData.map((script_page,i) => (
            <div key={script_page.index}>
                <button type='button' onClick={e => setCurrentPage(script_page.index)}>{ script_page.index } { script_page.title }</button>
            </div>
          )) }
        </div>
        
      </form>
  );
}
