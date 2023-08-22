import { Link, useNavigate } from 'react-router-dom'
import useStore from 'h/useStore'
import { VscComment, VscEdit, VscTrash } from 'react-icons/vsc'

// элемент поста
const PostItem = ({ post }) => {
  const removePost = useStore(({ removePost }) => removePost)
  const navigate = useNavigate()

  // каждый пост - это ссылка на его страницу
  return (
    <Link
      to={`/blog/post/${post.id}`}
      className='post-item'
      onClick={(e) => {
        // отключаем переход на страницу поста
        // при клике по кнопке или иконке
        if (e.target.localName === 'button' || e.target.localName === 'svg') {
          e.preventDefault()
        }
      }}
    >
      <h3>{post.title}</h3>
      {/* если пост является редактируемым - принадлежит текущему пользователю */}
      {post.editable && (
        <div>
          <button
            onClick={() => {
              // строка запроса `edit=true` определяет,
              // что пост находится в состоянии редактирования
              navigate(`/blog/post/${post.id}?edit=true`)
            }}
            className='info'
          >
            <VscEdit />
          </button>
          <button
            onClick={() => {
              removePost(post.id)
            }}
            className='danger'
          >
            <VscTrash />
          </button>
        </div>
      )}
      <p>Author: {post.author}</p>
      <p className='date'>{new Date(post.created_at).toLocaleString()}</p>
      {/* количество комментариев к посту */}
      {post.commentCount > 0 && (
        <p>
          <VscComment />
          <span className='badge'>
            <sup>{post.commentCount}</sup>
          </span>
        </p>
      )}
    </Link>
  )
}

// список постов
export const PostList = ({ posts }) => (
  <div className='post-list'>
    {posts.length > 0 ? (
      posts.map((post) => <PostItem key={post.id} post={post} />)
    ) : (
      <h3>No posts</h3>
    )}
  </div>
)