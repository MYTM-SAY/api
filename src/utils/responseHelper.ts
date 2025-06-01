export const ResponseHelper = {
  success: (message: string, data?: any) => ({
    success: true,
    message,
    data: data,
  }),

  error: (message: string, statusCode: number = 400, data?: any) => ({
    success: false,
    message,
    data: data || null,
  }),
}
