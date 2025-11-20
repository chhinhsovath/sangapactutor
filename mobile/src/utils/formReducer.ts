/**
 * Form State Reducer
 * Centralized form state management for complex forms with validation
 *
 * Usage:
 * const [formState, dispatch] = useReducer(formReducer, initialState);
 *
 * dispatch({
 *   type: 'UPDATE_INPUT',
 *   payload: {
 *     inputId: 'email',
 *     inputValue: 'test@example.com',
 *     isValid: true,
 *   }
 * });
 */

export interface FormInput {
  value: string;
  isValid: boolean;
}

export interface FormState {
  inputValues: Record<string, string>;
  inputValidities: Record<string, boolean>;
  formIsValid: boolean;
}

export type FormAction =
  | {
      type: 'UPDATE_INPUT';
      payload: {
        inputId: string;
        inputValue: string;
        isValid: boolean;
      };
    }
  | {
      type: 'RESET_FORM';
      payload?: FormState;
    }
  | {
      type: 'SET_FORM_VALID';
      payload: boolean;
    };

/**
 * Check if all form fields are valid
 */
function checkFormIsValid(validities: Record<string, boolean>): boolean {
  return Object.values(validities).every((validity) => validity === true);
}

/**
 * Form reducer function
 * Manages form input values, validities, and overall form validity
 */
export function formReducer(
  state: FormState,
  action: FormAction
): FormState {
  switch (action.type) {
    case 'UPDATE_INPUT': {
      const { inputId, inputValue, isValid } = action.payload;
      const newInputValues = {
        ...state.inputValues,
        [inputId]: inputValue,
      };
      const newInputValidities = {
        ...state.inputValidities,
        [inputId]: isValid,
      };
      const newFormIsValid = checkFormIsValid(newInputValidities);

      return {
        inputValues: newInputValues,
        inputValidities: newInputValidities,
        formIsValid: newFormIsValid,
      };
    }

    case 'RESET_FORM': {
      return (
        action.payload || {
          inputValues: {},
          inputValidities: {},
          formIsValid: false,
        }
      );
    }

    case 'SET_FORM_VALID': {
      return {
        ...state,
        formIsValid: action.payload,
      };
    }

    default:
      return state;
  }
}

/**
 * Hook for managing form state
 * Simpler interface for common form operations
 */
export function useForm(initialState: FormState) {
  const [state, dispatch] = React.useReducer(formReducer, initialState);

  const updateInput = (
    inputId: string,
    inputValue: string,
    isValid: boolean
  ) => {
    dispatch({
      type: 'UPDATE_INPUT',
      payload: { inputId, inputValue, isValid },
    });
  };

  const resetForm = (newState?: FormState) => {
    dispatch({
      type: 'RESET_FORM',
      payload: newState,
    });
  };

  const setFormValid = (isValid: boolean) => {
    dispatch({
      type: 'SET_FORM_VALID',
      payload: isValid,
    });
  };

  return {
    formState: state,
    updateInput,
    resetForm,
    setFormValid,
  };
}

// Re-export for convenience
import React from 'react';
export { React };
