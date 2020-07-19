import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil'
import { CreateForm } from '../Todo';


test('renders form', () => {
  const { getByPlaceholderText, getByDisplayValue } = render(<RecoilRoot><CreateForm /></RecoilRoot>);

  const formInput = getByPlaceholderText("I want to...");
  const formSubmit = getByDisplayValue("Add Todo");

  expect(formInput).toBeInTheDocument();
  expect(formSubmit).toBeInTheDocument();
});

describe("Submitting form", () => {
  let submitFunction: Function;
  let getByPlaceholderText: Function, getByDisplayValue: Function, getByText: Function;
  let formInput: HTMLElement, formSubmit: HTMLElement;

  beforeEach(() => {
    submitFunction = jest.fn();
    let wrapper = render(<RecoilRoot><CreateForm onSubmit={submitFunction} /></RecoilRoot>);

    getByDisplayValue = wrapper.getByDisplayValue;
    getByPlaceholderText = wrapper.getByPlaceholderText;
    getByText = wrapper.getByText;

    formInput = getByPlaceholderText("I want to...");
    formSubmit = getByDisplayValue("Add Todo");
  });

  test('renders no input error', () => {
    fireEvent.change(formInput, {
      target: {
        value: ""
      }
    });

    expect(formInput).toHaveValue("");

    fireEvent.click(formSubmit);

    waitFor(() => {
      expect(submitFunction).toHaveBeenCalledTimes(1);
      expect(submitFunction).toHaveBeenCalledWith({ item: { content: "" } });
      expect(getByText("Todo content is required.")).toBeInTheDocument();
    });
  })

  test('renders same input error', () => {
    fireEvent.change(formInput, {
      target: {
        value: "test"
      }
    });

    expect(formInput).toHaveValue("test");

    fireEvent.click(formSubmit);

    waitFor(() => {
      expect(submitFunction).toHaveBeenCalledTimes(1);
      expect(submitFunction).toHaveBeenCalledWith({ item: { content: "test" } });
      expect(formInput).toHaveValue("");
    });

    fireEvent.change(formInput, {
      target: {
        value: "test"
      }
    });

    expect(formInput).toHaveValue("test");

    fireEvent.click(formSubmit);

    waitFor(() => {
      expect(submitFunction).toHaveBeenCalledTimes(1);
      expect(submitFunction).toHaveBeenCalledWith({ item: { content: "test" } });
      expect(getByText("A todo item with this input already exists.")).toBeInTheDocument();
    });
  })

  test('adds a todo', () => {
    fireEvent.change(formInput, {
      target: {
        value: "Something"
      }
    });

    expect(formInput).toHaveValue("Something");

    fireEvent.click(formSubmit);

    waitFor(() => {
      expect(submitFunction).toHaveBeenCalledTimes(1);
      expect(submitFunction).toHaveBeenCalledWith({ item: { content: "Something" } });
      expect(formInput).toHaveValue("");
    });
  });
})

