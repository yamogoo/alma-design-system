// export const sanitizeInput = async (input: string): Promise<string> => {
//   const { default: DOMPurify } = await import("dompurify");
//   return DOMPurify.sanitize(input);
// };

import DOMPurify from "dompurify";

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input);
};
