// YouTube utility functions for video handling
export interface YouTubeVideoInfo {
  videoId: string;
  isValid: boolean;
  error?: string;
}

/**
 * Extract YouTube video ID from various URL formats
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Validate YouTube URL and return video info
 */
export const validateYouTubeUrl = (url: string): YouTubeVideoInfo => {
  if (!url || typeof url !== 'string') {
    return {
      videoId: '',
      isValid: false,
      error: 'No URL provided'
    };
  }

  // Check if it's a YouTube URL
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
    return {
      videoId: '',
      isValid: false,
      error: 'Not a valid YouTube URL'
    };
  }

  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return {
      videoId: '',
      isValid: false,
      error: 'Could not extract video ID from URL'
    };
  }

  return {
    videoId,
    isValid: true
  };
};

/**
 * Generate YouTube embed URL with proper parameters
 */
export const generateYouTubeEmbedUrl = (videoId: string): string => {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    origin: window.location.origin
  });
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Get YouTube video thumbnail URL
 */
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'hq'): string => {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}; 