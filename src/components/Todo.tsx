import React, { useState, useEffect } from 'react';

import { store } from '../helpers/state';

import { useRecoilState } from 'recoil';
import { todoList as todoState, todoListFilter, todoFilterStates, emptyTodoList } from '../helpers/atoms';

import { generateId } from '../helpers';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import './todo.css';

export const CreateForm = ({ onSubmit }: any) => {
  const [todoList, setTodoList] = useRecoilState(todoState);

  if (!onSubmit) {
    onSubmit = (values: {item: {content: string}}, { resetForm, setFieldError }: {resetForm: Function, setFieldError: Function}) => {
      if (values.item.content === "") {
        return setFieldError('item.content', 'Todo content is required.')
      } else if (todoList.findIndex(item => item.content === values.item.content) !== -1) {
        return setFieldError('item.content', 'A todo item with this input already exists.');
      }

      
      setTodoList(old => {
        const updated = [
          ...old,
          { ...values.item, completed: false, id: generateId() }
        ]

        store.set('recoil-state-todoList', updated)

        return updated
      });

      resetForm();
    }
  }

  return (
    <>
      <Formik
        initialValues={{ item: { content: '' } }}
        validationSchema={Yup.object().shape({
          item: Yup.object().shape({
            content: Yup.string()
          })
        })}

        onSubmit={onSubmit}
      >
        {({ errors, touched, values }) => 
          <>
            <Form className="todo-form-container">
              <div>
                <Field className={(errors.item && errors.item.content) && (touched.item && touched.item.content) ? 'input-error' : ''} name="item.content" placeholder="I want to..." />
                <span><ErrorMessage name="item.content" /></span>
              </div>

              <input type="submit" value="Add Todo" />
            </Form>
          </>
        }
      </Formik>
    </>
  );
}

export const FilterSelectors = () => {
  const [filter, setFilter] = useRecoilState(todoListFilter);

  return (
    <div className="todo-filter-selectors">
      {Object.keys(todoFilterStates).map((state: string) =>
        <button key={state} className={`selector${todoFilterStates[state] === filter ? " active" : ""}`} onClick={() => {
          setFilter(todoFilterStates[state])
        }}>{todoFilterStates[state]}</button>
      )}
    </div>
  )
}

export const List = () => {
  const [filter] = useRecoilState(todoListFilter);

  const [todoList, setTodoList] = useRecoilState(todoState);

  const [filteredList, setFilteredList] = useState(emptyTodoList)

  useEffect(() => {
    switch (filter) {
      case 'Show Completed':
        setFilteredList(todoList.filter((item) => item.completed === true));
        break;
      case 'Show Uncompleted':
        setFilteredList(todoList.filter((item) => item.completed === false));
        break;
      default:
        setFilteredList(todoList)
    }
  }, [todoList, filter])

  return (
    <div className="todo-list">
      {filteredList.map(({content, completed, id}) => (
        <div key={id} className="item">
          <span>{content}{completed && <span className="complete" role="img" aria-label="complete">complete ✅</span>}</span>

          <button title={completed ? 'Mark incomplete' : 'Mark complete'} onClick={() => {
            setTodoList(old => {
              const updated = [...old];
              const index = updated.findIndex(item => item.id === id);
              updated[index] = { ...updated[index], completed: !updated[index].completed };

              store.set('recoil-state-todoList', updated)

              return updated;
            })
          }}>
            <span role="img" aria-label={completed ? 'mark incomplete' : 'mark complete'}>{completed ? '❌' : '✅'}</span>
          </button>

          <button title="Delete item" onClick={() => {
            setTodoList(old => {
              const updated = [
                ...old.filter(item => item.id !== id)
              ]

              store.set('recoil-state-todoList', updated)

              return updated
            })
          }}>
            <span role="img" aria-label="delete">🗑️</span>
          </button>
        </div>
      ))}
    </div>
  )
}

export default () => {
  return (
    <>
      <CreateForm />
      <FilterSelectors />
      <List />
    </>
  )
}
