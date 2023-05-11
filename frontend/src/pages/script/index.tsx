import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchScriptCreate, fetchScriptDelete, fetchScriptDetail, fetchScriptList } from '../../redux/store/reducers/scriptSlice';
import Layout from '../../components/layouts/Layout';
import Loader from '../../components/loader/Loader';
import ScriptDetailModal from '../../components/modal/ScriptDetailModal';
import ScriptCreateModal from '../../components/modal/ScriptCreateModal';
import ScriptCreateOrEditForm from './CreateOrEditForm';
import { IScript } from '../../models/IScript';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import ScriptItem from './ScriptItem';
import Sidebar from '../../components/sidebar/Sidebar';

export interface IScriptIndexProps {
}

export interface IScriptIndexState {
}

export default function ScriptIndex (props: IScriptIndexProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const {scripts, loading} = useAppSelector(state => state.script) 
    const [showDetailModal,setShowDetailModal] = React.useState(false)
    const [showCreateModal,setShowCreateModal] = React.useState(false)
    const [isEdit,setIsEdit] = React.useState<boolean>(false)
    const [modalPayload,setModalPayload] = React.useState<IScript | null | undefined>()

    React.useEffect(() => {
      loadData()
      console.log("get dscripts")
    },[dispatch])
    React.useEffect(() => {
      console.log("params change", params)
    },[params])
    
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
        <Breadcrumbs>
              <h2>Post</h2>
              <p>Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat ipsum dolorem.</p>
        </Breadcrumbs>
        <section id="blog" className="blog">
            <div className="container mx-auto" data-aos="fade-up">
                <div className="flex justify-end items-center items-baseline border-b border-gray-200 px-6 pb-4 md:px-0">
                    {/* <SortDropdown/> */}
                    {/* <Sidebar.TriggerButton onClick={ () => setFiltersSidebarOpen(!filtersSidebarOpen) } /> */}
                </div>

                <div className="flex mt-8">
                    <div className="lg:w-2/3 ">
                        <div className="flex flex-wrap mx-auto posts-list">
                            { scripts.map((script,index) => (
                                <ScriptItem key={script.id} script={script} />
                            ))}

                        </div>
                        {/* <Pagination items={posts}/> */}
                    </div>
                    <Sidebar />
                </div>
            </div>
        </section>
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
