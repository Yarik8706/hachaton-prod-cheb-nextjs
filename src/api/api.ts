"use client"

import axios from 'axios'

export const api = axios.create({
  baseURL: 
    process.env.NODE_ENV == 'development' ? 'https://8000:8000/' : '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: process.env.NODE_ENV != 'development'
})

api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem('accessToken')

  const authFreeEndpoints = ['/v1/auth/login', '/v1/auth/register']
  
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
