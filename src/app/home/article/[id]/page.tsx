"use client"

import { useParams } from 'next/navigation'

export default function ArticlePage() {
	
	const { id } = useParams()

  return (
    <div>{
			id
		}</div>
  );
  
}