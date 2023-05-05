"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"
import { PostType } from "./types/Post"

type Comment = {
  postId?: string
  title: string
}
type PostProps = {
  id?: string
}
export default function AddComment({ id }: PostProps) {
  let commentToastId: string
  console.log(id)
  const [title, setTitle] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)

  const queryClient = useQueryClient()
  const { mutate } = useMutation(
    async (data: Comment) => {
      return axios.post("/api/posts/addComment", { data })
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["detail-post"])
        setTitle("")
        setIsDisabled(false)
        toast.success("Added your comment", { id: commentToastId })
      },
      onError: (error) => {
        console.log(error)
        setIsDisabled(false)
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, { id: commentToastId })
        }
      },
    }
  )

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDisabled(true)
    commentToastId = toast.loading("Adding your comment", {
      id: commentToastId,
    })
    mutate({ title, postId: id })
  }
  return (
    <form onSubmit={submitPost} className="my-8">
      <h3 className="text-xl">Add a comment</h3>

      <div className="flex flex-col my-2">
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          name="title"
          className="p-4 text-lg rounded-md my-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={isDisabled}
          className="rounded-lg px-6 py-2 text-center text-sm font-semibold outline-none ring-indigo-300 transition duration-100 bg-indigo-500 text-white md:text-base lg:inline-block"
          type="submit"
        >
          Add Comment 🚀
        </button>
        <p
          className={`font-bold  ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          } `}
        >{`${title.length}/300`}</p>
      </div>
    </form>
  )
}
