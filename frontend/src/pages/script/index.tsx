import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchScriptCreate, fetchScriptDelete, fetchScriptDetail, fetchScriptList } from '../../redux/store/reducers/scriptSlice';
import Layout from '../../components/layouts/Layout';
import Loader from '../../components/loader/Loader';
import ScriptDetailModal from '../../components/modal/ScriptDetailModal';
import ScriptCreateModal from '../../components/modal/ScriptCreateModal';
import ScriptCreateOrEditForm from './CreateOrEditForm';
import { IScript } from '../../models/IScript';
import { useNavigate } from 'react-router-dom';

export interface IScriptIndexProps {
}

export interface IScriptIndexState {
}

export default function ScriptIndex (props: IScriptIndexProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const {scripts, loading} = useAppSelector(state => state.script) 
    const [showDetailModal,setShowDetailModal] = React.useState(false)
    const [showCreateModal,setShowCreateModal] = React.useState(false)
    const [isEdit,setIsEdit] = React.useState<boolean>(false)
    const [modalPayload,setModalPayload] = React.useState<IScript | null | undefined>()

    React.useEffect(() => {
      loadData()
      console.log("get dscripts")
    },[dispatch])
    
    const loadData = () => {
      dispatch(fetchScriptList())
    }

    const handlePresentationbView = (id:string) => {
      navigate(`/script/${id}/presentation`)
    }

    const handleCreateOrEditScript = (id: string | null = null) => {
      if(id != null ) {
        dispatch(fetchScriptDetail({id,})).then(response => {
          if(response.type === fetchScriptDetail.fulfilled.toString()) {
            setModalPayload({
              ...response.payload as IScript
            })
            setIsEdit(true)
            setShowCreateModal(true)
          }
        })
      } else {
        setModalPayload(null)
        setIsEdit(false)
        setShowCreateModal(true)
      }
    }

    const handleScriptDelete = (id: string) => {
      dispatch(fetchScriptDelete(id)).then(response => {
        if(response.type === fetchScriptDelete.fulfilled.toString()){
          loadData()
        }
      })
    }
    const handleScriptDetailView = (id: string) => {
      dispatch(fetchScriptDetail({id,})).then(response => {
        if(response.type === fetchScriptDetail.fulfilled.toString()) {
          setModalPayload({
            ...response.payload as IScript
          })
          setShowDetailModal(true)
        }
      })
    }
    const handleCreateOrEditSuccess = () => {
      setShowCreateModal(false)
      loadData()
    }
    return (
      <Layout>
        <button onClick={(e) => handleCreateOrEditScript()}>Create New</button>
        { !loading ? (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Page Number</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                { scripts.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val.id}</td>
                      <td>{val.title}</td>
                      <td>12</td>
                      <td>{val.created_at}</td>
                      <td>{val.updated_at}</td>
                      <td>
                        <button onClick={(e) => handleScriptDetailView(val.id)}>Detail</button>
                        <button onClick={(e) => handlePresentationbView(val.id)}>Presentation</button>
                        <button onClick={(e) => handleCreateOrEditScript(val.id)}>Edit</button>
                        <button onClick={(e) => handleScriptDelete(val.id)}>Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <ScriptDetailModal show={showDetailModal} setShow={setShowDetailModal} 
              payload={modalPayload}/>
            <ScriptCreateModal show={showCreateModal} setShow={setShowCreateModal}>
              <ScriptCreateOrEditForm onSuccess={handleCreateOrEditSuccess} isEdit={isEdit} payload={modalPayload}/>
            </ScriptCreateModal>
          </div>
        ) : (
          <Loader />
        ) }
      </Layout>
    );
}
