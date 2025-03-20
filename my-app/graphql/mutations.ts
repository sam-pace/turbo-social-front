import { gql } from "@apollo/client/core";

export const LIKE_POST = gql`
  mutation HandleLikes($updatePost: UpdatePostInput!) {
    handleLikes(updatePost: $updatePost) {
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

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken)
  }
`;

export const CREATE_TURBOMARKET = gql`
  mutation CreateTurboMarket($data: CreateTurboMarketInput!) {
    createTurboMarket(data: $data) {
      id
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(createComment: $input) {
      id
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($createPost: CreatePostInput!) {
    createPost(createPost: $createPost) {
        content
        createdAt
        id
        userId
    }
}`
