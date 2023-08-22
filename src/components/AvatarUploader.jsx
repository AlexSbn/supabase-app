import { useState, useEffect } from 'react'
import userApi from 'a/user'
import useStore from 'h/useStore'

export const AvatarUploader = () => {
  const { user, setUser, setLoading, setError } = useStore(
    ({ user, setUser, setLoading, setError }) => ({
      user,
      setUser,
      setLoading,
      setError
    })
  )
  // состояние для файла
  const [file, setFile] = useState('')
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    setDisabled(!file)
  }, [file])

  const upload = (e) => {
    e.preventDefault()
    if (disabled) return
    setLoading(true)
    userApi.uploadAvatar(file).then(setUser).catch(setError)
  }

  return (
    <div className='avatar-uploader'>
      <form className='avatar-uploader' onSubmit={upload}>
        <label htmlFor='avatar'>Avatar:</label>
        <input
          type='file'
          // инпут принимает только изображения
          accept='image/*'
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0])
            }
          }}
        />
        <button disabled={disabled}>Upload</button>
      </form>
    </div>
  )
}