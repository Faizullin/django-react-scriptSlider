import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserData, loginUser } from '../../redux/store/reducers/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { ILoginProps } from '../../services/AuthService';
import PrimaryButton from './PrimaryButton';
import TextInput from './TextInput';
import InputError from './InputError';
import InputLabel from '../InputLabel';
import CheckboxInput from './CheckboxInput';

export interface ILoginFormProps {
}

export default function LoginForm() {
  const dispath = useAppDispatch()
  const navigate = useNavigate()
  const {success, error, loading,} = useAppSelector(state => state.auth)
  const [data,setData] = React.useState<ILoginProps>({
    email: '',
    password: '',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setData(state => ({
      ...state,
      [name]: value
    } as Pick<ILoginProps, keyof ILoginProps>));
  }

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispath(loginUser(data)).then((response) => {
      if(response.type === loginUser.fulfilled.toString()) {
        // window.location.reload()
        navigate('/script')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
        <div>
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
                type="text"
                name="email"
                value={data.email}
                className="mt-1 block w-full"
                autoComplete="email"
                isFocused={true}
                onChange={handleInputChange}
            />

            {/* <InputError message={errors.email} className="mt-2" /> */}
        </div>
        <div className="mt-4">
            <InputLabel htmlFor="password" value="Password" />

            <TextInput
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full"
                autoComplete="password"
                onChange={handleInputChange}
            />

            {/* <InputError message={errors.password} className="mt-2" /> */}
        </div>
        <div className="flex justify-between mt-4">
            {/* <label className="flex items-center">
                <CheckboxInput name="remember" value={data.remember} onChange={(e) => void} />

                <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label> */}
              <Link
                  to="/forgot_password"
                  className="underline text-sm text-gray-600 hover:text-gray-900"
              >
                  Forgot your password?
              </Link>
        </div>
        <PrimaryButton className="mt-6" processing={loading}>
            Click to Login
        </PrimaryButton>
        <p className="mt-3 text-sm">Not a member yet? <Link to="/auth/register">Create your Account</Link></p>
    </form>
  );
}
