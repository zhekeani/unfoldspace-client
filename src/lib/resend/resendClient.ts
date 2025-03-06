import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "RESEND_API_KEY is not defined in the environment variables."
  );
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
