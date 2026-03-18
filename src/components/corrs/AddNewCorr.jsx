import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Container, Button, FormGroup } from "semantic-ui-react";
import LoadingComponent from "../LoadingComponent";
import { Form, Formik } from "formik";
import MyTextInput from "./forms/MyTextInput";
import MySelectInput from "./forms/MySelectInput";
import MyTextareaInput from "./forms/MyTextareaInput";
import MyDateInput from "./forms/MyDateInput";
import { addCorrToFirestore } from "../../firestore/firestoreService";
import { toast } from "react-toastify";

const LOCAL_STORAGE_KEY = "newCorrFormData";

export default function AddNewReminder() {
  const navigate = useNavigate();
  const { currentUserProfile } = useSelector((state) => state.profile);
  const { loading, error } = useSelector((state) => state.async);

  const initialValues = {
    dateReceived: "",
    dueDate: "",
    type: "",
    addressedTo: "",
    senderContact: "",
    priority: "",
    subject: "",
    details: "",
    agentEmail: "",
    agentName: "",
    assignedEmails: [],
    ticketStatus: "open",
    // Load from localStorage if available
    ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"),
  };

  const validationSchema = Yup.object({
    type: Yup.string().required("Please select a type"),
    addressedTo: Yup.string().required("Who is this correspondence addressed to?"),
    senderContact: Yup.string().required("Please enter the sender's address"),
    subject: Yup.string().required("Please enter a valid subject"),
    details: Yup.string().required("Please describe this correspondence"),
    assignedEmails: Yup.string()
      .required("You must enter at least one email")
      .test(
        "valid-emails",
        "Please enter valid email addresses separated by commas",
        (value) => {
          if (!value) return false;
          const emails = value.split(",").map((email) => email.trim());
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emails.every((email) => emailRegex.test(email));
        }
      ),
  });

  if (loading) return <LoadingComponent content="loading event..." />;
  if (error) return navigate("/error");

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const assignedEmailsArray = values.assignedEmails
              ? values.assignedEmails.split(",").map((e) => e.trim())
              : [];
            values.assignedEmails = assignedEmailsArray;
            values.agentEmail = currentUserProfile?.email || "";
            values.agentName = currentUserProfile?.displayName || "";
            await addCorrToFirestore(values);

            // Clear localStorage after successful submit
            localStorage.removeItem(LOCAL_STORAGE_KEY);

            toast.success("Your new corr has been added successfully.");
            setSubmitting(false);
            resetForm();
            navigate("/corrs");
          } catch (error) {
            toast.error(error.message);
            setSubmitting(false);
          }
        }}
      >
        {({ values, isSubmitting, dirty, isValid }) => {
          // Autosave form values to localStorage
          useEffect(() => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
          }, [values]);

          return (
            <Form className="ui form">
              <FormGroup widths="equal">
                <MyDateInput label="Date Received" name="dateReceived" />
                <MySelectInput
                  label="Type of Correspondence"
                  name="type"
                  options={[
                    { key: "letter", text: "Letter", value: "Letter" },
                    { key: "email", text: "Email", value: "Email" },
                    { key: "voicemail", text: "Voicemail", value: "Voicemail" },
                    { key: "verbal", text: "Verbal", value: "Verbal" },
                    { key: "other", text: "Other", value: "Other" },
                  ]}
                />
              </FormGroup>

              <FormGroup widths="equal">
                <MyTextInput label="Addressed To" name="addressedTo" placeholder="Enter recipient name or department" />
                <MyTextInput label="Sender's Contact Info" name="senderContact" placeholder="Enter sender's name, phone, or email" />
              </FormGroup>

              <FormGroup widths="equal">
                <MySelectInput
                  label="Priority"
                  name="priority"
                  options={[
                    { key: "low", text: "Low", value: "Low" },
                    { key: "medium", text: "Medium", value: "Medium" },
                    { key: "high", text: "High", value: "High" },
                  ]}
                />
                <MyDateInput label="Due Date" name="dueDate" />
              </FormGroup>

              <MyTextInput label="Subject" name="subject" placeholder="Enter subject line or topic" />
              <MyTextareaInput label="Correspondence Details" name="details" placeholder="Describe the content or summary of the correspondence" />
              <MyTextInput label="Designated Respondents (emails separated by commas)" name="assignedEmails" placeholder="Enter email addresses separated by commas" />

              <Button
                loading={isSubmitting}
                disabled={!isValid || !dirty || isSubmitting}
                content="Submit"
                type="submit"
              />
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
}