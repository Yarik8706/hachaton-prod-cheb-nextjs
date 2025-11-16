"use client"

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TagHandler from '@/components/common/TagHandler'
import { useState } from 'react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Control, FieldValues } from 'react-hook-form'


interface IProps {
	value: string,
	setValue: (v: string) => null,
	interests: string[],
	addInterests: () => null,
	removeInterest: (i: number) => null,
	validate?: boolean
}

export default function SetInterests({ 
																			 value, 
																			 setValue, 
																			 interests,
																			 addInterest,
																			 removeInterest, 
																			 validate = false
																		 }) {
  return (
    <div>
			<div className="space-y-4">
				<div className="flex gap-2">
					<Input
						placeholder="Например: фронтенд"
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					<Button type="button" onClick={addInterest} className="py-2">Добавить</Button>
				</div>

				<div className="flex flex-wrap gap-2">
					{interests.map((item, i) => (
						<TagHandler key={i} title={item} onDelete={() => removeInterest(i)}/>
					))}
				</div>

				{interests.length === 0 && validate && (
					<div className="text-sm text-red-500">Добавьте хотя бы один интерес</div>
				)}
			</div></div>
  );
  
}