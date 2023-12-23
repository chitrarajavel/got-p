import {useNavigate} from 'react-router-dom';

import Api from '../modules/Api.js';
import FormInput from '../components/common/FormInput.js';

import {useFormik} from 'formik';
import * as Yup from 'yup';

import '../styles/Signup.css';

/**
 * Displays a signup form to create a new user
 * Uses Yup for input validation and Formik to take care fields state and values
 */
const Signup = ({signup}) => {
    const api = new Api();
    const navigate = useNavigate();
    const fieldNames = [
        {inputName: 'firstName', type: 'text', label: 'First Name:'},
        {inputName: 'lastName', type: 'text', label: 'Last Name:'},
        {inputName: 'email', type: 'email', label: 'Email:'},
        {inputName: 'password', type: 'password', label: 'Password:'},
    ];

    const initVals = {};
    fieldNames.forEach(field => {
        return (initVals[field.inputName] = '');
    });

    const formik = useFormik({
        // formik format- initialValues: {firstName: '', lastName: '', email: '', password: ''},
        initialValues: initVals,

        onSubmit: values => {
            let formData = values;
            signup(formData);
            formik.resetForm();
            navigate('/');
        },
        //Uses Yup for form input validation
        validationSchema: Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            email: Yup.string()
                .required('Required')
                .email('Invalid Email')
                .test('test-name', 'Email Already Exists!', function (value) {
                    return !api.userExists(value);
                }),
            // Uses regular expressions to validate the password requirements
            password: Yup.string()
                .required('Required')
                .matches(/[A-Z]+/, 'One uppercase character')
                .matches(/[a-z]+/, 'One lowercase character')
                .matches(/\d+/, 'One number')
                .matches(/[@$!%*#?&]+/, 'One special character')
                .min(8, 'Must be at least 8 characters'),
        }),
    });

    //Iterates through fieldNames array and creates the form labels and inputs
    const formInputs = fieldNames.map(({inputName, type, label}) => {
        return (
            <FormInput
                key={inputName}
                inputName={inputName}
                type={type}
                formik={formik}
                label={label}
            />
        );
    });

    return (
        <div className="Signup-Wrapper d-flex align-items-center justify-content-center w-100">
            <div className="card-style Signup rounded">
                <h6 className="mb-3" style={{textAlign: 'center'}}>
                    Sign Up to View Fan-Page
                </h6>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        formik.handleSubmit(e);
                    }}
                >
                    {formInputs}

                    <button
                        type="submit"
                        className="btn btn-dark block w-100 mt-2"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Signup;
