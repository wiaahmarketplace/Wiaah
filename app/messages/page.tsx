'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Edit3, Image, Smile, Mic, Send, X, Reply } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Header } from '@/components/header';
import { VoiceMessage } from '@/components/message-voice';
import { ImageMessage } from '@/components/message-image';
import { EmojiMessage } from '@/components/message-emoji';
import { SharedPost } from '@/components/message-shared-post';
import { MessageReactions } from '@/components/message-reactions';

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'other';
  type: 'text' | 'voice' | 'image' | 'emoji' | 'shared_post' | 'shared_story';
  content?: string;
  mediaUrl?: string;
  mediaDuration?: number;
  sharedContent?: {
    id: string;
    type: 'post' | 'story';
    thumbnail: string;
    username: string;
    userAvatar: string;
    caption?: string;
  };
  time: string;
  reactions: Reaction[];
  replyTo?: Message;
}

interface Conversation {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
}

const conversations: Conversation[] = [
  {
    id: '1',
    username: 'z.beatz',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    lastMessage: 'Sent you the file 🚀',
    time: '14:08',
    unread: true
  },
  {
    id: '2',
    username: 'Liam Carter',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    lastMessage: 'Sure thing 👍',
    time: '14:08',
    unread: false
  },
  {
    id: '3',
    username: 'Emily Davis',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    lastMessage: 'See you tomorrow!',
    time: '13:45',
    unread: false
  },
  {
    id: '4',
    username: 'James Wilson',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    lastMessage: 'Did you check out the new collection?',
    time: '12:30',
    unread: false
  },
  {
    id: '5',
    username: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    lastMessage: 'That sounds great!',
    time: 'Yesterday',
    unread: false
  }
];

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'other',
    type: 'text',
    content: 'Hey, check this out',
    time: '14:08',
    reactions: []
  },
  {
    id: '2',
    sender: 'user',
    type: 'text',
    content: 'Looks great!',
    time: '14:08',
    reactions: [{ emoji: '❤️', count: 1, userReacted: false }]
  },
  {
    id: '3',
    sender: 'other',
    type: 'voice',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    mediaDuration: 45,
    time: '14:09',
    reactions: [{ emoji: '👍', count: 1, userReacted: true }]
  },
  {
    id: '4',
    sender: 'user',
    type: 'image',
    mediaUrl: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: 'Check out this amazing view!',
    time: '14:10',
    reactions: [
      { emoji: '🔥', count: 2, userReacted: false },
      { emoji: '😮', count: 1, userReacted: false }
    ]
  },
  {
    id: '5',
    sender: 'other',
    type: 'emoji',
    content: '🎉',
    time: '14:11',
    reactions: []
  },
  {
    id: '6',
    sender: 'user',
    type: 'shared_post',
    sharedContent: {
      id: '1',
      type: 'post',
      thumbnail: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=800',
      username: 'johndoe',
      userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      caption: 'This is the first sample comment. This is the first sample comment.'
    },
    time: '14:12',
    reactions: [{ emoji: '😂', count: 1, userReacted: false }]
  },
  {
    id: '7',
    sender: 'other',
    type: 'shared_story',
    sharedContent: {
      id: '2',
      type: 'story',
      thumbnail: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=800',
      username: 'janedoe',
      userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
    time: '14:13',
    reactions: []
  }
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'user',
        type: 'text',
        content: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: [],
        replyTo: replyingTo || undefined
      };
      setMessages([...messages, message]);
      setNewMessage('');
      setReplyingTo(null);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, userReacted: true }
                  : r
              ),
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, userReacted: true }],
            };
          }
        }
        return msg;
      })
    );
  };

  const handleUnreact = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: msg.reactions
              .map((r) =>
                r.emoji === emoji
                  ? { ...r, count: r.count - 1, userReacted: false }
                  : r
              )
              .filter((r) => r.count > 0),
          };
        }
        return msg;
      })
    );
  };

  const filteredConversations = conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getReplyPreview = (msg: Message) => {
    switch (msg.type) {
      case 'image':
        return '📷 Photo';
      case 'voice':
        return '🎤 Voice message';
      case 'emoji':
        return msg.content;
      case 'shared_post':
        return '📱 Shared post';
      case 'shared_story':
        return '📱 Shared story';
      default:
        return msg.content || '';
    }
  };

  const renderMessage = (message: Message) => {
    const baseContent = (
      <>
        {message.replyTo && (
          <div
            className={`mb-2 px-3 py-2 rounded-lg border-l-4 bg-gray-50 ${
              message.sender === 'user' ? 'border-gray-400' : 'border-emerald-500'
            }`}
          >
            <p className="text-xs text-gray-500 font-medium mb-1">
              {message.replyTo.sender === 'user' ? 'You' : selectedConversation?.username}
            </p>
            <p className="text-xs text-gray-700 line-clamp-1">
              {getReplyPreview(message.replyTo)}
            </p>
          </div>
        )}
      </>
    );

    switch (message.type) {
      case 'voice':
        return (
          <div className="flex flex-col">
            {baseContent}
            <VoiceMessage
              audioUrl={message.mediaUrl || ''}
              duration={message.mediaDuration || 0}
              isUser={message.sender === 'user'}
              time={message.time}
            />
          </div>
        );
      case 'image':
        return (
          <div className="flex flex-col">
            {baseContent}
            <ImageMessage
              imageUrl={message.mediaUrl || ''}
              caption={message.content}
              isUser={message.sender === 'user'}
              time={message.time}
            />
          </div>
        );
      case 'emoji':
        return (
          <div className="flex flex-col">
            {baseContent}
            <EmojiMessage
              emoji={message.content || ''}
              isUser={message.sender === 'user'}
              time={message.time}
            />
          </div>
        );
      case 'shared_post':
      case 'shared_story':
        return message.sharedContent ? (
          <div className="flex flex-col">
            {baseContent}
            <SharedPost
              postId={message.sharedContent.id}
              postType={message.sharedContent.type}
              thumbnail={message.sharedContent.thumbnail}
              username={message.sharedContent.username}
              userAvatar={message.sharedContent.userAvatar}
              caption={message.sharedContent.caption}
              isUser={message.sender === 'user'}
              time={message.time}
            />
          </div>
        ) : null;
      default:
        return (
          <div className="flex flex-col">
            <div
              className={`rounded-2xl px-4 py-2 max-w-md ${
                message.sender === 'user'
                  ? 'bg-gray-100 text-gray-900'
                  : 'bg-white text-gray-900 border'
              }`}
            >
              {baseContent}
              <p className="text-sm">{message.content}</p>
            </div>
            <span className="text-xs text-gray-500 mt-1">{message.time}</span>
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh-80px)] bg-white">
        <div className="w-[380px] border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Messages</h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100"
            >
              <Edit3 className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search reservation"
              className="pl-10 h-11 rounded-lg border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-gray-50' : ''
                }`}
              >
                <Avatar className="h-12 w-12 mt-1">
                  <AvatarImage src={conv.avatar} />
                  <AvatarFallback>{conv.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-semibold text-sm truncate ${conv.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {conv.username}
                    </p>
                    <span className="text-xs text-gray-500 ml-2">{conv.time}</span>
                  </div>
                  <p className={`text-sm truncate ${conv.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 p-6 border-b">
            <Avatar className="h-11 w-11">
              <AvatarImage src={selectedConversation.avatar} />
              <AvatarFallback>{selectedConversation.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-base">{selectedConversation.username}</p>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 max-w-4xl">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-3 group ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {message.sender === 'other' && (
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={selectedConversation.avatar} />
                      <AvatarFallback>{selectedConversation.username[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2">
                      {renderMessage(message)}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReply(message)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8 hover:bg-gray-100"
                      >
                        <Reply className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                    <MessageReactions
                      messageId={message.id}
                      reactions={message.reactions}
                      onReact={(emoji) => handleReact(message.id, emoji)}
                      onUnreact={(emoji) => handleUnreact(message.id, emoji)}
                      isUser={message.sender === 'user'}
                    />
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-6 border-t bg-white">
            {replyingTo && (
              <div className="mb-3 px-4 py-3 bg-gray-50 rounded-lg border-l-4 border-emerald-500 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Reply className="w-3 h-3 text-gray-500" />
                    <p className="text-xs font-medium text-gray-500">
                      Replying to {replyingTo.sender === 'user' ? 'yourself' : selectedConversation?.username}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-1">
                    {getReplyPreview(replyingTo)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelReply}
                  className="h-6 w-6 rounded-full hover:bg-gray-200"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            )}
            <div className="flex items-center gap-3 bg-gray-50 rounded-full px-5 py-3">
              <Input
                type="text"
                placeholder={replyingTo ? "Write a reply..." : "Write a message..."}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-gray-200">
                <Image className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-gray-200">
                <Smile className="w-5 h-5 text-gray-600" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-gray-200">
                <Mic className="w-5 h-5 text-gray-600" />
              </Button>
              <Button
                onClick={handleSendMessage}
                className="rounded-full bg-emerald-500 hover:bg-emerald-600 h-9 w-9 p-0"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a conversation to start messaging</p>
        </div>
      )}
      </div>
    </>
  );
}
