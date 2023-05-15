import React, { Fragment } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { setOpen, setStatus, setSubmit } from '../../redux/store/reducers/scriptModalSlice'
import { clearData } from '../../redux/store/reducers/scriptFormSlice'
import { Dialog, Transition } from '@headlessui/react'

interface Props {
    children: React.ReactNode,
}

const ScriptCreateModal = (props: Props) => {
    const dispatch = useAppDispatch()
    const { isOpened } = useAppSelector(state => state.scriptModal)

    const handleClose = () => {
        dispatch(clearData())
        dispatch(setOpen(false))
    }

    const handleSubmit = () => {
        dispatch(setStatus('submit'))
    }

    return (
        <Transition appear show={isOpened} as={Fragment}>
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
                    Create/Edit Form
                  </Dialog.Title>
                  <div className="mt-2 text-gray-500 border-t pt-2">
                      { props.children }
                  </div>

                  <div className="mt-4 flex flex-start">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex mr-6 justify-center px-4 py-2 text-sm text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 duration-300 "
                      >
                        Close
                      </button>
                      <button type="button"
                        onClick={handleSubmit}
                        className="inline-flex text-white bg-green-basic hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          Save
                        </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
    );
}

export default ScriptCreateModal