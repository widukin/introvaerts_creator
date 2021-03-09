import { apiBaseURL } from '../config/api.config';

//users
export const loginEndpoint = `${apiBaseURL}/users/login`;
export const createUserEndpoint = `${apiBaseURL}/users/create`;
export const getUsersAccountEndpoint = `${apiBaseURL}/users/account`;
//subdomain
export const createSubdomainEndpoint = `${apiBaseURL}/subdomains/create`;
export const getSubdomainEndpoint = `${apiBaseURL}/subdomains/:subdomainId`;
//gallery & images
export const createGalleryEndpoint = `${apiBaseURL}/galleries/create`;
export const uploadImageEndpoint = `${apiBaseURL}/images/upload`;
