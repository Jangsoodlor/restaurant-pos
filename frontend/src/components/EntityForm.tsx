import React from 'react';
import { useDialog } from '../hooks/useDialog';

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required?: boolean;
  options?: { label: string; value: string }[];
  validate?: (value: any) => string | null;
};

export type InteractionMode = 'creating' | 'editing';

type EntityFormProps = {
  mode: InteractionMode;
  title: string;
  fields: FormField[];
  values: Record<string, any>;
  isLoading: boolean;
  isOpen: boolean;
  errorMessage?: string | null;
  onChange: (values: Record<string, any>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

/**
 * Polymorphic form component for creating/editing any entity type.
 * Uses field descriptors and dependency injection for flexibility.
 * Renders as a modal dialog.
 *
 * @param mode - "creating" or "editing" mode
 * @param title - Form title (e.g., "Create Table", "Edit User")
 * @param fields - Array of field descriptors defining form fields
 * @param values - Current form values (controlled by parent)
 * @param isLoading - Whether form is submitting/loading
 * @param isOpen - Whether the dialog is visible
 * @param errorMessage - Optional error message to display
 * @param onChange - Callback when form values change
 * @param onSubmit - Callback when form is submitted
 * @param onCancel - Callback when user cancels
 */
export function EntityForm({
  mode,
  title,
  fields,
  values,
  isLoading,
  isOpen,
  errorMessage,
  onChange,
  onSubmit,
  onCancel,
}: EntityFormProps) {
  const dialog = useDialog(isOpen);

  return (
    <dialog className={`round ${dialog.className}`} closedby="any">
      <article className="border elevate padding secondary-container">
        <header>
          <h5 className="no-margin">{title}</h5>
        </header>

        {errorMessage && (
          <div className="space">
            <article className="round border red-text pink-light">
              {errorMessage}
            </article>
          </div>
        )}

        <form onSubmit={onSubmit} className="margin-top">
          <div className="grid">
            {fields.map((field) => (
              <div key={field.name} className="s12 m6 field label border">
                {field.type === 'select' ? (
                  <>
                    <select
                      id={field.name}
                      value={values[field.name] ?? ''}
                      onChange={(e) =>
                        onChange({
                          ...values,
                          [field.name]: e.target.value,
                        })
                      }
                      disabled={isLoading}
                      required={field.required}
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <label htmlFor={field.name}>
                      {field.label}
                      {field.required && ' *'}
                    </label>
                  </>
                ) : (
                  <>
                    <input
                      id={field.name}
                      type={field.type}
                      value={values[field.name] ?? ''}
                      onChange={(e) => {
                        const value =
                          field.type === 'number'
                            ? e.target.value === ''
                              ? ''
                              : parseInt(e.target.value, 10) || 0
                            : e.target.value;
                        onChange({
                          ...values,
                          [field.name]: value,
                        });
                      }}
                      disabled={isLoading}
                      required={field.required}
                      {...(field.type === 'number' && { min: '1' })}
                    />
                    <label htmlFor={field.name}>
                      {field.label}
                      {field.required && ' *'}
                    </label>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Navigation / Actions */}
          <nav className="right-align no-padding top-margin">
            <button
              type="button"
              className="border"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <progress className="circle small white-text"></progress>
              ) : mode === 'creating' ? (
                'Create'
              ) : (
                'Update'
              )}
            </button>
          </nav>
        </form>
      </article>
    </dialog>
  );
}
