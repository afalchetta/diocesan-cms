import React from "react";
import { Header, Button, Icon, List, Segment } from "semantic-ui-react";
import ModalWrapper from "../../modals/ModalWrapper";
import { deleteFile, downloadFile } from "../../../firestore/firestoreService";
import { useDispatch, useSelector } from "react-redux";
import useFirestoreCollection from "../../../hooks/useFirestoreCollection";
import { getCorrFiles } from "../../../firestore/firestoreService";
import { listenToFiles } from "./FilesAction";
import moment from "moment/moment";

export default function CorrFile(corr) {
  const { id } = corr;
  const dispatch = useDispatch();
  const { files } = useSelector((state) => state.files);

  useFirestoreCollection({
    query: () => getCorrFiles(id),
    data: (files) => dispatch(listenToFiles(files)),
    deps: [id, dispatch],
  });

  return (
    <>
      <ModalWrapper size="small">
        <Segment>
          <Header as="h3" content={`${corr.subject}'s files list`} />
          {files.length !== 0 ? (
            files &&
            files
              .sort((a, b) => {
                if (a.dateReceived < b.dateReceived) {
                  return 1;
                } else if (a.dateReceived > b.dateReceived) {
                  return -1;
                }
              })
              .map((file) => (
                <List key={file.id}>
                  <List.Item>
                    <Segment style={{ border: "1px solid #fff" }}>
                      <Header floated="left" as="h5">
                        {file.originalFileName}
                        <Header.Subheader>
                          {`Uploaded: ${moment(file.uploadDate).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}`}
                        </Header.Subheader>
                      </Header>
                      <Button
                        floated="left"
                        style={{ marginLeft: 22 }}
                        animated
                        onClick={(f) => downloadFile(file.hashedFileName)}
                      >
                        <Button.Content visible>
                          <Icon name="eye" />
                        </Button.Content>
                        <Button.Content hidden>View</Button.Content>
                      </Button>
                      <Button
                        animated
                        style={{ marginLeft: 22 }}
                        onClick={(e) => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this file?"
                            )
                          ) {
                            deleteFile(file.id, file.hashedFileName);
                          }
                        }}
                      >
                        <Button.Content visible>
                          <Icon name="trash" />
                        </Button.Content>
                        <Button.Content hidden>Delete</Button.Content>
                      </Button>
                    </Segment>
                  </List.Item>
                </List>
              ))
          ) : (
            <Header as="h4">This location has no files.</Header>
          )}
        </Segment>
      </ModalWrapper>
    </>
  );
}
