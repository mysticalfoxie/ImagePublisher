import {ImageDataModel} from "./image-data.model";
import {Injectable} from "@angular/core";
import {ImageDBService} from "./image-db.service";

@Injectable()
export class ImageLoaderService {

    private loadImageData(file: File | Blob): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = e => reject(e);
            reader.onload = async e => resolve(e.target!.result as string);
            reader.readAsDataURL(file);
        });
    }

    private loadPseudoImage(data: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = err => reject(err);
            image.src = data;
        });
    }

    private async loadBlobUrl(base64: string): Promise<string> {
        const response = await fetch(base64);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    public async loadImageFromFile(file: File | Blob): Promise<ImageDataModel> {
        const base64 = await this.loadImageData(file);
        const url = await this.loadBlobUrl(base64);
        const image = await this.loadPseudoImage(base64);
        const filesize = this.formatFileSize(file.size);
        const aspectRatio = this.calculateAspectRatio(image);

        return {
            id: ImageDBService.getIdByUrl(url),
            blobUrl: url,
            base64: base64,
            filename: (file as File).name || 'image.png',
            filesize: filesize,
            height: image.height.toString(),
            width: image.width.toString(),
            aspectRatio: aspectRatio,
        };
    }

    public async loadImageFromUrl(url: string): Promise<ImageDataModel> {
        const response = await fetch(url);
        const blob = await response.blob();
        return await this.loadImageFromFile(blob);
    }

    private gcd(a: number, b: number): number {
        return b == 0 ? a : this.gcd(b, a % b);
    }

    private calculateAspectRatio(image: HTMLImageElement): string {
        const divisor = this.gcd(image.width, image.height);
        return `${image.width / divisor}:${image.height / divisor}`;
    }

    private formatFileSize(size: number): string {
        const kilobytes = size / 1024;
        if (kilobytes < 1024)
            return `${kilobytes.toFixed(2)} KB`;

        const megabytes = kilobytes / 1024;
        return `${megabytes.toFixed(2)} MB`;
    }

}
