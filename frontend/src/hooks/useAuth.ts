import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppSelector } from './redux'

export const useAuth = () => {
  const { user } = useAppSelector(state => state.auth)

  return useMemo(() => ({ user }), [user])
}
