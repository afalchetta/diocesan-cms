import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  asyncActionError,
  asyncActionFinish,
  asyncActionStart,
} from "../async/asyncReducer";
import { dataFromSnapshot } from "../firestore/firestoreService";

export default function useFirestoreCollection({ query, data, deps }) {
  const dispatch = useDispatch();

  useEffect(() => {
    let unsub;

    try {
      const q = query();
      if (!q || !q.onSnapshot) {
        console.warn("Invalid query returned:", q);
        return;
      }

      dispatch(asyncActionStart());

      unsub = q.onSnapshot(
        (snapshot) => {
          const docs = snapshot.docs.map(dataFromSnapshot);
          data(docs);
          dispatch(asyncActionFinish());
        },
        (error) => {
          console.error("🔥 Firestore snapshot error:", error);
          dispatch(asyncActionError(error));
        }
      );
    } catch (err) {
      console.error("🔥 Firestore query threw:", err);
      dispatch(asyncActionError(err));
    }

    return () => {
      if (unsub) unsub();
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
