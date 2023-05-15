import React from 'react'
import TextInput from './TextInput'
import InputError from './InputError'
import PrimaryButton from './PrimaryButton'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { IForgotPasswordProps } from '../../../models/IAuthUser'
import { forgotUserPassword } from '../../../redux/store/reducers/authSlice'
import InputLabel from '../../InputLabel'

type Props = {}

const ForgotPasswordForm = (props: Props) => {
    const dispath = useAppDispatch()
    const {loading,errors} = useAppSelector(state => state.auth)
    const [data,setData] = React.useState<IForgotPasswordProps>({
        email: '',
    })
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setData(state => ({
          ...state,
          [name]: value
        } as Pick<IForgotPasswordProps, keyof IForgotPasswordProps>));
    }
    
    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispath(forgotUserPassword(data))
    }
    return (
        <form onSubmit={handleSubmit}>
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
                type="text"
                name="email"
                value={data.email}
                className="mt-1 block w-full"
                isFocused={true}
                onChange={handleInputChange}
            />

            <InputError message={errors.email} className="mt-2" />

            <div className="flex items-center justify-end mt-4">
                <PrimaryButton className="ml-4" processing={loading}>
                    Email Password Reset Link
                </PrimaryButton>
            </div>
        </form>
    )
}

export default ForgotPasswordForm