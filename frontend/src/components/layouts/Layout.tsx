import React, { ReactNode, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { Link } from 'react-router-dom'
import { fetchUserData, logout } from '../../redux/store/reducers/authSlice'

type ILayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: ILayoutProps) {
  const dispath = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)

  const handleLogout = () => {
    dispath(logout())
  }

  useEffect(() => {
    if(user.isAuthenticated) {
      console.log(user.isAuthenticated)
      dispath(fetchUserData()).then(reponse => {
        if(reponse.type !== fetchUserData.fulfilled.toString()){
          dispath(logout())
        }
      })
    }
  },[])
  return (
    <div>
      {
        user.isAuthenticated ? (
          <div>
            <div>{user.name} - {user.email}</div>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : (
          <Link to={'/auth/login'}>Please log in</Link>
        )
      }
        {children}
    </div>
  )
}