export const store = {
  each: (cb: Function) => {
    for (let index = 0; index < localStorage.length; index++) {
      const element = localStorage.key(index);
      cb(element ? JSON.parse(element) : null)
    }
  },
  set: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const initializeState = ({ set }: any) => {
  store.each((item: any, key: any) => {
    if (key.startsWith('recoil-state-')) {
      set({ key: key.replace('recoil-state-', '') }, item);
    }
  })
};
