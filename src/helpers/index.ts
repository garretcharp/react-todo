export const generateId = () => {
  const allowed = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let id = ''
  for (let i = 15; i > 0; i--) { 
    id += allowed[Math.floor(Math.random() * allowed.length)]; 
  } 
  return id;
}
