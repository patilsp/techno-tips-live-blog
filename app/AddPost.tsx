"use client"

import { useMutation, useQueryClient } from "react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import axios, { AxiosError } from "axios"

export default function CreatePost() {
  const [heading, setHeading] = useState("")
  const [title, setTitle] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const queryClient = useQueryClient()
  let toastPostID: string

  //Create a post
  const { mutate } = useMutation(
    async (title: string) =>
      await axios.post("/api/posts/addPost", {
        title,heading
      }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, { id: toastPostID })
        }
        setIsDisabled(false)
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["posts"])
        toast.success("Post has been made 🔥", { id: toastPostID })
        setTitle("")
        setIsDisabled(false)
      },
    }
  )
  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsDisabled(true)
    toastPostID = toast.loading("Creating your post", { id: toastPostID })
    mutate(title)
  }

  return (
    <form onSubmit={submitPost} className="bg-white my-8 p-8 rounded-md ">
     <div className="flex flex-col my-1">
      <input
          placeholder="Title here"
          name="heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="p-4 text-lg rounded-md my-2  bg-gray-200"
        />
     </div>
      <div className="flex flex-col my-4">
      <textarea
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          name="title"
          placeholder="What's on your mind?"
          className="p-4 text-lg rounded-md my-2  bg-gray-200"
        />
      </div>
      <div className=" flex items-center justify-between gap-2">
        <p
          className={`font-bold text-sm ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          } `}
        >{`${title.length}/300`}</p>
        <button
          disabled={isDisabled}
          className="btn-primary rounded-lg bg-gray-200 px-6 py-2 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-500 hover:text-white active:text-indigo-100 focus-visible:ring active:text-gray-700 md:text-base lg:inline-block"
          type="submit"
        >
          Create post
        </button>
      </div>
    </form>
  )
}
