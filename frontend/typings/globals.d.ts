declare type Nullable<T> = T | null

declare interface NullableState<T> {
	data: Nullable<T>
}
