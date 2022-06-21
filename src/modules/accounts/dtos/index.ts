export interface ICreatePostDTO {
  user_id: string;
  yt_url: string;
  is_private?: boolean;
  is_active?: boolean;
  title: string;
  description: string;
}
