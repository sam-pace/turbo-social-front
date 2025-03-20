import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://ft-back.onrender.com/graphql",
    fetchOptions: {
      mode: 'no-cors'
    }
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            read() {
              return null;
            }
          }
        }
      }
    }
  }),
});

export default client;
