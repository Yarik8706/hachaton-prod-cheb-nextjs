export const YANDEX_AUTH_URL = 
	'https://oauth.yandex.ru/authorize'
export const CLIENT_ID =
	process.env.NODE_ENV == "development" ? 
		'679044d16dd841aeaa587f6775a0dc64' :
		process.env.CLIENT_ID

export const HOME_URL = "/home"