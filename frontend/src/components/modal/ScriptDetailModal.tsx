import { Fragment } from 'react';
import { useAppSelector } from '../../hooks/redux'
import { Dialog, Transition } from '@headlessui/react';

interface Props {
  show: boolean
  setShow: (a: boolean) => void
}

const ScriptDetailModal = (props: Props) => {
    const { script_payload } = useAppSelector(state => state.script)

    const handleClose = () => {
        props.setShow(false)
    }


  return (
      <Transition appear show={props.show} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={handleClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-screen-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Detail
                </Dialog.Title>
                <div className="mt-2 text-gray-500 border-t pt-2">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                Title
                            </th>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                              { script_payload?.title }
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Pages number
                            </th>
                            <td className="px-6 py-4">
                              { script_payload?.pages_count || 0 }
                            </td>
                        </tr>
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Owner
                            </th>
                            <td className="px-6 py-4">
                              { script_payload?.owner?.username || 'Undefined' }
                            </td>
                        </tr>
                        <tr>
                            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                Created At
                            </th>
                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                              { script_payload?.created_at }
                            </td>
                        </tr>
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Updated At
                            </th>
                            <td className="px-6 py-4">
                              { script_payload?.updated_at }
                            </td>
                        </tr>
                    </thead>
                  </table>
                </div>

                <div className="mt-4 flex flex-start">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="inline-flex mr-6 justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 "
                    >
                      Close
                    </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
  );
}

export default ScriptDetailModal