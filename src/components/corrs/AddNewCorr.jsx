import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { Container, Button, FormGroup } from "semantic-ui-react";
import { uploadFileToStorage } from "../../firestore/firestoreService";
import LoadingComponent from "../LoadingComponent";
import { Form, Formik } from "formik";
import MyTextInput from "./forms/MyTextInput";
import MySelectInput from "./forms/MySelectInput";
import MyTextareaInput from "./forms/MyTextareaInput";
import MyDateInput from "./forms/MyDateInput";
import { addCorrToFirestore } from "../../firestore/firestoreService";
import { toast } from "react-toastify";


export default function AddNewCorr() {
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
    assignedEmails: "",
    attachments: [],
  };

  const validationSchema = Yup.object({
    type: Yup.string().required("Please select a type"),
    addressedTo: Yup.string().required("Who is this correspondence addressed to?"),
    senderContact: Yup.string().required("Please enter the sender's address"),
    subject: Yup.string().required("Please enter a valid subject"),
    details: Yup.string().required("Please describe this correspondence"),

    assignedEmails: Yup.string()
      .required("You must enter at least one email")
      .test("valid-emails", "Invalid email list", (value) => {
        if (!value) return false;

        const emails = value
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emails.every((email) => emailRegex.test(email));
      }),

    attachments: Yup.array(),
  });

  if (loading) return <LoadingComponent content="loading..." />;

  if (error) {
    navigate("/error");
    return null;
  }

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            const assignedEmailsArray = values.assignedEmails
              .split(",")
              .map((e) => e.trim())
              .filter(Boolean);

            const files = values.attachments || [];

            const corrData = {
              dateReceived: values.dateReceived,
              dueDate: values.dueDate,
              type: values.type,
              addressedTo: values.addressedTo,
              senderContact: values.senderContact,
              priority: values.priority,
              subject: values.subject,
              details: values.details,
              ticketStatus: "open",
              assignedEmails: assignedEmailsArray,
              agentEmail: currentUserProfile?.email || "",
              agentName: currentUserProfile?.displayName || "",
            };

            // 1. Create Firestore doc
            const corrRef = await addCorrToFirestore(corrData);

            // 2. Upload attachments (if any)
           // 2. Upload attachments (if any)
await Promise.all(
  files.map(async (file) => {
    const fileExt = file.name.split(".").pop();

    const hashedFileName = `${uuidv4()}.${fileExt}`;

    const fileRef = {
      locationID: corrRef.id,
      hashedFileName,
      originalFileName: file.name,
      uploadDate: new Date(),
    };

    return uploadFileToStorage(file, fileRef, hashedFileName);
  })
);

            toast.success("Correspondence created successfully.");
            resetForm();
            navigate("/corrs");
          } catch (err) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, dirty, isValid, setFieldValue }) => (
          <Form className="ui form">
            <FormGroup widths="equal">
              <MyDateInput label="Date Received" name="dateReceived" />
              <MySelectInput
                label="Type"
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
              <MyTextInput label="Addressed To" name="addressedTo" />
              <MyTextInput label="Sender Contact" name="senderContact" />
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

            <MyTextInput label="Subject" name="subject" />

            <MyTextareaInput label="Details" name="details" />

            <div className="field">
              <label>Attachments</label>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setFieldValue("attachments", Array.from(e.target.files))
                }
              />
            </div>

            <MyTextInput
              label="Assigned Emails (comma separated)"
              name="assignedEmails"
            />

            <Button
              loading={isSubmitting}
              disabled={!dirty || !isValid || isSubmitting}
              type="submit"
              content="Submit"
            />
          </Form>
        )}
      </Formik>
    </Container>
  );
}