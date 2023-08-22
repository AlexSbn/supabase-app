import userApi from 'a/user'
import { Form } from 'c'
import useStore from 'h/useStore'
import { useNavigate } from 'react-router-dom'

// Рассмотрим пример использования хука для работы с хранилищем состояния и компонента формы на странице для регистрации пользователя (pages/Register.jsx):

// начальное состояние формы
const fields = [
  {
    id: 'user_name',
    label: 'Username',
    type: 'text'
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email'
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password'
  },
  {
    id: 'confirm_password',
    label: 'Confirm password',
    type: 'password'
  }
]

export const Register = () => {
  // извлекаем из состояния методы для установки пользователя, загрузки и ошибки
  const { setUser, setLoading, setError } = useStore(
    ({ setUser, setLoading, setError }) => ({ setUser, setLoading, setError })
  )
  // метод для ручного перенаправления
  const navigate = useNavigate()

  // метод для регистрации
  const register = async (data) => {
    setLoading(true)
    userApi
      // данный метод возвращает объект пользователя
      .register(data)
      .then((user) => {
        // устанавливаем пользователя
        setUser(user)
        // выполняем перенаправление на главную страницу
        navigate('/')
      })
      // ошибка
      .catch(setError)
  }

  return (
    <div className='page register'>
      <h1>Register</h1>
      <Form fields={fields} submit={register} button='Register' />
    </div>
  )
}