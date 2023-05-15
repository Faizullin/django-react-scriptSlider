import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, } from '../../../redux/store/reducers/authSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import InputLabel from '../../InputLabel';
import TextInput from './TextInput';
import PrimaryButton from './PrimaryButton';
import { IRegisterProps } from '../../../models/IAuthUser';
import InputError from './InputError';

export interface IRegisterFormProps {
}

export default function RegisterForm (props: IRegisterFormProps) {
    const dispath = useAppDispatch()
    const navigate = useNavigate()
    const {errors, loading} = useAppSelector(state => state.auth)

    const [data,setData] = React.useState<IRegisterProps>({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setData(state => ({
            ...state,
          [name]: value
        } as Pick<IRegisterProps, keyof IRegisterProps>));
    }

    const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispath(registerUser(data)).then((response) => {
            if(response.type === registerUser.fulfilled.toString()) {
              navigate('/auth/login')
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <InputLabel htmlFor="username" value="Username" />
                <TextInput
                    type="text"
                    name="username"
                    value={data.username}
                    className="mt-1 block w-full"
                    autoComplete="username"
                    isFocused={true}
                    onChange={handleInputChange}
                    required
                />

                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="email" value="Email" />

                <TextInput
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    autoComplete="username"
                    onChange={handleInputChange}
                    required
                />

                <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password" value="Password" />

                <TextInput
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    onChange={handleInputChange}
                    required
                />

                <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="mt-4">
                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                <TextInput
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mt-1 block w-full"
                    onChange={handleInputChange}
                    required
                />

                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <PrimaryButton className="mt-6" processing={loading}>
                Register
            </PrimaryButton>
            <Link to="/auth/login" className="underline text-sm text-gray-600 hover:text-gray-900 mt-4">
                Already registered?
            </Link>
        </form>
    );
}
