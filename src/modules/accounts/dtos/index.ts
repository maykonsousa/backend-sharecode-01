export interface ICreatePostDTO {
  user_id: string;
  video_id: string;
  is_private?: boolean;
  is_active?: boolean;
  title: string;
  description: string;
}
