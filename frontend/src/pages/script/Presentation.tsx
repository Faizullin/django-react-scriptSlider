import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ScriptService from "../../services/ScriptService";
import { IPresentationUrlData } from "../../models/response/IPresentaionData";
import Loader from "../../components/loader/Loader";
import ScriptPageService from "../../services/ScriptPageService";
import { IScript } from "../../models/IScript";
import { IScriptPage } from "../../models/IScriptPage";
import CodeCopyButton from "../../components/form/CodeCopyButton";
import { useAppDispatch } from "../../hooks/redux";
import { fetchScriptDetail } from "../../redux/store/reducers/scriptSlice";
import { AxiosError } from "axios";
import Layout from "../../components/layouts/Layout";

interface IScriptPresentation {
}

const ScriptPresentation: React.FC<IScriptPresentation> = (props) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { scriptId } = useParams();
    const [script, setScript] = React.useState<IScript | null>(null);
    const [isConnected, setIsConnected] = React.useState(false);
    const [urlData, setUrlData] = React.useState<IPresentationUrlData | null>(null);
    const [status, setStatus] = React.useState("");
    const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
    const [currentScriptPageData, setCurrentScriptPageData] = React.useState<IScriptPage | null>(null);
    const ws = React.useRef<WebSocket | null>(null);

    React.useEffect(() => {
        if(scriptId) {
            dispatch(fetchScriptDetail({id:scriptId})).then(response => {
                if(response.type === fetchScriptDetail.fulfilled.toString()) {
                    setScript({...response.payload as IScript})
                    ScriptService.get_track_url(scriptId).then(response => {
                        setUrlData(response.data)
                        reconnect(response.data)
                    }).catch(error => {
                        console.log("error",error.response)
                    })
                } else if (response.type === fetchScriptDetail.rejected.toString()) {
                    if (response.payload instanceof AxiosError && response.payload?.response?.status === 404) {
                        navigate('/script')
                    }
                }
            })
        }
        return () => {
            if(ws.current instanceof WebSocket) {
                return ws.current.close();
            }
        }
    }, []);

    const reconnect = (response: IPresentationUrlData | null = null) => {
        if (!isConnected) {
            const path = response?.ws_url || urlData?.ws_url || ''
            ws.current = new WebSocket(path + '?token=' + localStorage.getItem('token',)); // создаем ws соединение
            ws.current.onopen = () => {
                console.log("Соединение открыто")
                setIsConnected(true)
            }
            ws.current.onclose = () => {
                setStatus("Соединение закрыто"); 
                setIsConnected(false)
            }
            ws.current.onmessage = (message) => {
                const data = JSON.parse(message.data)
                processData(data.message)
            }

        }
    }
    const processData = (data: {
            index: number | string,
            id?: number
        }) => {
        console.log(data,data.index, Number(data.index))
        if(data.index === 'next') {
            handleNextPage()
        }
        else if(data.index === 'prev') {
            handlePrevPage()
        } else if (Number(data.index)) {
            console.log(data.index)
            setCurrentPageIndex(Number(data.index))
        }
    }
    const handleNextPage = () => {
        if(currentPageIndex > 0 && script?.pages_count && currentPageIndex < script?.pages_count) {
            setCurrentPageIndex(currentPageIndex => currentPageIndex + 1)
        }
    }
    const handlePrevPage = () => {
        if(currentPageIndex > 1 && script?.pages_count && currentPageIndex <= script?.pages_count) {
            setCurrentPageIndex(currentPageIndex => currentPageIndex - 1)
        }
    }
    const handleOpenConnection = () => reconnect()
    const handleCloseConnection = () => {
        if(isConnected && ws.current != null) {
            ws.current.close();
            setIsConnected(false)
        }
    }
    const loadScriptPage = (id:string) => {
        ScriptPageService.getByScriptAndIndex({id:scriptId} as IScript, currentPageIndex.toString()).then(response => {
            if (response.data.length > 0) {
                setCurrentScriptPageData(response.data[0])
            } else {
                setCurrentScriptPageData(null)
            }
        })
    }
    React.useEffect(() => {
        if(currentPageIndex > 0) {
            loadScriptPage(currentPageIndex.toString())
        }
    }, [currentPageIndex])
    
    if(!scriptId) {
        return <Navigate to='/script'/>
    }

    return (
        <Layout>
            { urlData == null ?
                <Loader /> :
                <div>
                    <div>
                        <h2>{ status }</h2>
                        <p className="bg-slate-400">{ urlData.command }</p>
                        <CodeCopyButton code={urlData.command} />
                        {/* <button onClick={() => {
                            if(ws.current) {
                                ws.current.send(JSON.stringify({
                                    'type': 'chat_message',
                                    'message': 'sex',
                                }))
                            }
                        }}>Send Test</button> */}
                        <div>
                            { currentPageIndex > 0 && currentScriptPageData != null && (
                                <div>
                                    { currentScriptPageData.title }
                                    { currentScriptPageData.content }
                                </div>
                            ) }
                        </div>
                    </div>
                    <button onClick={handlePrevPage}>Prev</button>
                    { currentPageIndex }
                    <button onClick={handleNextPage}>Next</button>
                    <button onClick={() => {
                        if(isConnected && ws.current instanceof WebSocket) {
                            handleCloseConnection()
                        } else {
                            handleOpenConnection()
                        }
                    }}>{isConnected ? 'Остановить соединение' : 'Открыть соединение' }</button>
                </div>
            }
        </Layout>
    )
}

export default ScriptPresentation;