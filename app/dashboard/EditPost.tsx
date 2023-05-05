"use client"

import Image from "next/image"
import { useState } from "react"
import Toggle from "./Toggle"
import { useMutation, useQueryClient } from "react-query"
import toast from "react-hot-toast"
import axios from "axios"
import { motion } from "framer-motion"
import { IconButton } from "@material-tailwind/react";
import { FaRegHeart } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

type EditProps = {
  id: string
  avatar: string
  name: string
  heading: string
  title: string
  comments?: {
    id: string
    postId: string
    userId: string
  }[]
}

export default function EditPost({
  avatar,
  name,
  title,
  heading,
  comments,
  id,
}: EditProps) {
  const [toggle, setToggle] = useState(false)
  const queryClient = useQueryClient()
  let deleteToastID: string

  const { mutate } = useMutation(
    async (id: string) =>
      await axios.delete("/api/posts/deletePost", { data: id }),
    {
      onError: (error) => {
        console.log(error)
      },
      onSuccess: (data) => {
        console.log(data)
        queryClient.invalidateQueries("getAuthPosts")
        toast.success("Post has been deleted.", { id: deleteToastID })
      },
    }
  )

  const deletePost = () => {
    deleteToastID = toast.loading("Deleting your post.", { id: deleteToastID })
    mutate(id)
  }

  return (
    <>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ ease: "easeOut" }}
        className="bg-white my-8 p-8 rounded-lg "
      >
        
        <div className="relative flex items-center justify-between gap-x-4">
          <div className="relative flex items-center gap-2">
            <Image width={32} height={32} src={avatar} alt="avatar" className="h-10 w-10 rounded-full bg-gray-50" />
            <div className="text-sm leading-6">
              <p className="font-semibold text-gray-900">
                <a href={"/"}>
                  <span className="absolute inset-0" />
                  {name}
                </a>
              </p>
              <p className="text-gray-600">Author</p>
            </div>
          </div>
          
          <button className="float-right rounded-lg px-3 p-1 text-center text-sm  outline-none ring-indigo-300 transition duration-100 bg-indigo-500 text-white md:text-base lg:inline-block">Follow</button>
        </div>

        <div className="my-4">
          <p className="break-all">{heading}</p>
        </div>
        <div className="my-4">
          <p className="break-all">{title}</p>
        </div>
        <div className="flex items-center gap-4 ">
          <p className=" text-sm font-bold text-gray-700">          
            <IconButton size="sm" color="blue">
                {comments?.length} 
            </IconButton>           
          </p>
         
          <button onClick={(e) => { e.stopPropagation() 
          setToggle(true) }} className="text-sm font-bold text-red-500">
             <IconButton size="sm" color="red">
              <FaTrashAlt /> 
            </IconButton>
          </button>
        </div>


      </motion.div>
      {toggle && <Toggle deletePost={deletePost} setToggle={setToggle} />}
    </>
  )
}
