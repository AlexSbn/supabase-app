import supabase from 's'

// API для работы с таблицей comments — комментарии (api/comment.js):
// метод для создания комментария
const create = async (commentData) => {
  const user = supabase.auth.user()
  if (!user) return
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ ...commentData, user_id: user.id }])
      .single()
    if (error) throw error
    return data
  } catch (e) {
    throw e
  }
}

// для обновления комментария
const update = async (commentData) => {
  const user = supabase.auth.user()
  if (!user) return
  try {
    const { data, error } = await supabase
      .from('comments')
      .update({ ...commentData })
      .match({ id: commentData.id, user_id: user.id })
    if (error) throw error
    return data
  } catch (e) {
    throw e
  }
}

// для удаления комментария
const remove = async (id) => {
  const user = supabase.auth.user()
  if (!user) return
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .match({ id, user_id: user.id })
    if (error) throw error
  } catch (e) {
    throw e
  }
}

const commentApi = { create, update, remove }

export default commentApi