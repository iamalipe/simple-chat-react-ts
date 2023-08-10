import { useEffect, useMemo, useRef } from "react";
// import { MongoDBCollection, InsertEvent, UpdateEvent, ReplaceEvent, DeleteEvent } from "realm-web";

type ChangeHandlers<T extends Realm.Services.MongoDB.Document> = {
  onInsert?: (change: Realm.Services.MongoDB.InsertEvent<T>) => void;
  onUpdate?: (change: Realm.Services.MongoDB.UpdateEvent<T>) => void;
  onReplace?: (change: Realm.Services.MongoDB.ReplaceEvent<T>) => void;
  onDelete?: (change: Realm.Services.MongoDB.DeleteEvent<T>) => void;
};

const noop = () => {};
const defaultChangeHandlers = {
  onInsert: noop,
  onUpdate: noop,
  onReplace: noop,
  onDelete: noop,
};

/**
 * Opens/manages a change stream and calls provided change handlers for a given MongoDB collection.
 * @param {Realm.Services.MongoDB.MongoDBCollection<T>} collection - A MongoDB collection client object.
 * @param {Object} changeHandlers - A set of callback functions to call in response to changes.
 * @param {(change: Realm.Services.MongoDB.InsertEvent<T>) => void} [changeHandlers.onInsert] - A change handler callback that receives an Insert event.
 * @param {(change: Realm.Services.MongoDB.UpdateEvent<T>) => void} [changeHandlers.onUpdate] - A change handler callback that receives an Update event.
 * @param {(change: Realm.Services.MongoDB.ReplaceEvent<T>) => void} [changeHandlers.onReplace] - A change handler callback that receives a Replace event.
 * @param {(change: Realm.Services.MongoDB.DeleteEvent<T>) => void} [changeHandlers.onDelete] - A change handler callback that receives a Delete event.
 */
export function useWatch<T extends Realm.Services.MongoDB.Document>(
  changeHandlers: ChangeHandlers<T>,
  collection?: Realm.Services.MongoDB.MongoDBCollection<T>,
  filter = {}
) {
  const filterMemo = useMemo(() => filter, [filter]);
  const handlers = { ...defaultChangeHandlers, ...changeHandlers };
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = {
      onInsert: handlers.onInsert || noop,
      onUpdate: handlers.onUpdate || noop,
      onReplace: handlers.onReplace || noop,
      onDelete: handlers.onDelete || noop,
    };
  }, [
    handlers.onInsert,
    handlers.onUpdate,
    handlers.onReplace,
    handlers.onDelete,
  ]);

  useEffect(() => {
    let stream:
      | AsyncGenerator<Realm.Services.MongoDB.ChangeEvent<T>, unknown, unknown>
      | undefined;
    const watchCollection = async () => {
      stream = collection?.watch({ filter: filterMemo });
      if (!stream) return;
      for await (const change of stream) {
        switch (change.operationType) {
          case "insert": {
            handlersRef.current.onInsert?.(change);
            break;
          }
          case "update": {
            handlersRef.current.onUpdate?.(change);
            break;
          }
          case "replace": {
            handlersRef.current.onReplace?.(change);
            break;
          }
          case "delete": {
            handlersRef.current.onDelete?.(change);
            break;
          }
          default: {
            throw new Error(
              `Invalid change operation type: ${change.operationType}`
            );
          }
        }
      }
    };
    watchCollection();
    return () => {
      // Close the change stream in the effect cleanup
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      stream?.return();
    };
  }, [collection, filterMemo]);
}
