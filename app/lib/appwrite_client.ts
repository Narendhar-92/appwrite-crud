import { Client } from "appwrite";

const client = new Client();
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINTS as string)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_IDS as string);

export default client;
