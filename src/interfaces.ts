export interface InterfaceDeferredPromise {
	resolve: any;
	reject: any;
	promise: Promise<any>;
};

type ChangeFn = (changes: Object, storageType: string) => any;

export interface InterfaceConfiguration {
	onChange: ChangeFn;
}
