import { Session } from "next-auth";

export interface CustomSession extends Session {
  user?: CustomUser & {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };
}

type CustomUser = {
  _id?: string | null | undefined;
  firstName?: string | null | undefined;
  lastName?: string | null | undefined;
};
