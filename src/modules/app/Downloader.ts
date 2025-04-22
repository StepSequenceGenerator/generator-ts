export abstract class Downloader<T> {
  abstract load(): T;
}
