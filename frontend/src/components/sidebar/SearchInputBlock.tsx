import { ChangeEvent, useState } from "react";

export default function SearchInputBlock(){
    // const { appliedFilters } = usePage().props;

    const [data,setData]= useState<{
        keyword: string,
    }>({
        keyword: ''  // appliedFilters?.filters?.search || ""
    });
    const [isResultOpen,setIsResultOpen] = useState(false)
    // const [searchResult,setSearchResult] = useState({
    //     tags:[],posts:[],
    // });

    // const getSearchResult = () => {
    //     axios.get(route(`api.search`),{
    //         params:{
    //             keyword:data.keyword,
    //         }
    //     }).then(response=>{
    //         const {posts,tags} = response.data;
    //         setSearchResult(requestResults => ({
    //             tags,posts,
    //         }));
    //         setIsResultOpen(!(posts.length == 0 && tags.length == 0));
    //     }).catch(()=>{
    //         setIsResultOpen(false);
    //     });
    // }

    // const handleChange = useDebouncedInput(function(e) {
    //     setData(data => ({
    //         ...data,
    //         "keyword":e.target.value,
    //     }));
    // },500)
    const handleChange = () => {

    }

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // post(route(`post.search`,{keyword:data.keyword}));
    }
    // useDidUpdateEffect(() => {
    //     if(data.keyword){
    //         getSearchResult();
    //     }else{
    //         setIsResultOpen(false);
    //     }
    // },[data.keyword])

    return (
        <div className="sidebar-item search-form relative">
            <h3 className="sidebar-title">Search</h3>
            <form className="mt-3" onSubmit={handleSubmit}>
                <input type="text" className="border-none focus:ring-0"
                    defaultValue={data.keyword} onChange={ handleChange }/>
                <button type="submit">
                    {/* <MagnifyingGlassIcon className=" text-white w-6 h-6"/> */}
                </button>
            </form>
            <div id="search-results" className={`${ isResultOpen ? "" : "hidden" } w-full absolute top-full left-0 `}>
                <div className="w-full border divide-y shadow max-h-72 bg-white">
                        <div id="search-results-posts" className="">
                            {/* { searchResult.posts.map((post,i)=>{
                                return (
                                    <div key={post.id} >
                                        <Link href={route(`post.show`,post)} className="block p-2 hover:bg-indigo-50">{ post.title }</Link>
                                    </div>
                                )
                            }) } */}
                        </div>
                        <div id="search-results-tags">
                            {/* { searchResult.tags.map((tag,i)=>{
                                return (
                                    <div key={tag.id} className="">
                                        <Link href={``} className="block p-2 hover:bg-indigo-50">#{ tag.title }</Link>
                                    </div>
                                )
                            }) } */}
                        </div>
                </div>
            </div>
        </div>
    );
}