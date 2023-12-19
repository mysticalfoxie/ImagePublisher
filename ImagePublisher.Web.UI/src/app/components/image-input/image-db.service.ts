import {Injectable} from "@angular/core";
import {ImageDataModel} from "./image-data.model";

@Injectable()
export class ImageDBService {

    public saveImage(image: ImageDataModel) {
        return this.openDatabase(async event => {
            const response = await fetch(image.base64);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            await this.saveImageToDB(event, image);
            return url;
        });
    }

    public async refreshBlobUrl(url: string): Promise<string> {
        return await this.openDatabase(async event => await this.reloadImageByBlobUrl(event, url));
    }

    private openDatabase<T>(fn: (e: Event) => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const connection = indexedDB.open("ImagePublisher", 1);
            connection.onupgradeneeded = event => this.createObjectStore(event);
            connection.onerror = err => reject(err);
            connection.onsuccess = async event => {
                const result = await fn(event);
                resolve(result);
            }
        });
    }

    private createObjectStore(event: any) {
        const db = (event.target! as any).result as IDBDatabase;
        db.createObjectStore("IPObjectStore", {keyPath: "id"});
    }

    private executeRequest<T>(event: Event, readability: 'readonly' | 'readwrite', action: (store: IDBObjectStore) => Promise<IDBRequest>): Promise<T> {
        return new Promise(async (resolve, reject) => {
            const db = (event.target! as any).result as IDBDatabase;
            const transaction = db.transaction(["IPObjectStore"], readability);
            const store = transaction.objectStore("IPObjectStore");

            const request = await action(store);

            request.onerror = err => reject(err);
            request.onsuccess = data => resolve(data as T);
        })
    }

    private async reloadImageByBlobUrl(event: any, recentUrl: string): Promise<string> {
        const entry = await this.executeRequest<ImageDataModel>(event, 'readonly', async store => {
            const id = this.getIdByUrl(recentUrl);
            return store.get(id);
        });

        const response = await fetch(entry.base64);
        const blob = await response.blob();
        const newUrl = URL.createObjectURL(blob);
        const id = this.getIdByUrl(newUrl);
        entry.blobUrl = newUrl;
        entry.id = id;

        await this.executeRequest<void>(event, 'readwrite', async store => store.delete(entry.id));
        await this.executeRequest<void>(event, 'readwrite', async store => store.put(entry));

        return entry.blobUrl;
    }

    private getIdByUrl(url: string): string {
        const regex = new RegExp("(\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12})$");
        const match = regex.exec(url)?.[1];
        if (!match)
            throw new Error("Could not determine a GUID from the url " + url);

        return match;
    }

    private saveImageToDB(event: any, image: ImageDataModel): Promise<void> {
        return new Promise((resolve, reject) => {
            const db = (event.target! as any).result as IDBDatabase;
            const transaction = db.transaction(["IPObjectStore"], "readwrite");
            const store = transaction.objectStore("IPObjectStore");
            image.id = this.getIdByUrl(image.blobUrl);
            const request = store.put(image);

            request.onerror = err => reject(err);
            request.onsuccess = () => resolve();
        })
    }
}
