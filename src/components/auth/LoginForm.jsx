import React from "react";
import Logo from "../../assets/DMT_LOGO_MAIN.png";
import ModalWrapper from "../modals/ModalWrapper";
import { Form, Formik } from "formik";
import { Button, Image, Label } from "semantic-ui-react";
import * as Yup from "yup";
import MyTextInput from "../corrs/forms/MyTextInput";
import { signInWithEmail } from "../../firestore/firebaseService";
import { closeModal } from "../modals/modalReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  return (
    <ModalWrapper size="mini" header="">

        <Image src={Logo}  />
     
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string().required().email(),
          password: Yup.string().required(),
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await signInWithEmail(values);
            setSubmitting(false);
            dispatch(closeModal());
            navigate('/corrs')
          } catch (error) {
            setErrors({ auth: "Problem with your email and/or password" });
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, isValid, dirty, errors }) => (
          <Form style={{ marginTop: 50, marginBottom: 50 }} className="ui form">
            <MyTextInput name="email" placeholder="Enter email address" />
            <MyTextInput
              name="password"
              placeholder="Password"
              type="password"
            />
            {errors.auth && (
              <Label
                basic
                color="red"
                style={{ marginBottom: 10 }}
                content={errors.auth}
              />
            )}
            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type="submit"
              fluid
              color="teal"
              content="Login"
            />
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
}
