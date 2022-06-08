import {useState, useEffect, useRef} from 'react'

const useLocalStorageState = (
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) => {
  // 🐨 initialize the state to the value from localStorage using lazy initialization
  // Lazy initialization since we are doing localStorage calls which is resource intensive
  // and we just need to get the value from localStorage during inital render.

  // Serialize and Deserialize are used so that we are able to store numbers, objects and so on in localStorage
  // and not just strings.
  const [state, setState] = useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      return deserialize(valueInLocalStorage)
    }
    // If default value is calculated using a resource intensive function, then user can just pass that function reference
    // which will be called just once.
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  // If the name of the key is changed between re-renders, then delete old key:object pair and insert newKey:object pair to localStorage
  const prevKeyRef = useRef(key)

  // The callback should set the `name` in localStorage.
  useEffect(() => {
    if (prevKeyRef.current !== key) {
      window.localStorage.removeItem(prevKeyRef.current)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState]
}

export default useLocalStorageState
