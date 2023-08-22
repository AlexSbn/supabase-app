import { useState, useEffect } from 'react'

// Хук для работы с формами (hooks/useForm.js):

// хук принимает начальное состояние формы
// чтобы немного облегчить себе жизнь,
// мы будем исходить из предположения,
// что все поля формы являются обязательными
export default function useForm(initialData) {
  const [data, setData] = useState(initialData)
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    // если какое-либо из полей является пустым
    setDisabled(!Object.values(data).every(Boolean))
  }, [data])

  // метод для изменения полей формы
  const change = ({ target: { name, value } }) => {
    setData({ ...data, [name]: value })
  }

  return { data, change, disabled }
}