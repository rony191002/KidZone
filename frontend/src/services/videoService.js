// src/services/videoService.js
import api from "./api";

// Get all videos for kids
export const getVideosForKids = async () => {
  const res = await api.get("/kids/videos");
  return res.data;
};

// Upload a new video (for creators)
export const uploadVideo = async (formData) => {
  const res = await api.post("/creators/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get videos by a specific creator (if you need this on CreatorPage)
export const getCreatorVideos = async (creatorId) => {
  const res = await api.get(`/creators/${creatorId}/videos`);
  return res.data;
};
