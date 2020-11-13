import { useState, useCallback, useRef, useEffect } from 'react'

export const useInput = (initialValue = '', converter) => {
  const [value, setValue] = useState(initialValue)
  const convert = useCallback(converter ?? ((val) => val), [converter])
  const onChange = useCallback(
    (event) => setValue(convert(event.target.value)),
    [convert]
  )
  return [value, { value, onChange }, setValue]
}

export const useShow = (initialState = false) => {
  const [show, setShow] = useState(initialState)
  const handleShow = useCallback(() => setShow(true), [])
  const handleClose = useCallback(() => setShow(false), [])
  const shown = useRef(initialState)
  if (show && !shown.current) {
    shown.current = true
  }
  return [show, handleShow, handleClose, shown.current]
}

export const useFocus = () => {
  const focusRef = useRef(null)
  useEffect(() => {
    if (focusRef) {
      focusRef.current.focus()
    }
  }, [focusRef])
  return { ref: focusRef, autoFocus: true }
}

export const useAlert = (initialMessages = { head: '', desc: '' }) => {
  const [alert, setMessages] = useState({ show: false, ...initialMessages })
  const setAlert = useCallback((messages) => {
    setMessages({ ...messages, show: true })
  }, [])
  const handleClose = useCallback(() => {
    setMessages((prevMessages) => ({ ...prevMessages, show: false }))
  }, [])
  return [{ handleClose, ...alert }, setAlert]
}

export const range = (n) => [...Array(n).keys()]

export const timeToString = (time) =>
  new Date(time * 1000).toLocaleString('th-TH')

export const useRenderCount = (name) => {
  const count = useRef(0)
  console.log(`${name} rendered : ${++count.current} `)
}

export const useOnScreen = (ref, rootMargin = '0px', retoggle = true) => {
  const target = ref.current
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    if (!retoggle && isIntersecting) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin, threshold: 0 }
    )

    if (target) {
      observer.observe(target)
    }
    return () => {
      if (target) {
        observer.unobserve(target)
      }
    }
  }, [isIntersecting, target, rootMargin, retoggle])

  return isIntersecting
}
