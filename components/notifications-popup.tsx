'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Shield, ShieldAlert, Package, MessageCircle, Image as ImageIcon, Heart, AlertCircle, CheckCircle, XCircle, Truck, Gift, CreditCard } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: string;
  userName?: string;
  message: string;
  time: string;
  avatar?: string;
  thumbnail?: string;
  thumbnailColor?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  read: boolean;
}

const mockNotifications: Notification[] = [
  // Today section
  {
    id: '1',
    type: 'like',
    userName: '@SophiaBennett and 30 others',
    message: 'liked your post',
    time: '1h ago',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnail: 'https://images.pexels.com/photos/1122639/pexels-photo-1122639.jpeg?auto=compress&cs=tinysrgb&w=100',
    read: false,
  },
  {
    id: '2',
    type: 'like',
    userName: '@SophiaBennett',
    message: 'liked your post',
    time: '2h ago',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnail: 'https://images.pexels.com/photos/1122639/pexels-photo-1122639.jpeg?auto=compress&cs=tinysrgb&w=100',
    read: false,
  },
  {
    id: '3',
    type: 'follow',
    userName: '@EthanCarter',
    message: 'followed',
    time: '3h ago',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    action: {
      label: 'Follow Back',
      onClick: () => console.log('Follow back'),
    },
    read: false,
  },
  {
    id: '4',
    type: 'follow',
    userName: '@EthanCarter and 30 others',
    message: 'followed you',
    time: '4h ago',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100',
    read: false,
  },
  {
    id: '5',
    type: 'comment',
    userName: '@ZhaoDerek',
    message: 'commented on your post: «This post is fire 🔥»',
    time: '5h ago',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnailColor: 'bg-teal-500',
    read: false,
  },
  {
    id: '6',
    type: 'comment',
    userName: '@OliviaMartinez',
    message: 'mentioned you and says: «@Host See this ????»',
    time: '6h ago',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnailColor: 'bg-blue-500',
    read: false,
  },
  {
    id: '7',
    type: 'tag',
    userName: '@JameThee',
    message: 'mentioned you in a post: «@Host See this ????»',
    time: '7h ago',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnail: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=100',
    read: false,
  },
  {
    id: '8',
    type: 'story',
    userName: '@Chris',
    message: 'added a new story',
    time: '8h ago',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnailColor: 'bg-teal-600',
    read: false,
  },
  {
    id: '9',
    type: 'like',
    userName: '@AveryHarper',
    message: 'shared your post',
    time: '9h ago',
    avatar: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnailColor: 'bg-amber-500',
    read: false,
  },
  {
    id: '10',
    type: 'report',
    userName: '@AveryHarper',
    message: 'reported your post',
    time: '10h ago',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnailColor: 'bg-red-500',
    read: false,
  },
  {
    id: '11',
    type: 'request',
    userName: '@John',
    message: 'wants to be accepted your follow request',
    time: '11h ago',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
    read: false,
  },
  {
    id: '12',
    type: 'follow',
    userName: '@John',
    message: 'wants sent you a follow/unfollow request',
    time: '12h ago',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100',
    action: {
      label: 'Confirm',
      onClick: () => console.log('Confirm'),
    },
    read: false,
  },
  {
    id: '13',
    type: 'reminder',
    message: 'Time to post something new!',
    time: '1h ago',
    read: false,
  },
  {
    id: '14',
    type: 'certification-success',
    message: 'Congratulations, your certification has been successfully approved.',
    time: '1h ago',
    read: false,
  },
  {
    id: '15',
    type: 'certification-denied',
    message: 'We regret to inform you that your certification request has been denied.',
    time: '1h ago',
    read: false,
  },
  // Yesterday section
  {
    id: '16',
    type: 'comment',
    userName: '@NoahLittle',
    message: 'replied to you comment: «@Host See this ????»',
    time: '1 day ago',
    avatar: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnailColor: 'bg-teal-500',
    read: true,
  },
  {
    id: '17',
    type: 'comment',
    userName: '@NoahLittle',
    message: 'replied to you comment: «@Host See this ????»',
    time: '1 day ago',
    avatar: 'https://images.pexels.com/photos/874158/pexels-photo-874158.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnail: 'https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=100',
    read: true,
  },
  {
    id: '18',
    type: 'post',
    userName: '@EthanLi',
    message: 'posted a new post',
    time: '1 day ago',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnail: 'https://images.pexels.com/photos/1346187/pexels-photo-1346187.jpeg?auto=compress&cs=tinysrgb&w=100',
    read: true,
  },
  {
    id: '19',
    type: 'profile',
    userName: '@LiamAnd3others',
    message: 'viewed your profile',
    time: '1 day ago',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100',
    read: true,
  },
  {
    id: '20',
    type: 'action',
    userName: '@NoahLittle',
    message: 'reacted your action',
    time: '1 day ago',
    avatar: 'https://images.pexels.com/photos/1139743/pexels-photo-1139743.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnailColor: 'bg-gray-400',
    read: true,
  },
  {
    id: '21',
    type: 'action',
    userName: '@NoahLittle',
    message: 'reported your action',
    time: '1 day ago',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    thumbnailColor: 'bg-gray-400',
    read: true,
  },
  // Order notifications
  {
    id: '22',
    type: 'order',
    message: 'Your order #78002136 is on the way',
    time: '2 hours ago',
    read: true,
  },
  {
    id: '23',
    type: 'order',
    message: 'Your order #78002135 cancelled',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '24',
    type: 'order',
    message: 'Your order #78002134 is processing',
    time: '4 hours ago',
    read: true,
  },
  {
    id: '25',
    type: 'order',
    message: 'Your order #78002133 returned',
    time: '5 hours ago',
    read: true,
  },
  {
    id: '26',
    type: 'order',
    message: 'Your order #78002132 shipped',
    time: '6 hours ago',
    read: true,
  },
  {
    id: '27',
    type: 'order',
    message: 'Your order #78002131 is ready to collect',
    time: '7 hours ago',
    read: true,
  },
  {
    id: '28',
    type: 'order',
    message: 'Your order #78002130 has been delivered',
    time: '8 hours ago',
    read: true,
  },
  {
    id: '29',
    type: 'order',
    message: 'Give a review to your order #78002129',
    time: '9 hours ago',
    read: true,
  },
  {
    id: '30',
    type: 'order',
    message: 'Give a review to your reservation #78002128',
    time: '10 hours ago',
    read: true,
  },
  {
    id: '31',
    type: 'order',
    message: 'You received $20 cashback',
    time: '1 day ago',
    read: true,
  },
  {
    id: '32',
    type: 'order',
    message: 'You are banned $20 affiliate reward',
    time: '2 days ago',
    read: true,
  },
  {
    id: '33',
    type: 'order',
    message: 'Your payment/shop been changed',
    time: '2 days ago',
    read: true,
  },
  {
    id: '34',
    type: 'order',
    message: 'You received a level repeat #42345. Check the outcome',
    time: '3 days ago',
    read: true,
  },
  {
    id: '35',
    type: 'order',
    message: 'Your reservation #123456 is cancelled',
    time: '3 days ago',
    read: true,
  },
  {
    id: '36',
    type: 'order',
    message: 'Your reservation #789012 is returned',
    time: '4 days ago',
    read: true,
  },
  {
    id: '37',
    type: 'order',
    message: 'Your reservation #789013 shipped',
    time: '5 days ago',
    read: true,
  },
  {
    id: '38',
    type: 'order',
    message: 'Give a review to your order #789014',
    time: '6 days ago',
    read: true,
  },
  {
    id: '39',
    type: 'order',
    message: 'You received a new order',
    time: '7 hours ago',
    read: true,
  },
  {
    id: '40',
    type: 'order',
    message: 'You received a new reservation',
    time: '7 hours ago',
    read: true,
  },
  {
    id: '41',
    type: 'order',
    message: 'You received a new reservation',
    time: '7 hours ago',
    read: true,
  },
  {
    id: '42',
    type: 'order',
    message: 'You received $20 cashback',
    time: '2 days ago',
    read: true,
  },
  {
    id: '43',
    type: 'order',
    message: 'You are banned $20 affiliate reward',
    time: '2 days ago',
    read: true,
  },
  {
    id: '44',
    type: 'order',
    message: 'Your payment/Shop been changed',
    time: '2 days ago',
    read: true,
  },
  {
    id: '45',
    type: 'order',
    message: 'You received a level repeat #12345. Check the outcome',
    time: '3 days ago',
    read: true,
  },
  {
    id: '46',
    type: 'order',
    message: 'Check the new features and explore it now!',
    time: '3 days ago',
    read: true,
  },
  {
    id: '47',
    type: 'order',
    message: 'Your reservation #789012 is cancelled',
    time: '3 days ago',
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'reminder':
      return <Clock className="w-5 h-5 text-gray-600" />;
    case 'certification-success':
      return <Shield className="w-5 h-5 text-emerald-600" />;
    case 'certification-denied':
      return <ShieldAlert className="w-5 h-5 text-gray-600" />;
    case 'order':
      return <Package className="w-5 h-5 text-gray-600" />;
    default:
      return null;
  }
};

export function NotificationsPopup() {
  const [notifications] = useState<Notification[]>(mockNotifications);

  const todayNotifications = notifications.filter((n) => !n.time.includes('day'));
  const yesterdayNotifications = notifications.filter((n) => n.time.includes('day'));

  return (
    <div className="w-96 bg-white rounded-lg shadow-lg border">
      <div className="px-4 py-3 border-b">
        <h3 className="font-semibold text-base text-center">Notifications</h3>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="py-2">
          {/* Today Section */}
          <div className="px-4 py-2">
            <h4 className="text-xs font-semibold text-gray-900">Today</h4>
          </div>

          {todayNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0 ${
                !notification.read ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {notification.avatar ? (
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>{notification.userName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 leading-relaxed">
                    {notification.userName && (
                      <span className="font-semibold">{notification.userName}</span>
                    )}
                    {notification.userName && ' '}
                    <span className={notification.userName ? 'text-gray-700' : 'text-gray-900'}>
                      {notification.message}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                </div>

                {notification.thumbnail && (
                  <div className="flex-shrink-0">
                    <img
                      src={notification.thumbnail}
                      alt=""
                      className="w-10 h-10 rounded object-cover"
                    />
                  </div>
                )}

                {notification.thumbnailColor && (
                  <div className={`flex-shrink-0 w-10 h-10 rounded ${notification.thumbnailColor}`} />
                )}

                {notification.action && (
                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-3 text-gray-700 hover:bg-gray-100"
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Yesterday Section */}
          <div className="px-4 py-2 mt-2">
            <h4 className="text-xs font-semibold text-gray-900">Yesterday</h4>
          </div>

          {yesterdayNotifications.map((notification) => (
            <div
              key={notification.id}
              className="px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {notification.avatar ? (
                    <Avatar className="w-9 h-9">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>{notification.userName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 leading-relaxed">
                    {notification.userName && (
                      <span className="font-semibold">{notification.userName}</span>
                    )}
                    {notification.userName && ' '}
                    <span className={notification.userName ? 'text-gray-700' : 'text-gray-900'}>
                      {notification.message}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                </div>

                {notification.thumbnail && (
                  <div className="flex-shrink-0">
                    <img
                      src={notification.thumbnail}
                      alt=""
                      className="w-10 h-10 rounded object-cover"
                    />
                  </div>
                )}

                {notification.thumbnailColor && (
                  <div className={`flex-shrink-0 w-10 h-10 rounded ${notification.thumbnailColor}`} />
                )}

                {notification.action && (
                  <div className="flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-3 text-gray-700 hover:bg-gray-100"
                      onClick={notification.action.onClick}
                    >
                      {notification.action.label}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
