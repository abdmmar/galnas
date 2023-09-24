
type SuccessResponse<T> = {
  status: 'ok',
  message: string
  data: T
}
type ErrorResponse = {
  status: 'error',
  message: string
}
export type Response<T> = SuccessResponse<T> | ErrorResponse