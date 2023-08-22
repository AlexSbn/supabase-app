import { createClient } from '@supabase/supabase-js'
import useStore from 'h/useStore'

const supabase = createClient(
    // такой способ доступа к переменным среды окружения является уникальным для `vite`
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)

// регистрация обновления состояния аутентификации
supabase.auth.onAuthStateChange((event, session) => {
  console.log(event, session)
  // одной из прелестей `zustand` является то,
  // что методы из хранилища могут вызываться где угодно
  useStore.getState().fetchAllData()
})

// регистрация обновления данных в базе
supabase
  // нас интересуют все таблицы
  .from('*')
  // и все операции
  .on('*', (payload) => {
    console.log(payload)

    useStore.getState().fetchAllData()
  })
  .subscribe()

export default supabase