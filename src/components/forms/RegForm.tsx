'use client'

import { useState } from 'react'
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card'
import {
	Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/api/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { siteConfig } from "@/config/site.config"
import { useAuth } from "@/providers/AuthProvider"
import SetInterests from '@/components/forms/SetInterests'
import YandexButton from '@/components/utils/YandexButton'

const formSchema = z.object({
	email: z.string().email("Укажите корректный email"),
	password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
})

export default function RegForm() {
	const { push } = useRouter()
	const { setToken, tokenUpdate } = useAuth()

	const [interests, setInterestsState] = useState<string[]>([])
	const [value, setValue] = useState("")
	const [interestsValidate, setInterestsValidate] = useState(false)
	
	const setInterests = (items: string[], validate = false) => {
		setInterestsState(items)
	}

	const addInterest = () => {
		const v = value.trim()
		if (!v) return

		const updated = [...interests, v]
		setInterests(updated, true)             // <-- validate = true
		setValue("")
	}

	const removeInterest = (i: number) => {
		const updated = interests.filter((_, idx) => idx !== i)
		setInterests(updated, true)           
		if (updated.length === 0) setInterestsValidate(true)
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: '', password: '' },
		mode: 'onChange',
	})

	const { mutateAsync: registerFn } = useMutation({
		mutationFn: async (data: z.infer<typeof formSchema>) =>
			await api.post('/v1/auth/register', {
				email: data.email,
				password: data.password,
				interests: interests, // TODO backend
			}),

		onSuccess: () => {
			toast("Успешная регистрация")
			push('/home')
		},
		onError: () => toast("Ошибка регистрации")
	})

	async function onSubmit(data: z.infer<typeof formSchema>) {
		if (interests.length === 0) setInterestsValidate(true)
		await registerFn(data)
			.then(response => {
				console.log("response")
				console.log(response)
				const accessToken = response.data.access;
				console.log(accessToken)
				if (accessToken) {
					setToken(accessToken);
					tokenUpdate();
				}
			})
			.catch(err => {
				if (err.status === 409) toast("Email уже зарегистрирован");
			})
	}

	return (
		<div className="px-2 w-full md:w-auto">
			<Card className='w-auto md:w-[475px]'>

				<CardHeader>
					<CardDescription className='mb-2 text-sm'>
						<Link href='/' className='flex items-center gap-1'>
							<ArrowLeft className='stroke-black dark:stroke-white' width={16} height={16}/>
							<p>Назад</p>
						</Link>
					</CardDescription>

					<CardTitle className='mb-4'>Регистрация</CardTitle>
					<CardDescription className='text-sm text-gray-400'>
						{siteConfig.description}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={(e) => {
							console.log("form submit event fired");
							return form.handleSubmit(onSubmit)(e);
						}} id='reg-form'>
							<div className='flex flex-col gap-4'>

								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder='Введите email' {...field} />
											</FormControl>
											<FormMessage/>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Пароль</FormLabel>
											<FormControl>
												<Input type="password" placeholder='Введите пароль' {...field}/>
											</FormControl>
											<FormMessage/>
										</FormItem>
									)}
								/>

								<div>
									<div className="text-sm text-gray-700 mb-2">
										Укажите ваши интересы (Python, бэкенд, дизайн и т.д.)
									</div>

									<SetInterests
										value={value}
										setValue={setValue}
										interests={interests}
										addInterest={addInterest}
										removeInterest={removeInterest}
										validate={interestsValidate}
									/>
								</div>

							</div>

							
						</form>
					</Form>
				</CardContent>

				<CardFooter className='flex flex-col gap-2 pt-3'>
					<button type='submit'
									form='reg-form'
									className='w-full bg-[var(--main-color)] hover:bg-yellow-500 transition text-black px-5 py-3 rounded-xl text-sm font-medium'>
						Зарегистрироваться
					</button>
					<div className="flex w-full justify-center items-center gap-2">
						<div className={'w-[40%] h-[1px] bg-gray-300'}></div>
						<div className="mx-4 mt-[-4px]">или</div>
						<div className={'w-[40%] h-[1px] bg-gray-300'}></div>
					</div>
					<YandexButton />
				</CardFooter>

			</Card>
		</div>
	)
}
