
import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ChatIcon } from './icons/ChatIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { enhancePost } from '../services/geminiService';
import { ShareIcon } from './icons/ShareIcon';
import { useApiKey } from '../contexts/ApiKeyContext';

interface Post {
    author: string;
    avatar: string;
    content: string;
    likes: number;
    comments: number;
    time: string;
}

const initialPosts: Post[] = [
    {
        author: 'ScentedSoul',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        content: 'Just discovered Midnight Oud by Nocturne and it’s a game-changer for evening events. So deep and mysterious! Has anyone else tried it?',
        likes: 128,
        comments: 15,
        time: '2h ago'
    },
    {
        author: 'FragranceFanatic',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
        content: 'My Perfume Diary entry for this month is live! I explored the world of citrus scents. Come read about my journey with Citrus Riviera and other zesty favorites! 🍋',
        likes: 94,
        comments: 22,
        time: '1d ago'
    },
    {
        author: 'PerfumePixel',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
        content: 'Seeking recommendations for a long-lasting floral perfume for my wedding. Something romantic but not overpowering. Any ideas?',
        likes: 210,
        comments: 48,
        time: '3d ago'
    }
];

const CommunityHub: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [newPost, setNewPost] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { resetApiKey } = useApiKey();

    const handleAiAssist = async () => {
        if (!newPost.trim()) return;
        setIsAiLoading(true);
        setError(null);
        try {
            const enhancedText = await enhancePost(newPost);
            setNewPost(enhancedText);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred with AI Assist.";
             if (errorMessage === 'Invalid API key') {
                resetApiKey();
                setError("AI Assist failed due to an API key issue. Please select a valid key.");
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSubmitPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        const post: Post = {
            author: 'You',
            avatar: 'https://i.pravatar.cc/150?u=currentUser',
            content: newPost,
            likes: 0,
            comments: 0,
            time: 'Just now'
        };
        setPosts([post, ...posts]);
        setNewPost('');
    };

    const handleShare = async (post: Post) => {
        const shareData = {
            title: `A post by ${post.author} on FragranceVerse`,
            text: post.content,
            url: window.location.href, // Use current URL as a placeholder
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Error sharing post:', error);
                // User might have cancelled the share, so no alert needed.
            }
        } else {
            // Fallback for browsers without the Web Share API
            try {
                await navigator.clipboard.writeText(`${shareData.title}\n\n"${shareData.text}"`);
                alert('Post content copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy to clipboard:', err);
                alert('Sharing is not supported in your browser.');
            }
        }
    };

    return (
        <div className="py-16 md:py-24 bg-pearl-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-deep-taupe">Community Hub</h1>
                    <p className="mt-4 text-lg text-deep-taupe/80 max-w-3xl mx-auto">Connect with fellow fragrance lovers, share your collection, and join the conversation.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-8">
                    {/* New Post Form */}
                    <div className="bg-white/70 p-6 rounded-xl shadow-lg border border-champagne-gold/40">
                        <form onSubmit={handleSubmitPost}>
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="Share your scent story..."
                                rows={3}
                                className="w-full p-3 border border-champagne-gold rounded-lg focus:ring-2 focus:ring-rose-hue focus:border-rose-hue transition-colors duration-300 bg-pearl-white"
                            />
                            <div className="flex justify-end items-center mt-3 space-x-4">
                                <button
                                    type="button"
                                    onClick={handleAiAssist}
                                    disabled={isAiLoading || !newPost.trim()}
                                    className="flex items-center space-x-2 text-sm text-deep-taupe hover:text-rose-hue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <SparklesIcon className={`w-5 h-5 ${isAiLoading ? 'animate-pulse' : ''}`} />
                                    <span>{isAiLoading ? 'Enhancing...' : 'AI Assist'}</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newPost.trim()}
                                    className="bg-deep-taupe text-pearl-white font-bold py-2 px-6 rounded-full font-sans hover:bg-rose-hue hover:text-deep-taupe transition-all duration-300 disabled:bg-gray-400"
                                >
                                    Post
                                </button>
                            </div>
                        </form>
                        {error && <p className="text-center text-red-600 mt-2 text-sm">{error}</p>}
                    </div>

                    {/* Posts Feed */}
                    {posts.map((post, index) => (
                        <div key={index} className="bg-white/70 p-6 rounded-xl shadow-lg border border-champagne-gold/40">
                            <div className="flex items-start space-x-4">
                                <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
                                <div className="flex-1">
                                    <div className="flex items-baseline justify-between">
                                        <p className="font-bold font-sans text-deep-taupe">{post.author}</p>
                                        <p className="text-xs text-deep-taupe/60">{post.time}</p>
                                    </div>
                                    <p className="mt-2 text-deep-taupe/90 whitespace-pre-wrap">{post.content}</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-champagne-gold/50 flex items-center space-x-6 text-deep-taupe/70">
                                <button className="flex items-center space-x-2 hover:text-rose-hue transition-colors">
                                    <HeartIcon className="w-5 h-5" />
                                    <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center space-x-2 hover:text-rose-hue transition-colors">
                                    <ChatIcon className="w-5 h-5" />
                                    <span>{post.comments} Comments</span>
                                </button>
                                <button
                                    onClick={() => handleShare(post)}
                                    className="flex items-center space-x-2 hover:text-rose-hue transition-colors"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityHub;
