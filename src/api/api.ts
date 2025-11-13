"use client"

import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NODE_ENV == 'development' ? 'https://team-24-s53axywr.hack.prodcontest.ru' : '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: process.env.NODE_ENV != 'development'
})

api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken')

  const authFreeEndpoints = ['/api/v1/auth/login', '/api/v1/auth/register']
  
  if (config.url){
    config.url = config.url.replace("home/", "")
  }
  
  if (
    config.headers &&
    accessToken &&
    !authFreeEndpoints.some(endpoint => config.url?.includes(endpoint))
  ) {
    config.headers.Authorization = `Bearer ${accessToken}`
  } 

  return config
})
