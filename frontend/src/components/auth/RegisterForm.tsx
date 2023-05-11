import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, } from '../../redux/store/reducers/authSlice';
import { IRegisterProps } from '../../services/AuthService';
import { useAppDispatch } from '../../hooks/redux';

export interface IRegisterFormProps {
}

export default function RegisterForm (props: IRegisterFormProps) {
    const dispath = useAppDispatch()
    const navigate = useNavigate()
    // const {success, error, loading} = useAppSelector(state => state.auth)
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
            <label>
            Username:
            <input
                type="text"
                name="username"
                value={data.username}
                onChange={handleInputChange} 
            />
            </label>
            <br />
            <label>
            Email:
            <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleInputChange} 
            />
            </label>
            <br />
            <label>
            Password:
            <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleInputChange} 
            />
            </label>
            <label>
            Password Confirmation:
            <input
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={handleInputChange}
                autoComplete='password_confirmation'/>
            </label>
            <br />
            <input type="submit" value="Submit" />
        </form>
    );
}
