import * as React from 'react';
import { fetchUserData, loginUser } from '../../redux/store/reducers/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useNavigate } from 'react-router-dom';
import { ILoginProps } from '../../services/AuthService';

export interface ILoginFormProps {
}

export default function LoginForm() {
  const dispath = useAppDispatch()
  const navigate = useNavigate()
  const {success, error, loading} = useAppSelector(state => state.auth)
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
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleInputChange} />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleInputChange} />
      </label>
      <br />
      <input type="submit" value="Submit" />
    </form>
  );
}
