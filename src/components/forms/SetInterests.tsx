"use client"

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TagHandler from '@/components/common/TagHandler'
import { useState } from 'react'

export default function SetInterests({value, setValue, interests, addInterest, removeInterest}) {
	

  return (
    <div>
			<div className="mt-4 space-y-4">
				<div className="flex gap-2">
					<Input
						placeholder="Например: фронтенд"
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					<Button onClick={addInterest}>Добавить</Button>
				</div>

				<div className="flex flex-wrap gap-2">
					{interests.map((item, i) => (
						<TagHandler key={i} title={item} onDelete={() => removeInterest(i)}/>
					))}
				</div>

				{interests.length === 0 && (
					<div className="text-sm text-red-500">Добавьте хотя бы один интерес</div>
				)}
			</div></div>
  );
  
}