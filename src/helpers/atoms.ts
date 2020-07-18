import { atom, selector } from 'recoil';

// Typescript fix for TodoList
export const emptyTodoList: {
    content: string;
    id: string;
    completed: boolean;
}[] = [];

export const todoList = atom({
  key: 'todoList',
  default: emptyTodoList
});

export const todoFilterStates: {[key: string]: string} = {
  all: 'Show All',
  completed: 'Show Completed',
  uncompleted: 'Show Uncompleted'
}

export const todoListFilter = atom({
  key: 'todoListFilter',
  default: todoFilterStates.all,
});

export const filteredTodoList = selector({
  key: 'filteredTodoList',
  get: ({get}) => {
    const filter = get(todoListFilter);
    const list = get(todoList);

    switch (filter) {
      case 'Show Completed':
        return list.filter((item) => item.completed === true);
      case 'Show Uncompleted':
        return list.filter((item) => item.completed === false);
      default:
        return list;
    }
  },
});
