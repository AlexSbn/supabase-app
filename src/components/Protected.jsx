import useStore from 'h/useStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Компонент Protected перенаправляет неавторизованного пользователя на главную страницу после завершения загрузки приложения (components/Protected.jsx):

export const Protected = ({ children, className }) => {
  const { user, loading } = useStore(({ user, loading }) => ({ user, loading }))
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading])

  // ничего не рендерим при отсутствии пользователя
  if (!user) return null

  return <div className={className ? className : ''}>{children}</div>
}