export type PostType = {
  id: string
  heading: string
  title: string
  updatedAt?: string
  user: {
    email: string
    id: string
    image: string
    name: string
  }
  comments: {
    createdAt?: string
    id: string
    postId: string
    title: string
    userId: string
    user: {
      email: string
      id: string
      image: string
      name: string
    }
  }[]
}
