import React, { Dispatch, SetStateAction } from 'react'
import { IScript } from '../../models/IScript'

interface Props {
  show: boolean
  setShow: (a: boolean) => void
  payload?: IScript | null
}

const ScriptDetailModal = (props: Props) => {
    
    return (
      <>
        {props.show ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      { props.payload?.title }
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => props.setShow(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-auto">
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                              <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                                  <tr>
                                      <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                          Title
                                      </th>
                                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                        { props.payload?.title }
                                      </th>
                                  </tr>
                                  <tr>
                                      <th scope="col" className="px-6 py-3">
                                          Pages number
                                      </th>
                                      <td className="px-6 py-4">
                                        { props.payload?.pages_count || 0 }
                                      </td>
                                  </tr>
                                  <tr>
                                      <th scope="col" className="px-6 py-3">
                                         Owner
                                      </th>
                                      <td className="px-6 py-4">
                                        { props.payload?.owner?.name || 'Undefined' }
                                      </td>
                                  </tr>
                                  <tr>
                                      <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                          Created At
                                      </th>
                                      <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                                        { props.payload?.created_at }
                                      </td>
                                  </tr>
                                  <tr>
                                      <th scope="col" className="px-6 py-3">
                                          Updated At
                                      </th>
                                      <td className="px-6 py-4">
                                        { props.payload?.updated_at }
                                      </td>
                                  </tr>
                              </thead>
                          </table>
                      </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => props.setShow(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
}

export default ScriptDetailModal