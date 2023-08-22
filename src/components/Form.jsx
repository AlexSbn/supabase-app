import useForm from 'h/useForm'
import { Field } from './Field'

// функция принимает массив полей формы, функцию для отправки формы и подпись к кнопке для отправки формы
export const Form = ({ fields, submit, button }) => {
  // некоторые поля могут иметь начальные значения,
  // например, при обновлении данных пользователя
  const initialData = fields.reduce((o, f) => {
    o[f.id] = f.value || ''
    return o
  }, {})
  // используем хук
  const { data, change, disabled } = useForm(initialData)

  // функция для отправки формы
  const onSubmit = (e) => {
    if (disabled) return
    e.preventDefault()
    submit(data)
  }

  return (
    <form onSubmit={onSubmit}>
      {fields.map((f) => (
        <Field key={f.id} {...f} value={data[f.id]} change={change} />
      ))}
      <button disabled={disabled} className='success'>
        {button}
      </button>
    </form>
  )
}