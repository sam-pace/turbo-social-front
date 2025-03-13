import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query PostAll($userId: String!) {
    postAll(userId: $userId) {
      id
      content
      createdAt
      user {
        avatarUrl
        username
      }
      comments {
        content
      }
      imageUrl
      likes
      isLiked
      updatedAt
      userId
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query Post($id: String!) {
    post(id: $id) {
      user {
        avatarUrl
        username
      }
      id
      content
      likes
    }
  }
`;

export const GET_COMMENTS_BY_POST = gql`
  query CommentsByPost($postId: String!) {
    commentsByPost(postId: $postId) {
      avatarUrl
      content
      createdAt
      id
      postId
      userId
      username
    }
  }
`;

export const GET_TURBOMARKET = gql`
  query {
    turboMarketAll {
      id
      userId
      user {
        username
        avatarUrl
      }
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

export const GET_TURBOMARKET_ITEM = gql`
  query TurboMarket($id: String!) {
    turboMarket(id: $id) {
      id
      title
      description
      price
      imageUrl
      brand
      model
      year
      mileage
      fuelType
      transmission
      location
      user {
        username
        avatarUrl
      }
    }
  }
`;

export const GET_USER = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      username
      avatarUrl
    }
  }
`;
