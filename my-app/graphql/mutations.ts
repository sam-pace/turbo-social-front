import { gql } from "@apollo/client/core";

export const LIKE_POST = gql`
  mutation LikePost($input: UpdatePostInput!) {
    updatePost(updatePost: $input) {
      id
      likes
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($userLogin: UserLogin!) {
    login(userLogin: $userLogin) {
      accessToken
      refreshToken
      message
    }
  }
`;
