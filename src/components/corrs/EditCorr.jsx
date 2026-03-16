import React from "react";
import ModalWrapper from "../modals/ModalWrapper";
import * as Yup from "yup";
import { Button, FormGroup } from "semantic-ui-react";
import { Form, Formik } from "formik";
import MyTextInput from "./forms/MyTextInput";
import MySelectInput from "./forms/MySelectInput";
import MyTextareaInput from "./forms/MyTextareaInput";
import MyDateInput from "./forms/MyDateInput";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { closeModal } from "../modals/modalReducer";
import { updateCorrInFirestore } from "../../firestore/firestoreService";

export default function EditCorr(corr) {
  const dispatch = useDispatch();

  const originalCorr = useSelector((state) =>
    state.corrs.corrs.find((r) => r.id === corr.id)
  );

  // ✅ Normalize assignedEmails for the form field (string of emails)
  const initialValues = {
    id: originalCorr.id,
    dateReceived: originalCorr.dateReceived,
    dueDate: originalCorr.dueDate,
    type: originalCorr.type,
    addressedTo: originalCorr.addressedTo,
    senderContact: originalCorr.senderContact,
    priority: originalCorr.priority,
    subject: originalCorr.subject,
    details: originalCorr.details,
    agentEmail: originalCorr.agentEmail,
    agentName: originalCorr.agentName,
    assignedEmails: Array.isArray(originalCorr.assignedEmails)
      ? originalCorr.assignedEmails.join(", ")
      : originalCorr.assignedEmails || "",
  };

  const validationSchema = Yup.object({
    type: Yup.string(),
    addressedTo: Yup.string(),
    senderContact: Yup.string(),
    subject: Yup.string(),
    details: Yup.string(),
    assignedEmails: Yup.string()
  });

  return (
    <ModalWrapper size="large" header={`Edit ${corr.subject}`}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            // ✅ Convert comma-separated emails to an array
            const updatedValues = {
              ...values,
              assignedEmails: typeof values.assignedEmails === "string"
                ? values.assignedEmails
                    .split(",")
                    .map((e) => e.trim())
                    .filter((e) => e.length > 0)
                : values.assignedEmails || [],
            };

            await updateCorrInFirestore(updatedValues);

            toast.success("Your correspondence has been updated successfully.");
            dispatch(closeModal());
          } catch (error) {
            toast.error(error.message);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, dirty, isValid }) => (
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
              <MyTextInput
                label="Addressed To"
                name="addressedTo"
                placeholder="Enter recipient name or department"
              />
              <MyTextInput
                label="Sender's Contact Info"
                name="senderContact"
                placeholder="Enter sender's name, phone, or email"
              />
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

            <MyTextInput
              label="Subject"
              name="subject"
              placeholder="Enter subject line or topic"
            />

            <MyTextareaInput
              label="Correspondence Details"
              name="details"
              placeholder="Describe the content or summary of the correspondence"
            />

            <MyTextInput
              label="Designated Respondents"
              name="assignedEmails"
              placeholder="Enter email addresses separated by commas"
            />

            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              content="Submit"
              type="submit"
            />
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
}
