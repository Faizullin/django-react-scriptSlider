import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchScriptDelete, fetchScriptDetail, fetchScriptList } from '../../redux/store/reducers/scriptSlice';
import Layout from '../../components/layouts/Layout';
import ScriptDetailModal from '../../components/modal/ScriptDetailModal';
import ScriptCreateModal from '../../components/modal/ScriptCreateModal';
import ScriptCreateOrEditForm from './CreateOrEditForm';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import Sidebar, { TriggerButton } from '../../components/sidebar/Sidebar';
import PrimaryButton from '../../components/form/auth/PrimaryButton';
import { ISortProps, setFilters, setPage, setPageSize, setSorting } from '../../redux/store/reducers/scriptFilterSlice';
import Table from '../../components/table/Table';
import { IScript } from '../../models/IScript';
import { fetchScriptDetailWithPages } from '../../redux/store/reducers/scriptFormSlice';
import { setOpen } from '../../redux/store/reducers/scriptModalSlice';

export interface IScriptIndexProps {
}

export interface IScriptIndexState {
}



export default function ScriptIndex (props: IScriptIndexProps) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { filters, pagination } = useAppSelector(state => state.scriptFilter)
    const [searchParams, ] = useSearchParams()
    const {scripts,} = useAppSelector(state => state.script) 
    const [showDetailModal,setShowDetailModal] = React.useState(false)
    const [isEdit,setIsEdit] = React.useState<boolean>(false)
    const [filtersSidebarOpen, setFiltersSidebarOpen] = React.useState<boolean>(false)

    const handlePresentationbView = (id:string) => {
      navigate(`/script/${id}/presentation`)
    }
    const handleCreateOrEditScript = (id: string | null = null) => {
      if(id != null ) {
        dispatch(fetchScriptDetailWithPages({id,})).then(response => {
          if(response.type === fetchScriptDetailWithPages.fulfilled.toString()) {
            setIsEdit(true)
            dispatch(setOpen(true))
          }
        })
      } else {
        setIsEdit(false)
        dispatch(setOpen(true))
      }
    }
    const handleScriptDelete = (id: string) => {
      dispatch(fetchScriptDelete(id)).then(response => {
        if(response.type === fetchScriptDelete.fulfilled.toString()){
          dispatch(fetchScriptList())
        }
      })
    }
    const handleScriptDetailView = (id: string) => {
      dispatch(fetchScriptDetail({id,})).then(response => {
        if(response.type === fetchScriptDetail.fulfilled.toString()) {
          setShowDetailModal(true)
        }
      })
    }
    const handleCreateOrEditSuccess = () => {
      dispatch(setOpen(false))
      dispatch(fetchScriptList())
    }

    React.useEffect(() => {
      dispatch(fetchScriptList());
    }, [dispatch, pagination.page, pagination.pageSize, filters.sort]);
  
    const handlePageChange = (page: number) => {
      dispatch(setPage(page));
    };
  
    const handleSortingChange = (sorting: ISortProps) => {
      dispatch(setSorting(sorting));
    };
  
    const handleFiltersChange = (filters: any) => {
      dispatch(setPage(1));
      dispatch(setFilters(filters));
    };

    const handleRowsPerPageChange = (value: number) => {
        dispatch(setPageSize(value))
    };
    
    React.useEffect(() => {
        const paramActionValue = searchParams.get('action')
        if(paramActionValue === 'create') {
          dispatch(setOpen(true))
          searchParams.delete('action')
        }
    }, [searchParams])


    const columns = [
      { key: 'id', title: 'ID', sortable: true, render: (script: IScript, key: string | number) => (
        <th key={key} scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            { script.id }
        </th>
      ) },
      { key: 'title', title: 'Title' },
      { key: 'pages_count', title: 'Page Number', sortable: true },
      { key: 'created_at', title: 'Created At', sortable: true },
      { key: 'updated_at', title: 'Updated At', sortable: true },
      { key: 'actions', title: 'Actions', render: (script: IScript, key: string | number) => (
        <td key={key} className="px-6 py-4 text-right">
          <button onClick={(e) => handleScriptDetailView(script.id)} 
              className="font-medium bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded mx-1 my-1"
              >Detail</button>
          <button onClick={(e) => handlePresentationbView(script.id)}
              className="font-medium bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded mx-1 my-1"
              >Presentation</button>
          <button onClick={(e) => handleCreateOrEditScript(script.id)}
              className="font-medium bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded mx-1 my-1"
              >Edit</button>
          <button onClick={(e) => handleScriptDelete(script.id)}
              className="font-medium bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded mx-1 my-1"
              >Delete</button>
      </td>
        ) },
    ];

    
    return (
      <Layout>
        <Breadcrumbs>
            <h2>Scripts</h2>
            <p>Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat ipsum dolorem.</p>
        </Breadcrumbs>
        <section id="blog" className="blog">
            <div className="container mx-auto" data-aos="fade-up">
                <div className="flex justify-end items-center items-baseline border-b border-gray-200 px-6 pb-4 md:px-0">
                    <TriggerButton onClick={ () => setFiltersSidebarOpen(!filtersSidebarOpen) } />
                </div>

                <div className="flex mt-8">
                    <div className="lg:w-2/3 ">
                        <div className="flex flex-wrap mx-auto posts-list">
                          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                          <div className='w-[200px]'>
                            <PrimaryButton
                              onClick={() => handleCreateOrEditScript()}
                              className='rounded'
                              processing={false}
                            >
                              Create New
                            </PrimaryButton>
                          </div>
                          <Table 
                            columns={columns}
                            data={scripts}
                            onChangePage={handlePageChange}
                            onSortingChange={handleSortingChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                            page={pagination.page}
                            pageSize={pagination.pageSize}
                            count={pagination.totalItems || 0}
                            sorting={filters.sort}
                            />
                          </div>
                        </div>
                    </div>
                    <Sidebar open={filtersSidebarOpen} setOpen={setFiltersSidebarOpen}/>
                </div>
            </div>
        </section>
        <ScriptDetailModal show={showDetailModal} setShow={setShowDetailModal}/>
        <ScriptCreateModal>
          <ScriptCreateOrEditForm onSuccess={handleCreateOrEditSuccess} isEdit={isEdit}/>
        </ScriptCreateModal>
      </Layout>
    );
}
