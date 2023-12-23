import React from 'react';

/**
 * This component return JSX for a single form input with label for Signup.js
 */
const FormInput = ({inputName, type, formik, label}) => {
    return (
        <div className="Signup-Form-Group mb-2">
            <label htmlFor={inputName} className="form-label">
                {label}
            </label>
            <input
                type={type}
                name={inputName}
                id={inputName}
                className="form-control Signup-Form-Input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[inputName]}
                {...formik.getFieldProps(`${inputName}`)}
            ></input>
            <div className="error-msg">
                {formik.errors[inputName] && formik.touched[inputName]
                    ? formik.errors[inputName]
                    : null}
            </div>
        </div>
    );
};
export default FormInput;
