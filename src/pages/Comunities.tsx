import { useState, useRef, useEffect } from 'react';

interface Video {
  id: string;
  url: string;
  username: string;
  caption: string;
  likes: number;
  comments: number;
}

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
}

export const Comunities = () => {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      url: '/src/assets/video2.mp4',
      username: '@user1',
      caption: 'Check out this amazing view! #travel #adventure',
      likes: 1245,
      comments: 89,
    },
    {
      id: '2',
      url: '/src/assets/video3.mp4',
      username: '@user2',
      caption: 'New dance challenge 💃 #trending #dance',
      likes: 5432,
      comments: 321,
    },
    {
      id: '3',
      url: '/src/assets/video4.mp4',
      username: '@user3',
      caption: 'Cooking my favorite recipe! #food #cooking',
      likes: 876,
      comments: 54,
    },
    {
      id: '4',
      url: '/src/assets/video5.mp4',
      username: '@user4',
      caption: 'Just a day in my life #vlog #daily',
      likes: 2345,
      comments: 123,
    },
  ]);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set()); // Videos start with sound ON
  const [showComments, setShowComments] = useState<string | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fakeComments: Record<string, Comment[]> = {
    '1': [
      { id: 'c1', username: '@traveler22', text: 'This place looks amazing! Where is it?', timestamp: '2h ago' },
      { id: 'c2', username: '@adventureseeker', text: 'Adding this to my bucket list 😍', timestamp: '1h ago' },
      { id: 'c3', username: '@photoexpert', text: 'The lighting in this video is perfect!', timestamp: '45m ago' },
    ],
    '2': [
      { id: 'c1', username: '@dancepro', text: 'Your moves are fire! 🔥', timestamp: '3h ago' },
      { id: 'c2', username: '@musiclover', text: 'What\'s the name of this song?', timestamp: '2h ago' },
      { id: 'c3', username: '@trendsetter', text: 'I\'m definitely trying this challenge!', timestamp: '1h ago' },
      { id: 'c4', username: '@dancer101', text: 'Can you do a tutorial?', timestamp: '30m ago' },
    ],
    '3': [
      { id: 'c1', username: '@foodie', text: 'This looks delicious! Recipe please?', timestamp: '5h ago' },
      { id: 'c2', username: '@chef_mark', text: 'Pro tip: add a bit of lemon zest for extra flavor', timestamp: '3h ago' },
    ],
    '4': [
      { id: 'c1', username: '@lifestyle', text: 'Your daily routine is so inspiring!', timestamp: '4h ago' },
      { id: 'c2', username: '@minimalist', text: 'Love your space! So clean and organized.', timestamp: '2h ago' },
      { id: 'c3', username: '@curious_mind', text: 'What camera do you use for your vlogs?', timestamp: '1h ago' },
    ],
  };

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const videoIndex = parseInt(video.dataset.index || '0');

          if (entry.isIntersecting) {
            setCurrentVideoIndex(videoIndex);
            video.play().catch(err => console.error('Video play error:', err));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    videoRefs.current.forEach((videoRef) => {
      if (videoRef) {
        observerRef.current?.observe(videoRef);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [videos]);

  const handleVideoRef = (element: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = element;
  };

  const handleLike = (videoId: string) => {
    const newLikedVideos = new Set(likedVideos);
    if (newLikedVideos.has(videoId)) {
      newLikedVideos.delete(videoId);
      setVideos(
        videos.map((video) =>
          video.id === videoId ? { ...video, likes: video.likes - 1 } : video
        )
      );
    } else {
      newLikedVideos.add(videoId);
      setVideos(
        videos.map((video) =>
          video.id === videoId ? { ...video, likes: video.likes + 1 } : video
        )
      );
    }
    setLikedVideos(newLikedVideos);
  };

  const handleScroll = (direction: 'up' | 'down') => {
    const newIndex = direction === 'down' 
      ? Math.min(currentVideoIndex + 1, videos.length - 1)
      : Math.max(currentVideoIndex - 1, 0);
    
    setCurrentVideoIndex(newIndex);
    videoRefs.current[newIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    setShowComments(null);
  };

  const toggleMute = (videoId: string) => {
    const newMutedVideos = new Set(mutedVideos);
    const videoIndex = videos.findIndex(v => v.id === videoId);
    const videoElement = videoRefs.current[videoIndex];

    if (newMutedVideos.has(videoId)) {
      newMutedVideos.delete(videoId);
      if (videoElement) videoElement.muted = false;
    } else {
      newMutedVideos.add(videoId);
      if (videoElement) videoElement.muted = true;
    }

    setMutedVideos(newMutedVideos);
  };

  const toggleComments = (videoId: string) => {
    setShowComments(showComments === videoId ? null : videoId);
  };

  return (
    <div className="pt-2 pb-20 bg-black text-white min-h-screen relative">
      <div
        ref={containerRef}
        className="relative mx-auto overflow-y-scroll snap-y snap-mandatory scrollbar-hide 
                   sm:h-screen sm:max-w-full sm:pt-0 
                   md:h-[85vh] md:max-w-md md:pt-8"
      >
        {videos.map((video, index) => (
          <div key={video.id} className="h-screen sm:h-screen md:h-full w-full snap-start snap-always relative">
            <video
              ref={(el) => handleVideoRef(el, index)}
              data-index={index}
              src={video.url}
              loop
              muted={mutedVideos.has(video.id)}
              playsInline
              className="h-full w-full object-cover rounded-xl"
            />

            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3">
                  {video.username.charAt(1).toUpperCase()}
                </div>
                <span className="font-semibold">{video.username}</span>
              </div>
              <p className="mb-4">{video.caption}</p>
            </div>

            {/* Right Controls */}
            <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
              {/* Mute */}
              <button onClick={() => toggleMute(video.id)} className="flex flex-col items-center">
                {mutedVideos.has(video.id) ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                    <span className="text-sm">Unmute</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span className="text-sm">Mute</span>
                  </>
                )}
              </button>

              {/* Like */}
              <button onClick={() => handleLike(video.id)} className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-8 w-8 ${likedVideos.has(video.id) ? 'text-red-500 fill-red-500' : 'text-white'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm">{video.likes}</span>
              </button>

              {/* Comments */}
              <button onClick={() => toggleComments(video.id)} className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${showComments === video.id ? 'text-blue-400' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm">{video.comments}</span>
              </button>
            </div>

            {/* Comments */}
            {showComments === video.id && (
              <div className="absolute inset-0 bg-black/90 z-20 overflow-y-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Comments</h3>
                  <button onClick={() => setShowComments(null)} className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  {fakeComments[video.id]?.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold">
                        {comment.username.charAt(1).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{comment.username}</div>
                        <p className="text-gray-300 text-sm">{comment.text}</p>
                        <span className="text-xs text-gray-400">{comment.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scroll Controls */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-4 z-30">
        <button
          onClick={() => handleScroll('up')}
          disabled={currentVideoIndex === 0}
          className={`p-2 rounded-full bg-white/20 ${currentVideoIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30 active:bg-white/40'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => handleScroll('down')}
          disabled={currentVideoIndex === videos.length - 1}
          className={`p-2 rounded-full bg-white/20 ${currentVideoIndex === videos.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/30 active:bg-white/40'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
