import {Injectable} from "@angular/core";
import {ImageDataModel} from "./image-data.model";
import {ImageInputComponent} from "./image-input.component";

@Injectable()
export class ImageDBService {

    public ui: ImageInputComponent | undefined;

    public async saveImage(image: ImageDataModel): Promise<void> {
        await this.openDatabase(async event => {
            const response = await fetch(image.base64);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            await this.saveImageToDB(event, image);
            return url;
        });
    }

    public async refreshBlobUrl(): Promise<string | null> {
        return await this.openDatabase(async event => await this.reloadImageByBlobUrl(event));
    }

    public async deleteImage(url: string): Promise<void> {
        await this.openDatabase(async event => await this.deleteImageByUrl(event, url));
    }

    public async getImage(url: string): Promise<ImageDataModel> {
        const id = this.ui?.id || ImageDBService.getIdByUrl(url);
        return await this.openDatabase(async event => await this.getObjectById(event, id));
    }

    private async deleteImageByUrl(event: Event, url: string) {
        const id = this.ui?.id || ImageDBService.getIdByUrl(url);
        await this.executeRequest(event, 'readwrite', async store => store.delete(id));
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
        db.createObjectStore("ImageInputComponent", {keyPath: "id"});
    }

    private executeRequest<T>(event: Event, readability: 'readonly' | 'readwrite', action: (store: IDBObjectStore) => Promise<IDBRequest>): Promise<T> {
        return new Promise(async (resolve, reject) => {
            const db = (event.target! as any).result as IDBDatabase;
            const transaction = db.transaction(['ImageInputComponent'], readability);
            const store = transaction.objectStore("ImageInputComponent");

            const request = await action(store);

            request.onerror = err => reject(err);
            request.onsuccess = data => resolve(data as T);
        })
    }

    private getObjectById<T>(event: Event, id: string): Promise<T> {
        return new Promise(async (resolve, reject) => {
            const db = (event.target! as any).result as IDBDatabase;
            const transaction = db.transaction(['ImageInputComponent'], 'readonly');
            const store = transaction.objectStore("ImageInputComponent");
            const request = await store.get(id);
            request.onerror = err => reject(err);
            request.onsuccess = () => resolve(request.result as T);
        });
    }

    private async reloadImageByBlobUrl(event: any): Promise<string | null> {
        if (!this.ui?.id)
            throw new Error("Cannot reload the current image when the component has no key attribute assigned.");

        const entry = await this.getObjectById<ImageDataModel>(event, this.ui!.id);
        if (!entry) return null;

        const oldId = this.ui!.id || ImageDBService.getIdByUrl(entry.blobUrl);
        const response = await fetch(entry.base64);
        const blob = await response.blob();
        const newUrl = URL.createObjectURL(blob);
        entry.blobUrl = newUrl;
        entry.id = this.ui!.id || ImageDBService.getIdByUrl(newUrl);

        await this.executeRequest<void>(event, 'readwrite', async store => store.delete(oldId));
        await this.executeRequest<void>(event, 'readwrite', async store => store.put(entry));

        return entry.blobUrl;
    }

    public static getIdByUrl(url: string): string {
        const regex = new RegExp("([\\w\\d]{8}-[\\w\\d]{4}-[\\w\\d]{4}-[\\w\\d]{4}-[\\w\\d]{12})$");
        const match = regex.exec(url)?.[1];
        if (!match)
            throw new Error("Could not determine a GUID from the url " + url);

        return match;
    }

    private saveImageToDB(event: any, image: ImageDataModel): Promise<void> {
        return new Promise((resolve, reject) => {
            const db = (event.target! as any).result as IDBDatabase;
            const transaction = db.transaction(["ImageInputComponent"], "readwrite");
            const store = transaction.objectStore("ImageInputComponent");
            image.id = this.ui!.id || ImageDBService.getIdByUrl(image.blobUrl);
            const request = store.put(image);

            request.onerror = err => reject(err);
            request.onsuccess = () => resolve();
        });
    }
}
