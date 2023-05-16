import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { IPresentationUrlData } from "../../models/response/IPresentaionData";
import Loader from "../../components/loader/Loader";
import ScriptPageService from "../../services/ScriptPageService";
import { IScript } from "../../models/IScript";
import { IScriptPage } from "../../models/IScriptPage";
import CodeCopyButton from "../../components/form/CodeCopyButton";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import Layout from "../../components/layouts/Layout";
import Breadcrumbs from "../../components/Breadcrumbs";
import { fetchScriptPresentationConnect, setCurrentPageIndex } from "../../redux/store/reducers/scriptPresentationSlice";
import { AxiosError } from "axios";
import { Pagination } from "../../components/table/Table";
import ReactQuill from "react-quill";

interface IScriptPresentation {
}

const ScriptPresentation: React.FC<IScriptPresentation> = (props) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { scriptId } = useParams();
    const { loading, currentPageIndex, script_payload, urlData } = useAppSelector(state => state.scriptPresentation)
    const [isConnected, setIsConnected] = React.useState(false);
    const [currentScriptPageData, setCurrentScriptPageData] = React.useState<IScriptPage | null>(null);
    const ws = React.useRef<WebSocket | null>(null);

    React.useEffect(() => {
        if(!isConnected && scriptId) {
            reconnect()
        }
        return () => {
            if(ws.current != null) {
                return ws.current.close();
            }
        }
    }, [scriptId]);

    const reconnect = () => {
        if(!isConnected && scriptId) {
            dispatch(fetchScriptPresentationConnect(scriptId)).then(response => {
                if(response.type === fetchScriptPresentationConnect.fulfilled.toString()) {
                    const {ws_url: path } = response.payload as IPresentationUrlData
                    ws.current = new WebSocket(path + '?token=' + localStorage.getItem('token',)); 
                    ws.current.onopen = () => {
                        setIsConnected(true)
                    }
                    ws.current.onclose = () => {
                        setIsConnected(false)
                        ws.current = null
                    }
                    ws.current.onmessage = (message) => {
                        const data = JSON.parse(message.data)
                        processData(data.message)
                    }
                }
                else if (response.type === fetchScriptPresentationConnect.rejected.toString() ){
                    if(response.payload instanceof AxiosError && response.payload.response?.status === 404) {
                        navigate('/script')
                    }
                }
            })
        }
    }
    const processData = (data: {
            index: number | string,
            id?: number
        }) => {
        if(data.index === 'next') {
            handleNextPage()
        }
        else if(data.index === 'prev') {
            handlePrevPage()
        } else if (Number(data.index)) {
            dispatch(setCurrentPageIndex(Number(data.index) - 1))
        }
    }
    const handleNextPage = () => {
        if(currentPageIndex >= 0 && script_payload?.pages_count && currentPageIndex < script_payload?.pages_count - 1) {
            dispatch(setCurrentPageIndex(currentPageIndex + 1) )
        }
    }
    const handlePrevPage = () => {
        if(currentPageIndex > 0 && script_payload?.pages_count && currentPageIndex < script_payload?.pages_count) {
            dispatch(setCurrentPageIndex(currentPageIndex - 1) )
        }
    }
    
    const handleToggleConnection = () => {
        if(!isConnected) {
            return reconnect()
        }
        else if(isConnected && ws.current != null) {
            ws.current.close();
        }
        setIsConnected(false)
    }
    const loadScriptPage = (id:string) => {
        ScriptPageService.getByScriptAndIndex({id:scriptId} as IScript, (currentPageIndex + 1).toString() ).then(response => {
            if (response.data.length > 0) {
                setCurrentScriptPageData(response.data[0])
            } else {
                setCurrentScriptPageData(null)
            }
        })
    }
    const handlePaginate = (page: number) => {
        dispatch(setCurrentPageIndex(page))
    }
    React.useEffect(() => {
        loadScriptPage(currentPageIndex.toString())
    }, [currentPageIndex])
    
    if(!scriptId) {
        return <Navigate to='/script'/>
    }

    return (    
        <Layout>
            <Breadcrumbs />
            <section>
            <div className="" data-aos="fade-up">
                { loading ?
                    <Loader /> :
                    <div>
                        <div className="bg-gray-100 py-2 px-6">
                            <div className="container mx-auto">
                                <span className={`mr-6 py-2 px-2 border rounded ${ isConnected ? 'border-green-700 text-green-700 ' : 'text-red-700 border-red-700' }`}>{ isConnected ? "Connected"  : "Disconnected" }</span>
                                <button onClick={handleToggleConnection} 
                                className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                                    >{ isConnected ? 'Close connection' : 'Open connection' }</button>
                            </div>
                        </div>
                        <div className="container mx-auto">
                            <div className="mt-2 sm:mt-6">
                                <CodeCopyButton code={urlData.command} />
                            </div>
                        </div>
                        <div className="bg-gray-100 py-2 px-6">
                            <div className="container mx-auto ">
                                <div className="lg:static text-sm">
                                    { urlData.command }
                                </div>
                            </div>
                        </div>
                        <div className="container mx-auto">
                            <div className="mt-4 mb-6">
                                { currentScriptPageData != null && (
                                    <div>
                                        <p className="text-xl font-bold">{ currentScriptPageData.title }</p>
                                        <div className="mt-2 font-normal">
                                            <ReactQuill
                                                value={currentScriptPageData.content}
                                                readOnly={true}
                                                theme={"bubble"}
                                                />
                                        </div>
                                    </div>
                                ) }
                            </div>
                            { script_payload?.pages_count && (
                                <Pagination 
                                    page={currentPageIndex}
                                    rowsPerPage={1}
                                    count={script_payload.pages_count}
                                    onChangePage={handlePaginate}
                                    showOnlyPrimitive={true}
                                    />
                            ) }
                        </div>
                    </div>
                }
                </div>
            </section>
        </Layout>
    )
}

export default ScriptPresentation;