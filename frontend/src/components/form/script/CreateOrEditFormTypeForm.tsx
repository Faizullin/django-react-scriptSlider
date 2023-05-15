import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { IScript } from '../../../models/IScript';
import { fetchScriptCreate } from '../../../redux/store/reducers/scriptSlice';
import InputBlock from '../script_page/InputBlock';
import ScriptPageItemForm from '../script_page/ScriptPageItemForm';
import Loader from '../../loader/Loader';
import { fetchScriptEdit } from '../../../redux/store/reducers/scriptSlice';
import { setStatus } from '../../../redux/store/reducers/scriptModalSlice';
import { addScriptPage, setCurrentPageIndex, clearData, removeScriptPage } from '../../../redux/store/reducers/scriptFormSlice';
import Icon from '@mdi/react';
import { mdiEye, mdiTrashCan } from '@mdi/js';
import Table from '../../table/Table';
import { setPage } from '../../../redux/store/reducers/scriptFilterSlice';


interface IScriptCreateOrEditFormTypeFormProps {
  isEdit: boolean,
	payload?: IScript | null
	onSuccess: (data?:any) => void
}

interface IScriptCreateOrEditFormTypeFormState {
  title: string,
}

type Page = number


export default function ScriptCreateOrEditFormTypeForm (props: IScriptCreateOrEditFormTypeFormProps) {
    const dispatch = useAppDispatch()
    const { status } = useAppSelector(state => state.scriptModal)
    const { saveOnScriptPageChange, script_payload, success, currentPageIndex, currentScriptPageFormData, scriptPagesData } = useAppSelector(state => state.scriptForm)
    const { errors, loading } = useAppSelector(state => state.script)
    const [pageSize, setPageSize] = React.useState<number>(10)
    const [page, setPage] = React.useState<number>(0)

    const [scriptData, setScriptData] = React.useState<IScriptCreateOrEditFormTypeFormState>({
        title: '',
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setScriptData(data => ({
        ...data,
        [event.target.name]: event.target.value,
      } ))
  }

    const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if(!props.isEdit) {
        dispatch(fetchScriptCreate({
          title: scriptData.title,
          pages: scriptPagesData,
        } as IScript)).then(response => {
            if(response.type === fetchScriptCreate.fulfilled.toString() ) {
              dispatch(clearData())
              props.onSuccess()
            }
        })
      } else if (script_payload?.id) {
        dispatch(fetchScriptEdit({
          data: {
            id: script_payload.id,
            title: scriptData.title,
            pages: [...scriptPagesData],
          } as IScript
        } )).then(response => {
            if(response.type === fetchScriptEdit.fulfilled.toString() ) {
              dispatch(clearData())
              props.onSuccess()
            }
        })
      }
    }

    const handleAddScriptPage = () => {
        dispatch(addScriptPage())
    }

    const removePage = ( page_index: number) => {
        dispatch(removeScriptPage(page_index))
    }

    const handleChangeRowsPerPage = (pageSize: number) => {
        if(pageSize > scriptPagesData.length && page !== 0) {
            setPage(0)
        }
        setPageSize(pageSize)
    }

    const handleSetPage = (page: number) => {
        setPage(page)
    }

    const showScriptPagesData = React.useMemo(() => {
      const new_arr = scriptPagesData.slice((page) * pageSize, (page + 1) * pageSize)
      return scriptPagesData.slice((page) * pageSize, (page + 1) * pageSize)
    }, [pageSize, scriptPagesData , page])
 
    React.useEffect(() => {
      if(props.isEdit && script_payload && success) {
        setScriptData({...script_payload})
      }
    }, [props.isEdit])  

    React.useEffect(() => {
      if(status === 'submit' ) {
        dispatch(setStatus(''))
        handleSubmit()
      } else if (status === 'clear') {
        dispatch(setStatus(''))
        dispatch(clearData())
      }
    }, [status, dispatch])

    const columns = [
        {
          key: 'index',
          title: 'Index',
          render: (script_page: any, key: any) => (
            <th key={key} scope="row" className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              <button type='button' onClick={(e) => dispatch(setCurrentPageIndex(script_page.index))}>
                { script_page.index }
                </button>
            </th>
          )
        },
        {
          key: 'title',
          title: 'title',
          render: (script_page: any, key: any) => (
            <td key={key} className="px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <span
                    className="font-medium bg-transparent font-semibold"
                    >
                      {
                        script_page.title.length > 5 ? script_page.title.substr(0, 2) + '...' : script_page.title
                      }
                </span>
            </td>
          )
        },
        {
          key: 'action',
          title: 'Action',
          render: (script_page: any, key: any) => (
            <td key={key} className="px-6 text-right">
                <button type='button' onClick={(e) => dispatch(setCurrentPageIndex(script_page.index))}
                    className="font-medium bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded mx-1 my-1"
                    >
                    <Icon path={mdiEye} size={1} />
                </button>
                <button type='button' onClick={(e) => removePage(script_page.index)}
                    className="font-medium bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded mx-1 my-1"
                    >
                    <Icon path={mdiTrashCan} size={1} />
                </button>
            </td>
          )
        },
      ]
    
  
    return (
      <form onSubmit={handleSubmit} className="mt-5">
          <InputBlock name='title' value={scriptData.title} onChange={handleChange} error={errors.title}/>
          <div>
            { loading ? (
              <div>
                <Loader />
              </div>
            ) : (
              <>
                { currentPageIndex > 0 && 
                  <div className='flex flex-col items-center'>
                    <div className='w-full'>
                      <ScriptPageItemForm errors={errors} /> 
                    </div>
                    <div className='max-w-md items-center'>
                      <Table
                          page={page}
                          pageSize={pageSize}
                          columns={columns}
                          data={showScriptPagesData}
                          count={scriptPagesData.length}
                          onChangePage={handleSetPage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}
                          onSortingChange={ () => null }
                          />
                    </div>
                  </div>
                }
              </>
            ) }
          </div>
          <button type='button' onClick={handleAddScriptPage}
              className="mt-6 text-white bg-green-basic hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >Add page</button>
          {/* <div className="flex items-start mt-6">
            <div className="flex items-center h-5">
              <input id="input-saveOnScriptPageChange" checked={saveOnScriptPageChange} onChange={e => setSaveOnScriptPageChange(saveOnScriptPageChange => !saveOnScriptPageChange)}
                  type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"/>
            </div>
            <label htmlFor="input-saveOnScriptPageChange" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Save On Move</label>
          </div> */}
        </form>
    );
}
