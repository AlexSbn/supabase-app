import postApi from 'a/post'
import { Form, PostList, PostTabs, Protected } from 'c'
import useStore from 'h/useStore'
import { useEffect, useState } from 'react'

// начальное состояние нового поста
const fields = [
  {
    id: 'title',
    label: 'Title',
    type: 'text'
  },
  {
    id: 'content',
    label: 'Content',
    type: 'text'
  }
]

export const Blog = () => {
  const { user, allPostsWithCommentCount, postsByUser, setLoading, setError } =
    useStore(
      ({
        user,
        allPostsWithCommentCount,
        postsByUser,
        setLoading,
        setError
      }) => ({
        user,
        allPostsWithCommentCount,
        postsByUser,
        setLoading,
        setError
      })
    )
  // выбранная вкладка
  const [tab, setTab] = useState('all')
  // состояние для отфильтрованных на основании выбранной вкладки постов
  const [_posts, setPosts] = useState([])

  // метод для создания нового поста
  const create = (data) => {
    setLoading(true)
    postApi
      .create(data)
      .then(() => {
        // переключаем вкладку
        setTab('my')
      })
      .catch(setError)
  }

  useEffect(() => {
    if (tab === 'new') return
    // фильтруем посты на основании выбранной вкладки
    const _posts =
      tab === 'my' ? postsByUser[user.id] : allPostsWithCommentCount
    setPosts(_posts)
  }, [tab, allPostsWithCommentCount])

  // если значением выбранной вкладки является `new`,
  // возвращаем форму для создания нового поста
  // данная вкладка является защищенной
  if (tab === 'new') {
    return (
      <Protected className='page new-post'>
        <h1>Blog</h1>
        <PostTabs tab={tab} setTab={setTab} />
        <h2>New post</h2>
        <Form fields={fields} submit={create} button='Create' />
      </Protected>
    )
  }

  return (
    <div className='page blog'>
      <h1>Blog</h1>
      <PostTabs tab={tab} setTab={setTab} />
      <h2>{tab === 'my' ? 'My' : 'All'} posts</h2>
      <PostList posts={_posts} />
    </div>
  )
}