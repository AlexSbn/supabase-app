import supabase from 's'

// API для работы с таблицей posts — посты (api/post.js):
// метод для создания поста
const create = async (postData) => {
  const user = supabase.auth.user()
  if (!user) return
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .single()
    if (error) throw error
    return data
  } catch (e) {
    throw e
  }
}

// для обновления поста
const update = async (data) => {
  const user = supabase.auth.user()
  if (!user) return
  try {
    const { data: _data, error } = await supabase
      .from('posts')
      .update({ ...postData })
      .match({ id: data.id, user_id: user.id })
    if (error) throw error
    return _data
  } catch (e) {
    throw e
  }
}

// для удаления поста
const remove = async (id) => {
  const user = supabase.auth.user()
  if (!user) return
  try {
    // удаляем пост
    const { error } = await supabase
      .from('posts')
      .delete()
      .match({ id, user_id: user.id })
    if (error) throw error
    // удаляем комментарии к этому посту
    const { error: _error } = await supabase
      .from('comments')
      .delete()
      .match({ post_id: id })
    if (_error) throw _error
  } catch (e) {
    throw e
  }
}

const postApi = { create, update, remove }

export default postApi