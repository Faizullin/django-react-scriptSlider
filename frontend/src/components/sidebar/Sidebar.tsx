import { useState } from "react";
import SearchInputBlock from "./SearchInputBlock";


const Sidebar = () => {
    const [open, setOpen] = useState<boolean>(false)
    // const props = usePage().props;
    // const {data:categories} = props.categories;
    // const {data:tags} = props.tags;
    // const {data:recentPosts} = props.recentPosts;
    // const appliedFilters = props.appliedFilters;
    // if(!appliedFilters.filters){
    //     appliedFilters['filters'] = {}
    // }

    // if(appliedFilters.filters){
    //     appliedFilters['filters']['tags'] = appliedFilters.filters?.tags || []
    //     appliedFilters['filters']['category'] = appliedFilters.filters?.category || null
    // } else {
    //     appliedFilters['filters']['tags'] =  []
    //     appliedFilters['filters']['category'] = null
    // }

    return (
        <>
            {/* <div className="lg:hidden">
                <MobileSidebar open={open} setOpen={setOpen} tags={tags} categories={categories} appliedFilters={appliedFilters}/>
            </div> */}
            <div className="lg:w-1/3 hidden lg:block">

                <div className={`sidebar ease-out duration-300
                    ${ open ? "translate-x-0 " : "translate-x-full" }  md:transform-none md:transition-none`} >

                    <SearchInputBlock />
                    <div className="sidebar-item categories">
                        <h3 className="sidebar-title">Categories</h3>
                        <ul className="mt-3 flex flex-wrap">
                            {/* { categories.map((category,index) => (
                                <li key={`category-${category.id}`}>
                                    <Link href={ route('post.category.index',category) } className={`${appliedFilters.filters.category === category.slug && 'active'}`}>{category.title}<span>({category.posts_count})</span></Link>
                                </li>
                            ))} */}
                        </ul>
                    </div>

                    <div className="sidebar-item recent-posts">
                        <h3 className="sidebar-title">Recent Posts</h3>

                        <div className="mt-3">

                            {/* { recentPosts.map((recentPost,index) => (
                                <div key={recentPost.id}
                                    className="post-item overflow-auto ">
                                    <img src={recentPost.imageUrl} alt="" className="h-[60px] object-contain"/>
                                    <div>
                                        <h4>
                                            <Link href={route(`post.show`,recentPost)}  dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(recentPost.description, {
                                                    USE_PROFILES: { html: true }
                                                } ),
                                            }} />
                                        </h4>
                                        <time dateTime="2020-01-01">{ recentPost.created_at }</time>
                                    </div>
                                </div>
                            )) } */}
                        </div>

                    </div>

                    <div className="sidebar-item tags">
                        <h3 className="sidebar-title">Tags</h3>
                        <ul className="mt-3 flex flex-wrap">
                            {/* { tags.map((tag,index) => (
                                <li key={`tag-${tag.id}`}>
                                    <Link href={ route('post.tag.index',tag) } className={`${appliedFilters.filters.tags.includes(tag.slug) && 'active'}`}>{tag.title}</Link>
                                </li>
                            ))} */}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
const TriggerButton = ({onClick}: {onClick: () => void}) => {
    return (
        <button
            type="button"
            className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
           // onClick={onClick}
        >
            <span className="sr-only">Filters</span>
            {/* <FunnelIcon className="h-5 w-5" aria-hidden="true" /> */}
        </button>
    );
}
Sidebar.TriggerButton = TriggerButton;
export default Sidebar;