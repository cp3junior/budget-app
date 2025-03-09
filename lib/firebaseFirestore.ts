import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  documentId,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  Unsubscribe,
  updateDoc,
  where,
  WithFieldValue,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

export const fetchDocuments = async <T>(
  collectionName: string,
  options?: FetchOption
): Promise<T[]> => {
  let docs: T[] = [];
  try {
    const collectionRef = collection(db, collectionName);

    const queryConstraints: QueryConstraint[] = [];

    if (options?.whereClauses) {
      options.whereClauses.forEach((clause) => {
        queryConstraints.push(
          where(clause.field, clause.operator, clause.value)
        );
      });
    }

    if (options?.ids && options.ids.length > 0) {
      queryConstraints.push(where(documentId(), "in", options.ids));
    }

    if (options?.orderByField) {
      queryConstraints.push(
        orderBy(options.orderByField, options.orderDirection || "desc")
      );
    }

    if (options?.limit && options?.limit > 0) {
      queryConstraints.push(limit(options.limit));
    }

    const q = query(collectionRef, ...queryConstraints);

    const querySnapshot = await getDocs(q);

    docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error("Error fetching documents:", error);
  }

  return docs as T[];
};

export const fetchSnapshot = <T>(
  collectionName: string,
  options?: FetchOption,
  callback?: (data: T[]) => void
): Unsubscribe => {
  const collectionRef = collection(db, collectionName);

  const queryConstraints: QueryConstraint[] = [];

  if (options?.whereClauses) {
    options.whereClauses.forEach((clause) => {
      queryConstraints.push(where(clause.field, clause.operator, clause.value));
    });
  }

  if (options?.orderByField) {
    queryConstraints.push(
      orderBy(options.orderByField, options.orderDirection || "desc")
    );
  }

  if (options?.limit && options?.limit > 0) {
    queryConstraints.push(limit(options.limit));
  }

  const q = query(collectionRef, ...queryConstraints);

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const docs: T[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      if (callback) {
        callback(docs);
      }
    },
    (error) => {
      if (unsubscribe) unsubscribe();
      console.warn("Error fetching real-time updates:", error);
    }
  );

  return unsubscribe;
};

export const addDocument = async <T extends WithFieldValue<DocumentData>>(
  collectionName: string,
  data: T
): Promise<string> => {
  let docId = "";
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    docId = docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  return docId;
};

export const addMultipleDocuments = async <
  T extends WithFieldValue<DocumentData>,
  U
>(
  collectionName: string,
  items: T[]
): Promise<U[]> => {
  const batch = writeBatch(db);
  const collectionRef = collection(db, collectionName);

  const itemsWithIds = items.map((item) => {
    const docRef = doc(collectionRef);
    batch.set(docRef, item);

    return {
      id: docRef.id,
      ...item,
    } as U;
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error("Error saving items:", error);
  }

  return itemsWithIds;
};

export const updateDocument = async <T extends WithFieldValue<DocumentData>>(
  collectionName: string,
  taskId: string,
  data: T
) => {
  try {
    const taskRef = doc(db, collectionName, taskId);
    await updateDoc(taskRef, data);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    return false;
  }
};
