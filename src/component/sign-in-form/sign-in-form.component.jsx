import { useState } from "react";
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth, signInWithGooglePopUp, signInAuthUserWithEmailAndPassword } from "../../utils/firebase/firebase.utils";
import FormInput from "../form-input/form-input.component";
import './sign-in-form.styles.scss';
import Button from "../button/button.component";

const defaultFormFields = {
    email: '',
    password: '',
};

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const {email, password} = formFields;

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const signInWithGoogle = async() => {
        const {user} = await signInWithGooglePopUp();
        await createUserDocumentFromAuth(user);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await signInAuthUserWithEmailAndPassword(email, password);
            console.log(response);
            resetFormFields();
        } catch(error) {
            switch(error.code) {
                case 'auth/invalid-credential':
                    alert('Incorrect password or email!');
                    break;
                case 'auth/too-many-requests':
                    alert("You've exceeded the login attempt, try again later");
                    break;
                default:
                    console.log(error)
            }
        }
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormFields({...formFields, [name]: value});
    }

    return (
        <div className="sign-up-container">
            <h2>Already have an account?</h2>
            <span>Sign in with your email & password</span>
            <form onSubmit={handleSubmit}>

                <FormInput label="Email"type="email" required onChange={handleChange} name="email" value={email}/>

                <FormInput label="Password" type="password" required onChange={handleChange} name="password" value={password}/>

                <div className="buttons-container">
                    <Button type="submit">Sign in</Button>
                    <Button type='button' buttonType='google' onClick={signInWithGoogle}>Google Sign in</Button>
                </div>
            </form>
        </div>
    )
}

export default SignInForm;