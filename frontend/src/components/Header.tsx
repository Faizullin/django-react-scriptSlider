import React, { ReactNode } from "react";

type IHeaderProps = {
    children: ReactNode
  }

export default function Header({children}: IHeaderProps ){
    const [isSticked,setIsSticked] = React.useState(false);
    const [headerValue,setHeaderValue] = React.useState({
        headerOffset:null,
    });

    const isSticky = () => {
        if (headerValue.headerOffset && (headerValue.headerOffset - window.scrollY) < 0) {
            setIsSticked(true);
        } else {
            setIsSticked(false);
        }
    };
    React.useEffect(() => {
        const selectHeader = document.querySelector('#header');
        // if(selectHeader) {
        //     setHeaderValue(data => ({
        //         headerOffset: selectHeader.offsetTop,
        //     }));
        // }    
    }, []);
    React.useEffect(()=>{
        window.addEventListener("scroll", isSticky);
        return () => {
            window.removeEventListener("scroll", isSticky);
        };
    },[headerValue])
    return (
        <header id="header" className={`header flex items-center ${isSticked? "sticked" : ""}`}>
            { children }
        </header>
    );
}