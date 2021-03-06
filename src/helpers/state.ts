const safeParse = (data) => {
  try {
    return JSON.parse(data)
  } catch (_) {
    return {}
  }
}

export const store = {
  each: (cb: Function) => {
    Object.keys(localStorage).forEach(key => {
      const element = localStorage[key]

      cb(safeParse(element), key)
    })
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const initializeState = ({ set }: any) => {
  store.each((item: any, key: any) => {
    if (key.startsWith('recoil-state-')) {
      set({ key: key.replace('recoil-state-', '') }, item)
    }
  })
}
