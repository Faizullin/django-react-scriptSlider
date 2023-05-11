import { ReactNode } from "react";
import { Params, useMatches } from "react-router-dom";

type RouteWithHandle<Handle extends string, Value> = {
    id: string;
    pathname: string;
    params: Params<string>;
    data: unknown;
    handle: Record<Handle, Value>;
  };
  
  function isRecordWithKey<T extends string>(
    value: unknown,
    key: T,
  ): value is Record<T, unknown> {
    return !!value && typeof value === "object" && key in value;
  }
  
  function hasHandle<Handle extends string, Value>(
    handle: Handle,
    valuePredicate?: (v: unknown) => v is Value,
  ) {
    return (
      route:
        | {
            handle: unknown;
          }
        | RouteWithHandle<Handle, Value>,
    ): route is RouteWithHandle<Handle, Value> => {
      return (
        !!route.handle &&
        isRecordWithKey(route.handle, handle) &&
        typeof route.handle[handle] === 'function'
        // (!valuePredicate ||
        //   (handle in route.handle && valuePredicate(route.handle[handle])))
      );
    };
  }
  
  function isString(value: unknown): value is string {
    return typeof value === 'string';
  }

interface IBreadcrumbsProps {
    children: ReactNode
}

interface IMatchProps {
    id: string;
    pathname: string;
    params: Params<string>;
    data: unknown;
    handle: IMatchHandleProps;
}

interface IMatchHandleProps {
    crumb: (data: any) => void | unknown
}

export default function Breadcrumbs({children}: IBreadcrumbsProps) {
    const matches = useMatches();
    const matches_crumbs = matches.filter((match) => {
        const handle = match.handle as IMatchHandleProps
        return Boolean(handle.crumb)
    }) as Array<IMatchProps>
    const crumbs: Array<ReactNode> = matches_crumbs
        .map((match) => {
            const handle = match.handle as IMatchHandleProps
            return handle.crumb(match.data)
        }) as Array<ReactNode>;
	return (
        <div className="breadcrumbs" aria-label="Breadcrumb">
            <div className={`page-header flex items-center ${ !children ? "hidden" : "" }`} style={{backgroundImage: '',}}>
                <div className="container mx-auto relative">
                    <div className="row flex justify-center">
                        <div className="lg:w-1/2 text-center">
                            { children }
                        </div>
                    </div>
                </div>
            </div>
            <nav>
                <div className="container mx-auto px-4">
                    <ol>
                        { crumbs.map((crumb, index) => (
                            <li key={index}>{crumb}</li>
                        )) }
                    </ol>
                </div>
            </nav>
        </div>
    );
}