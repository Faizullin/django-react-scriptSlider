import React, { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { mdiMagnify }  from '@mdi/js'
import { useAppDispatch } from "../../hooks/redux";
import { fetchScriptList} from "../../redux/store/reducers/scriptSlice";
import useDebouncedInput from "../../hooks/useDebouncedInput";
import Icon from "@mdi/react";
import { setFilters } from "../../redux/store/reducers/scriptFilterSlice";

export default function SearchInputBlock(){
    const dispatch = useAppDispatch()

    const [data,setData]= useState<{
        keyword: string,
    }>({
        keyword: ''
    });
    const [isResultOpen,setIsResultOpen] = useState(false)
    const [searchResult,setSearchResult] = useState<{
        scripts?: Array<any>,
        script_pages?: Array<any>,
    }>({
        scripts:[],
        script_pages:[],
    });

    const getSearchResult = (keyword?: string) => {
        // dispatch(fetchScriptList({
        //     search: data.keyword,
        // })).then(response => {
        //     if(response.payload === fetchScriptListByFilters.fulfilled.toString()) {
        //         const {scripts ,script_pages} = response.payload as {
        //             scripts?: Array<any>,
        //             script_pages?: Array<any>,
        //         };
        //         setSearchResult(requestResults => ({
        //             script_pages,
        //             scripts
        //         }));
        //         setIsResultOpen(!(scripts && scripts.length == 0 && script_pages && script_pages.length == 0));
        //     }
        // }).catch(()=>{
        //     setIsResultOpen(false);
        // });
    }

    const handleChange = useDebouncedInput(function(event: React.ChangeEvent<HTMLInputElement>) {
        setData(data => ({
            ...data,
            "keyword": event.target.value,
        }));
    },500)

    const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setFilters({
            search: data.keyword
        }))
        dispatch(fetchScriptList())
    }

    React.useEffect(() => {
        if(data.keyword){
            getSearchResult();
        }else{
            setIsResultOpen(false);
        }
    },[data.keyword])

    return (
        <div className="sidebar-item search-form relative">
            <h3 className="sidebar-title">Search</h3>
            <form className="mt-3" onSubmit={handleSubmit}>
                <input type="text" className="border-none focus:ring-0"
                    defaultValue={data.keyword} onChange={ handleChange }/>
                <button type="submit">
                    <Icon path={mdiMagnify}
                        size={1}
                        className="text-white w-6 h-6" />
                </button>
            </form>
            <div id="search-results" className={`${ isResultOpen ? "" : "hidden" } w-full absolute top-full left-0 `}>
                <div className="w-full border divide-y shadow max-h-72 bg-white">
                        <div id="search-results-posts" className="">
                            { searchResult.scripts?.map((script,i)=>{
                                return (
                                    <div key={script.id} >
                                        <Link to={`/script/${script.id}`} className="block p-2 hover:bg-indigo-50">{ script.title }</Link>
                                    </div>
                                )
                            }) }
                        </div>
                        <div id="search-results-tags">
                            { searchResult.script_pages?.map((script_page,i)=>{
                                return (
                                    <div key={script_page.id} className="">
                                        <Link to={`/script/${script_page.script}`} className="block p-2 hover:bg-indigo-50">#{ script_page.title }</Link>
                                    </div>
                                )
                            }) }
                        </div>
                </div>
            </div>
        </div>
    );
}