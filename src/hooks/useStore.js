import create from 'zustand'
import dbApi from 'a/db'
import postApi from 'a/post'


// Для управления состоянием нашего приложения мы будем использовать zustand, который позволяет создавать хранилище в форме хука.
// Создаем хранилище в файле hooks/useStore.js:
const useStore = create((set, get) => ({
  // состояние загрузки
  loading: true,
  // функция для его обновления
  setLoading: (loading) => set({ loading }),
  // состояние ошибки
  error: null,
  // функция для его обновления
  setError: (error) => set({ loading: false, error }),
  // состояние пользователя
  user: null,
  // функция для его обновления
  setUser: (user) => set({ user }),

  // пользователи
  users: [],
  // посты
  posts: [],
  // комментарии
  comments: [],

  // мы можем "тасовать" наши данные как угодно,
  // например, так:
  // объект постов с доступом по `id` поста
  postsById: {},
  // объект постов с доступом по `id` пользователя
  postsByUser: {},
  // карта "имя пользователя - `id` поста"
  userByPost: {},
  // объект комментариев с доступом по `id` поста
  commentsByPost: {},
  // массив всех постов с авторами и количеством комментариев
  allPostsWithCommentCount: [],
  // далее важно определить правильный порядок формирования данных

  // формируем объект комментариев с доступом по `id` поста
  getCommentsByPost() {
    const { users, posts, comments } = get()
    const commentsByPost = posts.reduce((obj, post) => {
      obj[post.id] = comments
        .filter((comment) => comment.post_id === post.id)
        .map((comment) => ({
          ...comment,
          // добавляем в объект автора
          author: users.find((user) => user.id === comment.user_id).user_name
        }))
      return obj
    }, {})
    set({ commentsByPost })
  },
  // формируем карту "имя пользователя - `id` поста"
  getUserByPost() {
    const { users, posts } = get()
    const userByPost = posts.reduce((obj, post) => {
      obj[post.id] = users.find((user) => user.id === post.user_id).user_name
      return obj
    }, {})
    set({ userByPost })
  },
  // формируем объект постов с доступом по `id` пользователя
  getPostsByUser() {
    // здесь мы используем ранее сформированный объект `commentsByPost`
    const { users, posts, commentsByPost } = get()
    const postsByUser = users.reduce((obj, user) => {
      obj[user.id] = posts
        .filter((post) => post.user_id === user.id)
        .map((post) => ({
          ...post,
          // пользователь может редактировать и удалять свои посты
          editable: true,
          // добавляем в объект количество комментариев
          commentCount: commentsByPost[post.id].length
        }))
      return obj
    }, {})
    set({ postsByUser })
  },
  // формируем объект постов с доступом по `id` поста
  getPostsById() {
    // здесь мы используем ранее сформированные объекты `userByPost` и `commentsByPost`
    const { posts, user, userByPost, commentsByPost } = get()
    const postsById = posts.reduce((obj, post) => {
      obj[post.id] = {
        ...post,
        // добавляем в объект комментарии
        comments: commentsByPost[post.id],
        // и их количество
        commentCount: commentsByPost[post.id].length
      }
      // обратите внимание на оператор опциональной последовательности (`?.`)
      // пользователь может отсутствовать (`null`)

      // если пользователь является автором поста
      if (post.user_id === user?.id) {
        // значит, он может его редактировать и удалять
        obj[post.id].editable = true
      // иначе
      } else {
        // добавляем в объект имя автора поста
        obj[post.id].author = userByPost[post.id]
      }
      return obj
    }, {})
    set({ postsById })
  },
  // формируем массив всех постов с авторами и комментариями
  getAllPostsWithCommentCount() {
    // здесь мы используем ранее сформированные объекты `userByPost` и `commentsByPost`
    const { posts, user, userByPost, commentsByPost } = get()
    const allPostsWithCommentCount = posts.map((post) => ({
      ...post,
      // является ли пост редактируемым
      editable: user?.id === post.user_id,
      // добавляем в объект автора
      author: userByPost[post.id],
      // и количество комментариев
      commentCount: commentsByPost[post.id].length
    }))
    set({ allPostsWithCommentCount })
  },

  // метод для получения всех данных и формирования вспомогательных объектов и массива
  async fetchAllData() {
    set({ loading: true })

    const {
      getCommentsByPost,
      getUserByPost,
      getPostsByUser,
      getPostsById,
      getAllPostsWithCommentCount
    } = get()

    const { users, posts, comments } = await dbApi.fetchAllData()

    set({ users, posts, comments })

    getCommentsByPost()
    getPostsByUser()
    getUserByPost()
    getPostsById()
    getAllPostsWithCommentCount()

    set({ loading: false })
  },

  // метод для удаления поста
  // данный метод является глобальным, поскольку вызывается на разных уровнях приложения
  removePost(id) {
    set({ loading: true })
    postApi.remove(id).catch((error) => set({ error }))
  }
}))

export default useStore