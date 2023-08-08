import { useMemo } from "react";
import { useRealm } from ".";
import { atlasConfig } from "../config";

/**
 * Returns a MongoDB Collection client object
 * @template DocType extends Realm.Services.MongoDB.Document
 * @param {string} dbName - The name of database that contains the collection.
 * @param {string} collectionName - The name of the collection.
 * @returns {Realm.Services.MongoDB.MongoDBCollection<DocType>} config.collection - The name of the collection.
 */

export function useCollection(dbName: string, collectionName: string) {
  const app = useRealm();

  return useMemo(() => {
    const mdb = app.currentUser?.mongoClient(atlasConfig.dataSourceName);
    return mdb?.db(dbName).collection(collectionName);
  }, [app.currentUser, dbName, collectionName]);
}
