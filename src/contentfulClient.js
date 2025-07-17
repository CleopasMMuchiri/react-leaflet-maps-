import { createClient } from 'contentful';


const spaceID = "";
const key = "";

const client = createClient({
  space: spaceID,
  accessToken: key,
});

export default client;

