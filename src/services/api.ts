import { authApi, publicApi } from './http';
import type { ApiResponse, CreateRestaurantInput, EntityId, Restaurant, UpdateRestaurantInput } from '../types';

// 맛집과 제보는 서버 API로 저장하고, 좋아요는 브라우저에서 관리합니다.
export { submissionAPI } from './submissionApi';
export const restaurantAPI = {
  getRestaurants: async (): Promise<ApiResponse<Restaurant[]>> =>
    (await publicApi.get('/api/restaurants')).data,
  getRestaurantById: async (id: EntityId): Promise<ApiResponse<Restaurant>> =>
    (await publicApi.get(`/api/restaurants/${id}`)).data,
  getPopularRestaurants: async (): Promise<ApiResponse<Restaurant[]>> =>
    (await publicApi.get('/api/restaurants/popular')).data,
  createRestaurant: async (payload: CreateRestaurantInput): Promise<ApiResponse<Restaurant>> =>
    (await authApi.post('/api/restaurants', payload)).data,
  updateRestaurant: async (id: EntityId, payload: UpdateRestaurantInput): Promise<ApiResponse<Restaurant>> =>
    (await authApi.put(`/api/restaurants/${id}`, payload)).data,
  // 204 응답에는 JSON 본문이 없습니다. HTTP 상태만 반환합니다.
  deleteRestaurant: async (id: EntityId): Promise<number> =>
    (await authApi.delete(`/api/restaurants/${id}`)).status,
};
export default restaurantAPI;
