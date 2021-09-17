function errorMessage(property: string, message: string): Record<string, any> {
  return { property: property, message: message };
}

function resErrors(errors: Record<string, any>[]) {
  return { errors: errors };
}

function resData<T>(message: T): Record<string, any> {
  return { data: message };
}

export { errorMessage, resErrors, resData };
