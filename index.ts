import {
  deleteObject,
  getBytes,
  getMetadata,
  ref,
  uploadBytes,
  type FirebaseStorage,
} from 'firebase/storage';
import { createWriteStream, openAsBlob } from 'node:fs';

export { initializeApp } from 'firebase/app';
export { getStorage } from 'firebase/storage';

/**
 * @class FirebaseStorageStore
 * @param {Object} options - Options for the store
 * @param {FirebaseStorage} options.firebaseStorage - A Firebase Storage instance
 * @param {string} options.sessionPath - Path inside the storage bucket to store the session files
 * @returns {FirebaseStorageStore}
 * @example
 * import { Client, RemoteAuth } from 'whatsapp-web.js';
 * const client = new Client({
 *   authStrategy: new RemoteAuth({
 *     store: new FirebaseStorageStore({
 *       firebaseStorage: getStorage(app),
 *       sessionPath: 'sessions-whatsapp-web.js', // save in a sub-directory
 *     }),
 *     backupSyncIntervalMs: 600000, // 10 minutes
 *   }),
 *   ... // other options
 * });
 */
export class FirebaseStorageStore {
  public fbStorage: FirebaseStorage;
  public sessionPath?: string;
  constructor({
    firebaseStorage,
    sessionPath,
  }: {
    firebaseStorage: FirebaseStorage;
    sessionPath?: string;
  }) {
    this.fbStorage = firebaseStorage;
    this.sessionPath = sessionPath;
  }
  async sessionExists(options: { session: string }): Promise<boolean> {
    try {
      await getMetadata(
        ref(
          this.fbStorage,
          this.sessionPath
            ? `${this.sessionPath.replace(/\\/g, '/')}/${options.session}.zip`
            : `${options.session}.zip`,
        ),
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  async save(options: { session: string }): Promise<void> {
    await uploadBytes(
      ref(
        this.fbStorage,
        this.sessionPath
          ? `${this.sessionPath.replace(/\\/g, '/')}/${options.session}.zip`
          : `${options.session}.zip`,
      ),
      await openAsBlob(`${options.session}.zip`),
      {
        contentType: 'application/zip',
      },
    );
  }
  async extract(options: { session: string; path: string }): Promise<void> {
    createWriteStream(options.path, {
      autoClose: true,
      encoding: 'binary',
    }).write(
      Buffer.from(
        await getBytes(
          ref(
            this.fbStorage,
            this.sessionPath
              ? `${this.sessionPath.replace(/\\/g, '/')}/${options.session}.zip`
              : `${options.session}.zip`,
          ),
        ),
      ),
    );
  }
  async delete(options: { session: string }): Promise<void> {
    return deleteObject(
      ref(
        this.fbStorage,
        this.sessionPath
          ? `${this.sessionPath.replace(/\\/g, '/')}/${options.session}.zip`
          : `${options.session}.zip`,
      ),
    );
  }
}
