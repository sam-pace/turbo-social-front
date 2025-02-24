import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query {
    postAll {
      id
      content
      likes
    }
  }
`;

export const GET_TURBOMARKET = gql`
  query {
    turboMarketAll {
      id
      userId
      title
      description
      price
      brand
      model
      year
      mileage
      fuelType
      transmission
      imageUrl
      location
    }
  }
`;