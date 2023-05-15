import React, { ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchUserData, logout } from '../../redux/store/reducers/authSlice'
import Header from '../Header'
import Footer from '../Footer'
import Navbar from '../Navbar'

type ILayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: ILayoutProps) {
  const dispath = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)

  React.useEffect(() => {
    if(user.isAuthenticated) {
      if(!user.email) {
        dispath(fetchUserData()).then(reponse => {
          if(reponse.type !== fetchUserData.fulfilled.toString()){
            dispath(logout())
          }
        })
      }
    }
  },[dispath])
  return (
    <>
        <Header>
            <Navbar auth={null}/>
        </Header>
        {children}
        <Footer />
    </>
  )
}