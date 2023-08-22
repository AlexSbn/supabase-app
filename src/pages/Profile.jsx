import { Protected, UserUpdater } from 'c'
import useStore from 'h/useStore'

export const Profile = () => {
  // извлекаем из хранилища объект пользователя
  const user = useStore(({ user }) => user)
  // копируем его
  const userCopy = { ...user }
  // и удаляем поле с адресом аватара -
  // он слишком длинный и ломает разметку
  delete userCopy.avatar_url

  return (
    // страница является защищенной
    <Protected className='page profile'>
      <h1>Profile</h1>
      <div className='user-data'>
        {/* отображаем данные пользователя */}
        <pre>{JSON.stringify(userCopy, null, 2)}</pre>
      </div>
      {/* компонент для обновления данных пользователя */}
      <UserUpdater />
    </Protected>
  )
}