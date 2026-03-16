import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ModalWrapper from "../../modals/ModalWrapper";
import { Form, Label, Button } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { uploadFileToStorage } from "../../../firestore/firestoreService";
import { toast } from "react-toastify";
import { closeModal } from "../../modals/modalReducer";

export default function UploadFile(corr) {
  const dispatch = useDispatch();
  const { id } = corr;
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");

const uploadFiles = async (e) => {
  e.preventDefault();

  // 1️⃣ Make sure a file is selected
  if (!file) {
    setErr("Please select a file.");
    return;
  }

  // 2️⃣ Validate file type
  if (!file.name.match(/.(pdf|PDF|docx|doc|jpeg|jpg|xlsx|xls)$/i)) {
    setErr("You must upload an approved file type.");
    return;
  }

  const fileName = file.name;
  const fileExt = fileName.split(".").pop();
  const hash = uuidv4();
  const hashedFile = `${hash}.${fileExt}`;

  // 3️⃣ Prepare Firestore metadata
  const fileRef = {
    locationID: id,
    hashedFileName: hashedFile,
    originalFileName: fileName,
    uploadDate: new Date(),
  };

  try {
    // 4️⃣ Await the upload
    await uploadFileToStorage(file, fileRef, hashedFile);

    // 5️⃣ Close modal and show success
    dispatch(closeModal());
    toast.success("Your file has been added successfully.");
  } catch (error) {
    console.error("Upload failed:", error);
    toast.error(error.message);
  }
};


  return (
    <ModalWrapper size="small">
      <Form onSubmit={uploadFiles}>
        <Form.Field>
          <Label>Upload File</Label>
          <input
            type="file"
            accept="application/pdf, image/jpeg, image/jpg, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Field>
        <Button type="submit">Upload</Button>
      </Form>
      {err && (
        <Button basic color="red">
          {err}
        </Button>
      )}
    </ModalWrapper>
  );
}
